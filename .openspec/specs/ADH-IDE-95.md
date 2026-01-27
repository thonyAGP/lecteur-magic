# ADH IDE 95 - Facture - Sejour archive

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_95.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 95 |
| **Fichier XML** | Prg_95.xml |
| **Description** | Facture - Sejour archive |
| **Type** | B (O=Online, B=Batch) |
| **Parametres** | 4 |
| **Module** | ADH |
| **Dossier IDE** | Factures |

> **Note**: Ce programme est Prg_95.xml. L'ID XML (95) peut differer de la position IDE (95).

---

## 2. TABLES (6 tables - 2 en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #868 | `affectation_gift_pass` | Affectation_Gift_Pass | **W** | 4x |
| #870 | `rayons_boutique` | Rayons_Boutique | **W** | 2x |
| #744 | `pv_lieux_vente` | pv_lieux_vente | R | 1x |
| #746 | `version` | projet | R | 1x |
| #756 | `cafil_country_iso` | Country_ISO | R | 2x |
| #871 | `activite` | Activite | R | 1x |

---

## 3. PARAMETRES D'ENTREE (4)

| # | Nom | Type | Description |
|---|-----|------|-------------|

---

## 4. VARIABLES PRINCIPALES

### 4.1 Variables de travail (W0/V0)

| Ref | Nom | Type | Role |
|-----|-----|------|------|
| `{0,-110}` | V.Lien Hebergement_Pro | LOGICAL | - |

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

## 5. EXPRESSIONS (106 total, 17 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `{0,1}` | `P.i.Num compte` |
| 2 | `{0,2}` | `P.i.Fliliation` |
| 3 | `{0,3}` | `P.i.Date Purge` |
| 4 | `{0,4}` | `V.Lien Hebergement_Pro` |
| 5 | `{0,8}` | `{0,8}` |
| 6 | `{0,9}` | `{0,9}` |
| 7 | `NOT({0,11})` | `NOT({0,11})` |
| 1 | `{1,1}` | `{1,1}` |
| 2 | `{1,2}` | `{1,2}` |
| 3 | `{1,3}` | `{1,3}` |
| 4 | `{1,8}` | `{1,8}` |
| 5 | `{1,9}` | `{1,9}` |
| 1 | `{1,1}` | `{1,1}` |
| 2 | `{1,2}` | `{1,2}` |
| 3 | `{1,4}` | `{1,4}` |
| 4 | `{0,23}` | `{0,23}` |
| 5 | `{0,19}` | `{0,19}` |
| 6 | `'COMPT'` | `'COMPT'` |
| 7 | `{0,1}` | `P.i.Num compte` |
| 8 | `{0,2}` | `P.i.Fliliation` |
| 9 | `{0,3}` | `P.i.Date Purge` |
| 10 | `{0,4}` | `V.Lien Hebergement_Pro` |
| 11 | `{0,5}` | `{0,5}` |
| 12 | `{0,8}` | `{0,8}` |
| 13 | `{0,9}` | `{0,9}` |
| 14 | `{0,10}` | `{0,10}` |
| 15 | `{0,11}` | `{0,11}` |
| 16 | `{0,12}` | `{0,12}` |
| 17 | `{0,13}` | `{0,13}` |
| 18 | `{0,14}` | `{0,14}` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 6 (2 W / 4 R) |
| Parametres | 4 |
| Variables locales | 5 |
| Expressions | 106 |
| Expressions 100% decodees | 17 (16%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
