# ADH IDE 45 - Recuperation langue

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_45.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 45 |
| **Fichier XML** | Prg_45.xml |
| **Description** | Recuperation langue |
| **Type** | B (O=Online, B=Batch) |
| **Parametres** | 0 |
| **Module** | ADH |
| **Dossier IDE** | Divers |

> **Note**: Ce programme est Prg_45.xml. L'ID XML (45) peut differer de la position IDE (45).

---

## 2. TABLES (1 tables - 0 en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #740 | `pv_stockmvt_dat` | pv_stock_movements | R | 1x |

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

## 5. EXPRESSIONS (13 total, 9 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `'C'` | `'C'` |
| 2 | `{32768,1}` | `VG.USER` |
| 3 | `SetParam ('CODELANGUE',IF ({0,3}='','FRA',{0,3}))` | `SetParam ('CODELANGUE',IF ({0,3}='','FRA',{0,3}))` |
| 4 | `IF ({0,3}='','FRA',{0,3})` | `IF ({0,3}='','FRA',{0,3})` |
| 5 | `SetLang (Trim ({0,3}))` | `SetLang (Trim ({0,3}))` |
| 6 | `MnuShow ('1','TRUE'LOG)` | `MnuShow ('1','TRUE'LOG)` |
| 7 | `MnuShow ('2','TRUE'LOG)` | `MnuShow ('2','TRUE'LOG)` |
| 8 | `MnuShow ('3','TRUE'LOG)` | `MnuShow ('3','TRUE'LOG)` |
| 9 | `MnuShow ('4','TRUE'LOG)` | `MnuShow ('4','TRUE'LOG)` |
| 10 | `MnuShow ('5','TRUE'LOG)` | `MnuShow ('5','TRUE'LOG)` |
| 11 | `MnuShow ('6','TRUE'LOG)` | `MnuShow ('6','TRUE'LOG)` |
| 12 | `MnuShow ('ITRIGHT',{32768,3})` | `MnuShow ('ITRIGHT',VG.DROIT ACCES IT ?)` |
| 13 | `{0,4}` | `{0,4}` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 1 (0 W /  R) |
| Parametres | 0 |
| Variables locales | 0 |
| Expressions | 13 |
| Expressions 100% decodees | 9 (69%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
