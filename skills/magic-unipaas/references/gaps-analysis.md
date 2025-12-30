# Analyse des Lacunes - Skill Magic Unipaas

## Date: 2025-12-24

Ce document identifie les elements XML Magic que je ne comprends pas encore completement.

---

## 1. Operations manquantes

### 1.1 IO (Input/Output File)

```xml
<IO id="1">
  <Description val="Export - tempo_mecan"/>
  <IOExpression val="1"/>      <!-- Quelle expression? -->
  <OpenPrintDialog val="N"/>
  <PaperSize val="68"/>        <!-- Code papier? -->
  <Format val="L"/>            <!-- L = ? -->
  <Media val="T"/>             <!-- T = ? -->
  <Access val="W"/>            <!-- W = Write -->
  <Copies val="1"/>
  <Orientation val="P"/>       <!-- P = Portrait -->
  <PDF val="N"/>
  <PrintPreview val="N"/>
  <Vis2LogTranslation val="N"/>
  <FlipLines val="N"/>
</IO>
```

**Questions:**
- Comment utiliser IO dans le code migre?
- Quels sont les Media types (T, F, ...)?
- Comment generer les fichiers de sortie?

### 1.2 STP (Stop/Message Box)

```xml
<STP Buttons="O" DefaultButton="1" ERR_LOG_DEF_CHG="N"
     Exp="62" FlowIsn="37" IMG_DEF_CHG="N"
     Image="E" Mode="W" TTL_DEF_CHG="N"
     TitleTxt="Warning" VR_DISP="B">
</STP>
```

**Questions:**
- Buttons: O = OK only? Autres valeurs?
- Image: E = Error? W = Warning? I = Info?
- Mode: W = Wait? Autres?
- Exp: reference a quelle expression?

### 1.3 Evaluate

```xml
<Evaluate FlowIsn="7">
  <Expression val="2"/>      <!-- Execute l'expression 2 -->
  <Condition val="Y"/>
  <Modifier val="B"/>
  <Direction val="C"/>
</Evaluate>
```

**Questions:**
- Quand utiliser Evaluate vs Update?
- Evaluate execute une expression sans affecter de variable?

---

## 2. Internal Event IDs

Vus dans les fichiers:

| ID | Signification supposee |
|----|------------------------|
| 14 | Close/Exit? |
| 34 | Validation? |
| 63 | ? |
| 219 | Abandon? |
| 220 | Continue? |
| 393 | ? |

**A documenter:** Liste complete des InternalEventID avec signification.

---

## 3. BLOCK Types

```xml
<BLOCK EndBlock="84" EndBlockSegment="84" FlowIsn="82" Type="I">
  <Condition Exp="5"/>
</BLOCK>
...
<BLOCK EndBlock="36" EndBlockSegment="36" FlowIsn="59" Type="E">
  <Condition val="Y"/>
</BLOCK>
<END_BLK FlowIsn="57"/>
```

**Questions:**
- Type="I" = IF?
- Type="E" = ELSE?
- Comment gerer les blocs imbriques?
- EndBlock vs EndBlockSegment?

---

## 4. EventType values

| Code | Signification |
|------|---------------|
| S | System (Task Prefix/Suffix, Record events) |
| I | Internal (event numerique) |
| U | User? |
| K | Key/Keyboard? |
| ? | Autres? |

**A documenter:** Liste complete des EventType.

---

## 5. Fichiers projet non analyses

### 5.1 DataSources.xml (structure tables)

Besoin de comprendre:
- Structure des DataObject
- Liens entre tables (FK)
- Indexes et cles
- Types de colonnes

### 5.2 Models.xml

- Definition des modeles de champs
- Templates reutilisables

### 5.3 Menus.xml

- Structure des menus
- Liens vers programmes

### 5.4 Rights.xml

- Permissions par programme
- Groupes utilisateurs

### 5.5 Helps.xml

- Aide contextuelle
- Pas prioritaire pour migration

---

## 6. Fonctions Magic dans expressions

Expressions vues:
```
{0,26}<>0 OR {0,27}<>0
{0,1}='Z' OR {0,1}='O'
```

### Categories de fonctions (29 categories)

1. .NET Functions
2. Base64 Conversion Functions
3. Compound Storage Functions
4. Conversion Functions
5. Database Functions
6. Date and Time Functions
7. DLL Functions
8. Drag-and-Drop Functions
9. Dynamic Data Exchange Functions
10. Enterprise Server Functions
11. Environment Functions
12. HTTP Functions
13. Integration Functions
14. Interface Functions
15. I/O Functions
16. Java Functions
17. Licensing Functions
18. Offline Functions
19. Mail Functions
20. Numeric Functions
21. Operators
22. Security Functions
23. String Functions
24. Task Functions
25. Unicode Functions
26. Variable Functions
27. Vector Functions
28. Windows Dialog Functions
29. XML Functions

### String Functions (les plus courantes)

| Magic | TypeScript | Description |
|-------|------------|-------------|
| Len(str) | str.length | Longueur |
| Left(str,n) | str.slice(0,n) | N premiers caracteres |
| Right(str,n) | str.slice(-n) | N derniers caracteres |
| MID(str,pos,len) | str.substr(pos-1,len) | Sous-chaine (1-based) |
| Trim(str) | str.trim() | Supprime espaces |
| LTrim(str) | str.trimStart() | Espaces gauche |
| RTrim(str) | str.trimEnd() | Espaces droite |
| Upper(str) | str.toUpperCase() | Majuscules |
| Lower(str) | str.toLowerCase() | Minuscules |
| InStr(str,search) | str.indexOf(search)+1 | Position (1-based) |
| Rep(str,n,char) | str.padEnd(n,char) | Remplissage |
| & | + | Concatenation |

**Source:** [Magic xpa String Functions](https://magicsoftware.my.salesforce-sites.com/PublicKnowledge/articles/bl_Reference/String-Functions-xpa)

---

## 7. Metadata internes

```xml
<INT_CMP_LIST_INFO>
  <v>4</v>
</INT_CMP_LIST_INFO>

<INT_RECOMP_INFO>
  <v>16</v>
  <v>17</v>
</INT_RECOMP_INFO>
```

**Questions:**
- INT_CMP_LIST_INFO = composants utilises?
- INT_RECOMP_INFO = ordre de recomputation des variables?

---

## 8. VarRange (Range dynamique)

```xml
<VarRange LastIsn="8"/>
```

vs

```xml
<Range Direction="A" Exp="4"/>
```

**Questions:**
- Comment fonctionne le range dynamique?
- LastIsn fait reference a quoi?

---

## 9. Select Types

| Type | Signification |
|------|---------------|
| R | Real (colonne de table) |
| V | Virtual (variable locale) |
| P | Parameter |
| L | Link? |

**A verifier:** Y a-t-il d'autres types?

---

## 10. Proprietes de controles UI

Nombreuses proprietes vues:
- Visible, Enabled, Color, Font
- RaiseEvent (declencheur)
- TabOrder
- AllowParking

**A documenter:** Reference complete des proprietes de controles.

---

## Priorite de resolution

### Critique (bloquant pour conversion)

1. [ ] BLOCK/END_BLK - structure IF/ELSE
2. [ ] Internal Event IDs - actions utilisateur
3. [ ] Fonctions Magic - expressions

### Important (pour exports/editions)

4. [ ] IO operations - fichiers sortie
5. [ ] STP - dialogues utilisateur

### Secondaire (peut attendre)

6. [ ] DataSources.xml structure
7. [ ] Menus.xml
8. [ ] Rights.xml
9. [ ] Proprietes controles UI

---

*Document genere par Claude Code - 2025-12-24*
