# ADH IDE 168 - Gratuités

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_167.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 168 |
| **Fichier XML** | Prg_167.xml |
| **Description** | Gratuités |
| **Type** | B (O=Online, B=Batch) |
| **Parametres** | 3 |
| **Module** | ADH |
| **Dossier IDE** | Operations GM |

> **Note**: Ce programme est Prg_167.xml. L'ID XML (167) peut differer de la position IDE (168).

---

## 2. TABLES (2 tables - 2 en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #30 | `cafil008_dat` | gm-recherche_____gmr | **W** | 2x |
| #79 | `cafil057_dat` | gratuites________gra | **W** | 5x |

---

## 3. PARAMETRES D'ENTREE (3)

| # | Nom | Type | Description |
|---|-----|------|-------------|
| P1 | >societe | ALPHA | - |
| P2 | > code GM | NUMERIC | - |
| P3 | > filiation | NUMERIC | - |
| P4 | W0 scroll vide GRA | ALPHA | - |
| P5 | W0 fin tache | ALPHA | - |
| P6 | V. titre | ALPHA | - |

---

## 4. VARIABLES PRINCIPALES

### 4.1 Variables de travail (W0/V0)

| Ref | Nom | Type | Role |
|-----|-----|------|------|
| `{0,-108}` | W0 scroll vide GRA | ALPHA | - |
| `{0,-107}` | W0 fin tache | ALPHA | - |
| `{0,-106}` | V. titre | ALPHA | - |

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

## 5. EXPRESSIONS (74 total, 38 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `{0,1}=''` | `> code GM=''` |
| 2 | `'C'` | `'C'` |
| 3 | `Trim ({0,6})` | `Trim ({0,6})` |
| 4 | `18` | `18` |
| 5 | `{0,5}='F'` | `V. titre='F'` |
| 6 | `{0,4}='O'` | `W0 fin tache='O'` |
| 1 | `Trim ({1,6})` | `Trim ({1,6})` |
| 2 | `Date ()` | `Date ()` |
| 3 | `{32768,2}` | `VG.Retour Chariot` |
| 4 | `{0,10}=6` | `{0,10}=6` |
| 5 | `{1,1}` | `{1,1}` |
| 6 | `{1,2}` | `{1,2}` |
| 7 | `{1,3}` | `{1,3}` |
| 8 | `Stat (0,'C')` | `Stat (0,'C')` |
| 9 | `{0,9}='C'` | `{0,9}='C'` |
| 10 | `{0,9}='A'` | `{0,9}='A'` |
| 11 | `{0,9}='A' OR {0,9}='C'` | `{0,9}='A' OR {0,9}='C'` |
| 12 | `''` | `''` |
| 13 | `'O'` | `'O'` |
| 14 | `Stat (0,'C'MODE)` | `Stat (0,'C'MODE)` |
| 15 | `'F'` | `'F'` |
| 16 | `NOT(Stat(0,'M'MODE))` | `NOT(Stat(0,'M'MODE))` |
| 1 | `{0,1}=0 AND {0,2}=0` | `> code GM=0 AND > filiation=0` |
| 2 | `{0,4}=''` | `W0 fin tache=''` |
| 3 | `{0,1}<>0 AND {0,4}<>''` | `> code GM<>0 AND W0 fin tache<>''` |
| 4 | `{0,5}='V'` | `V. titre='V'` |
| 5 | `'V'` | `'V'` |
| 1 | `{3,1}` | `{3,1}` |
| 2 | `{3,2}` | `{3,2}` |
| 3 | `{3,3}` | `{3,3}` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 2 (2 W / 0 R) |
| Parametres | 3 |
| Variables locales | 6 |
| Expressions | 74 |
| Expressions 100% decodees | 38 (51%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
