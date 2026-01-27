# ADH IDE 62 - Maj Hebergement Tempo

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_62.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 62 |
| **Fichier XML** | Prg_62.xml |
| **Description** | Maj Hebergement Tempo |
| **Type** | B (O=Online, B=Batch) |
| **Parametres** | 6 |
| **Module** | ADH |
| **Dossier IDE** | Easy Check Out |

> **Note**: Ce programme est Prg_62.xml. L'ID XML (62) peut differer de la position IDE (62).

---

## 2. TABLES (2 tables -  en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #868 | `affectation_gift_pass` | Affectation_Gift_Pass | **W** | 1x |
| #866 | `maj_appli_tpe` | maj_appli_tpe | R | 1x |

---

## 3. PARAMETRES D'ENTREE (6)

| # | Nom | Type | Description |
|---|-----|------|-------------|

---

## 4. VARIABLES PRINCIPALES

### 4.1 Variables de travail (W0/V0)

| Ref | Nom | Type | Role |
|-----|-----|------|------|
| `{0,-116}` | V.Lien Hebergement_Pro | LOGICAL | - |

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

> Total: 132 variables mappees

---

## 5. EXPRESSIONS (8 total, 7 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `Date()` | `Date()` |
| 2 | `{0,4}` | `p.DateDebut` |
| 3 | `{0,1}` | `p.Compte` |
| 4 | `{0,2}` | `p.Filiation` |
| 5 | `{0,3}` | `p.NumFac` |
| 6 | `{0,5}` | `p.DateFin` |
| 7 | `{0,6}` | `V.Lien Hebergement_Pro` |
| 8 | `{0,7}` | `{0,7}` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 2 ( W /  R) |
| Parametres | 6 |
| Variables locales | 7 |
| Expressions | 8 |
| Expressions 100% decodees | 7 (88%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
