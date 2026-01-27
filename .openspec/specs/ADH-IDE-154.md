# ADH IDE 154 - Tableau recap fermeture

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_154.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 154 |
| **Fichier XML** | Prg_154.xml |
| **Description** | Tableau recap fermeture |
| **Type** | O (O=Online, B=Batch) |
| **Parametres** | 28 |
| **Module** | ADH |
| **Dossier IDE** | Gestion Caisse |

> **Note**: Ce programme est Prg_154.xml. L'ID XML (154) peut differer de la position IDE (154).

---

## 2. TABLES (24 tables - 2 en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #487 | `%club_user%_caisse_remise` | saisie_remise_en_caisse | **W** | 16x |
| #510 | `%club_user%_pv_disctmp_dat` | pv_discounts | **W** | 12x |
| #30 | `cafil008_dat` | gm-recherche_____gmr | R | 2x |
| #31 | `cafil009_dat` | gm-complet_______gmc | R | 6x |
| #44 | `cafil022_dat` | change___________chg | R | 4x |
| #50 | `cafil028_dat` | moyens_reglement_mor | R | 2x |
| #67 | `cafil045_dat` | tables___________tab | R | 6x |
| #70 | `cafil048_dat` | date_comptable___dat | R | 1x |
| #77 | `cafil055_dat` | articles_________art | R | 2x |
| #139 | `cafil117_dat` | moyens_reglement_mor | R | 2x |
| #147 | `cafil125_dat` | change_vente_____chg | R | 2x |
| #196 | `caisse_article` | gestion_article_session | R | 8x |
| #197 | `caisse_artstock` | articles_en_stock | R | 2x |
| #222 | `caisse_compcais_histo2` | comptage_caisse_histo | R | 4x |
| #232 | `caisse_devise` | gestion_devise_session | R | 8x |
| #247 | `caisse_session_article` | histo_sessions_caisse_article | R | 10x |
| #249 | `caisse_session_detail` | histo_sessions_caisse_detail | R | 9x |
| #251 | `caisse_session_remise` | histo_sessions_caisse_remise | R | 4x |
| #266 | `cccompta` | cc_comptable | R | 3x |
| #324 | `fraissurchange_dat` | frais_change___fchg | R | 6x |
| #463 | `verifpool_dat` | heure_de_passage | R | 3x |
| #474 | `%club_user%_caisse_compcais_devise` | comptage_caisse_devise | R | 2x |
| #505 | `%club_user%_pv_cafil18_dat` | pv_comptable | R | 4x |
| #693 | `devisein_par` | devise_in | R | 6x |

---

## 3. PARAMETRES D'ENTREE (28)

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
| P10 | P0 montant apport coffre final | NUMERIC | - |
| P11 | P0 montant remise monnaie final | NUMERIC | - |
| P12 | P0 montant ecart fermeture | NUMERIC | - |
| P13 | P0 reimpression D/G | ALPHA | - |
| P14 | P0 editer recap dans ecart | LOGICAL | - |
| P15 | P0 montant compte total | NUMERIC | - |
| P16 | P0 montant compte monnaie | NUMERIC | - |
| P17 | P0 montant compte produit | NUMERIC | - |
| P18 | P0 montant compte carte | NUMERIC | - |
| P19 | P0 montant compte cheque | NUMERIC | - |
| P20 | P0 montant compte od | NUMERIC | - |
| P21 | P0 nbre devises compte | NUMERIC | - |
| P22 | P0 montant calcule total | NUMERIC | - |

---

## 4. VARIABLES PRINCIPALES

### 4.1 Variables de travail (W0/V0)

| Ref | Nom | Type | Role |
|-----|-----|------|------|
| `{0,-39}` | W0 confirmation | LOGICAL | - |
| `{0,-38}` | W0 date comptable | DATE | - |
| `{0,-37}` | W0 change | NUMERIC | - |
| `{0,-36}` | W0 frais de change | NUMERIC | - |
| `{0,-35}` | W0 fin tache | ALPHA | - |
| `{0,-34}` | W0 Existe Carnet Bar | LOGICAL | - |
| `{0,-33}` | W0 Existe TAI | LOGICAL | - |
| `{0,-32}` | W0 titre | ALPHA | - |
| `{0,-31}` | W0 date debut session | DATE | - |
| `{0,-30}` | W0 heure debut session | TIME | - |

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

> Total: 196 variables mappees

---

## 5. EXPRESSIONS (751 total, 525 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `Date ()` | `Date ()` |
| 2 | `{32768,2}` | `VG.Retour Chariot` |
| 3 | `151` | `151` |
| 4 | `Trim ({0,37})` | `Trim (W0 date debut session)` |
| 5 | `'F'` | `'F'` |
| 6 | `{0,34}='F'` | `W0 Existe Carnet Bar='F'` |
| 7 | `'a'` | `'a'` |
| 8 | `GetParam ('CURRENTPRINTERNUM')=1` | `GetParam ('CURRENTPRINTERNUM')=1` |
| 9 | `GetParam ('CURRENTPRINTERNUM')=9` | `GetParam ('CURRENTPRINTERNUM')=9` |
| 10 | `35` | `35` |
| 11 | `'TRUE'LOG` | `'TRUE'LOG` |
| 12 | `IF ({0,13}='D','TRUE'LOG,'FALSE'LOG)` | `IF (P0 editer recap dans ecart='D','TRUE'LOG,'FALSE'LOG)` |
| 13 | `{0,13}<>''` | `P0 editer recap dans ecart<>''` |
| 1 | `{1,1}` | `{1,1}` |
| 2 | `{0,2}` | `P0 nom village` |
| 1 | `Counter (0)>=GetParam ('NUMBERCOPIES')` | `Counter (0)>=GetParam ('NUMBERCOPIES')` |
| 1 | `{2,35}` | `{2,35}` |
| 2 | `INIGet ('[MAGIC_LOGICAL_NAMES]preview')='O'` | `INIGet ('[MAGIC_LOGICAL_NAMES]preview')='O'` |
| 3 | `{2,7}='O' AND {2,36}` | `{2,7}='O' AND {2,36}` |
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

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 24 (2 W / 22 R) |
| Parametres | 28 |
| Variables locales | 39 |
| Expressions | 751 |
| Expressions 100% decodees | 525 (70%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
