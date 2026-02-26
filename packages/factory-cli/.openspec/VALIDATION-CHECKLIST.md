# Checklist Validation - Avant Chaque Test

> **OBLIGATOIRE** : Vérifier que le serveur tourne avec le dernier code
> **Objectif** : Éviter de tester avec du code obsolète

---

## ✅ Étape 1 : Vérifier Version Serveur

**Commande** :
```bash
curl http://localhost:3070/api/version
```

**Attendu** :
```json
{
  "version": "1.0.0-qa-phase2-3",
  "buildTimestamp": "2026-02-26T...",  // ← DOIT être récent (< 1h)
  "commit": "xxxxxxx",                  // ← DOIT matcher dernier commit
  "serverStartTime": "2026-02-26T...",  // ← DOIT être récent
  "phase": "QA Phase 2+3 Complete"
}
```

**Vérifications** :
- [ ] `buildTimestamp` date de moins d'1h
- [ ] `commit` = dernier commit git (`git log -1 --format=%h`)
- [ ] `serverStartTime` date de moins de 30min

**Si NON** : Rebuild + Restart serveur

---

## ✅ Étape 2 : Vérifier Dernier Commit

**Commande** :
```bash
cd D:\Projects\ClubMed\LecteurMagic\packages\factory-cli
git log -1 --format="%h - %s - %ar"
```

**Attendu** :
```
b2ad6ea2 - feat(...): ... - X minutes ago
```

**Vérifications** :
- [ ] Commit hash matche `/api/version`
- [ ] Date récente (pas "2 days ago")

---

## ✅ Étape 3 : Rebuild Si Nécessaire

**Si version obsolète détectée** :

```bash
cd D:\Projects\ClubMed\LecteurMagic\packages\factory-cli

# Kill serveur
powershell -Command "Get-NetTCPConnection -LocalPort 3070 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id \$_.OwningProcess -Force }"

# Rebuild
pnpm build

# Restart
npx tsx src/cli.ts serve --port 3070 --project ../../
```

---

## ✅ Étape 4 : Valider Tests

**Commande** :
```bash
pnpm test
```

**Attendu** :
- [ ] 980+ tests passent
- [ ] Aucune régression
- [ ] Build récent

---

## 🎯 Utilisation

**Avant chaque validation** :
1. Exécuter Étape 1 (vérifier version)
2. Si obsolète → Étape 3 (rebuild + restart)
3. Puis continuer tests

**Après chaque commit** :
1. Rebuild (`pnpm build`)
2. Restart serveur
3. Vérifier `/api/version` matche nouveau commit

---

**Généré le** : 2026-02-26
