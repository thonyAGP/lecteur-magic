import { defineConfig, devices } from '@playwright/test';

const E2E_PORT = 3099;

export default defineConfig({
  globalSetup: './tests/e2e/global-setup.ts',
  testDir: './tests/e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  timeout: 60_000,
  expect: { timeout: 10_000 },

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],

  use: {
    baseURL: `http://localhost:${E2E_PORT}`,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: /version-badge|restart-button|modal-bugs-validation|phase1-final-proof|migrate-proof|migrate-modal-(ui|visual)|batch-card-sync/,
    },
    {
      name: 'real-server',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:3070',
      },
      testMatch: /version-badge|restart-button|modal-bugs-validation|phase1-final-proof|migrate-proof|migrate-modal-(ui|visual)|batch-card-sync/,
    },
  ],

  webServer: [
    {
      command: process.env.AWS_BEARER_TOKEN_BEDROCK
        ? `npx tsx src/cli.ts serve --port ${E2E_PORT} --project ./tests/e2e/fixtures`
        : `node --env-file=../../.env.clubmed.local node_modules/tsx/dist/cli.mjs src/cli.ts serve --port ${E2E_PORT} --project ./tests/e2e/fixtures`,
      port: E2E_PORT,
      timeout: 15_000,
      reuseExistingServer: !process.env.CI,
      env: {
        NODE_ENV: 'test',
        // Pass credentials from parent if available
        ...(process.env.AWS_BEARER_TOKEN_BEDROCK ? {
          AWS_BEARER_TOKEN_BEDROCK: process.env.AWS_BEARER_TOKEN_BEDROCK,
          AWS_REGION: process.env.AWS_REGION,
        } : {}),
      },
    },
    {
      command: `npx tsx src/cli.ts serve --port 3070 --project ../../`,
      port: 3070,
      timeout: 120_000, // 2 minutes - real project takes longer to index
      reuseExistingServer: !process.env.CI,
      env: { NODE_ENV: 'test' },
    },
  ],
});
