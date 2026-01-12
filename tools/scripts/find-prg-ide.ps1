param([string]$Project = "PVE", [int]$PrgId = 186)

$projectsPath = "D:\Data\Migration\XPA\PMS"
$progsPath = "$projectsPath\$Project\Source\Progs.xml"

[xml]$progs = Get-Content $progsPath -Encoding UTF8

$idx = 0
foreach ($entry in $progs.Application.ProgramsRepository.ProgramsRepositoryOutLine.Programs.Program) {
    $idx++
    $isn = [int]$entry.ISN
    if ($isn -eq $PrgId) {
        Write-Host "Trouve: Position IDE = $idx, ISN = $isn"
        break
    }
}

if ($idx -eq 0 -or $isn -ne $PrgId) {
    Write-Host "Non trouve dans ProgramsRepositoryOutLine"
    Write-Host "Cherchons autrement..."
    
    # List first 10 entries
    $idx = 0
    foreach ($entry in $progs.Application.ProgramsRepository.ProgramsRepositoryOutLine.Programs.Program) {
        $idx++
        if ($idx -le 10) {
            Write-Host "  IDE $idx : ISN=$($entry.ISN)"
        }
    }
}

# Also get name from headers
$headersPath = "$projectsPath\$Project\Source\ProgramHeaders.xml"
[xml]$headers = Get-Content $headersPath -Encoding UTF8
$prgHeader = $headers.Application.ProgramsRepositoryHeaders.Programs.Program | Where-Object { [int]$_.ISN_2 -eq $PrgId }
if ($prgHeader) {
    Write-Host "Nom: $($prgHeader.PublicName)"
}
