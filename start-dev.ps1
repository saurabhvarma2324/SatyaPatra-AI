Write-Host "===============================================================" -ForegroundColor Cyan
Write-Host "  SatyaPatra AI - ST Scholarship Verification & Cross-Exam     " -ForegroundColor Yellow
Write-Host "  Ministry of Tribal Affairs, Government of India              " -ForegroundColor Green
Write-Host "===============================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/3] Starting Python FastAPI Microservice on port 8000..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\ai-service'; python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

Write-Host "[2/3] Starting Node.js Express Backend on port 5000..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; npm run dev"

Write-Host "[3/3] Starting React Frontend on port 3000..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm run dev"

Write-Host ""
Write-Host "All 3 services are launching in separate terminal windows!" -ForegroundColor Green
Write-Host "Frontend Portal: http://localhost:3000" -ForegroundColor White
Write-Host "Backend API:     http://localhost:5000/api/health" -ForegroundColor White
Write-Host "Python AI API:   http://localhost:8000/docs" -ForegroundColor White
Write-Host "===============================================================" -ForegroundColor Cyan
