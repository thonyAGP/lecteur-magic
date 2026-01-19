# PMS-1414 - Validation groupee seminaire

> **Jira** : [PMS-1414](https://clubmed.atlassian.net/browse/PMS-1414)

## Informations Jira

| Champ | Valeur |
|-------|--------|
| **Titre** | Validation groupee d'un seminaire |
| **Type** | Bug |
| **Priorite** | Haute |
| **Statut** | Backlog |
| **Reporter** | Davide Morandi |
| **Cree** | 2025-11-18 |

## Description du probleme

Lors de la validation groupee d'un seminaire, le systeme exige le vol retour alors que :
- Le GM peut arriver par **vol aller** uniquement
- Le GM peut arriver par **VV2** (Village/Village) sans vol retour requis

**Comportement attendu** : La validation doit etre possible si l'arrivee est par vol aller OU par VV (Village/Village).

---

## Analyse Magic IDE (2026-01-19)

### Programme principal

| Projet | IDE | Nom | Public Name | Fichier Source |
|--------|-----|-----|-------------|----------------|
| **PBG** | **124** | Validation Arrivants | VALIDATION_ARRIVANTS | Prg_56.xml |

> **Calcul position** : Progs.xml ligne 254 contient id="56" -> Position = 254 - 131 + 1 = **124**

### Arborescence des taches concernees

```
PBG IDE 124 - Validation Arrivants
|
+-- Tache 124.X - [Parent a identifier]
|    |
|    +-- Sous-tache ISN_2=35 - Verif Existence Groupe Vol  <-- POINT CLE
|
+-- Expressions de verification vol :
     - Expression 56 : "Code vol aller non renseigne !"
     - Expression 57 : {0,12}=''  (Vol aller vide)
     - Expression 58 : "Code vol retour non renseigne !"  <-- MESSAGE BLOQUANT
     - Expression 59 : {0,14}=''  (Vol retour vide)
```

### Variables DataView identifiees (niveau 0)

| Variable | Column ID | Nom logique | Role |
|----------|-----------|-------------|------|
| ? | 4 | Type transport aller | Valeurs: A, Z, H, C, VV1, VV2, VV3 |
| ? | 5 | Type transport retour | Valeurs: A, Z, H, C, VV1, VV2, VV3 |
| ? | 10 | Flag confirmation | N = non confirme |
| ? | 12 | Code vol aller | Vide si pas de vol |
| ? | 14 | Code vol retour | Vide si pas de vol |

> **Note** : Les lettres exactes des variables necessitent le calcul d'offset avec `magic_get_line`.

### Expressions VV (Village/Village)

| Expression | Formule | Description |
|------------|---------|-------------|
| **12** | `{0,4}='VV1' OR {0,4}='VV2' OR {0,4}='VV3'` | Aller = Mode VV |
| **13** | `{0,5}='VV1' OR {0,5}='VV2' OR {0,5}='VV3'` | Retour = Mode VV |
| **27** | Idem 12 | Doublon aller VV |
| **28** | `({0,5}='VV1' OR {0,5}='VV2' OR {0,5}='VV3') AND {0,10}<>'N'` | Retour VV ET confirme |

### Tables utilisees

| N Table | Projet | Nom Logique | Description |
|---------|--------|-------------|-------------|
| **134** | REF | cafil112_dat01 | Table vols/transport (a confirmer) |

---

## PISTES DE RECHERCHE CONCRETES

### PISTE 1 : Condition de blocage vol retour (HAUTE PRIORITE)

**Objectif** : Trouver OU et COMMENT Expression 59 (vol retour vide) bloque la validation.

**Actions** :
1. Chercher `Condition val="59"` dans la Logic de PBG IDE 124
2. Chercher les `STP Mode="E"` (Error) qui utilisent Expression 58
3. Verifier si la condition est dans la sous-tache "Verif Existence Groupe Vol" (ISN_2=35)

**Commande MCP** :
```
magic_get_line(project="PBG", taskPosition="124.X.35", lineNumber=*, mainOffset=91)
```

### PISTE 2 : Logique de bypass VV existante (MOYENNE PRIORITE)

**Objectif** : Verifier si le mode VV bypass deja la verification vol retour.

**Observations** :
- Expression 12 teste si aller = VV1/VV2/VV3
- Expression 13 teste si retour = VV1/VV2/VV3
- Ces expressions sont definies mais leur utilisation dans la Logic doit etre tracee

**Actions** :
1. Trouver ou Expression 12/13 est utilisee comme condition
2. Verifier si `{0,4}='VV2'` devrait bypasser la verification vol retour
3. Comparer avec la logique pour `{0,4}='A'` (Aller vol)

### PISTE 3 : Validation vol aller seul (MOYENNE PRIORITE)

**Objectif** : Comprendre pourquoi vol aller seul ne suffit pas.

**Hypothese** : La logique actuelle exige TOUJOURS un vol retour, meme si :
- L'aller est par vol (type 'A')
- Le retour est par VV (type VV1/VV2/VV3)

**Actions** :
1. Analyser Expression 5 : `{0,4}='A' AND ({2,4}='VV1' OR {2,4}='VV2' OR {2,4}='VV3')`
2. Verifier si cette expression est utilisee pour autoriser vol aller + VV retour

### PISTE 4 : Configuration INI (BASSE PRIORITE)

**Contexte** : Le projet utilise `INIGet('[MAGIC_LOGICAL_NAMES]club_traitement_bateau')` pour certains modes.

**Fichiers concernes** :
- Prg_118.xml (PBG IDE 193) : Expression 11/12 teste mode bateau
- Prg_21.xml (PBG IDE 141) : Expression 22 teste mode bateau

**Question** : Le mode bateau/VV est-il configure differemment selon les villages ?

---

## SOLUTION POTENTIELLE

### Modification proposee

**Avant** (logique actuelle) :
```
SI Vol_Retour_Vide ET Type_Transport_Retour <> VV
ALORS Erreur "Code vol retour non renseigne !"
```

**Apres** (logique corrigee) :
```
SI Vol_Retour_Vide
   ET Type_Transport_Retour <> VV1
   ET Type_Transport_Retour <> VV2
   ET Type_Transport_Retour <> VV3
   ET Type_Transport_Aller <> 'A'  -- AJOUT : vol aller seul autorise
ALORS Erreur "Code vol retour non renseigne !"
```

### Localisation probable du fix

| Element | Valeur |
|---------|--------|
| **Programme** | PBG IDE 124 - Validation Arrivants |
| **Sous-tache** | ISN_2=35 - Verif Existence Groupe Vol |
| **Expression a modifier** | Condition de l'operation Error qui affiche "Code vol retour non renseigne !" |
| **Modification** | Ajouter condition OR sur type transport = VV OU vol aller seul |

---

## DONNEES REQUISES POUR VALIDER

| Element | Detail |
|---------|--------|
| **Base de donnees** | Village avec seminaires actifs |
| **Scenario de test** | Seminaire avec GM arrivant par vol aller seul |
| **Scenario de test 2** | Seminaire avec GM arrivant par VV2 (sans vol retour) |
| **Table a extraire** | cafil112_dat (structure et exemples) |

---

## Questions pour clarification

1. **Quel village teste ?** - Pour avoir les bonnes donnees
2. **Le mode VV fonctionne-t-il ?** - Ou seulement le vol retour pose probleme ?
3. **Message d'erreur exact ?** - "Code vol retour non renseigne !" ou autre ?
4. **Ecran concerne ?** - Interface de validation groupee seminaire

---

*Derniere mise a jour: 2026-01-19*
*Status: INVESTIGATION EN COURS - 4 pistes de recherche identifiees*
*Programme: PBG IDE 124 - Validation Arrivants (source: Prg_56.xml)*
