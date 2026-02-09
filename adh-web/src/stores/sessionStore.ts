import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Session, SessionStatus, DeviseSession } from '@/types';

interface SessionStore {
  currentSession: Session | null;
  status: SessionStatus;
  setSession: (session: Session) => void;
  updateStatus: (status: SessionStatus) => void;
  updateDevise: (deviseCode: string, updates: Partial<DeviseSession>) => void;
  clearSession: () => void;
}

export const useSessionStore = create<SessionStore>()(
  persist(
    (set) => ({
      currentSession: null,
      status: 'closed',

      setSession: (session) =>
        set({ currentSession: session, status: session.status }),

      updateStatus: (status) =>
        set((state) => ({
          status,
          currentSession: state.currentSession
            ? { ...state.currentSession, status }
            : null,
        })),

      updateDevise: (deviseCode, updates) =>
        set((state) => {
          if (!state.currentSession) return state;
          return {
            currentSession: {
              ...state.currentSession,
              devises: state.currentSession.devises.map((d) =>
                d.deviseCode === deviseCode ? { ...d, ...updates } : d
              ),
            },
          };
        }),

      clearSession: () => set({ currentSession: null, status: 'closed' }),
    }),
    { name: 'adh-session' }
  )
);
