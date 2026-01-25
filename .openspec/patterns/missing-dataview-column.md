# Pattern: Colonne presente dans header mais absente du DataView

> **Source**: PMS-1404
> **Domaine**: Editions / Reports
> **Type**: Bug affichage

---

## Symptomes typiques

- Colonne affichee dans l'en-tete du rapport
- Colonne vide ou absente dans les donnees
- Header et donnees ne correspondent pas
- Export avec colonnes decalees

---

## Detection

### Mots-cles dans le ticket
- "colonne manquante"
- "colonne vide"
- "header"
- "export"
- "report"
- "edition"
- "quantite"

### Verification
1. L'en-tete contient-il la colonne ?
2. Les lignes de donnees contiennent-elles la valeur ?
3. Y a-t-il un decalage entre header et donnees ?

---

## Cause racine typique

| Element | Valeur |
|---------|--------|
| Zone | Programme d'edition/export |
| Erreur | Variable absente du DataView de la tache de donnees |
| Exemple | Header definit "Quantity" mais DataView n'a pas de variable correspondante |

### Architecture typique edition Magic

```
Programme Edition
  |
  +-- Expression Header : "Date;Nom;Quantity;Montant"
  |
  +-- Tache Edition
       |
       +-- DataView : Date, Nom, Montant  <-- QUANTITY MANQUANTE !
       +-- FormIO : Write(Date, Nom, Montant)
```

---

## Solution type

### Etape 1: Identifier le programme d'edition

```
magic_kb_search("report", project="PVE")
magic_get_tree(project="PVE", programId=<ide>)
```

### Etape 2: Comparer header et DataView

| Element | Verifier |
|---------|----------|
| Expression header | Liste des colonnes definies |
| DataView tache | Variables presentes |
| FormIO | Variables ecrites dans output |

### Etape 3: Ajouter la variable manquante

1. Identifier la source de la donnee (table, calcul)
2. Ajouter variable dans le DataView
3. Lier a la source (Select ou expression)
4. Ajouter dans le FormIO a la bonne position

---

## Programmes concernes (PMS-1404)

| Programme | Nom | Role |
|-----------|-----|------|
| **PVE IDE 87** | Report - Discount & Gratuities | Programme principal |
| Tache 87.1.1 | EDITION V3 | Tache d'edition |
| Tache 87.1.1.1 | Discount line | **DataView sans Quantity** |
| Tache 87.1.2 | SELECTION | Recuperation donnees |

### Expression header (exemple)

```
Expression 8 : "Date;Person;Quantity;Product;Amount..."
```

### DataView Tache 87.1.1.1 (60 colonnes)

Variables presentes : Date, Person, Product, Amount...
**Variable ABSENTE : Quantity**

---

## Procedure d'ajout colonne

### Etape 1: Localiser la table source

Identifier quelle table contient le champ quantite :
- Table operations
- Table ventes
- Table details

### Etape 2: Ajouter dans DataView

| Action | Detail |
|--------|--------|
| Position | Apres derniere variable (ex: position 61) |
| Nom | V.Quantity |
| Type | Numeric |
| Picture | N5 ou N8 |

### Etape 3: Lier a la source

Ajouter une ligne Select dans la Logic :
```
SELECT table.quantity INTO V.Quantity
```

### Etape 4: Ajouter dans FormIO

Positionner la variable dans l'output a la position correspondant au header.

---

## Checklist resolution

- [ ] Identifie programme d'edition
- [ ] Compare expression header vs DataView
- [ ] Identifie variable(s) manquante(s)
- [ ] Localise table source de la donnee
- [ ] Ajoute variable dans DataView
- [ ] Lie variable a la source (Select)
- [ ] Ajoute dans FormIO
- [ ] Teste export (colonne remplie)

---

*Pattern capitalise le 2026-01-25*
*Source: PMS-1404 (Recette OK - 2026-01-19)*
