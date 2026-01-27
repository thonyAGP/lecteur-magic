# ADH IDE 86 - Bar Limit

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_86.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 86 |
| **Fichier XML** | Prg_86.xml |
| **Description** | Bar Limit |
| **Type** | O (O=Online, B=Batch) |
| **Parametres** | 6 |
| **Module** | ADH |
| **Dossier IDE** | EzCard |

> **Note**: Ce programme est Prg_86.xml. L'ID XML (86) peut differer de la position IDE (86).

---

## 2. TABLES (3 tables - 2 en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #19 | `bldetail` | bl_detail | **W** | 7x |
| #312 | `ezcard` | ez_card | **W** | 4x |
| #30 | `cafil008_dat` | gm-recherche_____gmr | R | 1x |

---

## 3. PARAMETRES D'ENTREE (6)

| # | Nom | Type | Description |
|---|-----|------|-------------|
| P1 | v.plafond actuel | NUMERIC | - |
| P2 | v.plafond reste | NUMERIC | - |
| P3 | v.choix action | ALPHA | - |

---

## 4. VARIABLES PRINCIPALES

### 4.1 Variables de travail (W0/V0)

| Ref | Nom | Type | Role |
|-----|-----|------|------|
| `{0,-114}` | v.plafond actuel | NUMERIC | - |
| `{0,-113}` | v.plafond reste | NUMERIC | - |
| `{0,-112}` | v.choix action | ALPHA | - |
| `{0,-104}` | V.Date derniere annulation | DATE | - |
| `{0,-103}` | V.Time derniere annulation | TIME | - |

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

## 5. EXPRESSIONS (89 total, 39 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `''` | `''` |
| 2 | `Date ()` | `Date ()` |
| 3 | `{32768,1}` | `VG.USER` |
| 4 | `{0,1}` | `p.code-8chiffres` |
| 5 | `{0,2}` | `p.filiation` |
| 6 | `{0,3}` | `p.masque montant` |
| 7 | `40` | `40` |
| 8 | `'LISTEOPE'` | `'LISTEOPE'` |
| 9 | `{0,14}='A'` | `{0,14}='A'` |
| 10 | `{0,14}='B'` | `{0,14}='B'` |
| 11 | `{0,14}='C'` | `{0,14}='C'` |
| 1 | `Date ()` | `Date ()` |
| 2 | `Time ()` | `Time ()` |
| 3 | `{32768,1}` | `VG.USER` |
| 4 | `{2,4}` | `{2,4}` |
| 1 | `{3,1}` | `{3,1}` |
| 2 | `{3,2}` | `{3,2}` |
| 3 | `{3,3}` | `{3,3}` |
| 4 | `{3,6}` | `{3,6}` |
| 5 | `'2'` | `'2'` |
| 6 | `0` | `0` |
| 7 | `{1,1}` | `{1,1}` |
| 8 | `{1,2}` | `{1,2}` |
| 9 | `{32768,1}` | `VG.USER` |
| 10 | `0` | `0` |
| 11 | `''` | `''` |
| 1 | `{3,1}` | `{3,1}` |
| 2 | `{3,2}` | `{3,2}` |
| 3 | `{3,3}` | `{3,3}` |
| 4 | `'1'` | `'1'` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 3 (2 W /  R) |
| Parametres | 6 |
| Variables locales | 11 |
| Expressions | 89 |
| Expressions 100% decodees | 39 (44%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
