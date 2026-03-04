import { describe, it, expect, beforeEach, vi } from "vitest";
import { useAccountMergeHistoryStore } from "@/stores/accountMergeHistoryStore";
import { useDataSourceStore } from "@/stores/dataSourceStore";
import { apiClient } from "@/services/api/apiClient";
import type { ApiResponse } from "@/services/api/apiClient";
import type { FusionSeparationHistoryEntry } from "@/types/accountMergeHistory";

const MOCK_ENTRY_BASE = {
  companyCode: "01",
  referenceAccount: 1234,
  referenceFiliation: 1,
  oldPointedAccount: 5678,
  oldPointedFiliation: 2,
  newPointedAccount: 9012,
  newPointedFiliation: 3,
  operationType: "F" as const,
  lastName: "Dupont",
  firstName: "Jean",
};

const MOCK_FULL_ENTRY: FusionSeparationHistoryEntry = {
  ...MOCK_ENTRY_BASE,
  chronoId: 42,
  fullName: "Dupont Jean",
  timestamp: new Date("2026-03-01T10:00:00Z"),
};

const MOCK_ENTRY_2: FusionSeparationHistoryEntry = {
  ...MOCK_ENTRY_BASE,
  chronoId: 43,
  referenceAccount: 1234,
  referenceFiliation: 1,
  fullName: "Martin Sophie",
  lastName: "Martin",
  firstName: "Sophie",
  timestamp: new Date("2026-03-02T11:00:00Z"),
};

const MOCK_ENTRY_3: FusionSeparationHistoryEntry = {
  ...MOCK_ENTRY_BASE,
  chronoId: 44,
  referenceAccount: 5555,
  referenceFiliation: 2,
  fullName: "Bernard Pierre",
  lastName: "Bernard",
  firstName: "Pierre",
  operationType: "S" as const,
  timestamp: new Date("2026-03-03T12:00:00Z"),
};

vi.mock("@/types/accountMergeHistory", () => ({
  OPERATION_TYPES: {
    FUSION: "F" as const,
    SEPARATION: "S" as const,
    EDIT: "E" as const,
  },
  mockHistoryEntries: [MOCK_FULL_ENTRY, MOCK_ENTRY_2, MOCK_ENTRY_3],
}));

vi.mock("@/stores/dataSourceStore");
vi.mock("@/services/api/apiClient");

const OPERATION_TYPES = {
  FUSION: "F" as const,
  SEPARATION: "S" as const,
  EDIT: "E" as const,
};

describe("accountMergeHistoryStore", () => {
  beforeEach(() => {
    useAccountMergeHistoryStore.getState().clearState();
    vi.clearAllMocks();
  });

  describe("setLoading", () => {
    it("should update isLoading state", () => {
      const store = useAccountMergeHistoryStore.getState();

      store.setLoading(true);
      expect(useAccountMergeHistoryStore.getState().isLoading).toBe(true);

      store.setLoading(false);
      expect(useAccountMergeHistoryStore.getState().isLoading).toBe(false);
    });
  });

  describe("setError", () => {
    it("should update error state", () => {
      const store = useAccountMergeHistoryStore.getState();
      const errorMessage = "Test error";

      store.setError(errorMessage);
      expect(useAccountMergeHistoryStore.getState().error).toBe(errorMessage);

      store.setError(null);
      expect(useAccountMergeHistoryStore.getState().error).toBeNull();
    });
  });

  describe("setLastCreatedEntry", () => {
    it("should update lastCreatedEntry state", () => {
      const store = useAccountMergeHistoryStore.getState();

      store.setLastCreatedEntry(MOCK_FULL_ENTRY);
      expect(useAccountMergeHistoryStore.getState().lastCreatedEntry).toBe(MOCK_FULL_ENTRY);

      store.setLastCreatedEntry(null);
      expect(useAccountMergeHistoryStore.getState().lastCreatedEntry).toBeNull();
    });
  });

  describe("setHistoryEntries", () => {
    it("should update historyEntries state", () => {
      const store = useAccountMergeHistoryStore.getState();
      const entries = [MOCK_FULL_ENTRY, MOCK_ENTRY_2];

      store.setHistoryEntries(entries);
      expect(useAccountMergeHistoryStore.getState().historyEntries).toEqual(entries);
    });
  });

  describe("clearState", () => {
    it("should reset all state to initial values", () => {
      const store = useAccountMergeHistoryStore.getState();

      store.setLoading(true);
      store.setError("Some error");
      store.setLastCreatedEntry(MOCK_FULL_ENTRY);
      store.setHistoryEntries([MOCK_FULL_ENTRY]);

      store.clearState();

      const finalState = useAccountMergeHistoryStore.getState();
      expect(finalState.isLoading).toBe(false);
      expect(finalState.error).toBeNull();
      expect(finalState.lastCreatedEntry).toBeNull();
      expect(finalState.historyEntries).toEqual([]);
    });
  });

  describe("createHistoryEntry with mock data", () => {
    beforeEach(() => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({
        isRealApi: false,
        setIsRealApi: vi.fn(),
      });
    });

    it("should create entry with generated chronoId, timestamp, and computed fullName", async () => {
      const store = useAccountMergeHistoryStore.getState();

      const result = await store.createHistoryEntry(MOCK_ENTRY_BASE);

      expect(result.chronoId).toBeGreaterThan(0);
      expect(result.chronoId).toBeLessThanOrEqual(100000);
      expect(result.timestamp).toBeInstanceOf(Date);
      
      const expectedFullName = `${MOCK_ENTRY_BASE.lastName} ${MOCK_ENTRY_BASE.firstName}`;
      expect(result.fullName).toBe(expectedFullName);

      expect(useAccountMergeHistoryStore.getState().lastCreatedEntry).toEqual(result);
      expect(useAccountMergeHistoryStore.getState().isLoading).toBe(false);
      expect(apiClient.post).not.toHaveBeenCalled();
    });

    it("should trim and concatenate lastName and firstName for fullName", async () => {
      const store = useAccountMergeHistoryStore.getState();
      const entryWithSpaces = {
        ...MOCK_ENTRY_BASE,
        lastName: "  Dupont  ",
        firstName: "  Jean  ",
      };

      const result = await store.createHistoryEntry(entryWithSpaces);

      expect(result.fullName).toBe("Dupont Jean");
    });

    it("should throw validation error for invalid operationType", async () => {
      const store = useAccountMergeHistoryStore.getState();
      const invalidEntry = {
        ...MOCK_ENTRY_BASE,
        operationType: "X" as typeof OPERATION_TYPES[keyof typeof OPERATION_TYPES],
      };

      await expect(store.createHistoryEntry(invalidEntry)).rejects.toThrow(
        "Invalid operation type: X. Must be E, F, or S."
      );

      expect(useAccountMergeHistoryStore.getState().error).toContain("Invalid operation type");
      expect(useAccountMergeHistoryStore.getState().isLoading).toBe(false);
    });
  });

  describe("createHistoryEntry with real API", () => {
    beforeEach(() => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({
        isRealApi: true,
        setIsRealApi: vi.fn(),
      });
    });

    it("should create entry via API and return response data", async () => {
      const store = useAccountMergeHistoryStore.getState();
      const mockResponse: ApiResponse<FusionSeparationHistoryEntry> = {
        success: true,
        data: MOCK_FULL_ENTRY,
      };
      vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse);

      const result = await store.createHistoryEntry(MOCK_ENTRY_BASE);

      expect(apiClient.post).toHaveBeenCalledWith(
        "/api/account-merge/history",
        {
          ...MOCK_ENTRY_BASE,
          fullName: "Dupont Jean",
        }
      );
      expect(result).toEqual(MOCK_FULL_ENTRY);
      expect(useAccountMergeHistoryStore.getState().lastCreatedEntry).toEqual(MOCK_FULL_ENTRY);
      expect(useAccountMergeHistoryStore.getState().isLoading).toBe(false);
    });

    it("should handle API error when response.success is false", async () => {
      const store = useAccountMergeHistoryStore.getState();
      const mockResponse: ApiResponse<FusionSeparationHistoryEntry> = {
        success: false,
        data: null as unknown as FusionSeparationHistoryEntry,
        error: "Database constraint violation",
      };
      vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse);

      await expect(store.createHistoryEntry(MOCK_ENTRY_BASE)).rejects.toThrow(
        "Database constraint violation"
      );

      expect(useAccountMergeHistoryStore.getState().error).toBe("Database constraint violation");
      expect(useAccountMergeHistoryStore.getState().isLoading).toBe(false);
    });

    it("should handle network error", async () => {
      const store = useAccountMergeHistoryStore.getState();
      const networkError = new Error("Network timeout");
      vi.mocked(apiClient.post).mockRejectedValueOnce(networkError);

      await expect(store.createHistoryEntry(MOCK_ENTRY_BASE)).rejects.toThrow("Network timeout");

      expect(useAccountMergeHistoryStore.getState().error).toBe("Network timeout");
      expect(useAccountMergeHistoryStore.getState().isLoading).toBe(false);
    });
  });

  describe("getHistoryByAccount with mock data", () => {
    beforeEach(() => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({
        isRealApi: false,
        setIsRealApi: vi.fn(),
      });
    });

    it("should filter by accountNumber only and sort descending", async () => {
      const store = useAccountMergeHistoryStore.getState();

      const result = await store.getHistoryByAccount(1234);

      const expectedEntries = [MOCK_ENTRY_2, MOCK_FULL_ENTRY];
      expect(result).toEqual(expectedEntries);
      expect(useAccountMergeHistoryStore.getState().historyEntries).toEqual(expectedEntries);
      expect(useAccountMergeHistoryStore.getState().isLoading).toBe(false);
      expect(apiClient.get).not.toHaveBeenCalled();
    });

    it("should filter by accountNumber and filiationNumber", async () => {
      const store = useAccountMergeHistoryStore.getState();

      const result = await store.getHistoryByAccount(1234, 1);

      const expectedEntries = [MOCK_ENTRY_2, MOCK_FULL_ENTRY];
      expect(result).toEqual(expectedEntries);
      expect(result.every((entry) => entry.referenceAccount === 1234)).toBe(true);
      expect(result.every((entry) => entry.referenceFiliation === 1)).toBe(true);
    });

    it("should return empty array when no matches found", async () => {
      const store = useAccountMergeHistoryStore.getState();

      const result = await store.getHistoryByAccount(9999);

      expect(result).toEqual([]);
      expect(useAccountMergeHistoryStore.getState().historyEntries).toEqual([]);
    });
  });

  describe("getHistoryByAccount with real API", () => {
    beforeEach(() => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({
        isRealApi: true,
        setIsRealApi: vi.fn(),
      });
    });

    it("should fetch history by accountNumber only", async () => {
      const store = useAccountMergeHistoryStore.getState();
      const mockResponse: ApiResponse<FusionSeparationHistoryEntry[]> = {
        success: true,
        data: [MOCK_FULL_ENTRY],
      };
      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse);

      const result = await store.getHistoryByAccount(1234);

      expect(apiClient.get).toHaveBeenCalledWith(
        "/api/account-merge/history?accountNumber=1234"
      );
      expect(result).toEqual([MOCK_FULL_ENTRY]);
      expect(useAccountMergeHistoryStore.getState().historyEntries).toEqual([MOCK_FULL_ENTRY]);
      expect(useAccountMergeHistoryStore.getState().isLoading).toBe(false);
    });

    it("should fetch history by accountNumber and filiationNumber", async () => {
      const store = useAccountMergeHistoryStore.getState();
      const mockResponse: ApiResponse<FusionSeparationHistoryEntry[]> = {
        success: true,
        data: [MOCK_FULL_ENTRY, MOCK_ENTRY_2],
      };
      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse);

      const result = await store.getHistoryByAccount(1234, 1);

      expect(apiClient.get).toHaveBeenCalledWith(
        "/api/account-merge/history?accountNumber=1234&filiationNumber=1"
      );
      expect(result).toEqual([MOCK_FULL_ENTRY, MOCK_ENTRY_2]);
    });

    it("should handle API error when response.success is false", async () => {
      const store = useAccountMergeHistoryStore.getState();
      const mockResponse: ApiResponse<FusionSeparationHistoryEntry[]> = {
        success: false,
        data: null as unknown as FusionSeparationHistoryEntry[],
        error: "Account not found",
      };
      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse);

      await expect(store.getHistoryByAccount(1234)).rejects.toThrow("Account not found");

      expect(useAccountMergeHistoryStore.getState().error).toBe("Account not found");
      expect(useAccountMergeHistoryStore.getState().isLoading).toBe(false);
    });

    it("should handle network error", async () => {
      const store = useAccountMergeHistoryStore.getState();
      vi.mocked(apiClient.get).mockRejectedValueOnce(new Error("Connection refused"));

      await expect(store.getHistoryByAccount(1234)).rejects.toThrow("Connection refused");

      expect(useAccountMergeHistoryStore.getState().error).toBe("Connection refused");
    });
  });

  describe("getHistoryByDateRange with mock data", () => {
    beforeEach(() => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({
        isRealApi: false,
        setIsRealApi: vi.fn(),
      });
    });

    it("should filter by date range only and sort descending", async () => {
      const store = useAccountMergeHistoryStore.getState();
      const startDate = new Date("2026-03-01T00:00:00Z");
      const endDate = new Date("2026-03-02T23:59:59Z");

      const result = await store.getHistoryByDateRange(startDate, endDate);

      const expectedEntries = [MOCK_ENTRY_2, MOCK_FULL_ENTRY];
      expect(result).toEqual(expectedEntries);
      expect(result.every((entry) => entry.timestamp >= startDate && entry.timestamp <= endDate)).toBe(true);
      expect(useAccountMergeHistoryStore.getState().historyEntries).toEqual(expectedEntries);
      expect(useAccountMergeHistoryStore.getState().isLoading).toBe(false);
      expect(apiClient.get).not.toHaveBeenCalled();
    });

    it("should filter by date range and operationType", async () => {
      const store = useAccountMergeHistoryStore.getState();
      const startDate = new Date("2026-03-01T00:00:00Z");
      const endDate = new Date("2026-03-03T23:59:59Z");

      const result = await store.getHistoryByDateRange(startDate, endDate, OPERATION_TYPES.SEPARATION);

      expect(result).toEqual([MOCK_ENTRY_3]);
      expect(result.every((entry) => entry.operationType === OPERATION_TYPES.SEPARATION)).toBe(true);
    });

    it("should return empty array when no entries in date range", async () => {
      const store = useAccountMergeHistoryStore.getState();
      const startDate = new Date("2026-01-01T00:00:00Z");
      const endDate = new Date("2026-01-31T23:59:59Z");

      const result = await store.getHistoryByDateRange(startDate, endDate);

      expect(result).toEqual([]);
    });
  });

  describe("getHistoryByDateRange with real API", () => {
    beforeEach(() => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({
        isRealApi: true,
        setIsRealApi: vi.fn(),
      });
    });

    it("should fetch history by date range only", async () => {
      const store = useAccountMergeHistoryStore.getState();
      const startDate = new Date("2026-03-01T00:00:00Z");
      const endDate = new Date("2026-03-02T23:59:59Z");
      const mockResponse: ApiResponse<FusionSeparationHistoryEntry[]> = {
        success: true,
        data: [MOCK_FULL_ENTRY, MOCK_ENTRY_2],
      };
      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse);

      const result = await store.getHistoryByDateRange(startDate, endDate);

      const params = new URLSearchParams({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });
      expect(apiClient.get).toHaveBeenCalledWith(
        `/api/account-merge/history/date-range?${params.toString()}`
      );
      expect(result).toEqual([MOCK_FULL_ENTRY, MOCK_ENTRY_2]);
      expect(useAccountMergeHistoryStore.getState().historyEntries).toEqual([MOCK_FULL_ENTRY, MOCK_ENTRY_2]);
      expect(useAccountMergeHistoryStore.getState().isLoading).toBe(false);
    });

    it("should fetch history by date range and operationType", async () => {
      const store = useAccountMergeHistoryStore.getState();
      const startDate = new Date("2026-03-01T00:00:00Z");
      const endDate = new Date("2026-03-03T23:59:59Z");
      const mockResponse: ApiResponse<FusionSeparationHistoryEntry[]> = {
        success: true,
        data: [MOCK_ENTRY_3],
      };
      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse);

      const result = await store.getHistoryByDateRange(startDate, endDate, OPERATION_TYPES.SEPARATION);

      const params = new URLSearchParams({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        operationType: OPERATION_TYPES.SEPARATION,
      });
      expect(apiClient.get).toHaveBeenCalledWith(
        `/api/account-merge/history/date-range?${params.toString()}`
      );
      expect(result).toEqual([MOCK_ENTRY_3]);
    });

    it("should handle API error when response.success is false", async () => {
      const store = useAccountMergeHistoryStore.getState();
      const startDate = new Date("2026-03-01T00:00:00Z");
      const endDate = new Date("2026-03-02T23:59:59Z");
      const mockResponse: ApiResponse<FusionSeparationHistoryEntry[]> = {
        success: false,
        data: null as unknown as FusionSeparationHistoryEntry[],
        error: "Invalid date range",
      };
      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse);

      await expect(store.getHistoryByDateRange(startDate, endDate)).rejects.toThrow("Invalid date range");

      expect(useAccountMergeHistoryStore.getState().error).toBe("Invalid date range");
      expect(useAccountMergeHistoryStore.getState().isLoading).toBe(false);
    });

    it("should handle network error", async () => {
      const store = useAccountMergeHistoryStore.getState();
      const startDate = new Date("2026-03-01T00:00:00Z");
      const endDate = new Date("2026-03-02T23:59:59Z");
      vi.mocked(apiClient.get).mockRejectedValueOnce(new Error("Timeout"));

      await expect(store.getHistoryByDateRange(startDate, endDate)).rejects.toThrow("Timeout");

      expect(useAccountMergeHistoryStore.getState().error).toBe("Timeout");
    });
  });
});