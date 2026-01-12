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

# Get column names
$columns = @{}
foreach ($col in $task.Resource.Columns.Column) {
    $columns[$col.id] = $col.name
}

# Get expressions
$expressions = @{}
foreach ($expr in $task.Expressions.Expression) {
    $syntax = $expr.ExpSyntax.val
    $expressions[$expr.id] = $syntax
}

Write-Host "=== Ranges pour Tache $TaskIsn ===" -ForegroundColor Cyan
Write-Host ""

$lineNum = 0
foreach ($lu in $task.TaskLogic.LogicUnit) {
    if ($lu.Level.val -eq "R" -and $lu.Type.val -eq "M") {
        foreach ($line in $lu.LogicLines.LogicLine) {
            $lineNum++
            if ($line.Select) {
                $sel = $line.Select
                $colId = $sel.Column.val
                $colName = if ($columns.ContainsKey($colId)) { $columns[$colId] } else { "Col$colId" }
                
                $rangeMin = $sel.Range.Min.val
                $rangeMax = $sel.Range.Max.val
                
                if ($rangeMin -or $rangeMax) {
                    $minExpr = if ($rangeMin -and $expressions.ContainsKey($rangeMin)) { $expressions[$rangeMin] } else { $rangeMin }
                    $maxExpr = if ($rangeMax -and $expressions.ContainsKey($rangeMax)) { $expressions[$rangeMax] } else { $rangeMax }
                    
                    Write-Host "Ligne $lineNum : $colName"
                    if ($minExpr -eq $maxExpr) {
                        Write-Host "  Range: = $minExpr" -ForegroundColor Yellow
                    } else {
                        if ($minExpr) { Write-Host "  Min: $minExpr" -ForegroundColor Yellow }
                        if ($maxExpr) { Write-Host "  Max: $maxExpr" -ForegroundColor Yellow }
                    }
                }
            }
        }
    }
}
