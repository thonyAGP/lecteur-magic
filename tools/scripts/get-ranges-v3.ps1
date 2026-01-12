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

# Load VG names
$vgNames = @{}
$mainPrgPath = "$projectsPath\$Project\Source\Prg_1.xml"
if (Test-Path $mainPrgPath) {
    [xml]$mainPrgXml = Get-Content $mainPrgPath -Encoding UTF8
    foreach ($col in $mainPrgXml.Application.ProgramsRepository.Programs.Task.Resource.Columns.Column) {
        $vgNames["$($col.id)"] = $col.name
    }
}

$mainTask = $xml.Application.ProgramsRepository.Programs.Task
$task = Find-TaskByIsn $mainTask $TaskIsn

# Get column names - from Resource.Columns
$columnNames = @{}
$columnsList = @()
foreach ($col in $task.Resource.Columns.Column) {
    $columnNames[$col.id] = $col.name
    $columnsList += @{ id = $col.id; name = $col.name }
}

Write-Host "Colonnes de la tache:" -ForegroundColor Gray
$pos = 0
foreach ($c in $columnsList) {
    $pos++
    Write-Host "  Pos $pos (id=$($c.id)): $($c.name)"
}
Write-Host ""

# Get expressions with VG resolution
$expressions = @{}
foreach ($expr in $task.Expressions.Expression) {
    $syntax = $expr.ExpSyntax.val
    # Resolve VG references
    $resolved = [regex]::Replace($syntax, '\{32768,(\d+)\}', {
        param($match)
        $vgId = $match.Groups[1].Value
        if ($vgNames.ContainsKey($vgId)) { return "VG.$($vgNames[$vgId])" }
        return "VG.$vgId"
    })
    $expressions[$expr.id] = $resolved
}

$offset = 213

Write-Host "=== Tache 122.1.1.1 - Ranges ===" -ForegroundColor Cyan
Write-Host ""

foreach ($lu in $task.TaskLogic.LogicUnit) {
    if ($lu.Level.val -eq "R" -and $lu.Type.val -eq "M") {
        $lineNum = 0
        foreach ($line in $lu.LogicLines.LogicLine) {
            $lineNum++
            if ($line.Select) {
                $sel = $line.Select
                $colVal = $sel.Column.val
                # Column.val is position (1-based) for this task
                $colIdx = [int]$colVal - 1
                $colName = if ($colIdx -ge 0 -and $colIdx -lt $columnsList.Count) { $columnsList[$colIdx].name } else { "Col$colVal" }
                
                $fieldId = [int]$sel.FieldID
                $varIdx = $offset + $fieldId - 1
                $varName = Convert-IndexToVariable $varIdx
                
                $rangeMin = $sel.Range.MIN
                $rangeMax = $sel.Range.MAX
                
                if ($rangeMin -or $rangeMax) {
                    $minExpr = if ($rangeMin -and $expressions.ContainsKey($rangeMin)) { $expressions[$rangeMin] } else { "Exp$rangeMin" }
                    $maxExpr = if ($rangeMax -and $expressions.ContainsKey($rangeMax)) { $expressions[$rangeMax] } else { "Exp$rangeMax" }
                    
                    Write-Host "Ligne $lineNum : [$varName] $colName" -ForegroundColor White
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
Write-Host "SQL equivalent:" -ForegroundColor Yellow

$whereClauses = @()
foreach ($lu in $task.TaskLogic.LogicUnit) {
    if ($lu.Level.val -eq "R" -and $lu.Type.val -eq "M") {
        foreach ($line in $lu.LogicLines.LogicLine) {
            if ($line.Select) {
                $sel = $line.Select
                $colVal = $sel.Column.val
                $colIdx = [int]$colVal - 1
                $colName = if ($colIdx -ge 0 -and $colIdx -lt $columnsList.Count) { $columnsList[$colIdx].name } else { "col$colVal" }
                
                $rangeMin = $sel.Range.MIN
                $rangeMax = $sel.Range.MAX
                
                if ($rangeMin -or $rangeMax) {
                    $minExpr = if ($rangeMin -and $expressions.ContainsKey($rangeMin)) { $expressions[$rangeMin] } else { "?" }
                    $maxExpr = if ($rangeMax -and $expressions.ContainsKey($rangeMax)) { $expressions[$rangeMax] } else { "?" }
                    
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
Write-Host "WHERE $($whereClauses -join "`n  AND ")" -ForegroundColor Green
