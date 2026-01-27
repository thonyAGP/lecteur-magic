# ADH IDE 204 - Mise en opposition autocom

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_203.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 204 |
| **Fichier XML** | Prg_203.xml |
| **Description** | Mise en opposition autocom |
| **Type** | B (O=Online, B=Batch) |
| **Parametres** | 4 |
| **Module** | ADH |
| **Dossier IDE** | Telephone |

> **Note**: Ce programme est Prg_203.xml. L'ID XML (203) peut differer de la position IDE (204).

---

## 2. TABLES (2 tables - 0 en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #30 | `cafil008_dat` | gm-recherche_____gmr | R | 1x |
| #80 | `cafil058_dat` | codes_autocom____aut | R | 1x |

---

## 3. PARAMETRES D'ENTREE (4)

| # | Nom | Type | Description |
|---|-----|------|-------------|
| P1 | PI societe | ALPHA | - |
| P2 | PI compte | NUMERIC | - |
| P3 | PI Type Triplet | ALPHA | - |
| P4 | PI Interface Pabx | ALPHA | - |
| P5 | V code | NUMERIC | - |
| P6 | V ligne | NUMERIC | - |
| P7 | V poste | NUMERIC | - |
| P8 | V ACTIF(P) | LOGICAL | - |

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

> Total: 134 variables mappees

---

## 5. EXPRESSIONS (10 total, 6 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `{0,1}` | `PI compte` |
| 2 | `{0,2}` | `PI Type Triplet` |
| 3 | `{0,8}` | `{0,8}` |
| 1 | `{1,9}` | `{1,9}` |
| 2 | `{1,10}` | `{1,10}` |
| 3 | `{1,11}` | `{1,11}` |
| 4 | `'P'` | `'P'` |
| 5 | `{0,4}` | `V code` |
| 6 | `{0,5}` | `V ligne` |
| 7 | `{0,6}` | `V poste` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 2 (0 W / 2 R) |
| Parametres | 4 |
| Variables locales | 8 |
| Expressions | 10 |
| Expressions 100% decodees | 6 (60%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
