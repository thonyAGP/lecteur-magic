# Guide Complet des Editions/Rapports Magic Unipaas

## Metadata
- **Date**: 2025-12-24
- **Source**: Analyse fichiers PBP avec Media="G" et groupes
- **Statut**: COMPLET

---

## 1. Vue d'ensemble

Les editions Magic sont des rapports imprimes avec:
- En-tetes et pieds de page
- Ruptures de groupe avec sous-totaux
- Numerotation de pages
- Compteurs

---

## 2. Structure IO pour Impression

### 2.1 Definition imprimante

```xml
<IO id="1">
  <Description val="imprimante"/>
  <OpenPrintDialog val="N"/>
  <PaperSize val="68"/>           <!-- 68=A4, 1=Letter -->
  <PageFooterForm val="7"/>       <!-- Form pour pied de page -->
  <Format val="P"/>               <!-- P=Page (pagine) -->
  <Media val="G"/>                <!-- G=Graphic/Printer -->
  <Access val="W"/>               <!-- W=Write -->
  <MACH val="Imprimante Default"/>  <!-- Nom imprimante -->
  <Copies val="1"/>
  <Orientation val="P"/>          <!-- P=Portrait, L=Landscape -->
  <PrintPreview Exp="46"/>        <!-- Expression pour preview -->
  <PDF val="N"/>                  <!-- Generation PDF -->
</IO>
```

### 2.2 Attributs specifiques aux impressions

| Attribut | Description |
|----------|-------------|
| **PageFooterForm** | Reference vers FormEntry du pied de page |
| **MACH** | Nom de l'imprimante (ou "Imprimante Default") |
| **PrintPreview** | Exp=N pour expression, val="N" pour non |
| **PageHeaderForm** | Reference vers FormEntry de l'en-tete (optionnel) |

---

## 3. Types de Media pour Rapports

| Media | Description | Utilisation |
|-------|-------------|-------------|
| **G** | Graphic/GUI | Impression graphique standard |
| **S** | Screen | Apercu ecran uniquement |
| **R** | Requester | Rapport structure |

---

## 4. Zones de Formulaire (Area)

Les formulaires de rapport utilisent l'attribut `Area` pour definir leur role:

```xml
<FormEntry CLSS="1" id="3">
  <PropertyList model="FORM_GUI1">
    <Area id="17" val="H"/>       <!-- Type de zone -->
    <Width id="23" val="2000"/>
    <Height id="24" val="630"/>
    <FormName id="311" valUnicode="Entete"/>
  </PropertyList>
</FormEntry>
```

### 4.1 Valeurs de Area

| Area | Nom | Description |
|------|-----|-------------|
| **H** | Header | En-tete de page (imprime en haut de chaque page) |
| **F** | Footer | Pied de page (imprime en bas de chaque page) |
| **N** | Normal | Corps/Detail du rapport (zone principale) |
| **G** | Group | En-tete/pied de groupe (ruptures) |
| **P** | Page | Zone speciale page |

### 4.2 Exemple structure complete

```
Page 1:
  [Header - Area="H"]  <- En-tete page
  [Group Header]       <- Rupture groupe (debut)
  [Normal - Area="N"]  <- Lignes de detail
  [Normal - Area="N"]
  [Normal - Area="N"]
  [Group Footer]       <- Rupture groupe (fin)
  [Footer - Area="F"]  <- Pied de page
```

---

## 5. Niveaux Logiques (LogicUnit Level)

### 5.1 Types de Level

| Level | Nom | Description |
|-------|-----|-------------|
| **T** | Task | Niveau tache (debut/fin du programme) |
| **R** | Record | Niveau enregistrement (chaque ligne) |
| **G** | Group | Niveau groupe (ruptures) |

### 5.2 Types de LogicUnit (Type)

| Type | Nom | Quand execute |
|------|-----|---------------|
| **P** | Prefix | AVANT (Task Prefix, Record Prefix, Group Prefix) |
| **M** | Main | PENDANT (Record Main) |
| **S** | Suffix | APRES (Task Suffix, Record Suffix, Group Suffix) |

### 5.3 Structure complete

```xml
<!-- Group Level - Prefix (avant le groupe) -->
<LogicUnit id="4" propagate="78">
  <Level val="G"/>
  <Type val="P"/>
  <FieldID val="33"/>    <!-- Champ de rupture -->
  <LogicLines>
    <LogicLine>
      <FormIO>           <!-- Imprime l'en-tete du groupe -->
        <FormEntryIndex val="6"/>
      </FormIO>
    </LogicLine>
  </LogicLines>
</LogicUnit>

<!-- Group Level - Suffix (apres le groupe) -->
<LogicUnit id="5">
  <Level val="G"/>
  <Type val="S"/>
  <FieldID val="33"/>    <!-- Meme champ de rupture -->
  <LogicLines>
    <LogicLine>
      <FormIO>           <!-- Imprime le pied du groupe (sous-totaux) -->
        <FormEntryIndex val="7"/>
      </FormIO>
    </LogicLine>
  </LogicLines>
</LogicUnit>
```

---

## 6. Fonctions de Rapport

### 6.1 Page()

Retourne le numero de page courant.

```
Page(device, type)
- device: 0 = imprimante par defaut
- type: 1 = numero de page courant
```

Exemple:
```xml
<ExpSyntax val="'- '&amp;Str (Page (0,1),'3P0Z0')&amp;' -'"/>
<!-- Resultat: "- 001 -" -->
```

### 6.2 Counter()

Compteur incrementant automatiquement.

```
Counter(level)
- level: 0 = global, 1 = groupe 1, 2 = groupe 2...
```

Exemples:
```xml
<!-- Compteur global -->
<ExpSyntax val="Counter (0)"/>

<!-- Compteur de groupe -->
<ExpSyntax val="Counter (1)"/>

<!-- Utilisation avec modulo pour colonnes -->
<ExpSyntax val="Counter (0) MOD 5=1"/>
```

### 6.3 Str()

Convertit un nombre en chaine formatee.

```
Str(value, format)
- value: nombre
- format: masque ('3P0Z0' = 3 chiffres, zero-fill)
```

### 6.4 Fix()

Arrondit un nombre.

```
Fix(value, decimals, mode)
- value: nombre
- decimals: nombre de decimales
- mode: 0 = tronquer, 1 = arrondir
```

---

## 7. Modeles de Formulaires (Forms)

### 7.1 FORM_GUI0 vs FORM_GUI1

| Model | Usage | Particularites |
|-------|-------|----------------|
| **FORM_GUI0** | Ecran interactif | Standard pour saisie |
| **FORM_GUI1** | Rapport imprime | Avec zones (Area), mesures precises |

### 7.2 Controles pour rapports

| Control | Model | Description |
|---------|-------|-------------|
| CTRL_GUI1_EDIT | Edition | Champ de donnees |
| CTRL_GUI1_STATIC | Statique | Texte fixe, libelle |
| CTRL_GUI1_LINE | Ligne | Trait horizontal/vertical |
| CTRL_GUI1_IMAGE | Image | Logo, graphique |

### 7.3 Exemple en-tete de page

```xml
<FormEntry CLSS="1" id="3">
  <PropertyList model="FORM_GUI1">
    <Area id="17" val="H"/>
    <Width id="23" val="2000"/>
    <Height id="24" val="630"/>
    <FormName id="311" valUnicode="Entete"/>
  </PropertyList>

  <!-- Titre du rapport -->
  <Control id="1">
    <PropertyList model="CTRL_GUI1_EDIT">
      <X id="21" val="10"/>
      <Y id="22" val="30"/>
      <Width id="23" val="857"/>
      <Height id="24" val="42"/>
      <Data Exp="14" id="43"/>       <!-- Expression pour titre -->
      <Font id="50" val="33"/>
      <Color id="51" val="6"/>
    </PropertyList>
  </Control>

  <!-- Logo -->
  <Control id="3">
    <PropertyList model="CTRL_GUI1_IMAGE">
      <DefaultImageFile id="88" val="%club_images%clubmed.bmp"/>
      <ImageStyle id="89" val="3"/>
    </PropertyList>
  </Control>
</FormEntry>
```

### 7.4 Exemple pied de page

```xml
<FormEntry CLSS="1" id="7">
  <PropertyList model="FORM_GUI1">
    <Area id="17" val="F"/>
    <FormName id="311" valUnicode="Pied page"/>
  </PropertyList>

  <!-- Ligne de separation -->
  <Control id="1">
    <PropertyList model="CTRL_GUI1_LINE">
      <X1 id="21" val="4"/>
      <X2 id="23" val="1977"/>
    </PropertyList>
  </Control>

  <!-- Numero de page -->
  <Control id="2">
    <PropertyList model="CTRL_GUI1_EDIT">
      <X id="21" val="870"/>
      <Data Exp="45" id="43"/>       <!-- Page(0,1) -->
      <HorizontalAlignment id="65" val="2"/>  <!-- Centre -->
    </PropertyList>
  </Control>
</FormEntry>
```

---

## 8. Flux d'execution d'un Rapport

```
1. Task Prefix
   - Initialisation variables globales
   - Ouverture fichier/imprimante

2. Group 1 Prefix (si rupture)
   - Impression en-tete groupe 1

3. Group 2 Prefix (si rupture imbriquee)
   - Impression en-tete groupe 2

4. Record Main (pour chaque enregistrement)
   - Lecture donnees
   - Calculs

5. Record Suffix
   - Impression ligne de detail
   - Accumulation compteurs

6. Group 2 Suffix (si changement groupe 2)
   - Impression sous-total groupe 2
   - RAZ compteur groupe 2

7. Group 1 Suffix (si changement groupe 1)
   - Impression sous-total groupe 1
   - RAZ compteur groupe 1

8. Task Suffix
   - Impression totaux generaux
   - Fermeture fichier/imprimante
```

---

## 9. Conversion TypeScript

### 9.1 Structure de base

```typescript
interface ReportConfig {
  title: string;
  orientation: 'portrait' | 'landscape';
  pageSize: 'A4' | 'Letter';
  margins: { top: number; right: number; bottom: number; left: number };
}

interface GroupBreak {
  field: string;
  headerForm?: string;
  footerForm?: string;
  counter: number;
}

class MagicReport {
  private page = 1;
  private counters: Map<number, number> = new Map();
  private groups: GroupBreak[] = [];

  constructor(private config: ReportConfig) {}

  // Equivalent Counter(level)
  counter(level: number): number {
    const current = this.counters.get(level) || 0;
    this.counters.set(level, current + 1);
    return current + 1;
  }

  // Equivalent Page(0, 1)
  pageNumber(): number {
    return this.page;
  }

  newPage(): void {
    this.page++;
  }

  resetCounter(level: number): void {
    this.counters.set(level, 0);
  }
}
```

### 9.2 Generation PDF avec jsPDF

```typescript
import { jsPDF } from 'jspdf';

class PDFReport extends MagicReport {
  private doc: jsPDF;
  private y = 20; // Position Y courante

  constructor(config: ReportConfig) {
    super(config);
    this.doc = new jsPDF({
      orientation: config.orientation === 'landscape' ? 'l' : 'p',
      unit: 'mm',
      format: config.pageSize.toLowerCase()
    });
  }

  // Area="H" - Header
  printPageHeader(title: string, date: Date): void {
    this.doc.setFontSize(16);
    this.doc.text(title, 20, 15);
    this.doc.setFontSize(10);
    this.doc.text(date.toLocaleDateString(), 170, 15);
    this.y = 25;
  }

  // Area="F" - Footer
  printPageFooter(): void {
    const pageNum = `- ${this.pageNumber()} -`;
    this.doc.setFontSize(8);
    this.doc.text(pageNum, 100, 285, { align: 'center' });
  }

  // Area="G" - Group Header
  printGroupHeader(groupName: string): void {
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(groupName, 20, this.y);
    this.y += 8;
    this.doc.setFont('helvetica', 'normal');
  }

  // Area="G" - Group Footer avec sous-total
  printGroupFooter(label: string, total: number): void {
    this.doc.setFontSize(10);
    this.doc.line(20, this.y, 190, this.y);
    this.y += 5;
    this.doc.text(`${label}: ${total}`, 150, this.y);
    this.y += 8;
  }

  // Area="N" - Detail line
  printDetailLine(data: string[]): void {
    const lineHeight = 6;

    // Verifier saut de page
    if (this.y > 270) {
      this.printPageFooter();
      this.doc.addPage();
      this.newPage();
      this.printPageHeader('Continuation', new Date());
    }

    this.doc.setFontSize(9);
    let x = 20;
    for (const field of data) {
      this.doc.text(field, x, this.y);
      x += 30;
    }
    this.y += lineHeight;
  }

  save(filename: string): void {
    this.printPageFooter();
    this.doc.save(filename);
  }
}
```

### 9.3 Exemple complet avec ruptures

```typescript
interface SalesData {
  region: string;
  product: string;
  quantity: number;
  amount: number;
}

function generateSalesReport(data: SalesData[]): void {
  const report = new PDFReport({
    title: 'Rapport des Ventes',
    orientation: 'portrait',
    pageSize: 'A4',
    margins: { top: 20, right: 20, bottom: 20, left: 20 }
  });

  report.printPageHeader('Rapport des Ventes', new Date());

  let currentRegion = '';
  let regionTotal = 0;
  let grandTotal = 0;

  for (const row of data) {
    // Rupture de groupe sur region
    if (row.region !== currentRegion) {
      // Group Suffix (fin du groupe precedent)
      if (currentRegion !== '') {
        report.printGroupFooter('Total Region', regionTotal);
        report.resetCounter(1);
        regionTotal = 0;
      }

      // Group Prefix (debut nouveau groupe)
      currentRegion = row.region;
      report.printGroupHeader(`Region: ${row.region}`);
    }

    // Record - Detail line
    report.printDetailLine([
      row.product,
      row.quantity.toString(),
      row.amount.toFixed(2)
    ]);

    regionTotal += row.amount;
    grandTotal += row.amount;
    report.counter(0); // Global counter
    report.counter(1); // Group counter
  }

  // Dernier Group Suffix
  if (currentRegion !== '') {
    report.printGroupFooter('Total Region', regionTotal);
  }

  // Task Suffix - Total general
  report.printGroupFooter('TOTAL GENERAL', grandTotal);

  report.save('sales-report.pdf');
}
```

---

## 10. Attributs supplementaires

### 10.1 FormUnits

| Valeur | Unite |
|--------|-------|
| 1 | Dialog units |
| 2 | Pixels |
| 3 | Points |

### 10.2 Font codes courants

| Code | Font |
|------|------|
| 8 | Arial 8pt |
| 11 | Arial 10pt |
| 33 | Arial 14pt Bold |
| 131 | Arial 12pt Bold |
| 167 | Arial 8pt |

### 10.3 Color codes

| Code | Couleur |
|------|---------|
| 6 | Blanc |
| 7 | Noir |
| 1 | Rouge |
| 2 | Vert |
| 3 | Bleu |

---

## 11. Points a valider

- [ ] Confirmation des codes Font avec captures ecran
- [ ] Verification des formules Page() avec exemples reels
- [ ] Test de conversion PDF avec donnees reelles
- [ ] Gestion des images dans les rapports

---

*Document genere par Claude Code - 2025-12-24*
*Source: Analyse des fichiers PBP avec impressions et groupes*
