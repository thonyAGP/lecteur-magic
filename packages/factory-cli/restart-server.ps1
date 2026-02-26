# Simple server restart script
param([int]$Port = 3070)

Write-Host "=== Server Restart ===" -ForegroundColor Cyan

# Kill
$conn = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
if ($conn) {
    Stop-Process -Id $conn.OwningProcess -Force
    Start-Sleep 2
    Write-Host "Server killed" -ForegroundColor Green
}

# Build
pnpm build
Write-Host "Build done" -ForegroundColor Green

# Start
$job = Start-Job {
    Set-Location D:\Projects\ClubMed\LecteurMagic\packages\factory-cli
    npx tsx src/cli.ts serve --port 3070 --project ../../
}

Start-Sleep 3

# Verify
$ver = Invoke-RestMethod http://localhost:$Port/api/version
Write-Host ""
Write-Host "Server: $($ver.commit)" -ForegroundColor Cyan
Write-Host "Latest: $(git log -1 --format='%h')" -ForegroundColor Cyan
Write-Host ""
Write-Host "Ready: http://localhost:$Port" -ForegroundColor Green
