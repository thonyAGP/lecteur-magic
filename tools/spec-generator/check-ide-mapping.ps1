# check-ide-mapping.ps1
# Show mapping between IDE positions and Prg_XXX.xml files

$progsPath = "D:\Data\Migration\XPA\PMS\ADH\Source\Progs.xml"
[xml]$progs = Get-Content $progsPath -Encoding UTF8
$programs = $progs.Application.ProgramsRepositoryOutLine.Programs.Program

Write-Host "Total programs in Progs.xml: $($programs.Count)"
Write-Host ""

# Show mapping for IDE 200-211 and check if more exist
Write-Host "Programs IDE 200-211:"
for ($i = 199; $i -lt [Math]::Min(211, $programs.Count); $i++) {
    $ide = $i + 1
    $internalId = $programs[$i].id
    Write-Host "  IDE $ide -> Prg_$internalId.xml"
}

Write-Host ""
Write-Host "Ventes folder mapping (IDE 232-255 expected):"

# Check what's at position 232-255
$ventesStart = 231  # 0-based index for IDE 232
if ($programs.Count -gt $ventesStart) {
    for ($i = $ventesStart; $i -lt [Math]::Min($ventesStart + 24, $programs.Count); $i++) {
        $ide = $i + 1
        $internalId = $programs[$i].id
        Write-Host "  IDE $ide -> Prg_$internalId.xml"
    }
} else {
    Write-Host "  Programs $($programs.Count) total - IDE 232+ do not exist"
}
