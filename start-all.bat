@echo off
title DeepShield - AI Deepfake Detection Engine
echo ========================================================
echo        STARTING DEEPSHIELD ENTERPRISE SYSTEM
echo ========================================================
echo.

echo Starting Python Signal Forensic Microservice on port 8000...
start "DeepShield - Python Engine" cmd /k "cd python-service && .venv\Scripts\python.exe -m uvicorn app.main:app --port 8000 --reload"

timeout /t 2 >nul

echo Starting Node.js Express MERN API on port 5000...
start "DeepShield - Node Server" cmd /k "cd server && npm run dev"

timeout /t 2 >nul

echo Starting Vite React Frontend on port 5173...
start "DeepShield - React Client" cmd /k "cd client && npm run dev"

echo.
echo ========================================================
echo  All 3 services launched!
echo  Client URL:  http://localhost:5173
echo  Server API:  http://localhost:5000
echo  Python Svc:  http://localhost:8000
echo ========================================================
pause

