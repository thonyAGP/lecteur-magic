# ADH IDE 194 - Update CC type

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_193.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 194 |
| **Fichier XML** | Prg_193.xml |
| **Description** | Update CC type |
| **Type** | B (O=Online, B=Batch) |
| **Parametres** | 4 |
| **Module** | ADH |
| **Dossier IDE** | Solde |

> **Note**: Ce programme est Prg_193.xml. L'ID XML (193) peut differer de la position IDE (194).

---

## 2. TABLES (3 tables - 3 en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #268 | `ccpartyp` | cc_total_par_type | **W** | 1x |
| #271 | `cctotal` | cc_total | **W** | 1x |
| #272 | `cctypdet` | cc_type_detail | **W** | 1x |

---

## 3. PARAMETRES D'ENTREE (4)

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

## 5. EXPRESSIONS (11 total, 8 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `{0,1}` | `P Adherent` |
| 2 | `{0,2}` | `P Filiation` |
| 3 | `{0,3}` | `P Montant` |
| 4 | `'99'` | `'99'` |
| 5 | `'99'` | `'99'` |
| 6 | `Date ()` | `Date ()` |
| 7 | `Time ()` | `Time ()` |
| 8 | `{32768,1}` | `VG.USER` |
| 9 | `{0,9}-{0,4}` | `{0,9}-{0,4}` |
| 10 | `{0,22}-{0,4}` | `{0,22}-{0,4}` |
| 11 | `{0,4}-(-1)` | `{0,4}-(-1)` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 3 (3 W / 0 R) |
| Parametres | 4 |
| Variables locales | 4 |
| Expressions | 11 |
| Expressions 100% decodees | 8 (73%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
