import { describe, it, expect, beforeEach, vi } from "vitest";
import { useAccountMergeStore } from "@/stores/accountMergeStore";
import { useDataSourceStore } from "@/stores/dataSourceStore";
import { apiClient } from "@/services/api/apiClient";
import type { ApiResponse } from "@/services/api/apiClient";
import type {
  Account,
  ValidationStatus,
  MergeRequest,
  MergeHistory,
  MergeLog,
} from "@/types/accountMerge";
import { MERGE_STATUS, MERGE_OPERATIONS } from "@/types/accountMerge";

vi.mock("@/services/api/apiClient", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("@/stores/dataSourceStore", () => ({
  useDataSourceStore: {
    getState: vi.fn(),
  },
}));

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
];

const mockValidationStatus: ValidationStatus = {
  network: true,
  closure: false,
  validation: "V",
};

const mockInvalidValidationStatus: ValidationStatus = {
  network: false,
  closure: true,
  validation: "R",
};

const mockMergeRequest: MergeRequest = {
  id: 1,
  sourceAccountId: 1001,
  targetAccountId: 1002,
  status: MERGE_STATUS.COMPLETED,
  validatedBy: "admin",
  validatedAt: new Date("2025-01-15T10:30:00"),
  chronoCode: "F",
};

const mockMergeHistory: MergeHistory = {
  id: 1,
  mergeRequestId: 1,
  timestamp: new Date("2025-01-15T10:30:00"),
  operation: MERGE_OPERATIONS.VALIDATION,
  details: "Prerequisites validated successfully",
};

const mockMergeLog: MergeLog = {
  id: 1,
  mergeId: 1,
  operation: MERGE_OPERATIONS.TRANSFER,
  tableName: "compte_gm",
  recordCount: 150,
  timestamp: new Date("2025-01-15T10:35:00"),
  success: true,
};

describe("accountMergeStore", () => {
  beforeEach(() => {
    useAccountMergeStore.getState().reset();
    vi.clearAllMocks();
    vi.mocked(useDataSourceStore.getState).mockReturnValue({
      isRealApi: false,
    } as ReturnType<typeof useDataSourceStore.getState>);
  });

  describe("validatePrerequisites", () => {
    it("should validate prerequisites successfully in mock mode", async () => {
      const store = useAccountMergeStore.getState();

      const result = await store.validatePrerequisites(1001, 1002);

      expect(result.network).toBe(true);
      expect(result.closure).toBe(false);
      expect(result.validation).toBe("V");
      expect(store.validationStatus).toEqual(result);
      expect(store.isProcessing).toBe(false);
      expect(store.error).toBe(null);
    });

    it("should enforce RM-001 rule - reject when network is R mode", async () => {
      const store = useAccountMergeStore.getState();

      const result = await store.validatePrerequisites(9999, 1002);

      expect(result.network).toBe(false);
      expect(result.validation).toBe("R");
      expect(store.error).toContain("RM-001");
      expect(store.error).toContain("Network is in 'R' mode");
      expect(store.isProcessing).toBe(false);
    });

    it("should enforce RM-002/003 rule - check validation status", async () => {
      const store = useAccountMergeStore.getState();

      const result = await store.validatePrerequisites(1001, 1002);

      expect(result.validation).toBe("V");
    });

    it("should call real API when isRealApi is true", async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({
        isRealApi: true,
      } as ReturnType<typeof useDataSourceStore.getState>);

      const mockApiResponse: ApiResponse<ValidationStatus> = {
        success: true,
        data: mockValidationStatus,
      };
      vi.mocked(apiClient.post).mockResolvedValue(mockApiResponse);

      const store = useAccountMergeStore.getState();
      const result = await store.validatePrerequisites(1001, 1002);

      expect(apiClient.post).toHaveBeenCalledWith(
        "/api/account-merge/validate",
        {
          sourceAccountId: 1001,
          targetAccountId: 1002,
        }
      );
      expect(result).toEqual(mockValidationStatus);
      expect(store.validationStatus).toEqual(mockValidationStatus);
    });

    it("should handle API error", async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({
        isRealApi: true,
      } as ReturnType<typeof useDataSourceStore.getState>);

      vi.mocked(apiClient.post).mockResolvedValue({
        success: false,
        error: "Network error",
      });

      const store = useAccountMergeStore.getState();

      await expect(store.validatePrerequisites(1001, 1002)).rejects.toThrow(
        "Network error"
      );
      expect(store.error).toBe("Network error");
      expect(store.isProcessing).toBe(false);
    });

    it("should set isProcessing to true during validation", async () => {
      const store = useAccountMergeStore.getState();
      
      const promise = store.validatePrerequisites(1001, 1002);
      expect(store.isProcessing).toBe(true);
      
      await promise;
      expect(store.isProcessing).toBe(false);
    });
  });

  describe("loadAccounts", () => {
    it("should load source and target accounts successfully in mock mode", async () => {
      const store = useAccountMergeStore.getState();

      const result = await store.loadAccounts(1001, 1002);

      expect(result.source.id).toBe(1001);
      expect(result.target.id).toBe(1002);
      expect(store.sourceAccount?.id).toBe(1001);
      expect(store.targetAccount?.id).toBe(1002);
      expect(store.currentStep).toBe("preparation");
      expect(store.isProcessing).toBe(false);
    });

    it("should throw error when account not found in mock mode", async () => {
      const store = useAccountMergeStore.getState();

      await expect(store.loadAccounts(9999, 1002)).rejects.toThrow(
        "Account not found"
      );
      expect(store.error).toContain("Account not found");
    });

    it("should call real API when isRealApi is true", async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({
        isRealApi: true,
      } as ReturnType<typeof useDataSourceStore.getState>);

      const mockApiResponse: ApiResponse<{ source: Account; target: Account }> = {
        success: true,
        data: {
          source: mockAccounts[0],
          target: mockAccounts[1],
        },
      };
      vi.mocked(apiClient.post).mockResolvedValue(mockApiResponse);

      const store = useAccountMergeStore.getState();
      const result = await store.loadAccounts(1001, 1002);

      expect(apiClient.post).toHaveBeenCalledWith(
        "/api/account-merge/load-accounts",
        {
          sourceAccountId: 1001,
          targetAccountId: 1002,
        }
      );
      expect(result.source.id).toBe(1001);
      expect(result.target.id).toBe(1002);
    });

    it("should handle API error when loading accounts", async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({
        isRealApi: true,
      } as ReturnType<typeof useDataSourceStore.getState>);

      vi.mocked(apiClient.post).mockResolvedValue({
        success: false,
        error: "Database connection failed",
      });

      const store = useAccountMergeStore.getState();

      await expect(store.loadAccounts(1001, 1002)).rejects.toThrow(
        "Database connection failed"
      );
      expect(store.error).toBe("Database connection failed");
    });

    it("should set isProcessing during account loading", async () => {
      const store = useAccountMergeStore.getState();
      
      const promise = store.loadAccounts(1001, 1002);
      expect(store.isProcessing).toBe(true);
      
      await promise;
      expect(store.isProcessing).toBe(false);
    });
  });

  describe("executeMerge", () => {
    beforeEach(async () => {
      const store = useAccountMergeStore.getState();
      await store.loadAccounts(1001, 1002);
    });

    it("should execute merge successfully in mock mode", async () => {
      const store = useAccountMergeStore.getState();

      const result = await store.executeMerge();

      expect(result.sourceAccountId).toBe(1001);
      expect(result.targetAccountId).toBe(1002);
      expect(result.status).toBe(MERGE_STATUS.COMPLETED);
      expect(result.chronoCode).toBe("F");
      expect(store.mergeRequest).toEqual(result);
      expect(store.currentStep).toBe("completion");
      expect(store.isProcessing).toBe(false);
    });

    it("should enforce RM-010 rule - support autoResume parameter", async () => {
      const store = useAccountMergeStore.getState();

      const result = await store.executeMerge(true, false);

      expect(result).toBeDefined();
      expect(result.status).toBe(MERGE_STATUS.COMPLETED);
    });

    it("should enforce RM-012 rule - show progress when withoutInterface is false", async () => {
      const store = useAccountMergeStore.getState();

      const result = await store.executeMerge(false, false);

      expect(result).toBeDefined();
      expect(store.progressData.total).toBeGreaterThan(0);
    });

    it("should skip progress display when withoutInterface is true", async () => {
      const store = useAccountMergeStore.getState();

      const result = await store.executeMerge(false, true);

      expect(result).toBeDefined();
      expect(result.status).toBe(MERGE_STATUS.COMPLETED);
    });

    it("should throw error when accounts not loaded", async () => {
      const store = useAccountMergeStore.getState();
      store.reset();

      await expect(store.executeMerge()).rejects.toThrow(
        "Source and target accounts must be loaded first"
      );
      expect(store.error).toContain("must be loaded first");
    });

    it("should call real API when isRealApi is true", async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({
        isRealApi: true,
      } as ReturnType<typeof useDataSourceStore.getState>);

      const mockApiResponse: ApiResponse<MergeRequest> = {
        success: true,
        data: mockMergeRequest,
      };
      vi.mocked(apiClient.post).mockResolvedValue(mockApiResponse);

      const store = useAccountMergeStore.getState();
      const result = await store.executeMerge(true, false);

      expect(apiClient.post).toHaveBeenCalledWith("/api/account-merge/execute", {
        autoResume: true,
        withoutInterface: false,
      });
      expect(result).toEqual(mockMergeRequest);
    });

    it("should add merge history entry after successful merge", async () => {
      const store = useAccountMergeStore.getState();
      const initialHistoryCount = store.mergeHistory.length;

      await store.executeMerge();

      expect(store.mergeHistory.length).toBe(initialHistoryCount + 1);
      expect(store.mergeHistory[store.mergeHistory.length - 1].operation).toBe(
        MERGE_OPERATIONS.TRANSFER
      );
    });

    it("should set currentStep to execution during merge", async () => {
      const store = useAccountMergeStore.getState();
      
      const promise = store.executeMerge();
      expect(store.currentStep).toBe("execution");
      
      await promise;
      expect(store.currentStep).toBe("completion");
    });
  });

  describe("saveMergeHistory", () => {
    it("should save merge history successfully in mock mode", async () => {
      const store = useAccountMergeStore.getState();
      const initialCount = store.mergeHistory.length;

      await store.saveMergeHistory(1, MERGE_OPERATIONS.VALIDATION, "Test details");

      expect(store.mergeHistory.length).toBe(initialCount + 1);
      const lastHistory = store.mergeHistory[store.mergeHistory.length - 1];
      expect(lastHistory.mergeRequestId).toBe(1);
      expect(lastHistory.operation).toBe(MERGE_OPERATIONS.VALIDATION);
      expect(lastHistory.details).toBe("Test details");
      expect(store.isProcessing).toBe(false);
    });

    it("should enforce RM-006 rule - prevent duplicate LOG codes", async () => {
      const store = useAccountMergeStore.getState();
      
      await store.saveMergeHistory(1, MERGE_OPERATIONS.TRANSFER, "First entry");

      await expect(
        store.saveMergeHistory(1, MERGE_OPERATIONS.TRANSFER, "Duplicate")
      ).rejects.toThrow("RM-006");
      expect(store.error).toContain("LOG code already exists");
    });

    it("should call real API when isRealApi is true", async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({
        isRealApi: true,
      } as ReturnType<typeof useDataSourceStore.getState>);

      vi.mocked(apiClient.post).mockResolvedValue({ success: true });

      const store = useAccountMergeStore.getState();
      await store.saveMergeHistory(1, MERGE_OPERATIONS.CLEANUP, "Cleaned up");

      expect(apiClient.post).toHaveBeenCalledWith("/api/account-merge/history", {
        mergeId: 1,
        operation: MERGE_OPERATIONS.CLEANUP,
        details: "Cleaned up",
      });
    });

    it("should handle API error when saving history", async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({
        isRealApi: true,
      } as ReturnType<typeof useDataSourceStore.getState>);

      vi.mocked(apiClient.post).mockResolvedValue({
        success: false,
        error: "Database write failed",
      });

      const store = useAccountMergeStore.getState();

      await expect(
        store.saveMergeHistory(1, MERGE_OPERATIONS.PRINT)
      ).rejects.toThrow("Database write failed");
      expect(store.error).toBe("Database write failed");
    });
  });

  describe("writeMergeLogs", () => {
    it("should write merge logs successfully in mock mode", async () => {
      const store = useAccountMergeStore.getState();
      const initialCount = store.mergeLogs.length;

      await store.writeMergeLogs(1, "compte_gm", 150, true);

      expect(store.mergeLogs.length).toBe(initialCount + 1);
      const lastLog = store.mergeLogs[store.mergeLogs.length - 1];
      expect(lastLog.mergeId).toBe(1);
      expect(lastLog.tableName).toBe("compte_gm");
      expect(lastLog.recordCount).toBe(150);
      expect(lastLog.success).toBe(true);
      expect(store.isProcessing).toBe(false);
    });

    it("should support logging failed operations", async () => {
      const store = useAccountMergeStore.getState();

      await store.writeMergeLogs(1, "transactions", 0, false);

      const lastLog = store.mergeLogs[store.mergeLogs.length - 1];
      expect(lastLog.success).toBe(false);
    });

    it("should call real API when isRealApi is true", async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({
        isRealApi: true,
      } as ReturnType<typeof useDataSourceStore.getState>);

      vi.mocked(apiClient.post).mockResolvedValue({ success: true });

      const store = useAccountMergeStore.getState();
      await store.writeMergeLogs(1, "vente", 250, true);

      expect(apiClient.post).toHaveBeenCalledWith("/api/account-merge/logs", {
        mergeId: 1,
        tableName: "vente",
        recordCount: 250,
        success: true,
      });
    });

    it("should handle API error when writing logs", async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({
        isRealApi: true,
      } as ReturnType<typeof useDataSourceStore.getState>);

      vi.mocked(apiClient.post).mockResolvedValue({
        success: false,
        error: "Log write failed",
      });

      const store = useAccountMergeStore.getState();

      await expect(store.writeMergeLogs(1, "prestations", 100, true)).rejects.toThrow(
        "Log write failed"
      );
      expect(store.error).toBe("Log write failed");
    });
  });

  describe("cleanupTemporaryData", () => {
    it("should cleanup temporary data successfully in mock mode", async () => {
      const store = useAccountMergeStore.getState();
      const initialCount = store.mergeHistory.length;

      await store.cleanupTemporaryData(1);

      expect(store.mergeHistory.length).toBe(initialCount + 1);
      const lastHistory = store.mergeHistory[store.mergeHistory.length - 1];
      expect(lastHistory.operation).toBe(MERGE_OPERATIONS.CLEANUP);
      expect(lastHistory.details).toContain("cleaned successfully");
      expect(store.isProcessing).toBe(false);
    });

    it("should call real API when isRealApi is true", async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({
        isRealApi: true,
      } as ReturnType<typeof useDataSourceStore.getState>);

      vi.mocked(apiClient.delete).mockResolvedValue({ success: true });

      const store = useAccountMergeStore.getState();
      await store.cleanupTemporaryData(1);

      expect(apiClient.delete).toHaveBeenCalledWith("/api/account-merge/cleanup/1");
    });

    it("should handle API error during cleanup", async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({
        isRealApi: true,
      } as ReturnType<typeof useDataSourceStore.getState>);

      vi.mocked(apiClient.delete).mockResolvedValue({
        success: false,
        error: "Cleanup failed",
      });

      const store = useAccountMergeStore.getState();

      await expect(store.cleanupTemporaryData(1)).rejects.toThrow("Cleanup failed");
      expect(store.error).toBe("Cleanup failed");
    });
  });

  describe("printMergeTicket", () => {
    it("should print merge ticket successfully in mock mode", async () => {
      const store = useAccountMergeStore.getState();
      const initialCount = store.mergeHistory.length;

      await store.printMergeTicket(1);

      expect(store.mergeHistory.length).toBe(initialCount + 1);
      const lastHistory = store.mergeHistory[store.mergeHistory.length - 1];
      expect(lastHistory.operation).toBe(MERGE_OPERATIONS.PRINT);
      expect(lastHistory.details).toContain("printed successfully");
      expect(store.isProcessing).toBe(false);
    });

    it("should call real API when isRealApi is true", async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({
        isRealApi: true,
      } as ReturnType<typeof useDataSourceStore.getState>);

      vi.mocked(apiClient.post).mockResolvedValue({ success: true });

      const store = useAccountMergeStore.getState();
      await store.printMergeTicket(1);

      expect(apiClient.post).toHaveBeenCalledWith("/api/account-merge/print/1", {
        mergeId: 1,
      });
    });

    it("should handle API error when printing", async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({
        isRealApi: true,
      } as ReturnType<typeof useDataSourceStore.getState>);

      vi.mocked(apiClient.post).mockResolvedValue({
        success: false,
        error: "Printer offline",
      });

      const store = useAccountMergeStore.getState();

      await expect(store.printMergeTicket(1)).rejects.toThrow("Printer offline");
      expect(store.error).toBe("Printer offline");
    });
  });

  describe("cancelMerge", () => {
    beforeEach(async () => {
      const store = useAccountMergeStore.getState();
      await store.loadAccounts(1001, 1002);
      store.setMergeRequest({
        ...mockMergeRequest,
        status: MERGE_STATUS.IN_PROGRESS,
      });
    });

    it("should cancel merge successfully in mock mode", async () => {
      const store = useAccountMergeStore.getState();

      await store.cancelMerge();

      expect(store.mergeRequest?.status).toBe(MERGE_STATUS.CANCELLED);
      expect(store.currentStep).toBe("validation");
      const lastHistory = store.mergeHistory[store.mergeHistory.length - 1];
      expect(lastHistory.operation).toBe(MERGE_OPERATIONS.CANCEL);
      expect(store.isProcessing).toBe(false);
    });

    it("should throw error when no active merge request", async () => {
      const store = useAccountMergeStore.getState();
      store.setMergeRequest(null);

      await expect(store.cancelMerge()).rejects.toThrow(
        "No active merge request to cancel"
      );
      expect(store.error).toContain("No active merge request");
    });

    it("should throw error when trying to cancel completed merge", async () => {
      const store = useAccountMergeStore.getState();
      store.setMergeRequest({
        ...mockMergeRequest,
        status: MERGE_STATUS.COMPLETED,
      });

      await expect(store.cancelMerge()).rejects.toThrow(
        "Cannot cancel a completed merge"
      );
    });

    it("should call real API when isRealApi is true", async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({
        isRealApi: true,
      } as ReturnType<typeof useDataSourceStore.getState>);

      vi.mocked(apiClient.delete).mockResolvedValue({ success: true });

      const store = useAccountMergeStore.getState();
      await store.cancelMerge();

      expect(apiClient.delete).toHaveBeenCalledWith("/api/account-merge/cancel");
      expect(store.mergeRequest?.status).toBe(MERGE_STATUS.CANCELLED);
    });

    it("should handle API error during cancellation", async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({
        isRealApi: true,
      } as ReturnType<typeof useDataSourceStore.getState>);

      vi.mocked(apiClient.delete).mockResolvedValue({
        success: false,
        error: "Cancellation failed",
      });

      const store = useAccountMergeStore.getState();

      await expect(store.cancelMerge()).rejects.toThrow("Cancellation failed");
      expect(store.error).toBe("Cancellation failed");
    });
  });

  describe("getMergeHistory", () => {
    it("should get merge history without filters in mock mode", async () => {
      const store = useAccountMergeStore.getState();

      const result = await store.getMergeHistory();

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(store.mergeHistory).toEqual(result);
      expect(store.isProcessing).toBe(false);
    });

    it("should filter by date range", async () => {
      const store = useAccountMergeStore.getState();
      const startDate = new Date("2025-01-15T00:00:00");
      const endDate = new Date("2025-01-16T00:00:00");

      const result = await store.getMergeHistory({ startDate, endDate });

      expect(Array.isArray(result)).toBe(true);
      result.forEach((history) => {
        expect(history.timestamp >= startDate).toBe(true);
        expect(history.timestamp <= endDate).toBe(true);
      });
    });

    it("should filter by account ID", async () => {
      const store = useAccountMergeStore.getState();

      const result = await store.getMergeHistory({ accountId: 1001 });

      expect(Array.isArray(result)).toBe(true);
    });

    it("should call real API when isRealApi is true", async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({
        isRealApi: true,
      } as ReturnType<typeof useDataSourceStore.getState>);

      const mockApiResponse: ApiResponse<MergeHistory[]> = {
        success: true,
        data: [mockMergeHistory],
      };
      vi.mocked(apiClient.get).mockResolvedValue(mockApiResponse);

      const store = useAccountMergeStore.getState();
      const result = await store.getMergeHistory();

      expect(apiClient.get).toHaveBeenCalled();
      expect(result).toEqual([mockMergeHistory]);
    });

    it("should handle API error when fetching history", async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({
        isRealApi: true,
      } as ReturnType<typeof useDataSourceStore.getState>);

      vi.mocked(apiClient.get).mockResolvedValue({
        success: false,
        error: "Database query failed",
      });

      const store = useAccountMergeStore.getState();

      await expect(store.getMergeHistory()).rejects.toThrow("Database query failed");
      expect(store.error).toBe("Database query failed");
    });
  });

  describe("getMergeLogs", () => {
    it("should get merge logs successfully in mock mode", async () => {
      const store = useAccountMergeStore.getState();

      const result = await store.getMergeLogs(1);

      expect(Array.isArray(result)).toBe(true);
      expect(store.mergeLogs).toEqual(result);
      expect(store.isProcessing).toBe(false);
    });

    it("should filter logs by merge ID", async () => {
      const store = useAccountMergeStore.getState();

      const result = await store.getMergeLogs(1);

      result.forEach((log) => {
        expect(log.mergeId).toBe(1);
      });
    });

    it("should call real API when isRealApi is true", async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({
        isRealApi: true,
      } as ReturnType<typeof useDataSourceStore.getState>);

      const mockApiResponse: ApiResponse<MergeLog[]> = {
        success: true,
        data: [mockMergeLog],
      };
      vi.mocked(apiClient.get).mockResolvedValue(mockApiResponse);

      const store = useAccountMergeStore.getState();
      const result = await store.getMergeLogs(1);

      expect(apiClient.get).toHaveBeenCalledWith("/api/account-merge/logs/1");
      expect(result).toEqual([mockMergeLog]);
    });

    it("should handle API error when fetching logs", async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({
        isRealApi: true,
      } as ReturnType<typeof useDataSourceStore.getState>);

      vi.mocked(apiClient.get).mockResolvedValue({
        success: false,
        error: "Logs not found",
      });

      const store = useAccountMergeStore.getState();

      await expect(store.getMergeLogs(1)).rejects.toThrow("Logs not found");
      expect(store.error).toBe("Logs not found");
    });
  });

  describe("setters", () => {
    it("should set current step", () => {
      const store = useAccountMergeStore.getState();

      store.setCurrentStep("execution");

      expect(store.currentStep).toBe("execution");
    });

    it("should set error", () => {
      const store = useAccountMergeStore.getState();

      store.setError("Test error");

      expect(store.error).toBe("Test error");
    });

    it("should clear error", () => {
      const store = useAccountMergeStore.getState();
      store.setError("Test error");

      store.setError(null);

      expect(store.error).toBe(null);
    });

    it("should set progress data", () => {
      const store = useAccountMergeStore.getState();
      const progressData = { current: 10, total: 60, table: "compte_gm" };

      store.setProgressData(progressData);

      expect(store.progressData).toEqual(progressData);
    });

    it("should set merge request", () => {
      const store = useAccountMergeStore.getState();

      store.setMergeRequest(mockMergeRequest);

      expect(store.mergeRequest).toEqual(mockMergeRequest);
    });

    it("should set source account", () => {
      const store = useAccountMergeStore.getState();

      store.setSourceAccount(mockAccounts[0]);

      expect(store.sourceAccount).toEqual(mockAccounts[0]);
    });

    it("should set target account", () => {
      const store = useAccountMergeStore.getState();

      store.setTargetAccount(mockAccounts[1]);

      expect(store.targetAccount).toEqual(mockAccounts[1]);
    });

    it("should set validation status", () => {
      const store = useAccountMergeStore.getState();

      store.setValidationStatus(mockValidationStatus);

      expect(store.validationStatus).toEqual(mockValidationStatus);
    });

    it("should set isProcessing", () => {
      const store = useAccountMergeStore.getState();

      store.setIsProcessing(true);

      expect(store.isProcessing).toBe(true);
    });

    it("should add merge history", () => {
      const store = useAccountMergeStore.getState();
      const initialCount = store.mergeHistory.length;

      store.addMergeHistory(mockMergeHistory);

      expect(store.mergeHistory.length).toBe(initialCount + 1);
      expect(store.mergeHistory[store.mergeHistory.length - 1]).toEqual(
        mockMergeHistory
      );
    });

    it("should add merge log", () => {
      const store = useAccountMergeStore.getState();
      const initialCount = store.mergeLogs.length;

      store.addMergeLog(mockMergeLog);

      expect(store.mergeLogs.length).toBe(initialCount + 1);
      expect(store.mergeLogs[store.mergeLogs.length - 1]).toEqual(mockMergeLog);
    });

    it("should reset store to initial state", () => {
      const store = useAccountMergeStore.getState();
      store.setError("Test error");
      store.setCurrentStep("execution");
      store.setSourceAccount(mockAccounts[0]);

      store.reset();

      expect(store.error).toBe(null);
      expect(store.currentStep).toBe("validation");
      expect(store.sourceAccount).toBe(null);
      expect(store.targetAccount).toBe(null);
      expect(store.mergeRequest).toBe(null);
      expect(store.isProcessing).toBe(false);
    });
  });
});