# ADH IDE 89 - Factures (Tble Compta&Vent

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_89.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 89 |
| **Fichier XML** | Prg_89.xml |
| **Description** | Factures (Tble Compta&Vent |
| **Type** | O (O=Online, B=Batch) |
| **Parametres** | 5 |
| **Module** | ADH |
| **Dossier IDE** | Factures |

> **Note**: Ce programme est Prg_89.xml. L'ID XML (89) peut differer de la position IDE (89).

---

## 2. TABLES (18 tables - 10 en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #40 | `cafil018_dat` | comptable________cte | **W** | 2x |
| #68 | `cafil046_dat` | compteurs________cpt | **W** | 1x |
| #263 | `caisse_vente` | vente | **W** | 2x |
| #746 | `version` | projet | **W** | 2x |
| #866 | `maj_appli_tpe` | maj_appli_tpe | **W** | 16x |
| #867 | `log_maj_tpe` | log_maj_tpe | **W** | 3x |
| #868 | `affectation_gift_pass` | Affectation_Gift_Pass | **W** | 10x |
| #870 | `rayons_boutique` | Rayons_Boutique | **W** | 12x |
| #871 | `activite` | Activite | **W** | 2x |
| #932 | `taxe_add_param` | taxe_add_param | **W** | 2x |
| #30 | `cafil008_dat` | gm-recherche_____gmr | R | 2x |
| #31 | `cafil009_dat` | gm-complet_______gmc | R | 1x |
| #372 | `pv_budget_dat` | pv_budget | R | 1x |
| #382 | `pv_discountlist_dat` | pv_discount_reasons | R | 2x |
| #400 | `pv_rentals_dat` | pv_cust_rentals | R | 2x |
| #744 | `pv_lieux_vente` | pv_lieux_vente | R | 2x |
| #755 | `cafil_address_tmp` | cafil_address_tmp | R | 2x |
| #756 | `cafil_country_iso` | Country_ISO | R | 2x |

---

## 3. PARAMETRES D'ENTREE (5)

| # | Nom | Type | Description |
|---|-----|------|-------------|

---

## 4. VARIABLES PRINCIPALES

### 4.1 Variables de travail (W0/V0)

| Ref | Nom | Type | Role |
|-----|-----|------|------|
| `{0,-111}` | V.Lien Gm_Complet | LOGICAL | - |
| `{0,-95}` | V.Lien Pied de facture | LOGICAL | - |
| `{0,-73}` | V.EntetFacture? | LOGICAL | - |
| `{0,-72}` | v.ExistFactureVente | LOGICAL | - |
| `{0,-74}` | V.Existe facture ? | LOGICAL | - |
| `{0,-85}` | V.Nom | ALPHA | - |
| `{0,-84}` | V.Adresse | ALPHA | - |
| `{0,-83}` | V.CP | ALPHA | - |
| `{0,-82}` | V.Ville | ALPHA | - |
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

> Total: 184 variables mappees

---

## 5. EXPRESSIONS (537 total, 337 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `'Hébergement'` | `'Hébergement'` |
| 2 | `{0,1}` | `P.Code_Gm` |
| 3 | `{0,2}` | `P.Filiation` |
| 4 | `{0,3}` | `P.Application` |
| 5 | `{0,7}` | `V.EntetFacture?` |
| 6 | `{0,8}` | `v.ExistFactureVente` |
| 7 | `IF({0,58},Trim({0,53}),IF({0,5},Trim({0,20})&' '&Trim({0,...` | `IF({0,58},Trim({0,53}),IF(V.Lien Gm_Complet,Trim(V.Pos ,)...` |
| 8 | `IF({0,58},Trim({0,52}),IF({0,5},Trim({0,19})&' '&Trim({0,...` | `IF({0,58},Trim({0,52}),IF(V.Lien Gm_Complet,Trim(V.Nom Fi...` |
| 9 | `IF({0,58},Trim({0,54}),IF({0,5},Trim({0,22}),Trim({0,35})))` | `IF({0,58},Trim({0,54}),IF(V.Lien Gm_Complet,Trim(V.Fact d...` |
| 10 | `IF({0,58},Trim({0,55}),IF({0,5},Trim({0,23}),Trim({0,37})))` | `IF({0,58},Trim({0,55}),IF(V.Lien Gm_Complet,Trim(V.Date D...` |
| 11 | `'Numéro d''adhérent'&' '&IF({0,5},Trim(Str({0,14},'10Z'))...` | `'Numéro d''adhérent'&' '&IF(V.Lien Gm_Complet,Trim(Str(V....` |
| 12 | `'Quitter'` | `'Quitter'` |
| 13 | `'Imprimer'` | `'Imprimer'` |
| 14 | `'R.à.z'` | `'R.à.z'` |
| 15 | `MlsTrans('Confirmez vous l''édition de cette facture ?')` | `MlsTrans('Confirmez vous l''édition de cette facture ?')` |
| 16 | `{0,66}=6` | `{0,66}=6` |
| 17 | `Trim({0,42})&Trim(Str(Year(Date()),'4'))&Trim(Str(Month(D...` | `Trim({0,42})&Trim(Str(Year(Date()),'4'))&Trim(Str(Month(D...` |
| 18 | `Trim({0,42})&Trim(Str(Year(Date()),'4'))&Trim(Str(Month(D...` | `Trim({0,42})&Trim(Str(Year(Date()),'4'))&Trim(Str(Month(D...` |
| 19 | `NOT({0,71})` | `NOT({0,71})` |
| 20 | `{0,71}` | `{0,71}` |
| 21 | `MID(GetParam('SERVICE'),4,{0,69}-4)` | `MID(GetParam('SERVICE'),4,{0,69}-4)` |
| 22 | `InStr(GetParam('SERVICE'),',')` | `InStr(GetParam('SERVICE'),',')` |
| 23 | `{32768,2}` | `VG.Retour Chariot` |
| 24 | `Date()` | `Date()` |
| 25 | `{0,67}` | `{0,67}` |
| 26 | `'TRUE'LOG` | `'TRUE'LOG` |
| 27 | `Translate ('%club_exportdata%')&'PDF\'&Trim({0,68})` | `Translate ('%club_exportdata%')&'PDF\'&Trim({0,68})` |
| 28 | `'FALSE'LOG` | `'FALSE'LOG` |
| 29 | `{0,77}` | `{0,77}` |
| 30 | `NOT {0,78}` | `NOT {0,78}` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 18 (10 W / 8 R) |
| Parametres | 5 |
| Variables locales | 33 |
| Expressions | 537 |
| Expressions 100% decodees | 337 (63%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
