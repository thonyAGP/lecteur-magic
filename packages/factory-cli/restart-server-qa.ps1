#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Restart Migration Factory Server avec code QA
.DESCRIPTION
    Kill serveur sur port 3070, rebuild, restart, et vérifie version
#>

param(
    [int]$Port = 3070,
    [string]$ProjectPath = "../../"
)

Write-Host "`n=== Migration Factory Server Restart ===" -ForegroundColor Cyan

# 1. Kill serveur existant
Write-Host "`n[1/5] Killing server on port $Port..." -ForegroundColor Yellow
$connection = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
if ($connection) {
    $pid = $connection.OwningProcess
    Write-Host "  → Found PID: $pid" -ForegroundColor Gray
    Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
    Write-Host "  ✓ Server killed" -ForegroundColor Green
} else {
    Write-Host "  ℹ No server running on port $Port" -ForegroundColor Gray
}

# 2. Vérifier port libre
Write-Host "`n[2/5] Verifying port is free..." -ForegroundColor Yellow
$check = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
if ($check) {
    Write-Host "  ✗ Port still in use!" -ForegroundColor Red
    exit 1
}
Write-Host "  ✓ Port $Port is free" -ForegroundColor Green

# 3. Rebuild
Write-Host "`n[3/5] Building code..." -ForegroundColor Yellow
pnpm build | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ✗ Build failed!" -ForegroundColor Red
    exit 1
}
$buildTime = Get-Date -Format "HH:mm:ss"
Write-Host "  ✓ Build success at $buildTime" -ForegroundColor Green

# 4. Start serveur en background
Write-Host "`n[4/5] Starting server..." -ForegroundColor Yellow
$serverJob = Start-Job -ScriptBlock {
    param($Port, $ProjectPath)
    Set-Location $using:PWD
    npx tsx src/cli.ts serve --port $Port --project $ProjectPath
} -ArgumentList $Port, $ProjectPath

Start-Sleep -Seconds 3

# 5. Vérifier version
Write-Host "`n[5/5] Checking version..." -ForegroundColor Yellow
try {
    $version = Invoke-RestMethod -Uri "http://localhost:$Port/api/version" -TimeoutSec 5
    Write-Host "`n  ✓ Server running with:" -ForegroundColor Green
    Write-Host "    Version:    $($version.version)" -ForegroundColor Cyan
    Write-Host "    Commit:     $($version.commit)" -ForegroundColor Cyan
    Write-Host "    Build:      $($version.buildTimestamp)" -ForegroundColor Cyan
    Write-Host "    Started:    $($version.serverStartTime)" -ForegroundColor Cyan

    # Vérifier si commit est récent
    $lastCommit = git log -1 --format="%h"
    if ($version.commit -eq $lastCommit) {
        Write-Host "`n  ✅ Server running LATEST code!" -ForegroundColor Green
    } else {
        Write-Host "`n  ⚠️  Server code is OUTDATED!" -ForegroundColor Yellow
        Write-Host "    Expected: $lastCommit" -ForegroundColor Yellow
        Write-Host "    Running:  $($version.commit)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "  ✗ Version check failed: $_" -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ Server ready at http://localhost:$Port" -ForegroundColor Green
Write-Host "`nServer job ID: $($serverJob.Id)" -ForegroundColor Gray
Write-Host "To stop: Stop-Job $($serverJob.Id); Remove-Job $($serverJob.Id)" -ForegroundColor Gray
Write-Host "`n"
