# Magic Documentation Generator

Génère une documentation complète d'un programme Magic en utilisant les outils MCP déterministes.

## Usage

```
/magic-doc <projet> <prg_id>
```

## Exemples

```
/magic-doc PBP 243
/magic-doc REF 121
/magic-doc VIL 22
```

## Instructions

Quand l'utilisateur demande `/magic-doc <projet> <prg_id>`, exécuter les étapes suivantes **EN UTILISANT LES OUTILS MCP** :

### Étape 1: Position et Métadonnées

```
Appeler: magic_get_position(project="<projet>", programId=<prg_id>)
```

Afficher le résultat en en-tête.

### Étape 2: Arborescence des Tâches

```
Appeler: magic_get_tree(project="<projet>", programId=<prg_id>)
```

Afficher le tableau des tâches avec leurs positions IDE.

### Étape 3: DataView de la Tâche Racine

```
Appeler: magic_get_dataview(project="<projet>", programId=<prg_id>, isn2=1)
```

Afficher les tables utilisées (Main Source, Links).

### Étape 4: Logique de la Tâche Racine

```
Appeler: magic_get_logic(project="<projet>", programId=<prg_id>, isn2=1)
```

Afficher les opérations principales.

### Étape 5: Sous-tâches Importantes

Pour chaque sous-tâche avec Level=1 (enfants directs) :
```
Appeler: magic_get_dataview(project="<projet>", programId=<prg_id>, isn2=<isn2>)
Appeler: magic_get_logic(project="<projet>", programId=<prg_id>, isn2=<isn2>)
```

## Format de Sortie OBLIGATOIRE

```markdown
# Documentation Programme <PROJET> <IDE_POSITION>

## 1. Identification
**Projet:** <projet>
**Position IDE:** <ide_position>
**Nom:** <description>
**Nom Public:** <public_name> (si disponible)

## 2. Arborescence des Tâches
| IDE | ISN_2 | Nom | Niveau |
|-----|-------|-----|--------|
| ... | ... | ... | ... |

## 3. DataView - Tâche Principale
**Main Source:** <table_name> (#<table_id>)
**Access:** <mode>

**Links:**
| # | Table | Type |
|---|-------|------|
| ... | ... | ... |

## 4. Logique - Tâche Principale
| # | Operation | Condition | Disabled |
|---|-----------|-----------|----------|
| ... | ... | ... | ... |

## 5. Sous-tâches
### 5.1 <sous_tache_nom>
[DataView et Logic pour chaque sous-tâche de niveau 1]
```

## Projets Disponibles

| Projet | Statut |
|--------|--------|
| PBP | ✅ Disponible |
| REF | ✅ Disponible |
| VIL | ✅ Disponible |
| PBG | ✅ Disponible |
| PVE | ✅ Disponible |
| ADH | ⚠️ XML invalide |

## Règles

1. **TOUJOURS** utiliser les outils MCP - ne JAMAIS lire les XML directement
2. **TOUJOURS** afficher les positions IDE (pas les ISN_2 seuls)
3. **TOUJOURS** inclure les tables et leurs IDs
4. Si un outil retourne une erreur, l'afficher clairement
