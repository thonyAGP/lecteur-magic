# ADH IDE 60 - Creation entete facture

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_60.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 60 |
| **Fichier XML** | Prg_60.xml |
| **Description** | Creation entete facture |
| **Type** | B (O=Online, B=Batch) |
| **Parametres** | 7 |
| **Module** | ADH |
| **Dossier IDE** | Easy Check Out |

> **Note**: Ce programme est Prg_60.xml. L'ID XML (60) peut differer de la position IDE (60).

---

## 2. TABLES (1 tables -  en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #932 | `taxe_add_param` | taxe_add_param | **W** | 1x |

---

## 3. PARAMETRES D'ENTREE (7)

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

> Total: 132 variables mappees

---

## 5. EXPRESSIONS (7 total, 6 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `{0,1}` | `p.Nom` |
| 2 | `{0,2}` | `p.Adresse` |
| 3 | `{0,3}` | `p.CodePostal` |
| 4 | `{0,4}` | `p.Ville` |
| 5 | `{0,5}` | `p.Tel` |
| 6 | `{0,6}` | `P.Pays` |
| 7 | `{0,7}` | `{0,7}` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 1 ( W / 0 R) |
| Parametres | 7 |
| Variables locales | 7 |
| Expressions | 7 |
| Expressions 100% decodees | 6 (86%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
