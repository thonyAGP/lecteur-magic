import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Integration Test: ETA displayed ONCE (not twice)
 *
 * Bug fix: ETA was displayed in 2 places:
 * - Timer elapsed (line 3005): "Elapsed: 2m 15s | ETA: ~3m"
 * - Progress bar label (line 3108/3110): "3/3 programmes (66%) | ETA: ~3m"
 *
 * Fix: Remove ETA from progress bar label (lines 3108, 3110)
 */

describe('Migration Modal - ETA Display (Single Instance)', () => {
  let sourceCode: string;

  beforeAll(() => {
    const htmlReportPath = path.resolve(__dirname, '../../src/dashboard/html-report.ts');
    sourceCode = readFileSync(htmlReportPath, 'utf-8');
  });

  it('should NOT append ETA to progress bar label (any case)', () => {
    // Critical test: Verify that label.textContent does NOT end with '+ eta'
    const noEtaSuffix = /label\.textContent = .*\(' \+ pct \+ '%\)' \+ eta;/;
    expect(sourceCode).not.toMatch(noEtaSuffix);

    // Verify both cases end with pct only
    const endsWithPct = /label\.textContent = .*\(' \+ pct \+ '%\)';/g;
    const matches = sourceCode.match(endsWithPct);
    expect(matches).toBeTruthy();
    expect(matches?.length).toBeGreaterThanOrEqual(2); // At least 2 instances (failed + normal)
  });

  it('should compute ETA in updateModuleProgress but not use it in label', () => {
    // Function should compute ETA (for potential future use or debugging)
    const computeEtaLine = /var eta = computeETA\(\);/;
    expect(sourceCode).toMatch(computeEtaLine);

    // But ETA should NOT be appended to label text
    const noEtaInLabel = /label\.textContent = done.*\+ pct \+ '%\)' \+ eta;/;
    expect(sourceCode).not.toMatch(noEtaInLabel);
  });

  it('should display ETA ONLY in elapsed timer (line 3005)', () => {
    // ETA should appear in elapsed text (top of modal)
    const etaInElapsed = /el\.textContent = 'Elapsed: ' \+ formatElapsed.*\+ computeETA\(\);/;
    expect(sourceCode).toMatch(etaInElapsed);
  });
});
