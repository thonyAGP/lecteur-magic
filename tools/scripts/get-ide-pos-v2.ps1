param([string]$Project = "PVE", [int]$PrgId = 186)

$projectsPath = "D:\Data\Migration\XPA\PMS"
$progsPath = "$projectsPath\$Project\Source\Progs.xml"

[xml]$progs = Get-Content $progsPath -Encoding UTF8

$idx = 0
$found = $false
foreach ($entry in $progs.Application.ProgramsRepositoryOutLine.Programs.Program) {
    $idx++
    $id = [int]$entry.id
    if ($id -eq $PrgId) {
        $found = $true
        break
    }
}

if ($found) {
    # Get name from headers
    $headersPath = "$projectsPath\$Project\Source\ProgramHeaders.xml"
    [xml]$headers = Get-Content $headersPath -Encoding UTF8
    $prgHeader = $headers.Application.ProgramsRepositoryHeaders.Programs.Program | Where-Object { [int]$_.ISN_2 -eq $PrgId }
    $prgName = if ($prgHeader) { $prgHeader.PublicName } else { "?" }
    
    Write-Host "Prg_$PrgId.xml = $Project IDE $idx - $prgName" -ForegroundColor Green
} else {
    Write-Host "Non trouve" -ForegroundColor Red
}
