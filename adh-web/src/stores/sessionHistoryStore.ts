import { create } from "zustand"
import type { SessionHistoryState, SessionHistoryActions, SessionHistoryItem, SessionDetail, SessionCurrency } from "@/types/sessionHistory"
import type { ApiResponse } from "@/services/api/apiClient"
import { apiClient } from "@/services/api/apiClient"
import { useDataSourceStore } from "@/stores/dataSourceStore"

const mockSessions: SessionHistoryItem[] = [
  {
    sessionId: "SES-2024-001",
    openedDate: new Date("2024-01-15"),
    openedTime: "08:30:00",
    closedDate: new Date("2024-01-15"),
    closedTime: "18:45:00",
    operatorId: "OP001",
    status: "CLOSED",
    hasDetails: true,
    title: "Session matinale - Caisse principale"
  },
  {
    sessionId: "SES-2024-002",
    openedDate: new Date("2024-01-16"),
    openedTime: "09:15:00",
    closedDate: null,
    closedTime: null,
    operatorId: "OP002",
    status: "OPEN",
    hasDetails: true,
    title: "Session journée - Caisse secondaire"
  },
  {
    sessionId: "SES-2024-003",
    openedDate: new Date("2024-01-16"),
    openedTime: "14:20:00",
    closedDate: new Date("2024-01-16"),
    closedTime: "20:10:00",
    operatorId: "OP003",
    status: "CLOSED",
    hasDetails: true,
    title: null
  },
  {
    sessionId: "SES-2024-004",
    openedDate: new Date("2024-01-17"),
    openedTime: "07:45:00",
    closedDate: new Date("2024-01-17"),
    closedTime: "16:30:00",
    operatorId: "OP001",
    status: "CLOSED",
    hasDetails: false,
    title: "Session weekend - Ouverture anticipée"
  },
  {
    sessionId: "SES-2024-005",
    openedDate: new Date("2024-01-18"),
    openedTime: "10:00:00",
    closedDate: null,
    closedTime: null,
    operatorId: "OP004",
    status: "OPEN",
    hasDetails: true,
    title: "Session spéciale événement"
  },
  {
    sessionId: "SES-2024-006",
    openedDate: new Date("2024-01-19"),
    openedTime: "08:00:00",
    closedDate: new Date("2024-01-19"),
    closedTime: "19:15:00",
    operatorId: "OP002",
    status: "CLOSED",
    hasDetails: true,
    title: null
  },
  {
    sessionId: "SES-2024-007",
    openedDate: new Date("2024-01-20"),
    openedTime: "13:30:00",
    closedDate: new Date("2024-01-20"),
    closedTime: "21:45:00",
    operatorId: "OP005",
    status: "CLOSED",
    hasDetails: true,
    title: "Session soirée - Prolongée"
  },
  {
    sessionId: "SES-2024-008",
    openedDate: new Date("2024-01-21"),
    openedTime: "09:30:00",
    closedDate: null,
    closedTime: null,
    operatorId: "OP003",
    status: "OPEN",
    hasDetails: false,
    title: "Session maintenance"
  },
  {
    sessionId: "SES-2024-009",
    openedDate: new Date("2024-01-22"),
    openedTime: "11:15:00",
    closedDate: new Date("2024-01-22"),
    closedTime: "17:20:00",
    operatorId: "OP001",
    status: "CLOSED",
    hasDetails: true,
    title: "Session formation - Nouveaux opérateurs"
  },
  {
    sessionId: "SES-2024-010",
    openedDate: new Date("2024-01-23"),
    openedTime: "08:45:00",
    closedDate: new Date("2024-01-23"),
    closedTime: "18:00:00",
    operatorId: "OP004",
    status: "CLOSED",
    hasDetails: true,
    title: null
  }
]

const mockSessionDetails: Record<string, SessionDetail> = {
  "SES-2024-001": {
    sessionId: "SES-2024-001",
    totalAmount: 4567.89,
    hasDetails: true,
    isEndOfHistory: false
  },
  "SES-2024-002": {
    sessionId: "SES-2024-002",
    totalAmount: 2345.67,
    hasDetails: true,
    isEndOfHistory: false
  },
  "SES-2024-003": {
    sessionId: "SES-2024-003",
    totalAmount: 3456.78,
    hasDetails: true,
    isEndOfHistory: false
  },
  "SES-2024-005": {
    sessionId: "SES-2024-005",
    totalAmount: 1890.45,
    hasDetails: true,
    isEndOfHistory: false
  },
  "SES-2024-006": {
    sessionId: "SES-2024-006",
    totalAmount: 5678.90,
    hasDetails: true,
    isEndOfHistory: false
  },
  "SES-2024-007": {
    sessionId: "SES-2024-007",
    totalAmount: 4123.56,
    hasDetails: true,
    isEndOfHistory: false
  },
  "SES-2024-009": {
    sessionId: "SES-2024-009",
    totalAmount: 2789.34,
    hasDetails: true,
    isEndOfHistory: true
  },
  "SES-2024-010": {
    sessionId: "SES-2024-010",
    totalAmount: 3901.23,
    hasDetails: true,
    isEndOfHistory: true
  }
}

const mockSessionCurrencies: Record<string, SessionCurrency[]> = {
  "SES-2024-001": [
    {
      sessionId: "SES-2024-001",
      currencyCode: "EUR",
      amount: 4067.89,
      totalAmount: 4567.89,
      isLocalCurrency: true,
      isEndOfHistory: false
    },
    {
      sessionId: "SES-2024-001",
      currencyCode: "USD",
      amount: 350.00,
      totalAmount: 4567.89,
      isLocalCurrency: false,
      isEndOfHistory: false
    },
    {
      sessionId: "SES-2024-001",
      currencyCode: "GBP",
      amount: 150.00,
      totalAmount: 4567.89,
      isLocalCurrency: false,
      isEndOfHistory: false
    }
  ],
  "SES-2024-002": [
    {
      sessionId: "SES-2024-002",
      currencyCode: "EUR",
      amount: 2045.67,
      totalAmount: 2345.67,
      isLocalCurrency: true,
      isEndOfHistory: false
    },
    {
      sessionId: "SES-2024-002",
      currencyCode: "USD",
      amount: 300.00,
      totalAmount: 2345.67,
      isLocalCurrency: false,
      isEndOfHistory: false
    }
  ],
  "SES-2024-003": [
    {
      sessionId: "SES-2024-003",
      currencyCode: "EUR",
      amount: 2856.78,
      totalAmount: 3456.78,
      isLocalCurrency: true,
      isEndOfHistory: false
    },
    {
      sessionId: "SES-2024-003",
      currencyCode: "USD",
      amount: 400.00,
      totalAmount: 3456.78,
      isLocalCurrency: false,
      isEndOfHistory: false
    },
    {
      sessionId: "SES-2024-003",
      currencyCode: "CHF",
      amount: 200.00,
      totalAmount: 3456.78,
      isLocalCurrency: false,
      isEndOfHistory: false
    }
  ],
  "SES-2024-005": [
    {
      sessionId: "SES-2024-005",
      currencyCode: "EUR",
      amount: 1590.45,
      totalAmount: 1890.45,
      isLocalCurrency: true,
      isEndOfHistory: false
    },
    {
      sessionId: "SES-2024-005",
      currencyCode: "USD",
      amount: 300.00,
      totalAmount: 1890.45,
      isLocalCurrency: false,
      isEndOfHistory: false
    }
  ],
  "SES-2024-006": [
    {
      sessionId: "SES-2024-006",
      currencyCode: "EUR",
      amount: 4878.90,
      totalAmount: 5678.90,
      isLocalCurrency: true,
      isEndOfHistory: false
    },
    {
      sessionId: "SES-2024-006",
      currencyCode: "USD",
      amount: 500.00,
      totalAmount: 5678.90,
      isLocalCurrency: false,
      isEndOfHistory: false
    },
    {
      sessionId: "SES-2024-006",
      currencyCode: "GBP",
      amount: 300.00,
      totalAmount: 5678.90,
      isLocalCurrency: false,
      isEndOfHistory: false
    }
  ],
  "SES-2024-007": [
    {
      sessionId: "SES-2024-007",
      currencyCode: "EUR",
      amount: 3623.56,
      totalAmount: 4123.56,
      isLocalCurrency: true,
      isEndOfHistory: false
    },
    {
      sessionId: "SES-2024-007",
      currencyCode: "USD",
      amount: 350.00,
      totalAmount: 4123.56,
      isLocalCurrency: false,
      isEndOfHistory: false
    },
    {
      sessionId: "SES-2024-007",
      currencyCode: "JPY",
      amount: 150.00,
      totalAmount: 4123.56,
      isLocalCurrency: false,
      isEndOfHistory: false
    }
  ],
  "SES-2024-009": [
    {
      sessionId: "SES-2024-009",
      currencyCode: "EUR",
      amount: 2289.34,
      totalAmount: 2789.34,
      isLocalCurrency: true,
      isEndOfHistory: true
    },
    {
      sessionId: "SES-2024-009",
      currencyCode: "USD",
      amount: 500.00,
      totalAmount: 2789.34,
      isLocalCurrency: false,
      isEndOfHistory: true
    }
  ],
  "SES-2024-010": [
    {
      sessionId: "SES-2024-010",
      currencyCode: "EUR",
      amount: 3401.23,
      totalAmount: 3901.23,
      isLocalCurrency: true,
      isEndOfHistory: true
    },
    {
      sessionId: "SES-2024-010",
      currencyCode: "USD",
      amount: 350.00,
      totalAmount: 3901.23,
      isLocalCurrency: false,
      isEndOfHistory: true
    },
    {
      sessionId: "SES-2024-010",
      currencyCode: "GBP",
      amount: 150.00,
      totalAmount: 3901.23,
      isLocalCurrency: false,
      isEndOfHistory: true
    }
  ]
}

export const useSessionHistoryStore = create<SessionHistoryState & SessionHistoryActions>((set, get) => ({
  sessions: [],
  selectedSessionDetails: null,
  selectedSessionCurrencies: [],
  isLoading: false,
  error: null,
  filters: {
    startDate: null,
    endDate: null,
    status: null,
    operatorId: null
  },
  societe: "",
  localCurrencyCode: "EUR",
  amountMask: "###,###.##",

  loadSessions: async (societe: string, filters) => {
    set({ isLoading: true, error: null, societe })

    try {
      if (useDataSourceStore.getState().isRealApi) {
        const params = new URLSearchParams({ societe })
        
        if (filters?.startDate) {
          params.append("startDate", filters.startDate.toISOString())
        }
        if (filters?.endDate) {
          params.append("endDate", filters.endDate.toISOString())
        }
        if (filters?.status) {
          params.append("status", filters.status)
        }
        if (filters?.operatorId) {
          params.append("operatorId", filters.operatorId)
        }

        const response = await apiClient.get<ApiResponse<SessionHistoryItem[]>>(
          `/api/caisse/sessions/history?${params.toString()}`
        )

        if (response.data.success && response.data.data) {
          set({ 
            sessions: response.data.data.map(session => ({
              ...session,
              openedDate: new Date(session.openedDate),
              closedDate: session.closedDate ? new Date(session.closedDate) : null
            })),
            isLoading: false 
          })
        } else {
          set({ 
            error: response.data.message || "Erreur lors du chargement des sessions",
            isLoading: false 
          })
        }
      } else {
        let filteredSessions = [...mockSessions]

        if (filters?.startDate) {
          filteredSessions = filteredSessions.filter(session => 
            session.openedDate >= filters.startDate!
          )
        }
        if (filters?.endDate) {
          filteredSessions = filteredSessions.filter(session => 
            session.openedDate <= filters.endDate!
          )
        }
        if (filters?.status) {
          filteredSessions = filteredSessions.filter(session => 
            session.status === filters.status
          )
        }
        if (filters?.operatorId) {
          filteredSessions = filteredSessions.filter(session => 
            session.operatorId === filters.operatorId
          )
        }

        await new Promise(resolve => setTimeout(resolve, 500))
        set({ sessions: filteredSessions, isLoading: false })
      }
    } catch (e) {
      const error = e instanceof Error ? e.message : "Erreur inconnue"
      set({ error, isLoading: false })
    }
  },

  loadSessionDetails: async (sessionId: string) => {
    set({ isLoading: true, error: null })

    try {
      const sessionExists = get().sessions.find(s => s.sessionId === sessionId)
      if (!sessionExists) {
        throw new Error("Session non trouvée")
      }

      if (useDataSourceStore.getState().isRealApi) {
        const response = await apiClient.get<ApiResponse<SessionDetail>>(
          `/api/caisse/sessions/history/${sessionId}/details`
        )

        if (response.data.success && response.data.data) {
          set({ selectedSessionDetails: response.data.data, isLoading: false })
        } else {
          set({ 
            error: response.data.message || "Erreur lors du chargement des détails",
            isLoading: false 
          })
        }
      } else {
        const mockDetail = mockSessionDetails[sessionId]
        if (!mockDetail) {
          throw new Error("Détails de session non disponibles")
        }

        await new Promise(resolve => setTimeout(resolve, 300))
        set({ selectedSessionDetails: mockDetail, isLoading: false })
      }
    } catch (e) {
      const error = e instanceof Error ? e.message : "Erreur inconnue"
      set({ error, isLoading: false })
    }
  },

  loadSessionCurrencies: async (sessionId: string) => {
    set({ isLoading: true, error: null })

    try {
      const sessionExists = get().sessions.find(s => s.sessionId === sessionId)
      if (!sessionExists) {
        throw new Error("Session non trouvée")
      }

      if (useDataSourceStore.getState().isRealApi) {
        const response = await apiClient.get<ApiResponse<SessionCurrency[]>>(
          `/api/caisse/sessions/history/${sessionId}/currencies`
        )

        if (response.data.success && response.data.data) {
          set({ selectedSessionCurrencies: response.data.data, isLoading: false })
        } else {
          set({ 
            error: response.data.message || "Erreur lors du chargement des devises",
            isLoading: false 
          })
        }
      } else {
        const mockCurrencies = mockSessionCurrencies[sessionId] || []
        
        await new Promise(resolve => setTimeout(resolve, 300))
        set({ selectedSessionCurrencies: mockCurrencies, isLoading: false })
      }
    } catch (e) {
      const error = e instanceof Error ? e.message : "Erreur inconnue"
      set({ error, isLoading: false })
    }
  },

  setFilters: (filters) => {
    const currentFilters = get().filters
    const updatedFilters = { ...currentFilters, ...filters }
    set({ filters: updatedFilters })
    
    const { societe } = get()
    if (societe) {
      get().loadSessions(societe, updatedFilters)
    }
  },

  clearFilters: () => {
    const clearedFilters = {
      startDate: null,
      endDate: null,
      status: null,
      operatorId: null
    }
    set({ filters: clearedFilters })
    
    const { societe } = get()
    if (societe) {
      get().loadSessions(societe)
    }
  },

  reset: () => {
    set({
      sessions: [],
      selectedSessionDetails: null,
      selectedSessionCurrencies: [],
      isLoading: false,
      error: null,
      filters: {
        startDate: null,
        endDate: null,
        status: null,
        operatorId: null
      },
      societe: "",
      localCurrencyCode: "EUR",
      amountMask: "###,###.##"
    })
  }
}))