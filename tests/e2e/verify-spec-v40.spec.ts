import { test, expect, Page } from '@playwright/test';

// Helper function to wait for content to load
async function waitForContentLoaded(page: Page) {
  await page.waitForFunction(() => {
    const content = document.querySelector('.content');
    return content && !content.textContent?.includes('Chargement');
  }, { timeout: 10000 });
}

// Helper function to navigate to a spec
async function navigateToSpec(page: Page, specName: string) {
  // Ouvrir le dossier Ventes
  const ventesFolder = page.locator('.folder-header:has-text("Ventes")');
  if (await ventesFolder.count() > 0) {
    await ventesFolder.click();
    await page.waitForTimeout(500);
  }

  // Cliquer sur la spec
  const spec = page.locator(`.nav-item:has-text("${specName}")`);
  if (await spec.count() > 0) {
    await spec.first().click();
    await waitForContentLoaded(page);
  }
}

test.describe('Verification specs V4.0 APEX/PDCA', () => {
  const siteUrl = 'https://jira.lb2i.com/viewer.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(siteUrl, { waitUntil: 'networkidle' });
    await page.waitForSelector('.folder-group', { timeout: 10000 });
  });

  test('ADH IDE 236 a le chemin complet du fichier source', async ({ page }) => {
    await navigateToSpec(page, 'ADH IDE 236');
    const content = await page.locator('.content').textContent();

    // V4.0 doit avoir le chemin complet
    expect(content).toContain('Prg_232.xml');
    expect(content).not.toContain('Prg_XXX.xml');

    console.log('IDE 236 V4.0 source path: OK');
  });

  test('ADH IDE 237 a une chaine d appels depuis Main correcte', async ({ page }) => {
    await navigateToSpec(page, 'ADH IDE 237');

    // Aller sur l'onglet Cartographie
    const cartoTab = page.locator('.spec-tab:has-text("Cartographie")');
    if (await cartoTab.count() > 0) {
      await cartoTab.click();
      await page.waitForTimeout(500);
    }

    const content = await page.locator('.content').textContent();

    // V4.0 doit avoir la chaine Main -> 163 -> 242 -> 237
    expect(content).toContain('Main');
    expect(content).toContain('163');
    expect(content).toContain('242');
    expect(content).toContain('237');
    expect(content).toContain('Chemin principal');

    console.log('IDE 237 V4.0 call chain: OK');
  });

  test('ADH IDE 237 a des callees sur 3 niveaux', async ({ page }) => {
    await navigateToSpec(page, 'ADH IDE 237');

    // Aller sur l'onglet Cartographie
    const cartoTab = page.locator('.spec-tab:has-text("Cartographie")');
    if (await cartoTab.count() > 0) {
      await cartoTab.click();
      await page.waitForTimeout(500);
    }

    const content = await page.locator('.content').textContent();

    // V4.0 doit avoir niveau 1 et niveau 2
    expect(content).toContain('Niv');
    expect(content).toContain('152');
    expect(content).toContain('233');
    expect(content).toContain('236');
    expect(content).toContain('niveau 2');

    console.log('IDE 237 V4.0 callees 3 levels: OK');
  });

  test('ADH IDE 237 a une section ECF composants', async ({ page }) => {
    await navigateToSpec(page, 'ADH IDE 237');

    // Aller sur l'onglet Cartographie
    const cartoTab = page.locator('.spec-tab:has-text("Cartographie")');
    if (await cartoTab.count() > 0) {
      await cartoTab.click();
      await page.waitForTimeout(500);
    }

    const content = await page.locator('.content').textContent();

    // V4.0 doit avoir la section ECF
    expect(content).toContain('ECF');
    expect(content).toContain('ADH.ecf');
    expect(content).toContain('RECUP_CLASSE_MOP');
    expect(content).toContain('CARACT_INTERDIT');

    console.log('IDE 237 V4.0 ECF components: OK');
  });

  test('ADH IDE 236 a des variables en format IDE (A, B, VG78)', async ({ page }) => {
    await navigateToSpec(page, 'ADH IDE 236');

    // Aller sur l'onglet Technique
    const techniqueTab = page.locator('.spec-tab:has-text("Technique")');
    await techniqueTab.click();
    await page.waitForTimeout(500);

    const content = await page.locator('.content').textContent();

    // V4.0 doit avoir les variables en format IDE (dans section Expressions ou Variables)
    expect(content).toContain('Variable A');
    expect(content).toContain('VG78');
    // Variable H est dans la section parametres comme "H" en bold
    expect(content).toMatch(/P0 Total|Variable H|P0 od annulation/);
    expect(content).not.toContain('{0,0}');

    console.log('IDE 236 V4.0 IDE variables: OK');
  });

  test('ADH IDE 237 a une strategie migration Clean Architecture', async ({ page }) => {
    await navigateToSpec(page, 'ADH IDE 237');

    const content = await page.locator('.content').textContent();

    // V4.0 doit avoir la strategie de migration
    expect(content).toContain('NOTES MIGRATION');
    expect(content).toContain('Clean Architecture');
    expect(content).toContain('CQRS');
    expect(content).toContain('Saga');
    expect(content).toContain('Unit of Work');

    console.log('IDE 237 V4.0 migration strategy: OK');
  });

  test('ADH IDE 236 a 30 parametres documentes', async ({ page }) => {
    await navigateToSpec(page, 'ADH IDE 236');

    // Aller sur l'onglet Technique
    const techniqueTab = page.locator('.spec-tab:has-text("Technique")');
    await techniqueTab.click();
    await page.waitForTimeout(500);

    const content = await page.locator('.content').textContent();

    // V4.0 doit avoir 30 parametres (le texte peut varier)
    expect(content).toMatch(/30 param|Parametres d'entree \(30/i);
    // Variables A et BD dans la section parametres
    expect(content).toContain('P0 od annulation');
    expect(content).toContain('TVA montant 2');

    console.log('IDE 236 V4.0 30 parameters: OK');
  });

  test('ADH IDE 237 a un algorigramme avec subgraphs', async ({ page }) => {
    await navigateToSpec(page, 'ADH IDE 237');

    // Aller sur l'onglet Technique
    const techniqueTab = page.locator('.spec-tab:has-text("Technique")');
    await techniqueTab.click();
    await page.waitForTimeout(500);

    const content = await page.locator('.content').textContent();

    // V4.0 doit avoir un algorigramme detaille
    expect(content).toContain('INITIALISATION');
    expect(content).toContain('VERIFICATION CLOTURE');
    expect(content).toContain('VG38');
    expect(content).toContain('Task');

    console.log('IDE 237 V4.0 detailed flowchart: OK');
  });
});
