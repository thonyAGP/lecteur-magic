# Pattern: Extension sejour traitee comme nouvelle arrivee

> **Source**: CMDS-176481
> **Domaine**: PBG / Gift Pass / Arrivees
> **Type**: Bug logique metier

---

## Symptomes typiques

- Double attribution de credit (Gift Pass, Resort Credit, etc.)
- Extension de sejour declenche nouveau credit
- Credits cumules au lieu d'un seul
- "AFFAUTO" dans les mouvements multiples

---

## Detection

### Mots-cles dans le ticket
- "gift pass"
- "resort credit"
- "double"
- "extension"
- "AFFAUTO"
- "2 credits"
- "VSL" (Vente Sejour)

### Verification
1. Y a-t-il eu une extension de sejour (type VSL) ?
2. Le credit a-t-il ete attribue plusieurs fois ?
3. Les dates montrent-elles plusieurs attributions ?

---

## Cause racine typique

| Element | Valeur |
|---------|--------|
| Zone | Programme d'affectation automatique |
| Erreur | Extension traitee comme nouvelle arrivee |
| Exemple | Type "VSL" declenche gift_pass() comme type "ORDI" |

### Logique defaillante

```
AVANT (bug):
SI nouvelle_periode AND type_arrivee IN (ORDI, VSL, ...)
   ALORS attribuer_credit()
-- Les extensions (VSL) declenchent un nouveau credit

APRES (correct):
SI premiere_arrivee_sejour AND NOT extension
   ALORS attribuer_credit()
-- Seule la vraie premiere arrivee compte
```

### Types de periode

| Type | Signification | Doit declencher credit ? |
|------|---------------|--------------------------|
| ORDI | Arrivee ordinaire | OUI (si premiere) |
| VSL | Vente Sejour (extension) | NON |
| VV | Village/Village | Selon regles |

---

## Solution type

### Etape 1: Identifier le programme d'attribution

```
magic_kb_search("gift pass", project="PBG")
magic_kb_search("AFFAUTO", project="PBG")
magic_kb_search("attribution credit", project="PBG")
```

### Etape 2: Analyser la condition de declenchement

| Element | Verifier |
|---------|----------|
| Condition | Comment detecte-t-on une "nouvelle arrivee" ? |
| Type periode | Le type VSL est-il exclu ? |
| Historique | Verifie-t-on si credit deja attribue ? |

### Etape 3: Ajouter exclusion des extensions

Modifier la condition pour exclure les types d'extension :
```
Condition = nouvelle_arrivee AND type_periode <> 'VSL'
```

Ou mieux, verifier si credit deja attribue pour ce sejour.

---

## Programmes concernes (CMDS-176481)

| Programme | Nom | Role |
|-----------|-----|------|
| **PBG IDE 65** | Traitement des arrivants | Programme principal arrivees |
| PBG IDE 56 | Validation Arrivants | Validation |
| PBG IDE 734 | AFFECT_CREDIT_BAR | Attribution Credit Bar |
| PBG IDE 783 | Traitement Resort Credit | Attribution Resort Credit |
| **PBG IDE 808** | CurlAffAuto | Appel API AFFAUTO |

### Tables cles

| Table | ID | Nom | Role |
|-------|-----|-----|------|
| ccpartyp | 268 | cc_total_par_type | Stockage credits |
| cctypdet | - | - | Details mouvements |

---

## Verification base de donnees

```sql
-- Verifier mouvements Gift Pass pour un GM
SELECT date, heure, montant, utilisateur
FROM cctypdet
WHERE compte = @compte AND type = 99
ORDER BY date, heure

-- Chercher doublons
SELECT date, COUNT(*) as nb
FROM cctypdet
WHERE type = 99 AND montant > 0
GROUP BY date HAVING COUNT(*) > 1
```

---

## Checklist resolution

- [ ] Identifie programme d'attribution (PBG IDE 65, 808, etc.)
- [ ] Localise condition de declenchement credit
- [ ] Verifie si type VSL est exclu
- [ ] Ajoute condition exclusion extensions
- [ ] Ou ajoute verification "credit deja attribue"
- [ ] Teste avec extension sejour (pas de double credit)
- [ ] Teste avec nouvelle arrivee (credit attribue)

---

*Pattern capitalise le 2026-01-25*
*Source: CMDS-176481 (Ferme - 2026-01-12)*
