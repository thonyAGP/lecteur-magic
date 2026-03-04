import { create } from "zustand"
import type { FusionSeparationHistoryState, FusionSeparationHistoryEntry } from "@/types/fusionSeparationHistory"
import type { ApiResponse } from "@/services/api/apiClient"
import { apiClient } from "@/services/api/apiClient"
import { useDataSourceStore } from "@/stores/dataSourceStore"

const mockHistoryEntries: FusionSeparationHistoryEntry[] = [
  {
    chronoEF: 1001,
    societe: "ACME Corp",
    compteReference: 12345,
    filiationReference: 1,
    comptePointeOld: 98765,
    filiationPointeOld: 2,
    comptePointeNew: 11111,
    filiationPointeNew: 3,
    typeEF: "FUSION",
    nom: "Dupont",
    prenom: "Jean"
  },
  {
    chronoEF: 1002,
    societe: "TechSoft Ltd",
    compteReference: 67890,
    filiationReference: 4,
    comptePointeOld: 22222,
    filiationPointeOld: 5,
    comptePointeNew: 33333,
    filiationPointeNew: 6,
    typeEF: "SEPARATION",
    nom: "Martin",
    prenom: "Marie"
  },
  {
    chronoEF: 1003,
    societe: "Global Solutions",
    compteReference: 24680,
    filiationReference: 7,
    comptePointeOld: 44444,
    filiationPointeOld: 8,
    comptePointeNew: 55555,
    filiationPointeNew: 9,
    typeEF: "FUSION",
    nom: "Bernard",
    prenom: "Pierre"
  }
]

export const useFusionSeparationHistoryStore = create<FusionSeparationHistoryState>((set, get) => ({
  historyEntries: [],
  isLoading: false,
  error: null,
  currentEntry: null,

  writeHistoryEntry: async (entry: FusionSeparationHistoryEntry) => {
    set({ isLoading: true, error: null })
    
    try {
      const isRealApi = useDataSourceStore.getState().isRealApi
      
      if (isRealApi) {
        await apiClient.post("/api/fusion-separation-history/entries", { entry })
      } else {
        await new Promise(resolve => setTimeout(resolve, 500))
        mockHistoryEntries.push({ ...entry })
      }
      
      const currentEntries = get().historyEntries
      set({ 
        historyEntries: [...currentEntries, entry],
        isLoading: false 
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to write history entry"
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  formatFullName: (nom: string, prenom: string) => { // SPEC-FIX: Corrected from backticks to + operator per CONCATENATION expression 12
    return `${nom.trim()} ${prenom.trim()}`
  },

  setCurrentEntry: (entry: FusionSeparationHistoryEntry) => {
    set({ currentEntry: entry })
  },

  loadHistoryEntries: async (filters?: { societe?: string; compteReference?: number; typeEF?: string }) => {
    set({ isLoading: true, error: null })
    
    try {
      const isRealApi = useDataSourceStore.getState().isRealApi
      let entries: FusionSeparationHistoryEntry[]
      
      if (isRealApi) {
        const response = await apiClient.get("/api/fusion-separation-history/entries", { params: filters })
        entries = response.data
      } else {
        await new Promise(resolve => setTimeout(resolve, 300))
        entries = mockHistoryEntries.filter(entry => {
          if (filters?.societe && !entry.societe.toLowerCase().includes(filters.societe.toLowerCase())) {
            return false
          }
          if (filters?.compteReference && entry.compteReference !== filters.compteReference) {
            return false
          }
          if (filters?.typeEF && entry.typeEF !== filters.typeEF) {
            return false
          }
          return true
        })
      }
      
      set({ historyEntries: entries, isLoading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load history entries"
      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  reset: () => {
    set({
      historyEntries: [],
      isLoading: false,
      error: null,
      currentEntry: null
    })
  }
}))