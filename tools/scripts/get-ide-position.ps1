param([string]$Project = "PVE", [int]$PrgId = 186)

$projectsPath = "D:\Data\Migration\XPA\PMS"

# Get program name from headers
$headersPath = "$projectsPath\$Project\Source\ProgramHeaders.xml"
[xml]$headers = Get-Content $headersPath -Encoding UTF8
$prgHeader = $headers.Application.ProgramsRepositoryHeaders.Programs.Program | Where-Object { $_.ISN_2 -eq $PrgId }
$prgName = $prgHeader.PublicName

# Get IDE position from Progs.xml
$progsPath = "$projectsPath\$Project\Source\Progs.xml"
[xml]$progs = Get-Content $progsPath -Encoding UTF8

$idePos = 0
$idx = 0
foreach ($entry in $progs.Application.ProgramsRepository.ProgramsRepositoryOutLine.Programs.Program) {
    $idx++
    if ([int]$entry.ISN -eq $PrgId) {
        $idePos = $idx
        break
    }
}

Write-Host "Prg_$PrgId.xml = $Project IDE $idePos - $prgName" -ForegroundColor Cyan
