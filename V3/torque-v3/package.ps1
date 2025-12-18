# Torque.JS V3 Packaging Script
# Builds (if npm present) and compresses webdist into dist/Torque-V3.zip
param(
    [string]$ZipName = 'Torque-V3.zip'
)

$ErrorActionPreference = 'Stop'
$projectRoot = $PSScriptRoot
$webdist = Join-Path $projectRoot 'webdist'
$dist = Join-Path $projectRoot 'dist'

Write-Host "[INFO] Packaging Torque.JS V3" -ForegroundColor Cyan
Write-Host "[INFO] Project root: $projectRoot"

# Try to build if npm is available
if (Get-Command npm -ErrorAction SilentlyContinue) {
    try {
        Push-Location $projectRoot
        Write-Host "[INFO] Running npm install" -ForegroundColor Cyan
        npm install | Out-Host
        Write-Host "[INFO] Building project (npm run build)" -ForegroundColor Cyan
        npm run build | Out-Host
    } catch {
        Write-Warning "[WARN] Build failed or not configured: $_"
    } finally {
        Pop-Location
    }
}

if (-not (Test-Path $webdist)) {
    throw "webdist folder not found at $webdist. Cannot package."
}

if (-not (Test-Path $dist)) { New-Item -ItemType Directory -Path $dist | Out-Null }

$zipPath = Join-Path $dist $ZipName
if (Test-Path $zipPath) { Remove-Item -Force $zipPath }

Write-Host "[INFO] Creating archive: $zipPath" -ForegroundColor Cyan
Compress-Archive -Path (Join-Path $webdist '*') -DestinationPath $zipPath

# Add README.md and generated VERSION.txt to the archive
$readmePath = Join-Path $projectRoot 'README.md'
$versionTmp = Join-Path $projectRoot 'VERSION.txt'

try {
    # Build version metadata
    $timestamp = (Get-Date).ToString('yyyy-MM-dd HH:mm:ssK')
    $pkgJsonPath = Join-Path $projectRoot 'package.json'
    $pkgVersion = $null
    if (Test-Path $pkgJsonPath) {
        try { $pkgVersion = (Get-Content $pkgJsonPath -Raw | ConvertFrom-Json).version } catch { $pkgVersion = $null }
    }
    $gitHash = $null; $gitBranch = $null; $gitTag = $null
    if (Get-Command git -ErrorAction SilentlyContinue) {
        try { $gitHash = (git rev-parse --short HEAD).Trim() } catch {}
        try { $gitBranch = (git rev-parse --abbrev-ref HEAD).Trim() } catch {}
        try { $gitTag = (git describe --tags --abbrev=0).Trim() } catch {}
    }

    $versionLines = @()
    $versionLines += "Torque.JS V3 Build Information"
    $versionLines += "Build Time: $timestamp"
    if ($pkgVersion) { $versionLines += "Package Version: $pkgVersion" }
    if ($gitHash) { $versionLines += "Commit: $gitHash" }
    if ($gitBranch) { $versionLines += "Branch: $gitBranch" }
    if ($gitTag) { $versionLines += "Tag: $gitTag" }
    $versionLines += "Source: V3/torque-v3/webdist"
    Set-Content -Path $versionTmp -Value ($versionLines -join [Environment]::NewLine) -NoNewline

    if (Test-Path $readmePath) {
        Compress-Archive -Path $readmePath -Update -DestinationPath $zipPath
    }
    if (Test-Path $versionTmp) {
        Compress-Archive -Path $versionTmp -Update -DestinationPath $zipPath
        Remove-Item -Force $versionTmp
    }
} catch {
    Write-Warning "[WARN] Failed to add README/VERSION to archive: $_"
    if (Test-Path $versionTmp) { Remove-Item -Force $versionTmp }
}

Write-Host "[SUCCESS] Packaged: $zipPath" -ForegroundColor Green
Write-Output $zipPath
