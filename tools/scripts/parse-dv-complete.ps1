param([string]$Project = "PVE", [int]$PrgId = 186)

$projectsPath = "D:\Data\Migration\XPA\PMS"
$xmlPath = "$projectsPath\$Project\Source\Prg_$PrgId.xml"

[xml]$xml = Get-Content $xmlPath -Encoding UTF8

$main = $xml.Application.ProgramsRepository.Programs.Task

Write-Host "=== Parsing complet DataView (Main task) ===" -ForegroundColor Cyan
Write-Host ""

foreach ($lu in $main.TaskLogic.LogicUnit) {
    if ($lu.Level.val -eq "R" -and $lu.Type.val -eq "M") {
        $lines = @($lu.LogicLines.LogicLine)
        Write-Host "Total lignes: $($lines.Count)" -ForegroundColor Yellow
        Write-Host ""

        $currentSource = "Main"
        $sourceCount = @{}
        $totalVariables = 0

        foreach ($line in $lines) {
            # Check for data source declaration
            if ($line.DATAVIEW_SRC) {
                $dsn = $line.DATAVIEW_SRC.DataSource.val
                $currentSource = "Main[$dsn]"
                Write-Host ">>> Source: $currentSource" -ForegroundColor Cyan
                if (-not $sourceCount.ContainsKey($currentSource)) {
                    $sourceCount[$currentSource] = 0
                }
            }
            # Check for Link declaration
            elseif ($line.LNK) {
                $dsn = $line.LNK.DataSource.val
                $linkType = $line.LNK.LinkType.val
                $currentSource = "Link[$dsn] Type=$linkType"
                Write-Host ">>> Link: $currentSource" -ForegroundColor Magenta
                if (-not $sourceCount.ContainsKey($currentSource)) {
                    $sourceCount[$currentSource] = 0
                }
            }
            # Count Select as variable
            elseif ($line.Select) {
                $fieldId = $line.Select.FieldID
                $totalVariables++
                if ($sourceCount.ContainsKey($currentSource)) {
                    $sourceCount[$currentSource]++
                }
            }
            # Remark lines don't add variables
            elseif ($line.Remark) {
                # Skip comments
            }
        }

        Write-Host ""
        Write-Host "=== Decomposition par source ===" -ForegroundColor Green
        foreach ($src in $sourceCount.Keys) {
            Write-Host "  $src : $($sourceCount[$src]) variables"
        }
        Write-Host ""
        Write-Host "TOTAL VARIABLES (Main Task): $totalVariables" -ForegroundColor Yellow
    }
}
