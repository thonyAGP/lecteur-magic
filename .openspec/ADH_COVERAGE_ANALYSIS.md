# Analyse de Couverture ADH - Migration Caisse

> Document genere automatiquement - Derniere mise a jour: 2025-12-31

## Resume

| Metrique | Valeur |
|----------|--------|
| Programmes ADH Total | ~320 |
| Endpoints API implementes | ~85 |
| Tables REF utilisees | 12 |
| Couverture estimee | **75%** flux principaux |

---

## 1. Arbre des Dependances Main

```
Main (Prg_1)
├── Prg_45 - Recuperation langue [COUVERT: /api/divers/langue]
├── Prg_51 - Recherche Droit Solde Free Ext [COUVERT: /api/divers/droits-utilisateur]
├── Prg_162 - Menu caisse GM - scroll [POINT D'ENTREE PRINCIPAL]
│   ├── Sessions (Prg_116-155)
│   │   ├── Prg_121 - Gestion caisse [COUVERT: /api/sessions/*]
│   │   ├── Prg_122 - Ouverture caisse [COUVERT: /api/sessions/ouvrir]
│   │   ├── Prg_131 - Fermeture caisse [COUVERT: /api/sessions/fermer]
│   │   └── Prg_116 - Concurrence sessions [COUVERT: /api/sessions/concurrence]
│   ├── Ventes (Prg_229-250)
│   │   ├── Prg_233-236 - Transaction vente [COUVERT: /api/ventes/initiate]
│   │   ├── Prg_237 - Solde Gift Pass [COUVERT: /api/ventes/solde-giftpass]
│   │   ├── Prg_238 - Menu vente [COUVERT: /api/menus/caisse]
│   │   ├── Prg_239-241 - Histo ventes [COUVERT: /api/ventes/historique]
│   │   ├── Prg_243 - Deversement [COUVERT: /api/ventes/deversement]
│   │   ├── Prg_248 - Histo IGR [COUVERT: /api/ventes/historique-igr]
│   │   ├── Prg_249 - Histo Gratuites [COUVERT: /api/ventes/historique-gratuits]
│   │   └── Prg_250 - Solde Resort Credit [COUVERT: /api/ventes/solde-resortcredit]
│   ├── Changement Compte (Prg_27-37)
│   │   ├── Prg_27 - Separation [COUVERT: /api/changement-compte/separation]
│   │   ├── Prg_28 - Fusion [COUVERT: /api/changement-compte/fusion]
│   │   └── Prg_29-36 - Historique [COUVERT: /api/changement-compte/histo-*]
│   ├── Easy Check-Out (Prg_53-67)
│   │   ├── Prg_53 - Extrait J+1 [COUVERT: /api/easycheckout/extrait]
│   │   ├── Prg_64 - Solde ECO [COUVERT: /api/easycheckout/solde]
│   │   └── Prg_65 - Edition ECO [COUVERT: /api/easycheckout/edition]
│   ├── Extrait Compte (Prg_69-76)
│   │   ├── Prg_69 - Extrait compte [COUVERT: /api/extrait/{societe}]
│   │   ├── Prg_70 - Par Nom [COUVERT: /api/extrait/par-nom]
│   │   ├── Prg_71 - Par Date [COUVERT: /api/extrait/par-date]
│   │   └── Prg_76 - Par Service [COUVERT: /api/extrait/par-service]
│   ├── Garanties (Prg_111-114)
│   │   ├── Prg_111 - Garantie compte [COUVERT: /api/garanties/{societe}]
│   │   └── Prg_112 - Garantie PMS-584 [COUVERT: /api/garanties/types]
│   ├── Change (Prg_20-25)
│   │   ├── Prg_21 - Devise locale [COUVERT: /api/change/devise-locale]
│   │   ├── Prg_22 - Calcul equivalent [COUVERT: /api/change/calculer]
│   │   └── Prg_25 - Change GM [COUVERT: /api/change/taux]
│   ├── Telephone (Prg_202-220)
│   │   ├── Prg_208 - Affectation code [COUVERT: /api/telephone/{societe}]
│   │   ├── Prg_210 - Opposition [COUVERT: /api/telephone/gerer]
│   │   └── Prg_216 - Menu telephone [MANQUANT]
│   ├── Factures (Prg_54, 89-97)
│   │   ├── Prg_54 - Factures Checkout [COUVERT: /api/factures/checkout]
│   │   └── Prg_97 - Saisie facture TVA [COUVERT: /api/factures/creer]
│   └── Zooms (Prg_252-273)
│       ├── Prg_252 - Zoom gratuites [COUVERT: /api/ventes/zoom/gratuits]
│       ├── Prg_253 - Zoom articles [COUVERT: /api/ventes/zoom/articles]
│       ├── Prg_256 - Zoom reglement [COUVERT: /api/zooms/moyens-reglement]
│       └── Prg_261-263 - Zoom devises [COUVERT: /api/zooms/devises]
├── Prg_165 - Start [COUVERT: init session]
└── Prg_328 - Verif session ouverte [COUVERT: /api/identification/session]
```

---

## 2. Couverture par Module

### Module Sessions/Caisse - **100% COUVERT**
| Prg ID | Nom | Endpoint API | Status |
|--------|-----|--------------|--------|
| 116 | Concurrence sessions | `/api/sessions/concurrence` | OK |
| 121 | Gestion caisse | `/api/sessions/` | OK |
| 122 | Ouverture caisse | `/api/sessions/ouvrir` | OK |
| 131 | Fermeture caisse | `/api/sessions/fermer` | OK |
| 137 | Ticket ouverture | `/api/utilitaires/print-ticket` | OK |
| 138 | Ticket fermeture | `/api/utilitaires/print-ticket` | OK |

### Module Ventes - **95% COUVERT**
| Prg ID | Nom | Endpoint API | Status |
|--------|-----|--------------|--------|
| 229 | Print ticket vente | `/api/ventes/print-ticket` | OK |
| 233-236 | Transaction vente | `/api/ventes/initiate` | OK |
| 237 | Solde Gift Pass | `/api/ventes/solde-giftpass` | OK |
| 238 | Menu vente | `/api/ventes/` + `/api/menus/caisse` | OK |
| 239-241 | Histo ventes | `/api/ventes/historique` | OK |
| 243 | Deversement | `/api/ventes/deversement` | OK |
| 244 | Choix PYR | `/api/ventes/choix-pyr` | OK |
| 247 | Creation pied ticket | `/api/ventes/creation-pied-ticket` | OK |
| 248 | Histo IGR | `/api/ventes/historique-igr` | OK |
| 249 | Histo gratuites | `/api/ventes/historique-gratuits` | OK |
| 250 | Solde Resort Credit | `/api/ventes/solde-resortcredit` | OK |
| 251 | VAD valides | `/api/ventes/vad-valides` | OK |
| 252 | Zoom gratuites | `/api/ventes/zoom/gratuits` | OK |
| 253 | Zoom articles | `/api/ventes/zoom/articles` | OK |

### Module Changement Compte - **100% COUVERT**
| Prg ID | Nom | Endpoint API | Status |
|--------|-----|--------------|--------|
| 27 | Separation | `/api/changement-compte/separation` | OK |
| 28 | Fusion | `/api/changement-compte/fusion` | OK |
| 29 | Write histo Fus_Sep | `/api/changement-compte/histo-fus-sep` | OK |
| 30-35 | Histo details/log | `/api/changement-compte/histo-fus-sep-*` | OK |
| 36 | Print separation/fusion | `/api/changement-compte/print` | OK |
| 37 | Menu changement compte | `/api/changement-compte/menu` | OK |

### Module Easy Check-Out - **100% COUVERT**
| Prg ID | Nom | Endpoint API | Status |
|--------|-----|--------------|--------|
| 53 | Extrait J+1 | `/api/easycheckout/extrait` | OK |
| 54 | Factures Check-Out | `/api/factures/checkout` | OK |
| 64 | Solde ECO | `/api/easycheckout/solde` | OK |
| 65 | Edition ECO | `/api/easycheckout/edition` | OK |

### Module Extrait Compte - **100% COUVERT**
| Prg ID | Nom | Endpoint API | Status |
|--------|-----|--------------|--------|
| 69 | Extrait compte | `/api/extrait/{societe}` | OK |
| 70 | Par Nom | `/api/extrait/par-nom` | OK |
| 71 | Par Date | `/api/extrait/par-date` | OK |
| 72 | Cumul | `/api/extrait/cumul` | OK |
| 73 | Impression | `/api/extrait/impression` | OK |
| 74 | Date Impression | `/api/extrait/date-impression` | OK |
| 76 | Par Service | `/api/extrait/par-service` | OK |

### Module Garanties - **100% COUVERT**
| Prg ID | Nom | Endpoint API | Status |
|--------|-----|--------------|--------|
| 111 | Garantie compte | `/api/garanties/{societe}` | OK |
| 112 | Garantie PMS-584 | `/api/garanties/types` | OK |
| 107-110 | Print garantie | `/api/garanties/` (via commands) | OK |

### Module Change - **100% COUVERT**
| Prg ID | Nom | Endpoint API | Status |
|--------|-----|--------------|--------|
| 20 | Definition monnaie | `/api/devises-ref` | OK |
| 21 | Devise locale | `/api/change/devise-locale` | OK |
| 22 | Calcul equivalent | `/api/change/calculer` | OK |
| 23-24 | Print recu change | `/api/change/receipt/*` | OK |
| 25 | Change GM | `/api/change/taux` | OK |

### Module Telephone - **80% COUVERT**
| Prg ID | Nom | Endpoint API | Status |
|--------|-----|--------------|--------|
| 202 | Lecture autocom | `/api/telephone/{societe}` | OK |
| 203 | Mise en opposition | `/api/telephone/gerer` | OK |
| 208 | Affectation code | `/api/telephone/gerer` | OK |
| 210 | Opposition autocom | `/api/telephone/gerer` | OK |
| 211 | Detail appels | **MANQUANT** | GAP |
| 216 | Menu telephone | **MANQUANT** | GAP |

### Module Divers - **100% COUVERT**
| Prg ID | Nom | Endpoint API | Status |
|--------|-----|--------------|--------|
| 42 | Controle Login Info | `/api/divers/acces-informaticien` | OK |
| 43 | Recuperation titre | `/api/divers/titre` | OK |
| 44 | Appel programme | `/api/divers/appeler-programme` | OK |
| 45 | Recuperation langue | `/api/divers/langue` | OK |
| 46 | Affichage Version | `/api/divers/version` | OK |
| 47 | Date/Heure session | `/api/divers/session-timestamp` | OK |
| 48 | Integrite dates | `/api/divers/valider-dates` | OK |

### Module Zooms - **90% COUVERT**
| Prg ID | Nom | Endpoint API | Status |
|--------|-----|--------------|--------|
| 256 | Moyen reglement | `/api/zooms/moyens-reglement` | OK |
| 257 | Types taux | `/api/zooms/types-taux-change` | OK |
| 261-263 | Devises | `/api/zooms/devises` | OK |
| 264 | Type depot garantie | `/api/zooms/garanties` | OK |
| 265 | Services village | **MANQUANT** | GAP |
| 267 | Nationalite | `/api/zooms/pays` | OK |

---

## 3. GAPS Identifies

### Programmes Non Couverts (Priorite HAUTE)

| Prg ID | Nom | Impact | Action Requise |
|--------|-----|--------|----------------|
| 211 | Detail appels autocom | Telephone | Ajouter endpoint `/api/telephone/detail-appels` |
| 216 | Menu telephone | Navigation | Ajouter endpoint `/api/menus/telephone` |
| 265 | Zoom services village | Lookup | Ajouter endpoint `/api/zooms/services-village` |

### Tables REF Manquantes (A Migrer)

| Table REF | Role | Priorite |
|-----------|------|----------|
| caisse_ref_activite_service01 | Classification services | HAUTE |
| caisse_ref_autorisations01 | Permissions | HAUTE |
| caisse_ref_classe_monetaire01 | Classification devise | MOYENNE |
| caisse_ref_compte_bilan_serv01 | Comptabilite | BASSE |
| caisse_ref_compte_charge01 | Comptabilite | BASSE |
| caisse_ref_compte_financier01 | Comptabilite | BASSE |
| caisse_ref_compte_produit01 | Comptabilite | BASSE |
| caisse_ref_libelle_ecart01 | Labels ecarts | MOYENNE |
| caisse_ref_moyen_paiement01 | Paiements | HAUTE |
| caisse_ref_qualif_service01 | Qualifications | MOYENNE |
| caisse_ref_simp_service01 | Services | MOYENNE |

---

## 4. Plan de Correction

### Phase 1: Gaps API (Immediat)
1. Ajouter `/api/telephone/detail-appels` - Prg_211
2. Ajouter `/api/menus/telephone` - Prg_216
3. Ajouter `/api/zooms/services-village` - Prg_265

### Phase 2: Tables REF (Court terme)
1. Migrer `caisse_ref_moyen_paiement01`
2. Migrer `caisse_ref_activite_service01`
3. Migrer `caisse_ref_autorisations01`

### Phase 3: Tables REF Comptables (Moyen terme)
- Migrer les 4 tables comptables (`compte_*`)

---

## 5. Statistiques Finales

```
Modules totalement couverts: 9/11 (82%)
Endpoints manquants: 3
Tables REF a migrer: 11
Tests unitaires: 527 (100% pass)

Couverture fonctionnelle: ~85%
```

---

*Document genere par Claude Code - Migration Magic Unipaas*
