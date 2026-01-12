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

function Analyze-TaskColumns($node, [string]$name) {
    Write-Host ""
    Write-Host "=== $name (ISN=$($node.Header.ISN_2)) ===" -ForegroundColor Yellow

    # Resource.Columns - includes ALL columns (real and virtual)
    $columns = @($node.Resource.Columns.Column)
    Write-Host "Resource.Columns: $($columns.Count) total" -ForegroundColor Cyan

    $realCount = 0
    $virtualCount = 0
    $paramCount = 0

    foreach ($col in $columns) {
        # Check column type
        $type = $col.ColumnType.val  # R=Real, V=Virtual, P=Parameter?

        switch ($type) {
            "R" { $realCount++ }
            "V" { $virtualCount++ }
            "P" { $paramCount++ }
            default {
                if ($type) { Write-Host "  Unknown type: $type" }
            }
        }
    }

    Write-Host "  Real columns: $realCount"
    Write-Host "  Virtual columns: $virtualCount"
    Write-Host "  Parameter columns: $paramCount"

    # Also check LogicUnit R/M for actual DataView lines
    $dvLines = 0
    foreach ($lu in $node.TaskLogic.LogicUnit) {
        if ($lu.Level.val -eq "R" -and $lu.Type.val -eq "M") {
            $dvLines = @($lu.LogicLines.LogicLine).Count
        }
    }
    Write-Host "  DataView Main Source lines: $dvLines"

    return @{
        Columns = $columns.Count
        Real = $realCount
        Virtual = $virtualCount
        Param = $paramCount
        DVLines = $dvLines
    }
}

function Traverse-Tasks($node, [string]$indent = "") {
    $name = $node.Header.Description
    $stats = Analyze-TaskColumns $node "$indent$name"

    if ($node.Task) {
        foreach ($subtask in @($node.Task)) {
            Traverse-Tasks $subtask "$indent  "
        }
    }
}

$mainTask = $xml.Application.ProgramsRepository.Programs.Task
Write-Host "=== Analyse detaillee Resource.Columns ===" -ForegroundColor Cyan
Traverse-Tasks $mainTask
