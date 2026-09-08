# Fact Knowledge Layer (Superjoin Assignment)

A simple web app and API that takes PDF documents, pulls out facts, links them to exact quotes and page numbers, and compares them to find where they agree, disagree, or explain each other.

Built for the **Superjoin Intern Assignment**.

---

## How to Run

### 1. Install Requirements
```bash
pip install fastapi uvicorn pypdf httpx python-multipart python-dotenv
```

### 2. Start the App
```bash
python run.py
```

Open your browser:
- **Web App**: [http://127.0.0.1:8000](http://127.0.0.1:8000)
- **API Docs**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

> **Note**: You don't need to run `npm` or open port 5173. The single Python command above runs both the backend API and the frontend UI together on port 8000.

### 3. Cloud Deployment (Azure App Service)
The codebase includes all Azure configuration files (`app.py`, `requirements.txt`, `startup.sh`).

---

## Free Gemini API Setup

This project uses Google's free tier (`gemini-3.6-flash`). It costs $0 and needs no credit card.

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey) and sign in.
2. Click **Create API key** -> **Create API key in new project**.
3. Copy your key (`AIzaSy...`).
4. In the web app, click **Enter Free Gemini API Key** and paste it.  
   *(Or add `GEMINI_API_KEY=your_key` inside a `backend/.env` file).*

**Free tier limits**:
- 15 requests per minute
- 1,000,000 tokens per minute
- 1,500 requests per day

*(Note: The app also works offline on sample documents even without an API key).*

---

## Video Demo (Under 3 Minutes)

- **Video Link**: `[Add your 3-minute Loom / Drive video link here before submitting]`
- **What to show in the video**:
  1. Open `http://127.0.0.1:8000`.
  2. Click `+ Load Sample PDFs` (or drag and drop PDFs).
  3. Click `Analyze Documents`.
  4. Show the 4 cases on screen and explain them briefly.
  5. Click a page button (e.g. `p.7`) to show the highlighted quote on the actual document page.

---

## The Four Required Cases

Here are the 4 cases found across the Delhivery starter documents:

### Case 1: Facts that Agree (Corroboration)
- **What agrees**:
  1. **Executive role**: Both the 2022 Prospectus and the 2024 Annual Report confirm Sahil Barua is the Managing Director and CEO.
     - **Doc 1 (Prospectus p. 7)**: *"Sahil Barua ... Managing Director and Chief Executive Officer"*
     - **Doc 2 (Annual Report p. 21)**: *"Sahil Barua Managing Director and Chief Executive Officer"*
  2. **Operating Profit**:
     - Annual Report (p. 36) reports FY24 EBITDA as **₹1,266.41 Million**.
     - Earnings Presentation (p. 5) reports FY24 EBITDA as **Rs. 127 Cr**.
     - Since $1\text{ Crore} = 10\text{ Million}$, $1,266.41\text{ Million} = 126.64\text{ Cr}$, which rounds to **127 Cr**. They are the exact same number expressed in different units.
- **Verdict**: **Corroborated** (facts match across documents).

---

### Case 2: Direct Contradiction
- **What clashes**: Conflicting PIN code numbers given for the exact same date in the same document.
- **Doc 1 (Prospectus p. 47)**: *"Our express parcel delivery network, which serviced 17,488 PIN codes for the nine months period ended December 31, 2021..."*
- **Doc 1 (Prospectus p. 48)**: *"had a network presence across 13,087 PIN codes with 2.85 million sq. ft."*
- **The Conflict**: Both lines talk about the company's reach as of December 31, 2021. One says 17,488 PIN codes; the other says 13,087 PIN codes. With no footnote explaining whether one means physical hubs and the other means delivery reach, this is an unexplained difference of 4,401 PIN codes.
- **Verdict**: **Contradiction** (conflicting numbers for the same date without explanation).

---

### Case 3: Apparent Contradiction Explained by Context
- **What seems to clash**: Two very different revenue numbers for the same year (₹2,076 Cr vs ₹8,142 Cr).
- **Doc 1 (Earnings Presentation p. 7)**: *"₹2,076 Cr Q4 FY24 revenue from services"*
- **Doc 2 (Earnings Presentation p. 6)**: *"₹8,142 Cr FY24 revenue from services"*
- **The Context**:
  - The first number (₹2,076 Cr) is for **Q4 only** (3 months: January to March 2024).
  - The second number (₹8,142 Cr) is for the **full year** (12 months: April 2023 to March 2024).
  - 2,076 is roughly a quarter of 8,142. Once you look at the time period, there is zero contradiction.
- **Verdict**: **Reconciled by Context** (explained by quarterly vs annual timeframe).

---

### Case 4: Extraction/Reasoning Failure & How We Fixed It
- **The Problem**:
  In financial tables, losses are written inside parentheses like `(4,516.08)` or `(452 Cr)`. Basic parsers and simple LLM prompts often strip the brackets and read `(452)` as positive `+452 Cr`. When comparing with FY24's positive profit, a naive system falsely claims: *"Delhivery's profit dropped from 452 Cr to 127 Cr"*, when in reality Delhivery turned an operating **loss** into a **profit**!
- **Evidence Quote (Annual Report p. 36)**: *"EBITDA 1,266.41 (4,516.08)"*
- **How We Fixed It**:
  We added a rule in our parser that checks for parentheses in financial columns and forces them to be negative (`-abs(value)`). We also cross-check with words like "loss" or "turnaround" in nearby sentences.
- **Verdict**: **Failure Handled** (prevented negative numbers from being flipped to positive).

---

## How It Works (Technical Architecture)

```
┌─────────────────┐       ┌──────────────────────┐       ┌────────────────────────┐
│  Uploaded PDFs  │ ───►  │ pypdf Page Extraction│ ───►  │  Gemini Flash (Free)   │
└─────────────────┘       └──────────────────────┘       └────────────────────────┘
                                                                     │
                                                                     ▼
┌─────────────────┐       ┌──────────────────────┐       ┌────────────────────────┐
│ React Frontend  │ ◄───  │ 4-Case Reconciler    │ ◄───  │ Provenance & Quote     │
│ (Port 8000)     │       │ & Unit Normalizer    │       │ Substring Verification │
└─────────────────┘       └──────────────────────┘       └────────────────────────┘
```

### 1. Document Ingestion & Page Indexing
- Uses `pypdf` to parse documents page-by-page.
- Instead of flattening the entire document into a single unindexed blob, every sentence and paragraph retains an explicit `page_number` tag.
- For large documents (100+ pages), text is read in sliding page windows to keep peak memory low and avoid hitting LLM context limits.

### 2. Fact Extraction & Grounding
- Structured prompt forces the LLM to output typed JSON:
  - `entity`: The subject (e.g. `Delhivery`, `Sahil Barua`).
  - `claim`: The specific assertion (e.g. `FY24 Revenue from services`).
  - `value`: Numerical or categorical value (e.g. `8142`, `Sahil Barua`).
  - `unit`: Unit of measurement (`Cr`, `Million`, `PIN codes`).
  - `temporal_anchor`: Time period (`FY24`, `Q4 FY24`, `Nine months ended Dec 31, 2021`).
  - `citation`: Verbatim quote and exact 1-indexed page number.

### 3. Semantic Grouping & Embedding Matching
- **Why it matters**: Two documents rarely use identical wording. One says *"Revenue from services was ₹8,142 Cr"*, while another says *"Topline income generated: 8142 Crores"*.
- **The Process**:
  - Each extracted claim is mapped into a vector space (using semantic embeddings such as `text-embedding-004`).
  - Claims with high cosine similarity ($\ge 0.82$) or matching entity/metric tags are clustered into comparison pairs.
  - This groups related statements together across multiple documents before running the reconciliation logic.

### 4. Anti-Hallucination Provenance Verification
- Before any fact is accepted into the knowledge layer, the backend executes a deterministic substring check against the raw text of the cited page.
- If an LLM hallucinates a quote or gets the page number wrong, the citation check fails and the fact is flagged or dropped. This guarantees that every quote shown in the UI exists word-for-word in the uploaded PDF.

### 5. Reconciliation Engine & Unit Normalization
- Compares facts within each cluster across documents:
  - **Unit Normalizer**: Converts units across reporting conventions (e.g., $1\text{ Crore} = 10\text{ Million}$, so $1,266.41\text{ Million} = 126.64\text{ Cr} \approx 127\text{ Cr}$).
  - **Temporal Scope Checker**: Separates quarterly figures (`Q4`) from full-year figures (`FY24`). If values differ because of timeframe, it classifies them as **Reconciled by Context** (Case 3) rather than a contradiction.
  - **Contradiction Finder**: If values differ for the exact same entity, metric, and date (e.g., 17,488 vs 13,087 PIN codes), it flags a **Direct Contradiction** (Case 2).
  - **Accounting Parentheses Rule**: Specifically parses `(value)` as negative to prevent treating losses as profits (Case 4).

---

## Brownie Points Implemented

1. **Handles Large PDFs**: Instead of dumping 100 pages into memory at once, we stream pages in chunks so 100-page files process smoothly without crashing or hitting token limits.
2. **Handles Multiple PDFs**: You can upload 2, 3, or more PDFs at the same time; the system compares facts across all of them.
3. **Dynamic Facts (No Hardcoded Tables)**: We don't force data into predefined columns. Whatever facts exist in the documents (financials, management, operational reach) are extracted dynamically.
4. **Incremental Ingestion**: Adding another PDF adds it to the existing list and compares it against existing facts without deleting prior work.
5. **Scanned PDFs & Multimodal Vision OCR (Bonus)**: When a PDF page has no digital text layer (e.g., scanned contracts or image-only pages), our parser extracts the raw page image stream with zero heavy local dependencies and passes it to Gemini Flash's native Multimodal Vision OCR to transcribe the text and tables verbatim.

---

## What Does Not Work Yet (Limitations)

1. **Extremely Low-Resolution Scans**: Scanned pages below 100 DPI or with severe ink smudges can occasionally produce character-level OCR misreadings.
2. **Complex Merged Tables**: Tabular layouts with deeply nested, borderless merged cells can sometimes require custom table bounding box alignment.
3. **Interactive Knowledge Graph View**: Facts and relationships are currently rendered in clean cards and tables. A visual interactive 2D node graph connecting claims would be a valuable future enhancement.

---

## Project Structure

```
.
├── backend/
│   ├── main.py          # FastAPI endpoints (upload, process, get facts)
│   ├── extractor.py     # Reads PDF pages & calls Gemini Flash
│   ├── reconciler.py    # Compares facts across documents for the 4 cases
│   ├── models.py        # Clean data structures for facts and citations
│   ├── config.py        # API key and model settings
│   └── storage/         # Where uploaded PDFs are saved
├── frontend/
│   ├── src/             # React UI code (clean, simple dashboard)
│   └── dist/            # Built web files (served directly by FastAPI)
├── starter-datasets/    # The sample Delhivery and Macroeconomy PDFs
├── run.py               # Single command to run everything
└── README.md            # This document
```
