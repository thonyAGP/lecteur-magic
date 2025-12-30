# OpenSpec: Migration MECANO

## Metadata
- **Module**: MECANO (Liste Mécanographique)
- **Source**: Magic Unipaas v12.03
- **Cible**: SQL Server
- **Statut**: VALIDE
- **Date validation**: 2025-12-22
- **Base de référence**: CSK0912 sur LENOVO_LB2I\SQLEXPRESS

---

## 1. Description fonctionnelle

Le module MECANO génère une **liste mécanographique** des clients présents dans un établissement sur une période donnée. Cette liste contient:
- Informations personnelles (nom, prénom, âge, sexe)
- Informations de séjour (logement, dates, lieu)
- Informations commerciales (fidélité, code vente, dossier)

### Cas d'usage
- Listes d'arrivées/départs
- Contrôle des présences
- Export vers systèmes tiers

---

## 2. Architecture Magic (Source)

### 2.1 Flux des programmes

```
Prg_18 (Liste Mecanographique) - Point d'entrée PBP
│
├── Prg_206 (RaZ tempos Mecano)
│       ↳ Reset des tables temporaires
│
├── Prg_243/664 (Liste mec preparation planning)
│       ↳ Prépare les données depuis gm-complet + hebergement
│
├── Prg_244/665 (Preparation Mecano) - Orchestrateur
│       ├── Prg_247/668 (Traitement Mecano 1) → tempo_mecano_1 (604)
│       ├── Prg_248/669 (Traitement Mecano 2) → tempo_mecano_2 (605)
│       ├── Prg_249/670 (Traitement Mecano 3) → tempo_mecano_3 (606)
│       └── Prg_250/671 (Groupage Mecano)
│
├── Prg_245/666 (Creation tempo ecran par nom)
│       ↳ Lit tempo_mecano_3 (606) → Écrit tempo_ecran_mecano (594)
│
└── Prg_246/667 (Creation tempo ecran par doss)
        ↳ Alternative tri par dossier
```

### 2.2 Tables impliquées

| ID | Nom Magic | Fichier physique | Rôle |
|----|-----------|------------------|------|
| 31 | gm-complet | cafil009_dat | Données clients |
| 34 | hebergement | cafil012_dat | Séjours/hébergements |
| 604 | tempo_mecano_1 | tmp_mec01_dat | Intermédiaire niveau 1 |
| 605 | tempo_mecano_2 | tmp_mec02_dat | Intermédiaire niveau 2 |
| 606 | tempo_mecano_3 | tmp_mec03_dat | Intermédiaire niveau 3 |
| 594 | tempo_ecran_mecano | tmp_ecrmec_dat | Sortie finale |

### 2.3 Différences PBP vs REF

| Aspect | PBP | REF |
|--------|-----|-----|
| IDs Programmes | 243-252 | 664-675 |
| Table sortie | 612 (tempo_present_excel) | 594 (tempo_ecran_mecano) |
| Point d'entrée | Prg_18 | Prg_664 |

---

## 3. Schéma base de données réelle (CSK0912)

### 3.1 Table cafil009_dat (gm-complet) - 83 colonnes

Colonnes principales utilisées:
```
gmc_societe              - Code société
gmc_compte               - Numéro de compte client
gmc_filiation_compte     - Filiation (0=titulaire, 1+=accompagnants)
gmc_titre                - Civilité (M., Mme, Me, Mr...)
gmc_nom_complet          - Nom de famille
gmc_prenom_complet       - Prénom
gmc_numero_adherent      - Numéro adhérent (decimal, 10 chiffres)
gmc_numero_dossier       - Numéro de dossier
gmc_date_naissance       - Date de naissance (YYYYMMDD)
gmc_code_vente           - Code vente (FR, SU, MA, ORDI...)
gmc_code_nationalite     - Code nationalité
gmc_pays_residence       - Code pays résidence
gmc_code_fidelite        - Code fidélité (M, V, GOLD, PLAT...)
gmc_type_de_client       - Type client (ST, VIP...)
gmc_liste_blanche        - Indicateur liste blanche
gmc_bebe                 - Indicateur bébé
```

### 3.2 Table cafil012_dat (hebergement) - 34 colonnes

Colonnes principales utilisées:
```
heb_societe              - Code société
heb_num_compte           - Numéro de compte (FK → gmc_compte)
heb_filiation            - Filiation (FK → gmc_filiation_compte)
heb_statut_sejour        - Statut (N=Normal, P=?)
heb_date_debut           - Date début séjour (YYYYMMDD)
heb_date_fin             - Date fin séjour (YYYYMMDD)
heb_code_logement        - Code logement (C2D, VV2...)
heb_nom_logement         - Nom logement
heb_lieu_de_sejour       - Lieu de séjour (G, P...)
heb_type_hebergement     - Type hébergement
heb_code_sexe            - Code sexe (M/F)
heb_age                  - Age (varchar, caractère)
heb_age_num              - Age numérique
heb_u_p_nb_occup         - Nb occupants (U1, U2, V...)
heb_nationalite          - Nationalité séjour
```

### 3.3 Table tempo_ecran_mecano - 22 colonnes (préfixe eme_)

```sql
eme_societe              NVARCHAR(10)    -- Code société
eme_user                 NVARCHAR(128)   -- Utilisateur session
eme_sequence             INT             -- Numéro séquence
eme_code_vente           NVARCHAR(50)    -- Code vente
eme_sexe                 NVARCHAR(10)    -- Civilité (Me/Mr)
eme_nom                  NVARCHAR(255)   -- Nom
eme_prenom               NVARCHAR(255)   -- Prénom
eme_numero               NVARCHAR(50)    -- Numéro adhérent
eme_age                  NVARCHAR(50)    -- Age (caractère)
eme_num_accompagnant     NVARCHAR(50)    -- Numéro accompagnant
eme_fil____accompagn     NVARCHAR(50)    -- Filiation accompagnant
eme_seminaire            NVARCHAR(100)   -- Code séminaire
eme_dossier              NVARCHAR(50)    -- Numéro dossier
eme_lieu_sejour          NVARCHAR(255)   -- Code lieu
eme_code_logement        NVARCHAR(50)    -- Code logement
eme__u_p__nb_occup       NVARCHAR(20)    -- Nb occupants
eme_fin_sejour           DATETIME        -- Date fin séjour
eme_circuit              NVARCHAR(50)    -- Circuit
eme_bebe                 NVARCHAR(10)    -- Indicateur ('S' si fidélité)
eme_millesia             NVARCHAR(50)    -- Code fidélité
eme_nom_logement         NVARCHAR(255)   -- Nom logement
eme_age_num              NVARCHAR(20)    -- Age numérique
```

---

## 4. Mapping des colonnes

### 4.1 Source → Cible

| Colonne tempo_ecran | Source | Transformation |
|---------------------|--------|----------------|
| eme_societe | gmc_societe | Direct |
| eme_user | Paramètre | Session utilisateur |
| eme_sequence | Calculé | ROW_NUMBER() ORDER BY nom, filiation |
| eme_code_vente | gmc_code_vente | Direct |
| eme_sexe | gmc_titre | Me si (Mme,Me,Mlle,Mrs.,Sra.) sinon Mr |
| eme_nom | gmc_nom_complet | Direct |
| eme_prenom | gmc_prenom_complet | Direct |
| eme_numero | gmc_numero_adherent | FORMAT(x, '0000000000') |
| eme_age | heb_age | Direct (caractère) |
| eme_age_num | heb_age_num | Direct (numérique) |
| eme_dossier | gmc_numero_dossier | Direct |
| eme_lieu_sejour | heb_lieu_de_sejour | Direct |
| eme_code_logement | heb_code_logement | Direct |
| eme__u_p__nb_occup | heb_u_p_nb_occup | Direct |
| eme_fin_sejour | heb_date_fin | DD/MM/YYYY |
| eme_bebe | Calculé | 'S' si code_fidelite présent |
| eme_millesia | gmc_code_fidelite | Direct |

### 4.2 Règles de filtrage

```sql
WHERE
    gmc_societe = @p_societe
    AND heb_date_fin >= @p_date_debut
    AND heb_date_fin <= @p_date_fin
    AND heb_date_fin <> '00000000'          -- Exclure dates invalides
    AND heb_code_logement IS NOT NULL       -- Exclure sans logement
    AND heb_code_logement <> ''
```

### 4.3 Règles de tri

- **Tri par nom** (défaut): `ORDER BY nom, filiation`
- **Tri par dossier**: `ORDER BY compte, filiation`

---

## 5. Validation effectuée

### 5.1 Base de test
- **Serveur**: LENOVO_LB2I\SQLEXPRESS
- **Base**: CSK0912
- **Données**: 2259 hébergements (2025-10-08 → 2026-06-20)

### 5.2 Fichier de référence Magic
- **Fichier**: `DSIOPtmp_ecrmec_dat.TXT`
- **Généré par**: Utilisateur DSIOP
- **Contenu**: 4 enregistrements (famille LASBLEIS)

### 5.3 Résultat comparaison

**Famille LASBLEIS - Date: 03/01/2026**

| Champ | Magic | SQL | Statut |
|-------|-------|-----|--------|
| sequence | 1,2,3,4 | 1,2,3,4 | ✅ |
| code_vente | FR | FR | ✅ |
| sexe | Me,Mr,Me,Mr | Me,Mr,Me,Mr | ✅ |
| nom | LASBLEIS | LASBLEIS | ✅ |
| prenom | Marion,Klet,Anais,Axel | Marion,Klet,Anais,Axel | ✅ |
| filiation | 0,1,2,3 | 0,1,2,3 | ✅ |
| numero_adherent | 0017558025 | 0017558025 | ✅ |
| age | 43,45,14,11 | 43,45,14,11 | ✅ |
| dossier | 159176735 | 159176735 | ✅ |
| lieu | G | G | ✅ |
| code_logement | C2D | C2D | ✅ |
| nb_occupants | U2 | U2 | ✅ |
| fin_sejour | 03/01/2026 | 03/01/2026 | ✅ |
| bebe | S | S | ✅ |
| millesia | M | M | ✅ |

**Statut global**: ✅ VALIDE

---

## 6. Scripts SQL créés

### 6.1 Fichiers de test (base PMS_Test)
```
migration/mecano/sql/
├── 00_create_test_database.sql   -- Création base test
├── 01_tables_structure.sql       -- Structure tables
├── 02_vw_mecano_source.sql       -- Vue source
├── 03_vw_mecano_traitement.sql   -- Vue traitement
├── 04_vw_mecano_ecran.sql        -- Vue écran
├── 05_sp_mecano_generer.sql      -- Procédure stockée
├── 06_insert_test_data.sql       -- Données test
├── 07_test_views.sql             -- Tests vues
├── 08_expected_results.md        -- Résultats attendus
└── 99_run_all_tests.sql          -- Script consolidé
```

### 6.2 Fichiers production (base CSK0912)
```
migration/mecano/sql/
├── 10_vw_mecano_real.sql         -- Vues schéma réel
├── 11_sp_mecano_real.sql         -- Procédure validée
└── 12_comparison_report.md       -- Rapport comparaison
```

### 6.3 Procédure principale

```sql
-- Syntaxe
EXEC dbo.sp_mecano_generer_real
    @p_societe = 'C',
    @p_date_debut = 'YYYYMMDD',
    @p_date_fin = 'YYYYMMDD',
    @p_user = NULL;  -- Optionnel, défaut = SYSTEM_USER

-- Exemple
EXEC dbo.sp_mecano_generer_real
    @p_societe = 'C',
    @p_date_debut = '20260101',
    @p_date_fin = '20260131';
```

---

## 7. Points d'attention

### 7.1 Différences schéma Magic vs Réel

| Élément | Documentation Magic | Base réelle |
|---------|---------------------|-------------|
| Préfixe tempo_ecran | txe_ | eme_ |
| Format date_fin | DATE | VARCHAR (YYYYMMDD) |
| Statut séjour | PR, AR, CO | N, P |
| Colonne filiation | gmc_filiation | gmc_filiation_compte |

### 7.2 Colonnes non implémentées

- `eme_num_accompagnant` - Toujours vide
- `eme_fil____accompagn` - Toujours 0
- `eme_seminaire` - Toujours vide
- `eme_circuit` - Toujours vide
- `eme_nom_logement` - Non utilisé dans sortie

### 7.3 Logique métier

1. **Colonne bebe**: Contient 'S' si le client a un code fidélité (pas si c'est un bébé!)
2. **Tri**: Par nom puis filiation (ordre familial 0,1,2,3...)
3. **Filtrage dates**: Sur heb_date_fin (date de départ)

---

## 8. Prochaines étapes

### 8.1 Tests à effectuer sur autres bases
- [ ] Base 1: (à définir)
- [ ] Base 2: (à définir)
- [ ] Base 3: (à définir)

### 8.2 Améliorations futures
- [ ] Implémenter filtre par catégorie client (VIP, ST...)
- [ ] Implémenter filtre par séminaire
- [ ] Ajouter colonnes accompagnant
- [ ] Ajouter gestion des prestations

---

## 9. Références

### 9.1 Fichiers Magic analysés
- `D:\Data\Migration\XPA\PMS\PBP\Source\Progs\Prg_18.xml`
- `D:\Data\Migration\XPA\PMS\PBP\Source\Progs\Prg_243.xml` à `Prg_250.xml`
- `D:\Data\Migration\XPA\PMS\REF\Source\Progs\Prg_664.xml` à `Prg_671.xml`
- `D:\Data\Migration\XPA\PMS\REF\Source\DataSources.xml`

### 9.2 Documentation créée
- `D:\Projects\Lecteur Magic\migration\mecano\README.md`
- `D:\Projects\Lecteur Magic\migration\mecano\sql\12_comparison_report.md`

### 9.3 Fichier de référence Magic
- `D:\Projects\Lecteur Magic\DSIOPtmp_ecrmec_dat.TXT`

---

*Document généré par Claude Code - 2025-12-22*
