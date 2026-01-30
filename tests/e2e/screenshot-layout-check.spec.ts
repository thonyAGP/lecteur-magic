import { test, expect } from '@playwright/test';

const BASE = 'http://jira.lb2i.com/viewer.html';

test.describe('Layout verification after CSS fix', () => {

  test('ADH IDE 237 - No horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(`${BASE}#specs/ADH-IDE-237.md`);
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'test-results/layout-237-1920.png', fullPage: false });

    // Check no horizontal scrollbar: scrollWidth should equal clientWidth
    const overflow = await page.evaluate(() => {
      const main = document.querySelector('.main') as HTMLElement;
      if (!main) return { scroll: 0, client: 0, hasOverflow: false };
      return {
        scroll: main.scrollWidth,
        client: main.clientWidth,
        hasOverflow: main.scrollWidth > main.clientWidth + 5
      };
    });
    console.log(`Main element: scrollWidth=${overflow.scroll}, clientWidth=${overflow.client}, hasOverflow=${overflow.hasOverflow}`);
    expect(overflow.hasOverflow).toBe(false);
  });

  test('ADH IDE 237 - 1366px viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 768 });
    await page.goto(`${BASE}#specs/ADH-IDE-237.md`);
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'test-results/layout-237-1366.png', fullPage: false });

    const overflow = await page.evaluate(() => {
      const main = document.querySelector('.main') as HTMLElement;
      if (!main) return { scroll: 0, client: 0, hasOverflow: false };
      return {
        scroll: main.scrollWidth,
        client: main.clientWidth,
        hasOverflow: main.scrollWidth > main.clientWidth + 5
      };
    });
    console.log(`Main element: scrollWidth=${overflow.scroll}, clientWidth=${overflow.client}, hasOverflow=${overflow.hasOverflow}`);
    expect(overflow.hasOverflow).toBe(false);
  });

  test('ADH IDE 121 - No horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(`${BASE}#specs/ADH-IDE-121.md`);
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'test-results/layout-121-1920.png', fullPage: false });

    const overflow = await page.evaluate(() => {
      const main = document.querySelector('.main') as HTMLElement;
      if (!main) return { scroll: 0, client: 0, hasOverflow: false };
      return {
        scroll: main.scrollWidth,
        client: main.clientWidth,
        hasOverflow: main.scrollWidth > main.clientWidth + 5
      };
    });
    console.log(`Main element: scrollWidth=${overflow.scroll}, clientWidth=${overflow.client}, hasOverflow=${overflow.hasOverflow}`);
    expect(overflow.hasOverflow).toBe(false);
  });
});
