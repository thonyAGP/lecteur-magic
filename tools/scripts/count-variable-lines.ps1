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

function Count-VariableLines($taskNode) {
    # Count lines that actually create variables in R/M DataView
    # Exclude: DATAVIEW_SRC, LNK, END_LINK, Remark
    $count = 0
    $details = @()

    foreach ($lu in $taskNode.TaskLogic.LogicUnit) {
        if ($lu.Level.val -eq "R" -and $lu.Type.val -eq "M") {
            foreach ($line in $lu.LogicLines.LogicLine) {
                $children = $line.ChildNodes | ForEach-Object { $_.Name }

                # Check what type of line this is
                if ($line.Select) {
                    $count++
                    $details += "Select"
                }
                elseif ($line.Virtual) {
                    $count++
                    $details += "Virtual"
                }
                elseif ($line.DATAVIEW_SRC) {
                    # Don't count - source declaration
                    $details += "(DATAVIEW_SRC - skip)"
                }
                elseif ($line.LNK) {
                    # Don't count - link declaration
                    $details += "(LNK - skip)"
                }
                elseif ($line.END_LINK) {
                    # Don't count - end of link
                    $details += "(END_LINK - skip)"
                }
                elseif ($line.Remark) {
                    # Don't count - comment
                    $details += "(Remark - skip)"
                }
                else {
                    # Unknown - might create a variable?
                    $count++
                    $details += "OTHER: $($children -join ',')"
                }
            }
        }
    }

    return @{
        Count = $count
        Details = $details
    }
}

function Show-TaskTree {
    param($node, [string]$path = "", [int]$childIndex = 0, [int]$offset = 0, [string]$indent = "")

    $isn = [int]$node.Header.ISN_2
    $name = $node.Header.Description

    $currentPath = if ($path -eq "") { "$PrgId" } else { "$path.$childIndex" }

    $stats = Count-VariableLines $node
    $firstVar = Get-VarName $offset

    Write-Host ""
    Write-Host "${indent}[$currentPath] ISN=$isn $name" -ForegroundColor Yellow
    Write-Host "${indent}    Variable lines: $($stats.Count) | Offset: $offset | FirstVar: $firstVar" -ForegroundColor Green

    $nextOffset = $offset + $stats.Count

    if ($node.Task) {
        $subtasks = @($node.Task)
        for ($i = 0; $i -lt $subtasks.Count; $i++) {
            $nextOffset = Show-TaskTree $subtasks[$i] $currentPath ($i + 1) $nextOffset "$indent  "
        }
    }

    return $nextOffset
}

# Start with MainOffset from Prg_1.xml
$mainPrgPath = "$projectsPath\$Project\Source\Prg_1.xml"
[xml]$mainPrgXml = Get-Content $mainPrgPath -Encoding UTF8
$mainPrgTask = $mainPrgXml.Application.ProgramsRepository.Programs.Task
$mainStats = Count-VariableLines $mainPrgTask
$mainOffset = $mainStats.Count

Write-Host "=== Comptage lignes variables (excl. DATAVIEW_SRC, LNK, Remark) ===" -ForegroundColor Cyan
Write-Host "MainOffset (Prg_1.xml): $mainOffset" -ForegroundColor Yellow

$mainTask = $xml.Application.ProgramsRepository.Programs.Task
$total = Show-TaskTree $mainTask "" 0 $mainOffset
