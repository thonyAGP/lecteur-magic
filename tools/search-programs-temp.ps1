param()

$projects = @('REF','ADH','PBG','VIL','PVE','GES','CAB','EXB','POO','RET','PBP','WEL','Import','NET','SEN','PUG','REQ','TST')
$basePath = 'D:\Data\Migration\XPA\PMS'
$keywords = @('clotur','caution','garantie','depot','batch','nuit')

foreach ($proj in $projects) {
    $progsPath = Join-Path (Join-Path (Join-Path $basePath $proj) 'Source') 'Progs.xml'
    $headersPath = Join-Path (Join-Path (Join-Path $basePath $proj) 'Source') 'ProgramHeaders.xml'

    if (-not (Test-Path $progsPath) -or -not (Test-Path $headersPath)) { continue }

    # Build ID -> IDE position map from Progs.xml
    [xml]$progsDoc = Get-Content $progsPath -Encoding UTF8
    $ideMap = @{}
    $progs = $progsDoc.SelectNodes('//Program')
    for ($i = 0; $i -lt $progs.Count; $i++) {
        $xmlId = $progs[$i].GetAttribute('id')
        if ($xmlId) { $ideMap[$xmlId] = ($i + 1) }
    }

    # Parse ProgramHeaders for metadata
    [xml]$headersDoc = Get-Content $headersPath -Encoding UTF8
    $headers = $headersDoc.SelectNodes('//ProgramsRepositoryHeaders/Program/Header')

    foreach ($h in $headers) {
        $desc = $h.GetAttribute('Description')
        $xmlId = $h.GetAttribute('id')
        $publicEl = $h.SelectSingleNode('Public')
        $publicName = ''
        if ($publicEl) { $publicName = $publicEl.GetAttribute('val') }
        $lastIsn = $h.GetAttribute('LastIsn')
        $isEmpty = $h.GetAttribute('ISEMPTY_TSK')

        $matchFound = $false
        foreach ($kw in $keywords) {
            if ($desc -match $kw -or $publicName -match $kw) {
                $matchFound = $true
                break
            }
        }

        if ($matchFound) {
            $idePos = $ideMap[$xmlId]
            if (-not $idePos) { $idePos = '?' }
            $taskCount = $lastIsn
            if ($isEmpty -eq '1') { $taskCount = 0 }
            Write-Output ('{0}|{1}|{2}|{3}|{4}' -f $proj, $idePos, $desc.Trim(), $publicName, $taskCount)
        }
    }
}
