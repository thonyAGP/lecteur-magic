/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useAccountMergeStore } from '@/stores/accountMergeStore'
import type { ValidationStatus, Account, MergeRequest, MergeHistory, MergeLog } from '@/types/accountMerge'
import { useDataSourceStore } from '@/stores/dataSourceStore'

const MOCK_VALIDATION_STATUS: ValidationStatus = {
  network: true,
  closure: false,
  validation: 'V'
}

const MOCK_SOURCE_ACCOUNT: Account = {
  id: 100245,
  status: 'active',
  balance: 15750.85,
  clientName: 'Martin Dupont',
  linkedAccounts: 2
}

const MOCK_TARGET_ACCOUNT: Account = {
  id: 100123,
  status: 'active',
  balance: 8432.90,
  clientName: 'Martin Dupont',
  linkedAccounts: 1
}

const MOCK_MERGE_REQUEST: MergeRequest = {
  id: 1001,
  sourceAccountId: 100245,
  targetAccountId: 100123,
  status: 'completed',
  validatedBy: 'admin',
  validatedAt: new Date('2024-01-15T10:30:00'),
  chronoCode: 'F2024001'
}

const MOCK_MERGE_HISTORY: MergeHistory[] = [
  {
    id: 1,
    mergeRequestId: 1001,
    timestamp: new Date('2024-01-15T10:30:00'),
    operation: 'FUSION_COMPLETE',
    details: 'Fusion compte 100245 vers 100123 - 2850 enregistrements transférés'
  },
  {
    id: 2,
    mergeRequestId: 1002,
    timestamp: new Date('2024-01-20T14:15:00'),
    operation: 'FUSION_ANNULEE',
    details: 'Fusion compte 100378 vers 100156 - Annulée par utilisateur'
  }
]

const MOCK_MERGE_LOGS: MergeLog[] = [
  {
    id: 1,
    mergeId: 1001,
    operation: 'TRANSFER',
    tableName: 'compte_gm',
    recordCount: 1,
    timestamp: new Date('2024-01-15T10:30:00'),
    success: true
  },
  {
    id: 2,
    mergeId: 1001,
    operation: 'TRANSFER',
    tableName: 'prestations',
    recordCount: 245,
    timestamp: new Date('2024-01-15T10:35:00'),
    success: true
  }
]

vi.mock('@/services/api/apiClient', () => ({
  apiClient: {
    post: vi.fn(),
    get: vi.fn(),
    delete: vi.fn()
  }
}))

vi.mock('@/stores/dataSourceStore', () => ({
  useDataSourceStore: {
    getState: vi.fn()
  }
}))

const { apiClient } = await import('@/services/api/apiClient')

describe('accountMergeStore', () => {
  beforeEach(() => {
    useAccountMergeStore.getState().reset()
    vi.clearAllMocks()
    vi.mocked(useDataSourceStore.getState).mockReturnValue({ isRealApi: false } as ReturnType<typeof useDataSourceStore.getState>)
  })

  describe('validatePrerequisites', () => {
    it('should validate prerequisites successfully with mock data', async () => {
      const store = useAccountMergeStore.getState()
      
      const result = await store.validatePrerequisites()
      
      const updatedState = useAccountMergeStore.getState()
      
      expect(result).toEqual(MOCK_VALIDATION_STATUS)
      expect(updatedState.validationStatus).toEqual(MOCK_VALIDATION_STATUS)
      expect(updatedState.isProcessing).toBe(false)
      expect(updatedState.error).toBe(null)
    })

    it('should validate prerequisites with real API', async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({ isRealApi: true } as ReturnType<typeof useDataSourceStore.getState>)
      vi.mocked(apiClient.post).mockResolvedValueOnce({
        data: { success: true, data: MOCK_VALIDATION_STATUS }
      })
      
      const store = useAccountMergeStore.getState()
      
      const result = await store.validatePrerequisites()
      
      const updatedState = useAccountMergeStore.getState()
      
      expect(apiClient.post).toHaveBeenCalledWith('/api/account-merge/validate')
      expect(result).toEqual(MOCK_VALIDATION_STATUS)
      expect(updatedState.validationStatus).toEqual(MOCK_VALIDATION_STATUS)
    })

    it('should handle validation error with real API', async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({ isRealApi: true } as ReturnType<typeof useDataSourceStore.getState>)
      vi.mocked(apiClient.post).mockResolvedValueOnce({
        data: { success: false, message: 'Network validation failed' }
      })
      
      const store = useAccountMergeStore.getState()
      
      await expect(store.validatePrerequisites()).rejects.toThrow('Network validation failed')
      
      const updatedState = useAccountMergeStore.getState()
      expect(updatedState.error).toBe('Network validation failed')
      expect(updatedState.isProcessing).toBe(false)
    })

    it('should handle network error', async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({ isRealApi: true } as ReturnType<typeof useDataSourceStore.getState>)
      vi.mocked(apiClient.post).mockRejectedValueOnce(new Error('Network error'))
      
      const store = useAccountMergeStore.getState()
      
      await expect(store.validatePrerequisites()).rejects.toThrow('Network error')
      
      const updatedState = useAccountMergeStore.getState()
      expect(updatedState.error).toBe('Network error')
      expect(updatedState.isProcessing).toBe(false)
    })

    it('should set loading state during validation', async () => {
      const store = useAccountMergeStore.getState()
      
      const promise = store.validatePrerequisites()
      
      const duringState = useAccountMergeStore.getState()
      expect(duringState.isProcessing).toBe(true)
      expect(duringState.error).toBe(null)
      
      await promise
    })
  })

  describe('loadAccounts', () => {
    it('should load accounts successfully with mock data', async () => {
      const store = useAccountMergeStore.getState()
      
      const result = await store.loadAccounts(100245, 100123)
      
      const updatedState = useAccountMergeStore.getState()
      
      expect(result.source).toEqual(expect.objectContaining({ id: 100245 }))
      expect(result.target).toEqual(expect.objectContaining({ id: 100123 }))
      expect(updatedState.sourceAccount).toEqual(expect.objectContaining({ id: 100245 }))
      expect(updatedState.targetAccount).toEqual(expect.objectContaining({ id: 100123 }))
      expect(updatedState.isProcessing).toBe(false)
    })

    it('should load accounts with real API', async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({ isRealApi: true } as ReturnType<typeof useDataSourceStore.getState>)
      vi.mocked(apiClient.post).mockResolvedValueOnce({
        data: { 
          success: true, 
          data: { source: MOCK_SOURCE_ACCOUNT, target: MOCK_TARGET_ACCOUNT }
        }
      })
      
      const store = useAccountMergeStore.getState()
      
      const result = await store.loadAccounts(100245, 100123)
      
      expect(apiClient.post).toHaveBeenCalledWith('/api/account-merge/load-accounts', {
        sourceAccountId: 100245,
        targetAccountId: 100123
      })
      expect(result.source).toEqual(MOCK_SOURCE_ACCOUNT)
      expect(result.target).toEqual(MOCK_TARGET_ACCOUNT)
    })

    it('should handle account loading error', async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({ isRealApi: true } as ReturnType<typeof useDataSourceStore.getState>)
      vi.mocked(apiClient.post).mockResolvedValueOnce({
        data: { success: false, message: 'Account not found' }
      })
      
      const store = useAccountMergeStore.getState()
      
      await expect(store.loadAccounts(100245, 100123)).rejects.toThrow('Account not found')
      
      const updatedState = useAccountMergeStore.getState()
      expect(updatedState.error).toBe('Account not found')
    })
  })

  describe('executeMerge', () => {
    it('should execute merge successfully with mock data', async () => {
      const store = useAccountMergeStore.getState()
      
      const result = await store.executeMerge()
      
      const updatedState = useAccountMergeStore.getState()
      
      expect(result).toEqual(expect.objectContaining({
        sourceAccountId: 100245,
        targetAccountId: 100123,
        status: 'completed'
      }))
      expect(updatedState.mergeRequest).toBeTruthy()
      expect(updatedState.currentStep).toBe('completion')
      expect(updatedState.isProcessing).toBe(false)
    })

    it('should execute merge with parameters', async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({ isRealApi: true } as ReturnType<typeof useDataSourceStore.getState>)
      vi.mocked(apiClient.post).mockResolvedValueOnce({
        data: { success: true, data: MOCK_MERGE_REQUEST }
      })
      
      const store = useAccountMergeStore.getState()
      
      await store.executeMerge(true, false)
      
      expect(apiClient.post).toHaveBeenCalledWith('/api/account-merge/execute', {
        autoResume: true,
        withoutInterface: false
      })
    })

    it('should handle merge execution error', async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({ isRealApi: true } as ReturnType<typeof useDataSourceStore.getState>)
      vi.mocked(apiClient.post).mockRejectedValueOnce(new Error('Merge failed'))
      
      const store = useAccountMergeStore.getState()
      
      await expect(store.executeMerge()).rejects.toThrow('Merge failed')
      
      const updatedState = useAccountMergeStore.getState()
      expect(updatedState.error).toBe('Merge failed')
      expect(updatedState.isProcessing).toBe(false)
    })

    it('should update progress during mock execution', async () => {
      const store = useAccountMergeStore.getState()
      
      await store.executeMerge()
      
      const updatedState = useAccountMergeStore.getState()
      expect(updatedState.progressData.current).toBeGreaterThan(0)
      expect(updatedState.progressData.total).toBeGreaterThan(0)
      expect(updatedState.progressData.table).toBeTruthy()
    })

    it('should set step progression correctly', async () => {
      const store = useAccountMergeStore.getState()
      
      const promise = store.executeMerge()
      
      const duringState = useAccountMergeStore.getState()
      expect(duringState.currentStep).toBe('preparation')
      
      await promise
      
      const afterState = useAccountMergeStore.getState()
      expect(afterState.currentStep).toBe('completion')
    })
  })

  describe('saveMergeHistory', () => {
    it('should save merge history successfully with mock data', async () => {
      const store = useAccountMergeStore.getState()
      
      await expect(store.saveMergeHistory(1001, 'FUSION_COMPLETE', 'Test merge')).resolves.not.toThrow()
      
      const updatedState = useAccountMergeStore.getState()
      expect(updatedState.error).toBe(null)
    })

    it('should save merge history with real API', async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({ isRealApi: true } as ReturnType<typeof useDataSourceStore.getState>)
      vi.mocked(apiClient.post).mockResolvedValueOnce({
        data: { success: true }
      })
      
      const store = useAccountMergeStore.getState()
      
      await store.saveMergeHistory(1001, 'FUSION_COMPLETE', 'Test merge')
      
      expect(apiClient.post).toHaveBeenCalledWith('/api/account-merge/history', {
        mergeId: 1001,
        operation: 'FUSION_COMPLETE',
        details: 'Test merge'
      })
    })

    it('should handle save history error', async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({ isRealApi: true } as ReturnType<typeof useDataSourceStore.getState>)
      vi.mocked(apiClient.post).mockRejectedValueOnce(new Error('Save failed'))
      
      const store = useAccountMergeStore.getState()
      
      await expect(store.saveMergeHistory(1001, 'FUSION_COMPLETE')).rejects.toThrow('Save failed')
      
      const updatedState = useAccountMergeStore.getState()
      expect(updatedState.error).toBe('Save failed')
    })
  })

  describe('writeMergeLogs', () => {
    it('should write merge logs successfully with mock data', async () => {
      const store = useAccountMergeStore.getState()
      
      await expect(store.writeMergeLogs(1001, 'compte_gm', 1, true)).resolves.not.toThrow()
      
      const updatedState = useAccountMergeStore.getState()
      expect(updatedState.error).toBe(null)
    })

    it('should write merge logs with real API', async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({ isRealApi: true } as ReturnType<typeof useDataSourceStore.getState>)
      vi.mocked(apiClient.post).mockResolvedValueOnce({
        data: { success: true }
      })
      
      const store = useAccountMergeStore.getState()
      
      await store.writeMergeLogs(1001, 'prestations', 245, true)
      
      expect(apiClient.post).toHaveBeenCalledWith('/api/account-merge/logs', {
        mergeId: 1001,
        tableName: 'prestations',
        recordCount: 245,
        success: true
      })
    })

    it('should handle write logs error', async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({ isRealApi: true } as ReturnType<typeof useDataSourceStore.getState>)
      vi.mocked(apiClient.post).mockRejectedValueOnce(new Error('Write failed'))
      
      const store = useAccountMergeStore.getState()
      
      await expect(store.writeMergeLogs(1001, 'compte_gm', 1, false)).rejects.toThrow('Write failed')
      
      const updatedState = useAccountMergeStore.getState()
      expect(updatedState.error).toBe('Write failed')
    })
  })

  describe('cleanupTemporaryData', () => {
    it('should cleanup temporary data successfully with mock data', async () => {
      const store = useAccountMergeStore.getState()
      
      await expect(store.cleanupTemporaryData(1001)).resolves.not.toThrow()
      
      const updatedState = useAccountMergeStore.getState()
      expect(updatedState.error).toBe(null)
    })

    it('should cleanup temporary data with real API', async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({ isRealApi: true } as ReturnType<typeof useDataSourceStore.getState>)
      vi.mocked(apiClient.delete).mockResolvedValueOnce({
        data: { success: true }
      })
      
      const store = useAccountMergeStore.getState()
      
      await store.cleanupTemporaryData(1001)
      
      expect(apiClient.delete).toHaveBeenCalledWith('/api/account-merge/cleanup/1001')
    })

    it('should handle cleanup error', async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({ isRealApi: true } as ReturnType<typeof useDataSourceStore.getState>)
      vi.mocked(apiClient.delete).mockRejectedValueOnce(new Error('Cleanup failed'))
      
      const store = useAccountMergeStore.getState()
      
      await expect(store.cleanupTemporaryData(1001)).rejects.toThrow('Cleanup failed')
      
      const updatedState = useAccountMergeStore.getState()
      expect(updatedState.error).toBe('Cleanup failed')
    })
  })

  describe('printMergeTicket', () => {
    it('should print merge ticket successfully with mock data', async () => {
      const store = useAccountMergeStore.getState()
      
      await expect(store.printMergeTicket(1001)).resolves.not.toThrow()
      
      const updatedState = useAccountMergeStore.getState()
      expect(updatedState.error).toBe(null)
    })

    it('should print merge ticket with real API', async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({ isRealApi: true } as ReturnType<typeof useDataSourceStore.getState>)
      vi.mocked(apiClient.post).mockResolvedValueOnce({
        data: { success: true }
      })
      
      const store = useAccountMergeStore.getState()
      
      await store.printMergeTicket(1001)
      
      expect(apiClient.post).toHaveBeenCalledWith('/api/account-merge/print/1001')
    })

    it('should handle print error', async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({ isRealApi: true } as ReturnType<typeof useDataSourceStore.getState>)
      vi.mocked(apiClient.post).mockRejectedValueOnce(new Error('Print failed'))
      
      const store = useAccountMergeStore.getState()
      
      await expect(store.printMergeTicket(1001)).rejects.toThrow('Print failed')
      
      const updatedState = useAccountMergeStore.getState()
      expect(updatedState.error).toBe('Print failed')
    })
  })

  describe('cancelMerge', () => {
    it('should cancel merge successfully with mock data', async () => {
      const store = useAccountMergeStore.getState()
      store.setCurrentStep('execution')
      store.updateProgress(5, 10, 'prestations')
      
      await store.cancelMerge()
      
      const updatedState = useAccountMergeStore.getState()
      expect(updatedState.mergeRequest).toBe(null)
      expect(updatedState.currentStep).toBe('validation')
      expect(updatedState.progressData).toEqual({ current: 0, total: 0, table: '' })
      expect(updatedState.isProcessing).toBe(false)
    })

    it('should cancel merge with real API', async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({ isRealApi: true } as ReturnType<typeof useDataSourceStore.getState>)
      vi.mocked(apiClient.delete).mockResolvedValueOnce({
        data: { success: true }
      })
      
      const store = useAccountMergeStore.getState()
      
      await store.cancelMerge()
      
      expect(apiClient.delete).toHaveBeenCalledWith('/api/account-merge/cancel')
    })

    it('should handle cancel error', async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({ isRealApi: true } as ReturnType<typeof useDataSourceStore.getState>)
      vi.mocked(apiClient.delete).mockRejectedValueOnce(new Error('Cancel failed'))
      
      const store = useAccountMergeStore.getState()
      
      await expect(store.cancelMerge()).rejects.toThrow('Cancel failed')
      
      const updatedState = useAccountMergeStore.getState()
      expect(updatedState.error).toBe('Cancel failed')
      expect(updatedState.isProcessing).toBe(false)
    })
  })

  describe('getMergeHistory', () => {
    it('should get merge history successfully with mock data', async () => {
      const store = useAccountMergeStore.getState()
      
      const result = await store.getMergeHistory()
      
      const updatedState = useAccountMergeStore.getState()
      
      expect(result).toHaveLength(5)
      expect(result[0]).toEqual(expect.objectContaining({
        operation: 'FUSION_COMPLETE',
        mergeRequestId: 1001
      }))
      expect(updatedState.mergeHistory).toEqual(result)
      expect(updatedState.isProcessing).toBe(false)
    })

    it('should get merge history with filters and real API', async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({ isRealApi: true } as ReturnType<typeof useDataSourceStore.getState>)
      vi.mocked(apiClient.get).mockResolvedValueOnce({
        data: { success: true, data: MOCK_MERGE_HISTORY }
      })
      
      const store = useAccountMergeStore.getState()
      const filters = {
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        accountId: 100245
      }
      
      const result = await store.getMergeHistory(filters)
      
      expect(apiClient.get).toHaveBeenCalledWith(expect.stringContaining('/api/account-merge/history?'))
      expect(result).toEqual(MOCK_MERGE_HISTORY)
    })

    it('should handle get history error', async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({ isRealApi: true } as ReturnType<typeof useDataSourceStore.getState>)
      vi.mocked(apiClient.get).mockRejectedValueOnce(new Error('History fetch failed'))
      
      const store = useAccountMergeStore.getState()
      
      await expect(store.getMergeHistory()).rejects.toThrow('History fetch failed')
      
      const updatedState = useAccountMergeStore.getState()
      expect(updatedState.error).toBe('History fetch failed')
    })
  })

  describe('getMergeLogs', () => {
    it('should get merge logs successfully with mock data', async () => {
      const store = useAccountMergeStore.getState()
      
      const result = await store.getMergeLogs(1001)
      
      const updatedState = useAccountMergeStore.getState()
      
      expect(result).toHaveLength(5)
      expect(result[0]).toEqual(expect.objectContaining({
        mergeId: 1001,
        tableName: 'compte_gm',
        success: true
      }))
      expect(updatedState.mergeLogs).toEqual(result)
      expect(updatedState.isProcessing).toBe(false)
    })

    it('should get merge logs with real API', async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({ isRealApi: true } as ReturnType<typeof useDataSourceStore.getState>)
      vi.mocked(apiClient.get).mockResolvedValueOnce({
        data: { success: true, data: MOCK_MERGE_LOGS }
      })
      
      const store = useAccountMergeStore.getState()
      
      const result = await store.getMergeLogs(1001)
      
      expect(apiClient.get).toHaveBeenCalledWith('/api/account-merge/logs/1001')
      expect(result).toEqual(MOCK_MERGE_LOGS)
    })

    it('should handle get logs error', async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({ isRealApi: true } as ReturnType<typeof useDataSourceStore.getState>)
      vi.mocked(apiClient.get).mockRejectedValueOnce(new Error('Logs fetch failed'))
      
      const store = useAccountMergeStore.getState()
      
      await expect(store.getMergeLogs(1001)).rejects.toThrow('Logs fetch failed')
      
      const updatedState = useAccountMergeStore.getState()
      expect(updatedState.error).toBe('Logs fetch failed')
    })
  })

  describe('setCurrentStep', () => {
    it('should update current step correctly', () => {
      const store = useAccountMergeStore.getState()
      
      store.setCurrentStep('preparation')
      expect(useAccountMergeStore.getState().currentStep).toBe('preparation')
      
      store.setCurrentStep('execution')
      expect(useAccountMergeStore.getState().currentStep).toBe('execution')
      
      store.setCurrentStep('completion')
      expect(useAccountMergeStore.getState().currentStep).toBe('completion')
    })
  })

  describe('updateProgress', () => {
    it('should update progress data correctly', () => {
      const store = useAccountMergeStore.getState()
      
      store.updateProgress(25, 60, 'prestations')
      
      const updatedState = useAccountMergeStore.getState()
      expect(updatedState.progressData).toEqual({
        current: 25,
        total: 60,
        table: 'prestations'
      })
    })
  })

  describe('setError', () => {
    it('should set error message', () => {
      const store = useAccountMergeStore.getState()
      
      store.setError('Test error')
      expect(useAccountMergeStore.getState().error).toBe('Test error')
      
      store.setError(null)
      expect(useAccountMergeStore.getState().error).toBe(null)
    })
  })

  describe('reset', () => {
    it('should reset store to initial state', () => {
      const store = useAccountMergeStore.getState()
      
      store.setCurrentStep('execution')
      store.setError('Test error')
      store.updateProgress(10, 20, 'test_table')
      
      store.reset()
      
      const updatedState = useAccountMergeStore.getState()
      expect(updatedState.mergeRequest).toBe(null)
      expect(updatedState.sourceAccount).toBe(null)
      expect(updatedState.targetAccount).toBe(null)
      expect(updatedState.mergeHistory).toEqual([])
      expect(updatedState.mergeLogs).toEqual([])
      expect(updatedState.validationStatus).toBe(null)
      expect(updatedState.currentStep).toBe('validation')
      expect(updatedState.isProcessing).toBe(false)
      expect(updatedState.error).toBe(null)
      expect(updatedState.progressData).toEqual({ current: 0, total: 0, table: '' })
    })
  })

  describe('business rules validation', () => {
    it('should enforce RM-001: network validation check', async () => {
      const store = useAccountMergeStore.getState()
      
      const result = await store.validatePrerequisites()
      
      expect(result.network).toBe(true)
    })

    it('should enforce RM-004: validation status check', async () => {
      const store = useAccountMergeStore.getState()
      
      const result = await store.validatePrerequisites()
      
      expect(result.validation).toBe('V')
    })

    it('should enforce closure validation check', async () => {
      const store = useAccountMergeStore.getState()
      
      const result = await store.validatePrerequisites()
      
      expect(result.closure).toBe(false)
    })

    it('should handle table transfer progression correctly', async () => {
      const store = useAccountMergeStore.getState()
      
      await store.executeMerge()
      
      const updatedState = useAccountMergeStore.getState()
      expect(updatedState.progressData.total).toBe(7)
      expect(updatedState.progressData.current).toBe(7)
    })

    it('should verify account existence before loading', async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({ isRealApi: true } as ReturnType<typeof useDataSourceStore.getState>)
      vi.mocked(apiClient.post).mockResolvedValueOnce({
        data: { success: false, message: 'Source account does not exist' }
      })
      
      const store = useAccountMergeStore.getState()
      
      await expect(store.loadAccounts(999999, 100123)).rejects.toThrow('Source account does not exist')
    })
  })
})