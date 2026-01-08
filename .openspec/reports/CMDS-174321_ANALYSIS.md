# Analyse Bug CMDS-174321

## Symptome

| Source | Date Arrivee | Statut |
|--------|--------------|--------|
| NA (Easy Arrival) | **25 DEC 2025** | Correct |
| PMS (PB027) | **25 JAN 2026** | INCORRECT |

**Ecart:** +1 mois

**GM concerne:** SEEDSMAN Zoe (file 363116431)

---

## Ecran PB027 - Planning/Display of GM Lodging

### Programmes impliques

| Projet | Prg ID | IDE | Description | Role |
|--------|--------|-----|-------------|------|
| PBP | 62 | 157 | Prep tempo arrivant planning | Preparation donnees temp |
| PBP | 63 | 158 | Affich arrivant planning GM | Affichage ecran |
| PBP | 64 | - | Imprim GM arrivant planning | Impression |
| PBG | 315 | 24 | Import GM seminaire via txt | Import fichiers NA |

### Tables cles

| Table | ID REF | Fichier Physique | Champ Date |
|-------|--------|------------------|------------|
| client_gm | 36 | cafil014_dat | `gm_date_debut` (char(8)) |
| gm-complet | 31 | cafil009_dat | - |
| heure_de_passage | 463 | verifpool_dat | `con_heure` (Time) |

---

## Flux de donnees

```
NA (Easy Arrival)
    |
    v
[Fichier TXT/CSV]
    |
    v
PBG Prg_315 "Import GM seminaire via txt"
    |
    v
Table client_gm (gm_date_debut)
    |
    v
PBP Prg_62 "Prep tempo arrivant planning"
    |
    v
Tables temporaires
    |
    v
PBP Prg_63 "Affich arrivant planning GM" --> Ecran PB027
```

---

## Analyse technique

### Format de stockage date Magic

- **Type:** Date (attribute="D")
- **Picture:** DD/MM/YYYY
- **Stockage:** char(8) - format interne YYYYMMDD
- **StoredAs:** 19 (Date Internal)

### Hypotheses du bug

| # | Hypothese | Probabilite | Explication |
|---|-----------|-------------|-------------|
| 1 | **Parsing DD/MM vs MM/DD** | Moyenne | 25/12/2025 interprete comme 12/25/2025 puis converti en 25/01/2026 (mois suivant car jour 25 > max decembre) |
| 2 | **Donnee source corrompue** | Haute | Le fichier NA pourrait contenir une date incorrecte pour ce GM specifique |
| 3 | **Bug calcul dans Prg_62** | Faible | Manipulation incorrecte des dates dans la preparation |
| 4 | **Cache non rafraichi** | Faible | Tables temporaires avec ancienne valeur |

### Analyse de l'hypothese 1 (Parsing)

Si le systeme source envoie `25-12-2025` et le parsing Magic l'interprete comme:
- Mois = 25 (invalide -> corrige a 01 du mois suivant = Janvier)
- Jour = 12
- Annee = 2025 + 1 = 2026 (car debordement mois)

Resultat: **25/01/2026** - correspond exactement au bug!

---

## Actions recommandees

### Verification immediate

1. **Verifier la donnee en base**
   ```sql
   SELECT gm_societe, gm_compte, gm_filiation, gm_date_debut, gm_date_fin
   FROM cafil014_dat
   WHERE gm_compte = 363116431
   ```

2. **Comparer avec autre membre famille**
   - Verifier si d'autres membres du meme dossier ont la bonne date
   - Si oui, le probleme est specifique a cet enregistrement

### Investigation approfondie

3. **Analyser Prg_315 (PBG)**
   - Localiser la lecture du fichier TXT/CSV
   - Verifier le format de date attendu vs recu
   - Chercher les expressions `DVal()` ou conversion de date

4. **Tracer le flux complet**
   - Ajouter des logs dans Prg_62 pour voir la valeur de `gm_date_debut` en entree
   - Comparer avec la valeur affichee en sortie

---

## Analyse approfondie (2026-01-07)

### Tracage du flux PB027

| Composant | Programme | Role |
|-----------|-----------|------|
| PBP | Prg_62 (IDE 157) | Preparation donnees temp |
| PBP | Prg_63 (IDE 158) | Affichage ecran GUI |

### Champs identifies dans Prg_63

| FieldID | Column Source | Contenu |
|---------|---------------|---------|
| 26 | Column 12 | Date arrivee |
| 27 | Column 13 | Heure arrivee |
| 28 | Column 14 | Date depart |
| 29 | Column 15 | Heure depart |

### Observation CRITIQUE des captures

| Source | Date Arrivee | Date Depart | Format |
|--------|--------------|-------------|--------|
| Terminal (image 2) | **25DEC** | 04JAN26 | DDMMM |
| GUI PB027 (images 1,3) | **25/01/2026** | 04/01/2026 | DD/MM/YYYY |

**Le terminal et le GUI sont le MEME ecran PB027** mais en modes differents !
- Terminal : affiche la date correcte (25 decembre)
- GUI : affiche une date erronee (25 janvier)

### Hypothese raffinee

Le bug n'est **PAS dans l'import** mais dans **l'affichage GUI** de Prg_63.

Possibilites :
1. **Type de colonne incorrect** : La colonne 12 de la table temporaire est stockee comme String (YYYYMMDD) mais affichee comme Date avec Picture DD/MM/YYYY → inversion des bytes
2. **Probleme de locale/format** : Le GUI interprete differemment le format de date interne
3. **Bug specifique a ce GM** : Donnee corrompue uniquement pour ce dossier

---

## Actions pour resolution

### Immediat (utilisateur)

1. **Requete SQL de verification:**
   ```sql
   -- Verifier la donnee brute dans la table temporaire
   SELECT * FROM [table_temp_planning]
   WHERE compte = 363116431

   -- Verifier la table source client_gm
   SELECT gm_societe, gm_compte, gm_filiation,
          gm_date_debut, gm_date_fin
   FROM cafil014_dat
   WHERE gm_compte = 363116431
   ```

2. **Comparer les donnees** entre le stockage interne et l'affichage

### Investigation technique

3. **Verifier le type de la Column 12** dans la table obj="171" (REF comp=2)
4. **Comparer le Picture** du champ FieldID=26 avec le format attendu
5. **Tester avec un GM ayant jour <= 12** pour voir si le bug se manifeste

---

## RÉSOLUTION FINALE (2026-01-07)

### Cause identifiée : DONNÉES CORROMPUES EN BASE

**Le bug n'est PAS dans l'affichage** - il est dans les **données source** de la table `cafil014_dat`.

### Preuves SQL (base PHU2512)

```sql
-- Requête exécutée
SELECT gm_compte, gm_filiation, gm_nom, gm_prenom, gm_date_debut, gm_date_fin
FROM cafil014_dat WHERE gm_nom LIKE '%SEED%'
```

| Compte | Filiation | Nom | Prénom | Date Début | Date Fin |
|--------|-----------|-----|--------|------------|----------|
| 675336 | 0 | SEEDMAN | Michelle | 20251225 ✅ | 20260104 |
| 675336 | 1 | SEEDSMAN | Warren | 20251225 ✅ | 20260104 |
| 675336 | 2 | SEEDSMAN | Jasmine | 20251225 ✅ | 20260104 |
| 675336 | **3** | SEEDSMAN | **Zoe** | **20260125 ❌** | 20260104 |

**Zoe a une date d'arrivée (25/01/2026) APRÈS sa date de départ (04/01/2026) !**

### Anomalies détectées

```sql
SELECT * FROM cafil014_dat WHERE gm_date_debut > gm_date_fin
-- Résultat: 2 enregistrements
```

| Compte | Filiation | Nom | Date arrivée stockée | Date correcte probable |
|--------|-----------|-----|----------------------|------------------------|
| 675336 | 3 | SEEDSMAN Zoe | 20260125 | 20251225 |
| 676227 | 3 | SHARMAN India Ray | 20260124 | 20251224 |

### Analyse du pattern

- **Pas systématique** : 459 autres GM filiation 3 ont des dates décembre correctes
- **Erreur ponctuelle** : Bug de conversion lors de l'import PMS
- **Conversion mois** : Le mois 12 (décembre) a été converti en mois 01 (janvier) année +1

---

## ANALYSE DES FICHIERS SOURCE NA (2026-01-07)

### Fichiers extraits

Archive `C:\data-01\ARRIVANT\VILLAGE\CVPHUK\ARCHIVE\251225.ZIP` :

| Fichier | Taille | Contenu |
|---------|--------|---------|
| IDE.DAT | 3.7 MB | Identification GM |
| FRA.DAT | 1.9 MB | Transport (vols) |
| RV.HST | 5.3 MB | Historique réservations (ILOG, IPRE, ICLI, etc.) |
| ANN.DAT | 1.9 KB | Annulations |
| MOD.DAT | 1.6 KB | Modifications |

### Données SEEDSMAN dans RV.HST (lignes ILOG - logement)

```
ILOGPHUC  CM0000PHUC  241225363116431001      004000UB2+B2A251225040126...
ILOGPHUC  CM0000PHUC  241225363116431002      004000UB2+B2A251225040126...
ILOGPHUC  CM0000PHUC  241225363116431003      004000UB2+B2A251225040126...
ILOGPHUC  CM0000PHUC  241225363116431004      004000UB2+B2A251225040126...
```

### Comparaison Source NA vs Base PMS

| Filiation | Nom | Date NA (RV.HST) | Date PMS (cafil014) | Statut |
|-----------|-----|------------------|---------------------|--------|
| 001 | SEEDMAN Michelle | **251225** ✅ | 20251225 ✅ | OK |
| 002 | SEEDSMAN Warren | **251225** ✅ | 20251225 ✅ | OK |
| 003 | SEEDSMAN Jasmine | **251225** ✅ | 20251225 ✅ | OK |
| 004 | SEEDSMAN Zoe | **251225** ✅ | **20260125** ❌ | **BUG IMPORT** |

### Conclusion DÉFINITIVE

**Les données source NA sont CORRECTES** (251225 = 25/12/2025 pour tous les membres).

**Le BUG est dans le programme d'IMPORT PMS** (PBG Prg_315 ou autre) qui a mal converti la date pour Zoe uniquement.

### Traçabilité complète (archives NA)

| Date archive | Source | Date Zoe (filiation 004) | Status |
|--------------|--------|--------------------------|--------|
| 01/12/2025 | RV.HST ligne 10561 | `251225040126` | ✅ CORRECT |
| 10/12/2025 | RV.HST ligne 10358 | `251225040126` | ✅ CORRECT |
| 20/12/2025 | RV.HST ligne 10436 | `251225040126` | ✅ CORRECT |
| 25/12/2025 | RV.HST ligne 9528 | `251225040126` | ✅ CORRECT |
| **Base PMS** | cafil014_dat | `20260125` | ❌ **ERREUR** |

### Hypothèse du bug d'import - RÉVISÉE

**DÉCOUVERTE** : Le bug affecte aussi SHARMAN India Ray (compte NA 324618615, PMS 676227).

| GM | Date fichier | Date séjour NA | Date PMS erronée | Jour erroné |
|-----|--------------|----------------|------------------|-------------|
| SEEDSMAN Zoe | **25**/12 | 25/12/25 | **25**/01/26 | 25 ← fichier ou séjour |
| SHARMAN India Ray | **24**/12 | 01/01/26 | **24**/01/26 | 24 ← **fichier** ! |

**CAUSE PROBABLE** : Le programme d'import lit la **date du fichier** (JJMMAA dans l'en-tête RV.HST) à la place de la date de séjour pour certains GM (filiation 3).

Pattern d'erreur :
- Jour : pris du **fichier** (241225 → jour 24, ou 251225 → jour 25)
- Mois : forcé à **01** (janvier)
- Année : forcée à **2026**

**Note** : Le programme d'import PBG Prg_315 est compilé (sans source XML), l'analyse du code n'est pas possible.

---

### Actions recommandées

1. **Correction manuelle immédiate** :
   ```sql
   UPDATE cafil014_dat SET gm_date_debut = '20251225'
   WHERE gm_compte = 675336 AND gm_filiation = 3;

   UPDATE cafil014_dat SET gm_date_debut = '20251224'
   WHERE gm_compte = 676227 AND gm_filiation = 3;
   ```

2. **Investigation Import PBG** : Analyser Prg_315 pour comprendre la conversion de date
3. **Contrôle d'intégrité** : Ajouter une validation `date_debut <= date_fin` dans l'import

### Conclusion

**CAUSE RACINE** : Bug de conversion de date dans le programme d'import PMS (données source NA correctes).

---

## DONNÉES REQUISES POUR COMPLÉTER L'ANALYSE

### Base de données

| Élément | Valeur |
|---------|--------|
| **Village** | VPHUKET (Thaïlande) |
| **Date** | 21/12/2025 (ou date proche du symptôme) |
| **Dossier concerné** | 363116431 |

### Tables à extraire

| Table SQL | Champs critiques | Description |
|-----------|------------------|-------------|
| `cafil014_dat` | `gm_societe`, `gm_compte`, `gm_filiation`, `gm_date_debut`, `gm_date_fin` | Table client_gm - source des dates GM |
| `planning_temp` ou table obj=171 | colonnes 4, 5, 12, 13 | Table temporaire préparation planning |
| `roomfile` (si existe) | `room_date_debut_sejour`, `room_date_fin_sejour` | Hébergements/logements |

### Requêtes SQL à exécuter

```sql
-- 1. Données GM du dossier concerné
SELECT gm_societe, gm_compte, gm_filiation,
       gm_date_debut, gm_date_fin,
       gm_nom, gm_prenom
FROM cafil014_dat
WHERE gm_compte = 363116431
ORDER BY gm_filiation;

-- 2. Vérifier le format de stockage (raw bytes si possible)
SELECT gm_date_debut,
       CONVERT(VARBINARY(8), gm_date_debut) as raw_bytes
FROM cafil014_dat
WHERE gm_compte = 363116431;

-- 3. Chercher d'autres GM avec date > 12ème jour (pour confirmer pattern)
SELECT TOP 20 gm_compte, gm_filiation, gm_date_debut
FROM cafil014_dat
WHERE gm_date_debut IS NOT NULL
  AND DAY(gm_date_debut) > 12
ORDER BY gm_date_debut DESC;
```

### Fichiers d'import (si disponibles)

| Fichier | Source | Contenu attendu |
|---------|--------|-----------------|
| `*.txt` ou `*.csv` import NA | Easy Arrival / NA | Fichier d'import GM séminaire |
| Logs import PBG | Dossier logs | Traces de l'import Prg_315 |

---

## Fichiers MCP crees (bonus)

Dans le cadre de cette analyse, 4 nouveaux outils MCP ont ete implementes:

| Outil | Description |
|-------|-------------|
| `magic_find_program` | Recherche fuzzy cross-projet |
| `magic_list_programs` | Liste paginee avec filtres |
| `magic_index_stats` | Statistiques de l'index |
| `magic_get_dependencies` | Dependances cross-projet |

**Build:** `tools/MagicMcp/bin/Release/net8.0/`

---

*Rapport genere le 2026-01-06, mis a jour le 2026-01-07*
