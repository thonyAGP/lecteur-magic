# Logique d'Arborescence Magic Unipaas

## Vue d'Ensemble

L'arborescence des programmes Magic est definie par la combinaison de deux fichiers :
- **Progs.xml** : Structure des dossiers et ordre des programmes
- **ProgramHeaders.xml** : Metadonnees detaillees de chaque programme

---

## 1. Structure de Progs.xml

### 1.1 Section Folders (Dossiers)

```xml
<Header>
  <Version val="12030"/>
  <WithIsn val="Y"/>
  <Exe comp="-1"/>
  <LastIsn val="973"/>               <!-- Dernier ID de programme -->
  <LastIsnFolder val="47"/>          <!-- Dernier ID de dossier -->

  <Folders>
    <Folder id="1">
      <Name val="Bar"/>
      <StartsAt val="613"/>          <!-- Position dans ProgramsRepositoryOutLine -->
      <NumberOfEntries val="2"/>     <!-- Nombre de programmes dans ce dossier -->
    </Folder>
    <Folder id="2">
      <Name val="Biking"/>
      <StartsAt val="615"/>
      <NumberOfEntries val="1"/>
    </Folder>
    <!-- ... autres dossiers ... -->
  </Folders>
</Header>
```

**Attributs Folder :**
| Attribut | Description |
|----------|-------------|
| `id` | Identifiant unique du dossier |
| `Name val` | Nom affiche du dossier |
| `StartsAt` | Position (1-indexed) du premier programme dans ProgramsRepositoryOutLine |
| `NumberOfEntries` | Nombre de programmes contenus |

### 1.2 Section ProgramsRepositoryOutLine

```xml
<ProgramsRepositoryOutLine>
  <Programs>
    <Program id="1"/>    <!-- Position 1 : Programme racine -->
    <Program id="2"/>    <!-- Position 2 : Programme racine -->
    <Program id="3"/>    <!-- Position 3 : Programme racine -->
    <!-- ... -->
    <Program id="456"/>  <!-- Position 612 : Dernier programme racine -->
    <Program id="789"/>  <!-- Position 613 : Premier du dossier "Bar" (StartsAt=613) -->
    <Program id="790"/>  <!-- Position 614 : Deuxieme du dossier "Bar" -->
    <Program id="123"/>  <!-- Position 615 : Premier du dossier "Biking" (StartsAt=615) -->
    <!-- ... -->
  </Programs>
</ProgramsRepositoryOutLine>
```

---

## 2. Algorithme de Reconstruction

### 2.1 Logique de Mapping

```
Position 1 a (StartsAt_premier_dossier - 1) : Programmes RACINE
Position StartsAt a (StartsAt + NumberOfEntries - 1) : Programmes du DOSSIER
```

### 2.2 Implementation TypeScript

```typescript
interface MagicFolder {
  id: number;
  name: string;
  startsAt: number;
  numberOfEntries: number;
  programs: MagicProgram[];
}

interface MagicProgram {
  id: number;
  description: string;
  taskType: string;
  parameters: MagicParameter[];
  folder?: string;  // Nom du dossier parent (null = racine)
}

interface MagicParameter {
  index: number;
  type: string;  // A, U, N, D, T, B, L
}

interface ArborescenceResult {
  rootPrograms: MagicProgram[];
  folders: MagicFolder[];
}

function buildArborescence(
  progsXml: ProgsXmlData,
  programHeadersXml: ProgramHeadersXmlData
): ArborescenceResult {
  // 1. Parser les dossiers
  const folders = progsXml.folders.map(f => ({
    id: f.id,
    name: f.name,
    startsAt: f.startsAt,
    numberOfEntries: f.numberOfEntries,
    programs: [] as MagicProgram[]
  }));

  // 2. Creer un index position -> folder
  const positionToFolder = new Map<number, MagicFolder>();
  for (const folder of folders) {
    for (let i = 0; i < folder.numberOfEntries; i++) {
      positionToFolder.set(folder.startsAt + i, folder);
    }
  }

  // 3. Parser les headers de programmes
  const programsById = new Map<number, MagicProgram>();
  for (const header of programHeadersXml.programs) {
    programsById.set(header.id, {
      id: header.id,
      description: header.description || `Program ${header.id}`,
      taskType: header.taskType,
      parameters: parseParameters(header.parametersAttributes)
    });
  }

  // 4. Assigner les programmes aux dossiers
  const rootPrograms: MagicProgram[] = [];
  const programOrder = progsXml.programsOutline;

  for (let position = 1; position <= programOrder.length; position++) {
    const programId = programOrder[position - 1];
    const program = programsById.get(programId);

    if (!program) continue;

    const folder = positionToFolder.get(position);
    if (folder) {
      program.folder = folder.name;
      folder.programs.push(program);
    } else {
      rootPrograms.push(program);
    }
  }

  return { rootPrograms, folders };
}

function parseParameters(attrs: ParameterAttribute[]): MagicParameter[] {
  return attrs.map((attr, index) => ({
    index: index + 1,
    type: attr.MgAttr  // A, U, N, D, T, B, L
  }));
}
```

### 2.3 Implementation Python

```python
from dataclasses import dataclass, field
from typing import List, Optional, Dict
import xml.etree.ElementTree as ET

@dataclass
class MagicParameter:
    index: int
    type: str  # A, U, N, D, T, B, L

@dataclass
class MagicProgram:
    id: int
    description: str
    task_type: str
    parameters: List[MagicParameter] = field(default_factory=list)
    folder: Optional[str] = None

@dataclass
class MagicFolder:
    id: int
    name: str
    starts_at: int
    number_of_entries: int
    programs: List[MagicProgram] = field(default_factory=list)

@dataclass
class Arborescence:
    root_programs: List[MagicProgram]
    folders: List[MagicFolder]


def parse_progs_xml(progs_path: str) -> tuple:
    """Parse Progs.xml et retourne (folders, program_order)."""
    tree = ET.parse(progs_path)
    root = tree.getroot()

    # Parse folders
    folders = []
    for folder_elem in root.findall('.//Folder'):
        folders.append(MagicFolder(
            id=int(folder_elem.get('id')),
            name=folder_elem.find('Name').get('val'),
            starts_at=int(folder_elem.find('StartsAt').get('val')),
            number_of_entries=int(folder_elem.find('NumberOfEntries').get('val'))
        ))

    # Parse program order
    program_order = []
    for prog_elem in root.findall('.//ProgramsRepositoryOutLine/Programs/Program'):
        program_order.append(int(prog_elem.get('id')))

    return folders, program_order


def parse_program_headers_xml(headers_path: str) -> Dict[int, MagicProgram]:
    """Parse ProgramHeaders.xml et retourne un dict id -> program."""
    tree = ET.parse(headers_path)
    root = tree.getroot()

    programs = {}
    for prog_elem in root.findall('.//Program'):
        header = prog_elem.find('Header')
        prog_id = int(header.get('id'))

        # Parse parameters
        params = []
        params_attrs = header.findall('.//ParametersAttributes/Attr')
        for i, attr in enumerate(params_attrs):
            params.append(MagicParameter(
                index=i + 1,
                type=attr.get('MgAttr', 'U')
            ))

        programs[prog_id] = MagicProgram(
            id=prog_id,
            description=header.get('Description', f'Program {prog_id}'),
            task_type=header.find('TaskType').get('val') if header.find('TaskType') is not None else 'O',
            parameters=params
        )

    return programs


def build_arborescence(progs_path: str, headers_path: str) -> Arborescence:
    """Construit l'arborescence complete du projet."""
    folders, program_order = parse_progs_xml(progs_path)
    programs_by_id = parse_program_headers_xml(headers_path)

    # Index position -> folder
    position_to_folder: Dict[int, MagicFolder] = {}
    for folder in folders:
        for i in range(folder.number_of_entries):
            position_to_folder[folder.starts_at + i] = folder

    # Assigner les programmes
    root_programs = []
    for position, prog_id in enumerate(program_order, start=1):
        program = programs_by_id.get(prog_id)
        if not program:
            continue

        folder = position_to_folder.get(position)
        if folder:
            program.folder = folder.name
            folder.programs.append(program)
        else:
            root_programs.append(program)

    return Arborescence(root_programs=root_programs, folders=folders)
```

---

## 3. Exemple Concret

### Donnees Source (REF)

**Progs.xml :**
```xml
<Folders>
  <Folder id="1">
    <Name val="Bar"/>
    <StartsAt val="613"/>
    <NumberOfEntries val="2"/>
  </Folder>
  <Folder id="15">
    <Name val="Mecano"/>
    <StartsAt val="683"/>
    <NumberOfEntries val="15"/>
  </Folder>
</Folders>

<ProgramsRepositoryOutLine>
  <Programs>
    <Program id="1"/>   <!-- Position 1 : Main Program -->
    <Program id="2"/>   <!-- Position 2 : Vide -->
    <Program id="3"/>   <!-- Position 3 : REF_VERSION -->
    <!-- ... positions 4 a 612 : programmes racine ... -->
    <Program id="725"/> <!-- Position 613 : Premier du dossier "Bar" -->
    <Program id="726"/> <!-- Position 614 : Deuxieme du dossier "Bar" -->
    <!-- ... -->
    <Program id="671"/> <!-- Position 683 : Premier du dossier "Mecano" -->
    <!-- ... 14 autres programmes Mecano ... -->
  </Programs>
</ProgramsRepositoryOutLine>
```

**ProgramHeaders.xml :**
```xml
<Program>
  <Header Description="Main Program" id="1">
    <TaskType val="B"/>
  </Header>
</Program>
<Program>
  <Header Description="900 Progs - 25/11/2025" id="3">
    <Public val="REF_VERSION"/>
    <TaskType val="B"/>
  </Header>
</Program>
<Program>
  <Header Description="Groupage Mecano" id="671">
    <TaskType val="O"/>
  </Header>
</Program>
```

### Resultat de l'Arborescence

```
RACINE/
├── 1 - Main Program (B)
├── 2 - [Vide]
├── 3 - REF_VERSION (B)
├── ... (programmes 4 a 612)
│
├── Bar/
│   ├── 725 - Programme Bar 1
│   └── 726 - Programme Bar 2
│
├── Mecano/
│   ├── 671 - Groupage Mecano (O)
│   ├── ... (14 autres)
│
└── ... (autres dossiers)
```

---

## 4. Gestion des Composants Partages

### 4.1 Structure Comps.xml

Les composants partages (comme REF) permettent d'acceder aux tables definies dans un autre projet.

```xml
<Component id="2" name="REF">
  <Description val="Composant de reference"/>
  <ComponentType val="Magic xpa"/>
  <Type val="C"/>                    <!-- C = Component -->
  <CABINET_FILE val="..\REF\REF.ecf"/>
  <LoadImmediate val="Y"/>
</Component>
```

### 4.2 Resolution des References

Quand un projet (PBP) reference une table definie dans REF :

1. **Dans Comps.xml de PBP** : Declaration du composant REF
2. **Dans les programmes PBP** : `<DataObject comp="2" obj="31"/>` ou `comp="2"` reference le composant REF
3. **Resolution** : Chercher `obj="31"` dans `DataSources.xml` de REF

```typescript
interface ComponentReference {
  compId: number;      // ID dans Comps.xml
  componentName: string;
  basePath: string;    // Chemin vers le projet reference
}

function resolveDataObject(
  compId: number,
  objId: number,
  components: ComponentReference[]
): DataObject | null {
  if (compId === -1) {
    // Composant local
    return localDataSources.get(objId);
  }

  const component = components.find(c => c.compId === compId);
  if (!component) return null;

  // Charger DataSources du composant reference
  const refDataSources = loadDataSources(component.basePath);
  return refDataSources.get(objId);
}
```

---

## 5. Affichage de l'Arborescence

### Format Texte

```typescript
function displayArborescence(arbo: ArborescenceResult): string {
  const lines: string[] = [];

  // Programmes racine
  lines.push('RACINE/');
  for (const prog of arbo.rootPrograms.slice(0, 5)) {
    lines.push(`├── ${prog.id} - ${prog.description} (${prog.taskType})`);
  }
  if (arbo.rootPrograms.length > 5) {
    lines.push(`├── ... (${arbo.rootPrograms.length - 5} autres)`);
  }
  lines.push('│');

  // Dossiers
  for (const folder of arbo.folders) {
    lines.push(`├── ${folder.name}/`);
    for (const prog of folder.programs.slice(0, 3)) {
      lines.push(`│   ├── ${prog.id} - ${prog.description}`);
    }
    if (folder.programs.length > 3) {
      lines.push(`│   └── ... (${folder.programs.length - 3} autres)`);
    }
  }

  return lines.join('\n');
}
```

### Format JSON

```typescript
function exportArborescenceJson(arbo: ArborescenceResult): string {
  return JSON.stringify({
    rootPrograms: arbo.rootPrograms.map(p => ({
      id: p.id,
      description: p.description,
      taskType: p.taskType,
      parametersCount: p.parameters.length
    })),
    folders: arbo.folders.map(f => ({
      name: f.name,
      programCount: f.programs.length,
      programs: f.programs.map(p => ({
        id: p.id,
        description: p.description
      }))
    }))
  }, null, 2);
}
```

---

## 6. Cas Particuliers

### 6.1 Programmes Vides

Certains programmes ont `ISEMPTY_TSK="1"` dans le header, indiquant qu'ils sont des placeholders.

```xml
<Header ISEMPTY_TSK="1" ISN_2="1" LastIsn="1" id="2">
```

### 6.2 Programmes Publics

Les programmes avec un attribut `Public` peuvent etre appeles par leur nom public.

```xml
<Header Description="Browse - ann" id="5">
  <Public val="ann"/>  <!-- Appelable via "ann" -->
</Header>
```

### 6.3 Sous-taches

Les sous-taches sont definies dans le meme fichier Prg_XXX.xml que leur tache parente, avec un attribut `MainProgram="N"`.

```xml
<!-- Dans Prg_671.xml -->
<Task MainProgram="Y">  <!-- Tache principale -->
  ...
</Task>
<Task MainProgram="N">  <!-- Sous-tache -->
  <Header id="2" Description="Sous-tache 1"/>
  ...
</Task>
```
