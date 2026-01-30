import { test, expect } from '@playwright/test';

const BASE = 'http://jira.lb2i.com/viewer.html';

test('Debug overflow - scroll through all sections', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto(`${BASE}#specs/ADH-IDE-237.md`);
  await page.waitForTimeout(3000);

  // Screenshot initial
  await page.screenshot({ path: 'test-results/debug-overflow-top.png', fullPage: false });

  // Check body and document overflow
  const bodyOverflow = await page.evaluate(() => {
    const body = document.body;
    const docEl = document.documentElement;
    const main = document.querySelector('.main') as HTMLElement;
    const content = document.querySelector('.content') as HTMLElement;

    // Find widest element
    const allElements = document.querySelectorAll('*');
    let widest = { tag: '', class: '', width: 0 };
    allElements.forEach(el => {
      const rect = (el as HTMLElement).getBoundingClientRect();
      if (rect.width > widest.width) {
        widest = { tag: el.tagName, class: el.className?.toString().substring(0, 50) || '', width: rect.width };
      }
    });

    // Find elements that overflow viewport
    const overflowing: { tag: string, class: string, scrollW: number, clientW: number }[] = [];
    allElements.forEach(el => {
      const he = el as HTMLElement;
      if (he.scrollWidth > he.clientWidth + 5) {
        overflowing.push({
          tag: el.tagName,
          class: el.className?.toString().substring(0, 50) || '',
          scrollW: he.scrollWidth,
          clientW: he.clientWidth
        });
      }
    });

    return {
      viewportWidth: window.innerWidth,
      bodyScrollWidth: body.scrollWidth,
      bodyClientWidth: body.clientWidth,
      docScrollWidth: docEl.scrollWidth,
      docClientWidth: docEl.clientWidth,
      mainScrollWidth: main?.scrollWidth,
      mainClientWidth: main?.clientWidth,
      contentScrollWidth: content?.scrollWidth,
      contentClientWidth: content?.clientWidth,
      widestElement: widest,
      overflowingElements: overflowing.slice(0, 10)
    };
  });

  console.log('=== OVERFLOW DEBUG ===');
  console.log(JSON.stringify(bodyOverflow, null, 2));

  // Click each tab and screenshot
  const tabs = ['Resume', 'Ecrans', 'Donnees', 'Connexions'];
  for (const tab of tabs) {
    const tabBtn = page.locator(`.tab-btn:has-text("${tab}")`);
    if (await tabBtn.count() > 0) {
      await tabBtn.first().click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: `test-results/debug-overflow-${tab.toLowerCase()}.png`, fullPage: false });

      // Check overflow after tab switch
      const tabOverflow = await page.evaluate(() => {
        const main = document.querySelector('.main') as HTMLElement;
        const tables = document.querySelectorAll('table');
        const tableWidths: { index: number, scrollW: number, clientW: number, offsetW: number }[] = [];
        tables.forEach((t, i) => {
          tableWidths.push({
            index: i,
            scrollW: t.scrollWidth,
            clientW: t.clientWidth,
            offsetW: t.offsetWidth
          });
        });
        return {
          mainScroll: main?.scrollWidth,
          mainClient: main?.clientWidth,
          hasOverflow: main?.scrollWidth > main?.clientWidth + 5,
          tableCount: tables.length,
          tables: tableWidths.slice(0, 5)
        };
      });
      console.log(`\n=== TAB: ${tab} ===`);
      console.log(JSON.stringify(tabOverflow, null, 2));
    }
  }

  // Full page screenshot
  await page.screenshot({ path: 'test-results/debug-overflow-fullpage.png', fullPage: true });
});
