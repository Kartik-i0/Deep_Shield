Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "       STARTING DEEPSHIELD ENTERPRISE SYSTEM" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan

# 1. Start Python Service
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\python-service'; .venv\Scripts\python.exe -m uvicorn app.main:app --port 8000 --reload"

Start-Sleep -Seconds 2

# 2. Start Node Server
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\server'; npm run dev"

Start-Sleep -Seconds 2

# 3. Start Vite React Client
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\client'; npm run dev"

Write-Host "DeepShield launched successfully!" -ForegroundColor Green
Write-Host "Frontend:  http://localhost:5173" -ForegroundColor Yellow
Write-Host "Server:    http://localhost:5000" -ForegroundColor Yellow
Write-Host "Python:    http://localhost:8000" -ForegroundColor Yellow

