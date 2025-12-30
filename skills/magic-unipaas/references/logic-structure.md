# Structure Logic Magic Unipaas

## Vue d'Ensemble

Ce document decrit la structure de la logique metier dans les programmes Magic, basee sur l'analyse comparative entre l'IDE Magic et les fichiers XML.

---

## 1. Structure de la Vue Logic

### 1.1 Organisation Hierarchique

Dans l'IDE Magic, la vue Logic est organisee en sections :

```
Task
├── Prefix      (Level="T", Type="P")  - Initialisation de la tache
├── Main        (Level="T", Type="M")  - Corps principal (rare)
└── Suffix      (Level="T", Type="S")  - Finalisation de la tache

Record
├── Prefix      (Level="R", Type="P")  - Avant chaque enregistrement
├── Main        (Level="R", Type="M")  - Traitement principal par enregistrement
└── Suffix      (Level="R", Type="S")  - Apres chaque enregistrement
```

### 1.2 Mapping XML vers IDE

| Vue IDE | XML Level | XML Type | Description |
|---------|-----------|----------|-------------|
| Task Prefix | `T` | `P` | Execute une fois au debut de la tache |
| Task Main | `T` | `M` | Corps principal de la tache |
| Task Suffix | `T` | `S` | Execute une fois a la fin de la tache |
| Record Prefix | `R` | `P` | Execute avant chaque enregistrement |
| Record Main | `R` | `M` | Traitement principal par enregistrement |
| Record Suffix | `R` | `S` | Execute apres chaque enregistrement |
| Handler | `H` | varies | Gestionnaire d'evenement |

### 1.3 Exemple XML

```xml
<LogicUnit id="2" propagate="78">
  <Level val="T"/>           <!-- T = Task level -->
  <Type val="S"/>            <!-- S = Suffix -->
  <Scope val="S"/>           <!-- S = Single -->
  <Event>
    <EventType val="S"/>     <!-- S = Start event -->
    <PublicObject comp="-1"/>
  </Event>
  <LogicLines>
    <!-- Actions de logique -->
  </LogicLines>
</LogicUnit>
```

---

## 2. Types d'Actions (LogicLines)

### 2.1 Tableau de Reference

| Type XML | Nom IDE | Description |
|----------|---------|-------------|
| `BLOCK` | Block | Structure conditionnelle IF |
| `END_BLK` | Block End | Fin de bloc IF |
| `Update` | Update | Mise a jour d'une variable |
| `Invoke` | Invoke | Execution commande OS |
| `Evaluate` | Evaluate | Evaluation d'une expression |
| `CallTask` | Call | Appel de programme ou sous-tache |
| `RaiseEvent` | Raise Event | Lever un evenement |
| `Select` | Select | Selection de donnees |
| `LNK` | Link | Lien vers une table |
| `END_LINK` | End Link | Fin de lien |
| `Remark` | (vide) | Commentaire |
| `DATAVIEW_SRC` | DataView Source | Source de vue de donnees |

### 2.2 CallTask - Appel de Programme

```xml
<CallTask FlowIsn="10">
  <OperationType val="P"/>      <!-- P = Program, T = SubTask -->
  <TaskID comp="-1" obj="401"/> <!-- obj = ID du programme -->
  <Lock val="Y"/>
  <Wait val="Y"/>
  <Arguments>
    <Argument>
      <id val="3"/>
      <Expression val="8"/>      <!-- Reference a l'expression 8 -->
      <Skip val="N"/>
    </Argument>
  </Arguments>
</CallTask>
```

**OperationType :**
- `P` : Program - Appel d'un autre programme (par ID)
- `T` : SubTask - Appel d'une sous-tache dans le meme fichier

### 2.3 Update - Mise a Jour de Variable

```xml
<Update FlowIsn="138">
  <Parent val="32768"/>         <!-- Reference au parent (Main Program) -->
  <FieldID val="25"/>           <!-- ID de la variable cible -->
  <WithValue val="15"/>         <!-- ID de l'expression source -->
  <Incremental val="N"/>
  <ForcedUpdate val="Y"/>
  <Condition val="Y"/>          <!-- Condition d'execution -->
</Update>
```

**Parent val="32768" :**
- Indique que la variable cible est dans le Main Program
- Les variables globales (VG.) sont accessibles via cette reference

### 2.4 Block - Structure Conditionnelle

```xml
<BLOCK EndBlock="26" EndBlockSegment="26" FlowIsn="6" Type="I">
  <Condition Exp="5"/>          <!-- Expression de condition -->
</BLOCK>
<!-- ... actions dans le bloc ... -->
<END_BLK FlowIsn="12"/>
```

**Types de Block :**
- `I` : If block (condition)
- `E` : Else block
- `L` : Loop block

---

## 3. Systeme de Variables

### 3.1 Identification des Variables

Dans l'IDE, les variables sont identifiees par des lettres :
- A, B, C, ..., Z (26 premieres)
- BA, BB, BC, ... (suivantes)

Dans le XML, elles sont identifiees par `FieldID` numerique.

### 3.2 Types de Variables

| Prefixe | Signification | Data Source |
|---------|---------------|-------------|
| `VG.` | Variable Globale | Virtual |
| `P.` | Variable de Programme | Virtual |
| `V.` | Variable locale | Virtual |
| (sans prefixe) | Champ de table | Table physique |

### 3.3 Exemple de Correspondance

Capture IDE :
```
BE    VG.ETAT EFFEC PAR LIEU SEJOUR    Alpha    Virtual
BD    VG.NB LIEU SEJOUR                Numeric  Virtual
```

Le `BE` correspond a un `FieldID` dans le XML (probablement 57 si c'est la 57eme variable).

---

## 4. Systeme d'Expressions

### 4.1 Liste des Expressions

Les expressions sont numerotees et stockees dans la section `<Expressions>` du programme.

```xml
<Expressions>
  <Expression id="1">
    <ExpSyntax val="'C'"/>
    <ExpAttribute val="A"/>      <!-- A = Alpha -->
  </Expression>
  <Expression id="5">
    <ExpSyntax val="INIGet ('[MAGIC_LOGICAL_NAMES]RunMode')='B'"/>
    <ExpAttribute val="B"/>      <!-- B = Boolean -->
  </Expression>
</Expressions>
```

### 4.2 ExpAttribute - Type de Resultat

| Code | Type | Description |
|------|------|-------------|
| `A` | Alpha | Chaine ANSI |
| `U` | Unicode | Chaine Unicode |
| `N` | Numeric | Nombre |
| `B` | Boolean | Logique |
| `D` | Date | Date |
| `T` | Time | Heure |

### 4.3 References dans les Expressions

| Syntaxe | Signification |
|---------|---------------|
| `{0,N}` | Variable N du contexte courant |
| `{32768,N}` | Variable N du Main Program |
| `{1,N}` | Parametre 1, variable N |

---

## 5. Mapping Task ID vs File ID

### 5.1 Decouverte Importante

L'IDE affiche un **Task ID interne (ISN)** different de l'**ID du fichier source**.

| Element | IDE | XML |
|---------|-----|-----|
| Task ID | 152 | id="5" |
| File | - | Prg_5.xml |

### 5.2 Resolution

- L'ISN (Internal Serial Number) est un identifiant unique interne
- L'ID du fichier est l'identifiant logique du programme
- Le mapping est stocke dans `ProgramHeaders.xml`

### 5.3 Exemple ProgramHeaders.xml

```xml
<Program>
  <Header Description="Start" id="5">
    <!-- id="5" correspond au fichier Prg_5.xml -->
    <!-- L'ISN interne (152) n'est pas visible ici -->
  </Header>
</Program>
```

---

## 6. Liens vers Tables (LNK)

### 6.1 Structure XML

```xml
<LNK Direction="A" EVL_CND="R" FlowIsn="37" Key="1" Mode="R" SortType="6" VIEW="1" VIEWS="2">
  <DB comp="2" obj="728"/>     <!-- comp=2 = REF, obj=728 = arc_cc_total -->
  <Expanded val="1"/>
  <Condition val="Y"/>
</LNK>
```

### 6.2 Attributs LNK

| Attribut | Description |
|----------|-------------|
| `Direction` | A=Ascending, D=Descending |
| `Key` | Index de la cle utilisee |
| `Mode` | R=Read, W=Write |
| `VIEW` | Numero de vue |
| `comp` | ID du composant (-1=local, 2=REF) |
| `obj` | ID de la table dans DataSources |

---

## 7. Exemple Complet : Programme "Start" (Prg_5.xml)

### 7.1 Vue d'Ensemble

```
Programme 5 "Start" (TaskType=B, Batch)
│
├── Tables utilisees :
│   ├── REF.69 : initialisation___ini (cafil047_dat)
│   ├── REF.81 : societe__________soc (cafil059_dat)
│   └── REF.728 : arc_cc_total (arc_cctotal)
│
├── Task Suffix (lignes 1-13 IDE) :
│   ├── Block IF : INIGet('[MAGIC_LOGICAL_NAMES]RunMode')='B'
│   ├── Update : VG.MASQUE MONTANT
│   ├── Invoke OS : mkdir Trsft
│   ├── Evaluate : SetParam('SOCIETE','C')
│   ├── Evaluate : SetParam('LANGUE','F')
│   ├── Call SubTask : calc nb lieu sejour
│   ├── Call Program 146 : Pilotage Gestion de Crise [4 args]
│   ├── Evaluate : DbDel('{601'DSOURCE,'')
│   ├── Call Program 149 : Preparation Arrivants/Presents
│   ├── Call Program 150 : Import Special Offers
│   ├── Raise Event : Exit System
│   └── Block End
│
├── Record Suffix (lignes 19-28 IDE) :
│   ├── Call SubTask : calc nb lieu sejour
│   ├── Update : VG.ETAT EFFEC PAR LIEU SEJOUR
│   ├── Evaluate : SetParam('FISCALITEGREC',...)
│   ├── Evaluate : MnuShow('GREEC','FALSE'LOG)
│   ├── Call Program 154 : Recuperation langue
│   ├── Evaluate : SetParam('VERIF_USERB','O')
│   ├── Call Program 392 : Alimentation Combos LIEU SEJ
│   └── Call Program 153 : Initialisation Application
│
└── Sous-tache "calc nb lieu sejour" :
    ├── Task Prefix : VG.NB LIEU SEJOUR = 0
    └── Record Suffix : VG.NB LIEU SEJOUR = VG.NB LIEU SEJOUR + 1
```

### 7.2 Fonction du Programme

Ce programme "Start" est le point d'entree de l'application PBP. Il :

1. **Verifie le mode d'execution** (Batch vs Interactive)
2. **Cree les repertoires necessaires** (Trsft)
3. **Initialise les parametres globaux** (SOCIETE, LANGUE, VERIF_USERB, FISCALITEGREC)
4. **Compte les lieux de sejour** via la sous-tache
5. **Appelle les programmes d'initialisation** (Pilotage, Imports, etc.)
6. **Termine proprement** (Exit System si batch)

---

## 8. Conversion vers Code Moderne

### 8.1 TypeScript

```typescript
async function start(): Promise<void> {
  // Task Suffix
  if (INIGet('[MAGIC_LOGICAL_NAMES]RunMode') === 'B') {
    VG.MASQUE_MONTANT = formatMask(VG.ini_nbre_decimales);

    const trsftPath = `${INIGet('[MAGIC_LOGICAL_NAMES]club_exportdata')}Trsft`;
    if (!await fileExists(trsftPath)) {
      await execCommand(`cmd /c mkdir "${trsftPath}"`);
    }

    setParam('SOCIETE', 'C');
    setParam('LANGUE', 'F');

    await calcNbLieuSejour();
    await pilotageGestionCrise(arg1, arg2, arg3, arg4);
    await dbDel('{601}DSOURCE', '');
    await preparationArrivantsPresents();
    await importSpecialOffers();

    raiseEvent('ExitSystem');
  }

  // Record Suffix (pour chaque enregistrement)
  for (const record of records) {
    await calcNbLieuSejour();
    VG.ETAT_EFFEC_PAR_LIEU_SEJOUR = record.soc_etat_eff_par_lieusejour;
    setParam('FISCALITEGREC', record.fiscalite_grec ? 'O' : 'N');

    if (getParam('FISCALITEGREC').trim() !== 'N') {
      mnuShow('GREEC', false);
    }

    await recuperationLangue();
    setParam('VERIF_USERB', 'O');
    await alimentationCombosLieuSej();
    await initialisationApplication();
  }
}

async function calcNbLieuSejour(): Promise<void> {
  // Task Prefix
  VG.NB_LIEU_SEJOUR = 0;

  // Record Suffix (pour chaque enregistrement de tables_imports)
  for (const record of tablesImportsRecords) {
    VG.NB_LIEU_SEJOUR++;
  }
}
```

---

## 9. Points Cles pour la Migration

1. **Ordre d'execution** : Task Prefix -> Record Main (boucle) -> Task Suffix
2. **Variables globales** : Prefixe VG., stockees dans le Main Program
3. **Expressions** : Evaluees au moment de l'execution, pas au moment du parsing
4. **Transactions** : Gerees par Magic, a reproduire en code moderne
5. **Liens tables** : Equivalent de JOIN avec conditions
