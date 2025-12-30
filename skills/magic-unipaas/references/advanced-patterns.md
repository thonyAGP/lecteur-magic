# Patterns Avances Magic Unipaas

Ce document reference les patterns avances decouverts dans les projets de traitement batch (PBG).

---

## 1. References Speciales dans les Expressions

### 1.1 Reference PROG (Programme)

```
'{493,-1}'PROG     --> Programme 493 du composant local (-1)
'{492,-1}'PROG     --> Programme 492 du composant local
```

**Usage avec CallProg:**
```
CallProg('{493,-1}'PROG, param1, param2)
```

### 1.2 Reference DSOURCE (Source de Donnees/Table)

```
'{38,2}'DSOURCE    --> Table 38 du composant 2 (REF)
'{572,2}'DSOURCE   --> Table 572 du composant 2
```

**Usages:**
```
DbDel('{572,2}'DSOURCE, '')           --> Vide la table 572
DbName('{38,2}'DSOURCE)               --> Retourne le nom physique de la table
```

### 1.3 Reference VAR (Variable)

```
'{0,8}'VAR         --> Variable 8 du contexte courant
'{32768,138}'VAR   --> Variable 138 du Main Program
```

**Usage avec LocateAdd/RangeAdd:**
```
LocateAdd('{0,8}'VAR, {1,1})
RangeAdd('{0,19}'VAR, 'TRUE'LOG, 'TRUE'LOG)
```

### 1.4 Reference FORM (Formulaire)

```
'{0,3}'FORM        --> Formulaire lie a la variable 3
```

---

## 2. Fonctions Base de Donnees Avancees

### 2.1 DbDel - Suppression de Table

Supprime tous les enregistrements d'une table.

```
DbDel('{572,2}'DSOURCE, '')
DbDel('{573,2}'DSOURCE, '')
```

**Equivalent SQL:**
```sql
DELETE FROM table_572;
```

### 2.2 DbName - Nom Physique de Table

Retourne le nom physique de la table pour utilisation dynamique.

```
DbName('{38,2}'DSOURCE)   --> 'cafil026_dat' (exemple)
```

### 2.3 CallProg - Appel de Programme Dynamique

Appelle un programme par reference avec parametres.

```
CallProg('{493,-1}'PROG, DbName('{38,2}'DSOURCE))
CallProg(ProgIdx('hasRight', 'TRUE'LOG), {0,20}, 'SUPERVISOR')
```

### 2.4 ProgIdx - Index de Programme par Nom

Retourne l'index d'un programme par son nom public.

```
ProgIdx('hasRight', 'TRUE'LOG)   --> Index du programme 'hasRight'
```

---

## 3. Fonctions de Filtrage Dynamique

### 3.1 RangeAdd - Ajout de Critere Range

Ajoute dynamiquement un critere de filtrage Range.

```
RangeAdd('{0,19}'VAR, 'TRUE'LOG, 'TRUE'LOG)   --> Range variable 19 = TRUE
RangeAdd('{0,43}'VAR, 'FALSE'LOG, 'FALSE'LOG) --> Range variable 43 = FALSE
```

**Parametres:**
- Variable cible (reference VAR)
- Valeur minimum
- Valeur maximum

### 3.2 LocateAdd - Ajout de Critere Locate

Ajoute dynamiquement un critere de positionnement Locate.

```
LocateAdd('{0,8}'VAR, {1,1})   --> Locate variable 8 sur valeur de {1,1}
LocateAdd('{0,7}'VAR, {1,1})   --> Locate variable 7 sur valeur de {1,1}
```

---

## 4. Fonctions Interface Utilisateur

### 4.1 SetCrsr - Changement de Curseur

Change l'apparence du curseur souris.

```
SetCrsr(1)   --> Curseur normal (fleche)
SetCrsr(2)   --> Curseur attente (sablier)
```

**Pattern typique:**
```
// Debut traitement long
SetCrsr(2)
// ... traitement ...
// Fin traitement
SetCrsr(1)
```

### 4.2 Delay - Pause d'Execution

Met en pause l'execution pour un nombre de secondes.

```
Delay(30)   --> Pause de 30 secondes
```

---

## 5. Export de Donnees

### 5.1 DataViewToText - Export Vue vers CSV

Exporte directement la vue courante vers un fichier texte/CSV.

```
DataViewToText(
  0,                                    // Index vue (0 = courante)
  'NOM,PRENOM,DATE_DEBUT,DATE_FIN',     // Colonnes sources
  'nom,prénom,date début,date fin',     // Entetes
  '%club_exportdata%extrat.csv',        // Chemin fichier
  ';',                                  // Separateur
  '"',                                  // Caractere quote
  0                                     // Options
)
```

**Avantages:**
- Export direct sans boucle manuelle
- Entetes personnalisables
- Separateur configurable

---

## 6. Transactions

### 6.1 TaskProperties Transaction

```xml
<TaskProperties>
  <TransactionMode val="P"/>      <!-- P = Physical -->
  <TransactionBegin val="N"/>     <!-- N = None, L = onLock, T = Task -->
</TaskProperties>
```

**Valeurs TransactionMode:**
| Valeur | Description |
|--------|-------------|
| `P` | Physical - Transaction physique |
| `W` | Write - Transaction ecriture |
| `N` | None - Pas de transaction |

**Valeurs TransactionBegin:**
| Valeur | Description |
|--------|-------------|
| `N` | None - Pas de debut auto |
| `L` | onLock - Au premier verrouillage |
| `T` | Task - Au debut de la tache |

---

## 7. Parametres Globaux (GetParam/SetParam)

### 7.1 Parametres Standards Decouverts

| Parametre | Description | Exemple |
|-----------|-------------|---------|
| `SOCIETE` | Code societe | `GetParam('SOCIETE')` |
| `NRO_CPTE` | Numero de compte | `GetParam('NRO_CPTE')` |
| `FIL_CPTE` | Filiation compte | `GetParam('FIL_CPTE')` |
| `LANGUE` | Code langue | `GetParam('LANGUE')` |

### 7.2 Pattern d'Utilisation

```
// Lecture
variable = GetParam('SOCIETE')

// Ecriture
SetParam('SOCIETE', 'A')
```

---

## 8. Expressions Complexes Decouvertes

### 8.1 NOT() - Negation

```
NOT({32768,138})   --> Negation de variable 138 du Main Program
```

### 8.2 Pattern Securite/Droits

```
CallProg(ProgIdx('hasRight','TRUE'LOG), {0,20}, 'SUPERVISOR')
CallProg(ProgIdx('hasRight','TRUE'LOG), {0,20}, 'ACCESALL')
```

Appelle un programme de verification de droits avec un role.

### 8.3 ExpAttribute - Type de Retour

| Attribut | Type |
|----------|------|
| `A` | Alpha |
| `B` | Boolean |
| `N` | Numeric |
| `D` | Date |
| `T` | Time |
| `*` | Any/Void |
| `U` | Unicode |

---

## 9. Permissions de Tache (SIDE_WIN)

```xml
<SIDE_WIN>
  <AllowOptions val="N"/>
  <AllowQuery val="Y"/>
  <AllowModify val="Y"/>
  <AllowCreate val="N"/>
  <AllowDelete val="N"/>
  <AllowLocate val="N"/>
  <AllowRange val="N"/>
  <AllowIndexChange val="N"/>
  <AllowSorting val="N"/>
  <AllowIOFiles val="N"/>
  <RecordCycle val="N"/>
  <AllowEvents val="N"/>
</SIDE_WIN>
```

---

## 10. Conversion TypeScript

### 10.1 DbDel

```typescript
// DbDel('{572,2}'DSOURCE, '')
await db.query('DELETE FROM table_572');
```

### 10.2 CallProg avec DbName

```typescript
// CallProg('{493,-1}'PROG, DbName('{38,2}'DSOURCE))
const tableName = getTableName(38, 2);  // 'cafil026_dat'
await callProgram(493, tableName);
```

### 10.3 RangeAdd / LocateAdd

```typescript
// Pattern de filtrage dynamique
const queryBuilder = new QueryBuilder();
queryBuilder.addRange('column19', true, true);
queryBuilder.addLocate('column8', parentVar1);
const results = await queryBuilder.execute();
```

### 10.4 DataViewToText

```typescript
// DataViewToText vers CSV
import { stringify } from 'csv-stringify/sync';

const headers = ['nom', 'prénom', 'date début', 'date fin'];
const columns = ['NOM', 'PRENOM', 'DATE_DEBUT', 'DATE_FIN'];

const data = records.map(r => columns.map(c => r[c]));
const csv = stringify([headers, ...data], { delimiter: ';' });

await fs.writeFile(exportPath, csv);
```

---

## 11. Fonctions Fichiers et BLOB

### 11.1 File2Blb - Fichier vers BLOB

Charge un fichier en memoire sous forme de BLOB.

```
File2Blb(Trim({0,65}))                    --> Charge fichier dans BLOB
File2Blb(Trim({1,74}))                    --> Charge PDF en BLOB
```

### 11.2 Blb2File - BLOB vers Fichier

Sauvegarde un BLOB dans un fichier.

```
Blb2File({0,6}, {0,3})                    --> Sauve BLOB var6 dans chemin var3
Blb2File(IF({0,83},{0,48},{0,47}), Trim({0,84}))  --> Conditionnel
```

### 11.3 Translate - Resolution Noms Logiques

Resout les noms logiques (variables d'environnement Magic).

```
Translate('%TempDir%')                    --> 'C:\Temp\'
Translate('%club_images%')                --> Chemin images
Translate('%club_exportdata%')            --> Chemin exports
Translate('%club_mobility%')              --> 'Y' ou 'N'
Translate('%club_excel_separator%')       --> ';' ou ','
```

**Construction de chemins:**
```
Translate('%TempDir%') & 'ticket_' & Str({1,2},'9P0') & '.pdf'
--> 'C:\Temp\ticket_00000001.pdf'
```

---

## 12. Fonctions Systeme

### 12.1 RunMode - Mode d'Execution

```
RunMode() <= 2    --> Test si mode Online (pas batch)
```

| Valeur | Mode |
|--------|------|
| 1 | Online |
| 2 | Rich Client |
| 3+ | Batch |

### 12.2 IsComponent - Test Composant

```
IsComponent()         --> TRUE si execute comme composant
NOT IsComponent()     --> TRUE si execute standalone
```

### 12.3 FileExist - Test Existence Fichier

```
FileExist('c:\temp')                      --> TRUE si existe
NOT FileExist(Translate('%club_exportdata%') & 'PDF\')
```

---

## 13. Gestion des Droits

### 13.1 Pattern hasRight

Appel d'un programme de verification de droits.

```
CallProg(ProgIdx('hasRight','TRUE'LOG), {0,1}, 'PVADMIN')
CallProg(ProgIdx('hasRight','TRUE'LOG), {0,1}, 'PAYMENT')
CallProg(ProgIdx('hasRight','TRUE'LOG), {0,1}, 'PVMANAGE')
CallProg(ProgIdx('hasRight','TRUE'LOG), {0,1}, 'PVUSE')
CallProg(ProgIdx('hasRight','TRUE'LOG), {0,1}, 'ACCESALL')
CallProg(ProgIdx('hasRight','TRUE'LOG), {0,1}, 'SUPERVISOR')
```

### 13.2 Roles Decouverts

| Role | Description |
|------|-------------|
| `PVADMIN` | Admin Point de Vente |
| `PAYMENT` | Droits paiement |
| `PVMANAGE` | Gestion PV |
| `PVUSE` | Utilisation PV |
| `ACCESALL` | Acces complet |
| `SUPERVISOR` | Superviseur |
| `INPUTHD` | Saisie HD |

---

## 14. Composants par Projet

| comp | Nom | Description |
|------|-----|-------------|
| `-1` | Local | Composant local du projet |
| `2` | Ref_Tables | Tables partagees (dans PBP, PBG) |
| `3` | Ref_Tables | Tables partagees (dans PVE) |

**Note:** Le numero du composant REF peut varier selon le projet.

---

## 15. Projets Analyses

| Projet | Programmes | Specialite |
|--------|------------|------------|
| PBP | ~430 | Editions, exports, etats |
| PBG | ~393 | Traitements batch, imports |
| PVE | ~448 | Point de Vente (caisse) |
| REF | - | Tables partagees |
