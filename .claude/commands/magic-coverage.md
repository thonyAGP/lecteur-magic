# Matrice de Couverture Migration Magic

Affiche la matrice de couverture entre les programmes Magic et l'implementation .NET.

Module a afficher (optionnel): `$ARGUMENTS`

## Etapes

1. **Lire la matrice de couverture**
   Depuis `skills/magic-unipaas/references/adh-coverage-matrix.md`

2. **Filtrer par module si specifie**
   Si un argument est fourni, filtrer sur ce module specifique.

3. **Afficher le resume**
   Format:
   ```
   === Couverture Migration ADH ===

   Total: X/322 programmes migres (Y%)
   Endpoints: Z endpoints implementes
   Ecrans: W pages HTML

   [Si module specifie]
   Module: [NOM]
   Programmes: X-Y (Z total)
   Status: [MIGRE/PARTIEL/NON MIGRE]

   | Prg | Description | Endpoint | Ecran | Status |
   |-----|-------------|----------|-------|--------|
   ...
   ```

4. **Valider les liens**
   Pour chaque programme marque MIGRE:
   - Verifier que l'endpoint existe
   - Verifier que l'ecran HTML existe
   - Signaler les incoherences

## Arguments possibles

| Argument | Action |
|----------|--------|
| (vide) | Resume global de tous les modules |
| `change` | Detail du module Change |
| `caisse` | Detail du module Gestion Caisse |
| `ventes` | Detail du module Ventes |
| `zooms` | Detail du module Zooms |
| `validate` | Valider tous les liens ecran/endpoint |

## Exemple

```
/magic-coverage change
```

Affiche:
```
=== Module Change (Prg 19-25) ===
Status: MIGRE
Priorite: Haute
Ecran: page-change

| Prg | Description | Endpoint | Status |
|-----|-------------|----------|--------|
| 20 | Definition monnaie | /api/change/devise-locale | OK |
| 21 | Recupere devise local | /api/change/devise-locale | OK |
| 22 | Calcul equivalent | /api/change/calculer | OK |
| 23 | Print recu change achat | - | Non migre |
| 24 | Print recu change vente | - | Non migre |
| 25 | Change GM | /api/change/taux | OK |

Couverture: 4/7 (57%)
```

## References

- `skills/magic-unipaas/references/adh-coverage-matrix.md`
- `migration/caisse/src/Caisse.Api/wwwroot/index.html`
