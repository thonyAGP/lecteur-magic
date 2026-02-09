import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Session, SessionStatus, DeviseSession, SessionHistoryItem } from '@/types';
import { sessionApi } from '@/services/api/endpoints';
import type { OpenSessionRequest, CloseSessionRequest } from '@/services/api/types';

interface SessionStore {
  currentSession: Session | null;
  status: SessionStatus;
  history: SessionHistoryItem[];
  isLoadingHistory: boolean;
  setSession: (session: Session) => void;
  updateStatus: (status: SessionStatus) => void;
  updateDevise: (deviseCode: string, updates: Partial<DeviseSession>) => void;
  clearSession: () => void;
  openSession: (data: OpenSessionRequest) => Promise<Session>;
  closeSession: (data: CloseSessionRequest) => Promise<void>;
  loadHistory: (page?: number, pageSize?: number) => Promise<void>;
}

export const useSessionStore = create<SessionStore>()(
  persist(
    (set) => ({
      currentSession: null,
      status: 'closed',
      history: [],
      isLoadingHistory: false,

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

      openSession: async (data) => {
        set((state) => ({
          ...state,
          status: 'opening',
        }));
        try {
          const response = await sessionApi.open(data);
          const session: Session = {
            id: response.data.data.id,
            caisseId: response.data.data.caisseId,
            userId: response.data.data.userId,
            dateOuverture: response.data.data.dateOuverture,
            status: 'open',
            devises: [],
          };
          set({ currentSession: session, status: 'open' });
          return session;
        } catch (error) {
          set((state) => ({
            ...state,
            status: state.currentSession ? state.currentSession.status : 'closed',
          }));
          throw error;
        }
      },

      closeSession: async (data) => {
        set((state) => ({
          ...state,
          status: 'closing',
        }));
        try {
          await sessionApi.close(data);
          set({ currentSession: null, status: 'closed' });
        } catch (error) {
          set((state) => ({
            ...state,
            status: state.currentSession ? state.currentSession.status : 'closed',
          }));
          throw error;
        }
      },

      loadHistory: async (page = 1, pageSize = 20) => {
        set({ isLoadingHistory: true });
        try {
          const response = await sessionApi.getHistory({ page, pageSize });
          const items: SessionHistoryItem[] = response.data.items.map((s) => ({
            id: s.id,
            caisseId: 0,
            caisseNumero: '',
            userId: 0,
            userLogin: '',
            dateOuverture: s.dateOuverture,
            dateFermeture: s.dateFermeture,
            status: s.dateFermeture ? 'closed' as const : 'open' as const,
          }));
          set({ history: items });
        } finally {
          set({ isLoadingHistory: false });
        }
      },
    }),
    { name: 'adh-session' }
  )
);
