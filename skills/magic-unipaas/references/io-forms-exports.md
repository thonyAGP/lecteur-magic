# I/O Devices, Forms et Exports Magic Unipaas

Ce document decrit les mecanismes d'entree/sortie fichier et les formulaires d'export.

---

## 1. I/O Devices

### 1.1 Definition dans Resource

Un I/O Device definit une sortie fichier (CSV, TXT, imprimante, etc.).

**Dans le XML:**
```xml
<Resource>
  <IO id="1">
    <Description val="Fichier csv"/>
    <IOExpression val="3"/>           <!-- Expression pour le chemin du fichier -->
    <OpenPrintDialog val="N"/>
    <PaperSize val="68"/>
    <Format val="L"/>                 <!-- L = Line -->
    <Media val="S"/>                  <!-- S = Sequential, T = Text -->
    <Access val="W"/>                 <!-- W = Write, R = Read -->
    <Copies val="1"/>
    <Orientation val="P"/>            <!-- P = Portrait, L = Landscape -->
    <PrintPreview val="N"/>
    <PDF val="N"/>
    <Vis2LogTranslation val="N"/>
    <FlipLines val="N"/>
  </IO>
</Resource>
```

### 1.2 Attributs I/O Device

| Attribut | Valeurs | Description |
|----------|---------|-------------|
| `IOExpression` | ID expr | Reference a l'expression du chemin fichier |
| `Format` | L | Line format |
| `Media` | S, T | S=Sequential, T=Text |
| `Access` | W, R | W=Write, R=Read |
| `Orientation` | P, L | P=Portrait, L=Landscape |
| `PDF` | Y, N | Generation PDF |

### 1.3 Expression du Chemin Fichier

```xml
<Expression id="3">
  <ExpSyntax val="'%club_exportdata%'&amp;Trim({32768,33})&amp;'_affectation_auto_'&amp;DStr({0,1},'YYYYMMDD')&amp;'_'&amp;DStr({0,2},'YYYYMMDD')&amp;'.csv'"/>
  <ExpAttribute val="A"/>
</Expression>
```

**Decode:**
```
'%club_exportdata%'              --> Nom logique (variable d'environnement)
& Trim({32768,33})               --> Concatenation + variable 33 du Main Program
& '_affectation_auto_'           --> Texte literal
& DStr({0,1},'YYYYMMDD')         --> Date param 1 formatee YYYYMMDD
& '.csv'                         --> Extension
```

**Resultat:** `C:\Export\SITE_affectation_auto_20251201_20251231.csv`

---

## 2. FormIO - Ecriture vers I/O

### 2.1 Structure

L'operation `FormIO` ecrit des donnees vers un I/O Device.

**Dans le XML:**
```xml
<LogicLine>
  <FormIO FlowIsn="19">
    <OperationType val="O"/>          <!-- O = Output -->
    <Page val="A"/>                   <!-- A = Auto page -->
    <IODeviceInfo>
      <IoDeviceIndex val="1"/>        <!-- Reference au IO id="1" -->
    </IODeviceInfo>
    <FormEntryInfo>
      <FormEntryIndex val="2"/>       <!-- Reference au Form id="2" -->
    </FormEntryInfo>
    <Condition Exp="4"/>              <!-- Condition optionnelle -->
    <Modifier val="B"/>
    <Direction val="C"/>
  </FormIO>
</LogicLine>
```

### 2.2 Attributs FormIO

| Attribut | Valeurs | Description |
|----------|---------|-------------|
| `OperationType` | O, I | O=Output, I=Input |
| `Page` | A, N | A=Auto, N=New page |
| `IoDeviceIndex` | N | Index du device dans Resource/IO |
| `FormEntryIndex` | N | Index du form dans TaskForms |
| `Condition` | Exp="N" | Expression conditionnelle |

---

## 3. Form Text (FORM_TEXT)

### 3.1 Definition

Le Form Text definit le layout pour l'export texte/CSV.

**Dans le XML:**
```xml
<TaskForms>
  <FormEntry CLSS="1" id="2">
    <PropertyList model="FORM_TEXT">
      <Width id="23" val="250"/>      <!-- Largeur totale ligne -->
      <Height id="24" val="1"/>       <!-- Hauteur (1 ligne) -->
      <FormName id="311" valUnicode="Form extraction"/>
    </PropertyList>

    <!-- Controles positionnes -->
    <Control _test_id="1" id="1">
      <PropertyList model="CTRL_TEXT_EDIT">
        <X id="21" val="0"/>          <!-- Position X -->
        <Width id="23" val="10"/>     <!-- Largeur du champ -->
        <Height id="24" val="1"/>
        <Data FieldID="1" id="43"/>   <!-- Variable source -->
        <HorizontalAlignment id="65" val="1"/>
      </PropertyList>
    </Control>

    <Control _test_id="2" id="2">
      <PropertyList model="CTRL_TEXT_EDIT">
        <X id="21" val="11"/>         <!-- Position suivante -->
        <Width id="23" val="15"/>
        <Data FieldID="2" id="43"/>
      </PropertyList>
    </Control>
  </FormEntry>
</TaskForms>
```

### 3.2 Positionnement des Champs

Les controles sont positionnes par X (colonne) et Width (largeur).

```
Position:  0         10        25        35
           |---------|---------|---------|
Champ 1:   [  var1   ]
Champ 2:              [    var2     ]
Champ 3:                        [var3]
```

### 3.3 Conversion vers Code

**TypeScript:**
```typescript
function formatExportLine(record: Record): string {
  const fields = [
    record.var1.padEnd(10),      // X=0, Width=10
    record.var2.padEnd(15),      // X=11, Width=15
    record.var3.padEnd(10),      // X=27, Width=10
  ];
  return fields.join('');
}
```

---

## 4. Programmes Residents

### 4.1 Definition

Un programme resident est charge une fois en memoire et reutilise.

**Dans le XML:**
```xml
<Header Description="Maj Credit Conso / Type" id="547">
  <Resident val="Y"/>           <!-- Programme resident -->
  <TaskType val="B"/>
</Header>
```

### 4.2 Caracteristiques

- Charge une seule fois au premier appel
- Variables conservees entre les appels
- Performance optimisee pour appels frequents
- Utilise pour les sous-routines communes

---

## 5. Link Write (Mise a Jour)

### 5.1 Structure

Un Link Write permet de mettre a jour une table liee.

**Dans le XML:**
```xml
<LogicLine>
  <LNK Direction="A" EVL_CND="R" FlowIsn="3" Key="1" Mode="W" VIEW="5">
    <DB comp="2" obj="272"/>
    <Expanded val="1"/>
    <Condition val="Y"/>
  </LNK>
</LogicLine>

<!-- Selection des colonnes avec Locate -->
<LogicLine>
  <Select FieldID="1" FlowIsn="4" id="1">
    <ASS val="2"/>                    <!-- Assignation depuis var 2 -->
    <Column val="1"/>
    <Type val="R"/>
    <Locate MAX="2" MIN="2"/>         <!-- Locate sur var 2 -->
  </Select>
</LogicLine>

<!-- Mise a jour dans Record Suffix -->
<LogicLine>
  <Update FlowIsn="97">
    <FieldID val="4"/>                <!-- Champ a mettre a jour -->
    <WithValue val="1"/>              <!-- Expression 1 -->
    <ForcedUpdate val="Y"/>
  </Update>
</LogicLine>
```

### 5.2 Attribut Mode

| Mode | Description |
|------|-------------|
| `R` | Read - Lecture seule |
| `W` | Write - Lecture/Ecriture |
| `A` | ? - A determiner |

### 5.3 Attribut ASS (Assignation)

L'attribut `ASS` dans Select indique que la colonne sera mise a jour avec la valeur de la variable referencee.

```xml
<Select FieldID="1" id="1">
  <ASS val="2"/>        <!-- Assigner depuis variable 2 -->
  <Column val="1"/>     <!-- Colonne 1 de la table -->
  <Locate MAX="2" MIN="2"/>
</Select>
```

---

## 6. Range Dynamique (VarRangeInfo)

### 6.1 Structure

Le Range peut etre defini dynamiquement par des variables.

**Dans le XML:**
```xml
<Information>
  <Range Direction="A"/>
  <VarRange LastIsn="2"/>
</Information>

<!-- Plus bas dans le fichier -->
<VarRangeInfo Mode="F" VarRangeVeeIsn="4" id="1"/>   <!-- From: var 4 -->
<VarRangeInfo Mode="T" VarRangeVeeIsn="4" id="2"/>   <!-- To: var 4 -->
```

### 6.2 Attributs VarRangeInfo

| Attribut | Valeurs | Description |
|----------|---------|-------------|
| `Mode` | F, T | F=From (min), T=To (max) |
| `VarRangeVeeIsn` | N | Reference a la variable |
| `id` | N | Index dans VarRange |

### 6.3 Exemple Pratique

```
Main Source: table_dates (Index 1)
  Column 1: date_event    Range: var1 To: var2

Equivalent SQL:
  WHERE date_event BETWEEN @var1 AND @var2
```

---

## 7. Commentaires (Remark)

### 7.1 Structure

**Dans le XML:**
```xml
<LogicLine>
  <Remark FlowIsn="43">
    <Type val="0"/>           <!-- Type de commentaire -->
    <Text val="Texte du commentaire"/>
  </Remark>
</LogicLine>
```

### 7.2 Types de Remark

| Type | Description |
|------|-------------|
| `0` | Commentaire standard |
| `1` | ? |

---

## 8. Nouvelles Expressions Decouvertes

### 8.1 Noms Logiques

```
'%nom_logique%'     --> Variable d'environnement Magic
```

Definis dans Magic.ini ou via `INIPut()`.

### 8.2 Valeurs Booleennes

```
'TRUE'LOG           --> Boolean True
'FALSE'LOG          --> Boolean False
```

### 8.3 Fonction Counter

```
Counter(0)          --> Compteur qui ne se reinitialise pas
Counter(1)          --> Compteur qui se reinitialise a chaque groupe
Counter(0) = 1      --> Test si premier enregistrement
```

### 8.4 Formatage Numerique

```
Str({0,11}, '6')    --> Variable 11 formatee sur 6 caracteres
Str(number, 'N.D')  --> N entiers, D decimales
```

### 8.5 Pictures Numeriques

| Picture | Description | Exemple |
|---------|-------------|---------|
| `8P0` | 8 chiffres, leading zeros | `00001234` |
| `3L` | 3 chiffres, leading zeros | `007` |
| `12.3` | 12 entiers, 3 decimales | `123456789.123` |
| `6` | 6 caracteres | `  1234` |
| `N` | N chiffres sans leading zeros | `1234` |

---

## 9. Form GUI avec Table Control

### 9.1 Structure

**Dans le XML:**
```xml
<TaskForms>
  <FormEntry id="1">
    <PropertyList model="FORM_GUI0">
      <Width id="23" val="2116"/>
      <Height id="24" val="195"/>
      <FormName id="311" valUnicode="Export - tempo_mecano"/>
    </PropertyList>

    <!-- Table Control -->
    <Control id="1">
      <PropertyList model="CTRL_GUI0_TABLE">
        <Elements id="81" val="26"/>        <!-- Nombre de colonnes -->
        <TitleHeight id="79" val="12"/>
        <RowHeight id="80" val="12"/>
        <MultiMarking id="196"/>
      </PropertyList>
    </Control>

    <!-- Colonnes de la table -->
    <Control ISN_FATHER="1" id="28">
      <PropertyList model="CTRL_GUI0_COLUMN">
        <Width id="23" val="66"/>
        <ControlLayer id="25" val="1"/>
        <ColumnTitle id="139" valUnicode="mec1_user"/>
      </PropertyList>
    </Control>

    <!-- Champs editables dans la table -->
    <Control ISN_FATHER="1" id="2">
      <PropertyList model="CTRL_GUI0_EDIT">
        <Data FieldID="1" id="43"/>
        <ControlName id="46" val="mec1_user"/>
        <ControlLayer id="25" val="1"/>
        <TabOrder id="314" val="1"/>
      </PropertyList>
    </Control>
  </FormEntry>
</TaskForms>
```

### 9.2 Hierarchie des Controles

```
FORM_GUI0
  └── CTRL_GUI0_TABLE (ISN_FATHER="1")
        ├── CTRL_GUI0_COLUMN (definition colonne)
        └── CTRL_GUI0_EDIT (champ editable)
```

---

## 10. Resume des Types de Formulaires

| Model | Description | Usage |
|-------|-------------|-------|
| `FORM_GUI0` | Formulaire GUI Windows | Ecrans interactifs |
| `FORM_TEXT` | Formulaire texte | Exports fichiers |
| `FORM_PRINT` | Formulaire impression | Editions PDF |

| Control Model | Description |
|---------------|-------------|
| `CTRL_GUI0_TABLE` | Grille/Table |
| `CTRL_GUI0_COLUMN` | Definition colonne |
| `CTRL_GUI0_EDIT` | Champ editable |
| `CTRL_TEXT_EDIT` | Champ texte export |
