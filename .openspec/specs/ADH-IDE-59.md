# ADH IDE 59 - Facture - chargement boutique

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_59.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 59 |
| **Fichier XML** | Prg_59.xml |
| **Description** | Facture - chargement boutique |
| **Type** | B (O=Online, B=Batch) |
| **Parametres** | 2 |
| **Module** | ADH |
| **Dossier IDE** | Easy Check Out |

> **Note**: Ce programme est Prg_59.xml. L'ID XML (59) peut differer de la position IDE (59).

---

## 2. TABLES (2 tables -  en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #870 | `rayons_boutique` | Rayons_Boutique | **W** | 1x |
| #866 | `maj_appli_tpe` | maj_appli_tpe | R | 1x |

---

## 3. PARAMETRES D'ENTREE (2)

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

> Total: 122 variables mappees

---

## 5. EXPRESSIONS (29 total, 4 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `{0,1}` | `p.Compte` |
| 2 | `{0,2}` | `{0,2}` |
| 3 | `{0,8}` | `{0,8}` |
| 4 | `'R'` | `'R'` |
| 5 | `{0,35}` | `{0,35}` |
| 6 | `{0,36}` | `{0,36}` |
| 7 | `{0,33}` | `{0,33}` |
| 8 | `{0,25}` | `{0,25}` |
| 9 | `{0,37}` | `{0,37}` |
| 10 | `{0,38}` | `{0,38}` |
| 11 | `{0,39}` | `{0,39}` |
| 12 | `{0,40}` | `{0,40}` |
| 13 | `{0,41}` | `{0,41}` |
| 14 | `{0,42}` | `{0,42}` |
| 15 | `{0,43}` | `{0,43}` |
| 16 | `{0,44}` | `{0,44}` |
| 17 | `{0,24}` | `{0,24}` |
| 18 | `''` | `''` |
| 19 | `{0,8}` | `{0,8}` |
| 20 | `{0,21}` | `{0,21}` |
| 21 | `{0,12}` | `{0,12}` |
| 22 | `{0,5}` | `{0,5}` |
| 23 | `{0,18}` | `{0,18}` |
| 24 | `{0,46}` | `{0,46}` |
| 25 | `{0,31}` | `{0,31}` |
| 26 | `{0,29}` | `{0,29}` |
| 27 | `{0,17}` | `{0,17}` |
| 28 | `1` | `1` |
| 29 | `{0,23}` | `{0,23}` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 2 ( W /  R) |
| Parametres | 2 |
| Variables locales | 2 |
| Expressions | 29 |
| Expressions 100% decodees | 4 (14%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
