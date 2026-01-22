# Formule de Calcul d'Offset des Variables Magic

> Documentation deterministe pour le calcul des lettres de variables dans Magic Unipaas

## Principe Fondamental

Dans Magic Unipaas, les variables sont numerotees GLOBALEMENT dans le DataView complet, incluant :
1. Les colonnes des tables (Main Source + Links) de tous les ancetres
2. Les colonnes locales (virtuelles) de tous les ancetres
3. Les colonnes des tables de la tache courante
4. PUIS les colonnes locales de la tache courante

## Formule d'Offset

```
Offset = Σ(colonnes_ancetres_complets) + colonnes_table_tache_cible
```

Ou plus detaille :

```
Offset pour les variables locales d'une tache T =
  + Colonnes TOTALES de chaque ancetre (table + locales)
  + Colonnes de la table Main Source de T (sans les locales)
```

### Exemple : VIL Prg_558 Tache Reception (ISN_2=19)

Hierarchie : Main → Edition → Reception

| Tache | Colonnes Table | Colonnes Locales | Total |
|-------|----------------|------------------|-------|
| Main (ISN=1) | 6 (obj=50) | 12 | 18 |
| Edition (ISN=18) | 56 (obj=594) | 1 | 57 |
| Reception (ISN=19) | 56 (obj=594) | 23 | N/A |

**Calcul :**
- Ancetres complets : 18 + 57 = 75
- Table Main Source de Reception : 56
- **Offset = 75 + 56 = 131**

Donc la premiere variable locale de Reception est a l'index 131 → **EB**

## Conversion Index → Lettre

| Plage Index | Formule | Exemple |
|-------------|---------|---------|
| 0-25 | chr(65 + index) | 0→A, 25→Z |
| 26-701 | AA-ZZ | 26→AA, 52→BA, 131→EB |
| 702+ | AAA-ZZZ | 702→AAA |

### Formule AA-ZZ (index 26-701)

```
first = floor((index - 26) / 26)
second = (index - 26) % 26
letter = chr(65 + first) + chr(65 + second)
```

**Exemple : Index 131**
- first = floor((131-26)/26) = floor(4.04) = 4 → E
- second = 105 % 26 = 1 → B
- Resultat : **EB**

## Comptage des Colonnes de Table

Les colonnes des tables proviennent de :
1. `<DB><DataObject comp="X" obj="Y" />` - Main Source
2. `<Links><Link><DB><DataObject comp="X" obj="Y" />` - Tables liees

Pour trouver le nombre de colonnes :
1. Dans Comps.xml, trouver ComponentDataObjects/Object[id=Y] → ItemIsn
2. Dans REF/DataSources.xml, trouver DataObject[@id=ItemIsn]
3. Compter ./Columns/Column

## Structure XML

```xml
<Task>
  <Header ISN_2="19">
    <Description>Reception</Description>
  </Header>
  <Resource>
    <DB>
      <DataObject comp="2" obj="594" />  <!-- Main Source -->
    </DB>
    <Links>
      <Link>
        <DB>
          <DataObject comp="2" obj="123" />  <!-- Table liee -->
        </DB>
      </Link>
    </Links>
    <Columns>
      <Column id="16" name="v.total Cheques">  <!-- Variables locales -->
      <Column id="17" name="v.total OD">
      ...
    </Columns>
  </Resource>
</Task>
```

## Parser Deterministe

Le script `tools/magic-logic-parser-v3.ps1` implemente cette formule :

```powershell
.\magic-logic-parser-v3.ps1 -Project VIL -PrgId 558 -TaskIsn 19
```

Output attendu :
- Offset = 131
- Premiere variable = EB (v.total Cheques)
- EU = v.FDR fermeture de la veille (index 151)
- EV = v.Session de Fermeture prec exi (index 152)

## Expressions

Les expressions utilisent `ExpSyntax/@val` pour la formule, pas `Formula`.

Les references `{niveau,colId}` signifient :
- niveau 0 = tache courante
- niveau 1 = parent direct
- niveau 2 = grand-parent
- etc.

---

*Documente le 2026-01-22 apres analyse approfondie*
