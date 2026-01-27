# ADH IDE 235 -  Print ticket vente LEX

> **Version spec** : 2.1 (Enhanced)
> **Genere le** : 2026-01-26
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_231.xml`

---

---

<!-- TAB:Fonctionnel -->

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 235 |
| **Fichier XML** | Prg_231.xml |
| **Description** |  Print ticket vente LEX |
| **Type** | B (O=Online, B=Batch) |
| **Parametres** | 29 |
| **Module** | ADH |
| **Dossier IDE** | Ventes |

> **Note**: Ce programme est Prg_231.xml. L'ID XML (231) peut differer de la position IDE (235).


---

## PARTIE I: SPECIFICATION FONCTIONNELLE (Annotations)

### 1.1 Objectif Metier
- **Qui**: Systeme / Programme appelant (IDE 238)
- **Quoi**: Generer et imprimer le ticket de vente
- **Pourquoi**: Fournir un justificatif papier au client apres une transaction
### 1.2 Flux Utilisateur
1. Reception des parametres de vente (29 params)
2. Lecture des donnees article et client (17 tables)
3. Formatage du ticket selon type (VRL/VSL/TAI)
4. Gestion du texte ANNULATION si applicable
5. Selection imprimante selon configuration
6. Generation PDF ou impression directe
7. Gestion des copies multiples

### 1.3 Notes Migration
- Programme de sortie - lecture seule (0 tables en ecriture)
- 844 expressions - principalement formatage texte
- Gestion multi-imprimantes (GetParam CURRENTPRINTERNUM)
- Support PDF et impression directe
- Appele par IDE 238 apres transaction

### 1.4 Dependances ECF

Appele depuis ADH IDE 238 (Transaction vente)

### 1.5 Tags
`impression``, ``ticket``, ``ventes``, ``read-only``, ``batch`

---

---

<!-- TAB:Technique -->

## 2. TABLES (17 tables - 0 en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #31 | `cafil009_dat` | gm-complet_______gmc | R | 4x |
| #34 | `cafil012_dat` | hebergement______heb | R | 4x |
| #40 | `cafil018_dat` | comptable________cte | R | 4x |
| #67 | `cafil045_dat` | tables___________tab | R | 3x |
| #69 | `cafil047_dat` | initialisation___ini | R | 1x |
| #77 | `cafil055_dat` | articles_________art | R | 5x |
| #263 | `caisse_vente` | vente | R | 4x |
| #372 | `pv_budget_dat` | pv_budget | R | 1x |
| #417 | `pv_weight` | pv_weight | R | 2x |
| #596 | `%club_user%tmp_ecrpolice_dat` | tempo_ecran_police | R | 14x |
| #728 | `arc_cctotal` | arc_cc_total | R | 1x |
| #818 | `zcircafil146` | Circuit supprime | R | 3x |
| #847 | `%club_user%_stat_lieu_vente_date` | stat_lieu_vente_date | R | 15x |
| #867 | `log_maj_tpe` | log_maj_tpe | R | 5x |
| #878 | `categorie_operation_mw` | categorie_operation_mw | R | 2x |
| #904 | `Boo_AvailibleEmployees` | Boo_AvailibleEmployees | R | 3x |
| #1037 | `Table_1037` | Unknown | R | 2x |

---

## 3. PARAMETRES D'ENTREE (29)

| # | Nom | Type | Description |
|---|-----|------|-------------|
| P1 | P0 od annulation | LOGICAL | - |
| P2 | P0 Nom | ALPHA | - |
| P3 | P0 Date | DATE | - |
| P4 | P0 Article libelle 1 | ALPHA | - |
| P5 | P0 Article complementaire | ALPHA | - |
| P6 | P0 Qte *NU* | NUMERIC | - |
| P7 | P0 Prix unitaire | NUMERIC | - |
| P8 | P0 Total | NUMERIC | - |
| P9 | P0 Devise locale | ALPHA | - |
| P10 | P0 Masque | ALPHA | - |
| P11 | P0 Chambre | ALPHA | - |
| P12 | P0 mode de paiement | ALPHA | - |
| P13 | P0 libelle paiement | ALPHA | - |
| P14 | PO is TAI | LOGICAL | - |
| P15 | P0 TAI Cash | ALPHA | - |
| P16 | P0 TAI start date | DATE | - |
| P17 | P0 TAI end date | DATE | - |
| P18 | W0 en-tête ? | ALPHA | - |
| P19 | W0 fin tâche | ALPHA | - |
| P20 | W0 copies | NUMERIC | - |

---

## 4. VARIABLES PRINCIPALES

### 4.1 Variables de travail (W0/V0)

| Nom | Type | Role |
|-----|------|------|
| W0 en-tête ? | ALPHA | - |
| W0 fin tâche | ALPHA | - |
| W0 copies | NUMERIC | - |
| v.Itération Compteur ticket | NUMERIC | - |
| v.NumeroTicketsvg | NUMERIC | - |
| v.Date Conso ou date séjour | ALPHA | - |
| v.TPE ICMP | LOGICAL | - |
| v.Service Interne Club Med? | LOGICAL | - |
| v. nb erreur lignes inexistante | NUMERIC | - |
| v.Liste des TVA taux Réduit | UNICODE | - |
| v.Nombre de taux réduit | NUMERIC | - |
| v.N° Taux reduit en cours | NUMERIC | - |
| v.Taux réduit en cours | UNICODE | - |
| v.Text à éditer si pdt tx redu | UNICODE | - |
| v.Libelle TVA | UNICODE | - |
| v.Libelle Montant HT | UNICODE | - |
| v.Montant Service | NUMERIC | - |
| v.Montant Product | NUMERIC | - |
| v.ABS Montant Service | NUMERIC | - |
| v.ABS Montant Prod | NUMERIC | - |

### 4.2 Variables globales (VG)

| Variable | Role |
|----------|------|
| VG.LOGIN | - |
| VG.USER | - |
| VG.Retour Chariot | - |
| VG.DROIT ACCES IT ? | - |
| VG.DROIT ACCES CAISSE ? | - |
| VG.BRAZIL DATACATCHING? | - |
| VG.USE MDR | - |
| VG.VRL ACTIF ? | - |
| VG.ECI ACTIF ? | - |
| VG.COMPTE CASH ACTIF ? | - |
| VG.IND SEJ PAYE ACTIF ? | - |
| VG.CODE LANGUE USER | - |
| VG.EFFECTIF ACTIF ? | - |
| VG.TAXE SEJOUR ACTIF ? | - |
| VG.N° version | - |

> Total: 224 variables mappees

---

## 5. EXPRESSIONS (844 total, 523 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `SetCrsr (2)` | `SetCrsr (2)` |
| 2 | `SetCrsr (1)` | `SetCrsr (1)` |
| 31 | `GetParam ('CURRENTPRINTERNUM')` | `GetParam ('CURRENTPRINTERNUM')` |
| 3 | `GetParam ('CURRENTPRINTERNUM')=1` | `GetParam ('CURRENTPRINTERNUM')=1` |
| 4 | `GetParam ('CURRENTPRINTERNUM')=4` | `GetParam ('CURRENTPRINTERNUM')=4` |
| 5 | `GetParam ('CURRENTPRINTERNUM')=5` | `GetParam ('CURRENTPRINTERNUM')=5` |
| 6 | `GetParam ('CURRENTPRINTERNUM')=8` | `GetParam ('CURRENTPRINTERNUM')=8` |
| 7 | `GetParam ('CURRENTPRINTERNUM')=9` | `GetParam ('CURRENTPRINTERNUM')=9` |
| 8 | `'VRL'` | `'VRL'` |
| 9 | `'VSL'` | `'VSL'` |
| 10 | `INIPut('EmbedFonts=N','FALSE'LOG)` | `INIPut('EmbedFonts=N','FALSE'LOG)` |
| 11 | `INIPut('CompressPDF =Y','FALSE'LOG)` | `INIPut('CompressPDF =Y','FALSE'LOG)` |
| 12 | `'TRUE'LOG` | `'TRUE'LOG` |
| 13 | `{32768,78}` | `VG.Hostname au lieu de Term` |
| 14 | `NOT {32768,78}` | `NOT VG.Hostname au lieu de Term` |
| 15 | `Translate ('%TempDir%')&'ticket_vente_'&
Str({0,15},'8P0...` | `Translate ('%TempDir%')&'ticket_vente_'&
Str(P0 UNI/BI,'...` |
| 16 | `{0,32}` | `v.Itération Compteur ticket` |
| 17 | `ExpCalc('3'EXP) OR ExpCalc('7'EXP)` | `ExpCalc('3'EXP) OR ExpCalc('7'EXP)` |
| 27 | `{0,51}>0` | `v.demande AGEC à effectuée?>0` |
| 19 | `StrTokenCnt({0,52},',')` | `StrTokenCnt(v.Imprimante n°,',')` |
| 20 | `StrToken({0,52},{0,55},',')` | `StrToken(v.Imprimante n°,{0,55},',')` |
| 21 | `Trim('* '&{0,56})&MlsTrans('% reduction rate item')` | `Trim('* '&{0,56})&MlsTrans('% reduction rate item')` |
| 22 | `MlsTrans('TVA')` | `MlsTrans('TVA')` |
| 23 | `MlsTrans('Montant HT')` | `MlsTrans('Montant HT')` |
| 24 | `GetParam ('NUMBERCOPIES')` | `GetParam ('NUMBERCOPIES')` |
| 28 | `{0,25} OR {0,26}` | `p.Re_Print_Annulation OR PI.N° de Ticket si VG TENV10` |
| 26 | `1` | `1` |
| 29 | `ABS({0,62})` | `ABS({0,62})` |
| 30 | `ABS({0,61})` | `ABS({0,61})` |
| 1 | `Counter (0)>={1,44}` | `Counter (0)>={1,44}` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 17 (0 W / 17 R) |
| Parametres | 29 |
| Variables locales | 53 |
| Expressions | 844 |
| Expressions 100% decodees | 523 (62%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-26 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*

---

<!-- TAB:Cartographie -->

## CARTOGRAPHIE

*Aucun callee identifie - programme terminal ou appels dynamiques*

### Metriques

| Metrique | Valeur |
|----------|--------|
| Tables | 17 |
| Expressions | 844 |
| Complexite | Eleve |

---

*Spec V2.1 avec marqueurs TAB - Genere automatiquement*
