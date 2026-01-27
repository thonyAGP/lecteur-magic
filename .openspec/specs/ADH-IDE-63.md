# ADH IDE 63 - Test Easy Check-Out Online

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_63.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 63 |
| **Fichier XML** | Prg_63.xml |
| **Description** | Test Easy Check-Out Online |
| **Type** | O (O=Online, B=Batch) |
| **Parametres** | 0 |
| **Module** | ADH |
| **Dossier IDE** | Easy Check Out |

> **Note**: Ce programme est Prg_63.xml. L'ID XML (63) peut differer de la position IDE (63).

---

## 2. TABLES (8 tables - 0 en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #30 | `cafil008_dat` | gm-recherche_____gmr | R | 1x |
| #31 | `cafil009_dat` | gm-complet_______gmc | R | 1x |
| #39 | `cafil017_dat` | depot_garantie___dga | R | 1x |
| #47 | `cafil025_dat` | compte_gm________cgm | R | 1x |
| #66 | `cafil044_dat` | imputations______imp | R | 1x |
| #69 | `cafil047_dat` | initialisation___ini | R | 1x |
| #70 | `cafil048_dat` | date_comptable___dat | R | 1x |
| #285 | `email` | email | R | 1x |

---

## 3. PARAMETRES D'ENTREE (0)

| # | Nom | Type | Description |
|---|-----|------|-------------|

---

## 4. VARIABLES PRINCIPALES

### 4.1 Variables de travail (W0/V0)

| Ref | Nom | Type | Role |
|-----|-----|------|------|
| `{0,-117}` | v.DateJ-2 | DATE | - |
| `{0,-116}` | v.Tous les insoldés | LOGICAL | - |
| `{0,-113}` | v.Réponse | NUMERIC | - |
| `{0,-112}` | v.clause where | ALPHA | - |

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

> Total: 130 variables mappees

---

## 5. EXPRESSIONS (17 total, 15 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `'Lancer'` | `'Lancer'` |
| 2 | `'Quitter'` | `'Quitter'` |
| 3 | `AddDate (Date(),0,0,-1)` | `AddDate (Date(),0,0,-1)` |
| 4 | `{0,1}>AddDate (Date(),0,0,-1)` | `v.Tous les insoldés>AddDate (Date(),0,0,-1)` |
| 5 | `{0,5}=6` | `v.clause where=6` |
| 6 | `'dga_date_depot='''&DStr('27/03/2022'DATE,'YYYYMMDD')&''''` | `'dga_date_depot='''&DStr('27/03/2022'DATE,'YYYYMMDD')&''''` |
| 7 | `INIPut('EmbedFonts=N','FALSE'LOG)` | `INIPut('EmbedFonts=N','FALSE'LOG)` |
| 8 | `INIPut('CompressPDF=N','FALSE'LOG)` | `INIPut('CompressPDF=N','FALSE'LOG)` |
| 1 | `{0,1}` | `v.Tous les insoldés` |
| 2 | `{0,2}` | `b.Lancer` |
| 3 | `{0,3}` | `b.Quitter` |
| 4 | `'00/00/0000'DATE` | `'00/00/0000'DATE` |
| 5 | `Trim({0,5})&Trim({0,6})<>''` | `Trim(v.clause where)&Trim({0,6})<>''` |
| 6 | `{1,1}` | `{1,1}` |
| 7 | `{0,4}` | `v.Réponse` |
| 8 | `Date()` | `Date()` |
| 9 | `Time()` | `Time()` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 8 (0 W / 8 R) |
| Parametres | 0 |
| Variables locales | 6 |
| Expressions | 17 |
| Expressions 100% decodees | 15 (88%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
