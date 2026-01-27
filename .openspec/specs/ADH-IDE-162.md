# ADH IDE 162 - Selection filiations

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_161.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 162 |
| **Fichier XML** | Prg_161.xml |
| **Description** | Selection filiations |
| **Type** | O (O=Online, B=Batch) |
| **Parametres** | 7 |
| **Module** | ADH |
| **Dossier IDE** | Menus |

> **Note**: Ce programme est Prg_161.xml. L'ID XML (161) peut differer de la position IDE (162).

---

## 2. TABLES (2 tables -  en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #1047 | `Table_1047` | Unknown | **W** | 2x |
| #30 | `cafil008_dat` | gm-recherche_____gmr | R | 1x |

---

## 3. PARAMETRES D'ENTREE (7)

| # | Nom | Type | Description |
|---|-----|------|-------------|
| P1 | CHG_PRV_Selectionne | LOGICAL | - |

---

## 4. VARIABLES PRINCIPALES

### 4.1 Variables de travail (W0/V0)

| Ref | Nom | Type | Role |
|-----|-----|------|------|
| `{0,-78}` | v.nom & prenom | ALPHA | - |
| `{0,-75}` | v.nombre original | NUMERIC | - |

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

> Total: 136 variables mappees

---

## 5. EXPRESSIONS (20 total, 14 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `{0,1}` | `P.i.Compte` |
| 2 | `{0,2}` | `P.i.Filiation` |
| 3 | `Trim ({0,9})&' '&{0,10}` | `Trim ({0,9})&' '&{0,10}` |
| 4 | `IF ({0,13}>0,Str ({0,13},'###')&' ans',IF ({0,14}=0,'',St...` | `IF ({0,13}>0,Str ({0,13},'###')&' ans',IF ({0,14}=0,'',St...` |
| 5 | `'Sélection filiations pour le compte '&Str({0,2},'8P0')` | `'Sélection filiations pour le compte '&Str(P.i.Filiation,...` |
| 6 | `Str({0,2},'8P0')&' / '&Str({0,8},'3L')` | `Str(P.i.Filiation,'8P0')&' / '&Str(CHG_PRV_Selectionne,'3L')` |
| 7 | `'FILIATION'` | `'FILIATION'` |
| 8 | `Str({0,8},'3P0')` | `Str(CHG_PRV_Selectionne,'3P0')` |
| 9 | `IF({0,4}<>'',{0,4},'Veuillez sélectionner les filiations ...` | `IF(P.i.o.Nombre filiations cochées<>'',P.i.o.Nombre filia...` |
| 10 | `0` | `0` |
| 11 | `{0,5}+1` | `v.nom & prenom+1` |
| 12 | `{0,5}-1` | `v.nom & prenom-1` |
| 13 | `{0,17}` | `{0,17}` |
| 14 | `NOT {0,17}` | `NOT {0,17}` |
| 15 | `{0,5}` | `v.nom & prenom` |
| 16 | `{0,5}<>{0,18}` | `v.nom & prenom<>{0,18}` |
| 1 | `'FILIATION'` | `'FILIATION'` |
| 2 | `Str({1,3},'3P0')` | `Str({1,3},'3P0')` |
| 3 | `'TRUE'LOG` | `'TRUE'LOG` |
| 4 | `1` | `1` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 2 ( W /  R) |
| Parametres | 7 |
| Variables locales | 9 |
| Expressions | 20 |
| Expressions 100% decodees | 14 (70%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
