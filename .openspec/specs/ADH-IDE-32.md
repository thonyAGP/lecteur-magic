# ADH IDE 32 - Write histo_Fus_Sep_Saisie

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_32.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 32 |
| **Fichier XML** | Prg_32.xml |
| **Description** | Write histo_Fus_Sep_Saisie |
| **Type** | B (O=Online, B=Batch) |
| **Parametres** | 11 |
| **Module** | ADH |
| **Dossier IDE** | Changement Compte |

> **Note**: Ce programme est Prg_32.xml. L'ID XML (32) peut differer de la position IDE (32).

---

## 2. TABLES (1 tables -  en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #343 | `histo_fus_sep_saisie` | histo_fusionseparation_saisie | **W** | 1x |

---

## 3. PARAMETRES D'ENTREE (11)

| # | Nom | Type | Description |
|---|-----|------|-------------|
| P1 | i chrono E/F | NUMERIC | - |
| P2 | i societe | ALPHA | - |
| P3 | i compte reference | NUMERIC | - |
| P4 | i filiation reference | NUMERIC | - |
| P5 | i compte pointe old | NUMERIC | - |
| P6 | i filiation pointe old | NUMERIC | - |
| P7 | i compte pointe new | NUMERIC | - |
| P8 | i filiation pointe new | NUMERIC | - |
| P9 | i type E/F | ALPHA | - |
| P10 | i nom | ALPHA | - |
| P11 | i prenom | ALPHA | - |

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

> Total: 140 variables mappees

---

## 5. EXPRESSIONS (12 total, 10 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `{0,1}` | `i societe` |
| 2 | `{0,2}` | `i compte reference` |
| 3 | `{0,3}` | `i filiation reference` |
| 4 | `{0,4}` | `i compte pointe old` |
| 5 | `{0,5}` | `i filiation pointe old` |
| 6 | `{0,6}` | `i compte pointe new` |
| 7 | `{0,7}` | `i filiation pointe new` |
| 8 | `{0,8}` | `i type E/F` |
| 9 | `{0,9}` | `i nom` |
| 10 | `{0,10}` | `i prenom` |
| 11 | `{0,11}` | `{0,11}` |
| 12 | `Trim ({0,10})&' '&Trim ({0,11})` | `Trim (i prenom)&' '&Trim ({0,11})` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 1 ( W / 0 R) |
| Parametres | 11 |
| Variables locales | 11 |
| Expressions | 12 |
| Expressions 100% decodees | 10 (83%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
