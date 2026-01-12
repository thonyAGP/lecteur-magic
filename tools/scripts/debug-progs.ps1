param([string]$Project = "PVE")

$projectsPath = "D:\Data\Migration\XPA\PMS"
$progsPath = "$projectsPath\$Project\Source\Progs.xml"

[xml]$progs = Get-Content $progsPath -Encoding UTF8

$entries = $progs.Application.ProgramsRepository.ProgramsRepositoryOutLine.Programs.Program

Write-Host "Total programmes: $($entries.Count)"
Write-Host ""
Write-Host "Premiers programmes:"

$idx = 0
foreach ($entry in $entries) {
    $idx++
    if ($idx -le 15) {
        Write-Host "  IDE $idx : $($entry.OuterXml.Substring(0, [Math]::Min(100, $entry.OuterXml.Length)))"
    }
}

Write-Host ""
Write-Host "Cherchons ISN 186..."
$idx = 0
foreach ($entry in $entries) {
    $idx++
    # Check different attribute names
    $isn = $entry.ISN
    $isn2 = $entry.ISN_2
    $id = $entry.id
    
    if ($isn -eq "186" -or $isn2 -eq "186" -or $id -eq "186") {
        Write-Host "Trouve a IDE $idx : ISN=$isn ISN_2=$isn2 id=$id"
    }
}
