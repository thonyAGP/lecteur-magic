import { apiClient } from "@/services/api/apiClient"
import type { ApiResponse } from "@/services/api/apiClient"
import type { 
  CheckConcurrencyParams, 
  CheckConcurrencyResult, 
  RegisterSessionParams, 
  ReleaseSessionParams, 
  ForceOpenSessionParams,
  CheckConcurrencyApiResponse,
  RegisterSessionApiResponse,
  ReleaseSessionApiResponse,
  ForceOpenSessionApiResponse
} from "@/types/sessionConcurrency"
import { useDataSourceStore } from "@/stores/dataSourceStore"

export const sessionConcurrencyService = {
  checkConcurrency: async (params: CheckConcurrencyParams): Promise<CheckConcurrencyResult> => {
    const isRealApi = useDataSourceStore.getState().isRealApi

    if (!isRealApi) {
      return {
        allowed: true
      }
    }

    const response: CheckConcurrencyApiResponse = await apiClient.get('/api/sessions/check-concurrency', { 
      params 
    })

    return response.data
  },

  registerSession: async (params: RegisterSessionParams): Promise<void> => {
    const isRealApi = useDataSourceStore.getState().isRealApi

    if (!isRealApi) {
      return
    }

    const response: RegisterSessionApiResponse = await apiClient.post('/api/sessions/register', params)
    
    if (!response.data.success) {
      throw new Error('Session registration failed')
    }
  },

  releaseSession: async (params: ReleaseSessionParams): Promise<void> => {
    const isRealApi = useDataSourceStore.getState().isRealApi

    if (!isRealApi) {
      return
    }

    const response: ReleaseSessionApiResponse = await apiClient.delete('/api/sessions/release', { 
      params 
    })

    if (!response.data.success) {
      throw new Error('Session release failed')
    }
  },

  forceOpenSession: async (params: ForceOpenSessionParams): Promise<void> => {
    const isRealApi = useDataSourceStore.getState().isRealApi

    if (!isRealApi) {
      return
    }

    const response: ForceOpenSessionApiResponse = await apiClient.post('/api/sessions/force-open', params)

    if (!response.data.success) {
      throw new Error('Force open session failed')
    }
  }
}