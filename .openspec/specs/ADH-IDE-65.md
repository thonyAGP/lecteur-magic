# ADH IDE 65 - Edition & Mail Easy Check Out

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_65.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 65 |
| **Fichier XML** | Prg_65.xml |
| **Description** | Edition & Mail Easy Check Out |
| **Type** | B (O=Online, B=Batch) |
| **Parametres** | 4 |
| **Module** | ADH |
| **Dossier IDE** | Easy Check Out |

> **Note**: Ce programme est Prg_65.xml. L'ID XML (65) peut differer de la position IDE (65).

---

## 2. TABLES (7 tables - 3 en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #39 | `cafil017_dat` | depot_garantie___dga | **W** | 1x |
| #47 | `cafil025_dat` | compte_gm________cgm | **W** | 1x |
| #911 | `log_booker` | log_booker | **W** | 1x |
| #34 | `cafil012_dat` | hebergement______heb | R | 1x |
| #48 | `cafil026_dat` | lignes_de_solde__sld | R | 1x |
| #372 | `pv_budget_dat` | pv_budget | R | 2x |
| #934 | `selection_enregistrement_div` | selection enregistrement diver | R | 1x |

---

## 3. PARAMETRES D'ENTREE (4)

| # | Nom | Type | Description |
|---|-----|------|-------------|

---

## 4. VARIABLES PRINCIPALES

### 4.1 Variables de travail (W0/V0)

| Ref | Nom | Type | Role |
|-----|-----|------|------|
| `{0,-114}` | v.Date | DATE | - |
| `{0,-113}` | v.Time | TIME | - |
| `{0,-109}` | v.Piece Jointe | LOGICAL | - |

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

> Total: 132 variables mappees

---

## 5. EXPRESSIONS (48 total, 20 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `Date()` | `Date()` |
| 2 | `Time()` | `Time()` |
| 3 | `{0,2}` | `P.i.Test PES` |
| 4 | `{0,2} AND NOT({0,3})` | `P.i.Test PES AND NOT(P.i.Date Edition)` |
| 1 | `Date()` | `Date()` |
| 2 | `{1,4}` | `{1,4}` |
| 3 | `Translate('%club_exportdata%')&'Easy_Check_Out\'&IF({1,3}...` | `Translate('%club_exportdata%')&'Easy_Check_Out\'&IF({1,3}...` |
| 4 | `'C'` | `'C'` |
| 5 | `{0,2}` | `P.i.Test PES` |
| 6 | `{0,3}` | `P.i.Date Edition` |
| 7 | `'Z'` | `'Z'` |
| 8 | `{32768,22}` | `VG.MASQUE MONTANT` |
| 9 | `{32768,44}` | `VG.VG_FAX_VISIBLE` |
| 10 | `CndRange({1,1},'FALSE'LOG)` | `CndRange({1,1},'FALSE'LOG)` |
| 11 | `NOT {0,6}` | `NOT v.Piece Jointe` |
| 12 | `Trim({0,19})` | `Trim({0,19})` |
| 13 | `Trim({0,24})` | `Trim({0,24})` |
| 14 | `Date()` | `Date()` |
| 15 | `{0,42}+{0,40}` | `{0,42}+{0,40}` |
| 16 | `{0,43}+{0,40}` | `{0,43}+{0,40}` |
| 17 | `{0,41}='VISA'` | `{0,41}='VISA'` |
| 18 | `{0,41}='AMEX'` | `{0,41}='AMEX'` |
| 19 | `NOT({1,2})` | `NOT({1,2})` |
| 20 | `IF({1,3},{0,31},IF(Trim({0,41})<>'',{0,41},{0,31}))` | `IF({1,3},{0,31},IF(Trim({0,41})<>'',{0,41},{0,31}))` |
| 21 | `{1,3}` | `{1,3}` |
| 22 | `IF({1,3},MlsTrans('Montant Testé'),MlsTrans('Montant débi...` | `IF({1,3},MlsTrans('Montant Testé'),MlsTrans('Montant débi...` |
| 23 | `IF({1,3},{0,32},{0,40})` | `IF({1,3},{0,32},{0,40})` |
| 24 | `NOT({1,3})` | `NOT({1,3})` |
| 25 | `{1,3} AND NOT({0,6}) AND {1,2}` | `{1,3} AND NOT(v.Piece Jointe) AND {1,2}` |
| 26 | `{32768,92}` | `VG.Annulation de Garantie` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 7 (3 W / 4 R) |
| Parametres | 4 |
| Variables locales | 7 |
| Expressions | 48 |
| Expressions 100% decodees | 20 (42%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
