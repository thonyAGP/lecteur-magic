# Analyse VIL - Étoiles F.D.R. INITIAL

**Date**: 2026-01-05
**Projet**: VIL (Village)
**Demande**: Vérifier la logique des 2 étoiles (**) sur la colonne F.D.R. INITIAL de l'édition RECAPITULATIF SESSIONS PMS
**Statut**: **BUG CONFIRME - CORRECTION IDENTIFIEE**

---

## 1. Règle métier

> Les 2 étoiles (**) doivent apparaître lorsque le **FDR Final de la veille** est différent du **FDR Initial du jour**.

---

## 2. BUG IDENTIFIÉ

### Expression correcte (NON UTILISÉE)

```
Expression 38 = {0,4}<>{0,81}
```

- **Field 4** = FDR Initial (colonne table)
- **Field 81** = "FDR Final lors de la dernière fermeture" (variable virtuelle)
- **Comparaison** : FDR Initial ≠ FDR Previous

**Cette expression correspond EXACTEMENT à la règle métier, mais elle N'EST JAMAIS UTILISÉE !**

### Expression utilisée (INCORRECTE)

```
Expression 32 = {0,4}+ExpCalc('8'EXP)+{0,8}+{0,10}+{0,11}+{0,12}+{0,13}<>{0,5}
```

- Fait une **somme** de plusieurs champs (4, 8, 10, 11, 12, 13 + ExpCalc)
- Compare avec Field 5
- **NE correspond PAS** à la règle métier simple

### Où est le bug

```xml
<!-- Ligne 17787-17788 : Update Field 78 (étoiles COFFRE 1) -->
<Update FlowIsn="329">
  <FieldID val="78"/>
  <WithValue val="32"/>    <!-- DEVRAIT ÊTRE 38 ! -->
</Update>

<!-- Ligne 17832-17833 : Update Field 79 (étoiles COFFRE 2) -->
<Update FlowIsn="330">
  <FieldID val="79"/>
  <WithValue val="32"/>    <!-- DEVRAIT ÊTRE 38 ! -->
</Update>
```

---

## 3. Analyse Complete du Bug

### Mapping Expressions XML → IDE

En comptant les 34 expressions dans l'ordre du XML (id=1,2,3,4,30,6,7,35,36,8,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,32,38,33,34):

| Position IDE | XML id | Contenu | Role |
|--------------|--------|---------|------|
| 31 | 32 | `{0,4}+ExpCalc('8'EXP)+{0,8}+{0,10}+{0,11}+{0,12}+{0,13}<>{0,5}` | Somme complexe (INCORRECTE) |
| **32** | 38 | `{0,4}<>{0,81}` = **DK<>EU** | Comparaison FDR (CORRECTE) |

### Identification des Variables

Lecture du XML (Select statements) :
- **Field 4** = fdr_ouverture (FDR Initial) → variable **DK** dans la DataView
- **Field 81** = v.FDR fermeture de la veille → variable **EU** dans la DataView
- **Field 78** = v.Ecart F.D.R. COFFRE2 (booleen pour afficher **)
- **Field 79** = v.Ecart F.D.R. RECEPTION (booleen pour afficher **)

### Le Probleme

Les Updates (lignes XML 17787 et 17832) utilisent `WithValue="32"` qui reference l'**ID XML 32**, pas le numero IDE.

| Update | Champ | Expression utilisee | Devrait etre |
|--------|-------|---------------------|--------------|
| Ligne XML 17787 | 78 (v.Ecart COFFRE2) | XML id=32 → IDE 31 (somme) | XML id=38 → IDE 32 (DK<>EU) |
| Ligne XML 17832 | 79 (v.Ecart RECEPTION) | XML id=32 → IDE 31 (somme) | XML id=38 → IDE 32 (DK<>EU) |

### Correction a Appliquer

**Tache 22.16.1, Record Suffix conditionnel (LogicUnit id="6", condition sur Expression 89) :**

```
Ligne IDE 5 : Update v.Ecart F.D.R. COFFRE2
             → remplacer expression 31 par expression 32 (DK<>EU)

Ligne IDE 9 : Update v.Ecart F.D.R. RECEPTION
             → remplacer expression 31 par expression 32 (DK<>EU)
```

### Pourquoi le Bug Existait

L'expression IDE 32 (XML id=38) implementait correctement la regle metier `{0,4}<>{0,81}` (FDR Initial <> FDR Veille), mais les Updates referençaient l'expression IDE 31 (XML id=32) qui fait une somme complexe sans rapport avec la regle metier.

C'est un cas classique de **code mort** : l'expression correcte existait mais n'etait jamais utilisee

---

## 4. Impact

| Champ | Rôle | Utilisé dans |
|-------|------|--------------|
| Field 78 | Écart F.D.R. pour COFFRE 1 | Expression 35 (affiche **) |
| Field 79 | Écart F.D.R. pour COFFRE 2 | Expression 36 (affiche **) |

Les expressions d'affichage :
```
Expression 35 = Trim(Str({0,4},{2,4})&IF({0,78},'**',''))
Expression 36 = Trim(Str({0,4},{2,4})&IF({0,79},'**',''))
```

---

## 5. Vérification dans l'IDE Magic

**AVANT de corriger**, vérifier dans l'IDE :

1. Ouvrir Programme 22 > Tâche "Comptage Reception" (ou tâche parent)
2. Aller au Record Suffix
3. Trouver les deux Updates des champs 78 et 79
4. Confirmer qu'ils utilisent Expression 32
5. Modifier pour utiliser Expression 38 (qui devrait être numérotée différemment dans l'IDE)

**Note sur la numérotation IDE** : L'IDE renumérote séquentiellement. Expression id="38" dans le XML pourrait avoir un numéro différent dans l'IDE.

---

## 6. Contexte technique

### Tâche concernée

- Programme: 22 (Prg_558.xml)
- Tâche: ISN_2="19" ("Reception") et sous-tâche de comptage
- Table source: comp="2" obj="594" (REF)

### Définition Field 81

```xml
<!-- Ligne 17565-17570 -->
<Remark>FDR Final lors de la dernière fermeture</Remark>
<Select FieldID="81" FlowIsn="266" id="81">
  <Column val="20"/>
  <Type val="V"/>  <!-- Variable virtuelle -->
</Select>
```

### Mise à jour Field 81

Le Field 81 est mis à jour via CallTask vers obj="56" ("Update FDR Précédent") qui récupère le FDR Final de la session précédente.

---

## 7. Leçons apprises (Skill)

1. **Code mort** : Les expressions peuvent exister sans être utilisées
2. **Vérifier les WithValue** : Toujours tracer quelle expression est réellement utilisée
3. **Expression vs Règle métier** : Comparer l'expression utilisée avec la règle métier attendue
4. **Indices dans le XML** : Le nom de la variable ("FDR Final lors de la dernière fermeture") donne un indice fort

---

## 8. Conclusion

**Bug confirmé** : Les Updates des champs 78/79 utilisent l'expression IDE 31 (somme complexe) au lieu de l'expression IDE 32 (DK<>EU = comparaison FDR).

### Action requise dans l'IDE Magic

**Tache 22.16.1, Record Suffix conditionnel :**

| Ligne IDE | Action |
|-----------|--------|
| 5 | Changer expression de 31 vers **32** (DK<>EU = fdr_ouverture <> v.FDR fermeture de la veille) |
| 9 | Changer expression de 31 vers **32** (DK<>EU = fdr_ouverture <> v.FDR fermeture de la veille) |

### Verification apres correction

Les expressions 35 et 36 (affichage) utilisent correctement les champs 78 et 79 :
- Expression 35 : `Trim(Str({0,4},{2,4})&IF({0,78},'**',''))` → affiche ** si Field 78 = true
- Expression 36 : `Trim(Str({0,4},{2,4})&IF({0,79},'**',''))` → affiche ** si Field 79 = true

Une fois la correction appliquee, les ** apparaitront quand FDR Initial ≠ FDR Veille.

---

*Rapport mis à jour le 2026-01-05 - Analyse complete XML confirmee*
