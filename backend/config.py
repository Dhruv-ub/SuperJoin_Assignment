import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env from either project root or backend directory
root_env = Path(__file__).parent.parent / ".env"
backend_env = Path(__file__).parent / ".env"
if root_env.exists():
    load_dotenv(dotenv_path=root_env)
if backend_env.exists():
    load_dotenv(dotenv_path=backend_env)
load_dotenv()  # Fallback to default environment lookup

BASE_DIR = Path(__file__).parent.parent
BACKEND_DIR = Path(__file__).parent
STARTER_DATASETS_DIR = BASE_DIR / "starter-datasets"
UPLOADS_DIR = BACKEND_DIR / "storage" / "uploads"

os.makedirs(UPLOADS_DIR, exist_ok=True)

# Recommended current model by Google AI Studio error message: gemini-3.6-flash
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.6-flash")

# Global runtime state for API key and model
RUNTIME_CONFIG = {
    "api_key": GEMINI_API_KEY,
    "model": GEMINI_MODEL,
}

def get_api_key() -> str:
    return RUNTIME_CONFIG.get("api_key") or os.getenv("GEMINI_API_KEY", "")

def set_api_key(key: str):
    RUNTIME_CONFIG["api_key"] = key.strip()

def get_model() -> str:
    return RUNTIME_CONFIG.get("model", "gemini-3.6-flash")

def set_model(model_name: str):
    RUNTIME_CONFIG["model"] = model_name.strip()
