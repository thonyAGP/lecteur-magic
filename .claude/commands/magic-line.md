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

## Exécution

**IMPORTANT** : Cette commande utilise l'outil MCP `magic_get_line` pour un parsing déterministe.

Appeler l'outil MCP `magic_get_line` avec les paramètres:
- `project`: Le projet (ADH, PBP, REF, VIL, PBG, PVE)
- `taskPosition`: La position IDE de la tâche (ex: "69.3")
- `lineNumber`: Le numéro de ligne (1-based)

L'outil retourne automatiquement les informations Data View ET Logic.

## Format de sortie

```
## Tâche {PROJET} IDE {TÂCHE} - Ligne {N}

### DATA VIEW (Colonnes)

| Ligne | Variable | Nom | Type | Définition | Locate |
|-------|----------|-----|------|------------|--------|
| 39 | AM | rti_date_conso | Date | Real | Expr 88 |

**Expression 88:** `contenu de l'expression`

### LOGIC (Opérations)

| Ligne | Opération | Handler | Détails |
|-------|-----------|---------|---------|
| 39 | Call Task | W1 | ADH IDE 70 - Print extrait compte / Nom |

**Paramètres:**
- TargetPrg: 70
- TargetComp: 4
```

## Règles de nommage

### Variables (index vers lettre)

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
- Première lettre = chr(64 + (index // 26)) → A=1, B=2, C=3...
- Deuxième lettre = chr(65 + (index % 26)) → A=0, B=1, C=2...

### Types d'opérations Logic

| Balise XML | Opération IDE | Détails à extraire |
|------------|---------------|-------------------|
| `DATAVIEW_SRC` | Data View Source | Type, Direction |
| `Select` | Select | FieldID → Variable |
| `Remark` | Remark | Text |
| `LNK` | Link | Table, Key, Mode |
| `END_LINK` | End Link | - |
| `Update` | Update | FieldID → Variable, Expression |
| `Call` | Call Task | Programme/Tâche cible, Arguments |
| `Evaluate` | Evaluate | Expression |
| `Block` | Block If/Else/Loop | Condition |
| `EndBlock` | End Block | - |
| `Verify` | Verify Warning/Error | Message, Return variable |
| `Raise` | Raise Event | Event type |

## Notes importantes

1. La numérotation des lignes commence à **1** (pas 0)
2. Data View et Logic ont des numérotations **indépendantes**
3. La numérotation Logic est **continue** à travers tous les handlers (TP, RP, RM, RS, TS, puis handlers)
4. **JAMAIS** de références XML brutes - toujours format IDE
