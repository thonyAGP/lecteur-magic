param()

$basePath = 'D:\Data\Migration\XPA\PMS\PBG'
$sourcePath = Join-Path $basePath 'Source'
$progsPath = Join-Path $sourcePath 'Progs.xml'
$headersPath = Join-Path $sourcePath 'ProgramHeaders.xml'

# IDs to look up
$targetIds = @(195, 209, 199, 537, 543, 798, 817, 90)

# Build IDE map
[xml]$progsDoc = Get-Content $progsPath -Encoding UTF8
$ideMap = @{}
$progs = $progsDoc.SelectNodes('//Program')
for ($i = 0; $i -lt $progs.Count; $i++) {
    $xmlId = $progs[$i].GetAttribute('id')
    if ($xmlId) { $ideMap[$xmlId] = ($i + 1) }
}

# Parse headers
[xml]$headersDoc = Get-Content $headersPath -Encoding UTF8
$headers = $headersDoc.SelectNodes('//ProgramsRepositoryHeaders/Program/Header')

Write-Output "=== PBG Programs with 'cloture' references ==="
foreach ($h in $headers) {
    $xmlId = $h.GetAttribute('id')
    if ([int]$xmlId -in $targetIds) {
        $desc = $h.GetAttribute('Description')
        $publicEl = $h.SelectSingleNode('Public')
        $publicName = ''
        if ($publicEl) { $publicName = $publicEl.GetAttribute('val') }
        $lastIsn = $h.GetAttribute('LastIsn')
        $idePos = $ideMap[$xmlId]
        Write-Output "PBG IDE $idePos | ID $xmlId | $($desc.Trim()) | Public: $publicName | Tasks: $lastIsn"
    }
}
