import type { ApiResponse } from "@/services/api/apiClient";

export const OPERATION_TYPES = {
  ENTRY: 'E',
  FUSION: 'F',
  SEPARATION: 'S',
} as const;

export type OperationType = typeof OPERATION_TYPES[keyof typeof OPERATION_TYPES];

export interface FusionSeparationHistoryEntry {
  chronoId: number;
  companyCode: string;
  referenceAccount: number;
  referenceFiliation: number;
  oldPointedAccount: number;
  oldPointedFiliation: number;
  newPointedAccount: number;
  newPointedFiliation: number;
  operationType: OperationType;
  lastName: string;
  firstName: string;
  fullName: string;
  timestamp: Date;
}

export interface CreateHistoryEntryRequest {
  companyCode: string;
  referenceAccount: number;
  referenceFiliation: number;
  oldPointedAccount: number;
  oldPointedFiliation: number;
  newPointedAccount: number;
  newPointedFiliation: number;
  operationType: OperationType;
  lastName: string;
  firstName: string;
}

export type CreateHistoryEntryResponse = ApiResponse<FusionSeparationHistoryEntry>;

export interface GetHistoryByAccountRequest {
  accountNumber: number;
  filiationNumber?: number;
}

export type GetHistoryByAccountResponse = ApiResponse<FusionSeparationHistoryEntry[]>;

export interface GetHistoryByDateRangeRequest {
  startDate: Date;
  endDate: Date;
  operationType?: OperationType;
}

export type GetHistoryByDateRangeResponse = ApiResponse<FusionSeparationHistoryEntry[]>;

export interface AccountMergeHistoryState {
  isLoading: boolean;
  error: string | null;
  lastCreatedEntry: FusionSeparationHistoryEntry | null;
  historyEntries: FusionSeparationHistoryEntry[];
}

export interface AccountMergeHistoryActions {
  createHistoryEntry: (entry: Omit<FusionSeparationHistoryEntry, 'chronoId' | 'timestamp' | 'fullName'>) => Promise<FusionSeparationHistoryEntry>;
  getHistoryByAccount: (accountNumber: number, filiationNumber?: number) => Promise<FusionSeparationHistoryEntry[]>;
  getHistoryByDateRange: (startDate: Date, endDate: Date, operationType?: OperationType) => Promise<FusionSeparationHistoryEntry[]>;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setLastCreatedEntry: (entry: FusionSeparationHistoryEntry | null) => void;
  setHistoryEntries: (entries: FusionSeparationHistoryEntry[]) => void;
  clearState: () => void;
}

export type AccountMergeHistoryStore = AccountMergeHistoryState & AccountMergeHistoryActions;

const FIRST_NAMES = ['Jean', 'Marie', 'Pierre', 'Sophie', 'Luc', 'Anne', 'Marc', 'Claire'] as const;
const LAST_NAMES = ['Dupont', 'Martin', 'Bernard', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand'] as const;

const rand = <T,>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const mockHistoryEntries = Array.from({ length: 5 }, (_, i) => {
  const lastName = rand(LAST_NAMES);
  const firstName = rand(FIRST_NAMES);

  return {
    chronoId: i + 1,
    companyCode: String(((i % 5) + 1)).padStart(2, '0'),
    referenceAccount: Math.floor(Math.random() * 8000) + 1000,
    referenceFiliation: (i % 5) + 1,
    oldPointedAccount: Math.floor(Math.random() * 8000) + 1000,
    oldPointedFiliation: (i % 5) + 1,
    newPointedAccount: Math.floor(Math.random() * 8000) + 1000,
    newPointedFiliation: (i % 5) + 1,
    operationType: rand([OPERATION_TYPES.FUSION, OPERATION_TYPES.SEPARATION]),
    lastName,
    firstName,
    fullName: `${lastName} ${firstName}`.trim(),
    timestamp: new Date(Date.now() - (Math.floor(Math.random() * 30) + 1) * 24 * 60 * 60 * 1000),
  } as FusionSeparationHistoryEntry;
});