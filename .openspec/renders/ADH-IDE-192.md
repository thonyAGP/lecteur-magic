# ADH IDE 192 - Calcul si depôt existe

> **Version spec** : 2.1 (Enhanced)
> **Genere le** : 2026-01-27
> **Source** : `D:\Data\Migration\XPA\PMS\ADH\Source\Prg_191.xml`

---

---

<!-- TAB:Fonctionnel -->

## 1. IDENTIFICATION

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 192 |
| **Fichier XML** | Prg_191.xml |
| **Description** | Calcul si depôt existe |
| **Type** | B (O=Online, B=Batch) |
| **Parametres** | 5 |
| **Module** | ADH |
| **Dossier IDE** | Solde |

> **Note**: Ce programme est Prg_191.xml. L'ID XML (191) peut differer de la position IDE (192).


---

## PARTIE I: SPECIFICATION FONCTIONNELLE (Annotations)

### 1.1 Objectif Metier
- **Qui**: Systeme / Programme appelant
- **Quoi**: Calculer le solde d'un compte adherent
- **Pourquoi**: Fournir le solde actuel pour validation operations ou affichage
### 1.2 Flux Utilisateur
1. Appel avec parametres (societe, compte, filiation)
2. Lecture operations et totaux par type
3. Calcul solde = SUM(credits) - SUM(debits)
4. Retour valeur solde au programme appelant

### 1.3 Notes Migration
- Fonction utilitaire - pas d'interface
- Query simple sur tables operations et ccpartyp
- Utilise comme sous-routine par de nombreux programmes
- Deja migre: GetSoldeCompteQuery dans API C#

### 1.4 Dependances ECF

PARTAGE via ADH.ecf (Sessions_Reprises) - Appele depuis PBP et PVE

### 1.5 Tags
`solde``, ``ecf-shared``, ``cross-project``, ``utility``, ``migrated`

---

---

<!-- TAB:Technique -->

## 2. TABLES (3 tables - 0 en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #41 | `cafil019_dat` | depot_objets_____doa | R | 1x |
| #43 | `cafil021_dat` | solde_devises____sda | R | 1x |
| #456 | `taistart` | tai_demarrage | R | 1x |

---

## 3. PARAMETRES D'ENTREE (5)

| # | Nom | Type | Description |
|---|-----|------|-------------|
| P1 | PI Societe | ALPHA | - |
| P2 | PI Compte | NUMERIC | - |
| P3 | PO Existe objet | LOGICAL | - |
| P4 | PO Existe devise | LOGICAL | - |
| P5 | P0 Existe scelle | LOGICAL | - |
| P6 | VexisteObjet | LOGICAL | - |
| P7 | VexisteDevise | LOGICAL | - |
| P8 | VexisteScelle | LOGICAL | - |

---

## 4. VARIABLES PRINCIPALES

### 4.1 Variables de travail (W0/V0)

| Nom | Type | Role |
|-----|------|------|

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

> Total: 134 variables mappees

---

## 5. EXPRESSIONS (6 total, 4 decodees)

| # | Expression brute | Decode |
|---|------------------|--------|
| 1 | `{0,1}` | `PI Compte` |
| 2 | `{0,2}` | `PO Existe objet` |
| 3 | `'O'` | `'O'` |
| 4 | `{0,6}` | `VexisteDevise` |
| 5 | `IF ({0,13} AND {0,18}<>0,'TRUE'LOG,'FALSE'LOG)` | `IF ({0,13} AND {0,18}<>0,'TRUE'LOG,'FALSE'LOG)` |
| 6 | `{0,19}` | `{0,19}` |

---

## 6. STATISTIQUES

| Metrique | Valeur |
|----------|--------|
| Tables | 3 (0 W / 3 R) |
| Parametres | 5 |
| Variables locales | 8 |
| Expressions | 6 |
| Expressions 100% decodees | 4 (67%) |

---

## 7. HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-27 | Creation specification v2.0 | Claude |

---

*Specification v2.0 - Generee automatiquement par Generate-ProgramSpecV2.ps1*

---

<!-- TAB:Cartographie -->

## CARTOGRAPHIE

*Aucun callee identifie - programme terminal ou appels dynamiques*

### Metriques

| Metrique | Valeur |
|----------|--------|
| Tables | 3 |
| Expressions | 6 |
| Complexite | Faible |

---

*Spec V2.1 avec marqueurs TAB - Genere automatiquement*
