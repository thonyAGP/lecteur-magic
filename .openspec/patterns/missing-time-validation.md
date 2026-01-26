# Pattern: Validation heure manquante (FIELD_TIME sans Picture)

> **Source**: PMS-1453
> **Domaine**: Validation / Saisie
> **Type**: Bug validation

---

## Symptomes typiques

- Utilisateur peut saisir des heures invalides (ex: 70:00, 99:59)
- Valeurs incorrectes stockees en base
- Pas d'erreur de saisie affichee
- Champ TIME accepte n'importe quel numerique

---

## Detection

### Mots-cles dans le ticket
- "heure invalide"
- "saisie heure"
- "70:00" ou autre heure impossible
- "format heure"
- "FIELD_TIME"

### Verification
1. Identifier le champ de saisie d'heure
2. Verifier la colonne dans DataView du programme
3. Controler presence du Picture format "HH:MM" ou "HH:MM:SS"

---

## Cause racine typique

| Element | Valeur |
|---------|--------|
| Zone | DataView > Column > PropertyList |
| Erreur | Picture absent sur colonne FIELD_TIME |
| Consequence | Magic accepte toute valeur numerique |

### Explication technique

Dans Magic, le type `FIELD_TIME` definit le **format de stockage** (secondes depuis minuit) mais **PAS la validation de saisie**.

La validation de plage (00:00 a 23:59) est controlee par l'element `<Picture>` :
- Sans Picture : pas de limite, accepte 70:00, 99:99, etc.
- Avec Picture "HH:MM" : valide plage horaire

### Diagnostic

```
SI type colonne = FIELD_TIME
   ET Picture absent ou vide
   ALORS = BUG validation heure
```

---

## Solution type

### Etape 1: Localiser la colonne fautive

```
magic_get_tree(project, ide)  # Structure taches
magic_get_line(project, tache, "dataview")  # Colonnes
```

Chercher les colonnes avec:
- `<Model attr_obj="FIELD_TIME"/>`
- Picture absent

### Etape 2: Corriger le XML

**AVANT (bug)**
```xml
<Column id="5" name="W1 Heure transfert">
  <PropertyList model="FIELD">
    <Model attr_obj="FIELD_TIME" id="1"/>
    <!-- MISSING: Picture -->
  </PropertyList>
</Column>
```

**APRES (fix)**
```xml
<Column id="5" name="W1 Heure transfert">
  <PropertyList model="FIELD">
    <Model attr_obj="FIELD_TIME" id="1"/>
    <Picture id="157" valUnicode="HH:MM"/>
  </PropertyList>
</Column>
```

### Formats Picture valides pour TIME

| Format | Plage acceptee | Usage |
|--------|---------------|-------|
| `HH:MM` | 00:00-23:59 | Heure standard |
| `HH:MM:SS` | 00:00:00-23:59:59 | Heure avec secondes |
| `H:MM` | 0:00-23:59 | Heure sans zero |

---

## Exemple PMS-1453 (CORRIGE)

**Contexte**: Saisie heure de transfert

> **ATTENTION** : ADH IDE 307/313 sont ORPHELINS (dossier Suppr) - NE PAS CORRIGER.

### Programmes ACTIFS a corriger (dossier Ventes)

| Programme | Fichier | Colonnes | Table cible |
|-----------|---------|----------|-------------|
| **ADH IDE 233** | Prg_233.xml | 222, 234, 5, 13 | `transfertn` |
| **ADH IDE 234** | Prg_234.xml | 222, 234, 5, 13 | `transfertn` |
| **ADH IDE 235** | Prg_235.xml | 222, 234, 5, 13 | `transfertn` |
| **ADH IDE 236** | Prg_236.xml | 222, 234, 5, 13 | `transfertn` |

### Colonnes a corriger (par programme)

| Colonne | Nom | Ligne approx | Action |
|---------|-----|--------------|--------|
| 222 | W0 Heure du transfert Aller | ~590 | Ajouter Picture HH:MM |
| 234 | W0 Heure du transfert Retour | ~666 | Ajouter Picture HH:MM |
| 5 | W1 Heure transfert Aller | ~36943 | Ajouter Picture HH:MM |
| 13 | W1 Heure transfert Retour | ~37000 | Ajouter Picture HH:MM |

**Total: 16 modifications (4 colonnes x 4 programmes)**

---

## Checklist resolution

- [ ] Verifier dossier du programme dans Progs.xml (Ventes vs Suppr)
- [ ] IGNORER programmes dans dossier Suppr (orphelins)
- [ ] Identifier tous les champs FIELD_TIME concernes
- [ ] Verifier presence Picture sur chaque champ
- [ ] Ajouter Picture "HH:MM" si absent
- [ ] Tester saisie 00:00, 12:30, 23:59 (valide)
- [ ] Tester saisie 24:00, 70:00, 99:99 (doit etre rejete)

---

## Programmes similaires a verifier

Autres ecrans avec saisie d'heure potentiellement affectes :
- Planification activites
- Reservations restaurants
- Heures d'ouverture services
- Pointage personnel

---

## Approche alternative

Si modification XML impossible, ajouter validation applicative :

### Control Verify handler
```
IF heure_saisie > 86399 OR heure_saisie < 0 THEN
   Verify Error "L'heure doit etre entre 00:00 et 23:59"
   Annuler
END IF
```

### Expression Range
```
Range(heure_saisie, 0, 86399)
```
Retourne TRUE si valide, FALSE sinon.

> Note: 86399 = 23*3600 + 59*60 + 59 = derniere seconde valide

---

*Pattern capitalise le 2026-01-26*
*Corrige le 2026-01-26 : IDE 307/313 orphelins, vrais programmes = IDE 233-236*
*Specs liees: ADH-IDE-233, ADH-IDE-234, ADH-IDE-235, ADH-IDE-236*
