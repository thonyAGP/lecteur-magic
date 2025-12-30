# Correspondances de Types Magic vers Langages Cibles

## Vue d'Ensemble

Magic Unipaas utilise des types de donnees specifiques identifies par l'attribut `attr_obj` dans les definitions de champs.

---

## 1. Types de Champs Magic

### Tableau de Correspondance Principal

| Type Magic | Description | TypeScript | C# | Python |
|------------|-------------|------------|-----|--------|
| `FIELD_ALPHA` | Chaine ANSI | `string` | `string` | `str` |
| `FIELD_UNICODE` | Chaine Unicode | `string` | `string` | `str` |
| `FIELD_NUMERIC` | Nombre decimal | `Decimal` | `decimal` | `Decimal` |
| `FIELD_LOGICAL` | Booleen | `boolean` | `bool` | `bool` |
| `FIELD_DATE` | Date | `Date` | `DateTime` / `DateOnly` | `datetime.date` |
| `FIELD_TIME` | Heure | `string` | `TimeSpan` / `TimeOnly` | `datetime.time` |
| `FIELD_BLOB` | Donnees binaires | `Buffer` | `byte[]` | `bytes` |

---

## 2. Details par Type

### FIELD_ALPHA

**Description :** Chaine de caracteres ANSI (8 bits par caractere).

**XML :**
```xml
<Model attr_obj="FIELD_ALPHA" id="1"/>
<Picture id="157" valUnicode="U"/>
<Size id="174" val="20"/>
```

**Conversion :**
```typescript
// TypeScript
type Alpha = string;

// C#
string alpha;

// Python
alpha: str
```

**Notes :**
- Attention a l'encodage lors de la migration
- Peut contenir des caracteres speciaux non-Unicode

---

### FIELD_UNICODE

**Description :** Chaine de caracteres Unicode (UTF-16).

**XML :**
```xml
<Model attr_obj="FIELD_UNICODE" id="1"/>
<Picture id="157" valUnicode="U8"/>
<Size id="174" val="16"/>           <!-- Taille en bytes (8 caracteres * 2) -->
<StoredAs id="173" val="31"/>       <!-- 31 = nvarchar -->
```

**Conversion :**
```typescript
// TypeScript
type UnicodeField = string;

// C#
string unicodeField;

// Python
unicode_field: str
```

---

### FIELD_NUMERIC

**Description :** Nombre decimal avec precision variable.

**XML :**
```xml
<Model attr_obj="FIELD_NUMERIC" id="1"/>
<Picture id="157" valUnicode="N10"/>    <!-- 10 chiffres -->
<UpdateStyle id="176" val="A"/>
<_Dec id="181" val="2"/>                <!-- 2 decimales -->
<_Whole id="182" val="10"/>             <!-- 10 chiffres entiers -->
<_Negative id="192" val="Y"/>           <!-- Peut etre negatif -->
<StoredAs id="173" val="22"/>           <!-- 22 = numeric SQL -->
```

**Conversion :**
```typescript
// TypeScript - Utiliser Decimal.js pour precision
import Decimal from 'decimal.js';
type NumericField = Decimal;

// Exemple d'utilisation
const montant = new Decimal('123.45');
const resultat = montant.plus(new Decimal('10.00'));

// C#
decimal numericField;

// Python
from decimal import Decimal
numeric_field: Decimal
```

**Notes :**
- **IMPORTANT** : Ne pas utiliser `number` en TypeScript pour les calculs financiers
- La precision peut atteindre 38 chiffres
- Les decimales sont definies par `_Dec`

---

### FIELD_LOGICAL

**Description :** Valeur booleenne (Oui/Non, Vrai/Faux).

**XML :**
```xml
<Model attr_obj="FIELD_LOGICAL" id="1"/>
<_FieldStyle id="276" val="1"/>
```

**Valeurs Magic :**
- `Y` ou `1` ou `True` = Vrai
- `N` ou `0` ou `False` = Faux

**Conversion :**
```typescript
// TypeScript
type LogicalField = boolean;

function parseMagicLogical(value: string | number | boolean): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  return value === 'Y' || value === '1' || value.toLowerCase() === 'true';
}

// C#
bool logicalField;

public static bool ParseMagicLogical(object value) {
  return value switch {
    bool b => b,
    int i => i != 0,
    string s => s == "Y" || s == "1" || s.Equals("true", StringComparison.OrdinalIgnoreCase),
    _ => false
  };
}

// Python
logical_field: bool

def parse_magic_logical(value) -> bool:
    if isinstance(value, bool):
        return value
    if isinstance(value, int):
        return value != 0
    return value in ('Y', '1', 'True', 'true')
```

---

### FIELD_DATE

**Description :** Date sans composante heure.

**XML :**
```xml
<Model attr_obj="FIELD_DATE" id="1"/>
<Picture id="157" valUnicode="DD/MM/YYYY"/>
<DefaultValue id="170" val="0"/>
<StoredAs id="173" val="19"/>           <!-- 19 = date stockee en char(8) -->
<Size id="174" val="8"/>
<Type id="179" val="char(8)"/>
```

**Format de stockage Magic :** `YYYYMMDD` (chaine de 8 caracteres)

**Conversion :**
```typescript
// TypeScript
type DateField = Date;

function parseMagicDate(value: string): Date | null {
  if (!value || value === '00000000' || value.length !== 8) return null;
  const year = parseInt(value.substring(0, 4));
  const month = parseInt(value.substring(4, 6)) - 1; // Mois 0-indexed
  const day = parseInt(value.substring(6, 8));
  return new Date(year, month, day);
}

function formatMagicDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}${m}${d}`;
}

// C# (.NET 6+)
DateOnly dateField; // ou DateTime pour versions anterieures

public static DateOnly? ParseMagicDate(string value) {
  if (string.IsNullOrEmpty(value) || value == "00000000" || value.Length != 8)
    return null;
  return DateOnly.ParseExact(value, "yyyyMMdd", CultureInfo.InvariantCulture);
}

// Python
from datetime import date

def parse_magic_date(value: str) -> date | None:
    if not value or value == '00000000' or len(value) != 8:
        return None
    return date(int(value[:4]), int(value[4:6]), int(value[6:8]))
```

---

### FIELD_TIME

**Description :** Heure sans composante date.

**XML :**
```xml
<Model attr_obj="FIELD_TIME" id="1"/>
<Picture id="157" valUnicode="HH:MM:SS"/>
<StoredAs id="173" val="23"/>           <!-- 23 = time -->
<Size id="174" val="6"/>
```

**Format de stockage Magic :** `HHMMSS` (chaine de 6 caracteres)

**Conversion :**
```typescript
// TypeScript
type TimeField = string; // Format "HH:MM:SS"

function parseMagicTime(value: string): string {
  if (!value || value.length < 4) return '00:00:00';
  const h = value.substring(0, 2).padStart(2, '0');
  const m = value.substring(2, 4).padStart(2, '0');
  const s = value.length >= 6 ? value.substring(4, 6).padStart(2, '0') : '00';
  return `${h}:${m}:${s}`;
}

// C# (.NET 6+)
TimeOnly timeField; // ou TimeSpan pour versions anterieures

public static TimeOnly ParseMagicTime(string value) {
  if (string.IsNullOrEmpty(value) || value.Length < 4)
    return TimeOnly.MinValue;
  var h = int.Parse(value.Substring(0, 2));
  var m = int.Parse(value.Substring(2, 2));
  var s = value.Length >= 6 ? int.Parse(value.Substring(4, 2)) : 0;
  return new TimeOnly(h, m, s);
}

// Python
from datetime import time

def parse_magic_time(value: str) -> time:
    if not value or len(value) < 4:
        return time(0, 0, 0)
    h = int(value[:2])
    m = int(value[2:4])
    s = int(value[4:6]) if len(value) >= 6 else 0
    return time(h, m, s)
```

---

### FIELD_BLOB

**Description :** Donnees binaires (Binary Large Object).

**XML :**
```xml
<Model attr_obj="FIELD_BLOB" id="1"/>
<Size id="174" val="28"/>
<_FieldStyle id="276" val="5"/>
```

**Conversion :**
```typescript
// TypeScript
type BlobField = Buffer | Uint8Array;

// C#
byte[] blobField;

// Python
blob_field: bytes
```

---

## 3. Codes de Stockage SQL (StoredAs)

| Code | Type SQL | Description | Taille |
|------|----------|-------------|--------|
| 1 | varchar | Chaine ANSI variable | Size bytes |
| 6 | float/real | Nombre flottant | 8 bytes |
| 19 | char(8) | Date Magic YYYYMMDD | 8 bytes |
| 22 | numeric | Nombre decimal (precision) | Variable |
| 23 | time | Heure HHMMSS | 6 bytes |
| 31 | nvarchar | Unicode variable | Size bytes |
| 32 | nvarchar | Unicode variable (alt) | Size/2 chars |

**Note:** Pour StoredAs=32, la `Size` est en bytes. Diviser par 2 pour obtenir le nombre de caractères Unicode.

---

## 4. Formats d'Affichage (Picture)

### Formats Numeriques

| Format | Description | Exemple |
|--------|-------------|---------|
| `N10` | 10 chiffres | `0000001234` |
| `N10.2` | 10 chiffres, 2 decimales | `0001234.56` |
| `9(3)` | 3 chiffres | `123` |

### Formats Date

| Format | Description | Exemple |
|--------|-------------|---------|
| `DD/MM/YYYY` | Jour/Mois/Annee | `25/12/2025` |
| `YYYY-MM-DD` | ISO 8601 | `2025-12-25` |
| `DD/MM/YY` | Annee courte | `25/12/25` |

### Formats Heure

| Format | Description | Exemple |
|--------|-------------|---------|
| `HH:MM:SS` | Heure complete | `14:30:45` |
| `HH:MM` | Heure sans secondes | `14:30` |
| `HH:MM:SSZ` | Avec fuseau | `14:30:45+01:00` |

### Formats Texte

| Format | Description | Exemple |
|--------|-------------|---------|
| `U` | Une lettre majuscule | `A` |
| `U8` | 8 caracteres max | `ABCDEFGH` |
| `20` | 20 caracteres | `Texte libre...` |

---

## 5. Fonctions de Conversion Utilitaires

### TypeScript

```typescript
import Decimal from 'decimal.js';

interface MagicFieldConverter {
  parseAlpha(value: string): string;
  parseUnicode(value: string): string;
  parseNumeric(value: string, decimals?: number): Decimal;
  parseLogical(value: string | number | boolean): boolean;
  parseDate(value: string): Date | null;
  parseTime(value: string): string;
  parseBlob(value: string): Buffer;
}

const converter: MagicFieldConverter = {
  parseAlpha: (value) => value?.toString() ?? '',
  parseUnicode: (value) => value?.toString() ?? '',
  parseNumeric: (value, decimals = 2) =>
    new Decimal(value || 0).toDecimalPlaces(decimals),
  parseLogical: (value) =>
    value === 'Y' || value === 1 || value === true,
  parseDate: (value) => {
    if (!value || value === '00000000') return null;
    return new Date(
      parseInt(value.slice(0, 4)),
      parseInt(value.slice(4, 6)) - 1,
      parseInt(value.slice(6, 8))
    );
  },
  parseTime: (value) => {
    if (!value) return '00:00:00';
    return `${value.slice(0, 2)}:${value.slice(2, 4)}:${value.slice(4, 6) || '00'}`;
  },
  parseBlob: (value) => Buffer.from(value, 'base64'),
};
```

### C#

```csharp
public static class MagicFieldConverter
{
    public static string ParseAlpha(string value) => value ?? string.Empty;

    public static string ParseUnicode(string value) => value ?? string.Empty;

    public static decimal ParseNumeric(string value, int decimals = 2) =>
        Math.Round(decimal.TryParse(value, out var d) ? d : 0m, decimals);

    public static bool ParseLogical(object value) => value switch
    {
        bool b => b,
        int i => i != 0,
        string s => s == "Y" || s == "1",
        _ => false
    };

    public static DateOnly? ParseDate(string value)
    {
        if (string.IsNullOrEmpty(value) || value == "00000000")
            return null;
        return DateOnly.ParseExact(value, "yyyyMMdd", CultureInfo.InvariantCulture);
    }

    public static TimeOnly ParseTime(string value)
    {
        if (string.IsNullOrEmpty(value)) return TimeOnly.MinValue;
        return new TimeOnly(
            int.Parse(value[..2]),
            int.Parse(value[2..4]),
            value.Length >= 6 ? int.Parse(value[4..6]) : 0
        );
    }

    public static byte[] ParseBlob(string value) =>
        Convert.FromBase64String(value ?? string.Empty);
}
```

### Python

```python
from datetime import date, time
from decimal import Decimal
from typing import Optional, Union

class MagicFieldConverter:
    @staticmethod
    def parse_alpha(value: str) -> str:
        return value or ''

    @staticmethod
    def parse_unicode(value: str) -> str:
        return value or ''

    @staticmethod
    def parse_numeric(value: str, decimals: int = 2) -> Decimal:
        return round(Decimal(value or '0'), decimals)

    @staticmethod
    def parse_logical(value: Union[str, int, bool]) -> bool:
        if isinstance(value, bool):
            return value
        if isinstance(value, int):
            return value != 0
        return value in ('Y', '1', 'True', 'true')

    @staticmethod
    def parse_date(value: str) -> Optional[date]:
        if not value or value == '00000000':
            return None
        return date(int(value[:4]), int(value[4:6]), int(value[6:8]))

    @staticmethod
    def parse_time(value: str) -> time:
        if not value:
            return time(0, 0, 0)
        return time(
            int(value[:2]),
            int(value[2:4]),
            int(value[4:6]) if len(value) >= 6 else 0
        )

    @staticmethod
    def parse_blob(value: str) -> bytes:
        import base64
        return base64.b64decode(value or '')
```
