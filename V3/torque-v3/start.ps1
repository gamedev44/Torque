# Torque.JS V3 Launcher (PowerShell)
# Starts the dev server if Node/npm is available; otherwise serves webdist via Python.
param(
    [int]$Port = 8080
)

$ErrorActionPreference = 'Stop'

$projectRoot = $PSScriptRoot
$webdist = Join-Path $projectRoot 'webdist'

Write-Host "[INFO] Torque.JS V3 launcher" -ForegroundColor Cyan
Write-Host "[INFO] Project root: $projectRoot"

function LaunchBrowser($url) {
    Write-Host "[INFO] Opening: $url" -ForegroundColor Cyan
    try { Start-Process $url } catch { Write-Warning "Failed to open browser: $_" }
}

function StartDevServer() {
    Write-Host "[INFO] Starting dev server (npm run dev)" -ForegroundColor Cyan
    Push-Location $projectRoot
    try {
        if (-not (Get-Command npm -ErrorAction SilentlyContinue)) { return $false }
        Write-Host "[INFO] Installing dependencies (npm install)" -ForegroundColor Cyan
        npm install | Out-Host
        Write-Host "[INFO] Launching Vite dev server" -ForegroundColor Cyan
        # Run dev server non-blocking so the script can open the browser
        Start-Process powershell -ArgumentList '-NoProfile','-ExecutionPolicy','Bypass','-Command','npm run dev' -WorkingDirectory $projectRoot | Out-Null
        Start-Sleep -Seconds 2
        LaunchBrowser "http://localhost:5173/" # default Vite port
        return $true
    } catch {
        Write-Warning "[WARN] Dev server failed: $_"
        return $false
    } finally { Pop-Location }
}

function StartStaticServer() {
    if (-not (Test-Path $webdist)) {
        throw "webdist folder not found at $webdist. Build the project or run dev server."
    }
    Push-Location $webdist
    try {
        if (Get-Command python -ErrorAction SilentlyContinue) {
            Write-Host "[INFO] Starting Python http.server on port $Port" -ForegroundColor Cyan
            Start-Process powershell -ArgumentList '-NoProfile','-ExecutionPolicy','Bypass','-Command',"python -m http.server $Port" -WorkingDirectory $webdist | Out-Null
            Start-Sleep -Seconds 1
            LaunchBrowser "http://localhost:$Port/"
            return
        }
        elseif (Get-Command py -ErrorAction SilentlyContinue) {
            Write-Host "[INFO] Starting Python (py) http.server on port $Port" -ForegroundColor Cyan
            Start-Process powershell -ArgumentList '-NoProfile','-ExecutionPolicy','Bypass','-Command',"py -m http.server $Port" -WorkingDirectory $webdist | Out-Null
            Start-Sleep -Seconds 1
            LaunchBrowser "http://localhost:$Port/"
            return
        }
        elseif (Get-Command npx -ErrorAction SilentlyContinue) {
            Write-Host "[INFO] Starting npx http-server on port $Port" -ForegroundColor Cyan
            Start-Process powershell -ArgumentList '-NoProfile','-ExecutionPolicy','Bypass','-Command',"npx http-server -p $Port -a 127.0.0.1 ." -WorkingDirectory $webdist | Out-Null
            Start-Sleep -Seconds 1
            LaunchBrowser "http://localhost:$Port/"
            return
        }
        else {
            Write-Warning "[WARN] No Python or Node available. Opening index.html directly. Some features may not work without a server."
            LaunchBrowser (Resolve-Path (Join-Path $webdist 'index.html')).Path
            return
        }
    } finally { Pop-Location }
}

# Try dev server first; if unavailable, fall back to static server
if (-not (StartDevServer)) { StartStaticServer }

