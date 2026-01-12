param([string]$Project = "PVE", [int]$PrgId = 186)

$projectsPath = "D:\Data\Migration\XPA\PMS"
$xmlPath = "$projectsPath\$Project\Source\Prg_$PrgId.xml"

[xml]$xml = Get-Content $xmlPath -Encoding UTF8

$main = $xml.Application.ProgramsRepository.Programs.Task

Write-Host "=== Analyse Main Task (ISN=1) ===" -ForegroundColor Cyan
Write-Host ""

# Resource.Columns
$columns = @($main.Resource.Columns.Column)
Write-Host "Resource.Columns: $($columns.Count) colonnes" -ForegroundColor Yellow
$i = 0
foreach ($col in $columns) {
    $i++
    $type = $col.Type.val
    $name = $col.ColumnName.val
    Write-Host "  $i. Type=$type Name=$name"
    if ($i -ge 10) {
        Write-Host "  ... (et $($columns.Count - 10) autres)"
        break
    }
}

Write-Host ""
Write-Host "=== TaskLogic.LogicUnits ===" -ForegroundColor Yellow

foreach ($lu in $main.TaskLogic.LogicUnit) {
    $level = $lu.Level.val
    $type = $lu.Type.val
    $lines = @($lu.LogicLines.LogicLine)

    Write-Host ""
    Write-Host "LogicUnit Level=$level Type=$type : $($lines.Count) lignes" -ForegroundColor Green

    # Show first 5 lines for R/M (DataView Main)
    if ($level -eq "R" -and $type -eq "M") {
        Write-Host "  (Main Source DataView)"
        $j = 0
        foreach ($line in $lines) {
            $j++
            $fieldId = $line.Select.FieldID
            $dsn = $line.Select.DataSource.val
            $colName = $line.Select.ColumnName.val
            Write-Host "    Line $j : FieldID=$fieldId DSN=$dsn Col=$colName"
            if ($j -ge 10) {
                Write-Host "    ... (et $($lines.Count - 10) autres)"
                break
            }
        }
    }
}

Write-Host ""
Write-Host "=== Comptage final ===" -ForegroundColor Cyan

$totalRLines = 0
foreach ($lu in $main.TaskLogic.LogicUnit) {
    if ($lu.Level.val -eq "R") {
        $totalRLines += @($lu.LogicLines.LogicLine).Count
    }
}
Write-Host "Total lignes Level=R (toutes types): $totalRLines"
Write-Host "Resource.Columns: $($columns.Count)"
