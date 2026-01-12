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

function Convert-IndexToVariable($idx) {
    if ($idx -lt 26) { return [string][char]([int][char]'A' + $idx) }
    elseif ($idx -lt 702) {
        $adjusted = $idx - 26
        $first = [int][math]::Floor($adjusted / 26)
        $second = [int]($adjusted % 26)
        return [string][char]([int][char]'A' + $first) + [string][char]([int][char]'A' + $second)
    }
    return "???"
}

$mainTask = $xml.Application.ProgramsRepository.Programs.Task
$task = Find-TaskByIsn $mainTask $TaskIsn

# Get column names by position
$columns = @()
foreach ($col in $task.Resource.Columns.Column) {
    $columns += $col.name
}

# Get expressions
$expressions = @{}
foreach ($expr in $task.Expressions.Expression) {
    $syntax = $expr.ExpSyntax.val
    $expressions[$expr.id] = $syntax
}

# Calculate offset (simplified - Main only for now)
$offset = 213  # From previous calculation

Write-Host "=== Tache 122.1.1.1 - Ranges ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Methode 1 - Lignes avec Ranges:" -ForegroundColor Yellow
Write-Host ""

foreach ($lu in $task.TaskLogic.LogicUnit) {
    if ($lu.Level.val -eq "R" -and $lu.Type.val -eq "M") {
        $lineNum = 0
        foreach ($line in $lu.LogicLines.LogicLine) {
            $lineNum++
            if ($line.Select) {
                $sel = $line.Select
                $colPos = [int]$sel.Column.val - 1
                $colName = if ($colPos -ge 0 -and $colPos -lt $columns.Count) { $columns[$colPos] } else { "Col?" }
                $fieldId = [int]$sel.FieldID
                $varIdx = $offset + $fieldId - 1
                $varName = Convert-IndexToVariable $varIdx
                
                $rangeMin = $sel.Range.MIN
                $rangeMax = $sel.Range.MAX
                
                if ($rangeMin -or $rangeMax) {
                    $minExpr = if ($rangeMin -and $expressions.ContainsKey($rangeMin)) { $expressions[$rangeMin] } else { $rangeMin }
                    $maxExpr = if ($rangeMax -and $expressions.ContainsKey($rangeMax)) { $expressions[$rangeMax] } else { $rangeMax }
                    
                    Write-Host "Ligne $lineNum : [$varName] $colName"
                    if ($minExpr -eq $maxExpr) {
                        Write-Host "         Range = $minExpr" -ForegroundColor Green
                    } else {
                        Write-Host "         Range: $minExpr .. $maxExpr" -ForegroundColor Green
                    }
                }
            }
        }
    }
}

Write-Host ""
Write-Host "Methode 2 - SQL equivalent:" -ForegroundColor Yellow
Write-Host ""

$whereClauses = @()
foreach ($lu in $task.TaskLogic.LogicUnit) {
    if ($lu.Level.val -eq "R" -and $lu.Type.val -eq "M") {
        foreach ($line in $lu.LogicLines.LogicLine) {
            if ($line.Select) {
                $sel = $line.Select
                $colPos = [int]$sel.Column.val - 1
                $colName = if ($colPos -ge 0 -and $colPos -lt $columns.Count) { $columns[$colPos] } else { "col$colPos" }
                
                $rangeMin = $sel.Range.MIN
                $rangeMax = $sel.Range.MAX
                
                if ($rangeMin -or $rangeMax) {
                    $minExpr = if ($rangeMin -and $expressions.ContainsKey($rangeMin)) { $expressions[$rangeMin] } else { $rangeMin }
                    $maxExpr = if ($rangeMax -and $expressions.ContainsKey($rangeMax)) { $expressions[$rangeMax] } else { $rangeMax }
                    
                    if ($minExpr -eq $maxExpr) {
                        $whereClauses += "$colName = $minExpr"
                    } else {
                        $whereClauses += "$colName BETWEEN $minExpr AND $maxExpr"
                    }
                }
            }
        }
    }
}

Write-Host "SELECT * FROM gestion_devise_session"
Write-Host "WHERE $($whereClauses -join ' AND ')" -ForegroundColor Green
