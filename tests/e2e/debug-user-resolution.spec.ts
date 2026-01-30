import { test, expect } from '@playwright/test';

const BASE = 'http://jira.lb2i.com/viewer.html';

test('User resolution 3072x1920 @150% = 2048x1280 CSS px', async ({ page }) => {
  await page.setViewportSize({ width: 2048, height: 1280 });
  await page.goto(`${BASE}#specs/ADH-IDE-237.md`);
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'test-results/user-res-2048-top.png', fullPage: false });

  // Check overflow
  const info = await page.evaluate(() => {
    const main = document.querySelector('.main') as HTMLElement;
    const content = document.querySelector('.content') as HTMLElement;
    const tables = document.querySelectorAll('.content table');
    const tableInfo: any[] = [];
    tables.forEach((t, i) => {
      const he = t as HTMLElement;
      tableInfo.push({ i, scrollW: he.scrollWidth, clientW: he.clientWidth, offsetW: he.offsetWidth });
    });

    // Check all elements wider than viewport
    const wide: any[] = [];
    document.querySelectorAll('*').forEach(el => {
      const rect = (el as HTMLElement).getBoundingClientRect();
      if (rect.right > 2048) {
        wide.push({ tag: el.tagName, class: (el.className?.toString() || '').substring(0, 40), right: Math.round(rect.right), width: Math.round(rect.width) });
      }
    });

    return {
      viewport: window.innerWidth,
      bodyScrollW: document.body.scrollWidth,
      mainScrollW: main?.scrollWidth,
      mainClientW: main?.clientWidth,
      mainOverflow: main ? main.scrollWidth > main.clientWidth + 5 : null,
      contentW: content?.clientWidth,
      tables: tableInfo,
      elementsOverflowing: wide.slice(0, 10)
    };
  });
  console.log(JSON.stringify(info, null, 2));

  // Scroll down to see tables
  await page.evaluate(() => {
    const main = document.querySelector('.main');
    if (main) main.scrollTop = 600;
  });
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'test-results/user-res-2048-tables.png', fullPage: false });
});
