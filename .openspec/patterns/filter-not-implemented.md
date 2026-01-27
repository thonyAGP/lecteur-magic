# Pattern : Filtres demandes mais jamais implementes

> **Source** : PMS-1404 - Filtres Person/Item Label rapport M&E
> **Auteur** : Anthony Le Berre
> **Date** : 2026-01-27

## Description

Ce pattern documente le cas ou l'utilisateur demande que des filtres "ne fonctionnent pas", alors qu'en realite ces filtres n'ont jamais ete implementes dans le code. C'est une demande d'evolution, pas un bug.

## Diagnostic

### Symptomes reportes

- "Le filtre X ne fonctionne pas"
- "L'extraction reste identique avec ou sans filtre"
- "Les criteres de recherche sont ignores"

### Investigation

1. **Verifier les parametres du programme**

```powershell
# Lister les parametres d'un programme
magic_get_parameters -Project PVE -Ide 87
```

Si le parametre filtre n'existe pas dans la liste, il n'a jamais ete implemente.

2. **Verifier les Range/Locate**

```powershell
# Chercher les conditions de filtrage
magic_get_ranges -Project PVE -Ide 87
```

Si aucune Range n'utilise le filtre demande, la fonctionnalite n'existe pas.

3. **Verifier l'interface utilisateur**

Le champ de saisie peut exister dans le formulaire mais ne pas etre connecte a la logique.

## Classification

| Situation | Type | Action |
|-----------|------|--------|
| Filtre existe + ne fonctionne pas | **Bug** | Corriger la logique |
| Filtre n'existe pas du tout | **Evolution** | Developper nouvelle fonctionnalite |
| Filtre existe cote UI uniquement | **Bug integration** | Connecter UI a la logique |

## Implementation (si evolution)

### Etape 1 : Ajouter les parametres

Dans le programme appelant (Menu) :

```xml
<!-- Nouveaux champs de saisie -->
<Column id="50" name="V.Filter Person">
  <PropertyList model="FIELD">
    <Model attr_obj="FIELD_ALPHA" id="1"/>
    <_Data id="277" val="50"/>
  </PropertyList>
</Column>

<Column id="51" name="V.Filter Item">
  <PropertyList model="FIELD">
    <Model attr_obj="FIELD_ALPHA" id="1"/>
    <_Data id="277" val="50"/>
  </PropertyList>
</Column>
```

### Etape 2 : Passer les parametres au rapport

```xml
<CallTask FlowIsn="83">
  <Argument>
    <id val="14"/>
    <Expression val="50"/>  <!-- Filter Person -->
  </Argument>
  <Argument>
    <id val="15"/>
    <Expression val="51"/>  <!-- Filter Item -->
  </Argument>
</CallTask>
```

### Etape 3 : Declarer dans le programme cible

```xml
<TSK_PARAMS val="15"/>  <!-- +2 parametres -->

<Column id="14" name="P.Filter Person">...</Column>
<Column id="15" name="P.Filter Item">...</Column>
```

### Etape 4 : Appliquer dans la selection

```xml
<!-- Expression de filtrage -->
<Expression id="90">
  <ExpSyntax val="IF({2,14}='', 'TRUE'LOG, {0,5} LIKE '%'&amp;{2,14}&amp;'%')"/>
</Expression>

<!-- Appliquer au Range -->
<Range Direction="A" Exp="90"/>
```

### Etape 5 : Ajouter l'interface

Dans le Form du menu :

```xml
<Control type="Edit" name="Filter Person">
  <Left val="100"/>
  <Top val="50"/>
  <Width val="200"/>
  <DataSource val="{0,50}"/>
</Control>
```

## Points d'attention

1. **Clarifier la demande** : Demander le chemin menu exact et les noms de champs attendus
2. **Performance** : Les filtres LIKE peuvent etre couteux sur grandes tables
3. **Tests** : Fournir des cas de test avec donnees attendues
4. **Documentation** : Mettre a jour le manuel utilisateur

## Questions a poser

1. Ou ces filtres sont-ils affiches actuellement ?
2. Quel est le comportement attendu (exact/partiel) ?
3. Sur quelles colonnes de la table filtrer ?
4. Y a-t-il des filtres similaires dans d'autres rapports ?

---

## Specs concernees

| Spec | Programme | Role |
|------|-----------|------|
| PVE-IDE-87 | Report Discount & Gratuities | Rapport sans filtres |
| PVE-IDE-176 | Menu Reports | Interface utilisateur |

---

*Pattern documente: 2026-01-27*
*Ticket source: PMS-1404*
