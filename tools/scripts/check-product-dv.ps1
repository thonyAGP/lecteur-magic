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
$productTask = Find-TaskByIsn $mainTask 3  # ISN=3 = Product

Write-Host "=== Analyse DataView de Product (ISN=3) ===" -ForegroundColor Cyan
Write-Host ""

# Show Resource.Columns (local columns definition)
$columns = @($productTask.Resource.Columns.Column)
Write-Host "Resource.Columns: $($columns.Count) colonnes locales" -ForegroundColor Yellow

# Show all LogicUnits
Write-Host ""
Write-Host "=== LogicUnits ===" -ForegroundColor Yellow

foreach ($lu in $productTask.TaskLogic.LogicUnit) {
    $level = $lu.Level.val
    $type = $lu.Type.val
    $lines = @($lu.LogicLines.LogicLine)

    Write-Host ""
    Write-Host "LogicUnit Level=$level Type=$type : $($lines.Count) lignes" -ForegroundColor Green

    if ($level -eq "R" -and $type -eq "M") {
        Write-Host "  === Main Source DataView ===" -ForegroundColor Cyan
        $lineNum = 0
        foreach ($line in $lines) {
            $lineNum++
            $fieldId = $line.Select.FieldID
            $dsn = $line.Select.DataSource.val
            $colName = $line.Select.ColumnName.val

            # Calculate variable name from FieldID
            $varName = Get-VarName ([int]$fieldId - 1)  # FieldID is 1-based?

            Write-Host "    Line $lineNum : FieldID=$fieldId Var=$varName DSN=$dsn"

            if ($lineNum -ge 15) {
                Write-Host "    ... (et $($lines.Count - 15) autres)"
                break
            }
        }
    }
}

Write-Host ""
Write-Host "=== Premier et dernier FieldID ===" -ForegroundColor Yellow
foreach ($lu in $productTask.TaskLogic.LogicUnit) {
    if ($lu.Level.val -eq "R" -and $lu.Type.val -eq "M") {
        $lines = @($lu.LogicLines.LogicLine)
        $firstFieldId = $lines[0].Select.FieldID
        $lastFieldId = $lines[-1].Select.FieldID
        Write-Host "Premier FieldID: $firstFieldId (var $(Get-VarName ([int]$firstFieldId - 1)))"
        Write-Host "Dernier FieldID: $lastFieldId (var $(Get-VarName ([int]$lastFieldId - 1)))"
    }
}
