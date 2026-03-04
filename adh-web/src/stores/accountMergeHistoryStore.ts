import { create } from 'zustand';
import type { 
  FusionSeparationHistoryEntry, 
  AccountMergeHistoryStore,
  OperationType
} from '@/types/accountMergeHistory';
import { OPERATION_TYPES, mockHistoryEntries } from '@/types/accountMergeHistory';
import { useDataSourceStore } from '@/stores/dataSourceStore';
import { apiClient } from '@/services/api/apiClient';
import type { ApiResponse } from '@/services/api/apiClient';

export const useAccountMergeHistoryStore = create<AccountMergeHistoryStore>((set, get) => ({
  isLoading: false,
  error: null,
  lastCreatedEntry: null,
  historyEntries: [],

  setLoading: (isLoading: boolean) => set({ isLoading }),
  
  setError: (error: string | null) => set({ error }),
  
  setLastCreatedEntry: (entry: FusionSeparationHistoryEntry | null) => 
    set({ lastCreatedEntry: entry }),
  
  setHistoryEntries: (entries: FusionSeparationHistoryEntry[]) => 
    set({ historyEntries: entries }),

  createHistoryEntry: async (entry) => {
    set({ isLoading: true, error: null });
    try {
      const validTypes = Object.values(OPERATION_TYPES);
      if (!validTypes.includes(entry.operationType)) {
        throw new Error(
          `Invalid operation type: ${entry.operationType}. Must be E, F, or S.`
        );
      }

      const isRealApi = useDataSourceStore.getState().isRealApi;
      const fullName = `${entry.lastName.trim()} ${entry.firstName.trim()}`.trim();
      
      if (!isRealApi) {
        const newEntry: FusionSeparationHistoryEntry = {
          ...entry,
          chronoId: Math.floor(Math.random() * 100000) + 1,
          timestamp: new Date(),
          fullName,
        };
        
        set({ 
          lastCreatedEntry: newEntry,
          isLoading: false 
        });
        
        return newEntry;
      }

      const response = await apiClient.post<ApiResponse<FusionSeparationHistoryEntry>>(
        '/api/account-merge/history',
        { ...entry, fullName }
      );

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to create history entry');
      }

      set({ 
        lastCreatedEntry: response.data,
        isLoading: false 
      });

      return response.data;
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
      set({ error: errorMessage, isLoading: false });
      throw e;
    }
  },

  getHistoryByAccount: async (accountNumber: number, filiationNumber?: number) => {
    set({ isLoading: true, error: null });
    try {
      const isRealApi = useDataSourceStore.getState().isRealApi;
      
      if (!isRealApi) {
        let filtered = mockHistoryEntries.filter(
          (entry) => entry.referenceAccount === accountNumber
        );
        
        if (filiationNumber !== undefined) {
          filtered = filtered.filter(
            (entry) => entry.referenceFiliation === filiationNumber
          );
        }
        
        const sorted = filtered.sort((a, b) => 
          b.timestamp.getTime() - a.timestamp.getTime()
        );
        
        set({ 
          historyEntries: sorted,
          isLoading: false 
        });
        
        return sorted;
      }

      const params = new URLSearchParams({
        accountNumber: accountNumber.toString(),
      });
      
      if (filiationNumber !== undefined) {
        params.append('filiationNumber', filiationNumber.toString());
      }

      const response = await apiClient.get<ApiResponse<FusionSeparationHistoryEntry[]>>(
        `/api/account-merge/history?${params.toString()}`
      );

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch history');
      }

      set({ 
        historyEntries: response.data,
        isLoading: false 
      });

      return response.data;
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
      set({ error: errorMessage, isLoading: false });
      throw e;
    }
  },

  getHistoryByDateRange: async (
    startDate: Date, 
    endDate: Date, 
    operationType?: OperationType
  ) => {
    set({ isLoading: true, error: null });
    try {
      const isRealApi = useDataSourceStore.getState().isRealApi;
      
      if (!isRealApi) {
        let filtered = mockHistoryEntries.filter((entry) => {
          const entryTime = entry.timestamp.getTime();
          return entryTime >= startDate.getTime() && entryTime <= endDate.getTime();
        });
        
        if (operationType) {
          filtered = filtered.filter(
            (entry) => entry.operationType === operationType
          );
        }
        
        const sorted = filtered.sort((a, b) => 
          b.timestamp.getTime() - a.timestamp.getTime()
        );
        
        set({ 
          historyEntries: sorted,
          isLoading: false 
        });
        
        return sorted;
      }

      const params = new URLSearchParams({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });
      
      if (operationType) {
        params.append('operationType', operationType);
      }

      const response = await apiClient.get<ApiResponse<FusionSeparationHistoryEntry[]>>(
        `/api/account-merge/history/date-range?${params.toString()}`
      );

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch history by date range');
      }

      set({ 
        historyEntries: response.data,
        isLoading: false 
      });

      return response.data;
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred';
      set({ error: errorMessage, isLoading: false });
      throw e;
    }
  },

  clearState: () => set({
    isLoading: false,
    error: null,
    lastCreatedEntry: null,
    historyEntries: [],
  }),
}));