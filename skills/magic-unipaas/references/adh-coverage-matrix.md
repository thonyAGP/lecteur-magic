# ADH Coverage Matrix - Magic to .NET Migration

## Vue d'ensemble

| Metrique | Valeur |
|----------|--------|
| Total Programmes | 322 |
| Total Dossiers | 27 |
| Programmes migres | ~70 |
| Endpoints API | ~70 |
| Ecrans HTML | 15 |
| Couverture | ~22% |

---

## Matrice de couverture par module

### 1. Brazil DataCatching (Prg 4-18) - 15 programmes
**Priorite:** Basse (specifique Bresil)
**Ecran HTML:** Non implemente
**Status:** Non migre

| Prg | Description | Type | Endpoint | Ecran | Status |
|-----|-------------|------|----------|-------|--------|
| 4 | (Empty) | O | - | - | Skip |
| 5 | Alimentation Combos NATION P | B | - | - | Non migre |
| 6 | Suppression Carac interdit | B | /api/ezcard/valider-caracteres | page-ezcard | MIGRE |
| 7 | Menu Data Catching | B | - | - | Non migre |
| 8 | Set Village info | B | - | - | Non migre |
| 9 | System avail (top left corner) | B | - | - | Non migre |
| 10 | Print list Checkout (shift F9) | B | - | - | Non migre |
| 11 | Export - address | B | - | - | Non migre |
| 12 | Catching stats | B | - | - | Non migre |
| 13 | calculate week # | B | - | - | Non migre |
| 14 | e-mail list | O | - | - | Non migre |
| 15 | keyboard | O | - | - | Non migre |
| 16 | Browse - Countries iso | B | /api/zooms/pays | zooms.html | MIGRE |
| 17 | Print C/O confirmation | B | - | - | Non migre |
| 18 | Print extrait compte | B | - | - | Non migre |

---

### 2. Change (Prg 19-25) - 7 programmes
**Priorite:** Haute
**Ecran HTML:** page-change
**Status:** MIGRE

| Prg | Description | Type | Endpoint | Ecran | Status |
|-----|-------------|------|----------|-------|--------|
| 19 | (Empty) | O | - | - | Skip |
| 20 | Definition monnaie | B | /api/change/devise-locale | page-change | MIGRE |
| 21 | Recupere devise local | B | /api/change/devise-locale | page-change | MIGRE |
| 22 | Calcul equivalent | B | /api/change/calculer | page-change | MIGRE |
| 23 | Print recu change achat | B | - | - | Non migre |
| 24 | Print recu change vente | B | - | - | Non migre |
| 25 | Change GM | B | /api/change/taux | page-change | MIGRE |

---

### 3. Changement Compte (Prg 26-37) - 12 programmes
**Priorite:** Moyenne
**Ecran HTML:** Non implemente (separe)
**Status:** Partiellement migre

| Prg | Description | Type | Endpoint | Ecran | Status |
|-----|-------------|------|----------|-------|--------|
| 26 | (Empty) | O | - | - | Skip |
| 27 | Separation | B | /api/changement-compte/separation | - | MIGRE |
| 28 | Fusion | B | /api/changement-compte/fusion | - | MIGRE |
| 29 | Write histo Fus_Sep | B | - | - | Interne |
| 30 | Read histo Fus_Sep_Det | B | /api/changement-compte/historique | - | MIGRE |
| 31 | Write histo_Fus_Sep_Det | B | - | - | Interne |
| 32 | Write histo_Fus_Sep_Saisie | B | - | - | Interne |
| 33 | Delete histo_Fus_Sep_Saisie | B | - | - | Interne |
| 34 | Read histo_Fus_Sep_Log | B | - | - | Interne |
| 35 | Write histo_Fus_Sep_Log | B | - | - | Interne |
| 36 | Print Separation ou fusion | B | - | - | Non migre |
| 37 | Menu changement compte | O | /api/menus/changement-compte | - | MIGRE |

---

### 4. Depot (Prg 38-40) - 3 programmes
**Priorite:** Moyenne
**Ecran HTML:** page-depot
**Status:** MIGRE

| Prg | Description | Type | Endpoint | Ecran | Status |
|-----|-------------|------|----------|-------|--------|
| 38 | (Empty) | O | - | - | Skip |
| 39 | Print extrait ObjDevSce | B | /api/depot/extrait | page-depot | MIGRE |
| 40 | Comptes de depot | B | /api/depot/retirer | page-depot | MIGRE |

---

### 5. Divers (Prg 41-51) - 11 programmes
**Priorite:** Moyenne
**Ecran HTML:** page-divers (5 onglets)
**Status:** MIGRE

| Prg | Description | Type | Endpoint | Ecran | Status |
|-----|-------------|------|----------|-------|--------|
| 41 | (Empty) | O | - | - | Skip |
| 42 | Controle Login Informaticien | B | /api/divers/acces-info | page-divers#acces | MIGRE |
| 43 | Recuperation du titre | B | /api/divers/titre | page-divers#titre | MIGRE |
| 44 | Appel programme | B | - | - | Interne |
| 45 | Recuperation langue | B | /api/divers/langue | page-divers#langue | MIGRE |
| 46 | Affichage Version | O | - | - | Non migre |
| 47 | Date/Heure session user | B | /api/divers/session-timestamp | page-divers#timestamp | MIGRE |
| 48 | Controles - Integrite dates | B | /api/divers/integrite-dates | page-divers#dates | MIGRE |
| 49 | Truncate table SQL | B | - | - | Interne |
| 50 | Initialisation Easy Arrival | B | - | - | Non migre |
| 51 | Recherche Droit Solde Free Ext | B | - | - | Non migre |

---

### 6. Easy Check Out (Prg 52-66) - 15 programmes
**Priorite:** Haute
**Ecran HTML:** page-checkout
**Status:** MIGRE

| Prg | Description | Type | Endpoint | Ecran | Status |
|-----|-------------|------|----------|-------|--------|
| 52 | Creation adresse_village | B | - | - | Interne |
| 53 | EXTRAIT_EASY_CHECKOUT | B | /api/easycheckout/extrait | page-checkout | MIGRE |
| 54 | FACTURES_CHECK_OUT | B | /api/factures/checkout | page-factures | MIGRE |
| 55 | Easy Check-Out V2.00 | O | - | page-checkout | UI Only |
| 56 | Recap Trait Easy Check-Out | O | - | - | Non migre |
| 57 | Factures_Sejour | B | - | - | Non migre |
| 58 | Incremente N° de Facture | B | - | - | Interne |
| 59 | Facture - chargement boutique | B | - | - | Interne |
| 60 | Creation entete facture | B | /api/factures/creer | page-factures | MIGRE |
| 61 | Maj des lignes saisies | B | - | - | Interne |
| 62 | Maj Hebergement Tempo | B | - | - | Interne |
| 63 | Test Easy Check-Out Online | O | - | - | Dev Only |
| 64 | SOLDE_EASY_CHECK_OUT | B | /api/easycheckout/solde | page-checkout | MIGRE |
| 65 | EDITION_EASY_CHECK_OUT | B | /api/easycheckout/edition | page-checkout | MIGRE |
| 66 | Lancement Solde ECO | B | - | - | Interne |

---

### 7. Extrait de Compte (Prg 67-75) - 9 programmes
**Priorite:** Haute
**Ecran HTML:** page-extrait
**Status:** MIGRE

| Prg | Description | Type | Endpoint | Ecran | Status |
|-----|-------------|------|----------|-------|--------|
| 67 | (partie extrait) | B | - | - | Non migre |
| 68 | (partie extrait) | B | - | - | Non migre |
| 69 | EXTRAIT_COMPTE | B | /api/extrait | page-extrait | MIGRE |
| 70 | EXTRAIT_NOM | B | /api/extrait | page-extrait | MIGRE |
| 71 | EXTRAIT_DATE | B | /api/extrait | page-extrait | MIGRE |
| 72 | EXTRAIT_CUM | B | /api/extrait | page-extrait | MIGRE |
| 73 | EXTRAIT_IMP | B | - | - | Non migre |
| 74 | (partie extrait) | B | - | - | Non migre |
| 75 | (partie extrait) | B | - | - | Non migre |

---

### 8. EzCard (Prg 76-87) - 12 programmes
**Priorite:** Moyenne
**Ecran HTML:** page-ezcard
**Status:** MIGRE

| Prg | Description | Type | Endpoint | Ecran | Status |
|-----|-------------|------|----------|-------|--------|
| 76 | EXTRAIT_SERVICE | B | - | - | Non migre |
| 77-83 | (EzCard utils) | B | - | - | Interne |
| 84 | CARACT_INTERDIT | B | /api/ezcard/valider-caracteres | page-ezcard | MIGRE |
| 85-87 | (EzCard utils) | B | /api/ezcard/* | page-ezcard | MIGRE |

---

### 9-10. Factures / Factures V3 (Prg 88-105) - 18 programmes
**Priorite:** Moyenne
**Ecran HTML:** page-factures
**Status:** Partiellement migre

| Prg | Description | Type | Endpoint | Ecran | Status |
|-----|-------------|------|----------|-------|--------|
| 88-95 | Factures V2 | B | /api/factures/* | page-factures | Partiel |
| 96 | (separator) | - | - | - | Skip |
| 97 | Saisie_facture_tva | B | /api/factures/creer | page-factures | MIGRE |
| 98-105 | Factures V3 | B | - | - | Non migre |

---

### 11. Garantie (Prg 106-114) - 9 programmes
**Priorite:** Haute
**Ecran HTML:** page-garantie
**Status:** MIGRE

| Prg | Description | Type | Endpoint | Ecran | Status |
|-----|-------------|------|----------|-------|--------|
| 106-110 | (Garantie utils) | B | - | - | Interne |
| 111 | GARANTIE | B | /api/garantie | page-garantie | MIGRE |
| 112-114 | (Garantie utils) | B | - | - | Interne |

---

### 12. Gestion Caisse (Prg 115-155) - 41 programmes
**Priorite:** CRITIQUE
**Ecran HTML:** page-session, page-comptage, page-devises
**Status:** MIGRE 90%

| Prg | Description | Type | Endpoint | Ecran | Status |
|-----|-------------|------|----------|-------|--------|
| 115-120 | Init/Config caisse | B | /api/sessions/* | page-session | MIGRE |
| 121 | Gestion_Caisse_142 | B | /api/sessions/* | page-session | MIGRE |
| 122 | Ouverture session | B | /api/sessions/ouvrir | page-session | MIGRE |
| 123-130 | Operations courantes | B | /api/sessions/* | page-session | MIGRE |
| 131 | Fermeture session | B | /api/sessions/fermer | page-session | MIGRE |
| 132-140 | Devises operations | B | /api/devises/* | page-devises | MIGRE |
| 141-145 | Ecarts/rapports | B | /api/sessions/* | page-session | MIGRE |
| 146-150 | Coffre operations | B | /api/coffre/* | page-devises | MIGRE |
| 151-155 | Utils caisse | B | - | - | Interne |

---

### 13. Great Members (Prg 156) - 1 programme
**Priorite:** Basse
**Status:** Non migre

---

### 14. Identification (Prg 157-160) - 4 programmes
**Priorite:** Haute
**Ecran HTML:** page-identification
**Status:** MIGRE

| Prg | Description | Type | Endpoint | Ecran | Status |
|-----|-------------|------|----------|-------|--------|
| 157 | Login utilisateur | B | /api/identification/verifier | page-identification | MIGRE |
| 158 | Verification droits | B | /api/identification/verifier | page-identification | MIGRE |
| 159 | Changement mot passe | B | - | - | Non migre |
| 160 | GetCMP (Club Med Pass) | B | /api/members/club-med-pass | page-compte | MIGRE |

---

### 15. Menus (Prg 161-165) - 5 programmes
**Priorite:** Haute
**Ecran HTML:** Sidebar navigation
**Status:** MIGRE

| Prg | Description | Type | Endpoint | Ecran | Status |
|-----|-------------|------|----------|-------|--------|
| 161 | Menu Principal Caisse | O | /api/menus/caisse | sidebar | MIGRE |
| 162 | Menu Ventes | O | /api/menus/ventes | sidebar | MIGRE |
| 163 | Menu Change | O | /api/menus/change | sidebar | MIGRE |
| 164 | Menu Depot | O | /api/menus/depot | sidebar | MIGRE |
| 165 | Menu Factures | O | /api/menus/factures | sidebar | MIGRE |

---

### 16. Operations GM (Prg 166-176) - 11 programmes
**Priorite:** Moyenne
**Status:** Non migre

---

### 17. Printer Management (Prg 177-186) - 10 programmes
**Priorite:** Basse
**Status:** Non migre

| Prg | Description | Type | Endpoint | Ecran | Status |
|-----|-------------|------|----------|-------|--------|
| 178 | GET_PRINTER | B | - | - | Non migre |
| 180 | SET_LIST_NUMBER | B | - | - | Non migre |
| 181 | RAZ_PRINTER | B | - | - | Non migre |

---

### 18. Solde (Prg 187-195) - 9 programmes
**Priorite:** Haute
**Ecran HTML:** page-compte
**Status:** MIGRE

| Prg | Description | Type | Endpoint | Ecran | Status |
|-----|-------------|------|----------|-------|--------|
| 187-191 | Solde utils | B | - | - | Interne |
| 192 | SOLDE_COMPTE | B | /api/solde | page-compte | MIGRE |
| 193-195 | Autres soldes | B | - | - | Non migre |

---

### 19. Specif Bresil (Prg 196-198) - 3 programmes
**Priorite:** Basse
**Status:** Non migre

---

### 20. Synchro Serveur (Prg 199-201) - 3 programmes
**Priorite:** Basse
**Status:** Non migre

---

### 21. Telephone (Prg 202-221) - 20 programmes
**Priorite:** Moyenne
**Ecran HTML:** page-telephone
**Status:** MIGRE

| Prg | Description | Type | Endpoint | Ecran | Status |
|-----|-------------|------|----------|-------|--------|
| 202-207 | Tel utils | B | - | - | Interne |
| 208 | OPEN_PHONE_LINE | B | /api/telephone/gerer | page-telephone | MIGRE |
| 209 | (Tel utils) | B | - | - | Interne |
| 210 | CLOSE_PHONE_LINE | B | /api/telephone/gerer | page-telephone | MIGRE |
| 211-221 | Tel utils | B | /api/telephone/* | page-telephone | Partiel |

---

### 22. Utilitaires (Prg 222-231) - 10 programmes
**Priorite:** Basse
**Ecran HTML:** page-divers (partiel)
**Status:** Partiellement migre

| Prg | Description | Type | Endpoint | Ecran | Status |
|-----|-------------|------|----------|-------|--------|
| 222-228 | Utils divers | B | - | - | Non migre |
| 229 | PRINT_TICKET | B | /api/ventes/print-ticket | page-ventes | MIGRE |
| 230-231 | Utils divers | B | - | - | Non migre |

---

### 23. Ventes (Prg 232-255) - 24 programmes
**Priorite:** Haute
**Ecran HTML:** page-ventes
**Status:** MIGRE

| Prg | Description | Type | Endpoint | Ecran | Status |
|-----|-------------|------|----------|-------|--------|
| 232 | Print ticket vente | B | /api/ventes/print-ticket | page-ventes | MIGRE |
| 233-236 | Transaction Nouv vente | B | - | - | Non migre |
| 237 | Solde Gift Pass | B | /api/ventes/solde-giftpass | page-ventes#giftpass | MIGRE |
| 238 | Historique ventes | B | /api/ventes/historique | page-ventes#historique | MIGRE |
| 239-241 | Histo ventes detail | B | /api/ventes/historique | page-ventes#historique | MIGRE |
| 242-249 | Divers ventes | B | - | - | Non migre |
| 250 | Solde Resort Credit | B | /api/ventes/solde-resortcredit | page-ventes#resortcredit | MIGRE |
| 251-255 | Zooms ventes | B | - | - | Non migre |

---

### 24. Zooms (Prg 256-277) - 22 programmes
**Priorite:** Haute
**Ecran HTML:** zooms.html
**Status:** MIGRE

| Prg | Description | Type | Endpoint | Ecran | Status |
|-----|-------------|------|----------|-------|--------|
| 256 | Zoom Moyens Reglement | B | /api/zooms/moyens-reglement | zooms.html | MIGRE |
| 257 | Zoom Tables Reference | B | /api/zooms/tables | zooms.html | MIGRE |
| 258 | Zoom Devises | B | /api/zooms/devises | zooms.html | MIGRE |
| 259 | Zoom Garanties | B | /api/zooms/garanties | zooms.html | MIGRE |
| 260 | Zoom Depots Objets | B | /api/zooms/depots-objets | zooms.html | MIGRE |
| 261 | Zoom Depots Devises | B | /api/zooms/depots-devises | zooms.html | MIGRE |
| 262 | Zoom Pays | B | /api/zooms/pays | zooms.html | MIGRE |
| 263 | Zoom Types Taux Change | B | /api/zooms/types-taux-change | zooms.html | MIGRE |
| 264-277 | Autres zooms | B | - | - | Non migre |

---

### 25. Developpement (Prg 278-283) - 6 programmes
**Priorite:** Basse (outils dev)
**Status:** Non migre

---

### 26. Sauvegarde (Prg 284-288) - 5 programmes
**Priorite:** Basse
**Status:** Non migre

---

### 27. Suppr (Prg 289-322) - 34 programmes
**Priorite:** Basse (nettoyage)
**Status:** Non migre

---

## Navigation Map

```
index.html (SPA)
|
+-- page-dashboard
|   +-- Stats: statSessions, statDevises, statVentes, statEcart
|   +-- Actions rapides -> [session, ventes, compte, checkout, change, comptage]
|
+-- page-identification
|   +-- Form login -> POST /api/identification/verifier
|
+-- page-session
|   +-- Ouverture -> POST /api/sessions/ouvrir
|   +-- Fermeture -> POST /api/sessions/fermer
|   +-- Liste -> GET /api/sessions
|
+-- page-comptage
|   +-- Comptage especes -> Calcul local
|   +-- Validation -> PUT /api/sessions/{id}
|
+-- page-ventes
|   +-- tab-historique -> GET /api/ventes/historique
|   +-- tab-giftpass -> GET /api/ventes/solde-giftpass
|   +-- tab-resortcredit -> GET /api/ventes/solde-resortcredit
|
+-- page-devises
|   +-- Liste devises -> GET /api/devises
|   +-- Coffre -> GET /api/coffre
|
+-- page-change
|   +-- Calculateur -> GET /api/change/calculer
|   +-- Taux -> GET /api/change/taux
|
+-- page-compte
|   +-- Solde -> GET /api/solde
|   +-- Club Med Pass -> GET /api/members/club-med-pass
|
+-- page-extrait
|   +-- Mouvements -> GET /api/extrait
|
+-- page-garantie
|   +-- Depots actifs -> GET /api/garantie
|
+-- page-checkout
|   +-- Solde ECO -> POST /api/easycheckout/solde
|   +-- Edition -> GET /api/easycheckout/edition
|   +-- Extrait -> GET /api/easycheckout/extrait
|
+-- page-factures
|   +-- Checkout -> GET /api/factures/checkout
|   +-- Creer -> POST /api/factures/creer
|
+-- page-telephone
|   +-- Lignes -> GET /api/telephone
|   +-- Gerer -> POST /api/telephone/gerer
|
+-- page-ezcard
|   +-- Recherche -> GET /api/ezcard
|   +-- Desactiver -> POST /api/ezcard/desactiver
|   +-- Valider -> POST /api/ezcard/valider-caracteres
|
+-- page-depot
|   +-- Extrait -> GET /api/depot/extrait
|   +-- Retirer -> POST /api/depot/retirer
|
+-- page-divers
|   +-- tab-langue -> GET /api/divers/langue
|   +-- tab-titre -> GET /api/divers/titre
|   +-- tab-acces -> GET /api/divers/acces-info
|   +-- tab-dates -> POST /api/divers/integrite-dates
|   +-- tab-timestamp -> POST /api/divers/session-timestamp
|
+-- zooms.html (externe)
    +-- GET /api/zooms/*
```

---

## Validation Checklist

### Test de couverture ecran

Pour valider qu'un module est completement couvert:

1. [ ] Page HTML existe dans index.html (ou fichier separe)
2. [ ] Tous les boutons/liens naviguent correctement
3. [ ] Formulaires appellent les bons endpoints
4. [ ] Donnees s'affichent dans les tables
5. [ ] Messages d'erreur geres
6. [ ] Tests unitaires backend passent

### Commande de validation

```bash
# Lancer les tests
cd migration/caisse
dotnet test

# Verifier les endpoints
curl http://localhost:5287/api/sessions
curl http://localhost:5287/api/zooms/moyens-reglement
```

---

## Changelog

- 2025-12-30: Creation du document de couverture
- Mapping complet des 322 programmes ADH
- 27 modules documentes
- Navigation map cree

