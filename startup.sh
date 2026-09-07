#!/bin/bash
# Azure App Service Linux Startup Script
PORT="${PORT:-8000}"
echo "Starting Fact Knowledge Layer on port $PORT..."
gunicorn --bind=0.0.0.0:$PORT --workers=2 --worker-class uvicorn.workers.UvicornWorker --timeout 600 app:app
