import type { ApiResponse } from "@/services/api/apiClient";

export interface MergeRequest {
  id: number;
  sourceAccountId: number;
  targetAccountId: number;
  status: string;
  validatedBy: string | null;
  validatedAt: Date | null;
  chronoCode: string;
}

export interface MergeHistory {
  id: number;
  mergeRequestId: number;
  timestamp: Date;
  operation: string;
  details: string | null;
}

export interface MergeLog {
  id: number;
  mergeId: number;
  operation: string;
  tableName: string;
  recordCount: number;
  timestamp: Date;
  success: boolean;
}

export interface Account {
  id: number;
  status: string;
  balance: number;
  clientName: string | null;
  linkedAccounts: number | null;
}

export interface ValidationStatus {
  network: boolean;
  closure: boolean;
  validation: string;
}

export interface ProgressData {
  current: number;
  total: number;
  table: string;
}

export interface AccountMergeState {
  mergeRequest: MergeRequest | null;
  sourceAccount: Account | null;
  targetAccount: Account | null;
  mergeHistory: MergeHistory[];
  mergeLogs: MergeLog[];
  validationStatus: ValidationStatus | null;
  currentStep: "validation" | "preparation" | "execution" | "completion";
  isProcessing: boolean;
  error: string | null;
  progressData: ProgressData;
}

export interface ValidatePrerequisitesRequest {
  sourceAccountId?: number;
  targetAccountId?: number;
}

export interface ValidatePrerequisitesResponse extends ValidationStatus {}

export interface LoadAccountsRequest {
  sourceAccountId: number;
  targetAccountId: number;
}

export interface LoadAccountsResponse {
  source: Account;
  target: Account;
}

export interface ExecuteMergeRequest {
  autoResume?: boolean;
  withoutInterface?: boolean;
}

export interface ExecuteMergeResponse extends MergeRequest {}

export interface SaveMergeHistoryRequest {
  mergeId: number;
  operation: string;
  details?: string;
}

export interface WriteMergeLogsRequest {
  mergeId: number;
  tableName: string;
  recordCount: number;
  success: boolean;
}

export interface CleanupTemporaryDataRequest {
  mergeId: number;
}

export interface PrintMergeTicketRequest {
  mergeId: number;
}

export interface GetMergeHistoryRequest {
  startDate?: Date;
  endDate?: Date;
  accountId?: number;
}

export interface GetMergeHistoryResponse {
  data: MergeHistory[];
}

export interface GetMergeLogsRequest {
  mergeId: number;
}

export interface GetMergeLogsResponse {
  data: MergeLog[];
}

export interface AccountMergeActions {
  validatePrerequisites: (
    sourceAccountId?: number,
    targetAccountId?: number
  ) => Promise<ValidationStatus>;
  loadAccounts: (
    sourceAccountId: number,
    targetAccountId: number
  ) => Promise<{ source: Account; target: Account }>;
  executeMerge: (
    autoResume?: boolean,
    withoutInterface?: boolean
  ) => Promise<MergeRequest>;
  saveMergeHistory: (
    mergeId: number,
    operation: string,
    details?: string
  ) => Promise<void>;
  writeMergeLogs: (
    mergeId: number,
    tableName: string,
    recordCount: number,
    success: boolean
  ) => Promise<void>;
  cleanupTemporaryData: (mergeId: number) => Promise<void>;
  printMergeTicket: (mergeId: number) => Promise<void>;
  cancelMerge: () => Promise<void>;
  getMergeHistory: (
    filters?: GetMergeHistoryRequest
  ) => Promise<MergeHistory[]>;
  getMergeLogs: (mergeId: number) => Promise<MergeLog[]>;
  setCurrentStep: (
    step: AccountMergeState["currentStep"]
  ) => void;
  setError: (error: string | null) => void;
  setProgressData: (progress: ProgressData) => void;
  setMergeRequest: (mergeRequest: MergeRequest | null) => void;
  setSourceAccount: (account: Account | null) => void;
  setTargetAccount: (account: Account | null) => void;
  setValidationStatus: (status: ValidationStatus | null) => void;
  setIsProcessing: (processing: boolean) => void;
  addMergeHistory: (history: MergeHistory) => void;
  addMergeLog: (log: MergeLog) => void;
  reset: () => void;
}

export type AccountMergeStore = AccountMergeState & AccountMergeActions;

export const MERGE_STATUS = {
  PENDING: "PENDING",
  IN_PROGRESS: "IN_PROGRESS",
  VALIDATED: "VALIDATED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  FAILED: "FAILED",
} as const;

export type MergeStatusType = (typeof MERGE_STATUS)[keyof typeof MERGE_STATUS];

export const MERGE_STEPS = {
  VALIDATION: "validation",
  PREPARATION: "preparation",
  EXECUTION: "execution",
  COMPLETION: "completion",
} as const;

export type MergeStepType = (typeof MERGE_STEPS)[keyof typeof MERGE_STEPS];

export const VALIDATION_RULES = {
  RM_001: "Vérifier que le réseau n'est pas en mode 'R'",
  RM_002_003:
    "Vérifier que la validation est à 'V' ou différente de 'V' selon le contexte",
  RM_004: "Vérifier que chrono histo est égal à 'F' pour fusion",
  RM_006: "Vérifier que le code LOG n'existe pas déjà avant création",
  RM_007_008:
    "Gérer les filiations garanties et confirmer la reprise si nécessaire",
  RM_010:
    "Si autoResume=true ou condition spéciale, activer la reprise automatique",
  RM_011: "Reprise confirmée en cas d'erreur",
  RM_012:
    "Si withoutInterface=false, afficher les écrans de progression",
  RM_013: "Si VG78 est actif, ne pas imprimer",
} as const;

export const MERGE_OPERATIONS = {
  TRANSFER: "TRANSFER",
  VALIDATION: "VALIDATION",
  CLEANUP: "CLEANUP",
  PRINT: "PRINT",
  CANCEL: "CANCEL",
  LOG_WRITE: "LOG_WRITE",
} as const;

export type MergeOperationType = (typeof MERGE_OPERATIONS)[keyof typeof MERGE_OPERATIONS];

export const DEFAULT_PROGRESS_DATA: ProgressData = {
  current: 0,
  total: 0,
  table: "",
} as const;

export const INITIAL_ACCOUNT_MERGE_STATE: AccountMergeState = {
  mergeRequest: null,
  sourceAccount: null,
  targetAccount: null,
  mergeHistory: [],
  mergeLogs: [],
  validationStatus: null,
  currentStep: "validation",
  isProcessing: false,
  error: null,
  progressData: DEFAULT_PROGRESS_DATA,
} as const;