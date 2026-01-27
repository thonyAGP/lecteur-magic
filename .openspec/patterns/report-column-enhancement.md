# Pattern : Enrichissement colonnes de rapport

> **Source** : PMS-1400 - Evolution report REVENUE CANCELATIONS
> **Auteur** : Anthony Le Berre
> **Date** : 2026-01-27

## Description

Ce pattern montre comment ajouter des colonnes a un rapport existant (edition Magic) : nouvelles colonnes de donnees, colonnes calculees, et lignes de totaux.

## Cas d'usage

- Ajouter une colonne manquante (Quantity, Payment Type, etc.)
- Ajouter des colonnes calculees (totaux, moyennes)
- Enrichir un export CSV existant

## Implementation

### Etape 1 : Identifier la structure existante

1. Localiser le programme d'edition (ex: PVE IDE 75)
2. Identifier la tache d'impression (Print subtask)
3. Lister les variables du DataView

```
Programme: PVE IDE 75 - Report Revenue Cancelations
├── Tache 75.1 - Selection
├── Tache 75.2 - Main
├── Tache 75.3 - Print subtask  <-- Cible
└── Tache 75.4 - CSV Export
```

### Etape 2 : Ajouter une colonne de donnees

Dans le DataView de la tache d'impression :

```xml
<!-- Ajouter nouvelle variable apres la derniere existante -->
<Column id="45" name="V.Payment Type">
  <PropertyList model="FIELD">
    <Model attr_obj="FIELD_ALPHA" id="1"/>
    <_FieldStyle id="276" val="1"/>
    <_Data id="277" val="20"/>  <!-- Alpha 20 -->
  </PropertyList>
</Column>
```

### Etape 3 : Ajouter le Select dans la logique

```xml
<LogicLine>
  <Select FieldID="45" FlowIsn="60" id="45">
    <Column val="12"/>  <!-- Colonne source dans table -->
    <Type val="R"/>     <!-- R = Real/Table column -->
    <Table val="30"/>   <!-- Table source -->
  </Select>
</LogicLine>
```

### Etape 4 : Creer une expression de mapping (si calcule)

```xml
<!-- Expression pour Payment Type base sur code -->
<Expression id="70">
  <ExpSyntax val="IF({0,12}='CMP','CLUB MED PASS',IF({0,12}='CB','CREDIT CARD',IF({0,12}='GP','GIFT PASS',{0,12})))"/>
  <ExpAttribute val="A"/>
</Expression>
```

### Etape 5 : Ajouter au formulaire d'edition

Dans le Form de la tache Print :

```xml
<Control type="Edit" name="Payment Type">
  <Left val="450"/>
  <Top val="0"/>
  <Width val="100"/>
  <Height val="18"/>
  <DataSource val="{0,45}"/>  <!-- Nouvelle variable -->
</Control>
```

### Etape 6 : Ajouter les variables de totalisation

```xml
<!-- Variables de total -->
<Column id="46" name="V.Total Montant">
  <PropertyList model="FIELD">
    <Model attr_obj="FIELD_NUMERIC" id="1"/>
    <_FieldStyle id="276" val="1"/>
  </PropertyList>
</Column>

<!-- Incrementer dans Task Suffix -->
<LogicLine>
  <Update FieldID="46">
    <Target val="V"/>
    <Exp val="71"/>  <!-- V.Total + montant_ligne -->
  </Update>
</LogicLine>

<!-- Expression 71 : Cumul -->
<Expression id="71">
  <ExpSyntax val="{0,46}+{0,25}"/>  <!-- Total + montant courant -->
</Expression>
```

### Etape 7 : Modifier l'export CSV

Ajouter la nouvelle colonne dans la ligne d'export :

```xml
<!-- Expression CSV modifiee -->
<Expression id="80">
  <ExpSyntax val="Trim({0,1})&amp;{3,8}&amp;Trim({0,2})&amp;{3,8}&amp;Trim({0,45})&amp;{3,8}"/>
</Expression>
```

`{3,8}` = separateur (tabulation ou point-virgule)

## Points d'attention

1. **Coherence header/data** : L'en-tete doit correspondre aux colonnes de donnees
2. **Performance** : Eviter les jointures couteuses dans les boucles
3. **Export CSV** : Ajouter la colonne a la MEME position que dans le header
4. **Totaux** : Initialiser a 0 dans Task Prefix, incrementer dans Task Suffix

## Structure type d'un rapport

```
Task Prefix
├── Initialisation variables totaux
├── Impression en-tete
│
Record Main (boucle sur donnees)
├── Lecture donnees table
├── Calcul colonnes derivees
├── Impression ligne
├── Cumul totaux
│
Task Suffix
├── Impression ligne TOTAL
└── Export fichier
```

## Variantes

### Total par groupe (sous-totaux)

Utiliser Group Prefix/Suffix avec rupture sur une colonne :

```xml
<GroupBy Column="5"/>  <!-- Rupture sur date -->

<!-- Group Suffix : sous-total -->
<LogicLine Handler="GroupSuffix">
  <Output FormID="3"/>  <!-- Form sous-total -->
</LogicLine>
```

### Colonne conditionnelle

```xml
IF({0,10}='TYPE_A', {0,20}, IF({0,10}='TYPE_B', {0,21}, 0))
```

---

## Specs concernees

| Spec | Programme | Role |
|------|-----------|------|
| PVE-IDE-75 | Revenue Cancelations | Rapport annulations |
| PVE-IDE-87 | Discount & Gratuities | Rapport remises |

---

*Pattern documente: 2026-01-27*
*Ticket source: PMS-1400*
