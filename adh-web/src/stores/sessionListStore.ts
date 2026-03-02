import { create } from "zustand"
import type { SessionListStore, SessionFilter, Session, SessionListRequest } from "@/types/sessionList"
import type { ApiResponse } from "@/services/api/apiClient"
import { apiClient } from "@/services/api/apiClient"
import { useDataSourceStore } from "@/stores/dataSourceStore"

const generateMockSessions = (): Session[] => [
  {
    id: 1,
    societe: "SARL MARTIN",
    caisse: "CAISSE01",
    operateur: "DUPONT",
    dateOuverture: new Date("2024-01-15T08:30:00"),
    etat: "O",
    montantOuverture: 150.00
  },
  {
    id: 2,
    societe: "SARL MARTIN",
    caisse: "CAISSE02",
    operateur: "BERNARD",
    dateOuverture: new Date("2024-01-15T09:00:00"),
    etat: "",
    montantOuverture: 200.00
  },
  {
    id: 3,
    societe: "SAS TECHNOLOGIES",
    caisse: "CAISSE01",
    operateur: "LEFEBVRE",
    dateOuverture: new Date("2024-01-14T14:15:00"),
    etat: "F",
    montantOuverture: null
  },
  {
    id: 4,
    societe: "SAS TECHNOLOGIES",
    caisse: "CAISSE03",
    operateur: "MOREAU",
    dateOuverture: new Date("2024-01-15T07:45:00"),
    etat: "O",
    montantOuverture: 100.00
  },
  {
    id: 5,
    societe: "EURL COMMERCE",
    caisse: "CAISSE01",
    operateur: "SIMON",
    dateOuverture: new Date("2024-01-15T10:30:00"),
    etat: "O",
    montantOuverture: 300.00
  }
]

const applySessionFilters = (sessions: Session[], filters: SessionFilter): Session[] => {
  let filteredSessions = [...sessions]

  if (!filters.existeSession) {
    return []
  }

  if (!filters.existeSessionOuverte) {
    return []
  }

  if (filters.societe) {
    filteredSessions = filteredSessions.filter(session => 
      session.societe.toLowerCase().includes(filters.societe!.toLowerCase())
    )
  }

  filteredSessions = filteredSessions.filter(session => 
    session.etat === "" || session.etat === "O"
  )

  return filteredSessions
}

export const useSessionListStore = create<SessionListStore>((set, get) => ({
  sessions: [],
  isLoading: false,
  error: null,
  filters: {
    existeSession: true,
    existeSessionOuverte: true,
    societe: null,
    deviseLocale: null
  },

  fetchSessions: async (filters: SessionFilter) => {
    set({ isLoading: true, error: null })

    try {
      const isRealApi = useDataSourceStore.getState().isRealApi

      if (isRealApi) {
        const params: SessionListRequest = {}
        
        if (filters.societe) {
          params.societe = filters.societe
        }
        params.existeSession = filters.existeSession
        params.existeSessionOuverte = filters.existeSessionOuverte
        if (filters.deviseLocale) {
          params.deviseLocale = filters.deviseLocale
        }

        const response = await apiClient.get<ApiResponse<Session[]>>("/api/sessions/list", { params })
        
        if (response.data.success && response.data.data) {
          const sessions = response.data.data.map(session => ({
            ...session,
            dateOuverture: new Date(session.dateOuverture)
          }))
          set({ sessions, isLoading: false })
        } else {
          throw new Error(response.data.message || "Erreur lors de la récupération des sessions")
        }
      } else {
        await new Promise(resolve => setTimeout(resolve, 800))
        
        const mockSessions = generateMockSessions()
        const filteredSessions = applySessionFilters(mockSessions, filters)
        
        set({ sessions: filteredSessions, isLoading: false })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erreur inconnue"
      set({ error: errorMessage, isLoading: false })
    }
  },

  setFilters: (newFilters: Partial<SessionFilter>) => {
    const currentFilters = get().filters
    const updatedFilters = { ...currentFilters, ...newFilters }
    set({ filters: updatedFilters })
    get().fetchSessions(updatedFilters)
  },

  clearError: () => {
    set({ error: null })
  },

  reset: () => {
    set({
      sessions: [],
      isLoading: false,
      error: null,
      filters: {
        existeSession: true,
        existeSessionOuverte: true,
        societe: null,
        deviseLocale: null
      }
    })
  }
}))