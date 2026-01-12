param([string]$Project = "ADH", [int]$PrgId = 155, [int]$TaskIsn = 71)

$projectsPath = "D:\Data\Migration\XPA\PMS"
$xmlPath = "$projectsPath\$Project\Source\Prg_$PrgId.xml"

[xml]$xml = Get-Content $xmlPath -Encoding UTF8

function Get-ChildPosition($parent, $childIsn) {
    $pos = 0
    foreach ($child in @($parent.Task)) {
        $pos++
        if ($child.Header.ISN_2 -eq $childIsn) {
            return $pos
        }
    }
    return 0
}

function Find-PathWithPositions {
    param($node, [int]$targetIsn, [System.Collections.ArrayList]$pathInfo)
    
    if ($node.Header.ISN_2 -eq $targetIsn) {
        return $true
    }
    
    if ($node.Task) {
        $pos = 0
        foreach ($subtask in @($node.Task)) {
            $pos++
            $newPath = [System.Collections.ArrayList]::new($pathInfo)
            [void]$newPath.Add(@{ isn = $subtask.Header.ISN_2; pos = $pos; name = $subtask.Header.Description })
            if (Find-PathWithPositions $subtask $targetIsn $newPath) {
                $pathInfo.Clear()
                $pathInfo.AddRange($newPath)
                return $true
            }
        }
    }
    return $false
}

$mainTask = $xml.Application.ProgramsRepository.Programs.Task
$pathInfo = [System.Collections.ArrayList]::new()

# Get IDE position of program
$headersPath = "$projectsPath\$Project\Source\ProgramHeaders.xml"
[xml]$headers = Get-Content $headersPath -Encoding UTF8
$prgHeader = $headers.Application.ProgramsRepositoryHeaders.Programs.Program | Where-Object { $_.ISN_2 -eq $PrgId }
$prgName = $prgHeader.PublicName

$progsPath = "$projectsPath\$Project\Source\Progs.xml"
[xml]$progs = Get-Content $progsPath -Encoding UTF8
$idePos = 0
$idx = 0
foreach ($entry in $progs.Application.ProgramsRepository.ProgramsRepositoryOutLine.Programs.Program) {
    $idx++
    if ($entry.ISN -eq $PrgId) {
        $idePos = $idx
        break
    }
}

Write-Host "Programme: $Project IDE $idePos - $prgName" -ForegroundColor Cyan

if (Find-PathWithPositions $mainTask $TaskIsn $pathInfo) {
    $hierarchyPath = "$idePos"
    foreach ($p in $pathInfo) {
        $hierarchyPath += ".$($p.pos)"
    }
    Write-Host "Chemin hierarchique: $hierarchyPath" -ForegroundColor Green
    Write-Host ""
    Write-Host "Detail du chemin:"
    $level = 0
    foreach ($p in $pathInfo) {
        $level++
        $indent = "  " * $level
        Write-Host "$indent[$($p.pos)] ISN=$($p.isn) : $($p.name)"
    }
} else {
    Write-Host "TaskIsn=$TaskIsn non trouve" -ForegroundColor Red
}
