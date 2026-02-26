import type { ApiResponse } from "@/services/api/apiClient"

export const SESSION_STATUTS = {
  OPEN: 'O',
  CLOSED: 'C'
} as const

export interface Session {
  id: number
  dateOuverture: Date
  dateFermeture: Date | null
  statut: string
}

export interface UnilateralBilateral {
  code: string
  libelle: string
  type: string
}

export interface FermetureSessionsState {
  sessions: Session[]
  currentSession: Session | null
  unilateralBilateralTypes: UnilateralBilateral[]
  isLoading: boolean
  error: string | null
  isClosing: boolean
}

export type LoadSessionsResponse = ApiResponse<Session[]>
export type UnilateralBilateralResponse = ApiResponse<UnilateralBilateral[]>

export interface SessionCloseResponse {
  success: boolean
  closureCode: string
}

export interface SessionValidationResponse {
  valid: boolean
  errors: string[]
}

export type FermetureSessionsActions = {
  loadSessions: () => Promise<void>
  loadUnilateralBilateralTypes: () => Promise<void>
  fermerSession: (sessionId: number) => Promise<void>
  generateClosureCode: (sessionId: number) => string
  validateSessionClosure: (sessionId: number) => Promise<boolean>
}

export type SessionSelectionPayload = {
  sessionId: number
}