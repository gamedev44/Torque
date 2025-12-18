@echo off
setlocal enableextensions

REM Torque.JS V3 launcher (BAT wrapper)
REM Delegates to PowerShell script for robust behavior

set "SCRIPT=%~dp0start.ps1"
if not exist "%SCRIPT%" (
  echo [ERROR] start.ps1 not found next to this BAT. >&2
  exit /b 1
)

powershell -NoProfile -ExecutionPolicy Bypass -File "%SCRIPT%" %*

