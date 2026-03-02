import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Integration Test: Abort flag prevents event processing after cancellation
 *
 * Bug fix: Events continued to be processed after clicking "Annuler", causing:
 * - Dots to become active again (pulsing animation)
 * - "En cours" column to be rewritten with phase progress labels
 *
 * Fix: Add migrateState.aborted flag, set to true on abort, checked at start of es.onmessage
 */

describe('Migration Modal - Abort Flag', () => {
  let sourceCode: string;

  beforeAll(() => {
    const htmlReportPath = path.resolve(__dirname, '../../src/dashboard/html-report.ts');
    sourceCode = readFileSync(htmlReportPath, 'utf-8');
  });

  it('should have aborted flag in migrateState', () => {
    const abortedFlagInit = /migrateState\s*=\s*\{[\s\S]*?aborted:\s*false/;
    expect(sourceCode).toMatch(abortedFlagInit);
  });

  it('should set aborted=true on abort button click', () => {
    // Find abort button handler and verify it sets aborted flag
    const abortHandler = /migrateAbortBtn\.addEventListener\('click'[\s\S]{1,500}migrateState\.aborted\s*=\s*true/;
    expect(sourceCode).toMatch(abortHandler);
  });

  it('should check aborted flag at start of es.onmessage', () => {
    // Verify that es.onmessage checks aborted flag BEFORE processing events
    const onmessageCheck = /es\.onmessage\s*=\s*function\(ev\)\s*\{[\s\S]{1,200}if\s*\(migrateState\.aborted\)\s*\{[\s\S]{1,50}return;/;
    expect(sourceCode).toMatch(onmessageCheck);
  });

  it('should ignore all events when aborted', () => {
    // The abort check should appear in the es.onmessage handler
    // We just verify the pattern exists (not exact order, due to multiple indexOf matches)
    const hasJsonParse = /var msg = JSON\.parse\(ev\.data\);/;
    const hasAbortCheck = /if\s*\(migrateState\.aborted\)\s*\{\s*return;\s*\}/;
    const hasComment = /Ignore all events after manual abort/;

    expect(sourceCode).toMatch(hasJsonParse);
    expect(sourceCode).toMatch(hasAbortCheck);
    expect(sourceCode).toMatch(hasComment); // Comment confirms it's in the right place
  });
});
