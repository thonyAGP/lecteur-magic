import type {
  ValidationStatus,
  MergeRequest,
  MergeHistory,
  MergeLog,
  Account,
} from "@/types/accountMerge";
import { apiClient } from "@/services/api/apiClient";
import type { ApiResponse } from "@/services/api/apiClient";

export const accountMergeApi = {
  validatePrerequisites(
    sourceAccountId?: number,
    targetAccountId?: number
  ): Promise<ApiResponse<ValidationStatus>> {
    return apiClient.post<ValidationStatus>(
      "/api/account-merge/validate",
      {
        sourceAccountId,
        targetAccountId,
      }
    );
  },

  loadAccounts(
    sourceAccountId: number,
    targetAccountId: number
  ): Promise<ApiResponse<{ source: Account; target: Account }>> {
    return apiClient.post(
      "/api/account-merge/load-accounts",
      {
        sourceAccountId,
        targetAccountId,
      }
    );
  },

  executeMerge(
    autoResume?: boolean,
    withoutInterface?: boolean
  ): Promise<ApiResponse<MergeRequest>> {
    const params: Record<string, unknown> = {};
    if (autoResume !== undefined) params.autoResume = autoResume;
    if (withoutInterface !== undefined) params.withoutInterface = withoutInterface;

    return apiClient.post<MergeRequest>(
      "/api/account-merge/execute",
      {},
      { params }
    );
  },

  saveMergeHistory(
    mergeId: number,
    operation: string,
    details?: string
  ): Promise<ApiResponse<void>> {
    return apiClient.post<void>(
      "/api/account-merge/history",
      {
        mergeId,
        operation,
        details,
      }
    );
  },

  writeMergeLogs(
    mergeId: number,
    tableName: string,
    recordCount: number,
    success: boolean
  ): Promise<ApiResponse<void>> {
    return apiClient.post<void>(
      "/api/account-merge/logs",
      {
        mergeId,
        tableName,
        recordCount,
        success,
      }
    );
  },

  cleanupTemporaryData(mergeId: number): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(
      `/api/account-merge/cleanup/${mergeId}`
    );
  },

  printMergeTicket(mergeId: number): Promise<ApiResponse<void>> {
    return apiClient.post<void>(
      `/api/account-merge/print/${mergeId}`,
      {}
    );
  },

  cancelMerge(): Promise<ApiResponse<void>> {
    return apiClient.delete<void>("/api/account-merge/cancel");
  },

  getMergeHistory(
    startDate?: Date,
    endDate?: Date,
    accountId?: number
  ): Promise<ApiResponse<MergeHistory[]>> {
    const params: Record<string, unknown> = {};
    if (startDate) params.startDate = startDate.toISOString();
    if (endDate) params.endDate = endDate.toISOString();
    if (accountId) params.accountId = accountId;

    return apiClient.get<MergeHistory[]>(
      "/api/account-merge/history",
      { params }
    );
  },

  getMergeLogs(mergeId: number): Promise<ApiResponse<MergeLog[]>> {
    return apiClient.get<MergeLog[]>(
      `/api/account-merge/logs/${mergeId}`
    );
  },
};