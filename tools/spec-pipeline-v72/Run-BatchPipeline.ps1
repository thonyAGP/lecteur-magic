# Run-BatchPipeline.ps1 - Run spec pipeline on all programs of a project (or all projects)
# Usage:
#   .\Run-BatchPipeline.ps1 -Project ADH                     # Single project
#   .\Run-BatchPipeline.ps1 -All                              # All projects (sequential)
#   .\Run-BatchPipeline.ps1 -Project ADH -StartIDE 50 -EndIDE 100  # Range
#   .\Run-BatchPipeline.ps1 -All -Parallel                    # All projects in parallel

param(
    [Parameter(ParameterSetName='Single')]
    [string]$Project,

    [Parameter(ParameterSetName='All')]
    [switch]$All,

    [Parameter(ParameterSetName='All')]
    [switch]$Parallel,

    [int]$StartIDE = 0,
    [int]$EndIDE = 0,

    [switch]$SkipExisting,
    [string]$LogDir = "D:\Temp\batch-pipeline-logs"
)

$ErrorActionPreference = "Continue"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent (Split-Path -Parent $ScriptDir)
$PipelineScript = Join-Path $ScriptDir "Run-SpecPipeline.ps1"
$SpecsDir = Join-Path $ProjectRoot ".openspec\specs"
$SourceBase = "D:\Data\Migration\XPA\PMS"

if (-not (Test-Path $LogDir)) { New-Item -ItemType Directory -Path $LogDir -Force | Out-Null }

# ============================================================
# Get program list from ProgramHeaders.xml
# ============================================================
# Returns array of @{ide; folder} from Progs.xml (real IDE positions + folder names)
function Get-ProgramList {
    param([string]$ProjectName)

    $progsFile = Join-Path $SourceBase "$ProjectName\Source\Progs.xml"
    if (-not (Test-Path $progsFile)) {
        Write-Host "  ERROR: Progs.xml not found for $ProjectName" -ForegroundColor Red
        return @()
    }

    [xml]$xml = Get-Content $progsFile -Encoding UTF8
    $programs = $xml.Application.ProgramsRepositoryOutLine.Programs.Program
    if (-not $programs) { return @() }

    # Build position-to-folder map from <Folders>
    $posToFolder = @{}
    $folders = $xml.Application.Header.Folders.Folder
    if ($folders) {
        foreach ($f in $folders) {
            $start = [int]$f.StartsAt.val
            $count = [int]$f.NumberOfEntries.val
            $name = $f.Name.val
            for ($p = $start; $p -lt ($start + $count); $p++) {
                $posToFolder[$p] = $name
            }
        }
    }

    # Build result: IDE position (1-based) + folder name
    $result = @()
    $pos = 1
    foreach ($prog in $programs) {
        $folder = if ($posToFolder.ContainsKey($pos)) { $posToFolder[$pos] } else { "" }
        $result += @{ ide = $pos; folder = $folder }
        $pos++
    }
    return $result
}

# ============================================================
# Process one project
# ============================================================
function Process-Project {
    param(
        [string]$ProjectName,
        [array]$ProgramEntries,   # Array of @{ide; folder}
        [string]$LogFile
    )

    $startTime = Get-Date
    $total = $ProgramEntries.Count
    $success = 0
    $failed = 0
    $skipped = 0

    "=== BATCH PIPELINE: $ProjectName ($total programs) ===" | Tee-Object -FilePath $LogFile
    "Started: $($startTime.ToString('yyyy-MM-dd HH:mm:ss'))" | Tee-Object -FilePath $LogFile -Append
    "" | Tee-Object -FilePath $LogFile -Append

    for ($i = 0; $i -lt $total; $i++) {
        $entry = $ProgramEntries[$i]
        $ide = $entry.ide
        $folder = $entry.folder
        $progress = "$($i+1)/$total"
        $pct = [math]::Round(($i+1) / $total * 100, 0)

        # Skip existing?
        if ($SkipExisting) {
            $specFile = Join-Path $SpecsDir "$ProjectName-IDE-$ide.md"
            if (Test-Path $specFile) {
                $skipped++
                "$progress [$pct%] $ProjectName IDE $ide - SKIPPED (exists)" | Tee-Object -FilePath $LogFile -Append
                continue
            }
        }

        $ideStart = Get-Date
        try {
            # Run pipeline with folder parameter
            $folderArg = if ($folder) { "-Folder `"$folder`"" } else { "" }
            $output = & powershell -NoProfile -ExecutionPolicy Bypass -Command "& '$PipelineScript' -Project '$ProjectName' -IdePosition $ide $folderArg" 2>&1

            # Check if spec was generated
            $specFile = Join-Path $SpecsDir "$ProjectName-IDE-$ide.md"
            if (Test-Path $specFile) {
                $duration = [math]::Round(((Get-Date) - $ideStart).TotalSeconds, 1)
                $success++
                "$progress [$pct%] $ProjectName IDE $ide - OK (${duration}s)" | Tee-Object -FilePath $LogFile -Append
            } else {
                $failed++
                $errLines = $output | Where-Object { $_ -match 'ERROR|FAIL|Exception' } | Select-Object -First 1
                "$progress [$pct%] $ProjectName IDE $ide - FAIL: $errLines" | Tee-Object -FilePath $LogFile -Append
            }
        } catch {
            $failed++
            "$progress [$pct%] $ProjectName IDE $ide - ERROR: $_" | Tee-Object -FilePath $LogFile -Append
        }

        # Progress summary every 20 programs
        if (($i + 1) % 20 -eq 0) {
            $elapsed = (Get-Date) - $startTime
            $avgSec = $elapsed.TotalSeconds / ($i + 1)
            $remaining = [math]::Round($avgSec * ($total - $i - 1) / 60, 0)
            "  --- Progress: $success OK, $failed FAIL, $skipped SKIP | ~${remaining}min remaining ---" | Tee-Object -FilePath $LogFile -Append
        }
    }

    $totalDuration = (Get-Date) - $startTime
    "" | Tee-Object -FilePath $LogFile -Append
    "=== BATCH COMPLETE: $ProjectName ===" | Tee-Object -FilePath $LogFile -Append
    "Duration: $([math]::Round($totalDuration.TotalMinutes, 1)) minutes" | Tee-Object -FilePath $LogFile -Append
    "Results: $success OK | $failed FAIL | $skipped SKIP | $total total" | Tee-Object -FilePath $LogFile -Append

    return @{ Success = $success; Failed = $failed; Skipped = $skipped; Total = $total; Duration = $totalDuration }
}

# ============================================================
# MAIN
# ============================================================

# Dynamic project discovery from source base
$allProjects = @()
foreach ($dir in (Get-ChildItem $SourceBase -Directory)) {
    $headerFile = Join-Path $dir.FullName "Source\ProgramHeaders.xml"
    if (Test-Path $headerFile) { $allProjects += $dir.Name }
}
$allProjects = $allProjects | Sort-Object
$projectsToRun = if ($All) { $allProjects } else { @($Project) }

Write-Host "=== BATCH SPEC PIPELINE V7.2 ===" -ForegroundColor Cyan
Write-Host "Projects: $($projectsToRun -join ', ')"
Write-Host "SkipExisting: $SkipExisting"
Write-Host "Logs: $LogDir"
Write-Host ""

if ($All -and $Parallel) {
    # Launch each project as a parallel background job
    Write-Host "Launching $($projectsToRun.Count) projects in PARALLEL..." -ForegroundColor Yellow
    $jobs = @()

    foreach ($proj in $projectsToRun) {
        $entries = Get-ProgramList -ProjectName $proj
        if ($entries.Count -eq 0) { continue }

        $logFile = Join-Path $LogDir "batch-$proj.log"
        $filtered = if ($StartIDE -gt 0 -or $EndIDE -gt 0) {
            $from = if ($StartIDE -gt 0) { $StartIDE } else { 1 }
            $to = if ($EndIDE -gt 0) { $EndIDE } else { $entries[-1].ide }
            @($entries | Where-Object { $_.ide -ge $from -and $_.ide -le $to })
        } else { $entries }

        Write-Host "  $proj : $($filtered.Count) programs -> $logFile" -ForegroundColor Green

        $skipFlag = if ($SkipExisting) { "-SkipExisting" } else { "" }
        $rangeArgs = ""
        if ($StartIDE -gt 0) { $rangeArgs += " -StartIDE $StartIDE" }
        if ($EndIDE -gt 0) { $rangeArgs += " -EndIDE $EndIDE" }

        $job = Start-Job -ScriptBlock {
            param($Script, $Proj, $Skip, $Range)
            & powershell -NoProfile -ExecutionPolicy Bypass -File $Script -Project $Proj $Skip $Range
        } -ArgumentList $MyInvocation.MyCommand.Path, $proj, $skipFlag, $rangeArgs -Name "Pipeline-$proj"

        $jobs += $job
    }

    Write-Host ""
    Write-Host "All jobs launched. Monitoring..." -ForegroundColor Yellow
    Write-Host "Check logs: Get-Content D:\Temp\batch-pipeline-logs\batch-*.log -Tail 5" -ForegroundColor DarkGray
    Write-Host ""

    # Wait and report
    $jobs | Wait-Job | Out-Null
    foreach ($j in $jobs) {
        $result = Receive-Job $j
        Write-Host "$($j.Name): $($j.State)" -ForegroundColor $(if ($j.State -eq 'Completed') { 'Green' } else { 'Red' })
    }
    $jobs | Remove-Job

} else {
    # Sequential processing
    $globalStart = Get-Date
    $allResults = @()

    foreach ($proj in $projectsToRun) {
        $entries = Get-ProgramList -ProjectName $proj
        if ($entries.Count -eq 0) {
            Write-Host "$proj : No programs found, skipping" -ForegroundColor Yellow
            continue
        }

        # Filter by range if specified
        if ($StartIDE -gt 0 -or $EndIDE -gt 0) {
            $from = if ($StartIDE -gt 0) { $StartIDE } else { 1 }
            $to = if ($EndIDE -gt 0) { $EndIDE } else { $entries[-1].ide }
            $entries = @($entries | Where-Object { $_.ide -ge $from -and $_.ide -le $to })
        }

        $logFile = Join-Path $LogDir "batch-$proj.log"
        Write-Host ""
        Write-Host "Processing $proj ($($entries.Count) programs)..." -ForegroundColor Yellow

        $result = Process-Project -ProjectName $proj -ProgramEntries $entries -LogFile $logFile
        $allResults += @{ Project = $proj; Result = $result }
    }

    # Final summary
    $globalDuration = (Get-Date) - $globalStart
    Write-Host ""
    Write-Host "=== FINAL SUMMARY ===" -ForegroundColor Cyan
    Write-Host "Total duration: $([math]::Round($globalDuration.TotalMinutes, 1)) minutes"
    Write-Host ""
    Write-Host "| Project | OK | FAIL | SKIP | Total | Duration |"
    Write-Host "|---------|-----|------|------|-------|----------|"
    foreach ($r in $allResults) {
        $res = $r.Result
        $dur = "$([math]::Round($res.Duration.TotalMinutes, 1))min"
        Write-Host "| $($r.Project) | $($res.Success) | $($res.Failed) | $($res.Skipped) | $($res.Total) | $dur |"
    }
}
