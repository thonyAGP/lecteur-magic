# ADH IDE 97 - Factures (Tble Compta&Vent) V3

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_97.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 97 |
| **Fichier XML** | Prg_97.xml |
| **Description** | Factures (Tble Compta&Vent) V3 |
| **Type** | O (O=Online, B=Batch) |
| **Parametres** | 6 |
| **Module** | ADH |
| **Dossier IDE** | Factures V3 |

> **Note**: Ce programme est Prg_97.xml. L'ID XML (97) peut differer de la position IDE (97).

---

## 2. TABLES (16 tables - 7 en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #40 | `cafil018_dat` | comptable________cte | **W** | 1x |
| #263 | `caisse_vente` | vente | **W** | 1x |
| #746 | `version` | projet | **W** | 1x |
| #866 | `maj_appli_tpe` | maj_appli_tpe | **W** | 12x |
| #868 | `affectation_gift_pass` | Affectation_Gift_Pass | **W** | 2x |
| #870 | `rayons_boutique` | Rayons_Boutique | **W** | 7x |
| #911 | `log_booker` | log_booker | **W** | 1x |
| #30 | `cafil008_dat` | gm-recherche_____gmr | R | 1x |
| #31 | `cafil009_dat` | gm-complet_______gmc | R | 1x |
| #121 | `cafil099_dat` | tables_pays_ventes | R | 1x |
| #372 | `pv_budget_dat` | pv_budget | R | 1x |
| #744 | `pv_lieux_vente` | pv_lieux_vente | R | 1x |
| #786 | `qualite_avant_reprise` | qualite_avant_reprise | R | 1x |
| #867 | `log_maj_tpe` | log_maj_tpe | R | 2x |
| #871 | `activite` | Activite | R | 1x |
| #932 | `taxe_add_param` | taxe_add_param | R | 1x |

---

## 3. PARAMETRES D'ENTREE (6)

| # | Nom | Type | Description |
|---|-----|------|-------------|

---

## 4. VARIABLES PRINCIPALES

### 4.1 Variables de travail (W0/V0)

| Ref | Nom | Type | Role |
|-----|-----|------|------|
| `{0,-111}` | V.Lien Gm_Complet | LOGICAL | - |
| `{0,-95}` | V.Lien Pied de facture | LOGICAL | - |
| `{0,-74}` | V.Existe facture ? | LOGICAL | - |
| `{0,-85}` | V.Nom | ALPHA | - |
| `{0,-84}` | V.Adresse | ALPHA | - |
| `{0,-83}` | V.CP | ALPHA | - |
| `{0,-82}` | V.Ville | ALPHA | - |
| `{0,-71}` | V.Pays | UNICODE | - |
| `{0,-81}` | V.Telephone | ALPHA | - |
| `{0,-109}` | V.Facture Sans Nom | LOGICAL | - |
| `{0,-108}` | V.Facture Sans Adresse | LOGICAL | - |
| `{0,-103}` | V.Reponse Imprimer | NUMERIC | - |
| `{0,-102}` | V.No Facture | NUMERIC | - |
| `{0,-101}` | V.Nom Fichier PDF | ALPHA | - |
| `{0,-96}` | V.Pos , | NUMERIC | - |
| `{0,-98}` | V.Service | ALPHA | - |
| `{0,-99}` | V.Fact déjà editée | LOGICAL | - |
| `{0,-94}` | V.Date Début Hebergement | DATE | - |
| `{0,-93}` | V.Date Fin Hebergement | DATE | - |
| `{0,-69}` | v.MessageValidationIdentite | UNICODE | - |

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

> Total: 194 variables mappees

---

## 5. EXPRESSIONS (318 total, 185 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `'Hébergement'` | `'Hébergement'` |
| 2 | `{0,1}` | `P.i.Code_Gm` |
| 3 | `{0,2}` | `P.i.Filiation` |
| 4 | `{0,3}` | `P.i.Application` |
| 5 | `{0,6}` | `V.Lien Gm_Complet` |
| 6 | `{0,8}` | `V.Existe facture ?` |
| 7 | `{0,2}` | `P.i.Filiation` |
| 8 | `{0,9}` | `V.Nom` |
| 9 | `StrBuild(MlsTrans('Numéro d''adhérent @1@'),IF({0,5},Str(...` | `StrBuild(MlsTrans('Numéro d''adhérent @1@'),IF(P.i.Date P...` |
| 10 | `'Quitter'` | `'Quitter'` |
| 11 | `'Imprimer'` | `'Imprimer'` |
| 12 | `'R.à.z'` | `'R.à.z'` |
| 13 | `MlsTrans('Confirmez vous l''édition de cette facture ?')` | `MlsTrans('Confirmez vous l''édition de cette facture ?')` |
| 14 | `Trim({0,45}) &Trim(Str(Year(Date()),'4'))&Trim(Str(Month(...` | `Trim({0,45}) &Trim(Str(Year(Date()),'4'))&Trim(Str(Month(...` |
| 15 | `Trim({0,45}) &Trim(Str(Year(Date()),'4'))&Trim(Str(Month(...` | `Trim({0,45}) &Trim(Str(Year(Date()),'4'))&Trim(Str(Month(...` |
| 16 | `NOT({0,79}) OR {0,94}` | `NOT({0,79}) OR {0,94}` |
| 17 | `{0,79} AND NOT({0,94}) AND {0,99} > 2` | `{0,79} AND NOT({0,94}) AND {0,99} > 2` |
| 18 | `MID(GetParam('SERVICE'),4,{0,77}-4)` | `MID(GetParam('SERVICE'),4,{0,77}-4)` |
| 19 | `{0,70}` | `{0,70}` |
| 20 | `InStr(GetParam('SERVICE'),',')` | `InStr(GetParam('SERVICE'),',')` |
| 21 | `{32768,2}` | `VG.Retour Chariot` |
| 22 | `Date()` | `Date()` |
| 23 | `{0,75}` | `{0,75}` |
| 24 | `'TRUE'LOG` | `'TRUE'LOG` |
| 25 | `'FALSE'LOG` | `'FALSE'LOG` |
| 26 | `'FALSE'LOG` | `'FALSE'LOG` |
| 27 | `{0,94}` | `{0,94}` |
| 28 | `NOT {0,95}` | `NOT {0,95}` |
| 29 | `{0,99} > 2` | `{0,99} > 2` |
| 30 | `{0,95}` | `{0,95}` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 16 (7 W / 9 R) |
| Parametres | 6 |
| Variables locales | 38 |
| Expressions | 318 |
| Expressions 100% decodees | 185 (58%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
