#!/usr/bin/env python3
"""
VERITAS // Superjoin Fact Knowledge Layer
One-click fullstack server runner.
Serves both FastAPI backend endpoints and the React frontend on http://127.0.0.1:8000
"""

import sys
import os
import uvicorn

def main():
    print("=" * 70)
    print("  VERITAS // FACT KNOWLEDGE LAYER & FORENSIC RECONCILIATION ENGINE")
    print("  Superjoin VIT 2026 Engineering Intern Assignment Solution")
    print("=" * 70)
    print("\n[+] Service Endpoints:")
    print("    -> Web Application UI:  http://127.0.0.1:8000")
    print("    -> FastAPI Swagger API: http://127.0.0.1:8000/docs")
    print("    -> API Health Check:    http://127.0.0.1:8000/api/health")
    print("\n[+] Pre-Loaded Starter Datasets:")
    print("    1. Delhivery Corporate & Financial Filings (Prospectus, AR FY24, Q4 Presentation)")
    print("    2. India Macroeconomic Reports (Economic Survey, RBI Annual Report, IMF Article IV)")
    print("\n[+] Google AI Studio Free Tier:")
    print("    Model: gemini-1.5-flash (15 RPM, 1M TPM, 1,500 RPD) - 100% Free of charge.")
    print("    You can configure your key in backend/.env or via the Web UI Key Drawer.")
    print("=" * 70)
    print("Starting uvicorn server on http://127.0.0.1:8000 ... (Press Ctrl+C to stop)\n")
    host = os.environ.get("HOST", "0.0.0.0" if (os.environ.get("WEBSITE_HOSTNAME") or os.environ.get("PORT")) else "127.0.0.1")
    port = int(os.environ.get("PORT", 8000))
    is_prod = bool(os.environ.get("WEBSITE_HOSTNAME"))
    uvicorn.run("backend.main:app", host=host, port=port, reload=not is_prod)

if __name__ == "__main__":
    main()
