@echo off
title SatyaPatra AI - Launch Ecosystem
echo ===============================================================
echo   SatyaPatra AI - ST Scholarship Verification Platform
echo   Ministry of Tribal Affairs, Government of India
echo ===============================================================
echo.
echo [1/3] Starting Python FastAPI Microservice (Port 8000)...
start "SatyaPatra - Python AI Microservice (Port 8000)" cmd /k "cd /d %~dp0ai-service && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

echo [2/3] Starting Node.js Express Backend (Port 5000)...
start "SatyaPatra - Node.js Express Backend (Port 5000)" cmd /k "cd /d %~dp0backend && npm run dev"

echo [3/3] Starting React Frontend (Port 3000)...
start "SatyaPatra - React Frontend (Port 3000)" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo All services launched!
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000/api/health
echo AI Core:  http://localhost:8000/docs
echo ===============================================================
