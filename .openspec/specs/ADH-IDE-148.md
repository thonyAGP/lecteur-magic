# ADH IDE 148 - Devises RAZ WS

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_148.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 148 |
| **Fichier XML** | Prg_148.xml |
| **Description** | Devises RAZ WS |
| **Type** | B (O=Online, B=Batch) |
| **Parametres** | 5 |
| **Module** | ADH |
| **Dossier IDE** | Gestion Caisse |

> **Note**: Ce programme est Prg_148.xml. L'ID XML (148) peut differer de la position IDE (148).

---

## 2. TABLES (3 tables -  en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #232 | `caisse_devise` | gestion_devise_session | **W** | 2x |
| #50 | `cafil028_dat` | moyens_reglement_mor | R | 1x |
| #139 | `cafil117_dat` | moyens_reglement_mor | R | 1x |

---

## 3. PARAMETRES D'ENTREE (5)

| # | Nom | Type | Description |
|---|-----|------|-------------|
| P1 | Param societe | ALPHA | - |
| P2 | Param devise locale | ALPHA | - |
| P3 | Param quand | ALPHA | - |
| P4 | Param type | ALPHA | - |
| P5 | Param UNI/BI | ALPHA | - |

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

> Total: 128 variables mappees

---

## 5. EXPRESSIONS (21 total, 12 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `{0,5}<>'B'` | `{0,5}<>'B'` |
| 2 | `{0,5}='B'` | `{0,5}='B'` |
| 1 | `{0,1}` | `Param devise locale` |
| 2 | `{32768,1}` | `VG.USER` |
| 3 | `{0,6}` | `{0,6}` |
| 4 | `{0,8}` | `{0,8}` |
| 5 | `{0,3}` | `Param type` |
| 6 | `{0,4}` | `Param UNI/BI` |
| 7 | `{0,6}<>{0,2}` | `{0,6}<>Param quand` |
| 8 | `0` | `0` |
| 1 | `{0,1}` | `Param devise locale` |
| 2 | `'O'` | `'O'` |
| 3 | `0` | `0` |
| 4 | `{32768,1}` | `VG.USER` |
| 5 | `{0,6}` | `{0,6}` |
| 6 | `{0,8}` | `{0,8}` |
| 7 | `{0,3}` | `Param type` |
| 8 | `{0,4}` | `Param UNI/BI` |
| 9 | `{0,6}<>{0,2}` | `{0,6}<>Param quand` |
| 10 | `0` | `0` |
| 11 | `{0,6}&{0,8}` | `{0,6}&{0,8}` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 3 ( W / 2 R) |
| Parametres | 5 |
| Variables locales | 5 |
| Expressions | 21 |
| Expressions 100% decodees | 12 (57%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
