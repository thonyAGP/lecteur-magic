param([string]$Project = "PVE", [int]$PrgId = 186, [int]$TaskIsn = 1)

$projectsPath = "D:\Data\Migration\XPA\PMS"
$xmlPath = "$projectsPath\$Project\Source\Prg_$PrgId.xml"

[xml]$xml = Get-Content $xmlPath -Encoding UTF8

function Find-TaskByIsn($node, [int]$targetIsn) {
    if ([int]$node.Header.ISN_2 -eq $targetIsn) { return $node }
    if ($node.Task) {
        foreach ($subtask in @($node.Task)) {
            $found = Find-TaskByIsn $subtask $targetIsn
            if ($found) { return $found }
        }
    }
    return $null
}

$mainTask = $xml.Application.ProgramsRepository.Programs.Task
$task = Find-TaskByIsn $mainTask $TaskIsn

$name = $task.Header.Description
Write-Host "=== Debug ligne types pour ISN=$TaskIsn ($name) ===" -ForegroundColor Cyan
Write-Host ""

$lineStats = @{}
$totalLines = 0

foreach ($lu in $task.TaskLogic.LogicUnit) {
    if ($lu.Level.val -eq "R" -and $lu.Type.val -eq "M") {
        Write-Host "LogicUnit R/M:" -ForegroundColor Yellow
        $lineNum = 0
        foreach ($line in $lu.LogicLines.LogicLine) {
            $lineNum++
            $totalLines++
            $children = @($line.ChildNodes | ForEach-Object { $_.Name })
            $key = $children -join ","

            if (-not $lineStats.ContainsKey($key)) {
                $lineStats[$key] = 0
            }
            $lineStats[$key]++

            # Show first 20 lines
            if ($lineNum -le 20) {
                Write-Host "  Line $lineNum : $key"
            }
        }

        if ($totalLines -gt 20) {
            Write-Host "  ... ($totalLines total lines)"
        }
    }
}

Write-Host ""
Write-Host "=== Statistiques par type ===" -ForegroundColor Yellow
foreach ($key in $lineStats.Keys | Sort-Object) {
    Write-Host "  $key : $($lineStats[$key])"
}
Write-Host ""
Write-Host "TOTAL lignes R/M: $totalLines" -ForegroundColor Green
