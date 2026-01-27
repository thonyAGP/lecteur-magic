# ADH IDE 178 - Set Village Address

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_177.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 178 |
| **Fichier XML** | Prg_177.xml |
| **Description** | Set Village Address |
| **Type** | B (O=Online, B=Batch) |
| **Parametres** | 0 |
| **Module** | ADH |
| **Dossier IDE** | Printer Management |

> **Note**: Ce programme est Prg_177.xml. L'ID XML (177) peut differer de la position IDE (178).

---

## 2. TABLES (1 tables - 0 en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #372 | `pv_budget_dat` | pv_budget | R | 1x |

---

## 3. PARAMETRES D'ENTREE (0)

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

> Total: 118 variables mappees

---

## 5. EXPRESSIONS (10 total, 0 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `SetParam ('VI_CLUB',{0,2})` | `SetParam ('VI_CLUB',{0,2})` |
| 2 | `SetParam ('VI_NAME',{0,3})` | `SetParam ('VI_NAME',{0,3})` |
| 3 | `SetParam ('VI_ADR1',{0,4})` | `SetParam ('VI_ADR1',{0,4})` |
| 4 | `SetParam ('VI_ADR2',{0,5})` | `SetParam ('VI_ADR2',{0,5})` |
| 5 | `SetParam ('VI_ZIPC',Trim({0,6}))` | `SetParam ('VI_ZIPC',Trim({0,6}))` |
| 6 | `SetParam ('VI_PHON',Trim({0,7}))` | `SetParam ('VI_PHON',Trim({0,7}))` |
| 7 | `SetParam ('VI_FAXN',Trim({0,8}))` | `SetParam ('VI_FAXN',Trim({0,8}))` |
| 8 | `SetParam ('VI_MAIL',Trim({0,9}))` | `SetParam ('VI_MAIL',Trim({0,9}))` |
| 9 | `SetParam ('VI_SIRE',Trim({0,10}))` | `SetParam ('VI_SIRE',Trim({0,10}))` |
| 10 | `SetParam ('VI_VATN',Trim({0,11}))` | `SetParam ('VI_VATN',Trim({0,11}))` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 1 (0 W /  R) |
| Parametres | 0 |
| Variables locales | 0 |
| Expressions | 10 |
| Expressions 100% decodees | 0 (0%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
