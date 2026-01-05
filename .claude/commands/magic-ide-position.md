# Magic IDE Position Converter

Convertit les références XML Magic en positions IDE lisibles.

## Usage

```
/magic-ide-position <projet> <prg_id> [task_isn] [line]
```

## Exemples

```
/magic-ide-position ADH 121
/magic-ide-position ADH 121 7
/magic-ide-position ADH 121 7 3
```

## Instructions

Quand l'utilisateur demande une position IDE, effectuer les étapes suivantes :

### Étape 1: Trouver la position du programme dans la liste IDE

```bash
# Compter la position du programme dans Progs.xml
grep -n "<Program id=\"{prg_id}\"" {projet}/Source/Progs.xml
# La position IDE = numéro de ligne - 150 (première ligne <Program)
```

### Étape 2: Extraire l'arborescence des tâches

```bash
# Lister toutes les tâches avec leur ISN_2 et Description
grep -n "Header Description=.*ISN_2=" {projet}/Source/Prg_{prg_id}.xml
```

### Étape 3: Construire la hiérarchie

Le mapping ISN_2 → Position IDE :
- ISN_2="1" = Tâche racine (pas de suffixe, juste le numéro programme)
- ISN_2="2" = Première sous-tâche = .1
- ISN_2="N" = Sous-tâche = .(N-1) au niveau approprié

**IMPORTANT** : La hiérarchie dépend de l'imbrication XML (indentation des balises `<Task>`).

### Étape 4: Résoudre les CallTask

Pour un CallTask avec `obj="X"` :
1. Si `comp="-1"` → sous-tâche locale du même programme
2. Chercher la tâche avec `ISN_2="X"` dans le même fichier
3. Retourner sa Description

### Format de sortie OBLIGATOIRE

```
**{PROJET} {IDE_POSITION}** Nom : **{DESCRIPTION}**

Tâches :
| IDE | ISN_2 | Nom | Niveau |
|-----|-------|-----|--------|
| 121.1 | 2 | Paramètres caisse | 1 |
| 121.2 | 3 | Controle COFFRE2 | 1 |
| 121.6 | 7 | Pilotage | 1 |
| 121.6.1 | 8 | Existe histo | 2 |
```

## Règles de conversion

### Programme
- Position IDE = ordre dans `Progs.xml` (pas l'id XML)
- Premier `<Program>` = position 1

### Tâches
- ISN_2="1" = tâche racine (niveau 0)
- ISN_2="N" (N>1) = position (N-1) à son niveau d'imbrication
- Niveau déterminé par profondeur XML des balises `<Task>`

### CallTask
- `TaskID comp="-1" obj="X"` → sous-tâche ISN_2="X" du programme courant
- `TaskID comp="Y" obj="X"` → programme externe composant Y, tâche X

## Script d'aide

Pour construire l'arbre complet d'un programme :

```bash
# Extraire toutes les tâches avec leur niveau d'imbrication
grep -n "<Task MainProgram\|Header Description=.*ISN_2=" Prg_{id}.xml | \
  awk -F: '{print NR": "$0}'
```
