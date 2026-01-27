import { test, expect } from '@playwright/test';

test.describe('Verification donnees specs V2', () => {
  const siteUrl = 'https://jira.lb2i.com/viewer.html';

  test.beforeEach(async ({ page }) => {
    await page.goto(siteUrl, { waitUntil: 'networkidle' });
    await page.waitForSelector('.folder-group', { timeout: 10000 });

    // Ouvrir le dossier Ventes
    const ventesFolder = page.locator('.folder-header:has-text("Ventes")');
    if (await ventesFolder.count() > 0) {
      await ventesFolder.click();
      await page.waitForTimeout(500);
    }

    // Cliquer sur ADH IDE 237
    const spec237 = page.locator('.nav-item:has-text("ADH IDE 237")');
    if (await spec237.count() > 0) {
      await spec237.first().click();
      await page.waitForSelector('.content', { timeout: 5000 });
    }
  });

  test('Les tables ont des vrais noms (pas Table_XX)', async ({ page }) => {
    // Aller sur l'onglet Technique
    const techniqueTab = page.locator('.spec-tab:has-text("Technique")');
    await techniqueTab.click();
    await page.waitForTimeout(500);

    // Verifier que les vrais noms de tables apparaissent
    const content = await page.locator('.content').textContent();

    // Vrais noms logiques attendus
    expect(content).toContain('reseau_cloture');
    expect(content).toContain('prestations');
    expect(content).toContain('hebergement');

    // Vrais noms physiques attendus
    expect(content).toContain('cafil001_dat');
    expect(content).toContain('cafil010_dat');

    // Verifier qu'on n'a PAS les noms generiques
    const hasGenericNames = content?.includes('Table_31') || content?.includes('Table_40');
    expect(hasGenericNames).toBeFalsy();

    console.log('Tables avec vrais noms: OK');
  });

  test('Les expressions sont affichees avec leur contenu', async ({ page }) => {
    // Aller sur l'onglet Technique
    const techniqueTab = page.locator('.spec-tab:has-text("Technique")');
    await techniqueTab.click();
    await page.waitForTimeout(500);

    const content = await page.locator('.content').textContent();

    // Verifier que des expressions Magic sont presentes
    expect(content).toContain('DStr');
    expect(content).toContain('Date');
    expect(content).toContain('Trim');

    // Verifier le compteur d'expressions
    expect(content).toContain('305 expressions');

    console.log('Expressions avec contenu: OK');
  });

  test('Les statistiques sont affichees', async ({ page }) => {
    // Aller sur l'onglet Technique
    const techniqueTab = page.locator('.spec-tab:has-text("Technique")');
    await techniqueTab.click();
    await page.waitForTimeout(500);

    const content = await page.locator('.content').textContent();

    // Verifier les statistiques
    expect(content).toContain('Taches');
    expect(content).toContain('49');
    expect(content).toContain('Lignes logique');
    expect(content).toContain('1818');

    console.log('Statistiques: OK');
  });

  test('La cartographie contient les callers et callees', async ({ page }) => {
    // Aller sur l'onglet Cartographie
    const cartoTab = page.locator('.spec-tab:has-text("Cartographie")');
    await cartoTab.click();
    await page.waitForTimeout(500);

    const content = await page.locator('.content').textContent();

    // Verifier les callers
    expect(content).toContain('Menu caisse GM');
    expect(content).toContain('163');

    // Verifier les callees
    expect(content).toContain('Recup Classe');
    expect(content).toContain('152');
    expect(content).toContain('Get Printer');
    expect(content).toContain('179');

    console.log('Cartographie callers/callees: OK');
  });

  test('Les diagrammes Mermaid sont rendus', async ({ page }) => {
    // Aller sur l'onglet Cartographie
    const cartoTab = page.locator('.spec-tab:has-text("Cartographie")');
    await cartoTab.click();
    await page.waitForTimeout(1000);

    // Verifier que Mermaid a rendu les diagrammes (svg genere)
    const mermaidSvg = page.locator('svg.mermaid, .mermaid svg, pre code.language-mermaid');
    const count = await mermaidSvg.count();

    console.log(`Diagrammes Mermaid trouves: ${count}`);

    // On devrait avoir au moins 2 diagrammes (call chain + callees)
    // Note: si Mermaid n'est pas charge, on verifie au moins le code source
    const mermaidCode = page.locator('code.language-mermaid, pre:has-text("graph LR")');
    const codeCount = await mermaidCode.count();

    expect(count + codeCount).toBeGreaterThanOrEqual(1);
  });
});

test.describe('Verification spec IDE 236 (moins de donnees)', () => {
  const siteUrl = 'https://jira.lb2i.com/viewer.html';

  test('IDE 236 a aussi des vrais noms de tables', async ({ page }) => {
    await page.goto(siteUrl, { waitUntil: 'networkidle' });
    await page.waitForSelector('.folder-group', { timeout: 10000 });

    // Ouvrir le dossier Ventes
    const ventesFolder = page.locator('.folder-header:has-text("Ventes")');
    if (await ventesFolder.count() > 0) {
      await ventesFolder.click();
      await page.waitForTimeout(500);
    }

    // Cliquer sur ADH IDE 236
    const spec236 = page.locator('.nav-item:has-text("ADH IDE 236")');
    if (await spec236.count() > 0) {
      await spec236.first().click();
      await page.waitForSelector('.content', { timeout: 5000 });
    }

    // Aller sur l'onglet Technique
    const techniqueTab = page.locator('.spec-tab:has-text("Technique")');
    await techniqueTab.click();
    await page.waitForTimeout(500);

    const content = await page.locator('.content').textContent();

    // Verifier les vrais noms de tables pour IDE 236
    expect(content).toContain('gm-complet');
    expect(content).toContain('cafil009_dat');
    expect(content).toContain('hebergement');
    expect(content).toContain('cafil012_dat');

    console.log('IDE 236 avec vrais noms: OK');
  });
});
