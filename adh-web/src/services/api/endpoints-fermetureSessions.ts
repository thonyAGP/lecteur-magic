import { apiClient } from "@/services/api/apiClient"
import type { ApiResponse } from "@/services/api/apiClient"
import type { 
  Session, 
  UnilateralBilateral, 
  SessionCloseResponse, 
  SessionValidationResponse, 
  LoadSessionsResponse, 
  UnilateralBilateralResponse 
} from "@/types/fermetureSessions"
import { useDataSourceStore } from "@/stores/dataSourceStore"

export const fermetureSessionsService = {
  getSessions: async (statut?: string): Promise<LoadSessionsResponse> => {
    const { isRealApi } = useDataSourceStore.getState()
    
    if (isRealApi) {
      return await apiClient.get('/api/fermeture-sessions/sessions', { 
        params: { statut } 
      })
    }

    // Mocked data for development
    return {
      data: [
        { 
          id: 1, 
          dateOuverture: new Date(), 
          dateFermeture: null, 
          statut: 'O' 
        }
      ],
      status: 200
    }
  },

  getUnilateralBilateralTypes: async (): Promise<UnilateralBilateralResponse> => {
    const { isRealApi } = useDataSourceStore.getState()
    
    if (isRealApi) {
      return await apiClient.get('/api/fermeture-sessions/types')
    }

    // Mocked data for development
    return {
      data: [
        { 
          code: 'UNI', 
          libelle: 'Unilatéral', 
          type: 'U' 
        },
        { 
          code: 'BI', 
          libelle: 'Bilatéral', 
          type: 'B' 
        }
      ],
      status: 200
    }
  },

  closeSession: async (sessionId: number): Promise<SessionCloseResponse> => {
    const { isRealApi } = useDataSourceStore.getState()
    
    if (isRealApi) {
      return await apiClient.post(`/api/fermeture-sessions/close/${sessionId}`)
    }

    // Mocked data for development
    return {
      success: true,
      closureCode: `CLOSE-${sessionId}-${new Date().getTime()}`
    }
  },

  validateSessionClosure: async (sessionId: number): Promise<SessionValidationResponse> => {
    const { isRealApi } = useDataSourceStore.getState()
    
    if (isRealApi) {
      return await apiClient.post(`/api/fermeture-sessions/validate/${sessionId}`)
    }

    // Mocked data for development
    return {
      valid: true,
      errors: []
    }
  }
}