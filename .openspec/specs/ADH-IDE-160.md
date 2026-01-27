# ADH IDE 160 - Liste des GM

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_159.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 160 |
| **Fichier XML** | Prg_159.xml |
| **Description** | Liste des GM |
| **Type** | O (O=Online, B=Batch) |
| **Parametres** | 2 |
| **Module** | ADH |
| **Dossier IDE** | Identification |

> **Note**: Ce programme est Prg_159.xml. L'ID XML (159) peut differer de la position IDE (160).

---

## 2. TABLES (5 tables - 2 en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #312 | `ezcard` | ez_card | **W** | 2x |
| #612 | `%club_user%tmp_prex_dat` | tempo_present_excel | **W** | 1x |
| #30 | `cafil008_dat` | gm-recherche_____gmr | R | 1x |
| #47 | `cafil025_dat` | compte_gm________cgm | R | 1x |
| #844 | `%club_user%_stat_vendeur` | stat_vendeur | R | 1x |

---

## 3. PARAMETRES D'ENTREE (2)

| # | Nom | Type | Description |
|---|-----|------|-------------|

---

## 4. VARIABLES PRINCIPALES

### 4.1 Variables de travail (W0/V0)

| Ref | Nom | Type | Role |
|-----|-----|------|------|
| `{0,-94}` | v.num cmp | UNICODE | - |
| `{0,-93}` | v.retour carte deja attribuee | LOGICAL | - |
| `{0,-86}` | v.variable change en cours | LOGICAL | - |
| `{0,-85}` | v.last good row | NUMERIC | - |

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

## 5. EXPRESSIONS (37 total, 12 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `{0,9}<>'---' AND Trim({0,6})<>''` | `{0,9}<>'---' AND Trim(retour confirmation)<>''` |
| 2 | `{0,9}='---' OR Trim({0,6})=''` | `{0,9}='---' OR Trim(retour confirmation)=''` |
| 3 | `{0,1}` | `v.retour carte deja attribuee` |
| 4 | `Val(MID({0,8},3,10),'10')` | `Val(MID({0,8},3,10),'10')` |
| 5 | `Val(Left({0,8},2),'2')` | `Val(Left({0,8},2),'2')` |
| 6 | `{0,29}` | `{0,29}` |
| 7 | `CallProg('{160,-1}'PROG,{0,25},{0,29},{0,30})` | `CallProg('{160,-1}'PROG,{0,25},{0,29},{0,30})` |
| 8 | `{0,34}` | `{0,34}` |
| 9 | `{0,33}='O'` | `{0,33}='O'` |
| 10 | `Trim({0,34})<>''` | `Trim({0,34})<>''` |
| 11 | `{0,35} AND ({0,37}*1000+{0,38}<>{0,29}*1000+{0,30} OR {0,...` | `{0,35} AND ({0,37}*1000+{0,38}<>{0,29}*1000+{0,30} OR {0,...` |
| 12 | `{0,46}` | `{0,46}` |
| 13 | `Trim({0,46})<>'' AND Trim({0,46})<>Trim({0,34})` | `Trim({0,46})<>'' AND Trim({0,46})<>Trim({0,34})` |
| 14 | `1` | `1` |
| 15 | `Trim({0,46})='' AND Trim({0,34})<>''` | `Trim({0,46})='' AND Trim({0,34})<>''` |
| 16 | `{0,47}=1` | `{0,47}=1` |
| 17 | `{0,47}<>1` | `{0,47}<>1` |
| 18 | `{32768,11}` | `VG.CODE LANGUE USER` |
| 19 | `{0,21}` | `{0,21}` |
| 20 | `Str({0,47},'#')` | `Str({0,47},'#')` |
| 21 | `'TRUE'LOG` | `'TRUE'LOG` |
| 22 | `'FALSE'LOG` | `'FALSE'LOG` |
| 23 | `NOT({0,43})` | `NOT({0,43})` |
| 24 | `IF(Trim({0,46})<>'' AND Trim({0,46})<>Trim({0,34}) AND {0...` | `IF(Trim({0,46})<>'' AND Trim({0,46})<>Trim({0,34}) AND {0...` |
| 25 | `CtrlGoto('card_code',IF(CurRow(0)>{0,44},CurRow(0)+1,CurR...` | `CtrlGoto('card_code',IF(CurRow(0)>{0,44},CurRow(0)+1,CurR...` |
| 26 | `CurRow(0)` | `CurRow(0)` |
| 1 | `{1,25}` | `{1,25}` |
| 2 | `{1,29}` | `{1,29}` |
| 3 | `{1,30}` | `{1,30}` |
| 4 | `{1,34}` | `{1,34}` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 5 (2 W / 3 R) |
| Parametres | 2 |
| Variables locales | 7 |
| Expressions | 37 |
| Expressions 100% decodees | 12 (32%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
