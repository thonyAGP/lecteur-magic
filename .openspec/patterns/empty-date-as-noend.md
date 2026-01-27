# Pattern : Date vide (00/00/0000) comme "sans limite"

> **Source** : PMS-1332 - Saisie fiche police date fin
> **Auteur** : Anthony Le Berre
> **Date** : 2026-01-27

## Description

Ce pattern montre comment accepter une date vide (00/00/0000) comme valeur valide signifiant "sans date de fin" ou "illimite", au lieu de forcer la saisie d'une date.

## Cas d'usage

- Sejours sans date de fin connue (GO, personnel permanent)
- Abonnements illimites
- Contrats a duree indeterminee
- Reservations ouvertes

## Probleme initial

Magic initialise automatiquement la date de fin avec la date de debut lors de la saisie. L'utilisateur ne peut pas laisser la date vide.

## Implementation

### Etape 1 : Identifier la logique d'initialisation

Dans la tache de saisie, chercher l'expression qui copie date debut vers date fin :

```xml
<!-- Init expression a modifier -->
<LogicLine>
  <Update FieldID="15" FlowIsn="22">
    <Target val="V"/>
    <Exp val="23"/>  <!-- Expression = date debut -->
  </Update>
</LogicLine>
```

### Etape 2 : Modifier la condition d'initialisation

Ajouter une condition pour ne PAS initialiser si la date fin est deja 00/00/0000 :

```xml
<LogicLine Disabled="N">
  <Update FieldID="15" FlowIsn="22">
    <Target val="V"/>
    <Exp val="23"/>
    <Condition val="45"/>  <!-- Nouvelle condition -->
  </Update>
</LogicLine>

<!-- Expression 45 : Initialiser seulement si date fin = date debut -->
<Expression id="45">
  <ExpSyntax val="{0,15}={0,14}"/>  <!-- date_fin = date_debut -->
  <ExpAttribute val="B"/>
</Expression>
```

### Etape 3 : Modifier la validation

Dans la tache de verification, accepter 00/00/0000 comme valide :

```xml
<!-- Avant -->
<Expression id="50">
  <ExpSyntax val="{0,15}>{0,14}"/>  <!-- date_fin > date_debut -->
</Expression>

<!-- Apres -->
<Expression id="50">
  <ExpSyntax val="{0,15}='00/00/0000'Date OR {0,15}>={0,14}"/>
  <ExpAttribute val="B"/>
</Expression>
```

### Etape 4 : Gerer l'affichage

Afficher "Sans limite" au lieu de 00/00/0000 dans les editions :

```xml
<Expression id="60">
  <ExpSyntax val="IF({0,15}='00/00/0000'Date,'Sans limite',DTOC({0,15},'DD/MM/YYYY'))"/>
  <ExpAttribute val="A"/>
</Expression>
```

## Points d'attention

1. **Coherence des tables** : Toutes les tables stockant cette date doivent accepter la valeur nulle/zero
2. **Calculs de duree** : Les calculs impliquant date_fin doivent gerer le cas 00/00/0000
3. **Rapports** : Verifier l'affichage dans les exports CSV/PDF
4. **Comparaisons SQL** : Dans les requetes, traiter 00/00/0000 comme "infini"

## Variantes

### Date NULL en SQL

```sql
-- Pour les rapports/exports
WHERE date_fin IS NULL OR date_fin = '1900-01-01'
```

### Affichage conditionnel

```xml
IF({0,15}='00/00/0000'Date, '', DTOC({0,15},'DD/MM/YYYY'))
```

---

## Specs concernees

| Spec | Programme | Role |
|------|-----------|------|
| PBG-IDE-93 | Saisie fiches police | Ecran de saisie |
| PBG-IDE-92 | Fiche police Bresil | Variante |

---

*Pattern documente: 2026-01-27*
*Ticket source: PMS-1332*
