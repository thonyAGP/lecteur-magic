import type { ApiResponse } from "@/services/api/apiClient"

export interface Session {
  id: number
  societe: string
  caisse: string
  operateur: string
  dateOuverture: Date
  etat: string
  montantOuverture: number | null
}

export interface SessionFilter {
  existeSession: boolean
  existeSessionOuverte: boolean
  societe: string | null
  deviseLocale: string | null
}

export interface SessionListState {
  sessions: Session[]
  isLoading: boolean
  error: string | null
  filters: SessionFilter
}

export interface SessionListActions {
  fetchSessions: (filters: SessionFilter) => Promise<void>
  setFilters: (filters: Partial<SessionFilter>) => void
  clearError: () => void
}

export type SessionListStore = SessionListState & SessionListActions

export interface SessionListApiResponse extends ApiResponse<Session[]> {}

export interface SessionListRequest {
  societe?: string
  existeSession?: boolean
  existeSessionOuverte?: boolean
  deviseLocale?: string
}