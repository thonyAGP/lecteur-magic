import { apiClient, type ApiResponse, type PaginatedResponse } from './apiClient';
import type {
  Session,
  OpenSessionRequest,
  SessionSummary,
  Transaction,
  CreateTransactionRequest,
  Denomination,
  SaveCountingRequest,
  Account,
  ExtraitCompte,
  PaginationParams,
} from './types';

// Session endpoints
export const sessionApi = {
  getCurrent: () =>
    apiClient.get<ApiResponse<Session>>('/sessions/current'),
  open: (data: OpenSessionRequest) =>
    apiClient.post<ApiResponse<Session>>('/sessions/open', data),
  close: (sessionId: number) =>
    apiClient.post<ApiResponse<void>>(`/sessions/${sessionId}/close`),
  getHistory: (params: PaginationParams) =>
    apiClient.get<PaginatedResponse<SessionSummary>>('/sessions/history', {
      params,
    }),
};

// Transaction endpoints
export const transactionApi = {
  create: (data: CreateTransactionRequest) =>
    apiClient.post<ApiResponse<Transaction>>('/transactions', data),
  getBySession: (sessionId: number) =>
    apiClient.get<ApiResponse<Transaction[]>>(
      `/sessions/${sessionId}/transactions`,
    ),
};

// Denomination endpoints
export const denominationApi = {
  getByDevise: (deviseCode: string) =>
    apiClient.get<ApiResponse<Denomination[]>>(
      `/denominations/${deviseCode}`,
    ),
  saveCounting: (data: SaveCountingRequest) =>
    apiClient.post<ApiResponse<void>>('/denominations/counting', data),
};

// Account endpoints
export const accountApi = {
  search: (query: string) =>
    apiClient.get<ApiResponse<Account[]>>('/accounts/search', {
      params: { q: query },
    }),
  getExtrait: (accountId: number) =>
    apiClient.get<ApiResponse<ExtraitCompte>>(
      `/accounts/${accountId}/extrait`,
    ),
};
