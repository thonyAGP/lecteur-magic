# ADH IDE 106 - Maj lignes saisies archive V3

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_106.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 106 |
| **Fichier XML** | Prg_106.xml |
| **Description** | Maj lignes saisies archive V3 |
| **Type** | B (O=Online, B=Batch) |
| **Parametres** | 7 |
| **Module** | ADH |
| **Dossier IDE** | Garantie |

> **Note**: Ce programme est Prg_106.xml. L'ID XML (106) peut differer de la position IDE (106).

---

## 2. TABLES (4 tables - 4 en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #746 | `version` | projet | **W** | 1x |
| #866 | `maj_appli_tpe` | maj_appli_tpe | **W** | 1x |
| #870 | `rayons_boutique` | Rayons_Boutique | **W** | 1x |
| #871 | `activite` | Activite | **W** | 1x |

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

> Total: 140 variables mappees

---

## 5. EXPRESSIONS (18 total, 10 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `{0,29}=0` | `{0,29}=0` |
| 2 | `{0,39}=0` | `{0,39}=0` |
| 3 | `{0,4}` | `P.i.NomFichPDF` |
| 4 | `Date()` | `Date()` |
| 5 | `Time()` | `Time()` |
| 6 | `{0,5}` | `P.i.SelectionManuelle` |
| 7 | `{0,1}` | `P.i.Compte` |
| 8 | `{0,2}` | `P.i.Flague` |
| 9 | `Date()` | `Date()` |
| 10 | `IF({0,3},'TRUE'LOG,'FALSE'LOG)` | `IF(P.i.No_Facture,'TRUE'LOG,'FALSE'LOG)` |
| 11 | `{0,13}` | `{0,13}` |
| 12 | `{0,27}` | `{0,27}` |
| 13 | `{0,34}` | `{0,34}` |
| 14 | `{0,13}` | `{0,13}` |
| 15 | `{0,21}` | `{0,21}` |
| 16 | `{0,16}=0 OR {0,29}=0` | `{0,16}=0 OR {0,29}=0` |
| 17 | `{0,6}` | `P.i.Date Purge` |
| 18 | `{0,7}` | `V retour Compta` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 4 (4 W / 0 R) |
| Parametres | 7 |
| Variables locales | 11 |
| Expressions | 18 |
| Expressions 100% decodees | 10 (56%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
