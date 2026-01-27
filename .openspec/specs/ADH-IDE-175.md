# ADH IDE 175 - Transferts

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_174.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 175 |
| **Fichier XML** | Prg_174.xml |
| **Description** | Transferts |
| **Type** | B (O=Online, B=Batch) |
| **Parametres** | 3 |
| **Module** | ADH |
| **Dossier IDE** | Operations GM |

> **Note**: Ce programme est Prg_174.xml. L'ID XML (174) peut differer de la position IDE (175).

---

## 2. TABLES (3 tables - 0 en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #30 | `cafil008_dat` | gm-recherche_____gmr | R | 1x |
| #34 | `cafil012_dat` | hebergement______heb | R | 1x |
| #473 | `%club_user%_caisse_compcais` | comptage_caisse | R | 1x |

---

## 3. PARAMETRES D'ENTREE (3)

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

> Total: 124 variables mappees

---

## 5. EXPRESSIONS (20 total, 9 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `42` | `42` |
| 1 | `Trim ({0,1})` | `Trim (p.i.Num compte adhérent)` |
| 2 | `Date ()` | `Date ()` |
| 3 | `{32768,2}` | `VG.Retour Chariot` |
| 4 | `Stat (0,'C'MODE)` | `Stat (0,'C'MODE)` |
| 5 | `Trim ({0,6})&' '&{0,5}` | `Trim ({0,6})&' '&{0,5}` |
| 6 | `165` | `165` |
| 7 | `NOT(Stat(0,'M'MODE))` | `NOT(Stat(0,'M'MODE))` |
| 8 | `{1,1}` | `{1,1}` |
| 9 | `{1,2}` | `{1,2}` |
| 10 | `{0,4}` | `{0,4}` |
| 11 | `'R'` | `'R'` |
| 12 | `'Z'` | `'Z'` |
| 13 | `{0,16}` | `{0,16}` |
| 14 | `IF({0,17}, {0,14}, {0,25})` | `IF({0,17}, {0,14}, {0,25})` |
| 15 | `IF({0,17}, {0,15}, {0,26})` | `IF({0,17}, {0,15}, {0,26})` |
| 16 | `{0,22}` | `{0,22}` |
| 17 | `Val({0,23}, '2')*60*60` | `Val({0,23}, '2')*60*60` |
| 18 | `Val({0,24}, '2')*60*60` | `Val({0,24}, '2')*60*60` |
| 19 | `{1,3}` | `{1,3}` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 3 (0 W / 3 R) |
| Parametres | 3 |
| Variables locales | 3 |
| Expressions | 20 |
| Expressions 100% decodees | 9 (45%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
