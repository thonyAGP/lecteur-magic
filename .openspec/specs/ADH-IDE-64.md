# ADH IDE 64 - Solde Easy Check Out

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_64.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 64 |
| **Fichier XML** | Prg_64.xml |
| **Description** | Solde Easy Check Out |
| **Type** | B (O=Online, B=Batch) |
| **Parametres** | 5 |
| **Module** | ADH |
| **Dossier IDE** | Easy Check Out |

> **Note**: Ce programme est Prg_64.xml. L'ID XML (64) peut differer de la position IDE (64).

---

## 2. TABLES (22 tables - 14 en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #39 | `cafil017_dat` | depot_garantie___dga | **W** | 2x |
| #40 | `cafil018_dat` | comptable________cte | **W** | 3x |
| #47 | `cafil025_dat` | compte_gm________cgm | **W** | 2x |
| #48 | `cafil026_dat` | lignes_de_solde__sld | **W** | 1x |
| #53 | `cafil031_dat` | ligne_telephone__lgn | **W** | 1x |
| #68 | `cafil046_dat` | compteurs________cpt | **W** | 4x |
| #75 | `cafil053_dat` | commande_autocom_cot | **W** | 1x |
| #80 | `cafil058_dat` | codes_autocom____aut | **W** | 2x |
| #87 | `cafil065_dat` | sda_telephone____sda | **W** | 4x |
| #136 | `cafil114_dat` | fichier_echanges | **W** | 2x |
| #151 | `cafil129_dat` | nb_code__poste | **W** | 2x |
| #312 | `ezcard` | ez_card | **W** | 1x |
| #911 | `log_booker` | log_booker | **W** | 1x |
| #934 | `selection_enregistrement_div` | selection enregistrement diver | **W** | 1x |
| #30 | `cafil008_dat` | gm-recherche_____gmr | R | 2x |
| #31 | `cafil009_dat` | gm-complet_______gmc | R | 1x |
| #66 | `cafil044_dat` | imputations______imp | R | 2x |
| #69 | `cafil047_dat` | initialisation___ini | R | 1x |
| #70 | `cafil048_dat` | date_comptable___dat | R | 1x |
| #78 | `cafil056_dat` | param__telephone_tel | R | 2x |
| #91 | `cafil069_dat` | garantie_________gar | R | 1x |
| #285 | `email` | email | R | 1x |

---

## 3. PARAMETRES D'ENTREE (5)

| # | Nom | Type | Description |
|---|-----|------|-------------|

---

## 4. VARIABLES PRINCIPALES

### 4.1 Variables de travail (W0/V0)

| Ref | Nom | Type | Role |
|-----|-----|------|------|
| `{0,-117}` | v.Transaction Validée | LOGICAL | - |
| `{0,-116}` | v.Message Erreur | ALPHA | - |
| `{0,-115}` | v.Id_Dossier_Pms | ALPHA | - |
| `{0,-114}` | v.Date_Solde | DATE | - |
| `{0,-113}` | v.Heure-Solde | TIME | - |
| `{0,-111}` | v.NomFact_PDF_OD | ALPHA | - |
| `{0,-100}` | v.NomFact_PDF_Autres | ALPHA | - |
| `{0,-110}` | v.Ligne_Solde | LOGICAL | - |
| `{0,-109}` | v.MajExtrait | LOGICAL | - |
| `{0,-108}` | v.MajCompte | LOGICAL | - |
| `{0,-107}` | v.MajTel | NUMERIC | - |
| `{0,-106}` | v.NbCard | NUMERIC | - |
| `{0,-105}` | v.Fact | LOGICAL | - |
| `{0,-103}` | v.Evoi_mail | LOGICAL | - |
| `{0,-102}` | v.Num dossier Axis | ALPHA | - |
| `{0,-86}` | v.Num Autorisation | ALPHA | - |
| `{0,-101}` | v.MOP | ALPHA | - |
| `{0,-93}` | v.Solde du compte | NUMERIC | - |
| `{0,-99}` | v.MailAtachedFiles | ALPHA | - |
| `{0,-94}` | v.NomFichierPDF | ALPHA | - |

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

## 5. EXPRESSIONS (262 total, 159 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `{0,6}` | `v.Message Erreur` |
| 2 | `{0,7}` | `v.Id_Dossier_Pms` |
| 3 | `{0,8}` | `v.Date_Solde` |
| 4 | `{0,40}` | `{0,40}` |
| 5 | `Trim({0,11})&Trim({0,12})<>''` | `Trim(v.NomFact_PDF_Autres)&Trim(v.Ligne_Solde)<>''` |
| 6 | `'00/00/0000'DATE` | `'00/00/0000'DATE` |
| 7 | `{0,1}` | `P.i.Clause Where` |
| 8 | `({32768,43} OR {32768,94}) AND NOT({0,5})` | `(VG.VG_TPE_V2.00 OR VG.Gestion Garantie API CM) AND NOT(v...` |
| 9 | `{0,5}` | `v.Transaction Validée` |
| 10 | `({32768,43} OR {32768,94}) AND {0,56}<0` | `(VG.VG_TPE_V2.00 OR VG.Gestion Garantie API CM) AND {0,56}<0` |
| 43 | `{32768,23}` | `VG.PROJ.INTERF.TPE ACTIF` |
| 44 | `{32768,94} AND NOT({32768,23})` | `VG.Gestion Garantie API CM AND NOT(VG.PROJ.INTERF.TPE ACTIF)` |
| 13 | `'S'` | `'S'` |
| 14 | `IF(Trim({0,12})<>'','A'&Trim({0,12}),{0,11})` | `IF(Trim(v.Ligne_Solde)<>'','A'&Trim(v.Ligne_Solde),v.NomF...` |
| 15 | `Date()` | `Date()` |
| 16 | `Time()` | `Time()` |
| 17 | `Trim({0,36})<>'' AND Trim({0,57})<>''` | `Trim({0,36})<>'' AND Trim({0,57})<>''` |
| 18 | `'TRUE'LOG` | `'TRUE'LOG` |
| 19 | `'I'` | `'I'` |
| 20 | `{0,3}` | `P.i.Num Compte Test` |
| 21 | `INIPut('EmbedFonts=N','FALSE'LOG)` | `INIPut('EmbedFonts=N','FALSE'LOG)` |
| 22 | `INIPut('CompressPDF=N','FALSE'LOG)` | `INIPut('CompressPDF=N','FALSE'LOG)` |
| 23 | `{32768,76} AND NOT {0,3}` | `VG.VG Edit Extrait Co V1.00 AND NOT P.i.Num Compte Test` |
| 24 | `IF({0,3},'TRUE'LOG,'FALSE'LOG)` | `IF(P.i.Num Compte Test,'TRUE'LOG,'FALSE'LOG)` |
| 25 | `IF({0,3},Translate('%club_exportdata%')&'Easy_Check_Out\'...` | `IF(P.i.Num Compte Test,Translate('%club_exportdata%')&'Ea...` |
| 26 | `'EXTCOMPTE_'&DStr(Date(),'YYYYMMDD')&'_'&TStr(Time(),'HHM...` | `'EXTCOMPTE_'&DStr(Date(),'YYYYMMDD')&'_'&TStr(Time(),'HHM...` |
| 27 | `IF({0,3},'E','P')` | `IF(P.i.Num Compte Test,'E','P')` |
| 28 | `'TRUE'LOG` | `'TRUE'LOG` |
| 29 | `IF({0,3},Trim({0,58}),'')` | `IF(P.i.Num Compte Test,Trim({0,58}),'')` |
| 30 | `IF({0,3},'EditionPDF','')` | `IF(P.i.Num Compte Test,'EditionPDF','')` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 22 (14 W / 8 R) |
| Parametres | 5 |
| Variables locales | 27 |
| Expressions | 262 |
| Expressions 100% decodees | 159 (61%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
