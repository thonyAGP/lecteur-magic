# ADH IDE 180 - Printer choice

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_179.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 180 |
| **Fichier XML** | Prg_179.xml |
| **Description** | Printer choice |
| **Type** | B (O=Online, B=Batch) |
| **Parametres** | 1 |
| **Module** | ADH |
| **Dossier IDE** | Printer Management |

> **Note**: Ce programme est Prg_179.xml. L'ID XML (179) peut differer de la position IDE (180).

---

## 2. TABLES (5 tables -  en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #584 | `%club_user%tmillesia_dat` | tempo_type_millesia | **W** | 2x |
| #367 | `pmsprintparamdefault` | pms_print_param_default | R | 2x |
| #369 | `presparn` | presents_par_nationalite | R | 2x |
| #370 | `pv_accountdate_dat` | pv_accounting_date | R | 1x |
| #371 | `pv_bindingset_dat` | pv_binding_settings | R | 1x |

---

## 3. PARAMETRES D'ENTREE (1)

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

> Total: 120 variables mappees

---

## 5. EXPRESSIONS (33 total, 18 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `{0,1}` | `{0,1}` |
| 2 | `'FALSE'LOG` | `'FALSE'LOG` |
| 3 | `NOT {32768,78}` | `NOT VG.Hostname au lieu de Term` |
| 4 | `{32768,78}` | `VG.Hostname au lieu de Term` |
| 1 | `{0,2}` | `{0,2}` |
| 2 | `DbDel ('{584,4}'DSOURCE,'')` | `DbDel ('{584,4}'DSOURCE,'')` |
| 1 | `{0,1}` | `{0,1}` |
| 2 | `{0,2}` | `{0,2}` |
| 3 | `{0,3}` | `{0,3}` |
| 4 | `IF ({0,4},{0,5},IF ({0,6},{0,10},{0,12}))` | `IF ({0,4},{0,5},IF ({0,6},{0,10},{0,12}))` |
| 5 | `''` | `''` |
| 6 | `999` | `999` |
| 7 | `GetParam ('CURRENTLISTINGNUM')` | `GetParam ('CURRENTLISTINGNUM')` |
| 8 | `{0,1}` | `{0,1}` |
| 1 | `{32768,79}` | `VG.Numéro pseudo terminal` |
| 2 | `GetParam ('CURRENTLISTINGNUM')` | `GetParam ('CURRENTLISTINGNUM')` |
| 3 | `{1,1}` | `{1,1}` |
| 4 | `{0,4}` | `{0,4}` |
| 5 | `'TRUE'LOG` | `'TRUE'LOG` |
| 1 | `'No change and exit'` | `'No change and exit'` |
| 2 | `'TRUE'LOG` | `'TRUE'LOG` |
| 3 | `GetParam ('CURRENTLISTINGNUM')` | `GetParam ('CURRENTLISTINGNUM')` |
| 4 | `GetParam ('CURRENTLISTINGNAME')` | `GetParam ('CURRENTLISTINGNAME')` |
| 5 | `GetParam ('CURRENTPRINTERNUM')` | `GetParam ('CURRENTPRINTERNUM')` |
| 6 | `1*GetParam ('NUMBERCOPIES')` | `1*GetParam ('NUMBERCOPIES')` |
| 7 | `SetParam ('CURRENTPRINTERNUM',{0,8})` | `SetParam ('CURRENTPRINTERNUM',{0,8})` |
| 8 | `SetParam ('CURRENTPRINTERNAME',{0,9})` | `SetParam ('CURRENTPRINTERNAME',{0,9})` |
| 9 | `SetParam ('NUMBERCOPIES',{0,11})` | `SetParam ('NUMBERCOPIES',{0,11})` |
| 10 | `SetParam ('SPECIFICPRINT','YES')` | `SetParam ('SPECIFICPRINT','YES')` |
| 11 | `GetParam ('DEFAULTPRINTERNUM')` | `GetParam ('DEFAULTPRINTERNUM')` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 5 ( W / 4 R) |
| Parametres | 1 |
| Variables locales | 1 |
| Expressions | 33 |
| Expressions 100% decodees | 18 (55%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
