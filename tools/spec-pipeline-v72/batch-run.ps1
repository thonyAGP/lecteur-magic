param([int]$Start = 51, [int]$End = 100)

$success = 0
$failed = @()
foreach ($ide in $Start..$End) {
    $outPath = "./output/ADH-IDE-$ide"
    if (Test-Path $outPath) {
        Write-Host "[$ide] " -NoNewline
        try {
            & .\Phase5-Synthesis.ps1 -Project ADH -IdePosition $ide -OutputPath $outPath -ErrorAction Stop 2>&1 | Out-Null
            $success++
            Write-Host "OK"
        } catch {
            $failed += $ide
            Write-Host "FAIL"
        }
    } else {
        Write-Host "[$ide] SKIP"
    }
}
Write-Host ""
Write-Host "Bloc $Start-$End : $success OK, $($failed.Count) failed"
if ($failed.Count -gt 0) { Write-Host "Failed: $($failed -join ',')" }
