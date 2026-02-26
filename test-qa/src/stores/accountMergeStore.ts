import { create } from "zustand";
import type {
  AccountMergeState,
  AccountMergeActions,
  MergeRequest,
  Account,
  ValidationStatus,
  MergeHistory,
  MergeLog,
  ValidatePrerequisitesRequest,
  LoadAccountsRequest,
  ExecuteMergeRequest,
  SaveMergeHistoryRequest,
  WriteMergeLogsRequest,
  CleanupTemporaryDataRequest,
  PrintMergeTicketRequest,
  GetMergeHistoryRequest,
  GetMergeLogsRequest,
  ProgressData,
  INITIAL_ACCOUNT_MERGE_STATE,
} from "@/types/accountMerge";
import { MERGE_STATUS, MERGE_OPERATIONS } from "@/types/accountMerge";
import { useDataSourceStore } from "@/stores/dataSourceStore";
import { apiClient } from "@/services/api/apiClient";
import type { ApiResponse } from "@/services/api/apiClient";

const mockAccounts: Account[] = [
  {
    id: 1001,
    status: "ACTIVE",
    balance: 1250.75,
    clientName: "Dupont Pierre",
    linkedAccounts: 2,
  },
  {
    id: 1002,
    status: "ACTIVE",
    balance: 3420.5,
    clientName: "Martin Sophie",
    linkedAccounts: 1,
  },
  {
    id: 2001,
    status: "ACTIVE",
    balance: 850.0,
    clientName: "Bernard Michel",
    linkedAccounts: 0,
  },
  {
    id: 2002,
    status: "ACTIVE",
    balance: 5600.25,
    clientName: "Lefebvre Anne",
    linkedAccounts: 3,
  },
  {
    id: 3001,
    status: "ACTIVE",
    balance: 420.8,
    clientName: "Petit Jean",
    linkedAccounts: 1,
  },
  {
    id: 3002,
    status: "ACTIVE",
    balance: 7800.0,
    clientName: "Dubois Claire",
    linkedAccounts: 2,
  },
  {
    id: 4001,
    status: "ACTIVE",
    balance: 2100.5,
    clientName: "Moreau Luc",
    linkedAccounts: 0,
  },
  {
    id: 4002,
    status: "ACTIVE",
    balance: 9500.75,
    clientName: "Laurent Marie",
    linkedAccounts: 4,
  },
  {
    id: 5001,
    status: "ACTIVE",
    balance: 680.25,
    clientName: "Simon Thomas",
    linkedAccounts: 1,
  },
  {
    id: 5002,
    status: "ACTIVE",
    balance: 12000.0,
    clientName: "Garcia Emma",
    linkedAccounts: 2,
  },
];

const mockMergeRequests: MergeRequest[] = [
  {
    id: 1,
    sourceAccountId: 1001,
    targetAccountId: 1002,
    status: MERGE_STATUS.COMPLETED,
    validatedBy: "admin",
    validatedAt: new Date("2025-01-15T10:30:00"),
    chronoCode: "F",
  },
  {
    id: 2,
    sourceAccountId: 2001,
    targetAccountId: 2002,
    status: MERGE_STATUS.IN_PROGRESS,
    validatedBy: null,
    validatedAt: null,
    chronoCode: "F",
  },
  {
    id: 3,
    sourceAccountId: 3001,
    targetAccountId: 3002,
    status: MERGE_STATUS.CANCELLED,
    validatedBy: "supervisor",
    validatedAt: new Date("2025-01-20T14:45:00"),
    chronoCode: "F",
  },
];

const mockMergeHistory: MergeHistory[] = [
  {
    id: 1,
    mergeRequestId: 1,
    timestamp: new Date("2025-01-15T10:30:00"),
    operation: MERGE_OPERATIONS.VALIDATION,
    details: "Prerequisites validated successfully",
  },
  {
    id: 2,
    mergeRequestId: 1,
    timestamp: new Date("2025-01-15T10:35:00"),
    operation: MERGE_OPERATIONS.TRANSFER,
    details: "Transfer started for 60 tables",
  },
  {
    id: 3,
    mergeRequestId: 1,
    timestamp: new Date("2025-01-15T11:20:00"),
    operation: MERGE_OPERATIONS.CLEANUP,
    details: "Temporary data cleaned up",
  },
  {
    id: 4,
    mergeRequestId: 1,
    timestamp: new Date("2025-01-15T11:25:00"),
    operation: MERGE_OPERATIONS.PRINT,
    details: "Merge ticket printed",
  },
  {
    id: 5,
    mergeRequestId: 2,
    timestamp: new Date("2025-02-01T09:00:00"),
    operation: MERGE_OPERATIONS.VALIDATION,
    details: "Prerequisites validated",
  },
  {
    id: 6,
    mergeRequestId: 2,
    timestamp: new Date("2025-02-01T09:05:00"),
    operation: MERGE_OPERATIONS.TRANSFER,
    details: "Transfer in progress",
  },
  {
    id: 7,
    mergeRequestId: 3,
    timestamp: new Date("2025-01-20T14:00:00"),
    operation: MERGE_OPERATIONS.VALIDATION,
    details: "Prerequisites validated",
  },
  {
    id: 8,
    mergeRequestId: 3,
    timestamp: new Date("2025-01-20T14:10:00"),
    operation: MERGE_OPERATIONS.TRANSFER,
    details: "Transfer started",
  },
  {
    id: 9,
    mergeRequestId: 3,
    timestamp: new Date("2025-01-20T14:45:00"),
    operation: MERGE_OPERATIONS.CANCEL,
    details: "Merge cancelled by user request",
  },
  {
    id: 10,
    mergeRequestId: 3,
    timestamp: new Date("2025-01-20T14:50:00"),
    operation: MERGE_OPERATIONS.CLEANUP,
    details: "Rollback completed",
  },
];

const mockTableNames = [
  "compte_gm",
  "fusion_eclatement",
  "histo_fusionseparation",
  "vente",
  "cc_comptable",
  "cc_total_par_type",
  "prestations",
  "garanties",
  "transactions",
  "client_details",
  "factures",
  "paiements",
  "soldes",
  "historique_compte",
  "operations_bancaires",
  "virements",
  "prelevements",
  "cheques",
  "cartes_bancaires",
  "credits",
  "debits",
  "interets",
  "frais",
  "commissions",
  "tva",
  "taxes",
  "subventions",
  "aides",
  "remboursements",
  "compensations",
  "ajustements",
  "corrections",
  "regularisations",
  "provisions",
  "reserves",
  "actifs",
  "passifs",
  "capitaux",
  "benefices",
  "pertes",
  "resultats",
  "bilans",
  "budgets",
  "previsions",
  "estimations",
  "evaluations",
  "audits",
  "controles",
  "verifications",
  "validations",
  "autorisations",
  "approbations",
  "rejets",
  "annulations",
  "modifications",
  "suppressions",
  "archivages",
  "restaurations",
  "sauvegardes",
  "imports",
  "exports",
];

const generateMockLogs = (mergeId: number, count: number): MergeLog[] => {
  const logs: MergeLog[] = [];
  const baseDate = new Date("2025-01-15T10:35:00");
  
  for (let i = 0; i < count; i++) {
    logs.push({
      id: mergeId * 100 + i + 1,
      mergeId,
      operation: MERGE_OPERATIONS.TRANSFER,
      tableName: mockTableNames[i % mockTableNames.length],
      recordCount: Math.floor(Math.random() * 500) + 10,
      timestamp: new Date(baseDate.getTime() + i * 60000),
      success: Math.random() > 0.05,
    });
  }
  
  return logs;
};

const mockMergeLogs: MergeLog[] = [
  ...generateMockLogs(1, 60),
  ...generateMockLogs(2, 30),
];

const mockValidationStatus: ValidationStatus = {
  network: true,
  closure: false,
  validation: "V",
};

export const useAccountMergeStore = create<
  AccountMergeState & AccountMergeActions
>((set, get) => ({
  ...INITIAL_ACCOUNT_MERGE_STATE,

  validatePrerequisites: async (
    sourceAccountId?: number,
    targetAccountId?: number
  ): Promise<ValidationStatus> => {
    set({ isProcessing: true, error: null });

    try {
      const isRealApi = useDataSourceStore.getState().isRealApi;

      if (isRealApi) {
        const response = await apiClient.post<
          ValidatePrerequisitesRequest,
          ApiResponse<ValidationStatus>
        >("/api/account-merge/validate", {
          sourceAccountId,
          targetAccountId,
        });

        if (!response.success || !response.data) {
          throw new Error(response.error || "Validation failed");
        }

        set({
          validationStatus: response.data,
          isProcessing: false,
        });

        return response.data;
      } else {
        await new Promise((resolve) => setTimeout(resolve, 800));

        if (sourceAccountId === 9999 || targetAccountId === 9999) {
          const errorStatus: ValidationStatus = {
            network: false,
            closure: true,
            validation: "R",
          };
          set({
            validationStatus: errorStatus,
            error: "RM-001: Network is in 'R' mode or closure in progress",
            isProcessing: false,
          });
          return errorStatus;
        }

        const status: ValidationStatus = {
          network: true,
          closure: false,
          validation: "V",
        };

        set({
          validationStatus: status,
          isProcessing: false,
        });

        return status;
      }
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "Unknown validation error";
      set({ error: errorMessage, isProcessing: false });
      throw e;
    }
  },

  loadAccounts: async (
    sourceAccountId: number,
    targetAccountId: number
  ): Promise<{ source: Account; target: Account }> => {
    set({ isProcessing: true, error: null });

    try {
      const isRealApi = useDataSourceStore.getState().isRealApi;

      if (isRealApi) {
        const response = await apiClient.post<
          LoadAccountsRequest,
          ApiResponse<{ source: Account; target: Account }>
        >("/api/account-merge/load-accounts", {
          sourceAccountId,
          targetAccountId,
        });

        if (!response.success || !response.data) {
          throw new Error(response.error || "Failed to load accounts");
        }

        set({
          sourceAccount: response.data.source,
          targetAccount: response.data.target,
          isProcessing: false,
        });

        return response.data;
      } else {
        await new Promise((resolve) => setTimeout(resolve, 600));

        const source =
          mockAccounts.find((acc) => acc.id === sourceAccountId) ||
          mockAccounts[0];
        const target =
          mockAccounts.find((acc) => acc.id === targetAccountId) ||
          mockAccounts[1];

        if (!source || !target) {
          throw new Error("Account not found");
        }

        set({
          sourceAccount: source,
          targetAccount: target,
          currentStep: "preparation",
          isProcessing: false,
        });

        return { source, target };
      }
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "Unknown error loading accounts";
      set({ error: errorMessage, isProcessing: false });
      throw e;
    }
  },

  executeMerge: async (
    autoResume = false,
    withoutInterface = false
  ): Promise<MergeRequest> => {
    set({ isProcessing: true, error: null, currentStep: "execution" });

    try {
      const { sourceAccount, targetAccount } = get();

      if (!sourceAccount || !targetAccount) {
        throw new Error("Source and target accounts must be loaded first");
      }

      const isRealApi = useDataSourceStore.getState().isRealApi;

      if (isRealApi) {
        const response = await apiClient.post<
          ExecuteMergeRequest,
          ApiResponse<MergeRequest>
        >("/api/account-merge/execute", {
          autoResume,
          withoutInterface,
        });

        if (!response.success || !response.data) {
          throw new Error(response.error || "Merge execution failed");
        }

        set({
          mergeRequest: response.data,
          currentStep: "completion",
          isProcessing: false,
        });

        return response.data;
      } else {
        if (!withoutInterface) {
          for (let i = 0; i < mockTableNames.length; i++) {
            await new Promise((resolve) => setTimeout(resolve, 50));
            set({
              progressData: {
                current: i + 1,
                total: mockTableNames.length,
                table: mockTableNames[i],
              },
            });
          }
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));

        const newMergeRequest: MergeRequest = {
          id: mockMergeRequests.length + 1,
          sourceAccountId: sourceAccount.id,
          targetAccountId: targetAccount.id,
          status: MERGE_STATUS.COMPLETED,
          validatedBy: "current_user",
          validatedAt: new Date(),
          chronoCode: "F",
        };

        const historyEntry: MergeHistory = {
          id: mockMergeHistory.length + 1,
          mergeRequestId: newMergeRequest.id,
          timestamp: new Date(),
          operation: MERGE_OPERATIONS.TRANSFER,
          details: `Merged account ${sourceAccount.id} into ${targetAccount.id}`,
        };

        set({
          mergeRequest: newMergeRequest,
          mergeHistory: [...get().mergeHistory, historyEntry],
          currentStep: "completion",
          isProcessing: false,
        });

        return newMergeRequest;
      }
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "Unknown merge execution error";
      set({ error: errorMessage, isProcessing: false });
      throw e;
    }
  },

  saveMergeHistory: async (
    mergeId: number,
    operation: string,
    details?: string
  ): Promise<void> => {
    set({ isProcessing: true, error: null });

    try {
      const isRealApi = useDataSourceStore.getState().isRealApi;

      if (isRealApi) {
        const response = await apiClient.post<
          SaveMergeHistoryRequest,
          ApiResponse<void>
        >("/api/account-merge/history", {
          mergeId,
          operation,
          details,
        });

        if (!response.success) {
          throw new Error(response.error || "Failed to save merge history");
        }

        set({ isProcessing: false });
      } else {
        await new Promise((resolve) => setTimeout(resolve, 300));

        const existingLog = get().mergeHistory.find(
          (h) => h.mergeRequestId === mergeId && h.operation === operation
        );

        if (existingLog) {
          throw new Error("RM-006: LOG code already exists");
        }

        const newHistory: MergeHistory = {
          id: get().mergeHistory.length + 1,
          mergeRequestId: mergeId,
          timestamp: new Date(),
          operation,
          details: details || null,
        };

        set({
          mergeHistory: [...get().mergeHistory, newHistory],
          isProcessing: false,
        });
      }
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "Unknown error saving history";
      set({ error: errorMessage, isProcessing: false });
      throw e;
    }
  },

  writeMergeLogs: async (
    mergeId: number,
    tableName: string,
    recordCount: number,
    success: boolean
  ): Promise<void> => {
    set({ isProcessing: true, error: null });

    try {
      const isRealApi = useDataSourceStore.getState().isRealApi;

      if (isRealApi) {
        const response = await apiClient.post<
          WriteMergeLogsRequest,
          ApiResponse<void>
        >("/api/account-merge/logs", {
          mergeId,
          tableName,
          recordCount,
          success,
        });

        if (!response.success) {
          throw new Error(response.error || "Failed to write merge logs");
        }

        set({ isProcessing: false });
      } else {
        await new Promise((resolve) => setTimeout(resolve, 100));

        const newLog: MergeLog = {
          id: get().mergeLogs.length + 1,
          mergeId,
          operation: MERGE_OPERATIONS.TRANSFER,
          tableName,
          recordCount,
          timestamp: new Date(),
          success,
        };

        set({
          mergeLogs: [...get().mergeLogs, newLog],
          isProcessing: false,
        });
      }
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "Unknown error writing logs";
      set({ error: errorMessage, isProcessing: false });
      throw e;
    }
  },

  cleanupTemporaryData: async (mergeId: number): Promise<void> => {
    set({ isProcessing: true, error: null });

    try {
      const isRealApi = useDataSourceStore.getState().isRealApi;

      if (isRealApi) {
        const response = await apiClient.delete<ApiResponse<void>>(
          `/api/account-merge/cleanup/${mergeId}`
        );

        if (!response.success) {
          throw new Error(response.error || "Failed to cleanup temporary data");
        }

        set({ isProcessing: false });
      } else {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const cleanupHistory: MergeHistory = {
          id: get().mergeHistory.length + 1,
          mergeRequestId: mergeId,
          timestamp: new Date(),
          operation: MERGE_OPERATIONS.CLEANUP,
          details: "Temporary data cleaned successfully",
        };

        set({
          mergeHistory: [...get().mergeHistory, cleanupHistory],
          isProcessing: false,
        });
      }
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "Unknown cleanup error";
      set({ error: errorMessage, isProcessing: false });
      throw e;
    }
  },

  printMergeTicket: async (mergeId: number): Promise<void> => {
    set({ isProcessing: true, error: null });

    try {
      const isRealApi = useDataSourceStore.getState().isRealApi;

      if (isRealApi) {
        const response = await apiClient.post<
          PrintMergeTicketRequest,
          ApiResponse<void>
        >(`/api/account-merge/print/${mergeId}`, {
          mergeId,
        });

        if (!response.success) {
          throw new Error(response.error || "Failed to print merge ticket");
        }

        set({ isProcessing: false });
      } else {
        await new Promise((resolve) => setTimeout(resolve, 700));

        const VG78 = false;

        if (VG78) {
          throw new Error("RM-013: VG78 is active, printing disabled");
        }

        const printHistory: MergeHistory = {
          id: get().mergeHistory.length + 1,
          mergeRequestId: mergeId,
          timestamp: new Date(),
          operation: MERGE_OPERATIONS.PRINT,
          details: "Merge ticket printed successfully",
        };

        set({
          mergeHistory: [...get().mergeHistory, printHistory],
          isProcessing: false,
        });
      }
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "Unknown print error";
      set({ error: errorMessage, isProcessing: false });
      throw e;
    }
  },

  cancelMerge: async (): Promise<void> => {
    set({ isProcessing: true, error: null });

    try {
      const { mergeRequest } = get();

      if (!mergeRequest) {
        throw new Error("No active merge request to cancel");
      }

      if (mergeRequest.status === MERGE_STATUS.COMPLETED) {
        throw new Error("Cannot cancel a completed merge");
      }

      const isRealApi = useDataSourceStore.getState().isRealApi;

      if (isRealApi) {
        const response = await apiClient.delete<ApiResponse<void>>(
          "/api/account-merge/cancel"
        );

        if (!response.success) {
          throw new Error(response.error || "Failed to cancel merge");
        }

        set({
          mergeRequest: {
            ...mergeRequest,
            status: MERGE_STATUS.CANCELLED,
          },
          isProcessing: false,
        });
      } else {
        await new Promise((resolve) => setTimeout(resolve, 400));

        const cancelHistory: MergeHistory = {
          id: get().mergeHistory.length + 1,
          mergeRequestId: mergeRequest.id,
          timestamp: new Date(),
          operation: MERGE_OPERATIONS.CANCEL,
          details: "Merge cancelled by user",
        };

        set({
          mergeRequest: {
            ...mergeRequest,
            status: MERGE_STATUS.CANCELLED,
          },
          mergeHistory: [...get().mergeHistory, cancelHistory],
          currentStep: "validation",
          isProcessing: false,
        });
      }
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "Unknown cancel error";
      set({ error: errorMessage, isProcessing: false });
      throw e;
    }
  },

  getMergeHistory: async (
    filters?: GetMergeHistoryRequest
  ): Promise<MergeHistory[]> => {
    set({ isProcessing: true, error: null });

    try {
      const isRealApi = useDataSourceStore.getState().isRealApi;

      if (isRealApi) {
        const queryParams = new URLSearchParams();
        if (filters?.startDate)
          queryParams.append("startDate", filters.startDate.toISOString());
        if (filters?.endDate)
          queryParams.append("endDate", filters.endDate.toISOString());
        if (filters?.accountId)
          queryParams.append("accountId", filters.accountId.toString());

        const response = await apiClient.get<ApiResponse<MergeHistory[]>>(
          `/api/account-merge/history?${queryParams.toString()}`
        );

        if (!response.success || !response.data) {
          throw new Error(response.error || "Failed to get merge history");
        }

        set({
          mergeHistory: response.data,
          isProcessing: false,
        });

        return response.data;
      } else {
        await new Promise((resolve) => setTimeout(resolve, 400));

        let filteredHistory = [...mockMergeHistory];

        if (filters?.startDate) {
          filteredHistory = filteredHistory.filter(
            (h) => h.timestamp >= filters.startDate!
          );
        }

        if (filters?.endDate) {
          filteredHistory = filteredHistory.filter(
            (h) => h.timestamp <= filters.endDate!
          );
        }

        if (filters?.accountId) {
          const relevantMerges = mockMergeRequests
            .filter(
              (mr) =>
                mr.sourceAccountId === filters.accountId ||
                mr.targetAccountId === filters.accountId
            )
            .map((mr) => mr.id);

          filteredHistory = filteredHistory.filter((h) =>
            relevantMerges.includes(h.mergeRequestId)
          );
        }

        set({
          mergeHistory: filteredHistory,
          isProcessing: false,
        });

        return filteredHistory;
      }
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "Unknown error fetching history";
      set({ error: errorMessage, isProcessing: false });
      throw e;
    }
  },

  getMergeLogs: async (mergeId: number): Promise<MergeLog[]> => {
    set({ isProcessing: true, error: null });

    try {
      const isRealApi = useDataSourceStore.getState().isRealApi;

      if (isRealApi) {
        const response = await apiClient.get<ApiResponse<MergeLog[]>>(
          `/api/account-merge/logs/${mergeId}`
        );

        if (!response.success || !response.data) {
          throw new Error(response.error || "Failed to get merge logs");
        }

        set({
          mergeLogs: response.data,
          isProcessing: false,
        });

        return response.data;
      } else {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const logs = mockMergeLogs.filter((log) => log.mergeId === mergeId);

        set({
          mergeLogs: logs,
          isProcessing: false,
        });

        return logs;
      }
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "Unknown error fetching logs";
      set({ error: errorMessage, isProcessing: false });
      throw e;
    }
  },

  setCurrentStep: (step: AccountMergeState["currentStep"]) => {
    set({ currentStep: step });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  setProgressData: (progressData: ProgressData) => {
    set({ progressData });
  },

  setMergeRequest: (mergeRequest: MergeRequest | null) => {
    set({ mergeRequest });
  },

  setSourceAccount: (sourceAccount: Account | null) => {
    set({ sourceAccount });
  },

  setTargetAccount: (targetAccount: Account | null) => {
    set({ targetAccount });
  },

  setValidationStatus: (validationStatus: ValidationStatus | null) => {
    set({ validationStatus });
  },

  setIsProcessing: (isProcessing: boolean) => {
    set({ isProcessing });
  },

  addMergeHistory: (history: MergeHistory) => {
    set({ mergeHistory: [...get().mergeHistory, history] });
  },

  addMergeLog: (log: MergeLog) => {
    set({ mergeLogs: [...get().mergeLogs, log] });
  },

  reset: () => {
    set(INITIAL_ACCOUNT_MERGE_STATE);
  },
}));