# Analyse des Mises à Jour des Dates de Location - Projet PVE

**Date**: 2026-01-04
**Projet**: PVE (Point de Vente/POS)
**Objet**: Traçage des points de mise à jour des dates de location ski/matériel

---

## 1. Tables Principales

### pv_rentals_dat (id=400) - Table principale des locations
| Colonne ID | Nom | Type | Description |
|------------|-----|------|-------------|
| 7 | #_rental_days_requested | Numeric | Nombre de jours de location demandés |
| 8 | date_out | Date | **Date de début de location** |
| 10 | date_in | Date | **Date de fin de location** |

### pv_rentals_histo_dat (id=401) - Historique des locations
Structure similaire à pv_rentals_dat, contient l'historique des locations passées.

---

## 2. Programmes avec Accès WRITE à pv_rentals_dat (obj=400)

### Vue d'ensemble

| Programme | Nom | Dossier | Dernière Modification | Priorité |
|-----------|-----|---------|----------------------|----------|
| **Prg_190** | Package=> account | Mobile POS (15) | **26/11/2025** | CRITIQUE |
| **Prg_186** | Select Product | Mobile POS (15) | **14/11/2025** | HAUTE |
| Prg_175 | Saisie Prepaid | Menu (14) | 04/04/2023 | BASSE |
| Prg_165 | GetNbrProdBookerWithoutBooking | Interface Booker (13) | 15/04/2019 | BASSE |

---

## 3. ANALYSE DÉTAILLÉE - Prg_190 "Package=> account"

**Dossier**: Mobile POS (dossier 15, position 196)
**Fichier**: `D:\Data\Migration\XPA\PMS\PVE\Source\Prg_190.xml`

### Sous-tâches avec modifications récentes

| Hiérarchie | Nom | Ligne XML | Dernière Modification |
|------------|-----|-----------|----------------------|
| **190.1** | Package=> account | 14-55 | 26/11/2025 12:02:22 |
| **190.13** | package | 4491-4505 | 26/11/2025 12:02:22 |
| **190.8** | SALE package_Add_Qté | 6794-6808 | 30/10/2025 11:32:51 |
| 190.7 | SALE package_Creat | 5649-5663 | 18/11/2024 15:57:47 |

### POINTS CRITIQUES - Opérations UPDATE sur les dates

**Localisation**: Prg_190.8 "SALE package_Add_Qté" → après création rental

| Ligne XML | FieldID | Colonne | Expression | Description |
|-----------|---------|---------|------------|-------------|
| **7172-7177** | 7 | #_rental_days_requested | Expression 7 | Cumul jours location |
| **7208-7213** | 8 | date_out | Expression 8 | Date de sortie |
| **7222-7227** | 10 | date_in | Expression 9 | Date de retour |
| 7233-7238 | 11 | time_out | Expression 10 | Heure sortie |
| 7244-7249 | 12 | time_in | Expression 11 | Heure retour |

### Expressions de calcul (lignes 7297-7311)

```
190.8 ligne 7297: Expression 7 = {0,7}+{1,11}           → Cumul quantités
190.8 ligne 7301: Expression 8 = (IF({1,13}=0,{1,68},{1,13})*{1,11})+{0,8}  → Calcul prix
190.8 ligne 7305: Expression 9 = Date()                 → DATE DU JOUR ← ATTENTION
190.8 ligne 7309: Expression 10 = Time()                → HEURE DU JOUR
```

---

## 4. ANALYSE DÉTAILLÉE - Prg_186 "Select Product"

**Dossier**: Mobile POS (dossier 15, position 192)
**Fichier**: `D:\Data\Migration\XPA\PMS\PVE\Source\Prg_186.xml`

### Sous-tâches avec modifications récentes

| Hiérarchie | Nom | Ligne XML | Dernière Modification |
|------------|-----|-----------|----------------------|
| **186.1** | Select Product | 14-38 | 14/11/2025 12:17:46 |
| **186.3** | Product | 5144-5163 | 14/11/2025 12:17:46 |
| **186.2** | Sub Category | 4132-4150 | 07/11/2025 11:31:34 |
| **186.12** | Mise à jour des produits sémin | 7960-7974 | 04/11/2025 16:54:02 |

### Accès WRITE à pv_rentals_dat

Prg_186 a accès WRITE dans plusieurs sous-tâches mais délègue la création effective à Prg_190 via le flux package.

---

## 5. Prg_189 "Package Rental date" - Calendrier

**Dossier**: Mobile POS (dossier 15, position 195)
**Fichier**: `D:\Data\Migration\XPA\PMS\PVE\Source\Prg_189.xml`
**Dernière modification**: 16/05/2019 ← NON MODIFIÉ RÉCEMMENT

### Sous-tâches

| Hiérarchie | Nom | Ligne XML | Dernière Modification |
|------------|-----|-----------|----------------------|
| 189.1 | Package Rental date | 14-33 | 16/05/2019 17:18:55 |
| 189.2 | calendar (rental) | 223-237 | 20/07/2017 15:10:57 |

**Rôle**: Interface calendrier pour sélection des dates par l'utilisateur.
**Note**: Ce programme n'a PAS été modifié depuis 2019.

---

## 6. Flux de Création des Locations

```
┌─────────────────────────────────────────────────────────────────────┐
│                        FLUX CRÉATION LOCATION                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Prg_186.1 "Select Product"                                         │
│      │ (Mobile POS, modifié 14/11/2025)                             │
│      │                                                               │
│      ├──> Prg_186.3 "Product"                                       │
│      │        (modifié 14/11/2025)                                  │
│      │        → Sélection du produit location                       │
│      │                                                               │
│      └──> Prg_189.1 "Package Rental date"                           │
│               │ (NON modifié - 16/05/2019)                          │
│               │                                                      │
│               └──> Prg_189.2 "calendar (rental)"                    │
│                        → Interface calendrier dates                 │
│                        → Retourne: p.date start, p.date end        │
│                                                                      │
│  ════════════════════════════════════════════════════════════════   │
│                                                                      │
│  Prg_190.8 "SALE package_Add_Qté"                                   │
│      │ (Mobile POS, modifié 30/10/2025)                             │
│      │                                                               │
│      └──> UPDATE pv_rentals_dat (lignes 7172-7249)                  │
│               FieldID 7:  rental_days ← Expression 7 (cumul)        │
│               FieldID 8:  date_out    ← Expression 8 (calcul)       │
│               FieldID 10: date_in     ← Expression 9 = Date() !!!   │
│               FieldID 11: time_out    ← Expression 10 = Time()      │
│               FieldID 12: time_in     ← Expression 11               │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 7. Programmes à IGNORER

### Prg_207 "Vérification Skier Profile" - FAUX POSITIF

**Modifié**: 22/04/2025
**Dossier**: Zoom (dossier 22)
**Fichier**: `D:\Data\Migration\XPA\PMS\PVE\Source\Prg_207.xml`

**IMPORTANT**: Ce programme NE modifie PAS les dates de location.
- Accède à la table GM profile (id=382), pas à pv_rentals_dat
- Valide uniquement le profil skieur (taille, poids, pointure, type ski, etc.)
- Vérifie si le profil est complet avant la location

---

## 8. Points d'Investigation Prioritaires

### À vérifier EN PREMIER:

| Priorité | Programme | Hiérarchie | Ligne | Quoi regarder |
|----------|-----------|------------|-------|---------------|
| 1 | Prg_190 | **190.8** | 7222-7227 | Update FieldID=10 (date_in) avec Date() |
| 2 | Prg_190 | **190.8** | 7208-7213 | Update FieldID=8 (date_out) |
| 3 | Prg_190 | **190.8** | 7305-7307 | Expression 9 = Date() ← SUSPECT |
| 4 | Prg_190 | **190.13** | 4491-4505 | Sous-tâche "package" (26/11/2025) |
| 5 | Prg_186 | **186.12** | 7960-7974 | "Mise à jour produits sémin" (04/11/2025) |

### Questions à se poser:

1. **L'expression `Date()` à la ligne 7305** est-elle le problème?
   - Elle assigne la DATE DU JOUR à date_in au lieu de la date sélectionnée dans le calendrier

2. **Les modifications du 26/11/2025** (Prg_190.1 et 190.13) ont-elles changé la logique?
   - Comparer avec une version antérieure si disponible

3. **Le flux entre Prg_186 et Prg_190** transmet-il correctement les dates?
   - Vérifier les paramètres passés

---

## 9. Commandes pour Investigation

```bash
# Voir l'expression Date() dans Prg_190
grep -n "Date()" D:\Data\Migration\XPA\PMS\PVE\Source\Prg_190.xml

# Voir tous les Updates sur les champs date
grep -n "FieldID val=\"[78]\"" D:\Data\Migration\XPA\PMS\PVE\Source\Prg_190.xml
grep -n "FieldID val=\"10\"" D:\Data\Migration\XPA\PMS\PVE\Source\Prg_190.xml

# Comparer les expressions entre sous-tâches
grep -A2 "Expression id=\"9\"" D:\Data\Migration\XPA\PMS\PVE\Source\Prg_190.xml
```

---

## 10. Résumé Exécutif

| Point | Détail |
|-------|--------|
| **Point chaud** | Prg_190.8 ligne 7305: `Date()` assignée à date_in |
| **Dernière modif critique** | 26/11/2025 sur Prg_190.1 et 190.13 |
| **Calendrier (Prg_189)** | NON modifié depuis 2019 - probablement pas le problème |
| **Faux positif écarté** | Prg_207 (profil skieur) ne touche pas aux dates |
| **Dossier commun** | Tous les programmes critiques sont dans "Mobile POS" |

---

*Rapport généré le 2026-01-04 pour analyse ticket support dates de location ski.*
