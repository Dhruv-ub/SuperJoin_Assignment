import os
import shutil
from pathlib import Path
from typing import Optional, List
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from backend.config import (
    RUNTIME_CONFIG,
    get_api_key,
    set_api_key,
    get_model,
    set_model,
    UPLOADS_DIR,
    STARTER_DATASETS_DIR
)
from backend.models import (
    Fact,
    FactRelation,
    ShowcaseCase,
    DocumentInfo
)
from backend.extractor import PDFExtractor, GeminiEngine

app = FastAPI(
    title="Superjoin Fact Knowledge Layer API",
    description="Cross-document fact extraction, grounding, and reconciliation engine",
    version="2.0.0"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory session state for uploaded documents and extracted facts
SESSION_STATE = {
    "documents": [],
    "facts": [],
    "relations": [],
    "showcase_cases": [],
    "statistics": {
        "total_documents": 0,
        "total_pages": 0,
        "total_facts": 0,
        "total_relations": 0
    }
}

class ApiKeyPayload(BaseModel):
    api_key: str
    model: Optional[str] = "gemini-3.6-flash"

class ProcessPayload(BaseModel):
    max_pages_per_doc: int = 15

@app.get("/api/health")
async def health_check():
    api_key = get_api_key()
    return {
        "status": "healthy",
        "api_key_configured": bool(api_key),
        "model": get_model(),
        "free_tier": "Google AI Studio Free Tier (15 RPM, 1M TPM, 1,500 RPD)"
    }

@app.post("/api/config/api-key")
async def configure_api_key(payload: ApiKeyPayload):
    if payload.api_key is not None:
        set_api_key(payload.api_key)
    if payload.model:
        set_model(payload.model)
    return {
        "success": True,
        "model": get_model(),
        "api_key_configured": bool(get_api_key())
    }

@app.get("/api/results")
async def get_results():
    return SESSION_STATE

@app.post("/api/upload")
async def upload_pdf(files: List[UploadFile] = File(...)):
    """
    Accepts one or multiple uploaded PDF files and adds them to the session.
    """
    uploaded_docs = []
    for f in files:
        if not f.filename.lower().endswith(".pdf"):
            continue

        file_path = UPLOADS_DIR / f.filename
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(f.file, buffer)

        info = PDFExtractor.inspect_pdf(str(file_path))
        if info["success"]:
            # Check if already added
            existing = [d for d in SESSION_STATE["documents"] if d.id == f.filename]
            if not existing:
                doc_info = DocumentInfo(
                    id=f.filename,
                    filename=f.filename,
                    title=f.filename.replace("-", " ").replace(".pdf", "").title(),
                    dataset="uploaded",
                    page_count=info["pages_count"],
                    size_mb=info["size_mb"],
                    description=f"Uploaded PDF with {info['pages_count']} pages."
                )
                SESSION_STATE["documents"].append(doc_info)
                uploaded_docs.append(doc_info)

    SESSION_STATE["statistics"]["total_documents"] = len(SESSION_STATE["documents"])
    SESSION_STATE["statistics"]["total_pages"] = sum(d.page_count for d in SESSION_STATE["documents"])

    return {
        "success": True,
        "added_count": len(uploaded_docs),
        "total_documents": len(SESSION_STATE["documents"]),
        "documents": SESSION_STATE["documents"]
    }

@app.post("/api/load-starter")
async def load_starter_pdfs():
    """
    Convenience helper: loads the 3 starter PDFs from the starter-datasets folder
    so you can test immediately with 1 click without needing to find PDFs on your computer.
    """
    delhivery_dir = STARTER_DATASETS_DIR / "delhivery"
    if not delhivery_dir.exists():
        raise HTTPException(status_code=404, detail="Starter datasets directory not found.")

    for filename in os.listdir(delhivery_dir):
        if filename.endswith(".pdf"):
            src = delhivery_dir / filename
            dest = UPLOADS_DIR / filename
            if not dest.exists():
                shutil.copy(src, dest)

            info = PDFExtractor.inspect_pdf(str(dest))
            if info["success"]:
                if not any(d.id == filename for d in SESSION_STATE["documents"]):
                    SESSION_STATE["documents"].append(
                        DocumentInfo(
                            id=filename,
                            filename=filename,
                            title=filename.replace("-", " ").replace(".pdf", "").title(),
                            dataset="starter",
                            page_count=info["pages_count"],
                            size_mb=info["size_mb"],
                            description=f"Starter PDF ({info['pages_count']} pages)."
                        )
                    )

    SESSION_STATE["statistics"]["total_documents"] = len(SESSION_STATE["documents"])
    SESSION_STATE["statistics"]["total_pages"] = sum(d.page_count for d in SESSION_STATE["documents"])

    return {
        "success": True,
        "message": "Loaded starter PDFs into active list.",
        "documents": SESSION_STATE["documents"]
    }

@app.post("/api/process")
async def process_documents(payload: ProcessPayload = ProcessPayload()):
    """
    Runs fact extraction and cross-document reconciliation on all uploaded documents.
    """
    if not SESSION_STATE["documents"]:
        raise HTTPException(status_code=400, detail="Please upload at least one PDF first.")

    docs_payload = []
    max_pages = payload.max_pages_per_doc

    for doc in SESSION_STATE["documents"]:
        file_path = UPLOADS_DIR / doc.filename
        if not file_path.exists():
            continue
        pages_text = PDFExtractor.extract_pages_text(str(file_path), max_pages=max_pages, start_page=1)
        docs_payload.append({
            "filename": doc.filename,
            "title": doc.title,
            "pages_text": pages_text
        })

    # Let the model analyze documents and discover facts and the 4 required cases
    facts, cases = GeminiEngine.analyze_documents(docs_payload)

    SESSION_STATE["facts"] = facts
    SESSION_STATE["showcase_cases"] = cases
    SESSION_STATE["statistics"]["total_facts"] = len(facts)
    SESSION_STATE["statistics"]["total_relations"] = len(cases)

    return {
        "success": True,
        "facts_count": len(facts),
        "cases_count": len(cases),
        "results": SESSION_STATE
    }

@app.get("/api/document/{doc_id}/page/{page_num}")
async def get_page_text(doc_id: str, page_num: int):
    file_path = UPLOADS_DIR / doc_id
    if not file_path.exists():
        # Fallback to starter-datasets
        for sub in ["delhivery", "india-macroeconomy"]:
            alt = STARTER_DATASETS_DIR / sub / doc_id
            if alt.exists():
                file_path = alt
                break

    if not file_path.exists():
        raise HTTPException(status_code=404, detail=f"Document '{doc_id}' not found.")

    pages_dict = PDFExtractor.extract_pages_text(str(file_path), max_pages=1, start_page=page_num)
    text = pages_dict.get(page_num, "")

    return {
        "doc_id": doc_id,
        "page_number": page_num,
        "text": text,
        "word_count": len(text.split())
    }

@app.post("/api/reset")
async def reset_session():
    SESSION_STATE["documents"] = []
    SESSION_STATE["facts"] = []
    SESSION_STATE["relations"] = []
    SESSION_STATE["showcase_cases"] = []
    SESSION_STATE["statistics"] = {
        "total_documents": 0,
        "total_pages": 0,
        "total_facts": 0,
        "total_relations": 0
    }
    return {"success": True, "message": "Session reset."}

# Mount frontend/dist directory if built
frontend_dist = Path(__file__).parent.parent / "frontend" / "dist"
if frontend_dist.exists():
    app.mount("/", StaticFiles(directory=str(frontend_dist), html=True), name="frontend")
