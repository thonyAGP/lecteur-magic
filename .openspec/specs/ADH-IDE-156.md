# ADH IDE 156 - Verif session caisse ouverte2

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_329.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 156 |
| **Fichier XML** | Prg_329.xml |
| **Description** | Verif session caisse ouverte2 |
| **Type** | B (O=Online, B=Batch) |
| **Parametres** | 2 |
| **Module** | ADH |
| **Dossier IDE** | Gestion Caisse |

> **Note**: Ce programme est Prg_329.xml. L'ID XML (329) peut differer de la position IDE (156).

---

## 2. TABLES (1 tables -  en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #249 | `caisse_session_detail` | histo_sessions_caisse_detail | **W** | 1x |

---

## 3. PARAMETRES D'ENTREE (2)

| # | Nom | Type | Description |
|---|-----|------|-------------|

---

## 4. VARIABLES PRINCIPALES

### 4.1 Variables de travail (W0/V0)

| Ref | Nom | Type | Role |
|-----|-----|------|------|

### 4.2 Variables globales (VG)

| Ref | Decode | Role |
|-----|--------|------|
| `{32768,0}` | VG.LOGIN | - |
| `{32768,1}` | VG.USER | - |
| `{32768,2}` | VG.Retour Chariot | - |
| `{32768,3}` | VG.DROIT ACCES IT ? | - |
| `{32768,4}` | VG.DROIT ACCES CAISSE ? | - |
| `{32768,5}` | VG.BRAZIL DATACATCHING? | - |
| `{32768,6}` | VG.USE MDR | - |
| `{32768,7}` | VG.VRL ACTIF ? | - |
| `{32768,8}` | VG.ECI ACTIF ? | - |
| `{32768,9}` | VG.COMPTE CASH ACTIF ? | - |
| `{32768,10}` | VG.IND SEJ PAYE ACTIF ? | - |
| `{32768,11}` | VG.CODE LANGUE USER | - |
| `{32768,12}` | VG.EFFECTIF ACTIF ? | - |
| `{32768,13}` | VG.TAXE SEJOUR ACTIF ? | - |
| `{32768,14}` | VG.N° version | - |

> Total: 126 variables mappees

---

## 5. EXPRESSIONS (9 total, 7 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 2 | `'I'` | `'I'` |
| 3 | `'O'` | `'O'` |
| 8 | `'F'` | `'F'` |
| 1 | `Str({0,7},'3P0')` | `Str({0,7},'3P0')` |
| 4 | `Date()` | `Date()` |
| 5 | `Trim({0,1})` | `Trim(Po.Ouverture caisse possible?)` |
| 6 | `{0,2}` | `e.Caisse ouverte aujourd'hui?` |
| 9 | `NOT({0,22}) OR {0,21}` | `NOT({0,22}) OR {0,21}` |
| 10 | `'TRUE'LOG` | `'TRUE'LOG` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 1 ( W / 0 R) |
| Parametres | 2 |
| Variables locales | 4 |
| Expressions | 9 |
| Expressions 100% decodees | 7 (78%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
