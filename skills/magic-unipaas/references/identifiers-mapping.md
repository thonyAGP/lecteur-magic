# Mapping des Identifiants Magic Unipaas

## Vue d'Ensemble

Magic Unipaas utilise plusieurs systemes d'identification qui peuvent preter a confusion.
Ce document clarifie les differents types d'identifiants et leur correspondance.

---

## 1. Identifiants de Programmes

### 1.1 Types d'Identifiants

| Type | Localisation | Exemple | Description |
|------|--------------|---------|-------------|
| **File ID** | Nom fichier | `5` (Prg_5.xml) | Identifiant logique du programme |
| **Header ID** | `<Header id="X">` | `5` | ID dans le header XML |
| **ISN (Task ID)** | IDE Magic | `152` | Internal Serial Number interne |
| **Public Name** | `<Public val="X">` | `REF_VERSION` | Nom public pour appels externes |

### 1.2 Relation entre Identifiants

```
Fichier Prg_5.xml
    │
    └── <Header id="5">        ← File ID / Header ID (identiques)
            │
            └── Affiche dans IDE comme "Task 152"  ← ISN interne
```

**Important :** L'ISN (152) est un identifiant interne de Magic qui peut changer.
L'ID du fichier (5) est l'identifiant stable a utiliser pour les references.

### 1.3 Resolution des Appels

Quand un `CallTask` reference `obj="401"` :
1. Chercher dans `ProgramHeaders.xml` le programme avec `id="401"`
2. Le code source est dans `Prg_401.xml`

```xml
<!-- Dans Prg_5.xml -->
<CallTask FlowIsn="10">
  <TaskID comp="-1" obj="401"/>  <!-- Appelle le programme 401 -->
</CallTask>

<!-- Correspond a Prg_401.xml -->
```

---

## 2. Identifiants de Composants (comp)

### 2.1 Valeurs Speciales

| comp | Signification |
|------|---------------|
| `-1` | Composant local (meme projet) |
| `1` | Premier composant externe (souvent UserFunctionality) |
| `2` | Deuxieme composant externe (souvent REF dans PBP) |
| `N` | N-ieme composant (voir Comps.xml) |

### 2.2 Exemple PBP

Dans le projet PBP, `comp="2"` reference le composant REF :

```xml
<!-- Comps.xml de PBP -->
<Component id="2" name="REF">
  <CABINET_FILE val="..\REF\REF.ecf"/>
</Component>
```

Donc `<DataObject comp="2" obj="81"/>` signifie :
- Composant 2 = REF
- Table 81 dans REF = `societe__________soc`

---

## 3. Identifiants de Tables (obj)

### 3.1 Structure

Les tables sont identifiees par leur `id` dans `DataSources.xml`.

```xml
<DataObject id="81" name="societe__________soc" PhysicalName="cafil059_dat">
```

| Attribut | Description | Exemple |
|----------|-------------|---------|
| `id` | Identifiant numerique | `81` |
| `name` | Nom logique Magic | `societe__________soc` |
| `PhysicalName` | Nom table SQL | `cafil059_dat` |
| `Public` | Nom public | `cafil059_dat01` |
| `data_source` | Source de donnees | `Pms` |

### 3.2 Tables Decouvertes (Projet REF)

| obj ID | Nom Logique | Nom SQL | Data Source |
|--------|-------------|---------|-------------|
| 1 | `histoticket_dat` | `histoticket_dat` | Pooling |
| 69 | `initialisation___ini` | `cafil047_dat` | Pms |
| 81 | `societe__________soc` | `cafil059_dat` | Pms |
| 118 | `tables_imports` | `cafil096_dat` | Pms |
| 728 | `arc_cc_total` | `arc_cctotal` | PmsArchivage |

---

## 4. Identifiants de Colonnes/Variables

### 4.1 Dans l'IDE (Lettres)

L'IDE Magic utilise des lettres pour identifier les variables :

```
A, B, C, ..., Z           (1-26)
BA, BB, BC, ..., BZ       (27-52)
CA, CB, CC, ...           (53+)
```

### 4.2 Dans le XML (FieldID)

```xml
<Update FlowIsn="92">
  <FieldID val="45"/>           <!-- Variable 45 -->
  <WithValue val="14"/>         <!-- Expression 14 -->
</Update>
```

### 4.3 Conversion Lettre <-> Numero

```typescript
function letterToFieldId(letter: string): number {
  if (letter.length === 1) {
    return letter.charCodeAt(0) - 64; // A=1, B=2, ..., Z=26
  }
  if (letter.length === 2) {
    const first = letter.charCodeAt(0) - 64; // B=2, C=3, ...
    const second = letter.charCodeAt(1) - 64;
    return (first - 1) * 26 + second + 26; // BA=27, BB=28, ...
  }
  return -1;
}

function fieldIdToLetter(id: number): string {
  if (id <= 26) {
    return String.fromCharCode(64 + id); // 1=A, 2=B, ...
  }
  const first = Math.floor((id - 27) / 26) + 2; // B, C, D, ...
  const second = ((id - 27) % 26) + 1; // A, B, C, ...
  return String.fromCharCode(64 + first) + String.fromCharCode(64 + second);
}

// Exemples :
// A -> 1, Z -> 26, BA -> 27, BE -> 31, BD -> 30
```

### 4.4 Exemple de Correspondance

| Lettre IDE | FieldID | Variable |
|------------|---------|----------|
| A | 1 | VG.LOGIN |
| B | 2 | VG.USER |
| BD | 30 | VG.NB LIEU SEJOUR |
| BE | 31 | VG.ETAT EFFEC PAR LIEU SEJOUR |

---

## 5. Identifiants d'Expressions

### 5.1 Structure

Les expressions sont numerotees dans la section `<Expressions>` :

```xml
<Expressions>
  <Expression id="1">
    <ExpSyntax val="'C'"/>
  </Expression>
  <Expression id="5">
    <ExpSyntax val="INIGet ('[MAGIC_LOGICAL_NAMES]RunMode')='B'"/>
  </Expression>
</Expressions>
```

### 5.2 References dans le Code

| Reference | Signification |
|-----------|---------------|
| `<Condition val="Y"/>` | Condition toujours vraie |
| `<Condition val="N"/>` | Condition toujours fausse |
| `<Condition Exp="5"/>` | Reference a l'expression 5 |
| `<WithValue val="14"/>` | Utilise l'expression 14 |

---

## 6. Identifiants d'Evenements

### 6.1 Evenements Internes (InternalEventID)

| ID | Nom | Description |
|----|-----|-------------|
| 23 | Open Application | Ouvrir une application |
| 28 | Exit | Quitter l'application |
| ... | ... | ... |

### 6.2 Exemple

```xml
<RaiseEvent FlowIsn="72">
  <Event>
    <EventType val="I"/>           <!-- I = Internal -->
    <InternalEventID val="28"/>    <!-- 28 = Exit -->
  </Event>
</RaiseEvent>
```

---

## 7. References Parent (Parent val)

### 7.1 Valeur Speciale 32768

`Parent val="32768"` indique une reference au Main Program :

```xml
<Update FlowIsn="92">
  <Parent val="32768"/>    <!-- Reference au Main Program -->
  <FieldID val="45"/>      <!-- Variable 45 du Main Program -->
</Update>
```

Cela permet d'acceder aux variables globales (VG.) depuis n'importe quelle sous-tache.

### 7.2 Autres Valeurs

| Parent val | Signification |
|------------|---------------|
| 32768 | Main Program (variables globales) |
| (absent) | Contexte local |
| N | Tache parente N |

---

## 8. Algorithme de Resolution Complete

### 8.1 Resoudre un CallTask

```typescript
interface ResolvedCall {
  programId: number;
  programName: string;
  sourceFile: string;
  isSubTask: boolean;
}

function resolveCallTask(
  callTask: CallTaskXml,
  programHeaders: ProgramHeader[],
  components: Component[]
): ResolvedCall {
  const comp = callTask.TaskID.comp;
  const obj = callTask.TaskID.obj;
  const isSubTask = callTask.OperationType === 'T';

  if (comp === -1) {
    // Programme local
    const header = programHeaders.find(h => h.id === obj);
    return {
      programId: obj,
      programName: header?.description || `Program ${obj}`,
      sourceFile: `Prg_${obj}.xml`,
      isSubTask
    };
  } else {
    // Programme dans un composant externe
    const component = components.find(c => c.id === comp);
    return {
      programId: obj,
      programName: `${component?.name}.${obj}`,
      sourceFile: `${component?.basePath}/Prg_${obj}.xml`,
      isSubTask
    };
  }
}
```

### 8.2 Resoudre une Table

```typescript
interface ResolvedTable {
  tableId: number;
  logicalName: string;
  physicalName: string;
  dataSource: string;
  component: string;
}

function resolveDataObject(
  dataObject: DataObjectRef,
  localDataSources: DataSource[],
  components: Component[]
): ResolvedTable {
  const comp = dataObject.comp;
  const obj = dataObject.obj;

  if (comp === -1) {
    // Table locale
    const table = localDataSources.find(t => t.id === obj);
    return {
      tableId: obj,
      logicalName: table.name,
      physicalName: table.physicalName,
      dataSource: table.dataSource,
      component: 'local'
    };
  } else {
    // Table dans un composant externe (ex: REF)
    const component = components.find(c => c.id === comp);
    // Charger DataSources du composant
    const refDataSources = loadDataSources(component.basePath);
    const table = refDataSources.find(t => t.id === obj);
    return {
      tableId: obj,
      logicalName: table.name,
      physicalName: table.physicalName,
      dataSource: table.dataSource,
      component: component.name
    };
  }
}
```

---

## 9. Resume des Correspondances Prg_5.xml

### Programmes Appeles

| obj (XML) | Nom (IDE) | Description |
|-----------|-----------|-------------|
| 12 | SubTask 1 | calc nb lieu sejour |
| 146 | Program 146 | Pilotage Gestion de Crise |
| 149 | Program 149 | Preparation Arrivants/Presents |
| 150 | Program 150 | Import Special Offers |
| 153 | Program 153 | Initialisation Application |
| 154 | Program 154 | Recuperation langue |
| 373 | Program 373 | Verification si client/serveur |
| 392 | Program 392 | Alimentation Combos LIEU SEJ |

### Variables Utilisees

| Lettre | FieldID | Nom | Type |
|--------|---------|-----|------|
| L | 12 | VG.MASQUE MONTANT | Alpha |
| BD | 30 | VG.NB LIEU SEJOUR | Numeric |
| BE | 31 | VG.ETAT EFFEC PAR LIEU SEJOUR | Alpha |

### Tables Utilisees

| comp | obj | Nom | SQL |
|------|-----|-----|-----|
| 2 | 69 | initialisation___ini | cafil047_dat |
| 2 | 81 | societe__________soc | cafil059_dat |
| 2 | 118 | tables_imports | cafil096_dat |
| 2 | 728 | arc_cc_total | arc_cctotal |
