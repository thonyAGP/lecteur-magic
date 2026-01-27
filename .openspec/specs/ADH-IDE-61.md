# ADH IDE 61 - Maj des lignes saisies

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_61.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 61 |
| **Fichier XML** | Prg_61.xml |
| **Description** | Maj des lignes saisies |
| **Type** | B (O=Online, B=Batch) |
| **Parametres** | 5 |
| **Module** | ADH |
| **Dossier IDE** | Easy Check Out |

> **Note**: Ce programme est Prg_61.xml. L'ID XML (61) peut differer de la position IDE (61).

---

## 2. TABLES (4 tables - 4 en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #40 | `cafil018_dat` | comptable________cte | **W** | 1x |
| #263 | `caisse_vente` | vente | **W** | 1x |
| #866 | `maj_appli_tpe` | maj_appli_tpe | **W** | 1x |
| #870 | `rayons_boutique` | Rayons_Boutique | **W** | 1x |

---

## 3. PARAMETRES D'ENTREE (5)

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

> Total: 136 variables mappees

---

## 5. EXPRESSIONS (14 total, 7 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `{0,25}=0` | `{0,25}=0` |
| 2 | `{0,34}=0` | `{0,34}=0` |
| 3 | `{0,4}` | `p.NomFacPDF` |
| 4 | `Date()` | `Date()` |
| 5 | `{0,5}` | `V retour Compta` |
| 6 | `{0,1}` | `p.Compte` |
| 7 | `{0,2}` | `P.Flague` |
| 8 | `Date()` | `Date()` |
| 9 | `IF({0,3},'TRUE'LOG,'FALSE'LOG)` | `IF(p.NumFac,'TRUE'LOG,'FALSE'LOG)` |
| 10 | `{0,11}` | `{0,11}` |
| 11 | `{0,23}` | `{0,23}` |
| 12 | `{0,29}` | `{0,29}` |
| 13 | `{0,11}` | `{0,11}` |
| 14 | `{0,19}` | `{0,19}` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 4 (4 W / 0 R) |
| Parametres | 5 |
| Variables locales | 9 |
| Expressions | 14 |
| Expressions 100% decodees | 7 (50%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
