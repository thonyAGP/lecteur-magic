# ADH IDE 137 - Ticket ouverture session

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_137.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 137 |
| **Fichier XML** | Prg_137.xml |
| **Description** | Ticket ouverture session |
| **Type** | B (O=Online, B=Batch) |
| **Parametres** | 9 |
| **Module** | ADH |
| **Dossier IDE** | Gestion Caisse |

> **Note**: Ce programme est Prg_137.xml. L'ID XML (137) peut differer de la position IDE (137).

---

## 2. TABLES (8 tables - 0 en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #30 | `cafil008_dat` | gm-recherche_____gmr | R | 2x |
| #70 | `cafil048_dat` | date_comptable___dat | R | 1x |
| #249 | `caisse_session_detail` | histo_sessions_caisse_detail | R | 1x |
| #266 | `cccompta` | cc_comptable | R | 3x |
| #463 | `verifpool_dat` | heure_de_passage | R | 3x |
| #511 | `%club_user%_pv_display` | pv_invoicedisplaytmp | R | 2x |
| #513 | `%club_user%_pv_filiations` | pv_invoiceprintfiliationtmp | R | 4x |
| #693 | `devisein_par` | devise_in | R | 6x |

---

## 3. PARAMETRES D'ENTREE (9)

| # | Nom | Type | Description |
|---|-----|------|-------------|
| P1 | P0 societe | ALPHA | - |
| P2 | P0 nbre decimales | NUMERIC | - |
| P3 | P0 nom village | ALPHA | - |
| P4 | P0 masque cumul | ALPHA | - |
| P5 | P0 devise locale | ALPHA | - |
| P6 | P0 Uni/Bilateral | ALPHA | - |
| P7 | P0 village TAI | ALPHA | - |
| P8 | P0 date comptable | DATE | - |
| P9 | P0 session | NUMERIC | - |
| P10 | Edition detaillee | LOGICAL | - |
| P11 | W0 caisse depart | NUMERIC | - |
| P12 | W0 apport coffre | NUMERIC | - |
| P13 | W0 pièce caisse Rec | NUMERIC | - |
| P14 | W0 pièce caisse Dep | NUMERIC | - |
| P15 | W0 date comptable | DATE | - |
| P16 | W0 versement | NUMERIC | - |
| P17 | W0 retrait | NUMERIC | - |
| P18 | W0 solde cash | NUMERIC | - |
| P19 | W0 solde carte | NUMERIC | - |
| P20 | W0 change | NUMERIC | - |
| P21 | W0 frais de change | NUMERIC | - |
| P22 | W0 fin tache | ALPHA | - |

---

## 4. VARIABLES PRINCIPALES

### 4.1 Variables de travail (W0/V0)

| Ref | Nom | Type | Role |
|-----|-----|------|------|
| `{0,-78}` | W0 caisse depart | NUMERIC | - |
| `{0,-77}` | W0 apport coffre | NUMERIC | - |
| `{0,-76}` | W0 pièce caisse Rec | NUMERIC | - |
| `{0,-75}` | W0 pièce caisse Dep | NUMERIC | - |
| `{0,-72}` | W0 date comptable | DATE | - |
| `{0,-71}` | W0 versement | NUMERIC | - |
| `{0,-70}` | W0 retrait | NUMERIC | - |
| `{0,-69}` | W0 solde cash | NUMERIC | - |
| `{0,-68}` | W0 solde carte | NUMERIC | - |
| `{0,-67}` | W0 change | NUMERIC | - |
| `{0,-66}` | W0 frais de change | NUMERIC | - |
| `{0,-65}` | W0 fin tache | ALPHA | - |
| `{0,-64}` | W0 Existe Carnet Bar | LOGICAL | - |
| `{0,-63}` | W0 Existe TAI | LOGICAL | - |
| `{0,-62}` | W0 titre | ALPHA | - |
| `{0,-61}` | W0 date debut session | DATE | - |
| `{0,-60}` | W0 heure debut session | TIME | - |

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

> Total: 172 variables mappees

---

## 5. EXPRESSIONS (210 total, 178 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `Date ()` | `Date ()` |
| 2 | `{32768,2}` | `VG.Retour Chariot` |
| 3 | `152` | `152` |
| 4 | `Trim ({0,25})` | `Trim (W0 date debut session)` |
| 5 | `'F'` | `'F'` |
| 6 | `{0,22}='F'` | `W0 Existe Carnet Bar='F'` |
| 7 | `GetParam ('CURRENTPRINTERNUM')=1` | `GetParam ('CURRENTPRINTERNUM')=1` |
| 8 | `GetParam ('CURRENTPRINTERNUM')=9` | `GetParam ('CURRENTPRINTERNUM')=9` |
| 9 | `35` | `35` |
| 10 | `'TRUE'LOG` | `'TRUE'LOG` |
| 1 | `{1,1}` | `{1,1}` |
| 2 | `{0,2}` | `P0 nom village` |
| 1 | `Counter (0)>=GetParam ('NUMBERCOPIES')` | `Counter (0)>=GetParam ('NUMBERCOPIES')` |
| 1 | `{2,6}<>'B'` | `{2,6}<>'B'` |
| 2 | `{2,6}='B'` | `{2,6}='B'` |
| 3 | `INIGet ('[MAGIC_LOGICAL_NAMES]preview')='O'` | `INIGet ('[MAGIC_LOGICAL_NAMES]preview')='O'` |
| 1 | `{32768,44}` | `VG.VG_FAX_VISIBLE` |
| 2 | `GetParam ('VI_CLUB')` | `GetParam ('VI_CLUB')` |
| 3 | `GetParam ('VI_NAME')` | `GetParam ('VI_NAME')` |
| 4 | `GetParam ('VI_ADR1')` | `GetParam ('VI_ADR1')` |
| 5 | `GetParam ('VI_ADR2')` | `GetParam ('VI_ADR2')` |
| 6 | `GetParam ('VI_ZIPC')` | `GetParam ('VI_ZIPC')` |
| 7 | `GetParam ('VI_PHON')` | `GetParam ('VI_PHON')` |
| 8 | `GetParam ('VI_FAXN')` | `GetParam ('VI_FAXN')` |
| 9 | `GetParam ('VI_MAIL')` | `GetParam ('VI_MAIL')` |
| 10 | `GetParam ('VI_SIRE')` | `GetParam ('VI_SIRE')` |
| 11 | `GetParam ('VI_VATN')` | `GetParam ('VI_VATN')` |
| 12 | `Date ()` | `Date ()` |
| 13 | `Time ()` | `Time ()` |
| 14 | `{32768,2}` | `VG.Retour Chariot` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 8 (0 W / 8 R) |
| Parametres | 9 |
| Variables locales | 27 |
| Expressions | 210 |
| Expressions 100% decodees | 178 (85%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
