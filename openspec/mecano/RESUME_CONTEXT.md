# Contexte de reprise - MECANO

## Dernière session: 2025-12-22

### Ce qui a été fait

1. **Analyse complète** du flux MECANO dans Magic (Prg_18 → Prg_666)
2. **Création des vues SQL** adaptées au schéma réel CSK0912
3. **Validation réussie** avec la famille LASBLEIS (4 personnes)
4. **Documentation** dans OpenSpec

### Procédure SQL validée

```sql
-- Sur CSK0912
EXEC dbo.sp_mecano_generer_real
    @p_societe = 'C',
    @p_date_debut = '20260103',
    @p_date_fin = '20260103';
```

### Fichiers clés

- **Procédure SQL**: `migration/mecano/sql/11_sp_mecano_real.sql`
- **Vues SQL**: `migration/mecano/sql/10_vw_mecano_real.sql`
- **Fichier Magic référence**: `DSIOPtmp_ecrmec_dat.TXT`
- **Spec complète**: `openspec/mecano/MECANO_SPEC.md`

---

## Prochaine session

### Objectif
Tester la procédure SQL sur **3 autres bases de données**

### Actions à faire

1. **Identifier les 3 bases** à tester (noms des bases sur le serveur)

2. **Pour chaque base**:
   - Vérifier que les tables `cafil009_dat` et `cafil012_dat` existent
   - Vérifier les colonnes (même schéma que CSK0912?)
   - Exécuter la procédure `sp_mecano_generer_real`
   - Comparer avec un export Magic de la même période

3. **Ajuster si nécessaire**:
   - Adapter les colonnes si schéma différent
   - Documenter les différences

### Questions à poser à l'utilisateur

- Quels sont les noms des 3 bases à tester?
- Avez-vous des fichiers Magic de référence pour ces bases?
- Y a-t-il des différences de schéma connues?

### Commandes utiles

```sql
-- Lister les bases sur le serveur
SELECT name FROM sys.databases WHERE database_id > 4;

-- Vérifier les tables dans une base
USE [NomBase];
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE';

-- Vérifier les colonnes
SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'cafil009_dat';
```

---

## Résumé technique

### Schéma validé (CSK0912)

**Tables sources**:
- `cafil009_dat` (gm-complet) - 83 colonnes, préfixe `gmc_`
- `cafil012_dat` (hebergement) - 34 colonnes, préfixe `heb_`

**Table cible**:
- `tempo_ecran_mecano` - 22 colonnes, préfixe `eme_`

### Jointure clé

```sql
FROM cafil009_dat gmc
JOIN cafil012_dat heb
  ON heb.heb_societe = gmc.gmc_societe
  AND heb.heb_num_compte = gmc.gmc_compte
  AND heb.heb_filiation = gmc.gmc_filiation_compte
```

### Filtres essentiels

```sql
WHERE heb_date_fin >= @date_debut
  AND heb_date_fin <= @date_fin
  AND heb_date_fin <> '00000000'
  AND heb_code_logement <> ''
```

---

*Créé pour reprise de session après redémarrage*
