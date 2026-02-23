# Regenerate all ADH specs with V7.2 pipeline
# Uses dynamic main_offset calculation

param(
    [int]$StartFrom = 1,
    [int]$EndAt = 350,
    [switch]$SkipPhase4
)

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Get list of existing ADH specs
$ProjectRoot = Split-Path -Parent (Split-Path -Parent $ScriptDir)
$existingSpecs = Get-ChildItem "$ProjectRoot\.openspec\specs\ADH-IDE-*.md" |
    Where-Object { $_.Name -notmatch '-summary' } |
    ForEach-Object {
        if ($_.BaseName -match 'ADH-IDE-(\d+)') {
            [int]$Matches[1]
        }
    } |
    Sort-Object -Unique

$total = ($existingSpecs | Where-Object { $_ -ge $StartFrom -and $_ -le $EndAt }).Count
$current = 0
$failed = @()
$startTime = Get-Date

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " REGENERATING ADH SPECS (V7.2 Pipeline)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Range: IDE $StartFrom - $EndAt"
Write-Host "Total: $total specs"
Write-Host "Start: $startTime"
Write-Host ""

foreach ($ide in $existingSpecs) {
    if ($ide -lt $StartFrom -or $ide -gt $EndAt) { continue }

    $current++
    $pct = [math]::Round(($current / $total) * 100)

    Write-Host "[$current/$total] ($pct%) Processing ADH IDE $ide..." -ForegroundColor Yellow

    try {
        $pipelineArgs = @{
            Project = "ADH"
            IdePosition = $ide
        }
        if ($SkipPhase4) {
            $pipelineArgs["SkipPhase4"] = $true
        }

        # Run pipeline (suppress most output)
        $null = & "$ScriptDir\Run-SpecPipeline.ps1" @pipelineArgs 2>&1

        Write-Host "  OK" -ForegroundColor Green
    }
    catch {
        Write-Host "  FAILED: $_" -ForegroundColor Red
        $failed += $ide
    }
}

$endTime = Get-Date
$duration = $endTime - $startTime

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " REGENERATION COMPLETE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Duration: $($duration.ToString('hh\:mm\:ss'))"
Write-Host "Success: $($total - $failed.Count) / $total"

if ($failed.Count -gt 0) {
    Write-Host "Failed IDEs: $($failed -join ', ')" -ForegroundColor Red
}
