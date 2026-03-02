import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Integration Test: Program completion count correct (no duplicate counting)
 *
 * Bug fix: doneProgs was incremented every time program_completed event arrived,
 * even if the program was already counted. This caused "9/3 programmes (91%)"
 * instead of "3/3 programmes (100%)".
 *
 * Fix: Check programPhases[pid].status !== 'done' BEFORE incrementing doneProgs
 */

describe('Migration Modal - Program Count', () => {
  let sourceCode: string;

  beforeAll(() => {
    const htmlReportPath = path.resolve(__dirname, '../../src/dashboard/html-report.ts');
    sourceCode = readFileSync(htmlReportPath, 'utf-8');
  });

  it('should check status before incrementing doneProgs', () => {
    // Verify that doneProgs++ is guarded by a status check
    const countCheck = /if\s*\(migrateState\.programPhases\[pid\]\.status\s*!==\s*'done'\)\s*\{[\s\S]{1,50}migrateState\.doneProgs\+\+;/;
    expect(sourceCode).toMatch(countCheck);
  });

  it('should NOT increment doneProgs unconditionally', () => {
    // OLD BAD PATTERN: migrateState.doneProgs++ without any guard
    // Should NOT appear after updateProgramIcon (old location)
    const unconditionalIncrement = /updateProgramIcon\(pid, 'done'\);[\s\S]{1,100}migrateState\.doneProgs\+\+;[\s\S]{1,100}if\s*\(migrateState\.estimatedDurationMs/;
    expect(sourceCode).not.toMatch(unconditionalIncrement);
  });

  it('should increment BEFORE setting status to done', () => {
    // The increment should happen BEFORE status = 'done'
    // We verify this by checking the increment is inside the if(status !== 'done') block
    // which comes BEFORE the status assignment
    const incrementPattern = /if\s*\(migrateState\.programPhases\[pid\]\.status\s*!==\s*'done'\)\s*\{[\s\S]{1,50}migrateState\.doneProgs\+\+;/;
    const statusAssignment = /migrateState\.programPhases\[pid\]\.status\s*=\s*'done';/;

    expect(sourceCode).toMatch(incrementPattern);
    expect(sourceCode).toMatch(statusAssignment);

    // The increment (with guard) should appear before any status = 'done' assignment in the handler
    const incrementIndex = sourceCode.search(incrementPattern);
    const statusIndex = sourceCode.search(statusAssignment);

    expect(incrementIndex).toBeGreaterThan(0);
    expect(statusIndex).toBeGreaterThan(incrementIndex);
  });

  it('should have comment about checking status', () => {
    // Comment confirms the fix
    const hasComment = /Increment doneProgs ONLY if not already counted/;
    expect(sourceCode).toMatch(hasComment);
  });
});
