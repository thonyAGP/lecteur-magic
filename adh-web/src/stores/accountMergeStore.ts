import { create } from "zustand"
import type { AccountMergeState, AccountMergeActions, MergeHistory, Account, MergeValidation, ValidateResponse, ExecuteMergeResponse, MergeHistoryResponse } from "@/types/accountMerge"
import type { ApiResponse } from "@/services/api/apiClient"
import { apiClient } from "@/services/api/apiClient"
import { useDataSourceStore } from "@/stores/dataSourceStore"

type AccountMergeStore = AccountMergeState & AccountMergeActions & {
  reset: () => void
}

export const useAccountMergeStore = create<AccountMergeStore>((set, get) => ({
  mergeHistories: [],
  sourceAccount: null,
  targetAccount: null,
  validationState: null,
  isLoading: false,
  error: null,
  mergeProgress: 0,
  currentStep: 'validation',

  validateMergeConditions: async (sourceAccountId: string, targetAccountId: string) => {
    set({ isLoading: true, error: null, currentStep: 'validation' })
    
    try {
      const isRealApi = useDataSourceStore.getState().isRealApi

      if (isRealApi) {
        const response: ValidateResponse = await apiClient.get('/api/accountMerge/validation', {
          params: { sourceAccountId, targetAccountId }
        })
        
        const validation = response.data
        
        // RM-002: W0 validation [N] egale 'V'
        if (validation.validationStatus === 'V') {
          throw new Error('Closure validation is active - merge cannot proceed')
        }
        
        // RM-003: W0 validation [N] different de 'V'
        if (validation.validationStatus !== 'V') {
          // RM-001: W0 reseau [M] different de 'R'
          if (validation.networkStatus !== 'R') {
            throw new Error('Network status prevents merge operation')
          }
        }
        
        set({ validationState: validation, currentStep: 'validated' })
      } else {
        await new Promise(resolve => setTimeout(resolve, 800))
        
        const mockValidation: MergeValidation = {
          isClosureInProgress: false,
          networkStatus: 'A', // RM-001: different de 'R'
          validationStatus: 'P' // RM-003: different de 'V'
        }
        
        const mockSourceAccount: Account = {
          accountNumber: sourceAccountId,
          balance: 2450.75,
          status: 'ACTIVE',
          createdDate: new Date('2023-06-15')
        }
        
        const mockTargetAccount: Account = {
          accountNumber: targetAccountId,
          balance: 8932.50,
          status: 'ACTIVE',
          createdDate: new Date('2022-11-20')
        }
        
        set({
          validationState: mockValidation,
          sourceAccount: mockSourceAccount,
          targetAccount: mockTargetAccount,
          currentStep: 'validated'
        })
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Validation failed'
      set({ error: errorMessage, currentStep: 'validation' })
    } finally {
      set({ isLoading: false })
    }
  },

  executeMerge: async (sourceAccountId: string, targetAccountId: string) => {
    set({ isLoading: true, error: null, currentStep: 'executing', mergeProgress: 0 })
    
    try {
      const isRealApi = useDataSourceStore.getState().isRealApi
      
      if (isRealApi) {
        const response: ExecuteMergeResponse = await apiClient.post('/api/accountMerge/execute', {
          sourceAccountId,
          targetAccountId
        })
        
        const mergeHistory = response.data
        
        // Simulate progress updates
        const progressSteps = [25, 50, 75, 100]
        for (const progress of progressSteps) {
          set({ mergeProgress: progress })
          await new Promise(resolve => setTimeout(resolve, 500))
        }
        
        set({
          mergeHistories: [mergeHistory, ...get().mergeHistories],
          currentStep: 'completed',
          mergeProgress: 100
        })
      } else {
        // Simulate progress with mock data
        const progressSteps = [
          { progress: 20, step: 'Transferring transactions' },
          { progress: 40, step: 'Updating balances' },
          { progress: 60, step: 'Creating history record' },
          { progress: 80, step: 'Finalizing merge' },
          { progress: 100, step: 'Completed' }
        ]
        
        for (const { progress, step } of progressSteps) {
          set({ mergeProgress: progress, currentStep: step })
          await new Promise(resolve => setTimeout(resolve, 600))
        }
        
        // RM-007: Si W0 Filiation garantie ... [BF] alors IF
        // RM-008: Negation de (W0 reprise confirmee [BD])
        // RM-009: Negation de (W0 Compte remplace à l... [BI])
        const mockMergeHistory: MergeHistory = {
          id: Date.now(),
          sourceAccount: sourceAccountId,
          targetAccount: targetAccountId,
          mergeDate: new Date(),
          operator: 'SYSTEM_USER',
          status: 'COMPLETED'
        }
        
        const updatedSourceAccount: Account = {
          accountNumber: sourceAccountId,
          balance: 0,
          status: 'MERGED',
          createdDate: new Date('2023-06-15')
        }
        
        const updatedTargetAccount: Account = {
          accountNumber: targetAccountId,
          balance: 11383.25, // Combined balance
          status: 'ACTIVE',
          createdDate: new Date('2022-11-20')
        }
        
        set({
          mergeHistories: [mockMergeHistory, ...get().mergeHistories],
          sourceAccount: updatedSourceAccount,
          targetAccount: updatedTargetAccount,
          currentStep: 'completed',
          mergeProgress: 100
        })
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Merge execution failed'
      set({ error: errorMessage, currentStep: 'executing' })
    } finally {
      set({ isLoading: false })
    }
  },

  createMergeHistory: async (sourceAccount: string, targetAccount: string, operator: string) => {
    set({ isLoading: true, error: null })
    
    try {
      const isRealApi = useDataSourceStore.getState().isRealApi
      
      if (isRealApi) {
        await apiClient.get('/api/accountMerge/history', {
          params: { accountId: sourceAccount }
        })
      } else {
        await new Promise(resolve => setTimeout(resolve, 400))
        
        // RM-004: W0 chrono histo [BA] egale 'F'
        // RM-005: W0 chrono histo [BA] different de 'F'
        // RM-006: Negation de (W0 code LOG existe [BB])
        const newHistory: MergeHistory = {
          id: Date.now(),
          sourceAccount,
          targetAccount,
          mergeDate: new Date(),
          operator,
          status: 'PENDING'
        }
        
        set({
          mergeHistories: [newHistory, ...get().mergeHistories]
        })
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Failed to create merge history'
      set({ error: errorMessage })
    } finally {
      set({ isLoading: false })
    }
  },

  rollbackMerge: async (mergeHistoryId: number) => {
    set({ isLoading: true, error: null, currentStep: 'rolling_back' })
    
    try {
      const isRealApi = useDataSourceStore.getState().isRealApi
      
      if (isRealApi) {
        await apiClient.post('/api/accountMerge/rollback', { mergeHistoryId })
      } else {
        await new Promise(resolve => setTimeout(resolve, 1200))
        
        // RM-011: Condition toujours vraie (flag actif)
        // RM-010: Condition composite: [BK]=6 OR P0 Reprise Auto [I]
        const updatedHistories = get().mergeHistories.map(history =>
          history.id === mergeHistoryId
            ? { ...history, status: 'ROLLED_BACK' }
            : history
        )
        
        set({
          mergeHistories: updatedHistories,
          currentStep: 'rollback_completed'
        })
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Rollback failed'
      set({ error: errorMessage })
    } finally {
      set({ isLoading: false })
    }
  },

  printMergeTicket: async (mergeHistoryId: number) => {
    set({ isLoading: true, error: null })
    
    try {
      const isRealApi = useDataSourceStore.getState().isRealApi
      
      if (isRealApi) {
        await apiClient.post('/api/accountMerge/print-ticket', { mergeHistoryId })
      } else {
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // RM-012: Negation de P0.Sans interface [J]
        // RM-013: Negation de VG78
        const history = get().mergeHistories.find(h => h.id === mergeHistoryId)
        if (!history) {
          throw new Error('Merge history not found')
        }
        
        // Mock printing process
        console.log(`Printing merge ticket for merge ID: ${mergeHistoryId}`)
        console.log(`Source: ${history.sourceAccount} -> Target: ${history.targetAccount}`)
        console.log(`Date: ${history.mergeDate.toLocaleDateString()}`)
        console.log(`Operator: ${history.operator}`)
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Print ticket failed'
      set({ error: errorMessage })
    } finally {
      set({ isLoading: false })
    }
  },

  reset: () => {
    set({
      mergeHistories: [],
      sourceAccount: null,
      targetAccount: null,
      validationState: null,
      isLoading: false,
      error: null,
      mergeProgress: 0,
      currentStep: 'validation'
    })
  }
}))