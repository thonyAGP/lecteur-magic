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

function Count-MainSourceLines($taskNode) {
    $count = 0
    foreach ($lu in $taskNode.TaskLogic.LogicUnit) {
        # Only count Level=R Type=M (Main Source DataView)
        if ($lu.Level.val -eq "R" -and $lu.Type.val -eq "M") {
            $count = @($lu.LogicLines.LogicLine).Count
            break
        }
    }
    return $count
}

function Show-TaskTree {
    param($node, [string]$path = "", [int]$childIndex = 0, [int]$parentOffset = 0, [string]$indent = "")

    $isn = $node.Header.ISN_2
    $name = $node.Header.Description
    $entries = Count-MainSourceLines $node
    $firstVar = Get-VarName $parentOffset

    $currentPath = if ($path -eq "") { "$PrgId" } else { "$path.$childIndex" }

    Write-Host "${indent}[$currentPath] ISN=$isn $name" -ForegroundColor Yellow
    Write-Host "${indent}  Main Source: $entries lignes | Offset: $parentOffset | FirstVar: $firstVar" -ForegroundColor Green

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
Write-Host "=== Arbre des taches PVE $PrgId ===" -ForegroundColor Cyan
Write-Host "Comptage: Seulement Level=R Type=M (Main Source)"
Write-Host ""
Show-TaskTree $mainTask
