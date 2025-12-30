# Syntaxe des Expressions Magic Unipaas

## Vue d'Ensemble

Les expressions Magic sont utilisees pour les conditions, calculs et transformations de donnees.
Elles sont stockees dans les attributs `val` ou `Expression` des elements XML.

---

## 1. References aux Parametres et Variables

### Syntaxe de Base

```
{N,M}
```

| Element | Description |
|---------|-------------|
| `N` | Numero du parametre ou contexte (0 = contexte courant) |
| `M` | Index du champ/variable dans ce contexte |

### Exemples

```
{0,1}     --> Premier champ du contexte courant
{0,16}    --> 16eme champ du contexte courant
{1,5}     --> 5eme champ du parametre 1
```

### Contextes

| Contexte | Description |
|----------|-------------|
| `0` | Contexte courant (variables locales) |
| `1` | Premier parametre passe |
| `2` | Deuxieme parametre passe |
| ... | Parametres suivants |

---

## 2. Operateurs

### Operateurs de Comparaison

| Magic | Description | TypeScript | C# | Python |
|-------|-------------|------------|-----|--------|
| `=` | Egalite | `===` | `==` | `==` |
| `<>` | Difference | `!==` | `!=` | `!=` |
| `>` | Superieur | `>` | `>` | `>` |
| `<` | Inferieur | `<` | `<` | `<` |
| `>=` | Superieur ou egal | `>=` | `>=` | `>=` |
| `<=` | Inferieur ou egal | `<=` | `<=` | `<=` |

### Operateurs Logiques

| Magic | Description | TypeScript | C# | Python |
|-------|-------------|------------|-----|--------|
| `AND` | ET logique | `&&` | `&&` | `and` |
| `OR` | OU logique | `\|\|` | `\|\|` | `or` |
| `NOT()` | Negation | `!` | `!` | `not` |

### Operateurs Arithmetiques

| Magic | Description |
|-------|-------------|
| `+` | Addition |
| `-` | Soustraction |
| `*` | Multiplication |
| `/` | Division |
| `^` | Puissance |
| `%` | Modulo |

---

## 3. Fonctions Integrees

### Fonctions de Chaines

#### Trim(expr)
Supprime les espaces en debut et fin.

```
Magic:      Trim({0,1})
TypeScript: value.trim()
C#:         value.Trim()
Python:     value.strip()
```

#### Str(num, len, dec)
Convertit un nombre en chaine formatee.

```
Magic:      Str({0,46}, '10')
TypeScript: value.toFixed(dec).padStart(len, ' ')
C#:         value.ToString($"F{dec}").PadLeft(len)
Python:     f"{value:.{dec}f}".rjust(len)
```

#### LTrim(expr) / RTrim(expr)
Supprime les espaces a gauche / droite.

```
Magic:      LTrim({0,1})
TypeScript: value.trimStart()
C#:         value.TrimStart()
Python:     value.lstrip()
```

#### Upper(expr) / Lower(expr)
Conversion majuscules / minuscules.

```
Magic:      Upper({0,1})
TypeScript: value.toUpperCase()
C#:         value.ToUpper()
Python:     value.upper()
```

#### Len(expr)
Longueur de la chaine.

```
Magic:      Len({0,1})
TypeScript: value.length
C#:         value.Length
Python:     len(value)
```

#### SubStr(expr, start, len)
Extraction de sous-chaine.

```
Magic:      SubStr({0,1}, 1, 5)
TypeScript: value.substring(start - 1, start - 1 + len)
C#:         value.Substring(start - 1, len)
Python:     value[start-1:start-1+len]
```

### Fonctions Conditionnelles

#### IF(condition, trueValue, falseValue)
Expression conditionnelle ternaire.

```
Magic:      IF({0,1}='P', 'Oui', 'Non')

TypeScript: condition ? trueValue : falseValue

C#:         condition ? trueValue : falseValue

Python:     trueValue if condition else falseValue
```

#### CASE(expr, val1, res1, val2, res2, ..., default)
Selection multiple (switch/case).

```
Magic:      CASE({0,1}, 'C', {0,16}, 'V', {0,21}, 'P', {0,30}, 0)

TypeScript:
function magicCase<T>(expr: unknown, ...pairs: unknown[]): T {
  for (let i = 0; i < pairs.length - 1; i += 2) {
    if (expr === pairs[i]) return pairs[i + 1] as T;
  }
  return pairs[pairs.length - 1] as T; // default
}

C#:
expr switch {
  "C" => result1,
  "V" => result2,
  "P" => result3,
  _ => defaultValue
}

Python:
{
  'C': result1,
  'V': result2,
  'P': result3
}.get(expr, default_value)
```

#### IN(expr, 'A', 'B', 'C')
Test d'appartenance a une liste.

```
Magic:      IN({0,1}, 'C', 'V')

TypeScript: ['C', 'V'].includes(expr)

C#:         new[] { "C", "V" }.Contains(expr)

Python:     expr in ['C', 'V']
```

### Fonctions Mathematiques

#### Round(num, decimals)
Arrondit a N decimales.

```
Magic:      Round({0,49}, 2)

TypeScript: Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals)
            // ou avec Decimal.js: new Decimal(num).toDecimalPlaces(decimals)

C#:         Math.Round(num, decimals)

Python:     round(num, decimals)
```

#### ABS(num)
Valeur absolue.

```
Magic:      ABS({0,1})

TypeScript: Math.abs(num)

C#:         Math.Abs(num)

Python:     abs(num)
```

#### Min(a, b) / Max(a, b)
Minimum / Maximum.

```
Magic:      Min({0,1}, {0,2})

TypeScript: Math.min(a, b)

C#:         Math.Min(a, b)

Python:     min(a, b)
```

### Fonctions de Date/Heure

#### Date()
Date courante.

```
Magic:      Date()

TypeScript: new Date()

C#:         DateTime.Today

Python:     datetime.date.today()
```

#### Time()
Heure courante.

```
Magic:      Time()

TypeScript: new Date().toTimeString().slice(0, 8)

C#:         DateTime.Now.TimeOfDay

Python:     datetime.datetime.now().time()
```

#### Year(date) / Month(date) / Day(date)
Extraction composants de date.

```
Magic:      Year({0,1})

TypeScript: date.getFullYear()

C#:         date.Year

Python:     date.year
```

#### DVal(dateStr, format)
Conversion chaine vers date.

```
Magic:      DVal({0,1}, 'DD/MM/YYYY')

TypeScript: dayjs(dateStr, 'DD/MM/YYYY').toDate()

C#:         DateTime.ParseExact(dateStr, "dd/MM/yyyy", CultureInfo.InvariantCulture)

Python:     datetime.strptime(date_str, '%d/%m/%Y').date()
```

---

## 4. Exemples Complexes

### Expression avec Concatenation SQL

```xml
<ExpSyntax val="IF({0,1}='P',
  'WHERE tap_appli=''P'' AND tap_article='&amp;Trim(Str({0,46},'10'))&amp;' AND tap_portee=''HT''',
  'WHERE tap_appli=''A'' AND tap_article='&amp;Trim(Str({0,46},'10'))&amp;' AND tap_portee=''HT''')"/>
```

**Analyse :**
- `IF({0,1}='P', ..., ...)` : Condition sur le champ 1
- `''P''` : Guillemet simple echappe (resultat: 'P')
- `&amp;` : Concatenation de chaines (& encode en XML)
- `Trim(Str({0,46},'10'))` : Champ 46 converti en string de 10 caracteres, puis trimme

**Conversion TypeScript :**
```typescript
const appli = field1 === 'P' ? 'P' : 'A';
const article = String(field46).padStart(10, ' ').trim();
const whereClause = `WHERE tap_appli='${appli}' AND tap_article='${article}' AND tap_portee='HT'`;
```

### Expression de Calcul

```xml
<ExpSyntax val="Round({0,49}/(1+{0,41}/100),12,{0,11})"/>
```

**Analyse :**
- `{0,49}` : Montant TTC
- `{0,41}` : Taux de TVA (ex: 20 pour 20%)
- `1+{0,41}/100` : Coefficient TVA (1.20)
- `{0,49}/(1+{0,41}/100)` : Montant HT
- `Round(..., 12, {0,11})` : Arrondi avec precision de 12 chiffres et {0,11} decimales

**Conversion TypeScript :**
```typescript
const montantHT = new Decimal(montantTTC)
  .dividedBy(new Decimal(1).plus(new Decimal(tauxTVA).dividedBy(100)))
  .toDecimalPlaces(decimals);
```

### Expression Logique Multiple

```xml
<ExpSyntax val="{0,37}&lt;>{0,43} OR {0,41}&lt;>0 OR {0,39}&lt;>0"/>
```

**Note :** `&lt;>` est `<>` (difference) encode en XML.

**Conversion TypeScript :**
```typescript
const hasChanges = field37 !== field43 || field41 !== 0 || field39 !== 0;
```

---

## 5. Encodage XML

Les caracteres speciaux dans les expressions sont encodes :

| Caractere | Encodage XML |
|-----------|--------------|
| `<` | `&lt;` |
| `>` | `&gt;` |
| `&` | `&amp;` |
| `'` | `''` (double) ou `&apos;` |
| `"` | `&quot;` |

---

## 6. Pattern de Conversion General

### Algorithme de Parsing

1. **Decoder les entites XML** (`&lt;` -> `<`, etc.)
2. **Identifier les references** `{N,M}`
3. **Parser les fonctions** (nom + parentheses + arguments)
4. **Construire l'arbre d'expression**
5. **Generer le code cible**

### Template TypeScript

```typescript
interface MagicExpression {
  type: 'reference' | 'literal' | 'function' | 'operator';
  value?: string | number;
  ref?: { context: number; field: number };
  name?: string;
  args?: MagicExpression[];
  operator?: string;
  left?: MagicExpression;
  right?: MagicExpression;
}

function parseMagicExpression(expr: string): MagicExpression {
  // Implementation du parser
}

function generateTypeScript(expr: MagicExpression): string {
  // Generation du code TypeScript
}
```
