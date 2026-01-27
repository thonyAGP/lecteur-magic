# ADH IDE 98 - EditFactureTva(Compta&Ve) V3

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_98.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 98 |
| **Fichier XML** | Prg_98.xml |
| **Description** | EditFactureTva(Compta&Ve) V3 |
| **Type** | B (O=Online, B=Batch) |
| **Parametres** | 13 |
| **Module** | ADH |
| **Dossier IDE** | Factures V3 |

> **Note**: Ce programme est Prg_98.xml. L'ID XML (98) peut differer de la position IDE (98).

---

## 2. TABLES (9 tables - 0 en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #27 | `cafil005_dat` | donnees_village__dvi | R | 1x |
| #31 | `cafil009_dat` | gm-complet_______gmc | R | 1x |
| #121 | `cafil099_dat` | tables_pays_ventes | R | 1x |
| #372 | `pv_budget_dat` | pv_budget | R | 1x |
| #744 | `pv_lieux_vente` | pv_lieux_vente | R | 1x |
| #866 | `maj_appli_tpe` | maj_appli_tpe | R | 1x |
| #867 | `log_maj_tpe` | log_maj_tpe | R | 2x |
| #869 | `detail_import_boutique` | Detail_Import_Boutique | R | 1x |
| #932 | `taxe_add_param` | taxe_add_param | R | 1x |

---

## 3. PARAMETRES D'ENTREE (13)

| # | Nom | Type | Description |
|---|-----|------|-------------|

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

> Total: 144 variables mappees

---

## 5. EXPRESSIONS (55 total, 15 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `{0,5}` | `P.i.Service` |
| 2 | `IF(Trim({32768,22})='','N12.2Z',{32768,22})` | `IF(Trim(VG.MASQUE MONTANT)='','N12.2Z',VG.MASQUE MONTANT)` |
| 3 | `INIPut('EmbedFonts=N','FALSE'LOG)` | `INIPut('EmbedFonts=N','FALSE'LOG)` |
| 4 | `INIPut('CompressPDF =Y','FALSE'LOG)` | `INIPut('CompressPDF =Y','FALSE'LOG)` |
| 1 | `IF({1,13},RepStr(Trim({1,4}),'.pdf','-D.pdf'),Trim({1,4}))` | `IF({1,13},RepStr(Trim({1,4}),'.pdf','-D.pdf'),Trim({1,4}))` |
| 2 | `Trim({1,16})` | `Trim({1,16})` |
| 3 | `Trim({1,23})` | `Trim({1,23})` |
| 4 | `IF({1,10},Trim(Str({0,45},'10P0Z')),GetParam('GM_ADHN'))` | `IF({1,10},Trim(Str({0,45},'10P0Z')),GetParam('GM_ADHN'))` |
| 5 | `IF({1,10},Trim(Str({0,40},'8P0')),GetParam('GM_ACCN'))` | `IF({1,10},Trim(Str({0,40},'8P0')),GetParam('GM_ACCN'))` |
| 6 | `Trim({1,17})` | `Trim({1,17})` |
| 7 | `Trim({1,15})` | `Trim({1,15})` |
| 8 | `Trim({1,18})` | `Trim({1,18})` |
| 9 | `Trim({1,20})` | `Trim({1,20})` |
| 10 | `StrBuild(MlsTrans('Facture N°@1@ du @2@'),Trim({1,41})&Tr...` | `StrBuild(MlsTrans('Facture N°@1@ du @2@'),Trim({1,41})&Tr...` |
| 11 | `{1,1}` | `{1,1}` |
| 12 | `{1,2}` | `{1,2}` |
| 13 | `{1,3}` | `{1,3}` |
| 14 | `Date()` | `Date()` |
| 15 | `IF({1,10},Trim({0,46})&' '&Trim({0,47}),Trim({0,34})&' '&...` | `IF({1,10},Trim({0,46})&' '&Trim({0,47}),Trim({0,34})&' '&...` |
| 16 | `{0,16}<>0` | `{0,16}<>0` |
| 17 | `'Téléphone :'&Trim({1,28})&' - ''Fax :'&Trim({1,29})&' - ...` | `'Téléphone :'&Trim({1,28})&' - ''Fax :'&Trim({1,29})&' - ...` |
| 18 | `NOT({1,7})` | `NOT({1,7})` |
| 19 | `NOT({1,8})` | `NOT({1,8})` |
| 20 | `NOT({1,8}) AND Trim({0,54})<>''` | `NOT({1,8}) AND Trim({0,54})<>''` |
| 21 | `NOT({1,8}) AND Trim({1,40}) <> ''` | `NOT({1,8}) AND Trim({1,40}) <> ''` |
| 22 | `{0,15}` | `{0,15}` |
| 23 | `Counter(0)=1` | `Counter(0)=1` |
| 24 | `{0,21}<>0 AND IF({32768,77},'TRUE'LOG,{0,25}<>'R')` | `{0,21}<>0 AND IF(VG.Interfaces OB,'TRUE'LOG,{0,25}<>'R')` |
| 25 | `{1,10}` | `{1,10}` |
| 26 | `IF(Trim({1,42})<>'',{1,42},IF({1,10},{0,50},{0,38}))` | `IF(Trim({1,42})<>'',{1,42},IF({1,10},{0,50},{0,38}))` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 9 (0 W / 9 R) |
| Parametres | 13 |
| Variables locales | 13 |
| Expressions | 55 |
| Expressions 100% decodees | 15 (27%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
