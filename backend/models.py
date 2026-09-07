from typing import List, Optional, Dict, Any, Literal
from pydantic import BaseModel, Field
import uuid

class Citation(BaseModel):
    page: int = Field(..., description="1-indexed PDF page number")
    quote: str = Field(..., description="Exact verbatim text excerpt from the document")
    context: Optional[str] = Field(None, description="Surrounding sentences or table header context")

class Fact(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4())[:8])
    doc_id: str = Field(..., description="Document filename or unique identifier")
    doc_title: str = Field(..., description="Human-readable document name")
    entity: str = Field(..., description="Subject entity (e.g., Delhivery Limited, Indian Economy, RBI)")
    topic: str = Field(..., description="Fact category (e.g., Financial Performance, Network Scope, Governance, Macro Growth)")
    claim: str = Field(..., description="Clear human-readable factual claim")
    value: str = Field(..., description="Expressed value or status (e.g., '₹8,142 Cr', '18,792 PIN codes', '6.5%')")
    raw_number: Optional[float] = Field(None, description="Normalized canonical numeric value for quantitative verification")
    unit: Optional[str] = Field(None, description="Measurement unit (e.g., 'INR Crore', 'PIN codes', '%')")
    temporal_anchor: Optional[str] = Field(None, description="Specific time period or as-of date")
    scope_qualifier: Optional[str] = Field(None, description="Scope condition (e.g., 'Consolidated FY24', 'Q4 3-Month', 'Non-GAAP Adjusted', 'Second Advance Estimate')")
    citation: Citation
    confidence: float = Field(0.95, ge=0.0, le=1.0)
    extraction_notes: Optional[str] = None

class ContextDelta(BaseModel):
    dimension: str = Field(..., description="The axis explaining the apparent discrepancy (e.g., 'Temporal Horizon', 'Measurement Definition', 'Data Vintage', 'Reporting Scope')")
    doc_a_spec: str = Field(..., description="Context for Document A")
    doc_b_spec: str = Field(..., description="Context for Document B")
    explanation: str = Field(..., description="Why this contextual variance reconciles the difference")

class FailureAnalysis(BaseModel):
    failure_type: str = Field(..., description="Category of failure (e.g., 'Negative Accounting Parenthesis Reversal', 'Scale Multiplier Confusion (Crore vs Million)', 'Multi-Column OCR Concatenation', 'Ambiguous Table Footnote')")
    naive_result: str = Field(..., description="Erroneous claim or classification produced by naive extraction")
    root_cause: str = Field(..., description="Technical breakdown of why the error occurred")
    guardrail_applied: str = Field(..., description="How our system detects, handles, or prevents this error")
    improved_outcome: str = Field(..., description="The corrected, grounded fact or classification")

class FactRelation(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4())[:8])
    relation_type: Literal["CORROBORATION", "CONTRADICTION", "CONTEXTUAL_RECONCILIATION", "ANOMALY_FAILURE"]
    fact_a_id: str
    fact_b_id: Optional[str] = None
    title: str
    summary: str
    detailed_reasoning: str
    context_delta: Optional[ContextDelta] = None
    failure_analysis: Optional[FailureAnalysis] = None
    confidence: float = 0.95

class ShowcaseCase(BaseModel):
    case_number: int = Field(..., ge=1, le=4)
    case_title: str
    case_type: Literal["CORROBORATION", "CONTRADICTION", "CONTEXTUAL_RECONCILIATION", "ANOMALY_FAILURE"]
    badge_label: str
    headline: str
    doc_a_name: str
    doc_a_page: int
    doc_a_quote: str
    doc_a_interpretation: str
    doc_b_name: Optional[str] = None
    doc_b_page: Optional[int] = None
    doc_b_quote: Optional[str] = None
    doc_b_interpretation: Optional[str] = None
    system_reasoning: str
    verdict: str
    context_delta: Optional[ContextDelta] = None
    failure_analysis: Optional[FailureAnalysis] = None

class DocumentInfo(BaseModel):
    id: str
    filename: str
    title: str
    dataset: str
    page_count: int
    size_mb: float
    description: str

class KnowledgeLayerState(BaseModel):
    dataset_name: str
    documents: List[DocumentInfo]
    facts: List[Fact]
    relations: List[FactRelation]
    showcase_cases: List[ShowcaseCase]
    statistics: Dict[str, Any]
