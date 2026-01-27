# ADH IDE 231 - Raisons utilisation ADH

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_286.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 231 |
| **Fichier XML** | Prg_286.xml |
| **Description** | Raisons utilisation ADH |
| **Type** | O (O=Online, B=Batch) |
| **Parametres** | 0 |
| **Module** | ADH |
| **Dossier IDE** | Utilitaires |

> **Note**: Ce programme est Prg_286.xml. L'ID XML (286) peut differer de la position IDE (231).

---

## 2. TABLES (1 tables - 0 en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #1094 | `Table_1094` | Unknown | R | 1x |

---

## 3. PARAMETRES D'ENTREE (0)

| # | Nom | Type | Description |
|---|-----|------|-------------|

---

## 4. VARIABLES PRINCIPALES

### 4.1 Variables de travail (W0/V0)

| Ref | Nom | Type | Role |
|-----|-----|------|------|
| `{0,-41}` | v.confirmation | NUMERIC | - |
| `{0,-40}` | v.id primaire | NUMERIC | - |
| `{0,-39}` | v.id secondaire | NUMERIC | - |
| `{0,-38}` | v.commentaire | UNICODE | - |
| `{0,-36}` | v.Existe Raison Secondaire | LOGICAL | - |
| `{0,-34}` | v.Retour Raison | LOGICAL | - |

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

## 5. EXPRESSIONS (14 total, 8 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `{0,40}` | `{0,40}` |
| 3 | `{32768,11}` | `VG.CODE LANGUE USER` |
| 4 | `'ADH'` | `'ADH'` |
| 2 | `0` | `0` |
| 5 | `IF({0,44},{0,41},{0,40})` | `IF({0,44},{0,41},{0,40})` |
| 6 | `{32768,11}` | `VG.CODE LANGUE USER` |
| 7 | `Trim({0,42})='' AND {0,51} AND LastClicked ()<>'Bt.Abando...` | `Trim({0,42})='' AND {0,51} AND LastClicked ()<>'Bt.Abando...` |
| 8 | `{0,39}=6` | `{0,39}=6` |
| 9 | `'ABANDON'` | `'ABANDON'` |
| 10 | `Term()` | `Term()` |
| 15 | `{0,44} AND {0,40}<>0` | `{0,44} AND {0,40}<>0` |
| 12 | `{0,54}` | `{0,54}` |
| 13 | `Date()` | `Date()` |
| 14 | `Time()` | `Time()` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 1 (0 W /  R) |
| Parametres | 0 |
| Variables locales | 6 |
| Expressions | 14 |
| Expressions 100% decodees | 8 (57%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
