param([string]$Project = "ADH", [int]$PrgId = 285)

$projectsPath = "D:\Data\Migration\XPA\PMS"
$xmlPath = "$projectsPath\$Project\Source\Prg_$PrgId.xml"

[xml]$xml = Get-Content $xmlPath -Encoding UTF8

function Show-Tasks {
    param($node, [string]$indent = "")
    $isn = $node.Header.ISN_2
    $desc = $node.Header.Description
    Write-Host "$indent ISN=$isn $desc"
    if ($node.Task) {
        foreach ($subtask in @($node.Task)) {
            Show-Tasks $subtask "$indent  "
        }
    }
}

Show-Tasks $xml.Application.ProgramsRepository.Programs.Task
