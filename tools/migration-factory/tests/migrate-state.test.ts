import { describe, it, expect, beforeEach } from 'vitest';
import { getMigrateActiveState, startMigration, addMigrateEvent, endMigration } from '../src/server/migrate-state.js';

describe('migrate-state', () => {
  beforeEach(() => {
    // Reset state by starting then ending
    startMigration('reset', 0, '', '', false);
    endMigration();
  });

  it('should start with running=false', () => {
    const state = getMigrateActiveState();
    expect(state.running).toBe(false);
  });

  it('should track migration start', () => {
    startMigration('B1', 18, '/target', 'cli', false);
    const state = getMigrateActiveState();
    expect(state.running).toBe(true);
    expect(state.batch).toBe('B1');
    expect(state.totalPrograms).toBe(18);
    expect(state.targetDir).toBe('/target');
    expect(state.mode).toBe('cli');
    expect(state.dryRun).toBe(false);
    expect(state.startedAt).toBeGreaterThan(0);
    expect(state.events).toEqual([]);
  });

  it('should buffer events', () => {
    startMigration('B1', 5, '/t', 'cli', false);
    addMigrateEvent({ type: 'phase_started', phase: 'spec', message: 'Starting spec' });
    addMigrateEvent({ type: 'phase_completed', phase: 'spec', message: 'Done spec' });

    const state = getMigrateActiveState();
    expect(state.events).toHaveLength(2);
    expect((state.events[0] as Record<string, unknown>).type).toBe('phase_started');
  });

  it('should count completed programs', () => {
    startMigration('B1', 5, '/t', 'cli', false);
    addMigrateEvent({ type: 'program_completed', programId: '69' });
    addMigrateEvent({ type: 'program_completed', programId: '70' });
    addMigrateEvent({ type: 'program_failed', programId: '71' });

    const state = getMigrateActiveState();
    expect(state.completedPrograms).toBe(3);
  });

  it('should update totalPrograms from migrate_started event', () => {
    startMigration('B1', 0, '/t', 'cli', false);
    addMigrateEvent({ type: 'migrate_started', programs: 18 });

    const state = getMigrateActiveState();
    expect(state.totalPrograms).toBe(18);
  });

  it('should cap events at MAX_EVENTS (500)', () => {
    startMigration('B1', 5, '/t', 'cli', false);
    for (let i = 0; i < 510; i++) {
      addMigrateEvent({ type: 'log', index: i });
    }

    const state = getMigrateActiveState();
    expect(state.events).toHaveLength(500);
    // First 10 should have been evicted
    expect((state.events[0] as Record<string, unknown>).index).toBe(10);
  });

  it('should end migration', () => {
    startMigration('B1', 5, '/t', 'cli', false);
    addMigrateEvent({ type: 'log' });
    endMigration();

    const state = getMigrateActiveState();
    expect(state.running).toBe(false);
    expect(state.events).toHaveLength(1); // events preserved after end
  });

  it('should return a copy (not reference)', () => {
    startMigration('B1', 5, '/t', 'cli', false);
    addMigrateEvent({ type: 'log' });

    const state1 = getMigrateActiveState();
    addMigrateEvent({ type: 'log2' });
    const state2 = getMigrateActiveState();

    expect(state1.events).toHaveLength(1);
    expect(state2.events).toHaveLength(2);
  });
});
