param([string]$Project = "PVE", [int]$PrgId = 186)

$projectsPath = "D:\Data\Migration\XPA\PMS"
$xmlPath = "$projectsPath\$Project\Source\Prg_$PrgId.xml"

[xml]$xml = Get-Content $xmlPath -Encoding UTF8

function Get-VarName($index) {
    if ($index -lt 26) {
        return [char](65 + $index)
    }
    $first = [math]::Floor(($index - 26) / 26)
    $second = ($index - 26) % 26
    return "$([char](65+$first))$([char](65+$second))"
}

function Count-DataViewEntries($taskNode, [string]$taskName) {
    $totalCount = 0
    foreach ($lu in $taskNode.TaskLogic.LogicUnit) {
        $level = $lu.Level.val
        $type = $lu.Type.val

        # R=Record level (DataView): M=Main, L=Link
        if ($level -eq "R") {
            $lines = @($lu.LogicLines.LogicLine)
            $lineCount = $lines.Count
            Write-Host "      [$taskName] Level=$level Type=$type : $lineCount lignes"
            $totalCount += $lineCount
        }
    }
    return $totalCount
}

function Show-TaskEntries {
    param($node, [string]$indent = "", [int]$parentOffset = 0)

    $isn = $node.Header.ISN_2
    $name = $node.Header.Description

    Write-Host ""
    Write-Host "${indent}=== ISN=$isn $name ===" -ForegroundColor Yellow

    $entries = Count-DataViewEntries $node $name
    $firstVar = Get-VarName $parentOffset

    Write-Host "${indent}TOTAL entries: $entries | Offset parent: $parentOffset | Premiere var: $firstVar" -ForegroundColor Green

    $childOffset = $parentOffset + $entries

    if ($node.Task) {
        foreach ($subtask in @($node.Task)) {
            $childOffset = Show-TaskEntries $subtask "$indent  " $childOffset
        }
    }

    return $childOffset
}

$mainTask = $xml.Application.ProgramsRepository.Programs.Task
Write-Host "=== Comptage ENTRIES DataView ===" -ForegroundColor Cyan
Write-Host "Projet: $Project, Programme: $PrgId"
Show-TaskEntries $mainTask
