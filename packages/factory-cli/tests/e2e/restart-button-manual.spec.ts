import { test, expect } from '@playwright/test';

/**
 * Tests E2E pour le bouton Restart (nécessite serveur actif)
 *
 * Ces tests sont marqués @manual car ils nécessitent un serveur réel qui tourne.
 * Ils testent le cycle complet : clic bouton → restart → reconnexion.
 */

test.describe('Restart Button - Manual Tests @manual', () => {
  test.skip('should restart server when clicking restart button - MANUAL TEST', async ({ page }) => {
    /**
     * Ce test est skip par défaut car il nécessite :
     * 1. Un serveur qui tourne sur port 3070
     * 2. Un serveur "outdated" (commit actuel ≠ latest)
     *
     * Pour l'exécuter manuellement :
     * 1. Lancer serveur : pnpm run serve --port 3070
     * 2. Faire un commit pour que le serveur soit outdated
     * 3. Exécuter : pnpm test:e2e restart-button-manual.spec.ts --grep @manual
     */

    // Navigate to dashboard
    await page.goto(page.context().baseURL || 'http://localhost:3099');

    // Wait for server to be connected
    await page.waitForSelector('.server-badge.connected', { timeout: 10000 });

    // Capture initial server start time
    const initialVersion = await page.evaluate(() =>
      fetch('/api/version').then(r => r.json())
    );
    const initialStartTime = initialVersion.serverStartTime;
    console.log('Initial server start time:', initialStartTime);

    // Verify outdated badge is shown
    const versionBadge = page.locator('#version-badge');
    await expect(versionBadge).toHaveClass(/outdated/);
    await expect(versionBadge).toContainText('commits behind');

    // Verify restart button is visible
    const restartBtn = page.locator('#btn-restart');
    await expect(restartBtn).toBeVisible();

    // Click restart button
    await restartBtn.click();

    // Verify badge shows "Restarting..."
    await expect(versionBadge).toContainText('Restarting');

    // Wait for server to disconnect (badge should show disconnected)
    await page.waitForSelector('.server-badge.disconnected', { timeout: 5000 });

    // Wait for server to reconnect (up to 30s)
    await page.waitForSelector('.server-badge.connected', { timeout: 30000 });

    // Wait for page to reload
    await page.waitForLoadState('networkidle');

    // Verify new server start time
    const newVersion = await page.evaluate(() =>
      fetch('/api/version').then(r => r.json())
    );
    const newStartTime = newVersion.serverStartTime;
    console.log('New server start time:', newStartTime);

    // Server should have restarted (different start time)
    expect(newStartTime).not.toBe(initialStartTime);

    // Badge should now be up-to-date (if latest code was built)
    const finalBadge = page.locator('#version-badge');
    // Note: Might still be outdated if build didn't update BUILD_INFO.commit
    // So we just check it's not showing "Restarting" anymore
    await expect(finalBadge).not.toContainText('Restarting');
  });

  test('should call POST /api/server/restart endpoint', async ({ request }) => {
    /**
     * Test unitaire de l'endpoint POST /api/server/restart
     * Ce test vérifie juste que l'endpoint répond correctement
     */

    // Note: Ce test va faire redémarrer le serveur !
    // Skip si le serveur n'est pas prêt à redémarrer
    test.skip(process.env.CI === 'true', 'Skip in CI - would restart server');

    // Playwright request uses baseURL automatically
    const response = await request.post('/api/server/restart');

    // Should return 200 with restart message
    expect(response.status()).toBe(200);

    const json = await response.json();
    expect(json).toEqual({
      restarting: true,
      message: 'Server restart initiated. Dashboard will reconnect automatically.',
    });

    // Server should disconnect shortly after
    // (Can't test this easily without Playwright page context)
  });
});

/**
 * Instructions pour tests manuels :
 *
 * 1. Démarrer le serveur :
 *    ```bash
 *    cd packages/factory-cli
 *    pnpm run serve --port 3070
 *    ```
 *
 * 2. S'assurer que le serveur est "outdated" :
 *    - Faire un commit bidon : git commit --allow-empty -m "test"
 *    - Ou modifier un fichier et commiter
 *
 * 3. Ouvrir le dashboard : http://localhost:3070
 *    - Vérifier pastille orange "⚠ X commits behind"
 *    - Vérifier bouton "🔄 Restart" visible
 *
 * 4. Cliquer sur le bouton Restart :
 *    - Pastille devient "⟳ Restarting..."
 *    - Dashboard se déconnecte
 *    - Serveur redémarre (console montre restart)
 *    - Dashboard se reconnecte automatiquement
 *    - Pastille devient verte "✓ vXXXX" (si code est à jour)
 *
 * 5. Vérifier que le serveur a bien redémarré :
 *    ```bash
 *    curl http://localhost:3070/api/version
 *    # serverStartTime doit être récent
 *    ```
 */
