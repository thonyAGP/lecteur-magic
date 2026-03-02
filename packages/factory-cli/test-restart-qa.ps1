# Test script for restart-server-qa.ps1
# Runs the script and captures output to file

$outputFile = "restart-qa-test-output.txt"

Write-Host "Testing restart-server-qa.ps1..." -ForegroundColor Cyan

try {
    & .\restart-server-qa.ps1 -Port 3070 *>&1 | Tee-Object -FilePath $outputFile
    Write-Host ""
    Write-Host "✅ Script executed successfully" -ForegroundColor Green
    Write-Host "Output saved to: $outputFile" -ForegroundColor Gray
    exit 0
} catch {
    Write-Host "❌ Script failed with error:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    $_ | Out-File -FilePath $outputFile
    exit 1
}
