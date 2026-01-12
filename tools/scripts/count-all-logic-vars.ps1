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

function Count-AllVariableDeclarations($taskNode) {
    $dvSelects = 0
    $dvOther = 0
    $logicVars = 0
    $updateVars = 0

    foreach ($lu in $taskNode.TaskLogic.LogicUnit) {
        $level = $lu.Level.val
        $type = $lu.Type.val

        foreach ($line in $lu.LogicLines.LogicLine) {
            # Count in DataView (R/M)
            if ($level -eq "R" -and $type -eq "M") {
                if ($line.Select) {
                    $dvSelects++
                }
                elseif ($line.DATAVIEW_SRC -or $line.LNK -or $line.Remark) {
                    # Don't count these as variables
                }
                else {
                    $dvOther++
                }
            }

            # Count Variable declarations in Logic
            if ($line.Variable) {
                $logicVars++
                $varNum = $line.Variable.Number.val
                $varName = $line.Variable.Name.val
                Write-Host "      Variable: #$varNum '$varName' (Level=$level Type=$type)"
            }

            # Count Update operations that might create variables
            if ($line.Update) {
                $fieldId = $line.Update.FieldID
                if ($fieldId) {
                    $updateVars++
                }
            }
        }
    }

    return @{
        DVSelects = $dvSelects
        DVOther = $dvOther
        LogicVars = $logicVars
        UpdateVars = $updateVars
    }
}

function Show-TaskTree {
    param($node, [string]$path = "", [int]$childIndex = 0, [int]$offset = 0, [string]$indent = "")

    $isn = [int]$node.Header.ISN_2
    $name = $node.Header.Description

    $currentPath = if ($path -eq "") { "$PrgId" } else { "$path.$childIndex" }

    Write-Host ""
    Write-Host "${indent}[$currentPath] ISN=$isn $name" -ForegroundColor Yellow

    $stats = Count-AllVariableDeclarations $node
    $total = $stats.DVSelects + $stats.DVOther + $stats.LogicVars

    $firstVar = Get-VarName $offset

    Write-Host "${indent}    DV Selects: $($stats.DVSelects) | DV Other: $($stats.DVOther) | Logic Vars: $($stats.LogicVars)" -ForegroundColor Green
    Write-Host "${indent}    TOTAL pour cette tache: $total | Offset: $offset | FirstVar: $firstVar" -ForegroundColor Cyan

    $nextOffset = $offset + $total

    if ($node.Task) {
        $subtasks = @($node.Task)
        for ($i = 0; $i -lt $subtasks.Count; $i++) {
            $nextOffset = Show-TaskTree $subtasks[$i] $currentPath ($i + 1) $nextOffset "$indent  "
        }
    }

    return $nextOffset
}

$mainTask = $xml.Application.ProgramsRepository.Programs.Task
Write-Host "=== Comptage COMPLET (DV + Logic + Updates) ===" -ForegroundColor Cyan
$total = Show-TaskTree $mainTask
Write-Host ""
Write-Host "TOTAL GLOBAL: $total" -ForegroundColor Magenta
