import { apiClient } from "@/services/api/apiClient"
import type { ApiResponse } from "@/services/api/apiClient"
import type { 
  MergeValidation, 
  MergeHistory, 
  ValidateResponse, 
  ExecuteMergeResponse, 
  MergeHistoryResponse 
} from "@/types/accountMerge"
import { useDataSourceStore } from "@/stores/dataSourceStore"

export const accountMergeService = {
  validateMerge: async (
    sourceAccountId: string, 
    targetAccountId: string
  ): Promise<ValidateResponse> => {
    const isRealApi = useDataSourceStore.getState().isRealApi

    return isRealApi 
      ? await apiClient.get<MergeValidation>('/api/accountMerge/validation', {
          params: { sourceAccountId, targetAccountId }
        })
      : {
          data: {
            isClosureInProgress: false,
            networkStatus: 'OK',
            validationStatus: 'VALID'
          },
          status: 200
        }
  },

  executeMerge: async (): Promise<ExecuteMergeResponse> => {
    const isRealApi = useDataSourceStore.getState().isRealApi

    return isRealApi
      ? await apiClient.post<MergeHistory>('/api/accountMerge/execute')
      : {
          data: {
            id: Date.now(),
            sourceAccount: 'SRC001',
            targetAccount: 'TGT001',
            mergeDate: new Date(),
            operator: 'SYSTEM',
            status: 'COMPLETED'
          },
          status: 200
        }
  },

  getMergeHistory: async (
    accountId?: string, 
    dateFrom?: string, 
    dateTo?: string
  ): Promise<MergeHistoryResponse> => {
    const isRealApi = useDataSourceStore.getState().isRealApi

    return isRealApi
      ? await apiClient.get<MergeHistory[]>('/api/accountMerge/history', {
          params: { accountId, dateFrom, dateTo }
        })
      : {
          data: [{
            id: Date.now(),
            sourceAccount: 'SRC001',
            targetAccount: 'TGT001',
            mergeDate: new Date(),
            operator: 'SYSTEM',
            status: 'COMPLETED'
          }],
          status: 200
        }
  },

  rollbackMerge: async (): Promise<void> => {
    const isRealApi = useDataSourceStore.getState().isRealApi

    return isRealApi
      ? await apiClient.post('/api/accountMerge/rollback')
      : undefined
  },

  printMergeTicket: async (): Promise<void> => {
    const isRealApi = useDataSourceStore.getState().isRealApi

    return isRealApi
      ? await apiClient.post('/api/accountMerge/print-ticket')
      : undefined
  },

  writeHistoFusSep: async (mergeData: MergeHistory): Promise<ApiResponse<void>> => { // RM-29
    const isRealApi = useDataSourceStore.getState().isRealApi
    
    if (!isRealApi) {
      return { data: undefined, status: 200 }
    }
    
    return await apiClient.post('/api/accountMerge/histo-fus-sep', mergeData)
  },

  readHistoFusSeqDet: async (mergeId: number): Promise<ApiResponse<unknown[]>> => { // RM-30
    const isRealApi = useDataSourceStore.getState().isRealApi
    
    if (!isRealApi) {
      return { 
        data: [{ 
          id: mergeId, 
          details: 'Mock merge details',
          timestamp: new Date().toISOString() 
        }], 
        status: 200 
      }
    }
    
    return await apiClient.get(`/api/accountMerge/histo-fus-sep-det/${mergeId}`)
  },

  readHistoFusSepDet: async (mergeId: number): Promise<ApiResponse<unknown[]>> => { // RM-30
    const isRealApi = useDataSourceStore.getState().isRealApi
    
    if (!isRealApi) {
      return { 
        data: [{ 
          id: mergeId, 
          details: 'Mock merge separation details',
          timestamp: new Date().toISOString() 
        }], 
        status: 200 
      }
    }
    
    return await apiClient.get(`/api/accountMerge/histo-fus-sep-det/${mergeId}`)
  },

  writeHistoFusSeqDet: async (detailData: unknown): Promise<ApiResponse<void>> => { // RM-31
    const isRealApi = useDataSourceStore.getState().isRealApi
    
    if (!isRealApi) {
      return { data: undefined, status: 200 }
    }
    
    return await apiClient.post('/api/accountMerge/histo-fus-sep-det', detailData)
  },

  writeHistoFusSepDet: async (detailData: unknown): Promise<ApiResponse<void>> => { // RM-31
    const isRealApi = useDataSourceStore.getState().isRealApi
    
    if (!isRealApi) {
      return { data: undefined, status: 200 }
    }
    
    return await apiClient.post('/api/accountMerge/histo-fus-sep-det', detailData)
  },

  writeHistoFusSeqSaisie: async (saisieData: unknown): Promise<ApiResponse<void>> => { // RM-32
    const isRealApi = useDataSourceStore.getState().isRealApi
    
    if (!isRealApi) {
      return { data: undefined, status: 200 }
    }
    
    return await apiClient.post('/api/accountMerge/histo-fus-sep-saisie', saisieData)
  },

  writeHistoFusSepSaisie: async (saisieData: unknown): Promise<ApiResponse<void>> => { // RM-32
    const isRealApi = useDataSourceStore.getState().isRealApi
    
    if (!isRealApi) {
      return { data: undefined, status: 200 }
    }
    
    return await apiClient.post('/api/accountMerge/histo-fus-sep-saisie', saisieData)
  },

  deleteHistoFusSeqSaisie: async (saisieId: number): Promise<ApiResponse<void>> => { // RM-33
    const isRealApi = useDataSourceStore.getState().isRealApi
    
    if (!isRealApi) {
      return { data: undefined, status: 200 }
    }
    
    return await apiClient.delete(`/api/accountMerge/histo-fus-sep-saisie/${saisieId}`)
  },

  deleteHistoFusSepSaisie: async (saisieId: number): Promise<ApiResponse<void>> => { // RM-33
    const isRealApi = useDataSourceStore.getState().isRealApi
    
    if (!isRealApi) {
      return { data: undefined, status: 200 }
    }
    
    return await apiClient.delete(`/api/accountMerge/histo-fus-sep-saisie/${saisieId}`)
  },

  readHistoFusSeqLog: async (logId: number): Promise<ApiResponse<unknown[]>> => { // RM-34
    const isRealApi = useDataSourceStore.getState().isRealApi
    
    if (!isRealApi) {
      return { 
        data: [{ 
          id: logId, 
          logEntry: 'Mock log entry',
          timestamp: new Date().toISOString() 
        }], 
        status: 200 
      }
    }
    
    return await apiClient.get(`/api/accountMerge/histo-fus-sep-log/${logId}`)
  },

  readHistoFusSepLog: async (logId: number): Promise<ApiResponse<unknown[]>> => { // RM-34
    const isRealApi = useDataSourceStore.getState().isRealApi
    
    if (!isRealApi) {
      return { 
        data: [{ 
          id: logId, 
          logEntry: 'Mock fusion separation log',
          timestamp: new Date().toISOString() 
        }], 
        status: 200 
      }
    }
    
    return await apiClient.get(`/api/accountMerge/histo-fus-sep-log/${logId}`)
  },

  writeHistoFusSeqLog: async (logData: unknown): Promise<ApiResponse<void>> => { // RM-35
    const isRealApi = useDataSourceStore.getState().isRealApi
    
    if (!isRealApi) {
      return { data: undefined, status: 200 }
    }
    
    return await apiClient.post('/api/accountMerge/histo-fus-sep-log', logData)
  },

  writeHistoFusSepLog: async (logData: unknown): Promise<ApiResponse<void>> => { // RM-35
    const isRealApi = useDataSourceStore.getState().isRealApi
    
    if (!isRealApi) {
      return { data: undefined, status: 200 }
    }
    
    return await apiClient.post('/api/accountMerge/histo-fus-sep-log', logData)
  },

  printSeparationOuFusion: async (printData: unknown): Promise<ApiResponse<void>> => { // RM-36
    const isRealApi = useDataSourceStore.getState().isRealApi
    
    if (!isRealApi) {
      return { data: undefined, status: 200 }
    }
    
    return await apiClient.post('/api/accountMerge/print-separation-fusion', printData)
  },

  recuperationDuTitre: async (accountId: string): Promise<ApiResponse<{ title: string }>> => { // RM-43
    const isRealApi = useDataSourceStore.getState().isRealApi
    
    if (!isRealApi) {
      return { 
        data: { title: `Mock Title for Account ${accountId}` }, 
        status: 200 
      }
    }
    
    return await apiClient.get(`/api/accountMerge/account-title/${accountId}`)
  },

  getPrinter: async (): Promise<ApiResponse<{ printerName: string; isAvailable: boolean }>> => { // RM-179
    const isRealApi = useDataSourceStore.getState().isRealApi
    
    if (!isRealApi) {
      return { 
        data: { 
          printerName: 'Default Printer', 
          isAvailable: true 
        }, 
        status: 200 
      }
    }
    
    return await apiClient.get('/api/system/printer')
  },

  printerChoice: async (printerName: string): Promise<ApiResponse<{ selected: boolean }>> => { // RM-180
    const isRealApi = useDataSourceStore.getState().isRealApi
    
    if (!isRealApi) {
      return { 
        data: { selected: true }, 
        status: 200 
      }
    }
    
    return await apiClient.post('/api/system/printer/select', { printerName })
  },

  setListingNumber: async (listingNumber: number): Promise<ApiResponse<void>> => { // RM-181
    const isRealApi = useDataSourceStore.getState().isRealApi
    
    if (!isRealApi) {
      return { data: undefined, status: 200 }
    }
    
    return await apiClient.post('/api/system/listing-number', { listingNumber })
  },

  razCurrentPrinter: async (): Promise<ApiResponse<void>> => { // RM-182
    const isRealApi = useDataSourceStore.getState().isRealApi
    
    if (!isRealApi) {
      return { data: undefined, status: 200 }
    }
    
    return await apiClient.post('/api/system/printer/reset')
  }
}