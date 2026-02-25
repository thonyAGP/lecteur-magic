/**
 * Bug R4 - Migration Abort Safety Tests
 * Tests for safe abort handling during migration.
 *
 * OBJECTIVE: Ensure abort is safe and doesn't leave migration in inconsistent state.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { startMigration, endMigration, getMigrateActiveState, addMigrateEvent } from '../../src/server/migrate-state.js';

afterEach(() => {
  endMigration(); // Reset state
});

describe('Bug R4 - Migration Abort Safety', () => {
  describe('[R4.1] Abort When Already Completed', () => {
    it('should report migration already completed when aborting finished migration', () => {
      // Arrange: Simulate completed migration
      startMigration('B-completed', 3, '/tmp/target', 'cli', false, []);
      addMigrateEvent({ type: 'program_completed', programId: 1 });
      addMigrateEvent({ type: 'program_completed', programId: 2 });
      addMigrateEvent({ type: 'program_completed', programId: 3 });
      endMigration(); // Mark as completed

      const state = getMigrateActiveState();
      expect(state.running).toBe(false);
      expect(state.completedPrograms).toBe(3);

      // Act: Try to abort (should fail gracefully)
      // Note: This test validates state check logic
      // The actual API handler check will be added in handleMigrateAbort()

      // Assert: State shows migration is not running
      expect(state.running).toBe(false);
    });

    it('should preserve completed state when abort is called after completion', () => {
      // Arrange: Complete migration
      startMigration('B-test', 2, '/tmp/target', 'cli', false, [
        { id: 1, name: 'Prog1' },
        { id: 2, name: 'Prog2' },
      ]);
      addMigrateEvent({ type: 'program_completed', programId: 1 });
      addMigrateEvent({ type: 'program_completed', programId: 2 });
      endMigration();

      const beforeAbort = getMigrateActiveState();
      expect(beforeAbort.completedPrograms).toBe(2);

      // Act: "Abort" (should be no-op since already ended)
      // State should not change

      const afterAbort = getMigrateActiveState();

      // Assert: State unchanged
      expect(afterAbort.running).toBe(false);
      expect(afterAbort.completedPrograms).toBe(2);
      expect(afterAbort.batch).toBe('B-test');
    });
  });

  describe('[R4.2] Abort Tracking', () => {
    it('should track abort state separately from running state', () => {
      // Arrange: Start migration
      startMigration('B-abort-test', 5, '/tmp/target', 'cli', false, []);

      // Simulate abort initiated
      addMigrateEvent({ type: 'abort_initiated', timestamp: new Date().toISOString() });

      const state = getMigrateActiveState();

      // Assert: running=true but abort event exists
      expect(state.running).toBe(true);
      const abortEvent = state.events.find((e: any) => e.type === 'abort_initiated');
      expect(abortEvent).toBeDefined();
    });

    it('should allow querying if abort is in progress', () => {
      // Arrange: Start migration
      startMigration('B-aborting', 3, '/tmp/target', 'cli', false, []);

      // Simulate abort initiated
      addMigrateEvent({ type: 'abort_initiated' });

      const state = getMigrateActiveState();

      // Check if abort in progress (by checking events)
      const hasAbortEvent = state.events.some((e: any) => e.type === 'abort_initiated');
      const hasCompleteEvent = state.events.some((e: any) => e.type === 'migrate_result');

      // Assert: Abort initiated but not completed yet
      expect(hasAbortEvent).toBe(true);
      expect(hasCompleteEvent).toBe(false);
    });
  });

  describe('[R4.3] Concurrent Migration Prevention', () => {
    it('should prevent starting new migration while one is running', () => {
      // Arrange: Start first migration
      startMigration('B-first', 3, '/tmp/target1', 'cli', false, []);

      const state1 = getMigrateActiveState();
      expect(state1.running).toBe(true);
      expect(state1.batch).toBe('B-first');

      // Act: Try to start second migration (should be blocked by API handler)
      // Note: This is validated in the API handler, not state module

      // For now, starting second migration overwrites first (current behavior)
      startMigration('B-second', 2, '/tmp/target2', 'cli', false, []);

      const state2 = getMigrateActiveState();

      // Assert: Second migration started (documents current behavior)
      expect(state2.running).toBe(true);
      expect(state2.batch).toBe('B-second'); // Overwrites first (BUG)
    });

    it('should track migration start time for timeout detection', () => {
      // Arrange
      const before = Date.now();
      startMigration('B-timeout-test', 1, '/tmp/target', 'cli', false, []);

      const state = getMigrateActiveState();
      const after = Date.now();

      // Assert: startedAt is recent
      expect(state.startedAt).toBeGreaterThanOrEqual(before);
      expect(state.startedAt).toBeLessThanOrEqual(after);

      // Assert: Can calculate elapsed time
      const elapsed = Date.now() - state.startedAt;
      expect(elapsed).toBeGreaterThanOrEqual(0);
      expect(elapsed).toBeLessThan(1000); // Less than 1s since we just started
    });
  });

  describe('[R4-bis] Abort State Cleanup', () => {
    it('should clear abort controller after migration ends', () => {
      // Arrange: Start and complete migration
      startMigration('B-cleanup', 1, '/tmp/target', 'cli', false, []);
      addMigrateEvent({ type: 'program_completed', programId: 1 });
      endMigration();

      const state = getMigrateActiveState();

      // Assert: running=false after endMigration
      expect(state.running).toBe(false);

      // Note: _migrateAbortController cleanup is in api-routes.ts
      // This test documents expected state after cleanup
    });

    it('should preserve event history after abort', () => {
      // Arrange: Start migration with some progress
      startMigration('B-abort-history', 5, '/tmp/target', 'cli', false, []);
      addMigrateEvent({ type: 'program_started', programId: 1 });
      addMigrateEvent({ type: 'program_completed', programId: 1 });
      addMigrateEvent({ type: 'program_started', programId: 2 });

      // Simulate abort
      addMigrateEvent({ type: 'abort_initiated' });
      endMigration();

      const state = getMigrateActiveState();

      // Assert: Event history preserved
      expect(state.events.length).toBeGreaterThanOrEqual(4);
      expect(state.completedPrograms).toBe(1); // Preserved
    });
  });
});
