import { apiClient } from "@/services/api/apiClient"
import type { ApiResponse } from "@/services/api/apiClient"
import type { 
  DeleteHistoFusionSeparationSaisieRequest, 
  DeleteHistoFusionSeparationSaisieResponse,
  HistoFusionSeparationCriteria,
  DeletionResult
} from "@/types/historyCleanup"

export const historyCleanupService = {
  deleteHistoFusionSeparationSaisie: async (
    criteria: HistoFusionSeparationCriteria
  ): Promise<DeletionResult> => {
    const queryParams = new URLSearchParams()

    if (criteria.chronoEF) queryParams.append('chronoEF', criteria.chronoEF.toString())
    if (criteria.societe) queryParams.append('societe', criteria.societe)
    if (criteria.compteReference) queryParams.append('compteReference', criteria.compteReference.toString())
    if (criteria.filiationReference) queryParams.append('filiationReference', criteria.filiationReference.toString())

    const response: DeleteHistoFusionSeparationSaisieResponse = await apiClient.delete(
      `/api/historyCleanup/fusionSeparationSaisie?${queryParams.toString()}`
    )

    return response.data
  },

  validateDeletionCriteria: async (
    criteria: HistoFusionSeparationCriteria
  ): Promise<boolean> => {
    return Object.values(criteria).some(value => value !== undefined && value !== null)
  }
}