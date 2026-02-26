import type { ApiResponse } from "@/services/api/apiClient"

export const sessionOperationTypes = [
  "SALE",
  "PAYMENT",
  "REFUND",
  "ADJUSTMENT",
  "TRANSFER"
] as const

export type SessionOperationType = typeof sessionOperationTypes[number]

export interface SessionOperation {
  id: number
  sessionId: number
  timestamp: Date
  operationType: SessionOperationType
  accountId?: number
  accountName?: string
  amount: number
  currency: string
  description?: string
}

export interface SessionSummary {
  sessionId: number
  operatorId: string
  openedAt: Date
  closedAt?: Date
  totalAmount: number
}

export interface SessionHistoryState {
  operations: SessionOperation[]
  sessionSummary: SessionSummary | null
  isLoading: boolean
  error: string | null
  filters: {
    startDate?: Date
    endDate?: Date
    operationType?: SessionOperationType
  }
  sortOrder: 'asc' | 'desc'
  localCurrency: string
  amountMask: string
}

export type LoadSessionHistoryRequest = {
  sessionId: number
  startDate?: Date
  endDate?: Date
  operationType?: SessionOperationType
}

export type LoadSessionHistoryResponse = ApiResponse<SessionOperation[]>

export type LoadSessionSummaryRequest = {
  sessionId: number
}

export type LoadSessionSummaryResponse = ApiResponse<SessionSummary>

export type ExportSessionHistoryRequest = {
  sessionId: number
  format?: 'csv' | 'xlsx'
}

export type SessionHistoryActions = {
  loadSessionHistory: (params: LoadSessionHistoryRequest) => Promise<void>
  loadSessionSummary: (params: LoadSessionSummaryRequest) => Promise<void>
  applyFilters: (filters: SessionHistoryState['filters']) => Promise<void>
  toggleSortOrder: () => void
  exportToCSV: () => Promise<void>
}