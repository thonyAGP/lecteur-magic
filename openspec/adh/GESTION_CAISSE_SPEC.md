# OpenSpec: Module Gestion Caisse (ADH)

## Metadata
- **Module**: Gestion Caisse
- **Projet**: ADH
- **Dossier ID**: 12
- **Programmes**: 41 (id 115-155)
- **Statut**: ANALYSE COMPLETE
- **Date**: 2025-12-24

---

## 1. Vue d'ensemble

Le module **Gestion Caisse** est le coeur du systeme de caisse du Club Med. Il gere:
- Ouverture/Fermeture des sessions de caisse
- Gestion des devises multiples
- Apports (coffre, articles)
- Remises en caisse
- Generation des tickets et recapitulatifs
- Controle des ecarts

---

## 2. Liste des 41 programmes

### 2.1 Sessions et Club Med Pass (115-119)

| ID | Description | Public | Params |
|----|-------------|--------|--------|
| 115 | Creation des Club Med Pass | - | 2 |
| 116 | Calcul concurrence sessions | - | 5 |
| 117 | Historique session | - | 4 |
| 118 | Sessions ouvertes WS | - | 1 |
| 119 | Affichage sessions | - | 14 |

### 2.2 Coeur Caisse (120-125)

| ID | Description | Public | Params |
|----|-------------|--------|--------|
| 120 | Saisie contenu caisse | - | 105 |
| **121** | **Gestion caisse** | **Gestion_Caisse_142** | **17** |
| 122 | Ouverture caisse | - | 9 |
| 123 | Apport coffre | - | 15 |
| 124 | Apport articles | - | 26 |
| 125 | Remise en caisse | - | 33 |

### 2.3 Calculs et Controles (126-130)

| ID | Description | Params |
|----|-------------|--------|
| 126 | Calcul solde initial WS | 7 |
| 127 | Calcul solde ouverture WS | 4 |
| 128 | Controle ouverture caisse WS | 2 |
| 129 | Ecart ouverture caisse | 9 |
| 130 | Ecart fermeture caisse | 10 |

### 2.4 Fermeture et MAJ (131-135)

| ID | Description | Params |
|----|-------------|--------|
| 131 | Fermeture caisse | 22 |
| 132 | Historique session | 4 |
| 133 | Mise a jour comptage caisse WS | 6 |
| 134 | Mise a jour detail session WS | 18 |
| 135 | Generation tableau recap WS | 1 |

### 2.5 Tickets et Impressions (136-139)

| ID | Description | Params |
|----|-------------|--------|
| 136 | Generation ticket WS | 3 |
| 137 | Ticket ouverture session | 23 |
| 138 | Ticket fermeture session | 23 |
| 139 | Ticket appro remise | 71 |

### 2.6 Gestion Devises (140-148)

| ID | Description | Params |
|----|-------------|--------|
| 140 | Init apport article session WS | 3 |
| 141 | Init devise session WS | 13 |
| 142 | Devise update session WS | 1 |
| 143 | Devises calcul ecart WS | 3 |
| 144 | Devises finales F/F Nbre WS | 3 |
| 145 | Devises finales F/F Qte WS | 1 |
| 146 | Devises tableau recap WS | 5 |
| 147 | Devises des tickets WS | 14 |
| 148 | Devises RAZ WS | 5 |

### 2.7 Stock et Utilitaires (149-155)

| ID | Description | Public | Params |
|----|-------------|--------|--------|
| 149 | Calcul stock produit WS | CALC_STOCK_PRODUIT | 4 |
| 150 | Print comptage WS | - | 5 |
| 151 | Reimpression tickets fermeture | - | 21 |
| 152 | Recup Classe et Lib du MOP | RECUP_CLASSE_MOP | 6 |
| 153 | Calcul du stock devise | - | 4 |
| 154 | Tableau recap fermeture | - | 28 |
| 155 | Controle fermeture caisse WS | - | 147 |

---

## 3. Point d'entree: Prg_121 (Gestion caisse)

### 3.1 Signature

```
PUBLIC: Gestion_Caisse_142
TaskType: B (Batch)
Parametres: 17
```

### 3.2 Parametres d'entree

| # | Nom | Type | Description |
|---|-----|------|-------------|
| 1 | Libelle caisse | Alpha(32) | Nom de la caisse |
| 2 | Etat caisse | Alpha(1) | B=Bloquee, F=Fermee, O=Ouverte, Q=Quitter |
| 3 | Societe | Alpha(1) | Code societe |
| 4 | Devise locale | Alpha(3) | EUR, USD, BRL... |
| 5 | Nbre decimales | Numeric(1) | Precision devise |
| 6 | Masque montant | Alpha(16) | Format affichage |
| 7 | Code village | Alpha(3) | Code etablissement |
| 8 | Nom village | Alpha(30) | Nom etablissement |
| 9 | Masque cumul | Alpha(18) | Format cumuls |
| 10 | Uni/Bi | Alpha(1) | Mode uni/bidirectionnel |
| 11 | Village TAI | Alpha(1) | O=Oui, N=Non |
| 12 | Mode consultation | Boolean | Lecture seule |
| 13 | Terminal coffre2 | Numeric(3) | ID terminal |
| 14 | VIL open sessions | Alpha(1) | Sessions ouvertes |
| 15 | FROM_IMS | Alpha(1) | Source IMS |
| 16 | Hostl coffre2 | Unicode(50) | Hote coffre 2 |
| 17 | Host courant coffre 2 | Boolean | Indicateur |

### 3.3 Variables locales cles

| Nom | Type | Usage |
|-----|------|-------|
| V Date comptable | Date | Date de la session |
| V session active | Boolean | Session en cours |
| V User ouverture | Alpha(8) | Utilisateur |
| V Date/Time ouverture | Date/Time | Horodatage |
| V Last Chrono | Numeric(12) | Dernier chrono |
| V Cloture en cours | Boolean | Fermeture active |
| COFFRE 2 est ouvert | Boolean | Etat coffre 2 |

### 3.4 Flux d'appels

```
Prg_121 (Gestion caisse)
│
├── Sous-taches internes (2-32)
│   └── Logique de controle et navigation
│
├── Prg_116 (Calcul concurrence sessions)
│   └── Appele plusieurs fois pour verrouillage
│
├── Prg_119 (Affichage sessions)
│   └── Liste des sessions actives
│
├── Prg_122 (Ouverture caisse)
│   └── Initialisation nouvelle session
│
├── Prg_123 (Apport coffre)
│   └── Transfert depuis coffre
│
├── Prg_124 (Apport articles)
│   └── Ajout d'articles
│
├── Prg_131 (Fermeture caisse)
│   └── Cloture de session
│
├── Prg_134 (MAJ detail session WS)
│   └── Mise a jour des details
│
├── Prg_139 (Ticket appro remise)
│   └── Generation tickets
│
├── Prg_140 (Init apport article session WS)
│   └── Initialisation articles
│
├── Prg_141 (Init devise session WS)
│   └── Initialisation devises
│
└── Programmes externes
    ├── Prg_286 (hors Gestion Caisse)
    └── Prg_329 (hors Gestion Caisse)
```

---

## 4. Flux metier

### 4.1 Ouverture de session

```
1. Controle concurrence (Prg_116)
2. Verification session active
3. Ouverture caisse (Prg_122)
4. Init devises (Prg_141)
5. Calcul solde initial (Prg_126)
6. Generation ticket ouverture (Prg_137)
```

### 4.2 Operations en session

```
- Apport coffre (Prg_123)
- Apport articles (Prg_124)
- Remise en caisse (Prg_125)
- MAJ details (Prg_134)
- Generation tickets (Prg_139)
```

### 4.3 Fermeture de session

```
1. Controle fermeture (Prg_155)
2. Calcul ecarts (Prg_130)
3. Fermeture caisse (Prg_131)
4. Tableau recap (Prg_154)
5. Ticket fermeture (Prg_138)
6. Deblocage concurrence (Prg_116)
```

---

## 5. Tables utilisees (via REF)

### 5.1 Vue d'ensemble

| ID REF | Table physique | Nom Magic | Colonnes | Role |
|--------|----------------|-----------|----------|------|
| 70 | cafil048_dat | date_comptable___dat | 2 | Date comptable courante |
| 246 | caisse_session | histo_sessions_caisse | 8 | Sessions de caisse |
| 248 | caisse_session_coffre2 | sessions_coffre2 | ~8 | Sessions coffre 2 |
| 249 | caisse_session_detail | histo_sessions_caisse_detail | 24 | Details operations |
| 677 | caisse_parametres | parametres_caisse | 34 | Configuration caisse |
| 718 | user_dat | utilisateur______uti | 9 | Utilisateurs |

### 5.2 Table: caisse_session (principale)

```sql
CREATE TABLE caisse_session (
    utilisateur         NVARCHAR(8)     NOT NULL,  -- Utilisateur session
    chrono              NUMERIC(12)     NOT NULL,  -- ID unique session
    date_debut_session  CHAR(8)         NOT NULL,  -- YYYYMMDD
    heure_debut_session TIME            NOT NULL,  -- HH:MM:SS
    date_fin_session    CHAR(8)         NOT NULL,  -- YYYYMMDD
    heure_fin_session   TIME            NOT NULL,  -- HH:MM:SS
    date_comptable      CHAR(8)         NOT NULL,  -- Date comptable
    pointage            BIT             NOT NULL   -- Pointage effectue
);
-- Index: utilisateur + chrono (PK)
```

### 5.3 Table: caisse_session_detail

```sql
CREATE TABLE caisse_session_detail (
    utilisateur         NVARCHAR(8)     NOT NULL,  -- FK -> caisse_session
    chrono_session      NUMERIC(12)     NOT NULL,  -- FK -> caisse_session.chrono
    chrono_detail       NUMERIC(4)      NOT NULL,  -- Sequence dans session
    type                NVARCHAR(1)     NOT NULL,  -- Type operation
    quand               NVARCHAR(1)     NOT NULL,  -- O=Ouverture, P=Pendant, F=Fermeture
    date                CHAR(8)         NOT NULL,  -- Date operation
    heure               TIME            NOT NULL,  -- Heure operation
    montant             NUMERIC(12,3)   NULL,      -- Montant devise locale
    montant_monnaie     NUMERIC(12,3)   NULL,      -- Montant devise etrangere
    -- ... 15 colonnes supplementaires
);
-- Index: utilisateur + chrono_session + chrono_detail (PK)
```

### 5.4 Table: caisse_parametres

```sql
CREATE TABLE caisse_parametres (
    cle                             NVARCHAR(6)  NOT NULL,  -- Cle parametres
    mop_cmp                         NVARCHAR(4)  NOT NULL,  -- MOP comptant
    class_od                        NVARCHAR(6)  NOT NULL,  -- Classe OD
    compte_ecart_gain               NUMERIC(9)   NOT NULL,  -- Compte gains
    compte_ecart_perte              NUMERIC(9)   NOT NULL,  -- Compte pertes
    supprime_comptes_fin_centralise BIT          NOT NULL,  -- Flag
    supprime_mop_centralise         BIT          NOT NULL,  -- Flag
    article_compte_derniere_minute  NUMERIC(6)   NOT NULL,  -- Article DM
    compte_appro_caisse             NUMERIC(9)   NOT NULL,  -- Approvisionnement
    compte_remise_caisse            NUMERIC(9)   NOT NULL,  -- Remise
    compte_fdr_receptionniste       NUMERIC(9)   NOT NULL,  -- Fonds de roulement
    compte_bilan_mini_1             NUMERIC(9)   NOT NULL,  -- Bilan min
    compte_bilan_maxi_1             NUMERIC(9)   NOT NULL,  -- Bilan max
    -- ... 21 colonnes supplementaires
);
-- Index: cle (PK)
```

### 5.5 Table: cafil048_dat (date comptable)

```sql
CREATE TABLE cafil048_dat (
    dat_societe         NVARCHAR(1)     NOT NULL,  -- Code societe
    dat_date_comptable  CHAR(8)         NOT NULL   -- Date comptable YYYYMMDD
);
-- Index: dat_societe (PK)
```

### 5.6 Table: user_dat (utilisateurs)

```sql
CREATE TABLE user_dat (
    uti_groupe          NVARCHAR(20)    NOT NULL,  -- Groupe utilisateur
    uti_societe         NVARCHAR(1)     NOT NULL,  -- Code societe
    uti_user            NVARCHAR(8)     NOT NULL,  -- Login utilisateur
    uti_password        NVARCHAR(64)    NOT NULL,  -- Mot de passe (hash)
    uti_description     NVARCHAR(20)    NOT NULL,  -- Description
    uti_info            NVARCHAR(17)    NOT NULL,  -- Info complementaire
    -- ... 3 colonnes supplementaires
);
-- Index: uti_groupe + uti_societe + uti_user (PK)
```

### 5.7 Relations entre tables

```
cafil048_dat (date comptable)
     │
     └──> caisse_session (sessions)
              │
              ├──> caisse_session_detail (operations)
              │
              └──> caisse_session_coffre2 (coffre 2)

user_dat (utilisateurs)
     │
     └──> caisse_session.utilisateur (FK)

caisse_parametres (config)
     │
     └──> Parametres globaux caisse
```

---

## 6. Programmes partages (ADH.ecf)

Ces programmes sont exposes aux autres projets:

| ID | Nom Public | Appele par |
|----|------------|------------|
| 121 | Gestion_Caisse_142 | PBP, PVE |
| 149 | CALC_STOCK_PRODUIT | PBP, PVE |
| 152 | RECUP_CLASSE_MOP | PBP, PVE |

---

## 7. Complexite

| Metrique | Valeur | Commentaire |
|----------|--------|-------------|
| Programmes | 41 | Module le plus gros |
| Sous-taches Prg_121 | ~32 | Tres complexe |
| Appels externes | 10+ | Forte interdependance |
| Parametres Prg_121 | 17 | Interface riche |
| Parametres Prg_155 | 147 | Programme critique |

---

## 8. Prochaines etapes

1. [ ] Analyser les DataView de Prg_121 pour identifier les tables
2. [ ] Documenter les expressions de Prg_121
3. [ ] Analyser Prg_122 (Ouverture caisse) en detail
4. [ ] Analyser Prg_131 (Fermeture caisse) en detail
5. [ ] Identifier les tables REF utilisees
6. [ ] Creer le mapping vers SQL/TypeScript

---

*Document genere par Claude Code - 2025-12-24*
