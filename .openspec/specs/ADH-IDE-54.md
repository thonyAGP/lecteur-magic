# ADH IDE 54 - Factures_Check_Out

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_54.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 54 |
| **Fichier XML** | Prg_54.xml |
| **Description** | Factures_Check_Out |
| **Type** | B (O=Online, B=Batch) |
| **Parametres** | 8 |
| **Module** | ADH |
| **Dossier IDE** | Easy Check Out |

> **Note**: Ce programme est Prg_54.xml. L'ID XML (54) peut differer de la position IDE (54).

---

## 2. TABLES (8 tables - 3 en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #866 | `maj_appli_tpe` | maj_appli_tpe | **W** | 8x |
| #870 | `rayons_boutique` | Rayons_Boutique | **W** | 5x |
| #932 | `taxe_add_param` | taxe_add_param | **W** | 2x |
| #30 | `cafil008_dat` | gm-recherche_____gmr | R | 1x |
| #31 | `cafil009_dat` | gm-complet_______gmc | R | 1x |
| #372 | `pv_budget_dat` | pv_budget | R | 1x |
| #867 | `log_maj_tpe` | log_maj_tpe | R | 1x |
| #868 | `affectation_gift_pass` | Affectation_Gift_Pass | R | 1x |

---

## 3. PARAMETRES D'ENTREE (8)

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
| `{0,-102}` | V.No Facture | NUMERIC | - |
| `{0,-101}` | V.Nom Fichier PDF | ALPHA | - |
| `{0,-96}` | V.Pos , | NUMERIC | - |
| `{0,-98}` | V.Service | ALPHA | - |
| `{0,-99}` | V.Fact déjà editée | LOGICAL | - |
| `{0,-94}` | V.Date Début Hebergement | DATE | - |
| `{0,-93}` | V.Date Fin Hebergement | DATE | - |
| `{0,-90}` | V.Existe non facturee ? | LOGICAL | - |
| `{0,-88}` | V.Existe flaguee ? | LOGICAL | - |

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

> Total: 174 variables mappees

---

## 5. EXPRESSIONS (146 total, 77 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `{0,1}` | `P.i.Code_Gm` |
| 2 | `{0,2}` | `P.i.Filiation` |
| 3 | `{0,3}` | `P.i.Application` |
| 4 | `{0,10}` | `V.Existe facture ?` |
| 5 | `{0,11}` | `V.Nom` |
| 6 | `IF({0,42},Trim({0,45}),Trim({0,23})&' '&Trim({0,24}))` | `IF({0,42},Trim({0,45}),Trim(V.Fact déjà editée)&' '&Trim(...` |
| 7 | `IF({0,42},Trim({0,44}),Trim({0,19})&' '&Trim({0,21})&' '&...` | `IF({0,42},Trim({0,44}),Trim(V.No Facture)&' '&Trim(V.Pos ...` |
| 8 | `IF({0,42},Trim({0,46}),Trim({0,25}))` | `IF({0,42},Trim({0,46}),Trim(V.Date Fin Hebergement))` |
| 9 | `IF({0,42},Trim({0,47}),Trim({0,27}))` | `IF({0,42},Trim({0,47}),Trim(V.Existe flaguee ?))` |
| 10 | `IF({0,42},Trim({0,49}),Trim({0,29}))` | `IF({0,42},Trim({0,49}),Trim({0,29}))` |
| 11 | `'Numéro d''adhérent'&' '&Trim(Str({0,22},'10Z'))` | `'Numéro d''adhérent'&' '&Trim(Str(V.Service,'10Z'))` |
| 12 | `Trim({0,31})&Trim(Str(Year(Date()),'4'))&Trim(Str(Month(D...` | `Trim({0,31})&Trim(Str(Year(Date()),'4'))&Trim(Str(Month(D...` |
| 13 | `Trim({0,31})&Trim(Str(Year(Date()),'4'))&Trim(Str(Month(D...` | `Trim({0,31})&Trim(Str(Year(Date()),'4'))&Trim(Str(Month(D...` |
| 14 | `NOT({0,62})` | `NOT({0,62})` |
| 15 | `{0,62}` | `{0,62}` |
| 16 | `MID(GetParam('SERVICE'),4,{0,60}-4)` | `MID(GetParam('SERVICE'),4,{0,60}-4)` |
| 17 | `InStr(GetParam('SERVICE'),',')` | `InStr(GetParam('SERVICE'),',')` |
| 18 | `{32768,2}` | `VG.Retour Chariot` |
| 19 | `Date()` | `Date()` |
| 20 | `{0,58}` | `{0,58}` |
| 21 | `'TRUE'LOG` | `'TRUE'LOG` |
| 22 | `'FALSE'LOG` | `'FALSE'LOG` |
| 23 | `IF(Trim({0,6}) <> '',Trim({0,6}) & Trim({0,59}), Translat...` | `IF(Trim(P.i.TypeReglement) <> '',Trim(P.i.TypeReglement) ...` |
| 24 | `'FALSE'LOG` | `'FALSE'LOG` |
| 25 | `{0,65}` | `{0,65}` |
| 26 | `{0,66}` | `{0,66}` |
| 27 | `Trim({0,50})<>''` | `Trim({0,50})<>''` |
| 28 | `{0,40}` | `{0,40}` |
| 29 | `{0,48}` | `{0,48}` |
| 30 | `NOT {0,42}` | `NOT {0,42}` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 8 (3 W / 5 R) |
| Parametres | 8 |
| Variables locales | 28 |
| Expressions | 146 |
| Expressions 100% decodees | 77 (53%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
