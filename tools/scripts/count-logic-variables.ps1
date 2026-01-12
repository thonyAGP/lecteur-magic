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

function Count-TaskVariables($taskNode, [string]$taskName) {
    $dvCount = 0
    $varCount = 0

    foreach ($lu in $taskNode.TaskLogic.LogicUnit) {
        $level = $lu.Level.val
        $type = $lu.Type.val

        foreach ($line in $lu.LogicLines.LogicLine) {
            # Count DataView entries (Select in R/M)
            if ($level -eq "R" -and $type -eq "M" -and $line.Select) {
                $dvCount++
            }

            # Count Variable declarations in Logic
            if ($line.Variable) {
                $varCount++
                $varNum = $line.Variable.Number.val
                $varName = $line.Variable.Name.val
                Write-Host "      Variable in Logic: #$varNum '$varName' (Level=$level Type=$type)"
            }
        }
    }

    return @{
        DV = $dvCount
        Var = $varCount
        Total = $dvCount + $varCount
    }
}

function Show-TaskTree {
    param($node, [string]$path = "", [int]$childIndex = 0, [int]$parentOffset = 0, [string]$indent = "")

    $isn = $node.Header.ISN_2
    $name = $node.Header.Description

    $currentPath = if ($path -eq "") { "$PrgId" } else { "$path.$childIndex" }

    Write-Host ""
    Write-Host "${indent}[$currentPath] ISN=$isn $name" -ForegroundColor Yellow

    $stats = Count-TaskVariables $node $name
    $firstVar = Get-VarName $parentOffset

    Write-Host "${indent}    DV entries: $($stats.DV) | Logic Variables: $($stats.Var) | TOTAL: $($stats.Total)" -ForegroundColor Green
    Write-Host "${indent}    Offset: $parentOffset | FirstVar: $firstVar" -ForegroundColor Cyan

    $nextOffset = $parentOffset + $stats.Total

    if ($node.Task) {
        $subtasks = @($node.Task)
        for ($i = 0; $i -lt $subtasks.Count; $i++) {
            $nextOffset = Show-TaskTree $subtasks[$i] $currentPath ($i + 1) $nextOffset "$indent  "
        }
    }

    return $nextOffset
}

$mainTask = $xml.Application.ProgramsRepository.Programs.Task
Write-Host "=== Comptage DataView + Logic Variables ===" -ForegroundColor Cyan
Show-TaskTree $mainTask
