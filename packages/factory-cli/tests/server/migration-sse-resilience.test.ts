/**
 * BLOC B1 - Migration SSE Resilience
 * Tests for SSE streaming robustness and state management.
 *
 * OBJECTIVE: Ensure dashboard can monitor migration in real-time reliably.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { startMigration, addMigrateEvent, endMigration, getMigrateActiveState } from '../../src/server/migrate-state.js';

afterEach(() => {
  endMigration(); // Reset migration state
});

describe('BLOC B1 - Migration SSE Resilience', () => {
  describe('Event Buffering', () => {
    it('should buffer last 500 events in memory', () => {
      // Arrange: Start migration with many events
      startMigration('B-buffer', 1000, '/tmp/target', 'cli', false, []);

      // Act: Add 600 events (exceeds MAX_EVENTS=500)
      for (let i = 0; i < 600; i++) {
        addMigrateEvent({ type: 'progress', index: i, message: `Event ${i}` });
      }

      // Assert: Only last 500 events are kept (FIFO eviction)
      const state = getMigrateActiveState();
      expect(state.events.length).toBe(500);

      // First event should be index 100 (0-99 were evicted)
      const firstEvent = state.events[0] as { index: number };
      expect(firstEvent.index).toBe(100);

      // Last event should be index 599
      const lastEvent = state.events[state.events.length - 1] as { index: number };
      expect(lastEvent.index).toBe(599);
    });

    it('should include event type and programId in buffer', () => {
      // Arrange
      startMigration('B-metadata', 3, '/tmp/target', 'cli', false, []);

      // Act: Add events with different types and programIds
      addMigrateEvent({ type: 'program_started', programId: 100, phase: 'SPEC' });
      addMigrateEvent({ type: 'phase_completed', programId: 100, phase: 'SPEC' });
      addMigrateEvent({ type: 'program_completed', programId: 100, tokens: { input: 1000, output: 500 } });

      // Assert: Events are preserved with metadata
      const state = getMigrateActiveState();
      expect(state.events.length).toBe(3);

      const event1 = state.events[0] as { type: string; programId: number; phase: string };
      expect(event1.type).toBe('program_started');
      expect(event1.programId).toBe(100);
      expect(event1.phase).toBe('SPEC');

      const event3 = state.events[2] as { type: string; tokens: { input: number; output: number } };
      expect(event3.type).toBe('program_completed');
      expect(event3.tokens.input).toBe(1000);
    });
  });

  describe('State Counters', () => {
    it('should increment completedPrograms on program_completed event', () => {
      // Arrange
      startMigration('B-completed', 5, '/tmp/target', 'cli', false, []);

      // Act: Complete 3 programs
      addMigrateEvent({ type: 'program_completed', programId: 1 });
      addMigrateEvent({ type: 'program_completed', programId: 2 });
      addMigrateEvent({ type: 'program_completed', programId: 3 });

      // Assert: Counter incremented correctly
      const state = getMigrateActiveState();
      expect(state.completedPrograms).toBe(3);
      expect(state.totalPrograms).toBe(5);
    });

    it('should increment failedPrograms on program_failed event', () => {
      // Arrange
      startMigration('B-failed', 4, '/tmp/target', 'cli', false, []);

      // Act: 2 successes, 2 failures
      addMigrateEvent({ type: 'program_completed', programId: 1 });
      addMigrateEvent({ type: 'program_failed', programId: 2, error: 'Phase timeout' });
      addMigrateEvent({ type: 'program_completed', programId: 3 });
      addMigrateEvent({ type: 'program_failed', programId: 4, error: 'Contract missing' });

      // Assert: Counters track both successes and failures
      const state = getMigrateActiveState();
      expect(state.completedPrograms).toBe(2);
      expect(state.failedPrograms).toBe(2);
    });
  });

  describe('Client Reconnection', () => {
    it('should return buffered events when client reconnects', () => {
      // Arrange: Simulate migration in progress with accumulated events
      startMigration('B-reconnect', 10, '/tmp/target', 'cli', false, [
        { id: 100, name: 'Program 100' },
        { id: 101, name: 'Program 101' },
      ]);

      // Simulate progress (as if SSE was disconnected)
      for (let i = 0; i < 20; i++) {
        addMigrateEvent({ type: 'progress_update', step: i });
      }
      addMigrateEvent({ type: 'program_completed', programId: 100 });
      addMigrateEvent({ type: 'program_started', programId: 101 });

      // Act: Client reconnects via GET /api/migrate/active
      const state = getMigrateActiveState();

      // Assert: Full state is recoverable
      expect(state.running).toBe(true);
      expect(state.batch).toBe('B-reconnect');
      expect(state.completedPrograms).toBe(1);
      expect(state.events.length).toBe(22); // 20 progress + 2 program events
      expect(state.programList.length).toBe(2);

      // Assert: Program metadata is preserved
      expect(state.programList[0].id).toBe(100);
      expect(state.programList[0].name).toBe('Program 100');
    });
  });
});
