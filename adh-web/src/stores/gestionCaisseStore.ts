import { create } from "zustand"
import type { ApiResponse } from "@/services/api/apiClient"
import { apiClient } from "@/services/api/apiClient"
import { useDataSourceStore } from "@/stores/dataSourceStore"
import type {
  GestionCaisseState,
  SessionCaisse,
  ParametresCaisse,
  SessionConcurrente,
  MouvementCaisse,
  DateComptable,
  ChargerParametresResponse,
  ChargerSessionActiveResponse,
  ChargerDateComptableResponse,
  SessionsConcurrentesResponse,
  OuvrirSessionResponse,
  ApportCoffreResponse,
  ApportProduitResponse,
  RemiseCoffreResponse,
  FermerSessionResponse,
  HistoriqueResponse,
  SessionDetailResponse,
  MouvementsResponse
} from "@/types/gestionCaisse"
import { SessionStatut, MouvementType } from "@/types/gestionCaisse"

const createMockParametres = (): ParametresCaisse => ({
  caisseId: 1,
  seuilAlerte: 100,
  deviseLocale: "EUR",
  impressionAuto: true
})

const createMockSessionActive = (): SessionCaisse => ({
  sessionId: 1,
  dateOuverture: new Date("2024-01-15T08:30:00Z"),
  dateFermeture: null,
  operateurId: 101,
  operateurNom: "Marie Dubois",
  statut: SessionStatut.OUVERT,
  montantOuverture: 500.00,
  montantFermeture: null,
  ecart: null
})

const createMockSessionsConcurrentes = (): SessionConcurrente[] => [
  {
    sessionId: 2,
    posteId: "CAISSE_02",
    operateurNom: "Pierre Martin",
    dateOuverture: new Date("2024-01-15T09:00:00Z")
  },
  {
    sessionId: 3,
    posteId: "CAISSE_03",
    operateurNom: "Sophie Laurent",
    dateOuverture: new Date("2024-01-15T08:45:00Z")
  }
]

const createMockMouvements = (): MouvementCaisse[] => [
  {
    mouvementId: 1,
    sessionId: 1,
    type: MouvementType.INITIAL,
    deviseCode: "EUR",
    montant: 500.00,
    dateHeure: new Date("2024-01-15T08:30:00Z")
  },
  {
    mouvementId: 2,
    sessionId: 1,
    type: MouvementType.APPORT,
    deviseCode: "EUR",
    montant: 200.00,
    dateHeure: new Date("2024-01-15T10:15:00Z")
  },
  {
    mouvementId: 3,
    sessionId: 1,
    type: MouvementType.APPORT,
    deviseCode: "USD",
    montant: 150.00,
    dateHeure: new Date("2024-01-15T11:30:00Z")
  }
]

const createMockHistorique = (): SessionCaisse[] => [
  {
    sessionId: 10,
    dateOuverture: new Date("2024-01-14T08:30:00Z"),
    dateFermeture: new Date("2024-01-14T18:00:00Z"),
    operateurId: 101,
    operateurNom: "Marie Dubois",
    statut: SessionStatut.FERME,
    montantOuverture: 500.00,
    montantFermeture: 485.50,
    ecart: -14.50
  },
  {
    sessionId: 11,
    dateOuverture: new Date("2024-01-13T08:30:00Z"),
    dateFermeture: new Date("2024-01-13T18:00:00Z"),
    operateurId: 102,
    operateurNom: "Jean Dupont",
    statut: SessionStatut.FERME,
    montantOuverture: 500.00,
    montantFermeture: 502.75,
    ecart: 2.75
  },
  {
    sessionId: 12,
    dateOuverture: new Date("2024-01-12T08:30:00Z"),
    dateFermeture: new Date("2024-01-12T18:00:00Z"),
    operateurId: 103,
    operateurNom: "Alice Robert",
    statut: SessionStatut.FERME,
    montantOuverture: 500.00,
    montantFermeture: 498.20,
    ecart: -1.80
  },
  {
    sessionId: 13,
    dateOuverture: new Date("2024-01-11T08:30:00Z"),
    dateFermeture: new Date("2024-01-11T18:00:00Z"),
    operateurId: 101,
    operateurNom: "Marie Dubois",
    statut: SessionStatut.FERME,
    montantOuverture: 500.00,
    montantFermeture: 500.00,
    ecart: 0.00
  },
  {
    sessionId: 14,
    dateOuverture: new Date("2024-01-10T08:30:00Z"),
    dateFermeture: new Date("2024-01-10T18:00:00Z"),
    operateurId: 104,
    operateurNom: "Thomas Moreau",
    statut: SessionStatut.FERME,
    montantOuverture: 500.00,
    montantFermeture: 489.30,
    ecart: -10.70
  }
]

const createMockDateComptable = (): DateComptable => ({
  date: new Date("2024-01-15"),
  valide: true
})

export const useGestionCaisseStore = create<GestionCaisseState & {
  chargerParametres: () => Promise<void>
  chargerSessionActive: () => Promise<void>
  verifierDateComptable: () => Promise<void>
  controlerCoffre: () => Promise<void>
  detecterSessionsConcurrentes: () => Promise<void>
  ouvrirSession: () => Promise<void>
  apportCoffre: (montant: number, deviseCode: string) => Promise<void>
  apportProduit: (produitId: number, quantite: number) => Promise<void>
  remiseCoffre: (montant: number, deviseCode: string) => Promise<void>
  fermerSession: () => Promise<void>
  consulterHistorique: () => Promise<void>
  consulterSession: (sessionId: number) => Promise<void>
  reimprimerTickets: (sessionId: number) => Promise<void>
  setShowHistoriqueDialog: (show: boolean) => void
  setShowConsultationDialog: (show: boolean) => void
  reset: () => void
}>((set, get) => ({
  sessionActive: null,
  parametres: null,
  sessionsConcurrentes: [],
  mouvements: [],
  historique: [],
  dateComptable: null,
  isLoading: false,
  error: null,
  showHistoriqueDialog: false,
  showConsultationDialog: false,
  selectedSessionId: null,

  chargerParametres: async () => {
    set({ isLoading: true, error: null })
    
    try {
      const isRealApi = useDataSourceStore.getState().isRealApi
      
      if (isRealApi) {
        const response = await apiClient.get<ChargerParametresResponse>("/api/gestion-caisse/parametres")
        if (response.success) {
          set({ parametres: response.data, isLoading: false })
        } else {
          set({ error: response.error, isLoading: false })
        }
      } else {
        await new Promise(resolve => setTimeout(resolve, 800))
        const mockParametres = createMockParametres()
        set({ parametres: mockParametres, isLoading: false })
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Erreur lors du chargement des paramètres"
      set({ error: errorMessage, isLoading: false })
    }
  },

  chargerSessionActive: async () => {
    set({ isLoading: true, error: null })
    
    try {
      const isRealApi = useDataSourceStore.getState().isRealApi
      
      if (isRealApi) {
        const response = await apiClient.get<ChargerSessionActiveResponse>("/api/gestion-caisse/session-active")
        if (response.success) {
          set({ sessionActive: response.data, isLoading: false })
        } else {
          set({ error: response.error, isLoading: false })
        }
      } else {
        await new Promise(resolve => setTimeout(resolve, 600))
        const mockSession = createMockSessionActive()
        set({ sessionActive: mockSession, isLoading: false })
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Erreur lors du chargement de la session active"
      set({ error: errorMessage, isLoading: false })
    }
  },

  verifierDateComptable: async () => {
    set({ isLoading: true, error: null })
    
    try {
      const isRealApi = useDataSourceStore.getState().isRealApi
      
      if (isRealApi) {
        const response = await apiClient.get<ChargerDateComptableResponse>("/api/gestion-caisse/date-comptable")
        if (response.success) {
          set({ dateComptable: response.data, isLoading: false })
        } else {
          set({ error: response.error, isLoading: false })
        }
      } else {
        await new Promise(resolve => setTimeout(resolve, 300))
        const mockDateComptable = createMockDateComptable()
        set({ dateComptable: mockDateComptable, isLoading: false })
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Erreur lors de la vérification de la date comptable"
      set({ error: errorMessage, isLoading: false })
    }
  },

  controlerCoffre: async () => {
    set({ isLoading: true, error: null })
    
    try {
      const isRealApi = useDataSourceStore.getState().isRealApi
      
      if (isRealApi) {
        await apiClient.post("/api/gestion-caisse/controler-coffre")
        set({ isLoading: false })
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000))
        set({ isLoading: false })
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Erreur lors du contrôle du coffre"
      set({ error: errorMessage, isLoading: false })
    }
  },

  detecterSessionsConcurrentes: async () => {
    set({ isLoading: true, error: null })
    
    try {
      const isRealApi = useDataSourceStore.getState().isRealApi
      
      if (isRealApi) {
        const response = await apiClient.get<SessionsConcurrentesResponse>("/api/gestion-caisse/sessions-concurrentes")
        if (response.success) {
          set({ sessionsConcurrentes: response.data, isLoading: false })
        } else {
          set({ error: response.error, isLoading: false })
        }
      } else {
        await new Promise(resolve => setTimeout(resolve, 500))
        const mockSessionsConcurrentes = createMockSessionsConcurrentes()
        set({ sessionsConcurrentes: mockSessionsConcurrentes, isLoading: false })
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Erreur lors de la détection des sessions concurrentes"
      set({ error: errorMessage, isLoading: false })
    }
  },

  ouvrirSession: async () => {
    set({ isLoading: true, error: null })
    
    try {
      const isRealApi = useDataSourceStore.getState().isRealApi
      
      if (isRealApi) {
        const response = await apiClient.post<OuvrirSessionResponse>("/api/gestion-caisse/ouvrir-session")
        if (response.success) {
          set({ sessionActive: response.data, isLoading: false })
        } else {
          set({ error: response.error, isLoading: false })
        }
      } else {
        await new Promise(resolve => setTimeout(resolve, 1200))
        const newSession = createMockSessionActive()
        set({ sessionActive: newSession, isLoading: false })
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Erreur lors de l'ouverture de session"
      set({ error: errorMessage, isLoading: false })
    }
  },

  apportCoffre: async (montant: number, deviseCode: string) => {
    set({ isLoading: true, error: null })
    
    try {
      const isRealApi = useDataSourceStore.getState().isRealApi
      
      if (isRealApi) {
        const response = await apiClient.post<ApportCoffreResponse>("/api/gestion-caisse/apport-coffre", {
          montant,
          deviseCode
        })
        if (response.success) {
          const currentMouvements = get().mouvements
          set({ 
            mouvements: [...currentMouvements, response.data],
            isLoading: false 
          })
        } else {
          set({ error: response.error, isLoading: false })
        }
      } else {
        await new Promise(resolve => setTimeout(resolve, 800))
        const newMouvement: MouvementCaisse = {
          mouvementId: Date.now(),
          sessionId: get().sessionActive?.sessionId || 1,
          type: MouvementType.APPORT,
          deviseCode,
          montant,
          dateHeure: new Date()
        }
        const currentMouvements = get().mouvements
        set({ 
          mouvements: [...currentMouvements, newMouvement],
          isLoading: false 
        })
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Erreur lors de l'apport au coffre"
      set({ error: errorMessage, isLoading: false })
    }
  },

  apportProduit: async (produitId: number, quantite: number) => {
    set({ isLoading: true, error: null })
    
    try {
      const isRealApi = useDataSourceStore.getState().isRealApi
      
      if (isRealApi) {
        const response = await apiClient.post<ApportProduitResponse>("/api/gestion-caisse/apport-produit", {
          produitId,
          quantite
        })
        if (response.success) {
          const currentMouvements = get().mouvements
          set({ 
            mouvements: [...currentMouvements, response.data],
            isLoading: false 
          })
        } else {
          set({ error: response.error, isLoading: false })
        }
      } else {
        await new Promise(resolve => setTimeout(resolve, 800))
        const newMouvement: MouvementCaisse = {
          mouvementId: Date.now(),
          sessionId: get().sessionActive?.sessionId || 1,
          type: MouvementType.APPORT,
          deviseCode: "PRODUIT",
          montant: quantite,
          dateHeure: new Date()
        }
        const currentMouvements = get().mouvements
        set({ 
          mouvements: [...currentMouvements, newMouvement],
          isLoading: false 
        })
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Erreur lors de l'apport de produit"
      set({ error: errorMessage, isLoading: false })
    }
  },

  remiseCoffre: async (montant: number, deviseCode: string) => {
    set({ isLoading: true, error: null })
    
    try {
      const isRealApi = useDataSourceStore.getState().isRealApi
      
      if (isRealApi) {
        const response = await apiClient.post<RemiseCoffreResponse>("/api/gestion-caisse/remise-coffre", {
          montant,
          deviseCode
        })
        if (response.success) {
          const currentMouvements = get().mouvements
          set({ 
            mouvements: [...currentMouvements, response.data],
            isLoading: false 
          })
        } else {
          set({ error: response.error, isLoading: false })
        }
      } else {
        await new Promise(resolve => setTimeout(resolve, 800))
        const newMouvement: MouvementCaisse = {
          mouvementId: Date.now(),
          sessionId: get().sessionActive?.sessionId || 1,
          type: MouvementType.REMISE,
          deviseCode,
          montant,
          dateHeure: new Date()
        }
        const currentMouvements = get().mouvements
        set({ 
          mouvements: [...currentMouvements, newMouvement],
          isLoading: false 
        })
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Erreur lors de la remise au coffre"
      set({ error: errorMessage, isLoading: false })
    }
  },

  fermerSession: async () => {
    set({ isLoading: true, error: null })
    
    try {
      const isRealApi = useDataSourceStore.getState().isRealApi
      
      if (isRealApi) {
        const response = await apiClient.post<FermerSessionResponse>("/api/gestion-caisse/fermer-session")
        if (response.success) {
          set({ 
            sessionActive: response.data,
            isLoading: false 
          })
        } else {
          set({ error: response.error, isLoading: false })
        }
      } else {
        await new Promise(resolve => setTimeout(resolve, 1500))
        const currentSession = get().sessionActive
        if (currentSession) {
          const closedSession: SessionCaisse = {
            ...currentSession,
            statut: SessionStatut.FERME,
            dateFermeture: new Date(),
            montantFermeture: 695.50,
            ecart: -4.50
          }
          set({ 
            sessionActive: closedSession,
            isLoading: false 
          })
        } else {
          set({ isLoading: false })
        }
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Erreur lors de la fermeture de session"
      set({ error: errorMessage, isLoading: false })
    }
  },

  consulterHistorique: async () => {
    set({ isLoading: true, error: null })
    
    try {
      const isRealApi = useDataSourceStore.getState().isRealApi
      
      if (isRealApi) {
        const response = await apiClient.get<HistoriqueResponse>("/api/gestion-caisse/historique")
        if (response.success) {
          set({ 
            historique: response.data,
            showHistoriqueDialog: true,
            isLoading: false 
          })
        } else {
          set({ error: response.error, isLoading: false })
        }
      } else {
        await new Promise(resolve => setTimeout(resolve, 600))
        const mockHistorique = createMockHistorique()
        set({ 
          historique: mockHistorique,
          showHistoriqueDialog: true,
          isLoading: false 
        })
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Erreur lors de la consultation de l'historique"
      set({ error: errorMessage, isLoading: false })
    }
  },

  consulterSession: async (sessionId: number) => {
    set({ isLoading: true, error: null, selectedSessionId: sessionId })
    
    try {
      const isRealApi = useDataSourceStore.getState().isRealApi
      
      if (isRealApi) {
        const [sessionResponse, mouvementsResponse] = await Promise.all([
          apiClient.get<SessionDetailResponse>(`/api/gestion-caisse/session/${sessionId}`),
          apiClient.get<MouvementsResponse>(`/api/gestion-caisse/mouvements/${sessionId}`)
        ])
        
        if (sessionResponse.success && mouvementsResponse.success) {
          set({ 
            mouvements: mouvementsResponse.data,
            showConsultationDialog: true,
            isLoading: false 
          })
        } else {
          set({ 
            error: sessionResponse.error || mouvementsResponse.error,
            isLoading: false 
          })
        }
      } else {
        await new Promise(resolve => setTimeout(resolve, 500))
        const mockMouvements = createMockMouvements()
        set({ 
          mouvements: mockMouvements,
          showConsultationDialog: true,
          isLoading: false 
        })
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Erreur lors de la consultation de session"
      set({ error: errorMessage, isLoading: false })
    }
  },

  reimprimerTickets: async (sessionId: number) => {
    set({ isLoading: true, error: null })
    
    try {
      const isRealApi = useDataSourceStore.getState().isRealApi
      
      if (isRealApi) {
        const response = await apiClient.post(`/api/gestion-caisse/reimprimer-tickets/${sessionId}`)
        if (response.success) {
          set({ isLoading: false })
        } else {
          set({ error: response.error, isLoading: false })
        }
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000))
        set({ isLoading: false })
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Erreur lors de la réimpression des tickets"
      set({ error: errorMessage, isLoading: false })
    }
  },

  setShowHistoriqueDialog: (show: boolean) => {
    set({ showHistoriqueDialog: show })
  },

  setShowConsultationDialog: (show: boolean) => {
    set({ showConsultationDialog: show, selectedSessionId: show ? get().selectedSessionId : null })
  },

  reset: () => {
    set({
      sessionActive: null,
      parametres: null,
      sessionsConcurrentes: [],
      mouvements: [],
      historique: [],
      dateComptable: null,
      isLoading: false,
      error: null,
      showHistoriqueDialog: false,
      showConsultationDialog: false,
      selectedSessionId: null
    })
  }
}))