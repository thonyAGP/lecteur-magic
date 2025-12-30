# Guide Complet des Exports Magic Unipaas

## Metadata
- **Date**: 2025-12-24
- **Source**: Analyse 135 fichiers PBP avec IO operations
- **Statut**: COMPLET

---

## 1. Structure IO

### 1.1 Definition de base

```xml
<IO id="1">
  <Description val="Export - tempo_mecan"/>
  <IOExpression val="1"/>       <!-- Ref Expression nom fichier -->
  <OpenPrintDialog val="N"/>    <!-- Dialogue impression -->
  <PaperSize val="68"/>         <!-- Taille papier (68=A4) -->
  <Format val="L"/>             <!-- L=List, P=Page -->
  <Media val="T"/>              <!-- Type de sortie -->
  <Access val="W"/>             <!-- W=Write, R=Read -->
  <Copies val="1"/>             <!-- Nombre copies -->
  <Orientation val="P"/>        <!-- P=Portrait, L=Landscape -->
  <PrintPreview val="N"/>       <!-- Apercu avant impression -->
  <PDF val="N"/>                <!-- Generation PDF -->
  <Vis2LogTranslation val="N"/> <!-- Translation visuelle/logique -->
  <FlipLines val="N"/>          <!-- Inversion lignes (RTL) -->
</IO>
```

### 1.2 Attributs supplementaires impression

```xml
<IO id="1">
  <MACH val="Imprimante Default"/>  <!-- Nom imprimante -->
  <PageFooterForm val="7"/>         <!-- Form pied de page -->
  <PrintPreview Exp="46"/>          <!-- Expression pour preview -->
</IO>
```

---

## 2. Types de Media

| Media | Nom | Description | Utilisation |
|-------|-----|-------------|-------------|
| **T** | Text | Fichier texte | Export CSV, TXT, fichiers plats |
| **G** | Graphic | Imprimante GUI | Impression graphique standard |
| **S** | Screen | Ecran | Apercu sans fichier |
| **R** | Requester | Report | Rapports structures |
| **N** | Null | Aucun | Traitement silencieux |
| **V** | Variable | Variable | Sortie vers variable memoire |

### 2.1 Media="T" - Export Texte

Caracteristiques:
- Cree un fichier physique sur disque
- `IOExpression` = chemin du fichier
- Utilise un `FORM_TEXT` pour le layout
- Position des champs par coordonnees X

```xml
<IO id="1">
  <IOExpression val="1"/>  <!-- Expression: 'C:\path\file.txt' -->
  <Format val="L"/>        <!-- List = ligne par ligne -->
  <Media val="T"/>         <!-- Text file -->
  <Access val="W"/>        <!-- Write -->
</IO>
```

Expression associee:
```xml
<Expression id="1">
  <ExpSyntax val="'C:\Migration\XPA\PMS\PBP\DSIOPtmp_mec01_dat.TXT'"/>
  <ExpAttribute val="A"/>  <!-- A = Alpha -->
</Expression>
```

### 2.2 Media="G" - Impression Graphique

Caracteristiques:
- Sortie vers imprimante physique
- Supporte en-tetes et pieds de page
- Peut avoir apercu avant impression

```xml
<IO id="1">
  <Description val="imprimante"/>
  <Format val="P"/>                 <!-- Page format -->
  <Media val="G"/>                  <!-- Graphic -->
  <MACH val="Imprimante Default"/>  <!-- Imprimante cible -->
  <PageFooterForm val="7"/>         <!-- Pied de page -->
  <PrintPreview Exp="46"/>          <!-- Condition apercu -->
</IO>
```

### 2.3 Media="S" - Ecran/Apercu

Caracteristiques:
- Affichage a l'ecran uniquement
- Pas de fichier cree
- Preview mode

```xml
<IO id="1">
  <Media val="S"/>  <!-- Screen -->
  <Format val="L"/>
</IO>
```

### 2.4 Media="R" - Requester/Report

Caracteristiques:
- Generation de rapports structures
- Peut avoir parametres d'entree

```xml
<IO id="1">
  <Description val="Requester"/>
  <IOExpression val="3"/>
  <Media val="R"/>
</IO>
```

---

## 3. Types de Format

| Format | Nom | Description |
|--------|-----|-------------|
| **L** | List | Sortie ligne par ligne, sans gestion de page |
| **P** | Page | Format pagine avec en-tetes/pieds de page |

---

## 4. Operation FormIO

L'ecriture effective se fait via l'operation `FormIO` dans la logique:

```xml
<FormIO FlowIsn="28">
  <OperationType val="O"/>       <!-- O=Output, I=Input -->
  <Page val="A"/>                <!-- A=Auto, N=New page -->
  <IODeviceInfo>
    <IoDeviceIndex val="1"/>     <!-- Ref vers IO id="1" -->
  </IODeviceInfo>
  <FormEntryInfo>
    <FormEntryIndex val="2"/>    <!-- Ref vers FormEntry id="2" -->
  </FormEntryInfo>
  <Condition val="Y"/>           <!-- Condition d'execution -->
</FormIO>
```

### 4.1 OperationType

| Type | Signification |
|------|---------------|
| O | Output - ecriture |
| I | Input - lecture |
| C | Close - fermeture fichier |

### 4.2 Page

| Valeur | Signification |
|--------|---------------|
| A | Auto - gestion automatique |
| N | New - nouvelle page |
| Y | Yes - saut de page |

---

## 5. Forms pour Export

### 5.1 FORM_GUI0 vs FORM_TEXT

Magic utilise deux types de forms:

| Type | Model | Usage |
|------|-------|-------|
| GUI Form | FORM_GUI0 | Affichage ecran, table |
| Text Form | FORM_TEXT | Export fichier texte |

### 5.2 Structure FORM_TEXT

```xml
<FormEntry CLSS="1" id="2">
  <PropertyList model="FORM_TEXT">
    <Width id="23" val="177"/>   <!-- Largeur totale ligne -->
    <Height id="24" val="1"/>    <!-- 1 ligne par record -->
    <FormName id="311" valUnicode="Export - file"/>
  </PropertyList>

  <!-- Controles positionnes par X -->
  <Control id="2">
    <PropertyList model="CTRL_TEXT_EDIT">
      <X id="21" val="0"/>       <!-- Position debut -->
      <Width id="23" val="10"/>  <!-- Largeur champ -->
      <Height id="24" val="1"/>
      <Data FieldID="1" id="43"/>
    </PropertyList>
  </Control>

  <Control id="3">
    <PropertyList model="CTRL_TEXT_EDIT">
      <X id="21" val="11"/>      <!-- Position suivante -->
      <Width id="23" val="15"/>
      <Data FieldID="2" id="43"/>
    </PropertyList>
  </Control>
</FormEntry>
```

### 5.3 Calcul largeur ligne

La largeur totale = somme des (X + Width) de tous les controles.
Le fichier resultant a des colonnes a largeur fixe.

---

## 6. Flux d'execution Export

```
1. Task Prefix
   - Initialisation variables

2. Record Main (pour chaque enregistrement)
   - Select des colonnes de la table
   - Calculs et transformations

3. Record Suffix
   - FormIO Operation="O" -> Ecriture ligne

4. Task Suffix
   - Fermeture fichier (implicite)
```

---

## 7. Conversion TypeScript

### 7.1 Export Text (Media="T")

```typescript
import * as fs from 'fs';

interface MecanoRecord {
  user: string;
  nom: string;
  prenom: string;
  // ... autres champs
}

function exportMecano(records: MecanoRecord[], outputPath: string): void {
  const lines: string[] = [];

  for (const record of records) {
    // Format largeur fixe selon FORM_TEXT
    const line = [
      record.user.padEnd(10),
      record.nom.padEnd(15),
      record.prenom.padEnd(8),
      // ... autres champs
    ].join('');

    lines.push(line);
  }

  fs.writeFileSync(outputPath, lines.join('\n'), 'utf8');
}
```

### 7.2 Export CSV (avec delimiteur)

```typescript
function exportCsv(
  records: any[],
  outputPath: string,
  delimiter: string = ';'
): void {
  const lines: string[] = [];

  for (const record of records) {
    const line = Object.values(record).join(delimiter);
    lines.push(line);
  }

  fs.writeFileSync(outputPath, lines.join('\n'), 'utf8');
}
```

### 7.3 Impression (Media="G")

```typescript
// Pour impression, generer un PDF ou HTML
import { jsPDF } from 'jspdf';

function printReport(records: any[], title: string): void {
  const doc = new jsPDF();

  // En-tete
  doc.setFontSize(16);
  doc.text(title, 20, 20);

  // Corps
  let y = 40;
  for (const record of records) {
    doc.setFontSize(10);
    doc.text(`${record.nom} ${record.prenom}`, 20, y);
    y += 10;

    // Nouvelle page si necessaire
    if (y > 280) {
      doc.addPage();
      y = 20;
    }
  }

  doc.save('report.pdf');
}
```

---

## 8. Exemples de fichiers

### 8.1 Export texte largeur fixe

| Programme | Description | Media | Format |
|-----------|-------------|-------|--------|
| Prg_994 | Export MECANO | T | L |
| Prg_995 | Export MECANO | T | L |
| Prg_937 | Export | T | L |

### 8.2 Impression graphique

| Programme | Description | Media | Format |
|-----------|-------------|-------|--------|
| Prg_77 | Imprim GM depart | G | P |
| Prg_86 | Edition | G | L |

### 8.3 Ecran/Preview

| Programme | Description | Media | Format |
|-----------|-------------|-------|--------|
| Prg_323 | Export Pax | S | L |
| Prg_324 | Export | S | L |

---

## 9. Attributs complementaires

### 9.1 PaperSize codes

| Code | Taille |
|------|--------|
| 68 | A4 |
| 1 | Letter |
| 5 | Legal |

### 9.2 Orientation

| Code | Orientation |
|------|-------------|
| P | Portrait |
| L | Landscape |

### 9.3 Access

| Code | Mode |
|------|------|
| W | Write (ecriture) |
| R | Read (lecture) |
| A | Append (ajout) |

---

## 10. Bonnes pratiques conversion

1. **Identifier le type de Media** pour choisir la strategie de conversion
2. **Analyser le FORM_TEXT** pour determiner le format de sortie
3. **Mapper les positions X** vers des formats de string (padStart/padEnd)
4. **Gerer les expressions** pour les noms de fichiers dynamiques
5. **Respecter l'encodage** (UTF-8 vs ANSI selon le contexte)

---

*Document genere par Claude Code - 2025-12-24*
*Source: Analyse de 135 fichiers PBP avec operations IO*
