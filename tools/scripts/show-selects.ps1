param([string]$Project = "ADH", [int]$PrgId = 122, [int]$TaskIsn = 4)

$projectsPath = "D:\Data\Migration\XPA\PMS"
$xmlPath = "$projectsPath\$Project\Source\Prg_$PrgId.xml"

[xml]$xml = Get-Content $xmlPath -Encoding UTF8

function Find-TaskByIsn {
    param($node, [int]$targetIsn)
    if ($node.Header.ISN_2 -eq $targetIsn) { return $node }
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

Write-Host "=== Select XML pour Tache $TaskIsn ===" -ForegroundColor Cyan

foreach ($lu in $task.TaskLogic.LogicUnit) {
    if ($lu.Level.val -eq "R" -and $lu.Type.val -eq "M") {
        Write-Host "`nLogicUnit R/M (Record Main):" -ForegroundColor Yellow
        $lineNum = 0
        foreach ($line in $lu.LogicLines.LogicLine) {
            $lineNum++
            if ($line.Select) {
                Write-Host "`nLigne $lineNum :"
                Write-Host $line.OuterXml
            }
        }
    }
}
