import { apiClient } from "@/services/api/apiClient"
import type { ApiResponse } from "@/services/api/apiClient"
import { useDataSourceStore } from "@/stores/dataSourceStore"
import type { 
  FusionSeparationHistoryEntry, 
  FusionSeparationHistoryGetResponse,
  FusionSeparationHistoryWriteRequest 
} from "@/types/fusionSeparationHistory"

export const fusionSeparationHistoryService = {
  writeEntry: async (entry: FusionSeparationHistoryEntry): Promise<void> => {
    const isRealApi = useDataSourceStore.getState().isRealApi

    if (isRealApi) {
      const request: FusionSeparationHistoryWriteRequest = { entry }
      await apiClient.post("/api/fusion-separation-history/entries", request)
    }
  },

  getEntries: async (params: {
    societe?: string
    compteReference?: number
    typeEF?: string
  }): Promise<FusionSeparationHistoryGetResponse> => {
    const isRealApi = useDataSourceStore.getState().isRealApi

    if (isRealApi) {
      return await apiClient.get("/api/fusion-separation-history/entries", { params })
    }

    return []
  }
}