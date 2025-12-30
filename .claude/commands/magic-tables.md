---
description: Liste les tables du projet Magic avec leurs champs
arguments:
  - name: table_id
    description: ID de table pour voir les details (optionnel)
    required: false
---

# Tables du projet Magic

Affiche les tables definies dans le projet Magic.

Filtre optionnel (ID table) : `$ARGUMENTS`

## Etapes

1. **Lire les definitions de tables**
   Depuis `DataSources.xml` :
   - `<DataSourceProperties>` : metadonnees de table
   - `<Columns>` : definition des champs

2. **Pour chaque table extraire**
   - `id` : Numero de la table
   - `Description` : Nom logique
   - `DbObjectName` : Nom physique (SQL)
   - `DbSchemaName` : Schema (optionnel)
   - Colonnes avec types

3. **Afficher selon le mode**

   **Mode liste (sans argument)**
   ```
   Tables du projet [NOM]

   ID    Nom Logique              Nom Physique         Colonnes
   ---   -----------              ------------         --------
   1     Adherents                adherent_dat         25
   2     Cotisations              cotisation_dat       18
   3     Paiements                paiement_dat         12
   ...

   Tables partagees (composant REF):
   38    Parametres               cafil026_dat         8
   ...

   Total: X tables locales, Y tables partagees
   ```

   **Mode detail (avec ID)**
   ```
   Table [ID] : [Description]
   Nom physique : [DbObjectName]

   Colonnes:
   #   Nom                  Type        Taille    Picture     Nullable
   1   CODE_ADHERENT        Alpha       10        10          N
   2   NOM                  Alpha       50        50          N
   3   PRENOM               Alpha       50        50          Y
   4   DATE_NAISSANCE       Date        -         DD/MM/YYYY  Y
   5   MONTANT              Numeric     10.2      N10.2       N
   ...

   Index:
   1   [PRIMARY] CODE_ADHERENT (Unique)
   2   [IDX_NOM] NOM, PRENOM
   ...

   Utilise dans les programmes:
   - [671] Export CSV Adherents (Main Source)
   - [672] Liste des cotisations (Link)
   ...
   ```

## Types de donnees Magic

| Type | Description |
|------|-------------|
| A    | Alpha (string) |
| N    | Numeric |
| L    | Logical (boolean) |
| D    | Date |
| T    | Time |
| B    | BLOB |
| U    | Unicode |

## References

- `skills/magic-unipaas/references/data-types-mapping.md`
- `skills/magic-unipaas/references/xml-format-spec.md`

## Important

- Distinguer tables locales vs partagees (comp=-1 vs comp=2)
- Le nom physique est important pour la migration SQL
- Les pictures indiquent le format d'affichage
