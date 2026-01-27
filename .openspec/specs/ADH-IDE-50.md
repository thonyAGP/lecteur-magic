# ADH IDE 50 -   Initialistaion Easy Arrival

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_50.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 50 |
| **Fichier XML** | Prg_50.xml |
| **Description** |   Initialistaion Easy Arrival |
| **Type** | B (O=Online, B=Batch) |
| **Parametres** | 0 |
| **Module** | ADH |
| **Dossier IDE** | Divers |

> **Note**: Ce programme est Prg_50.xml. L'ID XML (50) peut differer de la position IDE (50).

---

## 2. TABLES (1 tables - 0 en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #881 | `evenement_temp` | evenement_temp | R | 1x |

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

## 5. EXPRESSIONS (6 total, 3 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `'LOCATION'` | `'LOCATION'` |
| 2 | `'COURS'` | `'COURS'` |
| 3 | `'ENFANT'` | `'ENFANT'` |
| 4 | `Trim({0,2})` | `Trim({0,2})` |
| 5 | `Trim({0,4})` | `Trim({0,4})` |
| 6 | `Trim({0,6})` | `Trim({0,6})` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 1 (0 W /  R) |
| Parametres | 0 |
| Variables locales | 0 |
| Expressions | 6 |
| Expressions 100% decodees | 3 (50%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
