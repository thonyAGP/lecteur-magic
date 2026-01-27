# ADH IDE 142 - Devise update session WS

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_142.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 142 |
| **Fichier XML** | Prg_142.xml |
| **Description** | Devise update session WS |
| **Type** | B (O=Online, B=Batch) |
| **Parametres** | 6 |
| **Module** | ADH |
| **Dossier IDE** | Gestion Caisse |

> **Note**: Ce programme est Prg_142.xml. L'ID XML (142) peut differer de la position IDE (142).

---

## 2. TABLES (1 tables -  en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #232 | `caisse_devise` | gestion_devise_session | **W** | 1x |

---

## 3. PARAMETRES D'ENTREE (6)

| # | Nom | Type | Description |
|---|-----|------|-------------|
| P1 | Param Code devise | ALPHA | - |
| P2 | Param mode paiement | ALPHA | - |
| P3 | Param Quand | ALPHA | - |
| P4 | Param Type | ALPHA | - |
| P5 | Param Quantite | NUMERIC | - |
| P6 | Param cumul OP change | LOGICAL | - |

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

> Total: 130 variables mappees

---

## 5. EXPRESSIONS (9 total, 6 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `{32768,1}` | `VG.USER` |
| 2 | `{0,1}` | `Param mode paiement` |
| 3 | `{0,2}` | `Param Quand` |
| 4 | `{0,3}` | `Param Type` |
| 5 | `{0,4}` | `Param Quantite` |
| 6 | `{0,5}` | `Param cumul OP change` |
| 7 | `{0,12}+{0,5}` | `{0,12}+Param cumul OP change` |
| 8 | `NOT ({0,6})` | `NOT ({0,6})` |
| 9 | `{0,6}` | `{0,6}` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 1 ( W / 0 R) |
| Parametres | 6 |
| Variables locales | 6 |
| Expressions | 9 |
| Expressions 100% decodees | 6 (67%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
