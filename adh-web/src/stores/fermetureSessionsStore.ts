import { create } from "zustand"
import type { 
  FermetureSessionsState, 
  FermetureSessionsActions,
  Session,
  UnilateralBilateral,
  LoadSessionsResponse,
  UnilateralBilateralResponse,
  SessionCloseResponse,
  SessionValidationResponse,
  SESSION_STATUTS
} from "@/types/fermetureSessions"
import { useDataSourceStore } from "@/stores/dataSourceStore"
import { apiClient } from "@/services/api/apiClient"
import type { ApiResponse } from "@/services/api/apiClient"

const mockSessions: Session[] = [
  {
    id: 101,
    dateOuverture: new Date('2024-01-15T08:00:00'),
    dateFermeture: null,
    statut: 'O'
  },
  {
    id: 102,
    dateOuverture: new Date('2024-01-16T08:30:00'),
    dateFermeture: null,
    statut: 'O'
  },
  {
    id: 103,
    dateOuverture: new Date('2024-01-17T09:00:00'),
    dateFermeture: null,
    statut: 'O'
  },
  {
    id: 104,
    dateOuverture: new Date('2024-01-18T08:15:00'),
    dateFermeture: null,
    statut: 'O'
  },
  {
    id: 105,
    dateOuverture: new Date('2024-01-19T08:45:00'),
    dateFermeture: null,
    statut: 'O'
  }
]

const mockUnilateralBilateralTypes: UnilateralBilateral[] = [
  {
    code: 'UNI',
    libelle: 'Opération Unilatérale',
    type: 'UNILATERAL'
  },
  {
    code: 'BIL',
    libelle: 'Opération Bilatérale',
    type: 'BILATERAL'
  },
  {
    code: 'MIX',
    libelle: 'Opération Mixte',
    type: 'MIXED'
  }
]

export const useFermetureSessionsStore = create<FermetureSessionsState & FermetureSessionsActions>()((set, get) => ({
  sessions: [],
  currentSession: null,
  unilateralBilateralTypes: [],
  isLoading: false,
  error: null,
  isClosing: false,

  loadSessions: async () => {
    set({ isLoading: true, error: null })
    
    try {
      const isRealApi = useDataSourceStore.getState().isRealApi
      
      if (isRealApi) {
        const response = await apiClient.get<LoadSessionsResponse>('/api/fermeture-sessions/sessions?statut=O')
        
        if (response.success && response.data) {
          const sessions = response.data.map(session => ({
            ...session,
            dateOuverture: new Date(session.dateOuverture),
            dateFermeture: session.dateFermeture ? new Date(session.dateFermeture) : null
          }))
          set({ sessions, isLoading: false })
        } else {
          throw new Error('Erreur lors du chargement des sessions')
        }
      } else {
        await new Promise(resolve => setTimeout(resolve, 800))
        const openSessions = mockSessions.filter(session => session.statut === 'O')
        set({ sessions: openSessions, isLoading: false })
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Erreur inconnue lors du chargement des sessions'
      set({ error: errorMessage, isLoading: false })
    }
  },

  loadUnilateralBilateralTypes: async () => {
    set({ isLoading: true, error: null })
    
    try {
      const isRealApi = useDataSourceStore.getState().isRealApi
      
      if (isRealApi) {
        const response = await apiClient.get<UnilateralBilateralResponse>('/api/fermeture-sessions/types')
        
        if (response.success && response.data) {
          set({ unilateralBilateralTypes: response.data, isLoading: false })
        } else {
          throw new Error('Erreur lors du chargement des types unilatéral/bilatéral')
        }
      } else {
        await new Promise(resolve => setTimeout(resolve, 500))
        set({ unilateralBilateralTypes: mockUnilateralBilateralTypes, isLoading: false })
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Erreur inconnue lors du chargement des types'
      set({ error: errorMessage, isLoading: false })
    }
  },

  fermerSession: async (sessionId: number) => {
    set({ isClosing: true, error: null })
    
    try {
      const isValid = await get().validateSessionClosure(sessionId)
      if (!isValid) {
        throw new Error('La session ne peut pas être fermée')
      }

      const isRealApi = useDataSourceStore.getState().isRealApi
      
      if (isRealApi) {
        const response = await apiClient.post<ApiResponse<SessionCloseResponse>>(`/api/fermeture-sessions/close/${sessionId}`)
        
        if (response.success && response.data?.success) {
          const sessions = get().sessions.map(session =>
            session.id === sessionId
              ? { ...session, statut: 'C', dateFermeture: new Date() }
              : session
          )
          set({ sessions: sessions.filter(s => s.statut === 'O'), isClosing: false })
        } else {
          throw new Error('Erreur lors de la fermeture de la session')
        }
      } else {
        await new Promise(resolve => setTimeout(resolve, 1200))
        const sessions = get().sessions.map(session =>
          session.id === sessionId
            ? { ...session, statut: 'C', dateFermeture: new Date() }
            : session
        )
        set({ sessions: sessions.filter(s => s.statut === 'O'), isClosing: false })
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Erreur inconnue lors de la fermeture'
      set({ error: errorMessage, isClosing: false })
    }
  },

  generateClosureCode: (sessionId: number) => {
    const session = get().sessions.find(s => s.id === sessionId)
    if (!session) return ''

    const D = Math.floor(Math.random() * 10)
    const baseCode = 'N15'
    const decimalPart = D > 0 ? `.${D.toString().trim()}` : ''
    const suffix = 'CZ'
    
    return `${baseCode}${decimalPart}${suffix}`
  },

  validateSessionClosure: async (sessionId: number) => {
    try {
      const session = get().sessions.find(s => s.id === sessionId)
      if (!session || session.statut !== 'O') {
        return false
      }

      const isRealApi = useDataSourceStore.getState().isRealApi
      
      if (isRealApi) {
        const response = await apiClient.post<ApiResponse<SessionValidationResponse>>(`/api/fermeture-sessions/validate/${sessionId}`)
        return response.success && response.data?.valid === true
      } else {
        await new Promise(resolve => setTimeout(resolve, 300))
        return true
      }
    } catch (e) {
      return false
    }
  },

  reset: () => {
    set({
      sessions: [],
      currentSession: null,
      unilateralBilateralTypes: [],
      isLoading: false,
      error: null,
      isClosing: false
    })
  }
}))