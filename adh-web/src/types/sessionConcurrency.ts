import type { ApiResponse } from "@/services/api/apiClient"

// Entity Interface
export interface SessionConcurrency {
  societe: string
  compte: number
  filiation: number
  terminalId: string
  timestamp: Date
  codeCalcul: string | null
  coffreEnCoursComptage: boolean
}

// State Interface
export interface SessionConcurrencyState {
  activeSessions: SessionConcurrency[]
  isLoading: boolean
  error: string | null
  conflictDetected: boolean
  conflictingSession: SessionConcurrency | null
}

// Action Types
export type CheckConcurrencyResult = {
  allowed: boolean
  conflictingSession?: SessionConcurrency
}

export type CheckConcurrencyParams = {
  societe: string
  compte: number
  filiation: number
}

export type RegisterSessionParams = {
  societe: string
  compte: number
  filiation: number
  terminalId: string
  codeCalcul: 'C' | 'D'
}

export type ReleaseSessionParams = {
  societe: string
  compte: number
  filiation: number
  terminalId: string
}

export type ForceOpenSessionParams = {
  societe: string
  compte: number
  filiation: number
  terminalId: string
  reason: string
}

// API Response Types
export type CheckConcurrencyApiResponse = ApiResponse<CheckConcurrencyResult>
export type RegisterSessionApiResponse = ApiResponse<{ success: boolean }>
export type ReleaseSessionApiResponse = ApiResponse<{ success: boolean }>
export type ForceOpenSessionApiResponse = ApiResponse<{ success: boolean }>

// Action Signatures
export type SessionConcurrencyActions = {
  checkConcurrency: (params: CheckConcurrencyParams) => Promise<CheckConcurrencyResult>
  registerSession: (params: RegisterSessionParams) => Promise<void>
  releaseSession: (params: ReleaseSessionParams) => Promise<void>
  forceOpenSession: (params: ForceOpenSessionParams) => Promise<void>
}