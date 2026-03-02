# Check if file has BOM
$file = "restart-server-qa.ps1"
$bytes = Get-Content $file -Encoding Byte -TotalCount 3
$hex = ($bytes | ForEach-Object { '{0:X2}' -f $_ }) -join ' '
Write-Host "First 3 bytes: $hex"

if ($bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) {
    Write-Host "✓ UTF-8 with BOM detected" -ForegroundColor Yellow
} else {
    Write-Host "✗ No BOM or different encoding" -ForegroundColor Green
}

# Re-save without BOM
Write-Host "Re-saving file without BOM..." -ForegroundColor Cyan
$content = Get-Content $file -Raw
[System.IO.File]::WriteAllText((Resolve-Path $file), $content, (New-Object System.Text.UTF8Encoding $false))
Write-Host "✓ File saved as UTF-8 without BOM" -ForegroundColor Green
