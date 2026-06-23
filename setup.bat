@echo off
echo =====================================================
echo  SHIELD AI - Digital Public Safety Platform Setup
echo =====================================================
echo.

REM Check Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found!
    echo Please install Node.js from: https://nodejs.org/en/download
    echo Download the "Windows Installer (.msi)" LTS version
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VER=%%i
echo [OK] Node.js found: %NODE_VER%

REM Check Python
where python >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python not found!
    echo Please install Python 3.11+ from: https://python.org/downloads
    echo Make sure to check "Add Python to PATH" during install
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('python --version') do set PY_VER=%%i
echo [OK] Python found: %PY_VER%

echo.
echo =====================================================
echo  Installing Frontend Dependencies...
echo =====================================================
cd /d "%~dp0frontend"
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Frontend install failed
    pause
    exit /b 1
)
echo [OK] Frontend dependencies installed!

echo.
echo =====================================================
echo  Setting up Python Virtual Environment...
echo =====================================================
cd /d "%~dp0backend"
python -m venv venv
call venv\Scripts\activate.bat
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo [ERROR] Backend install failed
    pause
    exit /b 1
)
echo [OK] Backend dependencies installed!

echo.
echo =====================================================
echo  SETUP COMPLETE!
echo =====================================================
echo.
echo  To run the platform, open TWO terminal windows:
echo.
echo  TERMINAL 1 (Frontend):
echo    cd %~dp0frontend
echo    npm run dev
echo    Then open: http://localhost:3000
echo.
echo  TERMINAL 2 (Backend):
echo    cd %~dp0backend
echo    venv\Scripts\activate
echo    uvicorn app.main:app --reload --port 8000
echo    API docs: http://localhost:8000/docs
echo.
pause
