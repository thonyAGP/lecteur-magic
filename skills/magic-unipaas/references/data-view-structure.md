# Structure Data View Magic Unipaas

## Vue d'Ensemble

La Data View definit les sources de donnees d'une tache Magic : tables, liens, et variables.
Ce document decrit les concepts avances decouverts lors de l'analyse du programme Prg_546.

---

## 1. Types de Sources de Donnees

### 1.1 Main Source (Source Principale)

La table principale sur laquelle la tache itere.

**Dans l'IDE :**
```
Main Source    801    Ref_Tables.valeur_credit_bar_d    Index: 1    Range: 2  To: 2
```

**Dans le XML :**
```xml
<Information>
  <DB comp="2" obj="801"/>   <!-- Table principale -->
  <Key>
    <Column val="1"/>        <!-- Index utilise -->
    <Mode val="N"/>
  </Key>
</Information>
```

### 1.2 Link Query (Lien Lecture)

Lien vers une table en lecture seule, sans jointure explicite.

**Dans l'IDE :**
```
Link Query    368    Ref_Tables.pms_village    Index: 1    Direction: Default
  Column 1: identification
  Column 17: village_saisonnier
End Link
```

**Dans le XML :**
```xml
<LogicLines>
  <LogicLine>
    <LNK Direction="A" EVL_CND="R" FlowIsn="7" Key="1" Mode="R" SortType="9" VIEW="2" VIEWS="4">
      <DB comp="2" obj="368"/>
      <Expanded val="1"/>
      <Condition val="Y"/>
    </LNK>
  </LogicLine>
  <!-- Select des colonnes -->
  <LogicLine>
    <Select FieldID="2" FlowIsn="9" id="2">
      <Column val="1"/>      <!-- Colonne 1 de la table liee -->
      <Type val="R"/>        <!-- R = Record (depuis la table) -->
    </Select>
  </LogicLine>
  <LogicLine>
    <END_LINK FlowIsn="8"/>
  </LogicLine>
</LogicLines>
```

**Attributs LNK :**
| Attribut | Description |
|----------|-------------|
| `Direction` | A=Ascending, D=Descending |
| `EVL_CND` | Evaluation condition (R=Runtime) |
| `Key` | Index a utiliser |
| `Mode` | R=Read, W=Write |
| `SortType` | Type de tri |
| `VIEW` | Numero de vue |

### 1.3 Link O. Join (Jointure avec Locate)

Jointure basee sur des valeurs de Locate (equivalent d'un JOIN SQL).

**Dans l'IDE :**
```
Link O. Join    131    Ref_Tables.fichier_validation    Index: 1
  Column 1: societe          Locate: 3  To: 3    ← Jointure sur variable 3
  Column 2: numero_compte    Locate: 4  To: 4    ← Jointure sur variable 4
  Column 3: filiation_compte Locate: 5  To: 5    ← Jointure sur variable 5
  Column 22: valide__o_n_
End Link
```

**Interpretation :**
```sql
-- Equivalent SQL
SELECT societe, numero_compte, filiation_compte, valide__o_n_
FROM fichier_validation
WHERE societe = @variable3
  AND numero_compte = @variable4
  AND filiation_compte = @variable5
```

**Dans le XML :**
```xml
<LogicLine>
  <LNK Direction="A" EVL_CND="R" FlowIsn="X" Key="1" Mode="R" VIEW="Y" VIEWS="Z">
    <DB comp="2" obj="131"/>
    <Condition val="Y"/>
  </LNK>
</LogicLine>
<LogicLine>
  <Select FieldID="X" FlowIsn="Y" id="Z">
    <Column val="1"/>
    <Type val="R"/>
    <Locate MIN="3" MAX="3"/>    <!-- Locate sur variable 3 -->
  </Select>
</LogicLine>
```

### 1.4 Virtual (Variable Calculee)

Variable locale sans stockage physique, calculee a l'execution.

**Dans l'IDE :**
```
Virtual    1    v Nbre de jour    Numeric    2
Virtual    2    v Date de Debut Calculee    Date    ##/##/####
```

**Dans le XML :**
```xml
<Columns>
  <Column id="1" name="v Nbre de jour">
    <PropertyList model="FIELD">
      <Model attr_obj="FIELD_NUMERIC" id="1"/>
      <Picture id="157" valUnicode="2"/>
      <_Dec id="181"/>
      <_Whole id="182" val="2"/>
      <_FieldStyle id="276" val="1"/>   <!-- 1 = Virtual -->
    </PropertyList>
  </Column>
</Columns>
```

---

## 2. Heritage des Variables

### 2.1 Numerotation Continue

Les variables sont numerotees en continu a travers toute la hierarchie du programme.

```
Main Program (VG.*)
├── A (1), B (2), ... Z (26)
├── BA (27), BB (28), ... BZ (52)
├── CA (53), ... DD (108)
│
Auto Credits Bar (Task locale)
├── DK (115), DL (116), DM (117), DN (118), DO (119), DP (120), DQ (121)
│
└── Selection (SubTask 1)
    ├── DR (122), DS (123), DT (124), DU (125), DV (126), DW (127), DX (128), DY (129), DZ (130)
    │
    └── Recherche Personnel (SubTask 1.1)
        ├── EA (131), EB (132), EC (133), ED (134), EE (135), ...
        └── EK (141), EL (142), EM (143), EN (144)
```

### 2.2 Acces aux Variables Parentes

Dans les expressions, les variables parentes sont accessibles par leur lettre :

```
Expression dans "Recherche Personnel":
  IF(ED>DP, ED, DP)

  ED = go_date_debut (variable locale de Recherche Personnel)
  DP = v.date Debut Personnel (variable du parent "Auto Credits Bar")
```

### 2.3 Algorithme de Calcul Lettre -> Numero

```typescript
function letterToNumber(letter: string): number {
  if (letter.length === 1) {
    // A-Z = 1-26
    return letter.charCodeAt(0) - 64;
  }
  if (letter.length === 2) {
    // BA-BZ = 27-52, CA-CZ = 53-78, etc.
    const first = letter.charCodeAt(0) - 64;
    const second = letter.charCodeAt(1) - 64;
    return (first - 1) * 26 + second + 26;
  }
  return -1;
}

// Exemples:
// DK = (4-1)*26 + 11 + 26 = 78 + 11 + 26 = 115
// EA = (5-1)*26 + 1 + 26 = 104 + 1 + 26 = 131
```

---

## 3. Index et Filtrage

### 3.1 Index de Table

Chaque table peut avoir plusieurs index. L'index utilise determine l'ordre de parcours.

**Dans l'IDE :**
```
Main Source: 35 - personnel_go______g    Index: 5
```

**Dans le XML :**
```xml
<Information>
  <Key>
    <Column val="1"/>    <!-- Premiere colonne de l'index -->
    <Mode val="N"/>
  </Key>
  <DB comp="2" obj="35"/>
</Information>
```

### 3.2 Range (Filtrage)

Le Range definit les bornes de filtrage sur les colonnes de l'index.

**Dans l'IDE :**
```
Column 1: go_societe (Unicode)      Range: 1  To: 1
Column 24: go_cat_emploi (Unicode)  Range: 2  To: 2
```

**Interpretation :**
- `Range: 1 To: 1` : La colonne est filtree par la valeur de la variable 1
- `Range: 2 To: 2` : La colonne est filtree par la valeur de la variable 2

**Equivalent SQL :**
```sql
SELECT * FROM personnel_go______g
WHERE go_societe = @variable1
  AND go_cat_emploi = @variable2
ORDER BY index_5
```

### 3.3 Locate (Positionnement)

Le Locate positionne sur un enregistrement specifique dans un lien.

**Dans l'IDE :**
```
Column 1: societe       Locate: 3  To: 3
Column 2: numero_compte Locate: 4  To: 4
```

**Interpretation :**
- `Locate: 3 To: 3` : Recherche la valeur de la variable 3
- Permet de faire une jointure "one-to-one" ou "many-to-one"

---

## 4. Exemple Complet : Recherche Personnel

### 4.1 Data View

```
Main Source: 35 - personnel_go______g    Index: 5    Range: 1 To: 1
  Column 1: go_societe       (Unicode)   Range: 1 To: 1
  Column 2: go_compte        (Numeric)
  Column 3: go_filiation     (Numeric)
  Column 21: go_date_debut   (Date)
  Column 22: go_date_fin     (Date)
  Column 24: go_cat_emploi   (Unicode)   Range: 2 To: 2

Link O. Join: 131 - fichier_validation   Index: 1
  Column 1: societe          Locate: 3 To: 3    ← EA (go_societe)
  Column 2: numero_compte    Locate: 4 To: 4    ← EB (go_compte)
  Column 3: filiation_compte Locate: 5 To: 5    ← EC (go_filiation)
  Column 22: valide__o_n_
End Link

Virtual 1: v Nbre de jour           (Numeric)
Virtual 2: v Date de Debut Calculee (Date)
Virtual 3: v Date de Fin Calculee   (Date)
Virtual 4: v Montant a crediter     (Numeric)
```

### 4.2 Logic (Record Suffix)

```
2  Update   Variable  EL  v Date de Debut Calculee   With: 6   IF(ED>DP,ED,DP)
3  Update   Variable  EM  v Date de Fin Calculee     With: 7   IF(EE<DQ,EE,DQ)
5  Evaluate Expression 8   DifDateTime(EM,Time(),EL,Time(),'DU'VAR,'DV'VAR)
7  Update   Variable  EK  v Nbre de jour            With: 9   (DU)+1
8  Update   Variable  EN  v Montant a crediter      With: 10  DT*EK
9  Call     Program   441 Maj Credit Conso / Type   [5 Arguments]
```

### 4.3 Conversion TypeScript

```typescript
interface RecherchePersonnelContext {
  // Variables heritees du parent
  DP: Date;  // v.date Debut Personnel
  DQ: Date;  // v.date Fin Personnel
  DT: Decimal;  // vcb_montant

  // Variables locales
  EA: string;  // go_societe
  EB: number;  // go_compte
  EC: number;  // go_filiation
  ED: Date;    // go_date_debut
  EE: Date;    // go_date_fin
  EK: number;  // v Nbre de jour
  EL: Date;    // v Date de Debut Calculee
  EM: Date;    // v Date de Fin Calculee
  EN: Decimal; // v Montant a crediter
}

async function recherchePersonnel(ctx: RecherchePersonnelContext): Promise<void> {
  // Pour chaque enregistrement de personnel_go______g filtre par societe et cat_emploi
  const personnel = await db.query(`
    SELECT go_societe, go_compte, go_filiation, go_date_debut, go_date_fin
    FROM cafil013_dat
    WHERE go_societe = $1 AND go_cat_emploi = $2
    ORDER BY index_5
  `, [ctx.variable1, ctx.variable2]);

  for (const record of personnel) {
    ctx.EA = record.go_societe;
    ctx.EB = record.go_compte;
    ctx.EC = record.go_filiation;
    ctx.ED = record.go_date_debut;
    ctx.EE = record.go_date_fin;

    // Link Join - fichier_validation
    const validation = await db.queryOne(`
      SELECT valide__o_n_
      FROM cafil109_dat
      WHERE societe = $1 AND numero_compte = $2 AND filiation_compte = $3
    `, [ctx.EA, ctx.EB, ctx.EC]);

    // Record Suffix
    ctx.EL = ctx.ED > ctx.DP ? ctx.ED : ctx.DP;  // Expression 6
    ctx.EM = ctx.EE < ctx.DQ ? ctx.EE : ctx.DQ;  // Expression 7

    // Expression 8: DifDateTime
    const diff = difDateTime(ctx.EM, new Date(), ctx.EL, new Date());
    ctx.DU = diff.days;  // Resultat dans variable DU

    ctx.EK = ctx.DU + 1;  // Expression 9
    ctx.EN = ctx.DT.times(ctx.EK);  // Expression 10

    // Appel programme 441 avec 5 arguments
    await majCreditConsoType(arg1, arg2, arg3, arg4, arg5);
  }
}
```

---

## 5. Fonctions Speciales Decouvertes

### 5.1 BOM() / EOM()

```
BOM(Date())  → Beginning Of Month (premier jour du mois)
EOM(Date())  → End Of Month (dernier jour du mois)
```

### 5.2 DifDateTime()

```
DifDateTime(date_fin, heure_fin, date_debut, heure_debut, 'DU'VAR, 'DV'VAR)
```
Calcule la difference entre deux dates/heures et stocke le resultat dans les variables specifiees.

### 5.3 DStr()

```
DStr(Date(), 'YYYYMMDD')  → Convertit une date en chaine formatee
```

---

## 6. Resume des Types de Select

| Type | Description | Exemple |
|------|-------------|---------|
| `V` | Virtual - Variable calculee | `<Type val="V"/>` |
| `R` | Record - Champ de table | `<Type val="R"/>` |
| `E` | Expression | `<Type val="E"/>` |
| `P` | Parameter | `<Type val="P"/>` |
