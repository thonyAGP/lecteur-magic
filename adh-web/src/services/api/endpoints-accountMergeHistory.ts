import { apiClient, type ApiResponse } from "@/services/api/apiClient";
import { useDataSourceStore } from "@/stores/dataSourceStore";
import type { CreateHistoryEntryRequest, FusionSeparationHistoryEntry } from "@/types/accountMergeHistory";
import { mockHistoryEntries } from "@/types/accountMergeHistory";

const BASE_PATH = "/api/account-merge/history";

export const createHistoryEntry = async (
  entry: CreateHistoryEntryRequest
): Promise<FusionSeparationHistoryEntry> => {
  const isRealApi = useDataSourceStore.getState().isRealApi;

  if (!isRealApi) {
    const newEntry: FusionSeparationHistoryEntry = {
      chronoId: Math.max(...mockHistoryEntries.map((e) => e.chronoId), 0) + 1,
      ...entry,
      fullName: `${entry.lastName} ${entry.firstName}`.trim(),
      timestamp: new Date(),
    };
    return newEntry;
  }

  const response = await apiClient.post<ApiResponse<FusionSeparationHistoryEntry>>(
    BASE_PATH,
    entry
  );

  if (!response.success) {
    throw new Error(response.message || "Failed to create history entry");
  }

  return response.data;
};

export const getHistoryByAccount = async (
  accountNumber: number,
  filiationNumber?: number
): Promise<FusionSeparationHistoryEntry[]> => {
  const isRealApi = useDataSourceStore.getState().isRealApi;

  const params = new URLSearchParams();
  params.append("accountNumber", String(accountNumber));
  if (filiationNumber !== undefined) {
    params.append("filiationNumber", String(filiationNumber));
  }

  if (!isRealApi) {
    return mockHistoryEntries.filter((entry) => {
      const accountMatch = entry.referenceAccount === accountNumber;
      const filiationMatch =
        filiationNumber === undefined ||
        entry.referenceFiliation === filiationNumber;
      return accountMatch && filiationMatch;
    });
  }

  const response = await apiClient.get<ApiResponse<FusionSeparationHistoryEntry[]>>(
    `${BASE_PATH}?${params.toString()}`
  );

  if (!response.success) {
    throw new Error(response.message || "Failed to fetch history entries");
  }

  return response.data;
};

export const getHistoryByDateRange = async (
  startDate: Date,
  endDate: Date,
  operationType?: string
): Promise<FusionSeparationHistoryEntry[]> => {
  const isRealApi = useDataSourceStore.getState().isRealApi;

  const params = new URLSearchParams();
  params.append("startDate", startDate.toISOString());
  params.append("endDate", endDate.toISOString());
  if (operationType !== undefined) {
    params.append("operationType", operationType);
  }

  if (!isRealApi) {
    return mockHistoryEntries.filter((entry) => {
      const dateMatch =
        entry.timestamp >= startDate && entry.timestamp <= endDate;
      const typeMatch =
        operationType === undefined || entry.operationType === operationType;
      return dateMatch && typeMatch;
    });
  }

  const response = await apiClient.get<ApiResponse<FusionSeparationHistoryEntry[]>>(
    `${BASE_PATH}/date-range?${params.toString()}`
  );

  if (!response.success) {
    throw new Error(response.message || "Failed to fetch history entries");
  }

  return response.data;
};