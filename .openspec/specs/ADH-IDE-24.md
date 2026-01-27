# ADH IDE 24 - Print reçu change vente

> **Version spec** : 2.0
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_24.xml`

---

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 24 |
| **Fichier XML** | Prg_24.xml |
| **Description** | Print reçu change vente |
| **Type** | B (O=Online, B=Batch) |
| **Parametres** | 14 |
| **Module** | ADH |
| **Dossier IDE** | Change |

> **Note**: Ce programme est Prg_24.xml. L'ID XML (24) peut differer de la position IDE (24).

---

## 2. TABLES (5 tables - 0 en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #30 | `cafil008_dat` | gm-recherche_____gmr | R | 7x |
| #31 | `cafil009_dat` | gm-complet_______gmc | R | 1x |
| #34 | `cafil012_dat` | hebergement______heb | R | 1x |
| #147 | `cafil125_dat` | change_vente_____chg | R | 8x |
| #368 | `pmsvillage` | pms_village | R | 1x |

---

## 3. PARAMETRES D'ENTREE (14)

| # | Nom | Type | Description |
|---|-----|------|-------------|
| P1 | P0 societe | ALPHA | - |
| P2 | P0 n° adherent | NUMERIC | - |
| P3 | P0 filiation | NUMERIC | - |
| P4 | P0 date | DATE | - |
| P5 | P0 heure | TIME | - |
| P6 | P0 devise locale | ALPHA | - |
| P7 | P0 nb decimale | NUMERIC | - |
| P8 | P0 masque montant | ALPHA | - |
| P9 | P0 nom village | ALPHA | - |
| P10 | P0 telephone | ALPHA | - |
| P11 | P0 fax | ALPHA | - |
| P12 | W0 en-tête ? | ALPHA | - |
| P13 | W0 fin tâche | ALPHA | - |

---

## 4. VARIABLES PRINCIPALES

### 4.1 Variables de travail (W0/V0)

| Ref | Nom | Type | Role |
|-----|-----|------|------|
| `{0,-91}` | W0 en-tête ? | ALPHA | - |
| `{0,-90}` | W0 fin tâche | ALPHA | - |
| `{0,-84}` | v. Operation (Libelle) | ALPHA | - |
| `{0,-82}` | v. Mode paiement (Libelle) | ALPHA | - |
| `{0,-81}` | v. Taux (Libelle) | ALPHA | - |
| `{0,-80}` | v. Montant Devise Local Libelle | ALPHA | - |
| `{0,-76}` | v. Vente de devise (Libelle) | ALPHA | - |
| `{0,-75}` | v.Message (Libelle) | ALPHA | - |
| `{0,-74}` | v. Paiement (Libelle) | ALPHA | - |
| `{0,-73}` | v. Devise (Libelle) | ALPHA | - |
| `{0,-72}` | v.Existe ligne? | LOGICAL | - |
| `{0,-70}` | v.Montant Product | NUMERIC | - |
| `{0,-69}` | v.Nombre de copies | NUMERIC | - |

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

## 5. EXPRESSIONS (316 total, 224 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `SetCrsr (2)` | `SetCrsr (2)` |
| 2 | `SetCrsr (1)` | `SetCrsr (1)` |
| 3 | `GetParam ('CURRENTPRINTERNUM')=1` | `GetParam ('CURRENTPRINTERNUM')=1` |
| 4 | `GetParam ('CURRENTPRINTERNUM')=4` | `GetParam ('CURRENTPRINTERNUM')=4` |
| 5 | `GetParam ('CURRENTPRINTERNUM')=5` | `GetParam ('CURRENTPRINTERNUM')=5` |
| 6 | `GetParam ('CURRENTPRINTERNUM')=8` | `GetParam ('CURRENTPRINTERNUM')=8` |
| 7 | `GetParam ('CURRENTPRINTERNUM')=9` | `GetParam ('CURRENTPRINTERNUM')=9` |
| 8 | `{0,1}` | `P0 n° adherent` |
| 9 | `{0,2}` | `P0 filiation` |
| 10 | `{0,3}` | `P0 date` |
| 11 | `'A'` | `'A'` |
| 12 | `'Z'` | `'Z'` |
| 13 | `IF ({0,28}='010','Opération N°','Transaction N°')` | `IF ({0,28}='010','Opération N°','Transaction N°')` |
| 14 | `IF ({0,28}='010','Mode de paiement','Payment method')` | `IF ({0,28}='010','Mode de paiement','Payment method')` |
| 15 | `IF ({0,28}='010','Taux','Rate')` | `IF ({0,28}='010','Taux','Rate')` |
| 16 | `IF ({0,28}='010','Montant devise locale','Amount local cu...` | `IF ({0,28}='010','Montant devise locale','Amount local cu...` |
| 17 | `IF ({0,28}='010','VENTE DE DEVISES','CURRENCY SALES')` | `IF ({0,28}='010','VENTE DE DEVISES','CURRENCY SALES')` |
| 18 | `IF ({0,28}='010','Merci de votre visite','Thank you for y...` | `IF ({0,28}='010','Merci de votre visite','Thank you for y...` |
| 19 | `IF ({0,28}='010','Paiement','Payment')` | `IF ({0,28}='010','Paiement','Payment')` |
| 20 | `IF ({0,28}='010','Devise','Currency')` | `IF ({0,28}='010','Devise','Currency')` |
| 21 | `'TRUE'LOG` | `'TRUE'LOG` |
| 22 | `GetParam ('NUMBERCOPIES')` | `GetParam ('NUMBERCOPIES')` |
| 1 | `Counter (0)>={1,40}` | `Counter (0)>={1,40}` |
| 2 | `SetParam ('CURRENTPAGENUMBER',0)` | `SetParam ('CURRENTPAGENUMBER',0)` |
| 3 | `IsFirstRecordCycle(0)` | `IsFirstRecordCycle(0)` |
| 1 | `{32768,44}` | `VG.VG_FAX_VISIBLE` |
| 2 | `{2,1}` | `{2,1}` |
| 3 | `{2,2}` | `{2,2}` |
| 4 | `{2,4}` | `{2,4}` |
| 5 | `{2,5}` | `{2,5}` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 5 (0 W / 5 R) |
| Parametres | 14 |
| Variables locales | 27 |
| Expressions | 316 |
| Expressions 100% decodees | 224 (71%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*
