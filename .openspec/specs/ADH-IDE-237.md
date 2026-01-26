# ADH IDE 237 - Transaction Nouv vente avec GP

> **Version spec**: 3.0
> **Analyse**: 2026-01-26 22:52 → 22:58
> **Source**: `Prg_233.xml`

---

<!-- TAB:Fonctionnel -->

## SPECIFICATION FONCTIONNELLE

### 1.1 Objectif metier

| Element | Description |
|---------|-------------|
| **Qui** | Operateur de caisse |
| **Quoi** | Ecran de transaction de vente avec Gift Pass |
| **Pourquoi** | Permettre la vente avec paiement par Gift Pass |
| **Declencheur** | Selection menu "Nouvelle vente" avec compte Gift Pass |

### 1.2 Regles metier

| Code | Regle | Condition |
|------|-------|-----------|
| RM-001 | Verification solde GP | Solde Gift Pass suffisant |
| RM-002 | Gestion services VRL/VSL | Selon parametre `W0 sous-imput.` |
| RM-003 | Calcul total vente | `W0 Titre * W0 Date du transfert Retour` |
| RM-004 | Validation date activite | VAE pendant le sejour uniquement |

### 1.3 Flux utilisateur

1. Selection article depuis catalogue
2. Saisie quantite et prix unitaire
3. Verification solde Gift Pass disponible
4. Application reduction si code promo
5. Validation transaction
6. Mise a jour compteurs et statistiques

### 1.4 Cas d'erreur

| Erreur | Comportement |
|--------|--------------|
| Solde GP insuffisant | Message d'erreur, refus transaction |
| Article derniere minute invalide | Warning, demande confirmation |
| Cloture en cours | Blocage saisie, message informatif |

---

<!-- TAB:Technique -->

## SPECIFICATION TECHNIQUE

### 2.1 Identification

| Attribut | Valeur |
|----------|--------|
| **Format IDE** | ADH IDE 237 |
| **Fichier XML** | Prg_233.xml |
| **Type** | O (Online) |
| **Parametres** | 20 |
| **Module** | ADH |
| **Dossier IDE** | Ventes |

### 2.2 Tables (30 tables - 9 en ecriture)

| IDE# | Nom Physique | Nom Logique | Access | Usage |
|------|--------------|-------------|--------|-------|
| #23 | `cafil001_dat` | reseau_cloture___rec | **W** | 5x |
| #32 | `cafil010_dat` | prestations | **W** | 3x |
| #46 | `cafil024_dat` | mvt_prestation___mpr | **W** | 2x |
| #47 | `cafil025_dat` | compte_gm________cgm | **W** | 2x |
| #68 | `cafil046_dat` | compteurs________cpt | **W** | 1x |
| #596 | `%club_user%tmp_ecrpolice_dat` | tempo_ecran_police | **W** | 7x |
| #847 | `%club_user%_stat_lieu_vente_date` | stat_lieu_vente_date | **W** | 13x |
| #899 | `Boo_ResultsRechercheHoraire` | Boo_ResultsRechercheHoraire | **W** | 8x |
| #1037 | `Table_1037` | Unknown | **W** | 3x |
| #26 | `cafil004_dat` | comptes_speciaux_spc | R | 1x |
| #30 | `cafil008_dat` | gm-recherche_____gmr | R | 3x |
| #34 | `cafil012_dat` | hebergement______heb | R | 1x |
| #39 | `cafil017_dat` | depot_garantie___dga | R | 1x |
| #50 | `cafil028_dat` | moyens_reglement_mor | R | 3x |
| #67 | `cafil045_dat` | tables___________tab | R | 1x |
| #70 | `cafil048_dat` | date_comptable___dat | R | 1x |
| #77 | `cafil055_dat` | articles_________art | R | 4x |
| #79 | `cafil057_dat` | gratuites________gra | R | 1x |
| #89 | `cafil067_dat` | moyen_paiement___mop | R | 8x |
| #96 | `cafil074_dat` | table_prestation_pre | R | 1x |
| #103 | `cafil081_dat` | logement_client__loc | R | 1x |
| #109 | `cafil087_dat` | table_utilisateurs | R | 1x |
| #139 | `cafil117_dat` | moyens_reglement_mor | R | 1x |
| #140 | `cafil118_dat` | moyen_paiement___mop | R | 1x |
| #197 | `caisse_artstock` | articles_en_stock | R | 1x |
| #372 | `pv_budget_dat` | pv_budget | R | 1x |
| #697 | `droits` | droits_applications | R | 1x |
| #728 | `arc_cctotal` | arc_cc_total | R | 1x |
| #801 | `moyens_reglement_complem` | moyens_reglement_complem | R | 1x |
| #818 | `zcircafil146` | Circuit supprime | R | 1x |

### 2.3 Parametres d'entree (20)

| # | Nom | Type |
|---|-----|------|
| P1 | P0 societe | ALPHA |
| P2 | P0 devise locale | ALPHA |
| P3 | P0 masque montant | ALPHA |
| P4 | P0 solde compte | NUMERIC |
| P5 | P0 code GM | NUMERIC |
| P6 | P0 filiation | NUMERIC |
| P7 | P0 date fin sejour | DATE |
| P8 | P0 etat compte | ALPHA |
| P9 | P0 date solde | DATE |
| P10 | P0 garanti O/N | ALPHA |
| P11 | P0 Nom & prenom | ALPHA |
| P12 | P0 UNI/BI | ALPHA |
| P13 | Bouton IDENTITE | ALPHA |
| P14 | Bouton ABANDON | ALPHA |
| P15 | W0 FIN SAISIE OD | LOGICAL |
| P16 | Bouton FIN SAISIE OD | ALPHA |
| P17 | W0 Cloture en cours | LOGICAL |
| P18 | W0 code article | NUMERIC |
| P19 | W0 imputation | NUMERIC |
| P20 | W0 sous-imput. | NUMERIC |

### 2.4 Expressions cles

| # | Expression | Signification |
|---|------------|---------------|
| 6 | `NOT {32768,38}` | Gift Pass v2.00 non actif |
| 21 | `{0,21}` | Code reduction applique |
| 22 | `{0,49}>0 AND {0,48}=0` | Titre sans retour |
| 26 | `{0,23}='VRL' OR {0,23}='VSL'` | Service VRL ou VSL |

### 2.5 Statistiques

| Metrique | Valeur |
|----------|--------|
| Tables | 30 (9W / 21R) |
| Expressions | 849 |
| Expressions decodees | 547 (64%) |
| Variables locales | 171 |

---

<!-- TAB:Cartographie -->

## CARTOGRAPHIE APPLICATIVE

### 3.1 Callers (programmes qui appellent ADH IDE 237)

| IDE | Programme | Description | Nb appels | Dossier |
|-----|-----------|-------------|-----------|---------|
| 166 | ADH IDE 166 | Menu caisse GM - scroll | 1 | Menus |
| 242 | ADH IDE 242 | Menu Choix Saisie/Annul vente | 1 | Ventes |
| 317 | ADH IDE 317 | Saisie transaction Nouv vente | 1 | **Suppr** |

> **Total**: 3 appels depuis 3 programmes (2 actifs + 1 orphelin)

### 3.2 Callees (programmes appeles par ADH IDE 237)

| IDE | Programme | Description | Contexte |
|-----|-----------|-------------|----------|
| - | Aucun | Ce programme n'appelle pas d'autres programmes | - |

### 3.3 Diagramme de dependances

```mermaid
graph TD
    subgraph Callers["Programmes appelants"]
        C1[ADH IDE 166<br/>Menu caisse GM - scroll]
        C2[ADH IDE 242<br/>Menu Choix Saisie/Annul]
        C3[ADH IDE 317<br/>Saisie transaction Nouv vente]
    end

    subgraph Target["Programme cible"]
        T[ADH IDE 237<br/>Transaction Nouv vente avec GP]
    end

    C1 -->|1 appel| T
    C2 -->|1 appel| T
    C3 -.->|1 appel| T

    style T fill:#58a6ff,color:#000
    style C1 fill:#3fb950,color:#000
    style C2 fill:#3fb950,color:#000
    style C3 fill:#f85149,color:#000
```

> **Legende**: Vert = Caller actif | Rouge = Caller orphelin (Suppr) | Pointille = Ne compte pas

### 3.4 Verification orphelin

| Critere | Resultat |
|---------|----------|
| Callers (TaskID obj="233") | **3 programmes** |
| Callers actifs | 2 (Prg_162, Prg_238) |
| Callers orphelins | 1 (Prg_313 dans Suppr) |
| PublicName | Non |
| Dossier | Ventes (actif) |
| **Conclusion** | **Programme ACTIF - NON ORPHELIN** |

### 3.5 Impact modification

| Type de changement | Programmes impactes | Severite |
|--------------------|---------------------|----------|
| Modification signature | 2 programmes actifs | HAUTE |
| Changement logique GP | Aucun (local) | BASSE |
| Ajout parametre | 2 programmes actifs | MOYENNE |

### 3.6 Note sur ADH IDE 317

Le programme ADH IDE 317 (Prg_313.xml) est dans le dossier **Suppr** (orphelin). Son appel vers ADH IDE 237 ne compte pas comme utilisation active car lui-meme n'est jamais appele.

---

## HISTORIQUE

| Date | Action | Auteur |
|------|--------|--------|
| 2026-01-26 | Creation specification v2.0 | Claude |
| 2026-01-26 | Ajout section callers et verification orphelin | Claude |
| 2026-01-26 | **Upgrade v3.0**: 3 onglets, timing, cartographie Mermaid | Claude |

---

*Specification v3.0 - Format avec onglets Fonctionnel/Technique/Cartographie*
