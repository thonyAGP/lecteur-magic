# ADH IDE 40 - Comptes de depôt

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_40.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 40 |
| **Fichier XML** | Prg_40.xml |
| **Description** | Comptes de depôt |
| **Type** | B (O=Online, B=Batch) |
| **Parametres** | 8 |
| **Module** | ADH |
| **Dossier IDE** | Depot |

> **Note**: Ce programme est Prg_40.xml. L'ID XML (40) peut differer de la position IDE (40).

---

## 2. TABLES (8 tables - 6 en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #41 | `cafil019_dat` | depot_objets_____doa | **W** | 5x |
| #42 | `cafil020_dat` | depot_devises____dda | **W** | 2x |
| #43 | `cafil021_dat` | solde_devises____sda | **W** | 4x |
| #47 | `cafil025_dat` | compte_gm________cgm | **W** | 2x |
| #367 | `pmsprintparamdefault` | pms_print_param_default | **W** | 1x |
| #456 | `taistart` | tai_demarrage | **W** | 3x |
| #50 | `cafil028_dat` | moyens_reglement_mor | R | 1x |
| #67 | `cafil045_dat` | tables___________tab | R | 1x |

---

## 3. PARAMETRES D'ENTREE (8)

| # | Nom | Type | Description |
|---|-----|------|-------------|
| P1 | > societe | ALPHA | - |
| P2 | > code adherent | NUMERIC | - |
| P3 | > filiation | NUMERIC | - |
| P4 | > devise locale | ALPHA | - |
| P5 | > nb decimale | NUMERIC | - |
| P6 | > masque montant | ALPHA | - |
| P7 | > nom village | ALPHA | - |
| P8 | > change uni/bi ? | ALPHA | - |
| P9 | W0 reseau | ALPHA | - |
| P10 | W0 fin de tache | ALPHA | - |

---

## 4. VARIABLES PRINCIPALES

### 4.1 Variables de travail (W0/V0)

| Ref | Nom | Type | Role |
|-----|-----|------|------|
| `{0,-99}` | W0 reseau | ALPHA | - |
| `{0,-98}` | W0 fin de tache | ALPHA | - |

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

> Total: 138 variables mappees

---

## 5. EXPRESSIONS (237 total, 136 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `{0,9}<>'R'` | `W0 fin de tache<>'R'` |
| 2 | `'F'` | `'F'` |
| 3 | `{0,10}='F'` | `{0,10}='F'` |
| 4 | `'C'` | `'C'` |
| 5 | `{0,1}=''` | `> code adherent=''` |
| 1 | `{1,1}` | `{1,1}` |
| 2 | `{1,2}` | `{1,2}` |
| 3 | `{0,3}` | `> devise locale` |
| 4 | `{1,9}='R'` | `{1,9}='R'` |
| 5 | `{1,9}<>'R'` | `{1,9}<>'R'` |
| 6 | `'R'` | `'R'` |
| 1 | `Trim ({0,18})` | `Trim ({0,18})` |
| 2 | `10` | `10` |
| 3 | `'&Quitter'` | `'&Quitter'` |
| 4 | `'I'` | `'I'` |
| 5 | `{0,1}='S'` | `> code adherent='S'` |
| 6 | `InStr ('SO',{0,1})>0` | `InStr ('SO',> code adherent)>0` |
| 7 | `InStr ('SD',{0,1})>0` | `InStr ('SD',> code adherent)>0` |
| 8 | `{0,1}='D' AND {0,7}='O'` | `> code adherent='D' AND > change uni/bi ?='O'` |
| 9 | `{0,1}='O' AND {0,7}='O'` | `> code adherent='O' AND > change uni/bi ?='O'` |
| 10 | `{0,3}='OD'` | `> devise locale='OD'` |
| 11 | `{0,3}='DD' OR {0,3}='DP'` | `> devise locale='DD' OR > devise locale='DP'` |
| 12 | `Left ({0,3},1)='D'` | `Left (> devise locale,1)='D'` |
| 13 | `{0,3}='DD' OR {0,3}='DP'` | `> devise locale='DD' OR > devise locale='DP'` |
| 14 | `{0,3}='DT'` | `> devise locale='DT'` |
| 15 | `InStr ('AI',{0,2})>0` | `InStr ('AI',> filiation)>0` |
| 16 | `{0,2}=''` | `> filiation=''` |
| 17 | `Date ()` | `Date ()` |
| 18 | `Time ()` | `Time ()` |
| 19 | `{32768,1}` | `VG.USER` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 8 (6 W / 2 R) |
| Parametres | 8 |
| Variables locales | 10 |
| Expressions | 237 |
| Expressions 100% decodees | 136 (57%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
