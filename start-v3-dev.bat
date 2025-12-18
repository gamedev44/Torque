@echo off
setlocal enableextensions

REM Resolve repo root (this script's directory)
cd /d "%~dp0"

set "PROJECT_DIR=V3\torque-v3"

echo [INFO] Checking for Node.js/npm...
where npm >nul 2>nul
if errorlevel 1 (
  echo [WARN] npm not found. Attempting install via winget...
  winget -v >nul 2>nul
  if errorlevel 1 (
    echo [ERROR] Winget is not available on this system.
    echo [ACTION] Opening Node.js download page. Please install LTS, then re-run.
    start "" "https://nodejs.org/en/download/"
    pause
    exit /b 1
  ) else (
    winget install --id OpenJS.NodeJS.LTS -e --silent
    if errorlevel 1 (
      echo [ERROR] Winget installation failed or was cancelled.
      echo [ACTION] Opening Node.js download page. Please install LTS, then re-run.
      start "" "https://nodejs.org/en/download/"
      pause
      exit /b 1
    )
  )
)

REM Verify npm now exists
where npm >nul 2>nul
if errorlevel 1 (
  echo [ERROR] npm still not found in PATH. Please install Node.js and retry.
  pause
  exit /b 1
)

REM Move to V3 project directory
cd /d "%PROJECT_DIR%"
if errorlevel 1 (
  echo [ERROR] Could not change directory to %PROJECT_DIR%
  pause
  exit /b 1
)

echo [INFO] Installing dependencies...
call npm install
if errorlevel 1 (
  echo [ERROR] npm install failed.
  pause
  exit /b 1
)

echo [INFO] Starting Torque.JS V3 dev server...
call npm run dev

