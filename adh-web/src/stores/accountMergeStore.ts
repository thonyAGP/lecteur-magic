import { create } from "zustand";
import type {
  AccountMergeState,
  AccountMergeActions,
  MergeHistory,
  Account,
  MergeValidation,
  ValidateMergeResponse,
  ExecuteMergeResponse,
  RollbackMergeResponse,
  PrintMergeTicketResponse,
} from "@/types/accountMerge";
import { useDataSourceStore } from "@/stores/dataSourceStore";
import { apiClient } from "@/services/api/apiClient";

type AccountMergeStore = AccountMergeState & AccountMergeActions & {
  reset: () => void;
  reseau: string | null;
  chronoHisto: string | null;
  reprise: boolean;
  repriseConfirmee: boolean;
  w0Reprise: boolean;
  w0RepriseConfirmee: boolean;
  w0ChronoHisto: string | null;
  w0CodeLog: string | null;
  w0FiliationGarantie: boolean;
  w0CompteRemplace: boolean;
  p0RepriseAuto: boolean;
  p0SansInterface: boolean;
  globalFlag78: boolean;
  alwaysActiveFlag: boolean;
  setReseau: (value: string | null) => void;
  setChronoHisto: (value: string | null) => void;
  setReprise: (value: boolean) => void;
  setRepriseConfirmee: (value: boolean) => void;
  setW0Reprise: (value: boolean) => void;
  setW0RepriseConfirmee: (value: boolean) => void;
  setW0ChronoHisto: (value: string | null) => void;
  setW0CodeLog: (value: string | null) => void;
  setW0FiliationGarantie: (value: boolean) => void;
  setW0CompteRemplace: (value: boolean) => void;
  setP0RepriseAuto: (value: boolean) => void;
  setP0SansInterface: (value: boolean) => void;
  setGlobalFlag78: (value: boolean) => void;
  setAlwaysActiveFlag: (value: boolean) => void;
  checkBusinessRule005: () => boolean;
  checkBusinessRule006: () => boolean;
  checkBusinessRule007: () => string;
  checkBusinessRule008: () => boolean;
  checkBusinessRule009: () => boolean;
  checkBusinessRule010: () => boolean;
  checkBusinessRule011: () => boolean;
  checkBusinessRule012: () => boolean;
  checkBusinessRule013: () => boolean;
  validateAllBusinessRules: () => boolean;
};

const mockMergeHistories: MergeHistory[] = [
  {
    id: 1,
    sourceAccount: "ACC001",
    targetAccount: "ACC002",
    mergeDate: new Date("2024-01-15T10:30:00"),
    operator: "John Doe",
    status: "completed",
  },
  {
    id: 2,
    sourceAccount: "ACC003",
    targetAccount: "ACC004",
    mergeDate: new Date("2024-01-16T14:20:00"),
    operator: "Jane Smith",
    status: "in-progress",
  },
  {
    id: 3,
    sourceAccount: "ACC005",
    targetAccount: "ACC006",
    mergeDate: new Date("2024-01-17T09:15:00"),
    operator: "Mike Johnson",
    status: "failed",
  },
  {
    id: 4,
    sourceAccount: "ACC007",
    targetAccount: "ACC008",
    mergeDate: new Date("2024-01-18T16:45:00"),
    operator: "Sarah Wilson",
    status: "completed",
  },
  {
    id: 5,
    sourceAccount: "ACC009",
    targetAccount: "ACC010",
    mergeDate: new Date("2024-01-19T11:00:00"),
    operator: "David Brown",
    status: "rollback",
  },
];

const mockSourceAccount: Account = {
  accountNumber: "ACC001",
  balance: 1250.75,
  status: "active",
  createdDate: new Date("2023-06-10"),
};

const mockTargetAccount: Account = {
  accountNumber: "ACC002",
  balance: 3450.20,
  status: "active",
  createdDate: new Date("2022-03-15"),
};

const mockValidation: MergeValidation = {
  isClosureInProgress: false,
  networkStatus: "OK",
  validationStatus: "PASSED",
};

const initialState: AccountMergeState & Pick<AccountMergeStore, "reseau" | "chronoHisto" | "reprise" | "repriseConfirmee" | "w0Reprise" | "w0RepriseConfirmee" | "w0ChronoHisto" | "w0CodeLog" | "w0FiliationGarantie" | "w0CompteRemplace" | "p0RepriseAuto" | "p0SansInterface" | "globalFlag78" | "alwaysActiveFlag"> = {
  mergeHistories: [],
  sourceAccount: null,
  targetAccount: null,
  validationState: null,
  isLoading: false,
  error: null,
  mergeProgress: 0,
  currentStep: "validation",
  reseau: null,
  chronoHisto: null,
  reprise: false,
  repriseConfirmee: false,
  w0Reprise: false,
  w0RepriseConfirmee: false,
  w0ChronoHisto: null,
  w0CodeLog: null,
  w0FiliationGarantie: false,
  w0CompteRemplace: false,
  p0RepriseAuto: false,
  p0SansInterface: false,
  globalFlag78: false,
  alwaysActiveFlag: true,
};

const handleMergeExecution = async (
  sourceAccountId: string,
  targetAccountId: string,
  state: AccountMergeStore,
  set: (partial: Partial<AccountMergeStore>) => void,
  get: () => AccountMergeStore
) => {
  if (state.currentStep === "F") { 
    throw new Error("Merge already finalized"); // RM-004
  }

  if (!state.validateAllBusinessRules()) {
    throw new Error("Business rules validation failed");
  }

  set({ mergeProgress: 25, currentStep: "transferring" });
  await new Promise((resolve) => setTimeout(resolve, 500));

  set({ mergeProgress: 50, currentStep: "updating" });
  await new Promise((resolve) => setTimeout(resolve, 500));

  set({ mergeProgress: 75, currentStep: "recording" });
  await new Promise((resolve) => setTimeout(resolve, 500));

  const isRealApi = useDataSourceStore.getState().isRealApi;

  if (isRealApi) {
    const response = await apiClient.post<ExecuteMergeResponse>(
      "/api/accountMerge/execute",
      {
        sourceAccountId,
        targetAccountId,
      }
    );

    if (!response.success) {
      throw new Error(response.error || "Merge execution failed");
    }

    set({
      mergeProgress: 100,
      currentStep: "completed",
      isLoading: false,
      mergeHistories: [...state.mergeHistories, response.data],
    });
  } else {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const mergeStatus = state.checkBusinessRule007();

    const newHistory: MergeHistory = {
      id: Date.now(),
      sourceAccount: sourceAccountId,
      targetAccount: targetAccountId,
      mergeDate: new Date(),
      operator: "Current User",
      status: mergeStatus,
    };

    set({
      mergeProgress: 100,
      currentStep: "completed",
      isLoading: false,
      mergeHistories: [...state.mergeHistories, newHistory],
    });
  }
};

const handleValidationSuccess = (
  validation: MergeValidation,
  sourceAccountId: string,
  targetAccountId: string,
  set: (partial: Partial<AccountMergeStore>) => void
) => {
  set({
    validationState: validation,
    reseau: validation.networkStatus,
    chronoHisto: "6",
    reprise: false,
    repriseConfirmee: false,
    sourceAccount: { ...mockSourceAccount, accountNumber: sourceAccountId },
    targetAccount: { ...mockTargetAccount, accountNumber: targetAccountId },
    currentStep: "validated",
    isLoading: false,
  });
};

export const useAccountMergeStore = create<AccountMergeStore>((set, get) => ({
  ...initialState,

  checkBusinessRule005: () => {
    // RM-005: Condition: W0 chrono histo [BA] different de 'F'
    const state = get();
    return state.w0ChronoHisto !== "F";
  },

  checkBusinessRule006: () => {
    // RM-006: Negation de (W0 code LOG existe [BB]) (condition inversee)
    const state = get();
    return !state.w0CodeLog;
  },

  checkBusinessRule007: () => {
    // RM-007: Si W0 Filiation garantie ... [BF] alors IF (W0 reprise confirmee [BD] sinon 'RETRY','DONE'),'PASSED')
    const state = get();
    if (state.w0FiliationGarantie) {
      return state.w0RepriseConfirmee ? "DONE" : "RETRY";
    }
    return "PASSED";
  },

  checkBusinessRule008: () => {
    // RM-008: Negation de (W0 reprise confirmee [BD]) (condition inversee)
    const state = get();
    return !state.w0RepriseConfirmee;
  },

  checkBusinessRule009: () => {
    // RM-009: Negation de (W0 Compte remplace à l... [BI]) (condition inversee)
    const state = get();
    return !state.w0CompteRemplace;
  },

  checkBusinessRule010: () => {
    // RM-010: Condition composite: [BK]=6 OR P0 Reprise Auto [I]
    const state = get();
    return state.chronoHisto === "6" || state.p0RepriseAuto;
  },

  checkBusinessRule011: () => {
    // RM-011: Condition toujours vraie (flag actif)
    const state = get();
    return state.alwaysActiveFlag;
  },

  checkBusinessRule012: () => {
    // RM-012: Negation de P0.Sans interface [J] (condition inversee)
    const state = get();
    return !state.p0SansInterface;
  },

  checkBusinessRule013: () => {
    // RM-013: Negation de VG78 (condition inversee)
    const state = get();
    return !state.globalFlag78;
  },

  validateAllBusinessRules: () => {
    const state = get();
    return (
      state.checkBusinessRule005() &&
      state.checkBusinessRule006() &&
      state.checkBusinessRule008() &&
      state.checkBusinessRule009() &&
      state.checkBusinessRule010() &&
      state.checkBusinessRule011() &&
      state.checkBusinessRule012() &&
      state.checkBusinessRule013()
    );
  },

  validateMergeConditions: async (sourceAccountId: string, targetAccountId: string) => {
    set({ isLoading: true, error: null });

    try {
      const isRealApi = useDataSourceStore.getState().isRealApi;

      if (isRealApi) {
        const response = await apiClient.get<ValidateMergeResponse>(
          `/api/accountMerge/validation?sourceAccountId=${sourceAccountId}&targetAccountId=${targetAccountId}`
        );

        if (!response.success) {
          throw new Error(response.error || "Validation failed");
        }

        const validation = response.data;

        if (validation.validationStatus === "V") { 
          throw new Error("Closure in progress, merge not allowed"); // RM-002
        }

        if (validation.validationStatus !== "V") { // RM-003
          if (validation.networkStatus !== "R") { // RM-001
            handleValidationSuccess(validation, sourceAccountId, targetAccountId, set);
          } else {
            throw new Error("Network blocked, merge not allowed");
          }
        }
      } else {
        await new Promise((resolve) => setTimeout(resolve, 800));

        const mockValidationState = {
          isClosureInProgress: false,
          networkStatus: "OK",
          validationStatus: "PASSED",
        };

        if (mockValidationState.validationStatus === "V") { 
          throw new Error("Closure in progress, merge not allowed"); // RM-002
        }

        if (mockValidationState.validationStatus !== "V") { // RM-003
          if (mockValidationState.networkStatus !== "R") { // RM-001
            handleValidationSuccess(mockValidationState, sourceAccountId, targetAccountId, set);
          } else {
            throw new Error("Network blocked, merge not allowed");
          }
        }
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Unknown error occurred";
      set({ error: errorMessage, isLoading: false });
      throw e;
    }
  },

  executeMerge: async (sourceAccountId: string, targetAccountId: string) => {
    set({ isLoading: true, error: null, mergeProgress: 0 });

    try {
      const state = get();
      await handleMergeExecution(sourceAccountId, targetAccountId, state, set, get);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Unknown error occurred";
      set({ error: errorMessage, isLoading: false, mergeProgress: 0 });
      throw e;
    }
  },

  createMergeHistory: async (sourceAccount: string, targetAccount: string, operator: string) => {
    set({ isLoading: true, error: null });

    try {
      const isRealApi = useDataSourceStore.getState().isRealApi;
      const state = get();

      if (isRealApi) {
        const response = await apiClient.post<ExecuteMergeResponse>(
          "/api/accountMerge/history",
          {
            sourceAccount,
            targetAccount,
            operator,
          }
        );

        if (!response.success) {
          throw new Error(response.error || "Failed to create merge history");
        }

        set({
          mergeHistories: [...state.mergeHistories, response.data],
          isLoading: false,
        });
      } else {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const newHistory: MergeHistory = {
          id: Date.now(),
          sourceAccount,
          targetAccount,
          mergeDate: new Date(),
          operator,
          status: "completed",
        };

        set({
          mergeHistories: [...state.mergeHistories, newHistory],
          isLoading: false,
        });
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Unknown error occurred";
      set({ error: errorMessage, isLoading: false });
      throw e;
    }
  },

  rollbackMerge: async (mergeHistoryId: number) => {
    set({ isLoading: true, error: null });

    try {
      const isRealApi = useDataSourceStore.getState().isRealApi;
      const state = get();

      if (isRealApi) {
        const response = await apiClient.post<RollbackMergeResponse>(
          "/api/accountMerge/rollback",
          {
            mergeHistoryId,
          }
        );

        if (!response.success) {
          throw new Error(response.error || "Rollback failed");
        }

        set({
          mergeHistories: state.mergeHistories.map((h) =>
            h.id === mergeHistoryId ? { ...h, status: "rollback" } : h
          ),
          isLoading: false,
        });
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        set({
          mergeHistories: state.mergeHistories.map((h) =>
            h.id === mergeHistoryId ? { ...h, status: "rollback" } : h
          ),
          isLoading: false,
        });
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Unknown error occurred";
      set({ error: errorMessage, isLoading: false });
      throw e;
    }
  },

  printMergeTicket: async (mergeHistoryId: number) => {
    set({ isLoading: true, error: null });

    try {
      const isRealApi = useDataSourceStore.getState().isRealApi;
      const state = get();

      if (isRealApi) {
        const response = await apiClient.post<PrintMergeTicketResponse>(
          "/api/accountMerge/print-ticket",
          {
            mergeHistoryId,
          }
        );

        if (!response.success) {
          throw new Error(response.error || "Print ticket failed");
        }

        set({ isLoading: false });
      } else {
        await new Promise((resolve) => setTimeout(resolve, 800));

        const history = state.mergeHistories.find((h) => h.id === mergeHistoryId);

        if (!history) {
          throw new Error("Merge history not found");
        }

        console.log("Printing merge ticket:", {
          id: history.id,
          sourceAccount: history.sourceAccount,
          targetAccount: history.targetAccount,
          mergeDate: history.mergeDate,
          operator: history.operator,
          status: history.status,
        });

        set({ isLoading: false });
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Unknown error occurred";
      set({ error: errorMessage, isLoading: false });
      throw e;
    }
  },

  setReseau: (value: string | null) => {
    set({ reseau: value });
  },

  setChronoHisto: (value: string | null) => {
    set({ chronoHisto: value });
  },

  setReprise: (value: boolean) => {
    set({ reprise: value });
  },

  setRepriseConfirmee: (value: boolean) => {
    set({ repriseConfirmee: value });
  },

  setW0Reprise: (value: boolean) => {
    set({ w0Reprise: value });
  },

  setW0RepriseConfirmee: (value: boolean) => {
    set({ w0RepriseConfirmee: value });
  },

  setW0ChronoHisto: (value: string | null) => {
    set({ w0ChronoHisto: value });
  },

  setW0CodeLog: (value: string | null) => {
    set({ w0CodeLog: value });
  },

  setW0FiliationGarantie: (value: boolean) => {
    set({ w0FiliationGarantie: value });
  },

  setW0CompteRemplace: (value: boolean) => {
    set({ w0CompteRemplace: value });
  },

  setP0RepriseAuto: (value: boolean) => {
    set({ p0RepriseAuto: value });
  },

  setP0SansInterface: (value: boolean) => {
    set({ p0SansInterface: value });
  },

  setGlobalFlag78: (value: boolean) => {
    set({ globalFlag78: value });
  },

  setAlwaysActiveFlag: (value: boolean) => {
    set({ alwaysActiveFlag: value });
  },

  reset: () => {
    set(initialState);
  },
}));