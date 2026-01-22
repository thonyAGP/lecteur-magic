# PMS-1457 - Caution forfait ski automatique St Moritz

> **Jira** : [PMS-1457](https://clubmed.atlassian.net/browse/PMS-1457)
> **Protocole** : `.claude/protocols/ticket-analysis.md` appliqué

---

<!-- ONGLET: Contexte -->
## 1. Contexte Jira

| Élément | Valeur |
|---------|--------|
| **Demande** | Charger automatiquement 25 CHF de caution forfait ski |
| **Village** | St Moritz (SMRC) |
| **Déclencheur** | Clôture de nuit du jour d'arrivée |
| **Reporter** | À confirmer |
| **Date** | 2026-01-22 |

### Règles métier

| Règle | Critère | Action |
|-------|---------|--------|
| **Inclusion** | GM arrivant le jour J à SMRC | Créer caution 25 CHF |
| **Exclusion 1** | Code presta = SMRNS1 | Pas de caution |
| **Exclusion 2** | Âge < 6 ans | Pas de caution |
| **Exclusion 3** | GM non validé | Pas de caution |
| **Configuration** | Par code projet (village) | Activable/désactivable |
| **Heure** | **Heure système** au moment du traitement | `Time(0)` |

---

<!-- ONGLET: Localisation -->
## 2. Localisation - Point d'injection

### Programme de clôture

| Projet | IDE | Fichier | Nom | Rôle |
|--------|-----|---------|-----|------|
| **REF** | **621** | Prg_620.xml | Cloture OB | Orchestrateur clôture nuit |
| **REF** | **619** | Prg_618.xml | Calcul Cloture OB | Calculs pré-clôture |

### Arborescence REF IDE 621

```
REF IDE 621 - Cloture OB
├── 621.1  - Choix Date Comptable
├── 621.2  - Affichage Cloture
├── 621.3  - Cloture sauvegarde
├── 621.4  - RAZ Cloture sauvegarde
├── 621.5  - Creation OD
├── 621.6  - Creation caisse recette
├── 621.7  - Remise a 0 Cloture
├── 621.8  - Remise a 0 Vente
├── 621.9  - Validation caisse cloture
├── 621.10 - Gestion Cloture
├── 621.11 - Affectation Numero Session
├── 621.12 - Affectation Numero Session Vente
├── 621.13 - [NOUVEAU] Caution forfait ski auto   ◄── AJOUTER ICI
└── 621.14 - Maj donnees Village
```

---

<!-- ONGLET: Tables -->
## 3. Tables concernées

### Table n°168 - heb_circuit (cafil146_dat)

**Rôle** : Source principale des GM éligibles (arrivées du jour)

| Champ | Type | Description | Usage |
|-------|------|-------------|-------|
| `hci_societe` | Alpha | Code société/village | Filtre SMRC |
| `hci_num_compte` | Numeric | Numéro compte GM | Clé |
| `hci_filiation` | Numeric | Filiation | Clé |
| `hci_package` | Alpha | **Code circuit/presta** | Exclusion SMRNS1 |
| `hci_date_debut` | Date | **Date début séjour** | = DateComptable |
| `hci_age_num` | Numeric | **Âge numérique** | Exclusion < 6 |

**Index** : `cafil146_dat_IDX_1` (societe, num_compte, filiation)

### Table n°47 - compte_gm (cafil025_dat)

**Rôle** : Vérification validation GM

| Champ | Type | Description | Usage |
|-------|------|-------------|-------|
| `cgm_societe` | Alpha | Code société | Clé |
| `cgm_num_compte` | Numeric | Numéro compte | Clé |
| `cgm_filiation` | Numeric | Filiation | Clé |
| `cgm_etat` | Alpha(1) | **État GM** | 'V' = validé |
| `cgm_flag` | Alpha | Flag supplémentaire | Optionnel |

### Table n°39 - depot_garantie (cafil017_dat)

**Rôle** : Stockage de la caution créée

| Champ | Type | Description | Valeur | Source |
|-------|------|-------------|--------|--------|
| `dga_societe` | Alpha | Code société | hci_societe | Table |
| `dga_compte` | Numeric | Numéro compte | hci_num_compte | Table |
| `dga_filiation` | Numeric | Filiation | hci_filiation | Table |
| `dga_type` | Alpha | **Type garantie** | 'SKI' | Constante |
| `dga_montant` | Numeric | **Montant** | 25.00 | Config (dvi_reserve6) |
| `dga_date` | Date | Date création | P.DateComptable | Paramètre |
| `dga_heure` | Time | **Heure création** | **Time(0)** | **SYSTÈME** |
| `dga_operateur` | Alpha | Opérateur | 'BATCH_CLOTURE' | Constante |

### Table n°27 - donnees_village (cafil005_dat)

**Rôle** : Configuration par village

| Champ | Type | Description | Valeur SMRC |
|-------|------|-------------|-------------|
| `dvi_societe` | Alpha | Code société | 'SMRC' |
| `dvi_reserve5` | Alpha | **Flag activation** | 'SKI' |
| `dvi_reserve6` | Numeric | **Montant caution** | 25.00 |

---

<!-- ONGLET: Spécification -->
## 4. Spécification technique

### 4.1 Nouvelle sous-tâche à créer

**Nom** : `Caution forfait ski auto`
**Type** : Batch
**Parent** : REF IDE 621 (après tâche 621.12)

### 4.2 DataView

```
Main Source: Table n°168 (heb_circuit) - READ
  Range: hci_date_debut = P.DateComptable

Link 1: Table n°47 (compte_gm) - READ
  Clés: cgm_societe = hci_societe
        cgm_num_compte = hci_num_compte
        cgm_filiation = hci_filiation

Link 2: Table n°27 (donnees_village) - READ
  Clé: dvi_societe = hci_societe

Link 3: Table n°39 (depot_garantie) - WRITE
  Pour création enregistrement
```

### 4.3 Variables virtuelles

| Variable | Type | Expression | Description | Source |
|----------|------|------------|-------------|--------|
| V.SkiActif | Logical | `dvi_reserve5 = 'SKI'` | Village configuré | Config |
| V.MontantCaution | Numeric | `dvi_reserve6` | Montant depuis config | Config |
| V.CautionExiste | Logical | DbCount(...) > 0 | Anti-doublon | Calcul |
| **V.HeureTraitement** | **Time** | **`Time(0)`** | **Heure système** | **SYSTÈME** |

### 4.4 Logic - Record Main

```
Ligne 1:  IF NOT V.SkiActif THEN
Ligne 2:    RETURN                    -- Village non configuré
Ligne 3:  END IF

Ligne 4:  IF hci_package = 'SMRNS1' THEN
Ligne 5:    RETURN                    -- Exclusion code presta
Ligne 6:  END IF

Ligne 7:  IF hci_age_num < 6 THEN
Ligne 8:    RETURN                    -- Exclusion enfants
Ligne 9:  END IF

Ligne 10: IF cgm_etat <> 'V' THEN
Ligne 11:   RETURN                    -- GM non validé
Ligne 12: END IF

Ligne 13: IF V.CautionExiste THEN
Ligne 14:   RETURN                    -- Doublon évité
Ligne 15: END IF

Ligne 16: -- Créer la caution
Ligne 17: UPDATE Link 3 (depot_garantie):
Ligne 18:   dga_societe    = hci_societe
Ligne 19:   dga_compte     = hci_num_compte
Ligne 20:   dga_filiation  = hci_filiation
Ligne 21:   dga_type       = 'SKI'
Ligne 22:   dga_montant    = V.MontantCaution
Ligne 23:   dga_date       = P.DateComptable
Ligne 24:   dga_heure      = Time(0)           ◄── HEURE SYSTÈME
Ligne 25:   dga_operateur  = 'BATCH_CLOTURE'
```

### 4.5 Expression anti-doublon

```
V.CautionExiste = DbCount(Table n°39,
  dga_societe = hci_societe AND
  dga_compte = hci_num_compte AND
  dga_filiation = hci_filiation AND
  dga_type = 'SKI') > 0
```

---

<!-- ONGLET: Configuration -->
## 5. Configuration village

### Activation pour St Moritz (SMRC)

```sql
UPDATE cafil005_dat
SET dvi_reserve5 = 'SKI',
    dvi_reserve6 = 25.00
WHERE dvi_societe = 'SMRC';
```

### Désactivation

```sql
UPDATE cafil005_dat
SET dvi_reserve5 = '',
    dvi_reserve6 = 0
WHERE dvi_societe = 'SMRC';
```

### Extension à d'autres villages

Pour activer sur un autre village (ex: VBEL):
```sql
UPDATE cafil005_dat
SET dvi_reserve5 = 'SKI',
    dvi_reserve6 = 30.00  -- Montant différent possible
WHERE dvi_societe = 'VBEL';
```

---

<!-- ONGLET: Tests -->
## 6. Tests de validation

### Cas nominaux

| # | Scénario | Données | Résultat attendu |
|---|----------|---------|------------------|
| 1 | GM normal arrivée J | SMRC, age=30, validé, package=SMRSKI | ✅ Caution 25 CHF créée |
| 2 | GM famille 2 adultes | 2 GM même compte, validés | ✅ 2 cautions créées |
| 3 | GM arrivée J-1 | date_debut = J-1 | ❌ Pas de caution (pas ce jour) |

### Cas d'exclusion

| # | Scénario | Données | Résultat attendu |
|---|----------|---------|------------------|
| 4 | Code presta SMRNS1 | hci_package = 'SMRNS1' | ❌ Pas de caution |
| 5 | Enfant 5 ans | hci_age_num = 5 | ❌ Pas de caution |
| 6 | Enfant 6 ans | hci_age_num = 6 | ✅ Caution créée |
| 7 | GM non validé | cgm_etat = 'N' | ❌ Pas de caution |
| 8 | GM en attente | cgm_etat = 'A' | ❌ Pas de caution |

### Cas de configuration

| # | Scénario | Données | Résultat attendu |
|---|----------|---------|------------------|
| 9 | Village non configuré | dvi_reserve5 = '' | ❌ Pas de caution |
| 10 | Autre village configuré | VBEL avec SKI actif | ✅ Caution selon config |

### Cas de non-régression

| # | Scénario | Données | Résultat attendu |
|---|----------|---------|------------------|
| 11 | Caution déjà existante | Même GM, même type SKI | ❌ Pas de doublon |
| 12 | Caution autre type | Même GM, type='MATERIEL' | ✅ Nouvelle caution SKI |

### Cas heure système (MANDATORY)

| # | Scénario | Heure exécution | `dga_heure` attendu |
|---|----------|-----------------|---------------------|
| 13 | Clôture à 02:00 | 02:00:00 | 02:00:00 |
| 14 | Clôture à 03:30 | 03:30:15 | 03:30:15 |
| 15 | Clôture à 23:59 | 23:59:59 | 23:59:59 |

---

<!-- ONGLET: SQL -->
## 7. Requêtes SQL de vérification

### Vérifier GM éligibles (avant clôture)

```sql
-- GM arrivant le jour J à SMRC, éligibles à la caution
SELECT
    h.hci_societe,
    h.hci_num_compte,
    h.hci_filiation,
    h.hci_package,
    h.hci_age_num,
    c.cgm_etat
FROM cafil146_dat h  -- heb_circuit
JOIN cafil025_dat c  -- compte_gm
  ON c.cgm_societe = h.hci_societe
 AND c.cgm_num_compte = h.hci_num_compte
 AND c.cgm_filiation = h.hci_filiation
WHERE h.hci_societe = 'SMRC'
  AND h.hci_date_debut = @DateComptable
  AND h.hci_package <> 'SMRNS1'
  AND h.hci_age_num >= 6
  AND c.cgm_etat = 'V'
```

### Vérifier cautions créées (après clôture)

```sql
-- Cautions ski créées par le batch avec heure système
SELECT
    dga_societe,
    dga_compte,
    dga_filiation,
    dga_montant,
    dga_date,
    dga_heure,          -- ◄── HEURE SYSTÈME
    dga_operateur
FROM cafil017_dat  -- depot_garantie
WHERE dga_type = 'SKI'
  AND dga_date = @DateComptable
  AND dga_operateur = 'BATCH_CLOTURE'
ORDER BY dga_compte, dga_filiation
```

---

<!-- ONGLET: Flux -->
## 8. Diagramme de flux

```
┌─────────────────────────────────────────────────────────────┐
│  CLÔTURE DE NUIT - REF IDE 621                              │
│  DateComptable = Date du jour                               │
│  HeureTraitement = Time(0) ◄── HEURE SYSTÈME                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  Tâche 621.13 - Caution forfait ski auto                    │
│  ───────────────────────────────────────────────────────────│
│  FOR EACH heb_circuit WHERE date_debut = DateComptable      │
└─────────────────────────────────────────────────────────────┘
                              │
            ┌─────────────────┼─────────────────┐
            ▼                 ▼                 ▼
    ┌───────────────┐ ┌───────────────┐ ┌───────────────┐
    │ Village actif │ │ Package       │ │ Âge >= 6 ?    │
    │ (dvi_reserve5 │ │ <> SMRNS1 ?   │ │               │
    │  = 'SKI') ?   │ │               │ │               │
    └───────┬───────┘ └───────┬───────┘ └───────┬───────┘
            │ OUI             │ OUI             │ OUI
            └─────────────────┴─────────────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │ GM validé ?       │
                    │ (cgm_etat = 'V')  │
                    └─────────┬─────────┘
                              │ OUI
                              ▼
                    ┌───────────────────┐
                    │ Caution existe ?  │
                    │ (anti-doublon)    │
                    └─────────┬─────────┘
                              │ NON
                              ▼
                    ┌───────────────────┐
                    │ CRÉER CAUTION     │
                    │ depot_garantie    │
                    │ - type = 'SKI'    │
                    │ - montant = 25CHF │
                    │ - heure = Time(0) │ ◄── SYSTÈME
                    └───────────────────┘
```

---

<!-- ONGLET: Références -->
## 9. Références Magic IDE

### Tables

| N° Table | Nom Logique | Nom Physique | Rôle |
|----------|-------------|--------------|------|
| 27 | donnees_village | cafil005_dat | Configuration village |
| 39 | depot_garantie | cafil017_dat | Stockage caution |
| 47 | compte_gm | cafil025_dat | Validation GM |
| 168 | heb_circuit | cafil146_dat | Source arrivées |

### Programmes

| IDE | Projet | Nom | Fichier | Rôle |
|-----|--------|-----|---------|------|
| 621 | REF | Cloture OB | Prg_620.xml | Orchestrateur |
| 619 | REF | Calcul Cloture OB | Prg_618.xml | Calculs |
| 165 | ADH | Saisies cautions | Prg_164.xml | Modèle |

### Fonctions Magic utilisées

| Fonction | Usage | Retour |
|----------|-------|--------|
| `Time(0)` | **Heure système courante** | Time (HH:MM:SS) |
| `Date(0)` | Date système courante | Date |
| `DbCount()` | Comptage enregistrements | Numeric |

---

<!-- ONGLET: Statut -->
## 10. Statut

| Étape | Statut | Date |
|-------|--------|------|
| Analyse | ✅ Terminée | 2026-01-22 |
| Spécification | ✅ Terminée | 2026-01-22 |
| Validation solution | En attente | |
| Implémentation | En attente | |
| Tests | En attente | |
| Déploiement | En attente | |

---

*Dernière mise à jour : 2026-01-22T23:45*
*Programme à modifier : REF IDE 621 "Cloture OB"*
*Nouvelle tâche : 621.13 "Caution forfait ski auto"*
*Tables : n°168 (source), n°47 (validation), n°39 (écriture), n°27 (config)*
*Heure : Time(0) - HEURE SYSTÈME OBLIGATOIRE*
