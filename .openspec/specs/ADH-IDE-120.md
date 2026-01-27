# ADH IDE 120 - Saisie contenu caisse

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_120.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 120 |
| **Fichier XML** | Prg_120.xml |
| **Description** | Saisie contenu caisse |
| **Type** | B (O=Online, B=Batch) |
| **Parametres** | 17 |
| **Module** | ADH |
| **Dossier IDE** | Gestion Caisse |

> **Note**: Ce programme est Prg_120.xml. L'ID XML (120) peut differer de la position IDE (120).

---

## 2. TABLES (27 tables - 5 en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #232 | `caisse_devise` | gestion_devise_session | **W** | 2x |
| #491 | `%club_user%_caisse_solde_par_mop` | soldes_par_mop | **W** | 22x |
| #492 | `caisse_tabrecap` | edition_tableau_recap | **W** | 16x |
| #493 | `%club_user%_caisse_ticket` | edition_ticket | **W** | 23x |
| #501 | `%club_user%_email_reprise` | email_reprise | **W** | 4x |
| #40 | `cafil018_dat` | comptable________cte | R | 3x |
| #50 | `cafil028_dat` | moyens_reglement_mor | R | 1x |
| #67 | `cafil045_dat` | tables___________tab | R | 1x |
| #70 | `cafil048_dat` | date_comptable___dat | R | 1x |
| #77 | `cafil055_dat` | articles_________art | R | 2x |
| #89 | `cafil067_dat` | moyen_paiement___mop | R | 8x |
| #90 | `cafil068_dat` | devises__________dev | R | 1x |
| #139 | `cafil117_dat` | moyens_reglement_mor | R | 1x |
| #140 | `cafil118_dat` | moyen_paiement___mop | R | 2x |
| #141 | `cafil119_dat` | devises__________dev | R | 1x |
| #197 | `caisse_artstock` | articles_en_stock | R | 1x |
| #198 | `caisse_banknote` | coupures_monnaie_locale | R | 1x |
| #199 | `caisse_caissstd_montant` | fond_de_caisse_std_montant | R | 1x |
| #200 | `caisse_caisstd` | fond_de_caisse_std | R | 2x |
| #219 | `caisse_com_ims` | communication_ims | R | 1x |
| #220 | `caisse_compcais_devise_histo` | comptage_caisse_devise_histo | R | 1x |
| #222 | `caisse_compcais_histo2` | comptage_caisse_histo | R | 10x |
| #223 | `caisse_compcais_montant_histo` | comptage_caisse_montant_histo | R | 1x |
| #246 | `caisse_session` | histo_sessions_caisse | R | 2x |
| #249 | `caisse_session_detail` | histo_sessions_caisse_detail | R | 2x |
| #263 | `caisse_vente` | vente | R | 3x |
| #372 | `pv_budget_dat` | pv_budget | R | 1x |

---

## 3. PARAMETRES D'ENTREE (17)

| # | Nom | Type | Description |
|---|-----|------|-------------|
| P1 | Param societe | ALPHA | - |
| P2 | Param devise locale | ALPHA | - |
| P3 | Param masque montant | ALPHA | - |
| P4 | Param quand | ALPHA | - |
| P5 | Param chrono session | NUMERIC | - |
| P6 | Param chrono histo | NUMERIC | - |
| P7 | Param date validation | DATE | - |
| P8 | Param time validation | TIME | - |
| P9 | Param Total caisse | NUMERIC | - |
| P10 | Param Total caisse monnaie | NUMERIC | - |
| P11 | Param Total caisse produits | NUMERIC | - |
| P12 | Param Total caisse cartes | NUMERIC | - |
| P13 | Param Total caisse cheque | NUMERIC | - |
| P14 | Param Total caisse od | NUMERIC | - |
| P15 | Param Nbre devise | NUMERIC | - |
| P16 | Param UNI/BI | ALPHA | - |
| P17 | SortieSaisieCaisse | LOGICAL | - |
| P18 | TotalCaisse | NUMERIC | - |
| P19 | TotalMonnaie | NUMERIC | - |
| P20 | RecuperationPrecedent | LOGICAL | - |
| P21 | RecuperationStandard | LOGICAL | - |
| P22 | Faire Raz | LOGICAL | - |

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

> Total: 186 variables mappees

---

## 5. EXPRESSIONS (528 total, 360 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `{0,18}` | `TotalCaisse` |
| 2 | `{0,21}` | `RecuperationStandard` |
| 3 | `{0,22}` | `Faire Raz` |
| 4 | `{0,19}` | `TotalMonnaie` |
| 5 | `{0,19}<>0 OR {0,15}<>0 OR {0,31}='O'` | `TotalMonnaie<>0 OR Param UNI/BI<>0 OR Date_Debut_Session='O'` |
| 6 | `{0,29}` | `Recup precedent possible` |
| 7 | `'TRUE'LOG` | `'TRUE'LOG` |
| 8 | `{0,30}` | `FROM_IMS` |
| 9 | `{0,23}` | `Ordre cigarettes` |
| 10 | `0` | `0` |
| 11 | `'FALSE'LOG` | `'FALSE'LOG` |
| 1 | `0` | `0` |
| 1 | `{0,1}` | `Param devise locale` |
| 2 | `IF ({0,2},'BIL',IF ({0,3},'PIE',''))` | `IF (Param masque montant,'BIL',IF (Param quand,'PIE',''))` |
| 3 | `IF ({0,2},MlsTrans ('Billets'),IF ({0,3},MlsTrans ('Pièce...` | `IF (Param masque montant,MlsTrans ('Billets'),IF (Param q...` |
| 4 | `{0,4}` | `Param chrono session` |
| 5 | `146` | `146` |
| 6 | `148` | `148` |
| 7 | `{0,6}='BIL'` | `Param date validation='BIL'` |
| 8 | `{0,6}='PIE'` | `Param date validation='PIE'` |
| 1 | `{0,1}+1` | `Param devise locale+1` |
| 2 | `{0,1}+2` | `Param devise locale+2` |
| 3 | `'CAR'` | `'CAR'` |
| 4 | `'CHE'` | `'CHE'` |
| 5 | `MlsTrans ('CARTES BANCAIRES')` | `MlsTrans ('CARTES BANCAIRES')` |
| 6 | `MlsTrans ('CHEQUES')` | `MlsTrans ('CHEQUES')` |
| 7 | `146` | `146` |
| 8 | `'Zoom'` | `'Zoom'` |
| 9 | `{0,4}` | `Param chrono session` |
| 10 | `{0,9}` | `Param Total caisse monnaie` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 27 (5 W / 22 R) |
| Parametres | 17 |
| Variables locales | 34 |
| Expressions | 528 |
| Expressions 100% decodees | 360 (68%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
