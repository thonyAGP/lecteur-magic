import { apiClient } from "@/services/api/apiClient"
import type { ApiResponse } from "@/services/api/apiClient"
import { useDataSourceStore } from "@/stores/dataSourceStore"
import type { 
  SessionOperation, 
  SessionSummary, 
  SessionOperationType, 
  LoadSessionHistoryRequest, 
  LoadSessionHistoryResponse,
  LoadSessionSummaryRequest,
  LoadSessionSummaryResponse
} from "@/types/sessionHistory"

export const sessionHistoryService = {
  getSessionHistory: async (
    params: {
      societe?: string
      startDate?: Date
      endDate?: Date
      status?: string
      operatorId?: string
    }
  ): Promise<ApiResponse<SessionOperation[]>> => {
    const { isRealApi } = useDataSourceStore.getState()

    if (!isRealApi) {
      return {
        success: true,
        data: [],
        message: "Mock session history"
      }
    }

    return apiClient.get('/api/caisse/sessions/history', {
      params: {
        ...params,
        startDate: params.startDate?.toISOString(),
        endDate: params.endDate?.toISOString()
      }
    })
  },

  getSessionDetails: async (
    sessionId: number
  ): Promise<ApiResponse<SessionSummary>> => {
    const { isRealApi } = useDataSourceStore.getState()

    if (!isRealApi) {
      return {
        success: true,
        data: {
          sessionId,
          operatorId: 'MOCK_OPERATOR',
          openedAt: new Date(),
          totalAmount: 0
        },
        message: "Mock session details"
      }
    }

    return apiClient.get(`/api/caisse/sessions/history/${sessionId}/details`)
  },

  getSessionCurrencies: async (
    sessionId: number
  ): Promise<ApiResponse<string[]>> => {
    const { isRealApi } = useDataSourceStore.getState()

    if (!isRealApi) {
      return {
        success: true,
        data: ['USD', 'EUR'],
        message: "Mock session currencies"
      }
    }

    return apiClient.get(`/api/caisse/sessions/history/${sessionId}/currencies`)
  }
}