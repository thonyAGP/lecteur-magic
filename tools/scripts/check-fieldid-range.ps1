param([string]$Project = "PVE", [int]$PrgId = 186)

$projectsPath = "D:\Data\Migration\XPA\PMS"
$xmlPath = "$projectsPath\$Project\Source\Prg_$PrgId.xml"

[xml]$xml = Get-Content $xmlPath -Encoding UTF8

function Get-VarName($index) {
    if ($index -lt 0) { return "?" }
    if ($index -lt 26) {
        return [char](65 + $index)
    }
    $idx = $index - 26
    $first = [math]::Floor($idx / 26)
    $second = $idx % 26
    return "$([char](65+[int]$first))$([char](65+[int]$second))"
}

function Get-FieldIdRange($taskNode) {
    $minFid = [int]::MaxValue
    $maxFid = 0
    $count = 0

    foreach ($lu in $taskNode.TaskLogic.LogicUnit) {
        if ($lu.Level.val -eq "R" -and $lu.Type.val -eq "M") {
            foreach ($line in $lu.LogicLines.LogicLine) {
                if ($line.Select -and $line.Select.FieldID) {
                    $fid = [int]$line.Select.FieldID
                    $count++
                    if ($fid -lt $minFid) { $minFid = $fid }
                    if ($fid -gt $maxFid) { $maxFid = $fid }
                }
            }
        }
    }

    if ($count -eq 0) { $minFid = 0 }
    return @{ Min = $minFid; Max = $maxFid; Count = $count }
}

function Show-FieldIdTree {
    param($node, [int]$depth = 0, [string]$path = "")

    $isn = [int]$node.Header.ISN_2
    $name = $node.Header.Description

    $indent = "  " * $depth
    $currentPath = if ($path -eq "") { "$PrgId" } else { "$path" }

    $range = Get-FieldIdRange $node
    $minVar = Get-VarName ($range.Min - 1)
    $maxVar = Get-VarName ($range.Max - 1)

    Write-Host "${indent}[$currentPath] ISN=$isn $name" -ForegroundColor Yellow
    Write-Host "${indent}  FieldID range: $($range.Min) - $($range.Max) | Count: $($range.Count)" -ForegroundColor Green
    Write-Host "${indent}  Variables: $minVar - $maxVar" -ForegroundColor Cyan

    if ($node.Task) {
        $subtasks = @($node.Task)
        for ($i = 0; $i -lt $subtasks.Count; $i++) {
            $newPath = if ($path -eq "") { "$PrgId.$($i+1)" } else { "$path.$($i+1)" }
            Show-FieldIdTree $subtasks[$i] ($depth + 1) $newPath
        }
    }
}

$mainTask = $xml.Application.ProgramsRepository.Programs.Task
Write-Host "=== FieldID Ranges par tache ===" -ForegroundColor Cyan
Write-Host ""
Show-FieldIdTree $mainTask
