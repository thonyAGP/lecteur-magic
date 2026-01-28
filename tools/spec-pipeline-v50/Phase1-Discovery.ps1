#Requires -Version 5.1
<#
.SYNOPSIS
    Phase 1: DISCOVERY - Cartographier le terrain

.DESCRIPTION
    Extraction rigoureuse des informations du programme:
    1.1 Identification (XML, metadata, PublicName, ECF)
    1.2 Structure taches (arbre, [D], lignes logic)
    1.3 Call Graph (callers, callees 3 niveaux, chaine Main)
    1.4 Verification orphelin (4 criteres)

.OUTPUTS
    discovery.json avec toutes les donnees extraites
#>

param(
    [Parameter(Mandatory = $true)]
    [string]$Project,

    [Parameter(Mandatory = $true)]
    [int]$IdePosition,

    [Parameter(Mandatory = $true)]
    [string]$OutputFile,

    [hashtable]$Config
)

$ErrorActionPreference = "Stop"

# ============================================================================
# CONFIGURATION ET PATHS
# ============================================================================

$ProjectsPath = if ($Config) { $Config.ProjectsPath } else { "D:\Data\Migration\XPA\PMS" }
$KbPath = Join-Path $env:USERPROFILE ".magic-kb\knowledge.db"
# Utiliser chemin complet pour sqlite3 (installe dans C:\Tools\sqlite)
$Sqlite3 = "C:\Tools\sqlite\sqlite3.exe"
if (!(Test-Path $Sqlite3)) {
    $Sqlite3 = "sqlite3"  # Fallback si dans PATH
}

# ECF Programs ADH (ne sont jamais orphelins)
$AdhEcfPrograms = @{
    27  = "Separation"; 28 = "Fusion"
    53  = "EXTRAIT_EASY_CHECKOUT"; 54 = "FACTURES_CHECK_OUT"
    64  = "SOLDE_EASY_CHECK_OUT"; 65 = "EDITION_EASY_CHECK_OUT"
    69  = "EXTRAIT_COMPTE"; 70 = "EXTRAIT_NOM"; 71 = "EXTRAIT_DATE"
    72  = "EXTRAIT_CUM"; 73 = "EXTRAIT_IMP"; 76 = "EXTRAIT_SERVICE"
    84  = "CARACT_INTERDIT"; 97 = "Saisie_facture_tva"; 111 = "GARANTIE"
    121 = "Gestion_Caisse_142"; 149 = "CALC_STOCK_PRODUIT"; 152 = "RECUP_CLASSE_MOP"
    178 = "GET_PRINTER"; 180 = "SET_LIST_NUMBER"; 181 = "RAZ_PRINTER"
    185 = "CHAINED_LIST_DEFAULT"; 192 = "SOLDE_COMPTE"
    208 = "OPEN_PHONE_LINE"; 210 = "CLOSE_PHONE_LINE"
    229 = "PRINT_TICKET"; 243 = "DEVERSEMENT"
}

function Write-Step {
    param([string]$Step, [string]$Message)
    Write-Host "  [$Step] $Message" -ForegroundColor Gray
}

function Write-Success {
    param([string]$Message)
    Write-Host "  [OK] $Message" -ForegroundColor Green
}

function Write-Warning2 {
    param([string]$Message)
    Write-Host "  [!!] $Message" -ForegroundColor Yellow
}

# ============================================================================
# 1.1 IDENTIFICATION DU PROGRAMME
# ============================================================================

Write-Step "1.1" "Identification du programme..."

$Identification = @{
    Project      = $Project
    IdePosition  = $IdePosition
    XmlFile      = $null
    XmlPath      = $null
    XmlId        = $null  # Le numero dans Prg_X.xml (different de IdePosition!)
    Name         = $null
    PublicName   = $null
    Type         = "Batch"
    Folder       = "Unknown"
    Description  = $null
    IsEmpty      = $false
}

$PrgPath = Join-Path $ProjectsPath "$Project\Source"

# ETAPE CRITIQUE: Lire Progs.xml pour obtenir le mapping IDE Position -> XML File ID
# La position dans la liste (1-based) = IDE Position
# L'attribut 'id' = numero du fichier Prg_X.xml
$ProgsPath = Join-Path $PrgPath "Progs.xml"
$XmlFileId = $null

if (Test-Path $ProgsPath) {
    try {
        [xml]$ProgsXml = Get-Content $ProgsPath -Encoding UTF8 -Raw
        $AllPrograms = @($ProgsXml.Application.ProgramsRepositoryOutLine.Programs.Program)

        # La position dans la liste est 1-based, donc IdePosition 237 = index 236
        $Index = $IdePosition - 1

        if ($Index -ge 0 -and $Index -lt $AllPrograms.Count) {
            $XmlFileId = [int]$AllPrograms[$Index].id
            $Identification.XmlId = $XmlFileId
            $Identification.XmlFile = "Prg_$XmlFileId.xml"
            Write-Success "Mapping Progs.xml: IDE $IdePosition -> Prg_$XmlFileId.xml"
        }
        else {
            Write-Warning2 "IDE $IdePosition hors limites (max: $($AllPrograms.Count))"
        }
    }
    catch {
        Write-Warning2 "Erreur lecture Progs.xml: $_"
    }
}

# Lire ProgramHeaders.xml pour obtenir les metadata (en utilisant XmlFileId)
$HeadersPath = Join-Path $PrgPath "ProgramHeaders.xml"
if ($XmlFileId -and (Test-Path $HeadersPath)) {
    try {
        [xml]$Headers = Get-Content $HeadersPath -Encoding UTF8 -Raw
        $ProgHeader = $Headers.Application.ProgramsRepositoryHeaders.Program | Where-Object {
            [int]$_.Header.id -eq $XmlFileId
        }

        if ($ProgHeader) {
            $Identification.Name = $ProgHeader.Header.Description
            $Identification.PublicName = if ($ProgHeader.Header.PublicName) { $ProgHeader.Header.PublicName } else { $null }
            Write-Success "Metadata ProgramHeaders: $($Identification.Name)"
        }
    }
    catch {
        Write-Warning2 "Erreur lecture ProgramHeaders.xml: $_"
    }
}

# FALLBACK: Si pas de Progs.xml, essayer directement (ancien comportement)
if (!$Identification.XmlFile) {
    Write-Warning2 "Progs.xml non trouve, fallback sur Prg_$IdePosition.xml"
    $DirectXmlPath = Join-Path $PrgPath "Prg_$IdePosition.xml"
    if (Test-Path $DirectXmlPath) {
        $Identification.XmlFile = "Prg_$IdePosition.xml"
        $Identification.XmlId = $IdePosition
    }
}

# Construire le chemin complet
if ($Identification.XmlFile) {
    $Identification.XmlPath = Join-Path $PrgPath $Identification.XmlFile
    if (!(Test-Path $Identification.XmlPath)) {
        # Essayer dans Programs/
        $AltPath = Join-Path $PrgPath "Programs\$($Identification.XmlFile)"
        if (Test-Path $AltPath) {
            $Identification.XmlPath = $AltPath
        }
    }
}

# Extraire les metadata du XML programme
if ($Identification.XmlPath -and (Test-Path $Identification.XmlPath)) {
    try {
        $Xml = [xml](Get-Content $Identification.XmlPath -Encoding UTF8 -Raw)

        # Nom si pas encore defini
        if (!$Identification.Name -and $Xml.ProgramContent.Name) {
            $Identification.Name = $Xml.ProgramContent.Name.InnerText
        }

        # Type (Online/Batch) depuis ExecutionMode
        $ExecMode = $Xml.ProgramContent.ExecutionMode
        $Identification.Type = if ($ExecMode -eq "O" -or $ExecMode -eq "1") { "Online" } else { "Batch" }

        # Description
        if ($Xml.ProgramContent.Description) {
            $Identification.Description = $Xml.ProgramContent.Description.InnerText
        }

        Write-Success "XML charge: $($Identification.XmlFile)"
    }
    catch {
        Write-Warning2 "Erreur lecture XML: $_"
    }
}
else {
    Write-Warning2 "Fichier XML non trouve pour $Project IDE $IdePosition"
}

# ============================================================================
# 1.2 STRUCTURE DES TACHES
# ============================================================================

Write-Step "1.2" "Extraction structure des taches..."

$TaskStructure = @{
    TotalTasks       = 0
    DisabledTasks    = 0
    TotalLogicLines  = 0
    DisabledLines    = 0
    Tasks            = @()
}

if ($Identification.XmlPath -and (Test-Path $Identification.XmlPath)) {
    $Xml = [xml](Get-Content $Identification.XmlPath -Encoding UTF8 -Raw)

    # IMPORTANT: Les taches sont IMBRIQUEES dans Magic XPA
    # Utiliser SelectNodes pour obtenir TOUTES les taches (y compris nested)
    $AllTasks = @($Xml.SelectNodes("//Task"))

    foreach ($Task in $AllTasks) {
        if (!$Task) { continue }

        $TaskHeader = $Task.Header
        $TaskISN2 = if ($TaskHeader.ISN_2) { [int]$TaskHeader.ISN_2 } else { 1 }
        $TaskName = if ($TaskHeader.Description) { $TaskHeader.Description } else { "Task_$TaskISN2" }
        $Disabled = $TaskHeader.Disabled -eq "1"

        # Compter les lignes logic
        $LogicLineCount = 0
        $DisabledLineCount = 0

        $TaskLogic = $Task.TaskLogic
        if ($TaskLogic -and $TaskLogic.LogicUnit) {
            foreach ($LogicUnit in @($TaskLogic.LogicUnit)) {
                if ($LogicUnit.LogicLines -and $LogicUnit.LogicLines.LogicLine) {
                    $Lines = @($LogicUnit.LogicLines.LogicLine)
                    $LogicLineCount += $Lines.Count
                    $DisabledLineCount += ($Lines | Where-Object { $_.Disabled -eq "1" }).Count
                }
            }
        }

        # Extraire le nombre de parametres
        $ParamCount = 0
        if ($TaskHeader.ReturnValue -and $TaskHeader.ReturnValue.ParametersCount) {
            $ParamCount = [int]$TaskHeader.ReturnValue.ParametersCount.val
        }

        # Extraire tables utilisees
        $TableCount = 0
        if ($Task.Resource -and $Task.Resource.DB) {
            $TableCount = (@($Task.Resource.DB)).Count
        }

        $TaskStructure.Tasks += @{
            ISN2          = $TaskISN2
            Name          = $TaskName
            IsDisabled    = $Disabled
            LogicLines    = $LogicLineCount
            DisabledLines = $DisabledLineCount
            Parameters    = $ParamCount
            Tables        = $TableCount
        }

        $TaskStructure.TotalTasks++
        if ($Disabled) { $TaskStructure.DisabledTasks++ }
        $TaskStructure.TotalLogicLines += $LogicLineCount
        $TaskStructure.DisabledLines += $DisabledLineCount
    }

    Write-Success "$($TaskStructure.TotalTasks) taches, $($TaskStructure.DisabledTasks) desactivees, $($TaskStructure.TotalLogicLines) lignes logic"
}

# ============================================================================
# 1.3 CALL GRAPH
# ============================================================================

Write-Step "1.3" "Extraction du Call Graph..."

$CallGraph = @{
    Callers      = @()
    Callees      = @()
    CalleesLvl2  = @()
    CalleesLvl3  = @()
    ChainFromMain = @()
    CrossProject = @()
}

# 1.3.1 - Callers (qui m'appelle?)
# NOTE: program_calls table est vide dans la KB actuelle, mais on garde la requete correcte
$CallersQuery = @"
SELECT DISTINCT p.ide_position, p.name, pr.name as project_name
FROM program_calls pc
JOIN tasks t ON pc.caller_task_id = t.id
JOIN programs p ON t.program_id = p.id
JOIN projects pr ON p.project_id = pr.id
JOIN programs target ON pc.callee_program_id = target.id
JOIN projects target_pr ON target.project_id = target_pr.id
WHERE target_pr.name = '$Project' AND target.ide_position = $IdePosition
ORDER BY p.ide_position
"@

try {
    $CallersResult = & $Sqlite3 $KbPath $CallersQuery 2>$null
    if ($CallersResult) {
        foreach ($Line in ($CallersResult -split "`n" | Where-Object { $_ })) {
            $Parts = $Line -split '\|'
            if ($Parts.Count -ge 3) {
                $CallGraph.Callers += @{
                    IDE     = [int]$Parts[0]
                    Name    = $Parts[1]
                    Project = $Parts[2]
                }
            }
        }
    }
    Write-Success "$($CallGraph.Callers.Count) callers trouves (KB)"
}
catch {
    Write-Warning2 "Erreur extraction callers: $_"
}

# 1.3.2 - Callees niveau 1 (qui j'appelle?)
$CalleesQuery = @"
SELECT DISTINCT target.ide_position, target.name, target_pr.name as project_name
FROM program_calls pc
JOIN tasks t ON pc.caller_task_id = t.id
JOIN programs caller ON t.program_id = caller.id
JOIN projects caller_pr ON caller.project_id = caller_pr.id
JOIN programs target ON pc.callee_program_id = target.id
JOIN projects target_pr ON target.project_id = target_pr.id
WHERE caller_pr.name = '$Project' AND caller.ide_position = $IdePosition
ORDER BY target.ide_position
"@

try {
    $CalleesResult = & $Sqlite3 $KbPath $CalleesQuery 2>$null
    if ($CalleesResult) {
        foreach ($Line in ($CalleesResult -split "`n" | Where-Object { $_ })) {
            $Parts = $Line -split '\|'
            if ($Parts.Count -ge 3) {
                $CallGraph.Callees += @{
                    IDE     = [int]$Parts[0]
                    Name    = $Parts[1]
                    Project = $Parts[2]
                    Level   = 1
                }
            }
        }
    }
    Write-Success "$($CallGraph.Callees.Count) callees niveau 1 (KB)"
}
catch {
    Write-Warning2 "Erreur extraction callees: $_"
}

# 1.3.2b - Callees niveau 2 (KB vide actuellement, mais requete preparee)
foreach ($Callee in $CallGraph.Callees) {
    $Lvl2Query = @"
SELECT DISTINCT target.ide_position, target.name, target_pr.name as project_name
FROM program_calls pc
JOIN tasks t ON pc.caller_task_id = t.id
JOIN programs caller ON t.program_id = caller.id
JOIN projects caller_pr ON caller.project_id = caller_pr.id
JOIN programs target ON pc.callee_program_id = target.id
JOIN projects target_pr ON target.project_id = target_pr.id
WHERE caller_pr.name = '$($Callee.Project)' AND caller.ide_position = $($Callee.IDE)
ORDER BY target.ide_position
"@
    try {
        $Lvl2Result = & $Sqlite3 $KbPath $Lvl2Query 2>$null
        if ($Lvl2Result) {
            foreach ($Line in ($Lvl2Result -split "`n" | Where-Object { $_ })) {
                $Parts = $Line -split '\|'
                if ($Parts.Count -ge 3) {
                    $CallGraph.CalleesLvl2 += @{
                        IDE        = [int]$Parts[0]
                        Name       = $Parts[1]
                        Project    = $Parts[2]
                        Level      = 2
                        CalledFrom = $Callee.IDE
                    }
                }
            }
        }
    }
    catch { }
}

# 1.3.2c - Callees niveau 3 (KB vide actuellement, mais requete preparee)
foreach ($Callee in $CallGraph.CalleesLvl2) {
    $Lvl3Query = @"
SELECT DISTINCT target.ide_position, target.name, target_pr.name as project_name
FROM program_calls pc
JOIN tasks t ON pc.caller_task_id = t.id
JOIN programs caller ON t.program_id = caller.id
JOIN projects caller_pr ON caller.project_id = caller_pr.id
JOIN programs target ON pc.callee_program_id = target.id
JOIN projects target_pr ON target.project_id = target_pr.id
WHERE caller_pr.name = '$($Callee.Project)' AND caller.ide_position = $($Callee.IDE)
ORDER BY target.ide_position
LIMIT 10
"@
    try {
        $Lvl3Result = & $Sqlite3 $KbPath $Lvl3Query 2>$null
        if ($Lvl3Result) {
            foreach ($Line in ($Lvl3Result -split "`n" | Where-Object { $_ })) {
                $Parts = $Line -split '\|'
                if ($Parts.Count -ge 3) {
                    $CallGraph.CalleesLvl3 += @{
                        IDE        = [int]$Parts[0]
                        Name       = $Parts[1]
                        Project    = $Parts[2]
                        Level      = 3
                        CalledFrom = $Callee.IDE
                    }
                }
            }
        }
    }
    catch { }
}

Write-Success "$($CallGraph.CalleesLvl2.Count) callees niveau 2, $($CallGraph.CalleesLvl3.Count) niveau 3"

# 1.3.2d - FALLBACK: Si KB vide, extraire callees depuis XML
if ($CallGraph.Callees.Count -eq 0 -and $Identification.XmlPath -and (Test-Path $Identification.XmlPath)) {
    Write-Step "1.3b" "Fallback: extraction callees depuis XML..."

    $Xml = [xml](Get-Content $Identification.XmlPath -Encoding UTF8 -Raw)

    # Chercher les operations CallProgram dans les LogicLines
    $CallProgNodes = $Xml.SelectNodes("//LogicLine[contains(@operation, 'Call')]")
    $CalleeXmlIds = @{}

    foreach ($Node in $CallProgNodes) {
        $Operation = $Node.operation
        if ($Operation -ne "CallProgram" -and $Operation -ne "CallProg") { continue }

        # Le programme appele peut etre dans differents attributs
        $TargetId = $null

        # Format 1: attribut prog
        if ($Node.prog) {
            $TargetId = $Node.prog
        }
        # Format 2: dans parameters JSON
        elseif ($Node.parameters) {
            try {
                $Params = $Node.parameters | ConvertFrom-Json
                if ($Params.ProgIdx) { $TargetId = $Params.ProgIdx }
                elseif ($Params.prog) { $TargetId = $Params.prog }
            }
            catch { }
        }
        # Format 3: attribut target
        elseif ($Node.target) {
            $TargetId = $Node.target
        }

        if ($TargetId -and $TargetId -match '^\d+$') {
            $CalleeXmlIds[[int]$TargetId] = $true
        }
    }

    # Aussi chercher dans CallTask qui pointe vers un programme externe
    # (les CallTask internes pointent vers des taches du meme programme)

    # Resoudre les noms des callees depuis la KB
    foreach ($XmlId in $CalleeXmlIds.Keys) {
        $CalleeName = "Program_$XmlId"
        $CalleeIde = $XmlId

        # Chercher dans la KB
        if (Test-Path $KbPath) {
            try {
                $NameQuery = "SELECT ide_position, name FROM programs WHERE project_id = (SELECT id FROM projects WHERE name = '$Project') AND xml_id = $XmlId LIMIT 1"
                $NameResult = & $Sqlite3 $KbPath $NameQuery 2>$null
                if ($NameResult) {
                    $Parts = $NameResult -split '\|'
                    if ($Parts[0]) { $CalleeIde = [int]$Parts[0] }
                    if ($Parts.Count -gt 1 -and $Parts[1]) { $CalleeName = $Parts[1] }
                }
            }
            catch { }
        }

        # Aussi chercher dans ProgramHeaders.xml
        if ($CalleeName -eq "Program_$XmlId") {
            $HeadersPath = Join-Path $PrgPath "ProgramHeaders.xml"
            if (Test-Path $HeadersPath) {
                try {
                    [xml]$Headers = Get-Content $HeadersPath -Encoding UTF8 -Raw
                    $ProgHeader = $Headers.Application.ProgramsRepositoryHeaders.Program | Where-Object {
                        [int]$_.Header.id -eq $XmlId
                    }
                    if ($ProgHeader -and $ProgHeader.Header.Description) {
                        $CalleeName = $ProgHeader.Header.Description
                    }
                }
                catch { }
            }
        }

        $CallGraph.Callees += @{
            IDE     = $CalleeIde
            Name    = $CalleeName
            Project = $Project
            Level   = 1
            Source  = "XML"
        }
    }

    if ($CallGraph.Callees.Count -gt 0) {
        Write-Success "Fallback XML: $($CallGraph.Callees.Count) callees trouves"
    }
}

# 1.3.3 - Chaine depuis Main
$ChainQuery = @"
WITH RECURSIVE call_chain AS (
    SELECT p.id, p.ide_position, p.name, p.project, 0 as depth, CAST(p.ide_position AS TEXT) as path
    FROM programs p
    WHERE p.project = '$Project' AND p.ide_position = 1

    UNION ALL

    SELECT p.id, p.ide_position, p.name, p.project, cc.depth + 1, cc.path || ' -> ' || p.ide_position
    FROM call_chain cc
    JOIN program_calls pc ON pc.caller_program_id = cc.id
    JOIN programs p ON pc.callee_program_id = p.id
    WHERE cc.depth < 10
)
SELECT DISTINCT ide_position, name, project, depth, path
FROM call_chain
WHERE ide_position = $IdePosition
ORDER BY depth
LIMIT 1
"@

try {
    $ChainResult = & $Sqlite3 $KbPath $ChainQuery 2>$null
    if ($ChainResult) {
        $Parts = $ChainResult -split '\|'
        if ($Parts.Count -ge 5) {
            $PathParts = $Parts[4] -split ' -> '
            foreach ($PathIde in $PathParts) {
                $PathNodeQuery = "SELECT ide_position, name FROM programs WHERE project = '$Project' AND ide_position = $PathIde LIMIT 1"
                $PathNode = & $Sqlite3 $KbPath $PathNodeQuery 2>$null
                if ($PathNode) {
                    $NodeParts = $PathNode -split '\|'
                    $CallGraph.ChainFromMain += @{
                        IDE  = [int]$NodeParts[0]
                        Name = $NodeParts[1]
                    }
                }
            }
        }
    }
    Write-Success "Chaine depuis Main: $($CallGraph.ChainFromMain.Count) niveaux"
}
catch {
    Write-Warning2 "Chaine depuis Main non trouvee (peut etre orphelin)"
}

# 1.3.4 - Dependances cross-projet
$CrossQuery = @"
SELECT DISTINCT
    CASE WHEN caller.project != '$Project' THEN 'incoming' ELSE 'outgoing' END as direction,
    CASE WHEN caller.project != '$Project' THEN caller.project ELSE callee.project END as other_project,
    CASE WHEN caller.project != '$Project' THEN caller.ide_position ELSE callee.ide_position END as other_ide,
    CASE WHEN caller.project != '$Project' THEN caller.name ELSE callee.name END as other_name
FROM program_calls pc
JOIN programs caller ON pc.caller_program_id = caller.id
JOIN programs callee ON pc.callee_program_id = callee.id
WHERE (caller.project = '$Project' AND caller.ide_position = $IdePosition AND callee.project != '$Project')
   OR (callee.project = '$Project' AND callee.ide_position = $IdePosition AND caller.project != '$Project')
"@

try {
    $CrossResult = & $Sqlite3 $KbPath $CrossQuery 2>$null
    if ($CrossResult) {
        foreach ($Line in ($CrossResult -split "`n" | Where-Object { $_ })) {
            $Parts = $Line -split '\|'
            if ($Parts.Count -ge 4) {
                $CallGraph.CrossProject += @{
                    Direction = $Parts[0]
                    Project   = $Parts[1]
                    IDE       = [int]$Parts[2]
                    Name      = $Parts[3]
                }
            }
        }
    }
    Write-Success "$($CallGraph.CrossProject.Count) dependances cross-projet"
}
catch { }

# ============================================================================
# 1.4 VERIFICATION ORPHELIN
# ============================================================================

Write-Step "1.4" "Verification statut orphelin..."

$OrphanStatus = @{
    IsOrphan      = $true
    Criteria      = @{
        HasCallers    = $false
        HasPublicName = $false
        IsEcfMember   = $false
        IsMainProgram = $false
    }
    Conclusion    = ""
    EcfName       = $null
}

# Critere 1: A des callers actifs?
$OrphanStatus.Criteria.HasCallers = $CallGraph.Callers.Count -gt 0

# Critere 2: A un PublicName?
$OrphanStatus.Criteria.HasPublicName = $null -ne $Identification.PublicName -and $Identification.PublicName -ne ''

# Critere 3: Est membre d'un ECF?
if ($Project -eq "ADH" -and $AdhEcfPrograms.ContainsKey($IdePosition)) {
    $OrphanStatus.Criteria.IsEcfMember = $true
    $OrphanStatus.EcfName = "ADH.ecf"
}

# Critere 4: Est le Main Program?
$OrphanStatus.Criteria.IsMainProgram = $IdePosition -eq 1

# Conclusion
if ($OrphanStatus.Criteria.HasCallers) {
    $OrphanStatus.IsOrphan = $false
    $OrphanStatus.Conclusion = "NON ORPHELIN - $($CallGraph.Callers.Count) caller(s) actif(s)"
}
elseif ($OrphanStatus.Criteria.HasPublicName) {
    $OrphanStatus.IsOrphan = $false
    $OrphanStatus.Conclusion = "NON ORPHELIN - PublicName defini: $($Identification.PublicName)"
}
elseif ($OrphanStatus.Criteria.IsEcfMember) {
    $OrphanStatus.IsOrphan = $false
    $OrphanStatus.Conclusion = "NON ORPHELIN - Membre ECF: $($OrphanStatus.EcfName)"
}
elseif ($OrphanStatus.Criteria.IsMainProgram) {
    $OrphanStatus.IsOrphan = $false
    $OrphanStatus.Conclusion = "NON ORPHELIN - Programme principal (Main)"
}
else {
    $OrphanStatus.Conclusion = "ORPHELIN CONFIRME - Aucun des 4 criteres satisfait"
}

if ($OrphanStatus.IsOrphan) {
    Write-Warning2 $OrphanStatus.Conclusion
}
else {
    Write-Success $OrphanStatus.Conclusion
}

# ============================================================================
# ASSEMBLAGE DISCOVERY.JSON
# ============================================================================

$Discovery = @{
    GeneratedAt   = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss")
    Pipeline      = "V5.0"
    Phase         = "1-DISCOVERY"

    Identification = $Identification
    TaskStructure  = $TaskStructure
    CallGraph      = $CallGraph
    OrphanStatus   = $OrphanStatus

    Stats          = @{
        TotalTasks       = $TaskStructure.TotalTasks
        DisabledTasks    = $TaskStructure.DisabledTasks
        TotalLogicLines  = $TaskStructure.TotalLogicLines
        Callers          = $CallGraph.Callers.Count
        CalleesLvl1      = $CallGraph.Callees.Count
        CalleesLvl2      = $CallGraph.CalleesLvl2.Count
        CalleesLvl3      = $CallGraph.CalleesLvl3.Count
        CrossProject     = $CallGraph.CrossProject.Count
    }
}

# Sauvegarder
$Discovery | ConvertTo-Json -Depth 10 | Set-Content $OutputFile -Encoding UTF8

Write-Host ""
Write-Host "  Discovery sauvegarde: $OutputFile" -ForegroundColor Cyan
