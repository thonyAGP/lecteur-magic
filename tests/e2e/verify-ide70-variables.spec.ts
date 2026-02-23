import { test, expect } from '@playwright/test';

const VIEWER_URL = '/viewer.html#specs/ADH-IDE-70.md';

test.describe('ADH IDE 70 - Variables Section Verification', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(VIEWER_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Wait for spec to render
  });

  test('spec loads correctly', async ({ page }) => {
    const body = await page.textContent('body');
    expect(body).toContain('70');
    expect(body).toContain('Print extrait compte');
  });

  test('Section 11 Variables exists', async ({ page }) => {
    const body = await page.textContent('body');
    expect(body).toContain('11. VARIABLES');
    expect(body).toContain('11.1 Parametres entrants');
  });

  test('Variables table has correct headers', async ({ page }) => {
    // Navigate to Donnees tab if needed
    const donneesTab = page.locator('.spec-tab').filter({ hasText: /donn/i });
    if (await donneesTab.count() > 0) {
      await donneesTab.click();
      await page.waitForTimeout(500);
    }

    const body = await page.textContent('body');
    expect(body).toContain('Lettre');
    expect(body).toContain('Nom');
    expect(body).toContain('Type');
    expect(body).toContain('Usage dans');
  });

  test('Parameter variables A-O are present', async ({ page }) => {
    const body = await page.textContent('body');

    // Check first few parameters
    expect(body).toMatch(/A.*P0 societe.*Alpha/s);
    expect(body).toMatch(/B.*P0 code adherent.*Numeric/s);
    expect(body).toMatch(/C.*P0 filiation.*Numeric/s);
    expect(body).toMatch(/D.*P0 masque montant.*Alpha/s);
    expect(body).toMatch(/N.*P.Appel Direct.*Logical/s);
  });

  test('Work variables P-Z are present', async ({ page }) => {
    const body = await page.textContent('body');

    expect(body).toContain('W0 nom');
    expect(body).toContain('W0 prenom');
    expect(body).toContain('W0 devise locale');
  });

  test('Session variables BA-BB are present', async ({ page }) => {
    const body = await page.textContent('body');

    expect(body).toContain('v. Libelle edition');
    expect(body).toContain('BA');
    expect(body).toContain('BB');
  });

  test('Section 5 Business Rules exist', async ({ page }) => {
    const body = await page.textContent('body');

    expect(body).toContain('REGLES METIER');
    expect(body).toContain('GetParam');
    expect(body).toContain('CURRENTPRINTERNUM');
  });

  test('Section 9.4 Algorigramme has decision node', async ({ page }) => {
    const body = await page.textContent('body');

    expect(body).toContain('Algorigramme');
    expect(body).toContain('DECISION');
    expect(body).toContain('OUI');
    expect(body).toContain('NON');
  });

  test('take screenshot for verification', async ({ page }) => {
    // Click on Donnees tab to show Variables section
    const donneesTab = page.locator('.spec-tab').filter({ hasText: /donn/i });
    if (await donneesTab.count() > 0) {
      await donneesTab.click();
      await page.waitForTimeout(1000);
    }

    await page.screenshot({
      path: 'test-results/ide70-full-page.png',
      fullPage: true
    });
  });
});
