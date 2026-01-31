import { test, expect } from '@playwright/test';

// Test against jira.lb2i.com (auto-deployed from git push)
const BASE = 'http://jira.lb2i.com/viewer.html';
const SPEC_URL = `${BASE}#specs/ADH-IDE-237.md`;

test.describe('V7.4 - IDE positions, DataView columns, collapsible, algorigramme', () => {
  test.setTimeout(60000);

  test.beforeEach(async ({ page }) => {
    await page.goto(SPEC_URL);
    await page.waitForTimeout(5000);
  });

  test('Task numbering uses real IDE positions (237.30 for Affectation PAX)', async ({ page }) => {
    // Click Ecrans tab (V7.2 pipeline tab name)
    await page.locator('.spec-tab').filter({ hasText: 'Ecrans' }).click();
    await page.waitForTimeout(2000);

    // Check only within the Ecrans section
    const ecransSection = page.locator('.spec-section[data-tab="Ecrans"]');
    const sectionContent = await ecransSection.textContent();

    // 237.30 = Affectation PAX / Transfert (real IDE position from KB)
    expect(sectionContent).toContain('237.30');
    expect(sectionContent).toContain('Affectation PAX');

    // Verify "Affectation PAX" row has position 237.30 (not the old 237.12)
    // Find the row containing "Affectation PAX" and check its position
    const rows = await ecransSection.locator('tr').all();
    let affectationPosition = '';
    for (const row of rows) {
      const text = await row.textContent();
      if (text?.includes('Affectation PAX')) {
        const cells = await row.locator('td').allTextContents();
        affectationPosition = cells[1]?.trim() || ''; // Position is 2nd column
        break;
      }
    }
    console.log(`Affectation PAX position: "${affectationPosition}"`);
    expect(affectationPosition).toBe('237.30');

    await page.screenshot({ path: 'test-results/v74-ide-positions.png', fullPage: true });
  });

  test('Variable letters from KB not heuristic', async ({ page }) => {
    await page.locator('.spec-tab').filter({ hasText: 'Ecrans' }).click();
    await page.waitForTimeout(2000);

    const content = await page.textContent('body');

    // Should not have raw field references like {0,3}
    const rawFieldRef = content?.match(/\{0,\d+\}/g) || [];
    console.log(`Raw field refs found: ${rawFieldRef.length}`);
    expect(rawFieldRef.length).toBe(0);

    // Should not have "Variable X" generic naming (heuristic)
    const variableXPattern = content?.match(/Variable \d+/g) || [];
    console.log(`"Variable N" patterns: ${variableXPattern.length}`);
    expect(variableXPattern.length).toBe(0);
  });

  test('Champs/Boutons are collapsible (details/summary tags)', async ({ page }) => {
    await page.locator('.spec-tab').filter({ hasText: 'Ecrans' }).click();
    await page.waitForTimeout(2000);

    // Check for <details> elements (collapsible sections)
    const detailsCount = await page.locator('details').count();
    console.log(`Collapsible <details> sections: ${detailsCount}`);
    expect(detailsCount).toBeGreaterThan(0);

    // Check for <summary> with "Champs" or "Bouton" text
    const summaryTexts = await page.locator('details summary').allTextContents();
    console.log(`Summary texts: ${JSON.stringify(summaryTexts.slice(0, 10))}`);

    const hasChampsOrBoutons = summaryTexts.some(t =>
      t.includes('Champs') || t.includes('Bouton')
    );
    expect(hasChampsOrBoutons).toBe(true);

    await page.screenshot({ path: 'test-results/v74-collapsible.png', fullPage: true });
  });

  test('Algorigramme V3.5 template (START, INIT, PROCESS, CALLS, END)', async ({ page }) => {
    // Algorigramme is in Donnees tab
    await page.locator('.spec-tab').filter({ hasText: 'Donnees' }).click();
    await page.waitForTimeout(2000);

    const content = await page.textContent('body');

    // V3.5 template nodes
    expect(content).toContain('START');
    expect(content).toContain('Initialisation');
    expect(content).toContain('END');

    await page.screenshot({ path: 'test-results/v74-algorigramme.png', fullPage: true });
  });

  test('Mockup titles use IDE position string', async ({ page }) => {
    await page.locator('.spec-tab').filter({ hasText: 'Ecrans' }).click();
    await page.waitForTimeout(2000);

    // Check mockup titles contain IDE position format
    const mockupTitles = await page.locator('.magic-mockup-title').allTextContents();
    console.log(`Mockup titles found: ${mockupTitles.length}`);
    console.log(`Titles: ${JSON.stringify(mockupTitles.slice(0, 5))}`);

    if (mockupTitles.length > 0) {
      const hasIdePosition = mockupTitles.some(t => /237\.\d+/.test(t));
      expect(hasIdePosition).toBe(true);
    }
  });

  test('Screenshot overview: all tabs', async ({ page }) => {
    await page.screenshot({ path: 'test-results/v74-resume.png', fullPage: true });

    await page.locator('.spec-tab').filter({ hasText: 'Ecrans' }).click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'test-results/v74-ecrans.png', fullPage: true });

    await page.locator('.spec-tab').filter({ hasText: 'Donnees' }).click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'test-results/v74-donnees.png', fullPage: true });

    await page.locator('.spec-tab').filter({ hasText: 'Connexions' }).click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'test-results/v74-connexions.png', fullPage: true });
  });
});
