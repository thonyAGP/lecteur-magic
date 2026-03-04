import { describe, it, expect, beforeEach, vi, afterEach } from "vitest"
import { useAccountMergeStore } from "@/stores/accountMergeStore"
import { useDataSourceStore } from "@/stores/dataSourceStore"
import { apiClient } from "@/services/api/apiClient"
import type { ApiResponse } from "@/services/api/apiClient"
import type { MergeValidation, MergeHistory, Account } from "@/types/accountMerge"

vi.mock("@/services/api/apiClient")
vi.mock("@/stores/dataSourceStore")

const MOCK_SOURCE_ACCOUNT_ID = "ACC001"
const MOCK_TARGET_ACCOUNT_ID = "ACC002"
const MOCK_OPERATOR = "USER123"
const MOCK_MERGE_HISTORY_ID = 1001

const MOCK_SOURCE_BALANCE = 2450.75
const MOCK_TARGET_BALANCE = 8932.50
const EXPECTED_COMBINED_BALANCE = MOCK_SOURCE_BALANCE + MOCK_TARGET_BALANCE

const MOCK_VALIDATION: MergeValidation = {
  isClosureInProgress: false,
  networkStatus: 'R',
  validationStatus: 'P'
}

const MOCK_VALIDATION_CLOSURE_ACTIVE: MergeValidation = {
  isClosureInProgress: true,
  networkStatus: 'R',
  validationStatus: 'V'
}

const MOCK_VALIDATION_NETWORK_ERROR: MergeValidation = {
  isClosureInProgress: false,
  networkStatus: 'E',
  validationStatus: 'P'
}

const MOCK_SOURCE_ACCOUNT: Account = {
  accountNumber: MOCK_SOURCE_ACCOUNT_ID,
  balance: MOCK_SOURCE_BALANCE,
  status: 'ACTIVE',
  createdDate: new Date('2023-06-15')
}

const MOCK_TARGET_ACCOUNT: Account = {
  accountNumber: MOCK_TARGET_ACCOUNT_ID,
  balance: MOCK_TARGET_BALANCE,
  status: 'ACTIVE',
  createdDate: new Date('2022-11-20')
}

const MOCK_MERGE_HISTORY: MergeHistory = {
  id: MOCK_MERGE_HISTORY_ID,
  sourceAccount: MOCK_SOURCE_ACCOUNT_ID,
  targetAccount: MOCK_TARGET_ACCOUNT_ID,
  mergeDate: new Date(),
  operator: MOCK_OPERATOR,
  status: 'COMPLETED'
}

describe("accountMergeStore", () => {
  let store: ReturnType<typeof useAccountMergeStore>

  beforeEach(() => {
    vi.clearAllMocks()
    useAccountMergeStore.setState({
      mergeHistories: [],
      sourceAccount: null,
      targetAccount: null,
      validationState: null,
      isLoading: false,
      error: null,
      mergeProgress: 0,
      currentStep: 'validation'
    })
    store = useAccountMergeStore.getState()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe("validateMergeConditions with real API", () => {
    beforeEach(() => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({
        isRealApi: true
      } as never)
    })

    it("should validate merge conditions successfully", async () => {
      const mockResponse = {
        success: true,
        data: MOCK_VALIDATION
      }
      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse)

      await store.validateMergeConditions(MOCK_SOURCE_ACCOUNT_ID, MOCK_TARGET_ACCOUNT_ID)

      expect(apiClient.get).toHaveBeenCalledWith('/api/accountMerge/validation', {
        params: { sourceAccountId: MOCK_SOURCE_ACCOUNT_ID, targetAccountId: MOCK_TARGET_ACCOUNT_ID }
      })
      expect(useAccountMergeStore.getState().validationState).toEqual(MOCK_VALIDATION)
      expect(useAccountMergeStore.getState().currentStep).toBe('validated')
      expect(useAccountMergeStore.getState().isLoading).toBe(false)
      expect(useAccountMergeStore.getState().error).toBeNull()
    })

    it("should reject when validation status is 'V' (RM-002)", async () => {
      const mockResponse = {
        success: true,
        data: MOCK_VALIDATION_CLOSURE_ACTIVE
      }
      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse)

      await store.validateMergeConditions(MOCK_SOURCE_ACCOUNT_ID, MOCK_TARGET_ACCOUNT_ID)

      expect(useAccountMergeStore.getState().error).toBe('Closure validation is active - merge cannot proceed')
      expect(useAccountMergeStore.getState().currentStep).toBe('validation')
    })

    it("should reject when network status is not 'R' and validation status is not 'V' (RM-001, RM-003)", async () => {
      const mockResponse = {
        success: true,
        data: MOCK_VALIDATION_NETWORK_ERROR
      }
      vi.mocked(apiClient.get).mockResolvedValueOnce(mockResponse)

      await store.validateMergeConditions(MOCK_SOURCE_ACCOUNT_ID, MOCK_TARGET_ACCOUNT_ID)

      expect(useAccountMergeStore.getState().error).toBe('Network status prevents merge operation')
      expect(useAccountMergeStore.getState().currentStep).toBe('validation')
    })

    it("should handle API error", async () => {
      vi.mocked(apiClient.get).mockRejectedValueOnce(new Error('API Error'))

      await store.validateMergeConditions(MOCK_SOURCE_ACCOUNT_ID, MOCK_TARGET_ACCOUNT_ID)

      expect(useAccountMergeStore.getState().error).toBe('API Error')
      expect(useAccountMergeStore.getState().isLoading).toBe(false)
    })
  })

  describe("validateMergeConditions with mock data", () => {
    beforeEach(() => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({
        isRealApi: false
      } as never)
    })

    it("should use mock data and validate successfully", async () => {
      await store.validateMergeConditions(MOCK_SOURCE_ACCOUNT_ID, MOCK_TARGET_ACCOUNT_ID)

      expect(apiClient.get).not.toHaveBeenCalled()
      const finalState = useAccountMergeStore.getState()
      expect(finalState.validationState).toEqual({
        isClosureInProgress: false,
        networkStatus: 'A',
        validationStatus: 'P'
      })
      expect(finalState.sourceAccount?.balance).toBe(MOCK_SOURCE_BALANCE)
      expect(finalState.targetAccount?.balance).toBe(MOCK_TARGET_BALANCE)
      expect(finalState.currentStep).toBe('validated')
    })
  })

  describe("executeMerge with real API", () => {
    beforeEach(() => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({
        isRealApi: true
      } as never)
      vi.useFakeTimers()
    })

    it("should execute merge successfully", async () => {
      const mockResponse = {
        success: true,
        data: MOCK_MERGE_HISTORY
      }
      vi.mocked(apiClient.post).mockResolvedValueOnce(mockResponse)

      const executeMergePromise = store.executeMerge(MOCK_SOURCE_ACCOUNT_ID, MOCK_TARGET_ACCOUNT_ID)
      
      vi.advanceTimersByTime(2000)
      await executeMergePromise

      expect(apiClient.post).toHaveBeenCalledWith('/api/accountMerge/execute', {
        sourceAccountId: MOCK_SOURCE_ACCOUNT_ID,
        targetAccountId: MOCK_TARGET_ACCOUNT_ID
      })
      const finalState = useAccountMergeStore.getState()
      expect(finalState.mergeHistories).toHaveLength(1)
      expect(finalState.mergeHistories[0]).toEqual(MOCK_MERGE_HISTORY)
      expect(finalState.currentStep).toBe('completed')
      expect(finalState.mergeProgress).toBe(100)
    })

    it("should handle API error during merge", async () => {
      vi.mocked(apiClient.post).mockRejectedValueOnce(new Error('Merge failed'))

      await store.executeMerge(MOCK_SOURCE_ACCOUNT_ID, MOCK_TARGET_ACCOUNT_ID)

      expect(useAccountMergeStore.getState().error).toBe('Merge failed')
      expect(useAccountMergeStore.getState().currentStep).toBe('executing')
    })
  })

  describe("executeMerge with mock data", () => {
    beforeEach(() => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({
        isRealApi: false
      } as never)
      vi.useFakeTimers()
    })

    it("should execute merge with mock data and update balances", async () => {
      const executeMergePromise = store.executeMerge(MOCK_SOURCE_ACCOUNT_ID, MOCK_TARGET_ACCOUNT_ID)
      
      vi.advanceTimersByTime(3000)
      await executeMergePromise

      expect(apiClient.post).not.toHaveBeenCalled()
      const finalState = useAccountMergeStore.getState()
      expect(finalState.mergeHistories).toHaveLength(1)
      expect(finalState.sourceAccount?.balance).toBe(0)
      expect(finalState.sourceAccount?.status).toBe('MERGED')
      expect(finalState.targetAccount?.balance).toBe(11383.25)
      expect(finalState.targetAccount?.status).toBe('ACTIVE')
      expect(finalState.currentStep).toBe('completed')
      expect(finalState.mergeProgress).toBe(100)
    })
  })

  describe("createMergeHistory with real API", () => {
    beforeEach(() => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({
        isRealApi: true
      } as never)
    })

    it("should create merge history successfully", async () => {
      vi.mocked(apiClient.get).mockResolvedValueOnce({ success: true, data: [] })

      await store.createMergeHistory(MOCK_SOURCE_ACCOUNT_ID, MOCK_TARGET_ACCOUNT_ID, MOCK_OPERATOR)

      expect(apiClient.get).toHaveBeenCalledWith('/api/accountMerge/history', {
        params: { accountId: MOCK_SOURCE_ACCOUNT_ID }
      })
      expect(useAccountMergeStore.getState().isLoading).toBe(false)
      expect(useAccountMergeStore.getState().error).toBeNull()
    })

    it("should handle API error during history creation", async () => {
      vi.mocked(apiClient.get).mockRejectedValueOnce(new Error('History creation failed'))

      await store.createMergeHistory(MOCK_SOURCE_ACCOUNT_ID, MOCK_TARGET_ACCOUNT_ID, MOCK_OPERATOR)

      expect(useAccountMergeStore.getState().error).toBe('History creation failed')
    })
  })

  describe("createMergeHistory with mock data", () => {
    beforeEach(() => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({
        isRealApi: false
      } as never)
    })

    it("should create history with mock data", async () => {
      await store.createMergeHistory(MOCK_SOURCE_ACCOUNT_ID, MOCK_TARGET_ACCOUNT_ID, MOCK_OPERATOR)

      expect(apiClient.get).not.toHaveBeenCalled()
      const finalState = useAccountMergeStore.getState()
      expect(finalState.mergeHistories).toHaveLength(1)
      expect(finalState.mergeHistories[0].sourceAccount).toBe(MOCK_SOURCE_ACCOUNT_ID)
      expect(finalState.mergeHistories[0].targetAccount).toBe(MOCK_TARGET_ACCOUNT_ID)
      expect(finalState.mergeHistories[0].operator).toBe(MOCK_OPERATOR)
      expect(finalState.mergeHistories[0].status).toBe('PENDING')
    })
  })

  describe("rollbackMerge with real API", () => {
    beforeEach(() => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({
        isRealApi: true
      } as never)
    })

    it("should rollback merge successfully", async () => {
      vi.mocked(apiClient.post).mockResolvedValueOnce({ success: true, data: {} })

      await store.rollbackMerge(MOCK_MERGE_HISTORY_ID)

      expect(apiClient.post).toHaveBeenCalledWith('/api/accountMerge/rollback', { 
        mergeHistoryId: MOCK_MERGE_HISTORY_ID 
      })
      expect(useAccountMergeStore.getState().currentStep).toBe('rollback_completed')
      expect(useAccountMergeStore.getState().isLoading).toBe(false)
    })

    it("should handle API error during rollback", async () => {
      vi.mocked(apiClient.post).mockRejectedValueOnce(new Error('Rollback failed'))

      await store.rollbackMerge(MOCK_MERGE_HISTORY_ID)

      expect(useAccountMergeStore.getState().error).toBe('Rollback failed')
    })
  })

  describe("rollbackMerge with mock data", () => {
    beforeEach(() => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({
        isRealApi: false
      } as never)
      useAccountMergeStore.setState({
        mergeHistories: [MOCK_MERGE_HISTORY],
        sourceAccount: null,
        targetAccount: null,
        validationState: null,
        isLoading: false,
        error: null,
        mergeProgress: 0,
        currentStep: 'validation'
      })
    })

    it("should rollback merge with mock data", async () => {
      await store.rollbackMerge(MOCK_MERGE_HISTORY_ID)

      expect(apiClient.post).not.toHaveBeenCalled()
      const finalState = useAccountMergeStore.getState()
      expect(finalState.mergeHistories[0].status).toBe('ROLLED_BACK')
      expect(finalState.currentStep).toBe('rollback_completed')
    })
  })

  describe("printMergeTicket with real API", () => {
    beforeEach(() => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({
        isRealApi: true
      } as never)
    })

    it("should print merge ticket successfully", async () => {
      vi.mocked(apiClient.post).mockResolvedValueOnce({ success: true, data: {} })

      await store.printMergeTicket(MOCK_MERGE_HISTORY_ID)

      expect(apiClient.post).toHaveBeenCalledWith('/api/accountMerge/print-ticket', { 
        mergeHistoryId: MOCK_MERGE_HISTORY_ID 
      })
      expect(useAccountMergeStore.getState().isLoading).toBe(false)
      expect(useAccountMergeStore.getState().error).toBeNull()
    })

    it("should handle API error during ticket printing", async () => {
      vi.mocked(apiClient.post).mockRejectedValueOnce(new Error('Print failed'))

      await store.printMergeTicket(MOCK_MERGE_HISTORY_ID)

      expect(useAccountMergeStore.getState().error).toBe('Print failed')
    })
  })

  describe("printMergeTicket with mock data", () => {
    beforeEach(() => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({
        isRealApi: false
      } as never)
      useAccountMergeStore.setState({
        mergeHistories: [MOCK_MERGE_HISTORY],
        sourceAccount: null,
        targetAccount: null,
        validationState: null,
        isLoading: false,
        error: null,
        mergeProgress: 0,
        currentStep: 'validation'
      })
      vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    it("should print ticket with mock data", async () => {
      await store.printMergeTicket(MOCK_MERGE_HISTORY_ID)

      expect(apiClient.post).not.toHaveBeenCalled()
      expect(console.log).toHaveBeenCalledWith(`Printing merge ticket for merge ID: ${MOCK_MERGE_HISTORY_ID}`)
      expect(useAccountMergeStore.getState().isLoading).toBe(false)
    })

    it("should handle missing merge history", async () => {
      useAccountMergeStore.setState({
        mergeHistories: [],
        sourceAccount: null,
        targetAccount: null,
        validationState: null,
        isLoading: false,
        error: null,
        mergeProgress: 0,
        currentStep: 'validation'
      })

      await store.printMergeTicket(999)

      expect(useAccountMergeStore.getState().error).toBe('Merge history not found')
    })
  })

  describe("reset", () => {
    it("should reset all state to initial values", () => {
      useAccountMergeStore.setState({
        mergeHistories: [MOCK_MERGE_HISTORY],
        sourceAccount: MOCK_SOURCE_ACCOUNT,
        targetAccount: MOCK_TARGET_ACCOUNT,
        validationState: MOCK_VALIDATION,
        isLoading: true,
        error: 'Some error',
        mergeProgress: 50,
        currentStep: 'executing'
      })

      store.reset()

      const finalState = useAccountMergeStore.getState()
      expect(finalState.mergeHistories).toEqual([])
      expect(finalState.sourceAccount).toBeNull()
      expect(finalState.targetAccount).toBeNull()
      expect(finalState.validationState).toBeNull()
      expect(finalState.isLoading).toBe(false)
      expect(finalState.error).toBeNull()
      expect(finalState.mergeProgress).toBe(0)
      expect(finalState.currentStep).toBe('validation')
    })
  })
})