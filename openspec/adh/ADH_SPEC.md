# OpenSpec: Projet ADH (Adherent/Caisse)

## Metadata
- **Module**: ADH (Gestion Adherents / Caisse)
- **Source**: Magic Unipaas v12.03
- **Cible**: TypeScript / C# / Python
- **Statut**: EN ANALYSE
- **Date creation**: 2025-12-24
- **Chemin source**: `D:\Data\Migration\XPA\PMS\ADH\Source\`

---

## 1. Description fonctionnelle

Le projet ADH est le module de **gestion des adherents et operations de caisse** du systeme PMS. Il gere:
- Operations de caisse (encaissements, paiements)
- Facturations et extraits de compte
- Gestion telephonie
- Operations membres/fidelite (Great Members)
- Check-out automatise (Easy Check Out)
- Ventes et garanties

### Domaines fonctionnels (27 dossiers)

| ID | Dossier | Nb Progs | Description |
|----|---------|----------|-------------|
| 1 | Brazil DataCatching | 15 | Saisie donnees specifique Bresil |
| 2 | Change | 7 | Operations de change |
| 3 | Changement Compte | 12 | Transfert entre comptes |
| 4 | Depot | 3 | Gestion des depots |
| 5 | Divers | 11 | Utilitaires divers |
| 6 | Easy Check Out | 15 | Check-out automatise |
| 7 | Extrait de Compte | 9 | Edition extraits |
| 8 | EzCard | 12 | Gestion cartes |
| 9 | Factures | 8 | Facturation V2 |
| 10 | Factures V3 | 10 | Facturation V3 |
| 11 | Garantie | 9 | Gestion garanties |
| 12 | Gestion Caisse | 41 | Coeur du module caisse |
| 13 | Great Members | 1 | Programme fidelite |
| 14 | Identification | 4 | Authentification |
| 15 | Menus | 5 | Menus applicatifs |
| 16 | Operations GM | 11 | Operations Great Members |
| 17 | Printer Management | 10 | Gestion imprimantes |
| 18 | Solde | 9 | Gestion des soldes |
| 19 | Specif Bresil | 3 | Specificites Bresil |
| 20 | Synchro Serveur | 3 | Synchronisation |
| 21 | Telephone | 20 | Gestion telephonie |
| 22 | Utilitaires | 10 | Outils divers |
| 23 | Ventes | 24 | Module ventes |
| 24 | Zooms | 22 | Ecrans de zoom |
| 25 | Developpement | 6 | Dev/Debug |
| 26 | Sauvegarde | 5 | Backup |
| 27 | Suppr | 34 | Programmes obsoletes |

**Total: 350 programmes** (322 actifs selon header)

---

## 2. Architecture technique

### 2.1 Structure des fichiers

```
D:\Data\Migration\XPA\PMS\ADH\Source\
├── Progs.xml              -- Arborescence des programmes
├── ProgramHeaders.xml     -- Metadonnees programmes
├── DataSources.xml        -- VIDE (utilise REF)
├── DataSourcesIndex.xml   -- Index des sources
├── Comps.xml              -- Composants partages
├── Models.xml             -- Modeles
├── Menus.xml              -- Definition menus
├── Helps.xml              -- Aide contextuelle
├── Rights.xml             -- Droits/Permissions
├── ProjProps.xml          -- Proprietes projet
└── Prg_*.xml              -- 350 fichiers programmes
```

### 2.2 Dependances

- **REF.ecf**: Composant partage contenant les tables (via Comps.xml)
- Tables utilisees: Definies dans REF/DataSources.xml
- ADH n'a pas de tables propres (DataSources.xml vide)

### 2.3 Types de programmes

| TaskType | Signification | Usage |
|----------|---------------|-------|
| B | Batch/Browse | Traitements et listes |
| O | Online/Output | Ecrans interactifs |
| I | Internal | Sous-programmes |

---

## 3. Programmes cles identifies

### 3.1 Points d'entree principaux

| ID | Description | Dossier |
|----|-------------|---------|
| 1 | Main Program | (racine) |
| 7 | Menu Data Catching | Brazil DataCatching |
| 10 | Print list Checkout (shift F9) | Brazil DataCatching |

### 3.2 Programmes avec parametres

| ID | Description | Params | Types |
|----|-------------|--------|-------|
| 6 | Suppression Carac interdit | 1 | A (Alpha) |
| 9 | System avail (top left corner) | 1 | B (Boolean) |
| 13 | calculate week # | 2 | D (Date), N (Numeric) |
| 15 | keyboard | 1 | A (Alpha) |

---

## 4. Plan d'analyse

### 4.1 Priorite 1 - Coeur Caisse (41 progs)
- [ ] Analyser structure dossier "Gestion Caisse"
- [ ] Identifier le flux principal encaissement
- [ ] Cartographier les tables utilisees

### 4.2 Priorite 2 - Ventes (24 progs)
- [ ] Flux de vente standard
- [ ] Integration avec Caisse

### 4.3 Priorite 3 - Facturation (18 progs)
- [ ] Factures V2 vs V3
- [ ] Format de sortie

### 4.4 Priorite 4 - Autres modules
- [ ] Telephone (20 progs)
- [ ] Zooms (22 progs)
- [ ] Easy Check Out (15 progs)

---

## 5. Tables utilisees (via REF)

*A completer apres analyse des programmes*

| Table | Fichier | Usage |
|-------|---------|-------|
| ? | ? | A identifier |

---

## 6. Notes techniques

### 6.1 Particularites observees
- Beaucoup de programmes vides (TaskType O, sans logique)
- Dossier "Suppr" contient 34 programmes obsoletes
- Specificites Bresil (DataCatching, Specif Bresil)
- 2 versions de facturation (V2 et V3)

### 6.2 Dates de modification
- Derniere modification: 27/11/2025
- 322 programmes declares actifs

---

## 7. Prochaines etapes

1. [ ] Charger le projet avec `/magic-load`
2. [ ] Analyser le dossier "Gestion Caisse"
3. [ ] Identifier les tables REF utilisees
4. [ ] Creer mapping tables/programmes
5. [ ] Documenter le flux principal

---

*Document genere par Claude Code - 2025-12-24*
