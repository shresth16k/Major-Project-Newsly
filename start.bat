@echo off
echo ================================================
echo    NEWSLY - Starting Application
echo ================================================
echo.

:: Start Flask backend in background (hidden window)
start /B /MIN python app.py > nul 2>&1

:: Wait for Flask to start
timeout /t 2 /nobreak > nul

echo [OK] Backend API started
echo [OK] Starting frontend...
echo.
echo ================================================
echo    Open: http://localhost:5173
echo ================================================
echo.

:: Open browser
start http://localhost:5173

:: Start Vite dev server
cd newsly-react
npm run dev
