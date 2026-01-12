param([string]$Project = "PVE", [int]$PrgId = 186)

$projectsPath = "D:\Data\Migration\XPA\PMS"
$xmlPath = "$projectsPath\$Project\Source\Prg_$PrgId.xml"

[xml]$xml = Get-Content $xmlPath -Encoding UTF8

function Get-VarName($index) {
    if ($index -lt 0) { return "?" }
    if ($index -lt 26) {
        return [char](65 + $index)
    }
    $idx = $index - 26
    $first = [math]::Floor($idx / 26)
    $second = $idx % 26
    return "$([char](65+[int]$first))$([char](65+[int]$second))"
}

function Count-AllDataViewLines($taskNode, [string]$taskName) {
    $mainCount = 0
    $linkCount = 0

    foreach ($lu in $taskNode.TaskLogic.LogicUnit) {
        if ($lu.Level.val -eq "R") {
            $lines = @($lu.LogicLines.LogicLine).Count

            switch ($lu.Type.val) {
                "M" {  # Main Source
                    $mainCount += $lines
                    Write-Host "      Main Source (R/M): $lines lignes"
                }
                "L" {  # Link
                    $linkCount += $lines
                    Write-Host "      Link (R/L): $lines lignes"
                }
            }
        }
    }

    $total = $mainCount + $linkCount
    return $total
}

function Show-TaskTree {
    param($node, [string]$path = "", [int]$childIndex = 0, [int]$parentOffset = 0, [string]$indent = "")

    $isn = $node.Header.ISN_2
    $name = $node.Header.Description

    $currentPath = if ($path -eq "") { "$PrgId" } else { "$path.$childIndex" }

    Write-Host ""
    Write-Host "${indent}[$currentPath] ISN=$isn $name" -ForegroundColor Yellow

    $entries = Count-AllDataViewLines $node $name
    $firstVar = Get-VarName $parentOffset

    Write-Host "${indent}    TOTAL: $entries entries | Offset: $parentOffset | FirstVar: $firstVar" -ForegroundColor Green

    $nextOffset = $parentOffset + $entries

    if ($node.Task) {
        $subtasks = @($node.Task)
        for ($i = 0; $i -lt $subtasks.Count; $i++) {
            $nextOffset = Show-TaskTree $subtasks[$i] $currentPath ($i + 1) $nextOffset "$indent  "
        }
    }

    return $nextOffset
}

$mainTask = $xml.Application.ProgramsRepository.Programs.Task
Write-Host "=== Arbre avec Main Source + Links ===" -ForegroundColor Cyan
Show-TaskTree $mainTask
