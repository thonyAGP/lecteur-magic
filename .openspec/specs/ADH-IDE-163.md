# ADH IDE 163 - Menu caisse GM - scroll

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_162.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 163 |
| **Fichier XML** | Prg_162.xml |
| **Description** | Menu caisse GM - scroll |
| **Type** | B (O=Online, B=Batch) |
| **Parametres** | 0 |
| **Module** | ADH |
| **Dossier IDE** | Menus |

> **Note**: Ce programme est Prg_162.xml. L'ID XML (162) peut differer de la position IDE (163).

---

## 2. TABLES (41 tables - 8 en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #23 | `cafil001_dat` | reseau_cloture___rec | **W** | 2x |
| #30 | `cafil008_dat` | gm-recherche_____gmr | **W** | 7x |
| #31 | `cafil009_dat` | gm-complet_______gmc | **W** | 4x |
| #47 | `cafil025_dat` | compte_gm________cgm | **W** | 5x |
| #285 | `email` | email | **W** | 2x |
| #340 | `histo_fus_sep` | histo_fusionseparation | **W** | 4x |
| #876 | `log_express_co` | log_express_co | **W** | 2x |
| #911 | `log_booker` | log_booker | **W** | 1x |
| #29 | `cafil007_dat` | voyages__________voy | R | 1x |
| #34 | `cafil012_dat` | hebergement______heb | R | 2x |
| #36 | `cafil014_dat` | client_gm | R | 1x |
| #39 | `cafil017_dat` | depot_garantie___dga | R | 3x |
| #40 | `cafil018_dat` | comptable________cte | R | 3x |
| #41 | `cafil019_dat` | depot_objets_____doa | R | 1x |
| #43 | `cafil021_dat` | solde_devises____sda | R | 1x |
| #63 | `cafil041_dat` | parametres___par | R | 1x |
| #67 | `cafil045_dat` | tables___________tab | R | 2x |
| #69 | `cafil047_dat` | initialisation___ini | R | 2x |
| #78 | `cafil056_dat` | param__telephone_tel | R | 1x |
| #122 | `cafil100_dat` | unilateral_bilateral | R | 1x |
| #123 | `cafil101_dat` | fichier_messagerie | R | 4x |
| #130 | `cafil108_dat` | fichier_langue | R | 1x |
| #152 | `cafil130_dat` | parametres_pour_pabx | R | 1x |
| #219 | `caisse_com_ims` | communication_ims | R | 1x |
| #246 | `caisse_session` | histo_sessions_caisse | R | 2x |
| #257 | `caisse_terminaux_ims` | numero_des_terminaux_ims | R | 2x |
| #263 | `caisse_vente` | vente | R | 1x |
| #268 | `ccpartyp` | cc_total_par_type | R | 1x |
| #280 | `cotionadh_dat` | cotion_par_adherent | R | 1x |
| #312 | `ezcard` | ez_card | R | 1x |
| #358 | `moddossier_dat` | import_mod | R | 2x |
| #423 | `req_param_dat` | req_param | R | 1x |
| #697 | `droits` | droits_applications | R | 1x |
| #720 | `arc_bartransacent` | arc_transac_entete_bar | R | 1x |
| #728 | `arc_cctotal` | arc_cc_total | R | 2x |
| #740 | `pv_stockmvt_dat` | pv_stock_movements | R | 1x |
| #786 | `qualite_avant_reprise` | qualite_avant_reprise | R | 2x |
| #805 | `vente_par_moyen_paiement` | vente_par_moyen_paiement | R | 1x |
| #844 | `%club_user%_stat_vendeur` | stat_vendeur | R | 2x |
| #878 | `categorie_operation_mw` | categorie_operation_mw | R | 2x |
| #934 | `selection_enregistrement_div` | selection enregistrement diver | R | 1x |

---

## 3. PARAMETRES D'ENTREE (0)

| # | Nom | Type | Description |
|---|-----|------|-------------|
| P1 | P0 societe | ALPHA | - |
| P2 | P0 village_à_CAM ? | ALPHA | - |
| P3 | P0 village à tel ? | ALPHA | - |
| P4 | P0 parking ? | ALPHA | - |
| P5 | P0 village BiBop ? | ALPHA | - |
| P6 | P0 village PME | ALPHA | - |
| P7 | P0 nbre_de_decimales | NUMERIC | - |
| P8 | P0 masque montant | ALPHA | - |
| P9 | P0 masque cumul | ALPHA | - |
| P10 | P0 devise locale | ALPHA | - |
| P11 | P0 tel cam | ALPHA | - |
| P12 | P0 code village | ALPHA | - |
| P13 | P0 nom village | ALPHA | - |
| P14 | P0 telephone village | ALPHA | - |
| P15 | P0 fax village | ALPHA | - |
| P16 | P0 village TAI | ALPHA | - |
| P17 | P0 nouvelle gestion caisse | ALPHA | - |
| P18 | P0 Village CIA Pack | ALPHA | - |
| P19 | P0 GPIN Limit (cia Pack) | NUMERIC | - |
| P20 | W0 choix action | ALPHA | - |
| P21 | WP0 chaîne recherche | ALPHA | - |
| P22 | WP0 code GM | NUMERIC | - |

---

## 4. VARIABLES PRINCIPALES

### 4.1 Variables de travail (W0/V0)

| Ref | Nom | Type | Role |
|-----|-----|------|------|
| `{0,2}` | V.Mode Consultation ? | LOGICAL | - |
| `{0,-40}` | W0 choix action | ALPHA | - |
| `{0,-20}` | W0 utilisation caiss | ALPHA | - |
| `{0,-19}` | W0 code retour | ALPHA | - |
| `{0,-18}` | W0 Uni/Bi-Lateral | ALPHA | - |
| `{0,-17}` | W0 code village PME | NUMERIC | - |
| `{0,-16}` | W0 affichage presence | LOGICAL | - |
| `{0,-15}` | W0 titre gm | ALPHA | - |
| `{0,-14}` | W0 titre menu caisse | ALPHA | - |
| `{0,-13}` | W0 club card number | NUMERIC | - |
| `{0,-12}` | W0 verif ticket telephone | LOGICAL | - |
| `{0,-11}` | W0 verif pooling magic | LOGICAL | - |
| `{0,-10}` | W0 test room status | ALPHA | - |
| `{0,-9}` | W0 message autres affilies | LOGICAL | - |
| `{0,-8}` | W0 Status Club Med Pass | ALPHA | - |
| `{0,-7}` | W0 message | LOGICAL | - |
| `{0,-6}` | W0 Libelle session caisse | ALPHA | - |
| `{0,-5}` | W0 Etat caisse | ALPHA | - |
| `{0,-4}` | W0 Mode consultation | LOGICAL | - |
| `{0,-1}` | W0 Choix conf quitter | NUMERIC | - |

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

> Total: 242 variables mappees

---

## 5. EXPRESSIONS (573 total, 398 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `'C'` | `'C'` |
| 2 | `{0,21}='S'` | `WP0 chaîne recherche='S'` |
| 3 | `{0,21}='F' AND GetParam ('CHANGEAPPLICATION')='N'` | `WP0 chaîne recherche='F' AND GetParam ('CHANGEAPPLICATION...` |
| 4 | `{0,21}='M'` | `WP0 chaîne recherche='M'` |
| 5 | `{0,21}='A'` | `WP0 chaîne recherche='A'` |
| 6 | `{0,21}='C' OR {0,21}='A'` | `WP0 chaîne recherche='C' OR WP0 chaîne recherche='A'` |
| 7 | `'M'` | `'M'` |
| 8 | `'L'` | `'L'` |
| 9 | `'S'` | `'S'` |
| 10 | `{0,21}='F'` | `WP0 chaîne recherche='F'` |
| 11 | `{0,41}='O'` | `W0 code retour='O'` |
| 12 | `{0,41}<>'O'` | `W0 code retour<>'O'` |
| 13 | `'F'` | `'F'` |
| 14 | `'00'` | `'00'` |
| 15 | `''` | `''` |
| 16 | `0` | `0` |
| 17 | `12` | `12` |
| 18 | `14` | `14` |
| 19 | `'TRUE'LOG` | `'TRUE'LOG` |
| 20 | `NOT (FileExist ('%club_trav%Connect.dat')) AND {0,3}='O'` | `NOT (FileExist ('%club_trav%Connect.dat')) AND v.Host cou...` |
| 21 | `{0,53}='O'` | `W0 message='O'` |
| 22 | `''` | `''` |
| 23 | `'O'` | `'O'` |
| 24 | `{0,17}='N'` | `P0 Village CIA Pack='N'` |
| 25 | `{0,17}='O'` | `P0 Village CIA Pack='O'` |
| 26 | `Counter (0)=1 OR {0,65}` | `Counter (0)=1 OR {0,65}` |
| 27 | `{0,56}='F' OR {0,56}='Q'` | `W0 Mode consultation='F' OR W0 Mode consultation='Q'` |
| 28 | `{0,56}='O' OR {0,56}='C'` | `W0 Mode consultation='O' OR W0 Mode consultation='C'` |
| 29 | `{0,58}=6` | `W0 FROM IMS=6` |
| 30 | `'N'` | `'N'` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 41 (8 W / 33 R) |
| Parametres | 0 |
| Variables locales | 65 |
| Expressions | 573 |
| Expressions 100% decodees | 398 (69%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
