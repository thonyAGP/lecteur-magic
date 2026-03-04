import type { ApiResponse } from "@/services/api/apiClient"

export interface HistoFusionSeparationSaisie {
  chronoEF: number
  societe: string
  compteReference: number
  filiationReference: number
  comptePointeOld: number
  filiationPointeOld: number
}

export interface HistoFusionSeparationCriteria {
  chronoEF?: number
  societe?: string
  compteReference?: number
  filiationReference?: number
}

export interface DeletionResult {
  recordsDeleted: number
  success: boolean
  timestamp: string
}

export interface HistoryCleanupState {
  isLoading: boolean
  error: string | null
  deletionCriteria: HistoFusionSeparationCriteria | null
  deletionResult: DeletionResult | null
}

export interface HistoryCleanupActions {
  deleteHistoFusionSeparationSaisie: (
    criteria: HistoFusionSeparationCriteria
  ) => Promise<DeletionResult>

  validateDeletionCriteria: (
    criteria: HistoFusionSeparationCriteria
  ) => Promise<boolean>
}

export type DeleteHistoFusionSeparationSaisieRequest = {
  criteria: HistoFusionSeparationCriteria
}

export type DeleteHistoFusionSeparationSaisieResponse = ApiResponse<DeletionResult>