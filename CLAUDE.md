# Projet Migration Magic Unipaas

## Description

Agent Claude Code specialise pour l'analyse et la migration d'applications Magic Unipaas v12.03 vers des langages modernes (TypeScript, C#, Python).

## Skill Principal

Ce projet utilise le skill `magic-unipaas` pour toutes les operations d'analyse et de migration.

**Localisation :** `skills/magic-unipaas/SKILL.md`

## Projets Magic Source

### REF - Composant de Reference
- **Chemin :** `D:\Data\Migration\XPA\PMS\REF\Source\`
- **Role :** Composant central contenant les definitions de tables partagees
- **Fichiers cles :**
  - `Progs.xml` - Arborescence des programmes
  - `ProgramHeaders.xml` - Metadonnees des programmes
  - `DataSources.xml` - Definition des tables
  - `Comps.xml` - Composants partages

### PBP - Projet Editions
- **Chemin :** `D:\Data\Migration\XPA\PMS\PBP\Source\`
- **Role :** Projet d'editions, exports et generation d'etats
- **Caracteristiques :**
  - ~430 programmes
  - Utilise les tables de REF via composant partage

## Commandes Disponibles

| Commande | Description |
|----------|-------------|
| `/magic-load <path>` | Charge un projet Magic |
| `/magic-tree` | Affiche l'arborescence |
| `/magic-analyze <prg_id>` | Analyse un programme |
| `/magic-tables` | Liste les tables |
| `/magic-migrate <prg_id>` | Migre vers langage cible |

## Methodologie

### Apprentissage Iteratif
1. Analyser un cas simple
2. Comparer avec l'ecran Magic reel (capture fournie)
3. Corriger/enrichir le skill
4. Monter en complexite progressivement

### Niveaux de Progression
- **Niveau 1** : Programmes Browse simples
- **Niveau 2** : Programmes avec CallTask et parametres
- **Niveau 3** : Expressions IF/CASE complexes
- **Niveau 4** : Editions et exports complets

## Scope

### Phase 1 (Actuelle)
- Logique metier (programmes, taches, expressions)
- Tables et champs
- Dependances entre programmes

### Phase 2 (Future)
- UI/Ecrans (Forms.xml)
- Exports de donnees
- Editions/Etats

## Workflow Tickets Jira

### Analyse de bugs - Bonnes pratiques

Lors de l'analyse d'un ticket Jira, toujours documenter :

1. **Tables suspectes** : Nom complet + champs concernés
2. **Fichiers d'import** : Nom des fichiers attendus (TXT, CSV, etc.)
3. **Données requises** : Base de données village + date précise

### Format de demande de données

À la fin de chaque analyse, être proactif et demander :
```
DONNÉES REQUISES POUR COMPLÉTER L'ANALYSE :
- Base de données : Village [NOM] à la date [JJ/MM/AAAA]
- Fichier(s) : [nom_fichier.ext] (import NA, export, etc.)
- Table(s) à extraire : [nom_table] (champs: x, y, z)
```

### Structure rapport d'analyse

Chaque rapport dans `.openspec/reports/` doit contenir :
- Symptôme observé
- Flux de données tracé
- Tables/champs suspects (avec noms SQL exacts)
- Hypothèses classées par probabilité
- **Section "DONNÉES REQUISES"** en fin de rapport

## Standards de Code

- **TypeScript** : Types stricts, Decimal.js pour numeriques
- **C#** : .NET 6+, DateOnly/TimeOnly
- **Python** : Type hints, Decimal

## Notes Techniques

### Structure des Fichiers XML Magic
Voir `skills/magic-unipaas/references/xml-format-spec.md`

### Arborescence des Programmes
- `Progs.xml` > Folders : Dossiers avec StartsAt et NumberOfEntries
- `Progs.xml` > ProgramsRepositoryOutLine : Ordre des programmes
- `ProgramHeaders.xml` : Metadonnees de chaque programme

### Types de Taches (TaskType)
- `B` : Batch/Browse
- `O` : Online/Output
- `I` : Internal

### Composants Partages
REF.ecf contient les tables partagees, accessible via Comps.xml des autres projets.
