#!/usr/bin/env node
/**
 * UI Screens Analyzer - Parse tous les ecrans ADH pour migration React
 * Extrait les FORM-DATA JSON des specs V7.2 et genere un inventaire detaille
 */

import fs from 'fs';
import path from 'path';

interface FormControl {
  x: number;
  y: number;
  w: number;
  h: number;
  type: string;
  var?: string;
  name?: string;
  text?: string;
  fmt?: string;
  color?: string;
  parent?: number | null;
  // Pour les tables
  cols?: Array<{ title: string; layer: number; w: number }>;
  rows?: number;
  titleH?: number;
  rowH?: number;
}

interface FormData {
  width: number;
  height?: number;
  vFactor?: number;
  hFactor?: number;
  type: string;
  controls: FormControl[];
  taskId?: number;
}

interface Screen {
  ide: number;
  position: string;
  name: string;
  type: string;
  width: number;
  height: number;
  bloc: string;
  formData?: FormData;
}

interface ProgramScreens {
  ide: number;
  programName: string;
  totalScreens: number;
  visibleScreens: number;
  screens: Screen[];
}

// Types de controles detectes
const CONTROL_TYPES = {
  label: 'Label',
  edit: 'Input/Edit',
  button: 'Button',
  checkbox: 'Checkbox',
  radio: 'Radio',
  table: 'DataGrid/Table',
  combo: 'ComboBox',
  image: 'Image',
  list: 'ListBox',
  tree: 'TreeView',
};

// Classification complexite
function classifyComplexity(controlCount: number): 'Simple' | 'Moyen' | 'Complexe' | 'Tres Complexe' {
  if (controlCount <= 5) return 'Simple';
  if (controlCount <= 15) return 'Moyen';
  if (controlCount <= 30) return 'Complexe';
  return 'Tres Complexe';
}

// Estimation effort (Story Points)
function estimateEffort(complexity: string, hasTable: boolean, hasManyControls: boolean): 'XS' | 'S' | 'M' | 'L' | 'XL' {
  if (complexity === 'Simple') return 'XS'; // 1-2 SP
  if (complexity === 'Moyen' && !hasTable) return 'S'; // 3 SP
  if (complexity === 'Moyen' && hasTable) return 'M'; // 5 SP
  if (complexity === 'Complexe') return 'L'; // 8 SP
  return 'XL'; // 13+ SP
}

// Parser le contenu FORM-DATA depuis markdown
function extractFormData(specContent: string): FormData | null {
  const match = specContent.match(/<!-- FORM-DATA:\n({[\s\S]*?})\n-->/);
  if (!match) return null;

  try {
    return JSON.parse(match[1]);
  } catch (e) {
    console.error('Erreur parsing JSON:', e);
    return null;
  }
}

// Analyser un fichier spec
function analyzeSpecFile(filePath: string): ProgramScreens | null {
  const content = fs.readFileSync(filePath, 'utf-8');
  const ideMatch = path.basename(filePath).match(/ADH-IDE-(\d+)\.md/);
  if (!ideMatch) return null;

  const ide = parseInt(ideMatch[1]);

  // Extraire le nom du programme
  const nameMatch = content.match(/^# ADH IDE \d+ - (.+)$/m);
  const programName = nameMatch ? nameMatch[1] : 'Unknown';

  // Extraire la section 8.1 Forms visibles
  const formsTableMatch = content.match(/### 8\.1 Forms visibles \((\d+) \/ (\d+)\)/);
  if (!formsTableMatch) return null;

  const visibleScreens = parseInt(formsTableMatch[1]);
  const totalScreens = parseInt(formsTableMatch[2]);

  // Extraire toutes les sections d'ecrans
  const screenSections = content.matchAll(/#### <a id="ecran-t\d+"><\/a>(.+?)\n\*\*Tache\*\* : \[(.+?)\]\(.+?\) \| \*\*Type\*\* : (.+?) \| \*\*Dimensions\*\* : (\d+) x (\d+) DLU\n\*\*Bloc\*\* : (.+?) \|/g);

  const screens: Screen[] = [];
  for (const match of screenSections) {
    const [, name, position, type, width, height, bloc] = match;

    // Chercher le FORM-DATA apres ce header
    const formDataStart = match.index! + match[0].length;
    const nextSectionMatch = content.slice(formDataStart).match(/\n---\n/);
    const sectionContent = nextSectionMatch
      ? content.slice(formDataStart, formDataStart + nextSectionMatch.index!)
      : content.slice(formDataStart);

    const formData = extractFormData(sectionContent);

    screens.push({
      ide,
      position,
      name: name.trim(),
      type,
      width: parseInt(width),
      height: parseInt(height),
      bloc,
      formData: formData || undefined,
    });
  }

  return {
    ide,
    programName,
    totalScreens,
    visibleScreens,
    screens,
  };
}

// Generer le rapport markdown
function generateReport(programs: ProgramScreens[]): string {
  let md = `# Inventaire UI - Migration React ADH\n\n`;
  md += `**Date**: ${new Date().toISOString().split('T')[0]}\n\n`;
  md += `**Objectif**: Analyse exhaustive des ecrans a migrer vers React\n\n`;

  // Stats globales
  const totalPrograms = programs.length;
  const totalScreens = programs.reduce((sum, p) => sum + p.visibleScreens, 0);
  const totalControls = programs.reduce((sum, p) =>
    sum + p.screens.reduce((s, scr) => s + (scr.formData?.controls.length || 0), 0), 0
  );

  md += `## Stats Globales\n\n`;
  md += `- **Programmes avec ecrans**: ${totalPrograms}\n`;
  md += `- **Ecrans totaux**: ${totalScreens}\n`;
  md += `- **Controles totaux**: ${totalControls}\n`;
  md += `- **Moyenne controles/ecran**: ${(totalControls / totalScreens).toFixed(1)}\n\n`;

  // Inventaire par programme
  md += `## Inventaire par Programme\n\n`;

  for (const prog of programs.sort((a, b) => b.visibleScreens - a.visibleScreens)) {
    md += `### IDE ${prog.ide} - ${prog.programName}\n\n`;
    md += `**Ecrans visibles**: ${prog.visibleScreens} / ${prog.totalScreens}\n\n`;

    if (prog.screens.length === 0) {
      md += `*Aucune donnee FORM-DATA disponible*\n\n`;
      continue;
    }

    md += `| Ecran | Type | Dims | Controles | Types | Complexite | Effort |\n`;
    md += `|-------|------|------|-----------|-------|------------|--------|\n`;

    for (const screen of prog.screens) {
      const controls = screen.formData?.controls || [];
      const controlCount = controls.length;
      const typesUsed = [...new Set(controls.map(c => c.type))].join(', ');
      const hasTable = controls.some(c => c.type === 'table');
      const complexity = classifyComplexity(controlCount);
      const effort = estimateEffort(complexity, hasTable, controlCount > 20);

      md += `| ${screen.name} | ${screen.type} | ${screen.width}x${screen.height} | ${controlCount} | ${typesUsed} | ${complexity} | ${effort} |\n`;
    }

    md += `\n`;
  }

  // Analyse des controles par type
  md += `## Distribution des Controles\n\n`;

  const controlStats = new Map<string, number>();
  for (const prog of programs) {
    for (const screen of prog.screens) {
      const controls = screen.formData?.controls || [];
      for (const ctrl of controls) {
        controlStats.set(ctrl.type, (controlStats.get(ctrl.type) || 0) + 1);
      }
    }
  }

  md += `| Type | Occurrences | % |\n`;
  md += `|------|-------------|---|\n`;

  const totalCtrl = Array.from(controlStats.values()).reduce((a, b) => a + b, 0);
  for (const [type, count] of Array.from(controlStats.entries()).sort((a, b) => b[1] - a[1])) {
    const pct = ((count / totalCtrl) * 100).toFixed(1);
    md += `| ${type} | ${count} | ${pct}% |\n`;
  }

  md += `\n`;

  // Patterns communs
  md += `## Patterns UI Recurrents\n\n`;
  md += `### 1. Grilles de donnees (Tables)\n\n`;

  const tableScreens: Array<{ ide: number; screen: string; cols: number }> = [];
  for (const prog of programs) {
    for (const screen of prog.screens) {
      const tables = screen.formData?.controls.filter(c => c.type === 'table') || [];
      for (const tbl of tables) {
        if (tbl.cols) {
          tableScreens.push({ ide: prog.ide, screen: screen.name, cols: tbl.cols.length });
        }
      }
    }
  }

  if (tableScreens.length > 0) {
    md += `**${tableScreens.length} tables detectees**\n\n`;
    md += `| IDE | Ecran | Colonnes |\n`;
    md += `|-----|-------|----------|\n`;
    for (const tbl of tableScreens.slice(0, 10)) {
      md += `| ${tbl.ide} | ${tbl.screen} | ${tbl.cols} |\n`;
    }
    md += `\n`;
  }

  // Composants partages identifies
  md += `## Composants React Partages\n\n`;
  md += `### Detectes automatiquement\n\n`;
  md += `1. **TransactionForm** (237/238): Form principal 1112x279, ~80% identique\n`;
  md += `2. **DataGrid**: Table avec header + rows (${tableScreens.length} occurrences)\n`;
  md += `3. **HeaderBar**: Barre superieure (label 0,0 pleine largeur)\n`;
  md += `4. **FooterBar**: Barre inferieure (label bottom pleine largeur)\n`;
  md += `5. **FormPanel**: Container avec border (parent groups)\n\n`;

  // Proposition arborescence
  md += `## Arborescence Proposee\n\n`;
  md += `\`\`\`\n`;
  md += `src/\n`;
  md += `  components/\n`;
  md += `    common/\n`;
  md += `      DataGrid.tsx       # Table generique avec colonnes configurables\n`;
  md += `      HeaderBar.tsx      # Barre superieure avec titre\n`;
  md += `      FooterBar.tsx      # Barre inferieure avec boutons\n`;
  md += `      FormPanel.tsx      # Container avec border\n`;
  md += `      Button.tsx         # Bouton style\n`;
  md += `      Input.tsx          # Champ texte\n`;
  md += `      Checkbox.tsx       # Case a cocher\n`;
  md += `      Radio.tsx          # Bouton radio\n`;
  md += `    caisse/\n`;
  md += `      MenuPrincipal.tsx  # IDE 163\n`;
  md += `      VenteForm.tsx      # IDE 237/238 - form principal partage\n`;
  md += `      ReglementDialog.tsx\n`;
  md += `    datacatching/\n`;
  md += `      WelcomeScreen.tsx  # IDE 7\n`;
  md += `      GuestList.tsx\n`;
  md += `      PersonalInfo.tsx\n`;
  md += `    factures/\n`;
  md += `      FactureForm.tsx    # IDE 97\n`;
  md += `      HebergementPanel.tsx\n`;
  md += `    change/\n`;
  md += `      ChangeVente.tsx    # IDE 25\n`;
  md += `      ChangeAchat.tsx\n`;
  md += `    fermeture/\n`;
  md += `      FermetureForm.tsx  # IDE 131\n`;
  md += `      DetailDevises.tsx\n`;
  md += `\`\`\`\n\n`;

  // Estimation globale
  md += `## Estimation Effort Global\n\n`;

  const effortMap = new Map<string, number>([
    ['XS', 0], ['S', 0], ['M', 0], ['L', 0], ['XL', 0]
  ]);

  for (const prog of programs) {
    for (const screen of prog.screens) {
      const controls = screen.formData?.controls || [];
      const hasTable = controls.some(c => c.type === 'table');
      const complexity = classifyComplexity(controls.length);
      const effort = estimateEffort(complexity, hasTable, controls.length > 20);
      effortMap.set(effort, (effortMap.get(effort) || 0) + 1);
    }
  }

  md += `| Effort | Ecrans | Story Points (estim) |\n`;
  md += `|--------|--------|----------------------|\n`;
  md += `| XS     | ${effortMap.get('XS')} | ${effortMap.get('XS')! * 1} SP |\n`;
  md += `| S      | ${effortMap.get('S')} | ${effortMap.get('S')! * 3} SP |\n`;
  md += `| M      | ${effortMap.get('M')} | ${effortMap.get('M')! * 5} SP |\n`;
  md += `| L      | ${effortMap.get('L')} | ${effortMap.get('L')! * 8} SP |\n`;
  md += `| XL     | ${effortMap.get('XL')} | ${effortMap.get('XL')! * 13} SP |\n`;

  const totalSP =
    effortMap.get('XS')! * 1 +
    effortMap.get('S')! * 3 +
    effortMap.get('M')! * 5 +
    effortMap.get('L')! * 8 +
    effortMap.get('XL')! * 13;

  md += `| **TOTAL** | **${totalScreens}** | **${totalSP} SP** |\n\n`;

  md += `**Estimation sprint** (velocity 20 SP/sprint): ~${Math.ceil(totalSP / 20)} sprints\n\n`;

  return md;
}

// Main
const SPECS_DIR = path.join(process.cwd(), '.openspec/specs');
const PROGRAMS_PRIORITY = [163, 237, 238, 7, 97, 131, 25, 77, 111, 28, 69, 247, 242, 37, 151];

const programs: ProgramScreens[] = [];

for (const ide of PROGRAMS_PRIORITY) {
  const specPath = path.join(SPECS_DIR, `ADH-IDE-${ide}.md`);
  if (!fs.existsSync(specPath)) {
    console.warn(`SKIP: ${specPath} not found`);
    continue;
  }

  const result = analyzeSpecFile(specPath);
  if (result) {
    programs.push(result);
    console.log(`✓ IDE ${ide}: ${result.visibleScreens} ecrans, ${result.screens.reduce((s, scr) => s + (scr.formData?.controls.length || 0), 0)} controles`);
  }
}

const report = generateReport(programs);
const outputPath = path.join(process.cwd(), '.openspec/reports/UI_INVENTORY_ANALYSIS.md');
fs.writeFileSync(outputPath, report);

console.log(`\n✓ Rapport genere: ${outputPath}`);
console.log(`✓ ${programs.length} programmes analyses`);
console.log(`✓ ${programs.reduce((s, p) => s + p.visibleScreens, 0)} ecrans inventories`);
