# Magic Line - Affichage ligne Data View / Logic

Affiche le contenu d'une ligne spécifique dans une tâche Magic, pour **Data View** ET **Logic**.

## Usage

```
/magic-line <projet> <tâche> <ligne>
```

## Exemples

```
/magic-line ADH 69.3 39
/magic-line PVE 186.2 15
/magic-line PBG 315 21
```

## Format de sortie OBLIGATOIRE

```
## Tâche {PROJET} IDE {TÂCHE} - Ligne {N}

### DATA VIEW (Colonnes)

| Ligne | Variable | Nom | Type | Table | Colonne | Locate |
|-------|----------|-----|------|-------|---------|--------|
| 39 | AF | rti_date_conso | Date | Table n°884 (Ref_Tables.reedition_ticket) | 11 | Expr 88 = FV (cte_date_d_operation) |

### LOGIC (Opérations)

| Ligne | Opération | Détails |
|-------|-----------|---------|
| 39 | Call Task | ADH IDE 70 - Print extrait compte / Nom (15 arguments) |
```

## Instructions de parsing

### Étape 1 : Localiser la tâche

La tâche `69.3` signifie :
- Programme **69**
- Sous-tâche de niveau 1 : **.3** (3ème sous-tâche directe)

Chercher dans `Prg_69.xml` la tâche avec la bonne hiérarchie.

### Étape 2 : Parser Data View (Colonnes)

Localiser la section `<Resource><Columns>` de la tâche.

Chaque `<Column id="X" name="Y">` = une ligne Data View.

**Comptage** : Ligne 1 = premier `<Column>`, Ligne N = N-ème `<Column>`.

**Extraire pour chaque colonne** :
- `id` → convertir en Variable (voir table de conversion)
- `name` → Nom de la colonne
- `<Model attr_obj="FIELD_XXX">` → Type (ALPHA, NUMERIC, LOGICAL, DATE, TIME, BLOB)
- Si présent dans un `<LNK>` → Table source + numéro colonne
- `<Locate>` → Expression de filtrage

### Étape 3 : Parser Logic (Opérations)

Localiser la section `<TaskLogic>` de la tâche.

**ATTENTION** : Il y a plusieurs `<LogicUnit>` (handlers). La numérotation des lignes est **continue** à travers tous les LogicUnits.

Chaque `<LogicLine>` = une ligne Logic.

**Types d'opérations à reconnaître** :

| Balise XML | Opération IDE | Détails à extraire |
|------------|---------------|-------------------|
| `<DATAVIEW_SRC>` | Data View Source | IDX, Type, Direction |
| `<Select>` | Select | FieldID → Variable, Column, Type (V/R) |
| `<Remark>` | Remark | Text |
| `<LNK>` | Link | DB obj → Table, Key, Mode |
| `<END_LINK>` | End Link | - |
| `<Update>` | Update | FieldID → Variable, Expression |
| `<Call>` | Call Task | TaskID obj → Programme/Tâche, Arguments |
| `<Evaluate>` | Evaluate | Expression |
| `<Block>` | Block If/Else/Loop | Condition |
| `<EndBlock>` | End Block | - |
| `<Verify>` | Verify Warning/Error | Message, Return variable |
| `<Raise>` | Raise Event | Event type |

### Étape 4 : Conversion Variable (index → lettre)

| Index | Variable | Index | Variable | Index | Variable |
|-------|----------|-------|----------|-------|----------|
| 0 | A | 10 | K | 20 | U |
| 1 | B | 11 | L | 21 | V |
| 2 | C | 12 | M | 22 | W |
| 3 | D | 13 | N | 23 | X |
| 4 | E | 14 | O | 24 | Y |
| 5 | F | 15 | P | 25 | Z |
| 6 | G | 16 | Q | 26 | AA |
| 7 | H | 17 | R | 27 | AB |
| 8 | I | 18 | S | ... | ... |
| 9 | J | 19 | T | 51 | AZ |

**Formule pour index >= 26** :
```
Première lettre = chr(64 + (index // 26))  → A=1, B=2, C=3...
Deuxième lettre = chr(65 + (index % 26))   → A=0, B=1, C=2...
```

**Exemples** :
- Index 32 → 32//26=1(A), 32%26=6(G) → **AG**
- Index 88 → 88//26=3(C), 88%26=10(K) → **CK**
- Index 155 → 155//26=5(E), 155%26=25(Z) → **EZ**

### Étape 5 : Conversion Table (obj → numéro + nom)

Chercher dans `DataSources.xml` du composant REF :
```xml
<DataSource id="X">
  <Name val="nom_table"/>
</DataSource>
```

Le `id` XML = **Table n°X** en IDE.

### Étape 6 : Résolution Expression

Pour une expression `val="N"`, chercher dans `<Expressions>` :
```xml
<Expression id="N">contenu</Expression>
```

Traduire le contenu en remplaçant `{ctx,idx}` par la variable correspondante.

## Exemple complet

**Entrée** : `/magic-line ADH 69.3 39`

**Sortie** :

```
## Tâche ADH IDE 69.3 - Ligne 39

### DATA VIEW (Colonnes)

| Ligne | Variable | Nom | Type | Source | Colonne | Locate |
|-------|----------|-----|------|--------|---------|--------|
| 39 | AM | rti_date_conso | Date | Link Table n°884 (reedition_ticket) | 11 | Expr 88 = FV |

**Expression 88** : `FV` = Variable FV (cte_date_d_operation)

### LOGIC (Opérations)

| Ligne | Opération | Détails |
|-------|-----------|---------|
| 39 | **Call Task** | ADH IDE 70 - EXTRAIT_NOM (15 arguments) |

**Arguments du Call** :
| # | Variable | Valeur |
|---|----------|--------|
| 1 | P.Societe | A |
| 2 | P.Compte | B |
| ... | ... | ... |
| 15 | IW | v.Edition partielle? |
```

## Règles importantes

1. **JAMAIS** de références XML brutes (id, obj, FieldID)
2. **TOUJOURS** convertir en format IDE (Variable lettre, Table n°, Expression n°)
3. **TOUJOURS** afficher Data View ET Logic pour la même ligne
4. Si la ligne n'existe pas dans un des deux contextes, indiquer "N/A"
5. Pour les Call Task, lister les arguments avec leur variable source

## Script d'aide pour compter les lignes

```bash
# Compter les colonnes Data View d'une tâche
grep -c "<Column id=" section_task.xml

# Compter les lignes Logic d'une tâche
grep -c "<LogicLine>" section_task.xml

# Extraire la N-ème colonne
grep -A20 "<Column id=" file.xml | head -N*20 | tail -20

# Extraire la N-ème LogicLine
grep -A10 "<LogicLine>" file.xml | sed -n 'N*11,N*11+10p'
```

## Notes

- La numérotation des lignes commence à **1** (pas 0)
- Data View et Logic ont des numérotations **indépendantes**
- Une ligne Data View peut être dans un Link (table liée) ou la MainSource
- Les LogicUnits (handlers) sont numérotés séquentiellement dans la Logic
