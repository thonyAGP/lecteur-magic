# ADH IDE 55 - Easy Check-Out === V2.00

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_55.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 55 |
| **Fichier XML** | Prg_55.xml |
| **Description** | Easy Check-Out === V2.00 |
| **Type** | O (O=Online, B=Batch) |
| **Parametres** | 0 |
| **Module** | ADH |
| **Dossier IDE** | Easy Check Out |

> **Note**: Ce programme est Prg_55.xml. L'ID XML (55) peut differer de la position IDE (55).

---

## 2. TABLES (0 tables - 0 en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|

---

## 3. PARAMETRES D'ENTREE (0)

| # | Nom | Type | Description |
|---|-----|------|-------------|

---

## 4. VARIABLES PRINCIPALES

### 4.1 Variables de travail (W0/V0)

| Ref | Nom | Type | Role |
|-----|-----|------|------|
| `{0,-117}` | v.Date Traitement | DATE | - |
| `{0,-116}` | v.Tous les insoldés | LOGICAL | - |
| `{0,-113}` | v.Réponse | NUMERIC | - |
| `{0,-112}` | v.clause where | ALPHA | - |
| `{0,-111}` | v.compte test | NUMERIC | - |
| `{0,-110}` | v.lance raison use adh | LOGICAL | - |

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

## 5. EXPRESSIONS (14 total, 13 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `'Lancer'` | `'Lancer'` |
| 2 | `'Quitter'` | `'Quitter'` |
| 3 | `AddDate (Date(),0,0,-1)` | `AddDate (Date(),0,0,-1)` |
| 4 | `{0,1}>Date()` | `v.Tous les insoldés>Date()` |
| 5 | `{0,5}=6` | `v.clause where=6` |
| 6 | `IF({0,2},'','gmc_accept_exp_co=1')` | `IF(b.Lancer,'','gmc_accept_exp_co=1')` |
| 7 | `MlsTrans('La date de traitement ne peut pas être supérieu...` | `MlsTrans('La date de traitement ne peut pas être supérieu...` |
| 8 | `{32768,3}` | `VG.DROIT ACCES IT ?` |
| 9 | `0` | `0` |
| 10 | `NOT({32768,3})` | `NOT(VG.DROIT ACCES IT ?)` |
| 11 | `{32768,111} AND {32768,112}<>0` | `VG. Interface Galaxy Grèce AND VG.Second Safe Control 1.0...` |
| 12 | `'Easy Check Out'` | `'Easy Check Out'` |
| 13 | `{0,8}` | `{0,8}` |
| 14 | `'TRUE'LOG` | `'TRUE'LOG` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 0 (0 W / 0 R) |
| Parametres | 0 |
| Variables locales | 8 |
| Expressions | 14 |
| Expressions 100% decodees | 13 (93%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
