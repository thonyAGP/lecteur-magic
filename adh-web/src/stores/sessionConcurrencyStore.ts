import { create } from "zustand"
import type {
  SessionConcurrencyState,
  SessionConcurrencyActions,
  CheckConcurrencyParams,
  CheckConcurrencyResult,
  RegisterSessionParams,
  ReleaseSessionParams,
  ForceOpenSessionParams,
  SessionConcurrency,
  CheckConcurrencyApiResponse,
  RegisterSessionApiResponse,
  ReleaseSessionApiResponse,
  ForceOpenSessionApiResponse
} from "@/types/sessionConcurrency"
import { useDataSourceStore } from "@/stores/dataSourceStore"
import { apiClient } from "@/services/api/apiClient"

const mockSessions: SessionConcurrency[] = [
  {
    societe: "ADH001",
    compte: 12345,
    filiation: 1,
    terminalId: "T01",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    codeCalcul: "C",
    coffreEnCoursComptage: false
  },
  {
    societe: "ADH001", 
    compte: 67890,
    filiation: 1,
    terminalId: "T02",
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    codeCalcul: "D",
    coffreEnCoursComptage: true
  },
  {
    societe: "ADH002",
    compte: 11111,
    filiation: 2,
    terminalId: "T03",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    codeCalcul: null,
    coffreEnCoursComptage: false
  }
]

type SessionConcurrencyStore = SessionConcurrencyState & SessionConcurrencyActions & {
  reset: () => void
}

export const useSessionConcurrencyStore = create<SessionConcurrencyStore>((set, get) => ({
  activeSessions: [],
  isLoading: false,
  error: null,
  conflictDetected: false,
  conflictingSession: null,

  checkConcurrency: async (params: CheckConcurrencyParams): Promise<CheckConcurrencyResult> => {
    set({ isLoading: true, error: null })

    try {
      const isRealApi = useDataSourceStore.getState().isRealApi

      if (isRealApi) {
        const response = await apiClient.get<CheckConcurrencyApiResponse>(
          `/api/sessions/check-concurrency?societe=${params.societe}&compte=${params.compte}&filiation=${params.filiation}`
        )

        if (response.data.success && response.data.data) {
          const result = response.data.data
          set({
            conflictDetected: !result.allowed,
            conflictingSession: result.conflictingSession || null,
            isLoading: false
          })
          return result
        }

        throw new Error(response.data.message || "Failed to check concurrency")
      } else {
        const conflictingSession = mockSessions.find(session =>
          session.societe === params.societe &&
          session.compte === params.compte &&
          session.filiation === params.filiation
        )

        const coffreEnCoursComptage = conflictingSession?.coffreEnCoursComptage || false
        const allowed = !conflictingSession || (!coffreEnCoursComptage && conflictingSession.codeCalcul !== 'C' && conflictingSession.codeCalcul !== 'D')

        const result: CheckConcurrencyResult = {
          allowed,
          conflictingSession: allowed ? undefined : conflictingSession
        }

        set({
          conflictDetected: !allowed,
          conflictingSession: allowed ? null : conflictingSession,
          isLoading: false
        })

        return result
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  registerSession: async (params: RegisterSessionParams): Promise<void> => {
    set({ isLoading: true, error: null })

    try {
      const isRealApi = useDataSourceStore.getState().isRealApi

      if (isRealApi) {
        const response = await apiClient.post<RegisterSessionApiResponse>("/api/sessions/register", {
          societe: params.societe,
          compte: params.compte,
          filiation: params.filiation,
          terminalId: params.terminalId,
          codeCalcul: params.codeCalcul
        })

        if (!response.data.success) {
          throw new Error(response.data.message || "Failed to register session")
        }
      } else {
        const newSession: SessionConcurrency = {
          societe: params.societe,
          compte: params.compte,
          filiation: params.filiation,
          terminalId: params.terminalId,
          timestamp: new Date(),
          codeCalcul: params.codeCalcul,
          coffreEnCoursComptage: false
        }

        const existingIndex = mockSessions.findIndex(session =>
          session.societe === params.societe &&
          session.compte === params.compte &&
          session.filiation === params.filiation
        )

        if (existingIndex >= 0) {
          mockSessions[existingIndex] = newSession
        } else {
          mockSessions.push(newSession)
        }

        set({ activeSessions: [...mockSessions] })
      }

      set({ isLoading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  releaseSession: async (params: ReleaseSessionParams): Promise<void> => {
    set({ isLoading: true, error: null })

    try {
      const isRealApi = useDataSourceStore.getState().isRealApi

      if (isRealApi) {
        const response = await apiClient.delete<ReleaseSessionApiResponse>(
          `/api/sessions/release?societe=${params.societe}&compte=${params.compte}&filiation=${params.filiation}&terminalId=${params.terminalId}`
        )

        if (!response.data.success) {
          throw new Error(response.data.message || "Failed to release session")
        }
      } else {
        const sessionIndex = mockSessions.findIndex(session =>
          session.societe === params.societe &&
          session.compte === params.compte &&
          session.filiation === params.filiation &&
          session.terminalId === params.terminalId
        )

        if (sessionIndex >= 0) {
          mockSessions.splice(sessionIndex, 1)
          set({ activeSessions: [...mockSessions] })
        }
      }

      set({
        isLoading: false,
        conflictDetected: false,
        conflictingSession: null
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  forceOpenSession: async (params: ForceOpenSessionParams): Promise<void> => {
    set({ isLoading: true, error: null })

    try {
      const isRealApi = useDataSourceStore.getState().isRealApi

      if (isRealApi) {
        const response = await apiClient.post<ForceOpenSessionApiResponse>("/api/sessions/force-open", {
          societe: params.societe,
          compte: params.compte,
          filiation: params.filiation,
          terminalId: params.terminalId,
          reason: params.reason
        })

        if (!response.data.success) {
          throw new Error(response.data.message || "Failed to force open session")
        }
      } else {
        const existingIndex = mockSessions.findIndex(session =>
          session.societe === params.societe &&
          session.compte === params.compte &&
          session.filiation === params.filiation
        )

        const newSession: SessionConcurrency = {
          societe: params.societe,
          compte: params.compte,
          filiation: params.filiation,
          terminalId: params.terminalId,
          timestamp: new Date(),
          codeCalcul: null,
          coffreEnCoursComptage: false
        }

        if (existingIndex >= 0) {
          mockSessions[existingIndex] = newSession
        } else {
          mockSessions.push(newSession)
        }

        set({ activeSessions: [...mockSessions] })
      }

      set({
        isLoading: false,
        conflictDetected: false,
        conflictingSession: null
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  reset: () => {
    set({
      activeSessions: [],
      isLoading: false,
      error: null,
      conflictDetected: false,
      conflictingSession: null
    })
  }
}))