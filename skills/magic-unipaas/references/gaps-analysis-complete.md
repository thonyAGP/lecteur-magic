# Analyse Complete des Lacunes - 40 Fichiers XML

## Metadata
- **Date**: 2025-12-24
- **Fichiers analyses**: 37 Prg_*.xml + DataSources.xml
- **Projets**: ADH (10), PBP (9), REF (10), PBG (8)

---

## 1. OPERATIONS NON DOCUMENTEES

### 1.1 DATAVIEW_SRC (Source de donnees)

```xml
<DATAVIEW_SRC FlowIsn="2" IDX="1" Type="M">
  <Condition val="N"/>
  <Modifier val="B"/>
  <Direction val="C"/>
</DATAVIEW_SRC>
```

| Attribut | Valeurs | Signification |
|----------|---------|---------------|
| Type | M | Main DataView |
| IDX | 1, 2... | Index utilise (optionnel) |
| Condition | N, Y, Exp="X" | Condition d'execution |
| Modifier | B | Branch |
| Direction | C | Current |

### 1.2 Invoke (Commande systeme)

```xml
<Invoke FlowIsn="6">
  <OperationType val="O"/>
  <Command val="1"/>
  <Wait val="Y"/>
  <Show val="1"/>
  <Condition val="Y"/>
</Invoke>
```

| Attribut | Valeurs | Signification |
|----------|---------|---------------|
| OperationType | O | OS Command |
| Command | Expression ID | Commande a executer |
| Wait | Y/N | Attendre fin execution |
| Show | 1 | Mode affichage (1=normal) |

### 1.3 LNK (Link vers table)

```xml
<LNK Direction="A" EVL_CND="R" FlowIsn="9" Key="1" Mode="R"
     SortType="15" VIEW="6" VIEWS="6">
  <DB comp="4" obj="980"/>
</LNK>
```

| Attribut | Valeurs | Signification |
|----------|---------|---------------|
| Direction | A, D | Ascending, Descending |
| EVL_CND | R | Evaluation Condition = Range |
| Key | 1, 2... | Index/cle a utiliser |
| Mode | R, W | Read, Write |
| SortType | 15 | Type de tri |
| VIEW | ID | View reference |

### 1.4 Evaluate

```xml
<Evaluate FlowIsn="7">
  <Expression val="2"/>
  <Condition val="Y"/>
</Evaluate>
```

Execute une expression sans affecter de variable (effet de bord).

### 1.5 Remark (Commentaires)

```xml
<Remark FlowIsn="6">
  <Type val="0"/>   <!-- 0 = separateur, 2 = texte -->
  <Text val=" "/>
</Remark>
```

### 1.6 STP (Message Dialog)

```xml
<STP Buttons="O" DefaultButton="1" Exp="62" Image="E"
     Mode="W" TitleTxt="Warning">
</STP>
```

| Attribut | Valeurs | Signification |
|----------|---------|---------------|
| Buttons | O, YN, OC | OK, Yes/No, OK/Cancel |
| Image | E, W, I | Error, Warning, Info |
| Mode | W | Wait for response |
| Exp | ID | Expression pour message |

---

## 2. ATTRIBUTS DE CALLTASK

```xml
<CallTask FlowIsn="4">
  <OperationType val="T"/>   <!-- T=Task, P=Program -->
  <TaskID comp="-1" obj="2"/>
  <Lock val="N"/>            <!-- Verrouille pendant appel -->
  <Wait val="Y"/>            <!-- Attend fin -->
  <SyncData val="N"/>        <!-- Synchronise donnees -->
  <RetainFocus val="N"/>     <!-- Garde le focus -->
</CallTask>
```

---

## 3. STRUCTURE IO (Export/Print)

```xml
<IO id="1">
  <Description val="Export - tempo_mecan"/>
  <IOExpression val="1"/>        <!-- Expression pour nom fichier -->
  <OpenPrintDialog val="N"/>
  <PaperSize val="68"/>          <!-- 68 = A4? -->
  <Format val="L"/>              <!-- L = List/Line -->
  <Media val="T"/>               <!-- T = Text file -->
  <Access val="W"/>              <!-- W = Write -->
  <Copies val="1"/>
  <Orientation val="P"/>         <!-- P = Portrait -->
  <PDF val="N"/>
  <PrintPreview val="N"/>
  <Vis2LogTranslation val="N"/>
  <FlipLines val="N"/>
</IO>
```

| Media | Signification |
|-------|---------------|
| T | Text file |
| F | File? |
| P | Printer? |

---

## 4. INTERNAL EVENT IDs

| ID | Signification supposee |
|----|------------------------|
| 14 | Exit/Close task |
| 34 | OK/Validate |
| 63 | ? |
| 219 | Abandon |
| 220 | Continue |
| 393 | ? |

---

## 5. TASKPROPERTIES COMPLET

```xml
<TaskProperties>
  <SelectionTable val="N"/>        <!-- Table de selection multi -->
  <ConfirmUpdate CNFU="N"/>        <!-- Confirmer MAJ -->
  <ConfirmCancel val="N"/>         <!-- Confirmer annulation -->
  <ErrorStrategy val="A"/>         <!-- A=Abort, R=Retry -->
  <LockingStrategy val="O"/>       <!-- O=OnUpdate, M=OnModify, I=Immediate, N=None -->
  <CacheStrategy val="T"/>         <!-- T=Table, P=Position, N=None, S=Session -->
  <ForceRecordSuffix val="N"/>     <!-- Force Record Suffix -->
  <TransactionMode val="P"/>       <!-- P=Physical, D=Deferred, W=Within, N=None -->
  <TransactionBegin val="L"/>      <!-- L=Lazy, T=Task, N=None, B=BeforeRecord -->
  <PreloadView val="N"/>           <!-- Precharge donnees -->
  <AllowEmptyDataview val="N"/>    <!-- DataView vide OK -->
  <KeepCreatedContext val="N"/>    <!-- Garde contexte creation -->
</TaskProperties>
```

---

## 6. SIDE_WIN (Permissions UI)

```xml
<SIDE_WIN>
  <AllowOptions val="Y"/>          <!-- Menu Options -->
  <AllowQuery val="Y"/>            <!-- Mode Query -->
  <AllowModify val="Y"/>           <!-- Mode Modify -->
  <AllowCreate val="Y"/>           <!-- Creation records -->
  <AllowDelete val="Y"/>           <!-- Suppression records -->
  <AllowLocate val="Y"/>           <!-- Locate record -->
  <AllowRange val="Y"/>            <!-- Range filter -->
  <AllowIndexChange val="Y"/>      <!-- Changer index -->
  <AllowSorting val="Y"/>          <!-- Tri -->
  <AllowIOFiles val="Y"/>          <!-- Import/Export -->
  <RecordCycle val="Y"/>           <!-- Cycle auto records -->
  <AllowEvents val="Y"/>           <!-- Events utilisateur -->
  <AllowIndexOptimization val="Y"/>
  <AllowLocationInQuery val="Y"/>
  <AllowPrintingData val="N"/>     <!-- Impression donnees -->
</SIDE_WIN>
```

---

## 7. SELECT TYPES ET ATTRIBUTS

```xml
<Select FieldID="1" FlowIsn="3" id="1">
  <Column val="1"/>
  <Type val="R"/>              <!-- R=Real(DB), V=Virtual, P=Parameter -->
  <IsParameter val="N"/>
  <Range MAX="3" MIN="3"/>     <!-- Range constraint -->
  <Locate MIN="1"/>            <!-- Locate constraint -->
  <ASS val="5"/>               <!-- Assignment? -->
  <DIFF_UPDATE val="T"/>       <!-- Differential update -->
  <_RecomputeIndex val="1"/>
  <_RecomputeLength val="1"/>
</Select>
```

---

## 8. DATASOURCES.XML STRUCTURE

### 8.1 DataObject

```xml
<DataObject PhysicalName="table_name" Public="alias"
            Resident="N" data_source="Pooling" id="1" name="internal_name">
  <Encrypt val="N"/>
  <Cache val="N"/>
  <Cursor val="N"/>
  <CheckExistence val="Y"/>
  <ObjectType val="T"/>           <!-- T=Table -->
  <IdentifyRowModifications val="P"/>  <!-- P=Primary, U=Update, D=Default -->
  <RowLength val="4042"/>
  <ColumnsLastIsn val="19"/>
  <IndexesLastIsn val="2"/>
```

### 8.2 Column Definition

```xml
<Column id="1" name="field_name">
  <PropertyList model="FIELD">
    <Model attr_obj="FIELD_UNICODE"/>  <!-- Type Magic -->
    <Picture id="157" valUnicode="U8"/>
    <StoredAs id="173" val="31"/>      <!-- Format stockage -->
    <Size id="174" val="16"/>
    <Definition id="175" val="2"/>
    <DbColumnName id="178" val="db_field"/>
    <_FieldPhysical attribute="U" storage="31" allowed_null="N"/>
  </PropertyList>
</Column>
```

### 8.3 StoredAs Codes

| Code | Signification |
|------|---------------|
| 4 | Integer 4 bytes |
| 6 | Float 8 bytes (avec decimales) |
| 15 | Boolean 1 byte |
| 19 | Date 8 chars (YYYYMMDD) |
| 23 | Time 4 bytes |
| 24 | Time extended 6 bytes |
| 31 | Unicode string |
| 32 | Unicode string (alt) |

### 8.4 Index Definition

```xml
<Index id="1" name="pk_index" PhysicalName="IX_table_pk">
  <Mode val="S"/>           <!-- S=Sorted, N=Null allowed -->
  <Order val="T"/>
  <Range val="Q"/>          <!-- Q=Query -->
  <IndexType val="R"/>      <!-- R=Regular -->
  <Clustered val="N"/>
  <Primary val="Y"/>
  <Segments>
    <Segment>
      <Column val="1"/>
      <Order val="A"/>      <!-- A=Ascending, D=Descending -->
      <Size val="8"/>
    </Segment>
  </Segments>
</Index>
```

---

## 9. CONVENTIONS DE NOMMAGE COLONNES

| Prefixe | Signification |
|---------|---------------|
| P0, P1... | Parametre 0, 1... |
| W0, W1... | Working variable |
| V. | Virtual/Variable |
| VG. | Variable Globale |
| b_ | Button field |
| > | Resultat/Output |
| < | Accumulation |

---

## 10. PICTURE FORMATS

| Format | Exemple | Signification |
|--------|---------|---------------|
| U | 1 char Unicode |
| U3 | 3 chars Unicode |
| UX | Unicode flexible |
| N1 | Numeric 1 digit |
| 8P0 | 8 digits positif |
| 10P0Z | 10 digits, Z=zero fill |
| ##/##/## | Date DD/MM/YY |
| N## ### ### ###.###Z | Montant avec separateurs |

---

## 11. METADATA INTERNES

### INT_CMP_LIST_INFO
Liste des composants (comp) utilises par la tache.
```xml
<INT_CMP_LIST_INFO>
  <v>2</v>   <!-- REF component -->
  <v>4</v>   <!-- ADH component -->
</INT_CMP_LIST_INFO>
```

### INT_RECOMP_INFO
Ordre de recomputation des variables.
```xml
<INT_RECOMP_INFO>
  <v>5</v>
  <v>6</v>
  <v>12</v>
</INT_RECOMP_INFO>
```

---

## 12. ATTRIBUTS _ (UNDERSCORE) - IGNORABLES

Ces attributs sont des metadonnees IDE, ignorables pour la migration:

- `_InternalTask`
- `_DspTemplate`
- `_HeaderPosition`
- `_TotalVariabls`
- `_TotalVirtuals`
- `_FieldStyle`
- `_Flip`
- `_Dec`, `_Whole`, `_Negative`
- `_RecomputeIndex`
- `_FormIndex`
- `_ControlIndex`
- `_DitIndexForToolkit`
- `_Comment`
- `_TabbingOrder`

---

## 13. VALEURS ENUMEREES COMPLETES

### Level (LogicUnit)
| Valeur | Signification |
|--------|---------------|
| T | Task level |
| R | Record level |

### Type (LogicUnit)
| Valeur | Signification |
|--------|---------------|
| M | Main (Record Main) |
| S | Suffix |
| P | Prefix |

### InitialMode
| Valeur | Signification |
|--------|---------------|
| M | Modify |
| E | Edit/Query |
| D | Delete |
| C | Create |

### EvaluateEndCondition
| Valeur | Signification |
|--------|---------------|
| A | After record |
| B | Before record |

---

## 14. RESUME PRIORITES

### CRITIQUE (bloquant conversion)
1. [x] BLOCK/END_BLK - Type I=IF, E=ELSE - DOCUMENTE
2. [ ] Internal Event IDs complets
3. [x] Fonctions String - DOCUMENTE
4. [x] IO structure - DOCUMENTE
5. [x] DataSources.xml - DOCUMENTE

### IMPORTANT
6. [x] TaskProperties complet - DOCUMENTE
7. [x] SIDE_WIN - DOCUMENTE
8. [x] Select Range/Locate - DOCUMENTE
9. [x] CallTask attributs - DOCUMENTE
10. [x] LNK operation - DOCUMENTE

### SECONDAIRE
11. [x] Conventions nommage - DOCUMENTE
12. [x] Picture formats - DOCUMENTE
13. [x] StoredAs codes - DOCUMENTE
14. [x] Metadata internes - DOCUMENTE

---

*Document genere par Claude Code - 2025-12-24*
*Analyse de 40 fichiers XML (ADH, PBP, REF, PBG)*
