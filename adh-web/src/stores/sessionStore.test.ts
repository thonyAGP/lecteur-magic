import { describe, it, expect, beforeEach } from 'vitest';
import { useSessionStore } from './sessionStore';
import type { Session } from '@/types';

const mockSession: Session = {
  id: 1,
  caisseId: 10,
  userId: 42,
  dateOuverture: '2026-02-09T08:00:00Z',
  status: 'open',
  devises: [
    { deviseCode: 'EUR', fondCaisse: 500, totalVentes: 0, totalEncaissements: 0 },
    { deviseCode: 'USD', fondCaisse: 200, totalVentes: 0, totalEncaissements: 0 },
  ],
};

describe('useSessionStore', () => {
  beforeEach(() => {
    useSessionStore.setState({
      currentSession: null,
      status: 'closed',
    });
  });

  it('should start with no session and closed status', () => {
    const state = useSessionStore.getState();
    expect(state.currentSession).toBeNull();
    expect(state.status).toBe('closed');
  });

  it('should set session and sync status when setSession is called', () => {
    useSessionStore.getState().setSession(mockSession);

    const state = useSessionStore.getState();
    expect(state.currentSession).toEqual(mockSession);
    expect(state.status).toBe('open');
  });

  it('should update status on session and store when updateStatus is called', () => {
    useSessionStore.getState().setSession(mockSession);
    useSessionStore.getState().updateStatus('closing');

    const state = useSessionStore.getState();
    expect(state.status).toBe('closing');
    expect(state.currentSession?.status).toBe('closing');
  });

  it('should not crash when updateStatus is called with no session', () => {
    useSessionStore.getState().updateStatus('opening');

    const state = useSessionStore.getState();
    expect(state.status).toBe('opening');
    expect(state.currentSession).toBeNull();
  });

  it('should update a specific devise when updateDevise is called', () => {
    useSessionStore.getState().setSession(mockSession);
    useSessionStore.getState().updateDevise('EUR', { totalVentes: 1500 });

    const state = useSessionStore.getState();
    const eur = state.currentSession?.devises.find((d) => d.deviseCode === 'EUR');
    expect(eur?.totalVentes).toBe(1500);
    expect(eur?.fondCaisse).toBe(500);
  });

  it('should not modify other devises when updateDevise targets one', () => {
    useSessionStore.getState().setSession(mockSession);
    useSessionStore.getState().updateDevise('EUR', { totalVentes: 999 });

    const state = useSessionStore.getState();
    const usd = state.currentSession?.devises.find((d) => d.deviseCode === 'USD');
    expect(usd?.totalVentes).toBe(0);
  });

  it('should do nothing when updateDevise is called with no session', () => {
    useSessionStore.getState().updateDevise('EUR', { totalVentes: 100 });

    const state = useSessionStore.getState();
    expect(state.currentSession).toBeNull();
  });

  it('should clear session and reset status when clearSession is called', () => {
    useSessionStore.getState().setSession(mockSession);
    useSessionStore.getState().clearSession();

    const state = useSessionStore.getState();
    expect(state.currentSession).toBeNull();
    expect(state.status).toBe('closed');
  });
});
