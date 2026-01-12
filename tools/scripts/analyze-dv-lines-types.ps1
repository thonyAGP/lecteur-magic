param([string]$Project = "PVE", [int]$PrgId = 186)

$projectsPath = "D:\Data\Migration\XPA\PMS"
$xmlPath = "$projectsPath\$Project\Source\Prg_$PrgId.xml"

[xml]$xml = Get-Content $xmlPath -Encoding UTF8

$main = $xml.Application.ProgramsRepository.Programs.Task

Write-Host "=== Analyse detaillee des lignes DataView (Main) ===" -ForegroundColor Cyan
Write-Host ""

foreach ($lu in $main.TaskLogic.LogicUnit) {
    if ($lu.Level.val -eq "R" -and $lu.Type.val -eq "M") {
        $lines = @($lu.LogicLines.LogicLine)
        Write-Host "LogicUnit R/M : $($lines.Count) lignes totales" -ForegroundColor Yellow
        Write-Host ""

        $selectCount = 0
        $virtualCount = 0
        $linkCount = 0
        $otherCount = 0
        $emptyCount = 0

        $lineNum = 0
        foreach ($line in $lines) {
            $lineNum++
            $hasSelect = $null -ne $line.Select
            $hasVirtual = $null -ne $line.Virtual
            $hasLink = $null -ne $line.Link
            $hasField = $null -ne $line.Field

            $type = "???"
            if ($hasSelect) {
                $selectCount++
                $type = "Select"
                $dsn = $line.Select.DataSource.val
                $col = $line.Select.ColumnName.val
                $fieldId = $line.Select.FieldID
                Write-Host "  Line $lineNum : $type FieldID=$fieldId DSN=$dsn Col=$col"
            }
            elseif ($hasVirtual) {
                $virtualCount++
                $type = "Virtual"
                Write-Host "  Line $lineNum : $type"
            }
            elseif ($hasLink) {
                $linkCount++
                $type = "Link"
                Write-Host "  Line $lineNum : $type"
            }
            elseif ($hasField) {
                $otherCount++
                $type = "Field"
                Write-Host "  Line $lineNum : $type"
            }
            else {
                $emptyCount++
                # Check what child elements exist
                $children = $line.ChildNodes | ForEach-Object { $_.Name }
                Write-Host "  Line $lineNum : Empty? Children: $($children -join ', ')"
            }

            if ($lineNum -ge 30) {
                Write-Host "  ... (showing first 30 of $($lines.Count))"
                break
            }
        }

        Write-Host ""
        Write-Host "=== Totaux ===" -ForegroundColor Green
        Write-Host "  Select: $selectCount"
        Write-Host "  Virtual: $virtualCount"
        Write-Host "  Link: $linkCount"
        Write-Host "  Field: $otherCount"
        Write-Host "  Empty/Other: $emptyCount"
        Write-Host "  TOTAL: $($selectCount + $virtualCount + $linkCount + $otherCount + $emptyCount)"
    }
}
