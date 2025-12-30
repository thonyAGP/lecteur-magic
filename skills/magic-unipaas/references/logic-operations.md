# Operations Logiques Magic Unipaas

Ce document reference les operations disponibles dans les LogicLines de Magic.

---

## 1. CallTask - Appel de Programme

### 1.1 Structure

**Dans le XML:**
```xml
<LogicLine>
  <CallTask FlowIsn="26">
    <OperationType val="P"/>          <!-- P = Program, S = Subtask -->
    <TaskID comp="-1" obj="259"/>     <!-- Programme a appeler -->
    <Lock val="N"/>                   <!-- Verrouillage -->
    <Arguments>
      <Argument>
        <id val="1"/>                 <!-- Parametre 1 -->
        <Expression val="10"/>        <!-- Valeur = Expression 10 -->
        <Skip val="N"/>
      </Argument>
      <Argument>
        <id val="2"/>
        <Variable val="21"/>          <!-- Valeur = Variable 21 -->
        <Skip val="N"/>
      </Argument>
    </Arguments>
    <Wait val="Y"/>                   <!-- Attendre la fin -->
    <SyncData val="N"/>               <!-- Synchroniser les donnees -->
    <RetainFocus val="N"/>            <!-- Garder le focus -->
    <Condition val="Y"/>              <!-- Toujours executer -->
    <Modifier val="B"/>
    <Direction val="C"/>
  </CallTask>
</LogicLine>
```

### 1.2 Attributs CallTask

| Attribut | Valeurs | Description |
|----------|---------|-------------|
| `OperationType` | P, S | P=Program, S=Subtask |
| `TaskID` | comp, obj | Reference au programme |
| `Lock` | Y, N | Verrouiller la tache |
| `Wait` | Y, N | Attendre la fin de l'execution |
| `SyncData` | Y, N | Synchroniser les donnees |
| `RetainFocus` | Y, N | Garder le focus sur la fenetre |

### 1.3 Types d'Arguments

| Type | Description | Exemple |
|------|-------------|---------|
| `Expression` | Valeur d'expression | `<Expression val="10"/>` |
| `Variable` | Reference a variable | `<Variable val="21"/>` |

### 1.4 Conversion TypeScript

```typescript
// CallTask vers Programme 259 avec 2 arguments
await callProgram(259, {
  param1: expressions[10],  // Expression 10
  param2: variables[21],    // Variable 21
});
```

---

## 2. Update - Mise a Jour de Variable

### 2.1 Structure

**Dans le XML:**
```xml
<LogicLine>
  <Update FlowIsn="97">
    <FieldID val="4"/>              <!-- Variable a mettre a jour -->
    <WithValue val="1"/>            <!-- Expression source -->
    <Incremental val="N"/>          <!-- Addition incrementale -->
    <ForcedUpdate val="Y"/>         <!-- Forcer la mise a jour -->
    <Condition val="Y"/>            <!-- Condition d'execution -->
    <Modifier val="B"/>
    <Direction val="C"/>
  </Update>
</LogicLine>
```

### 2.2 Attributs Update

| Attribut | Valeurs | Description |
|----------|---------|-------------|
| `FieldID` | N | Variable cible (numero) |
| `WithValue` | N | Expression source (ID) |
| `Incremental` | Y, N | Y = ajouter, N = remplacer |
| `ForcedUpdate` | Y, N | Forcer meme si pas modifie |
| `Condition` | Y, Exp="N" | Condition d'execution |

### 2.3 Conversion TypeScript

```typescript
// Update variable 4 avec expression 1
variables[4] = expressions[1];

// Update incremental
variables[4] += expressions[1];
```

---

## 3. Evaluate - Evaluation d'Expression

### 3.1 Structure

**Dans le XML:**
```xml
<LogicLine>
  <Evaluate FlowIsn="358">
    <Expression val="30"/>          <!-- Expression a evaluer -->
    <Condition val="Y"/>
    <Modifier val="B"/>
    <Direction val="C"/>
  </Evaluate>
</LogicLine>
```

### 3.2 Usage

Evaluate est utilise pour :
- Executer des fonctions avec effets de bord (ex: `SetParam()`)
- Appeler des fonctions sans stocker le resultat
- Declencher des calculs intermediaires

### 3.3 Conversion TypeScript

```typescript
// Evaluate expression 30
// Expression 30 = SetParam('NOM', valeur)
evaluate(expressions[30]);
```

---

## 4. STP - Message Box (Stop)

### 4.1 Structure

**Dans le XML:**
```xml
<LogicLine>
  <STP Buttons="O" DefaultButton="1" FlowIsn="60"
       Image="E" Mode="W" VR_DISP="B"
       TXT="La date de fin doit etre superieure a la date de debut"
       TitleTxt="Erreur">
    <AppendToErrorLog val="N"/>
    <Condition Exp="18"/>           <!-- Condition d'affichage -->
    <Modifier val="B"/>
    <Direction val="F"/>            <!-- F = Forward/Fail ? -->
  </STP>
</LogicLine>
```

### 4.2 Attributs STP

| Attribut | Valeurs | Description |
|----------|---------|-------------|
| `Buttons` | O, Y, N, C | O=OK, Y=Yes/No, C=Cancel |
| `DefaultButton` | 1, 2 | Bouton par defaut |
| `Image` | E, W, I, C, Q | E=Error, W=Warning, I=Info, C=Critical, Q=Question |
| `Mode` | W, E | W=Warning, E=Error |
| `TXT` | string | Texte du message |
| `TitleTxt` | string | Titre de la fenetre |
| `VR_DISP` | B, S | B=Both, S=Status |
| `Direction` | C, F | C=Continue, F=Fail (arret) |

### 4.3 Conversion TypeScript

```typescript
// STP avec condition
if (expressions[18]) {
  const result = await showMessageBox({
    title: 'Erreur',
    message: 'La date de fin doit etre superieure a la date de debut',
    type: 'error',
    buttons: ['OK']
  });
  if (mode === 'F') throw new ValidationError();
}
```

---

## 5. FormIO - Ecriture vers I/O

### 5.1 Structure

**Dans le XML:**
```xml
<LogicLine>
  <FormIO FlowIsn="19">
    <OperationType val="O"/>          <!-- O = Output, I = Input -->
    <Page val="A"/>                   <!-- A = Auto page -->
    <IODeviceInfo>
      <IoDeviceIndex val="1"/>        <!-- Reference au device -->
    </IODeviceInfo>
    <FormEntryInfo>
      <FormEntryIndex val="2"/>       <!-- Reference au form -->
    </FormEntryInfo>
    <Condition Exp="4"/>              <!-- Condition -->
    <Modifier val="B"/>
    <Direction val="C"/>
  </FormIO>
</LogicLine>
```

### 5.2 Conversion TypeScript

```typescript
// FormIO - Ecriture ligne vers fichier
if (expressions[4]) {
  const line = formatForm(forms[2], variables);
  await ioDevices[1].writeLine(line);
}
```

---

## 6. Select - Selection de Colonne

### 6.1 Structure Complete

**Dans le XML:**
```xml
<LogicLine>
  <Select FieldID="1" FlowIsn="4" id="1">
    <ASS val="2"/>                    <!-- Assignation depuis var 2 -->
    <Column val="1"/>                 <!-- Colonne 1 de la table -->
    <Type val="R"/>                   <!-- R=Record, V=Virtual, E=Expression -->
    <IsParameter val="N"/>
    <Locate MAX="2" MIN="2"/>         <!-- Locate sur variable 2 -->
    <Range MAX="2" MIN="1"/>          <!-- Range entre var 1 et var 2 -->
    <DIFF_UPDATE val="T"/>
    <Condition val="Y"/>
    <Modifier val="S"/>
    <Direction val="C"/>
  </Select>
</LogicLine>
```

### 6.2 Types de Select

| Type | Description |
|------|-------------|
| `R` | Record - Champ depuis table physique |
| `V` | Virtual - Variable calculee |
| `E` | Expression - Valeur d'expression |
| `P` | Parameter - Parametre d'entree |

### 6.3 Attributs Speciaux

| Attribut | Description |
|----------|-------------|
| `ASS` | Assignation - Variable source pour mise a jour |
| `Locate` | Positionnement sur valeur (jointure) |
| `Range` | Filtrage par intervalle |

---

## 7. LNK / END_LINK - Liens vers Tables

### 7.1 Structure

**Dans le XML:**
```xml
<LogicLine>
  <LNK Direction="A" EVL_CND="R" FlowIsn="3" Key="1" Mode="W" VIEW="5">
    <DB comp="2" obj="272"/>          <!-- Table liee -->
    <Expanded val="1"/>
    <Condition val="Y"/>
  </LNK>
</LogicLine>

<!-- Colonnes du lien -->
<LogicLine>
  <Select FieldID="1" id="1">
    <Column val="1"/>
    <Type val="R"/>
    <Locate MAX="2" MIN="2"/>
  </Select>
</LogicLine>

<!-- Fin du lien -->
<LogicLine>
  <END_LINK FlowIsn="13"/>
</LogicLine>
```

### 7.2 Attributs LNK

| Attribut | Valeurs | Description |
|----------|---------|-------------|
| `Direction` | A, D | A=Ascending, D=Descending |
| `EVL_CND` | R | Evaluation condition |
| `Key` | N | Index a utiliser |
| `Mode` | R, W, A | R=Read, W=Write, A=? |
| `VIEW` | N | Numero de vue |

---

## 8. Remark - Commentaire

### 8.1 Structure

**Dans le XML:**
```xml
<LogicLine>
  <Remark FlowIsn="43">
    <Type val="0"/>                   <!-- Type de commentaire -->
    <Text val="Traitement des donnees"/>
  </Remark>
</LogicLine>
```

---

## 9. DATAVIEW_SRC - Source de Donnees

### 9.1 Structure

**Dans le XML:**
```xml
<LogicLine>
  <DATAVIEW_SRC FlowIsn="2" IDX="1" Type="M">
    <Condition val="N"/>
    <Modifier val="B"/>
    <Direction val="C"/>
  </DATAVIEW_SRC>
</LogicLine>
```

### 9.2 Attributs

| Attribut | Valeurs | Description |
|----------|---------|-------------|
| `Type` | M | M=Main Source |
| `IDX` | N | Index a utiliser |

---

## 10. Handler - Gestionnaire d'Evenement

### 10.1 Structure

**Dans le XML:**
```xml
<LogicUnit id="11" propagate="78">
  <Level val="H"/>                    <!-- H = Handler -->
  <Type val="U"/>                     <!-- U = User Event -->
  <Scope val="T"/>                    <!-- T = Task scope -->
  <Event>
    <EventType val="U"/>              <!-- U = User event -->
    <Parent val="32768"/>             <!-- Parent = Main Program -->
    <PublicObject comp="-1" obj="1"/> <!-- Evenement public -->
  </Event>
  <TXT val="b_Imprimer"/>             <!-- Nom de l'evenement -->
  <LogicLines>
    <!-- Operations a executer -->
  </LogicLines>
</LogicUnit>
```

### 10.2 Types d'Evenements

| EventType | Description |
|-----------|-------------|
| `S` | Start - Demarrage |
| `F` | Finish - Fin |
| `U` | User - Evenement utilisateur |
| `I` | Internal - Evenement interne |
| `M` | Menu - Selection menu |
| `P` | Program - Evenement programme |

### 10.3 InternalEventID Communs

| ID | Description |
|----|-------------|
| `14` | Close/Exit |
| `34` | ? |

---

## 11. Expressions Conditionnelles

### 11.1 IF Imbrique

```xml
<Expression id="12">
  <ExpSyntax val="IF({0,14}='F','Me',IF({0,14}&lt;>'','M',''))"/>
</Expression>
```

**Decode:**
```
IF(var14 = 'F', 'Me', IF(var14 <> '', 'M', ''))
```

### 11.2 CASE

```xml
<Expression id="15">
  <ExpSyntax val="CASE({0,12},'TR',MlsTrans('Gare'),'PL',MlsTrans('Aéroport'),'TE',MlsTrans('Terminal'),'AU',MlsTrans('Autre'),{0,12})"/>
</Expression>
```

**Decode:**
```
CASE(var12,
  'TR', MlsTrans('Gare'),
  'PL', MlsTrans('Aéroport'),
  'TE', MlsTrans('Terminal'),
  'AU', MlsTrans('Autre'),
  var12  // default
)
```

### 11.3 CndRange

```xml
<Expression id="18">
  <ExpSyntax val="CndRange(Trim({0,35})&lt;>'' AND {0,36}&lt;>'T', IF({0,36}='N','X',''))"/>
</Expression>
```

**Decode:**
```
CndRange(
  condition: Trim(var35) <> '' AND var36 <> 'T',
  result: IF(var36 = 'N', 'X', '')
)
```

### 11.4 Reference Form

```xml
<ExpSyntax val="IF({32768,42},'{0,3}'FORM,'{0,2}'FORM)"/>
```

**Decode:**
```
IF(mainProgram.var42,
  Form reference to var3,
  Form reference to var2
)
```

---

## 12. Resume des Operations

| Operation | Usage |
|-----------|-------|
| `CallTask` | Appel de programme/sous-tache |
| `Update` | Mise a jour de variable |
| `Evaluate` | Evaluation d'expression |
| `STP` | Message box / Erreur |
| `FormIO` | Ecriture vers fichier |
| `Select` | Selection de colonnes |
| `LNK` / `END_LINK` | Liens vers tables |
| `Remark` | Commentaire |
| `DATAVIEW_SRC` | Definition source donnees |

---

## 13. Conditions d'Execution

### 13.1 Condition Toujours Vraie

```xml
<Condition val="Y"/>
```

### 13.2 Condition par Expression

```xml
<Condition Exp="15"/>   <!-- Si expression 15 est vraie -->
```

### 13.3 Condition Jamais

```xml
<Condition val="N"/>
```

---

## 14. Direction et Modifier

### 14.1 Direction

| Valeur | Description |
|--------|-------------|
| `C` | Continue - continuer l'execution |
| `F` | Fail/Forward - echouer/arreter |

### 14.2 Modifier

| Valeur | Description |
|--------|-------------|
| `B` | Both |
| `S` | ? |
