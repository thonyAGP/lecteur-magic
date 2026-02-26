import { create } from "zustand"
import type {
  SaisieContenuCaisseState,
  SaisieContenuCaisseActions,
  RemiseCaisse,
  PvComptable,
  GestionDeviseSession,
  GestionArticleSession,
  MontantsComptesResponse,
  ValiderRemiseRequest,
  ValiderRemiseResponse,
  GenererPvRequest,
  GenererPvResponse,
  REMISE_TYPES,
  ANOMALIE_TYPES
} from "@/types/saisieContenuCaisse"
import { REMISE_TYPES, ANOMALIE_TYPES } from "@/types/saisieContenuCaisse"
import type { ApiResponse } from "@/services/api/apiClient"
import { apiClient } from "@/services/api/apiClient"
import { useDataSourceStore } from "@/stores/dataSourceStore"

type SaisieContenuCaisseStore = SaisieContenuCaisseState & SaisieContenuCaisseActions

const createMockMontantsComptes = (): MontantsComptesResponse => ({
  monnaie: 1250.75,
  produits: 45.90,
  cartes: 2340.50,
  cheques: 150.00,
  od: 75.25,
  devises: 890.30
})

const createMockDevisesSession = (): GestionDeviseSession[] => [
  {
    deviseLocale: "EUR",
    nombreDevises: 15,
    nombreDevisesComptees: 14,
    montantVersementDevises: 890.30
  },
  {
    deviseLocale: "USD",
    nombreDevises: 8,
    nombreDevisesComptees: 8,
    montantVersementDevises: 456.20
  },
  {
    deviseLocale: "GBP",
    nombreDevises: 5,
    nombreDevisesComptees: 5,
    montantVersementDevises: 234.10
  }
]

const createMockStocksArticles = (): GestionArticleSession[] => [
  {
    stockProduit: 25,
    total: 1125.50
  },
  {
    stockProduit: 42,
    total: 2310.75
  },
  {
    stockProduit: 18,
    total: 890.25
  }
]

const createMockAnomalies = (): PvComptable[] => [
  {
    dateComptable: new Date("2024-01-15"),
    typeAnomalie: ANOMALIE_TYPES.MANQUANT,
    montantEcart: -50.00
  },
  {
    dateComptable: new Date("2024-01-14"),
    typeAnomalie: ANOMALIE_TYPES.DIFFERENCE,
    montantEcart: 25.50
  }
]

export const useSaisieContenuCaisseStore = create<SaisieContenuCaisseStore>((set, get) => ({
  remise: null,
  montantsSaisis: {},
  montantsComptes: {},
  ecarts: {},
  anomalies: [],
  stocksArticles: [],
  devisesSession: [],
  isLoading: false,
  error: null,
  validationErrors: {},
  coffre2Ouvert: false,
  uniBI: "UNI",

  initialiserRemise: async (societe: string, deviseLocale: string, typeRemise: string) => {
    set({ isLoading: true, error: null, validationErrors: {} })

    try {
      const isRealApi = useDataSourceStore.getState().isRealApi

      if (isRealApi) {
        const [montantsResponse, devisesResponse, stocksResponse] = await Promise.all([
          apiClient.get<ApiResponse<MontantsComptesResponse>>(`/api/saisie-contenu-caisse/montants-comptes?societe=${societe}`),
          apiClient.get<ApiResponse<GestionDeviseSession[]>>(`/api/saisie-contenu-caisse/devises-session?societe=${societe}`),
          apiClient.get<ApiResponse<GestionArticleSession[]>>(`/api/saisie-contenu-caisse/stocks-articles?societe=${societe}`)
        ])

        const montantsComptes = {
          monnaie: montantsResponse.data.data.monnaie,
          produits: montantsResponse.data.data.produits,
          cartes: montantsResponse.data.data.cartes,
          cheques: montantsResponse.data.data.cheques,
          od: montantsResponse.data.data.od,
          devises: montantsResponse.data.data.devises
        }

        const remise: RemiseCaisse = {
          societe,
          deviseLocale,
          typeRemise,
          montantCompte: Object.values(montantsComptes).reduce((sum, val) => sum + val, 0),
          montantVersement: 0,
          ecart: 0
        }

        set({
          remise,
          montantsComptes,
          montantsSaisis: {
            monnaie: 0,
            produits: 0,
            cartes: 0,
            cheques: 0,
            od: 0,
            devises: 0
          },
          devisesSession: devisesResponse.data.data,
          stocksArticles: stocksResponse.data.data,
          isLoading: false
        })
      } else {
        await new Promise(resolve => setTimeout(resolve, 800))

        const montantsComptes = createMockMontantsComptes()
        
        const remise: RemiseCaisse = {
          societe,
          deviseLocale,
          typeRemise,
          montantCompte: Object.values(montantsComptes).reduce((sum, val) => sum + val, 0),
          montantVersement: 0,
          ecart: 0
        }

        set({
          remise,
          montantsComptes: {
            monnaie: montantsComptes.monnaie,
            produits: montantsComptes.produits,
            cartes: montantsComptes.cartes,
            cheques: montantsComptes.cheques,
            od: montantsComptes.od,
            devises: montantsComptes.devises
          },
          montantsSaisis: {
            monnaie: 0,
            produits: 0,
            cartes: 0,
            cheques: 0,
            od: 0,
            devises: 0
          },
          devisesSession: createMockDevisesSession(),
          stocksArticles: createMockStocksArticles(),
          anomalies: createMockAnomalies(),
          isLoading: false
        })
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Erreur lors de l'initialisation de la remise"
      set({ error: errorMessage, isLoading: false })
    }
  },

  saisirMontant: async (type: string, montant: number) => {
    set({ error: null, validationErrors: {} })

    try {
      if (montant < 0) {
        set({ 
          validationErrors: { 
            [type]: "Le montant doit être positif ou nul" 
          }
        })
        return
      }

      const state = get()
      const montantCompte = state.montantsComptes[type] || 0
      const ecart = montant - montantCompte

      const nouveauxMontantsSaisis = {
        ...state.montantsSaisis,
        [type]: montant
      }

      const nouveauxEcarts = {
        ...state.ecarts,
        [type]: ecart
      }

      if (ecart !== 0) {
        const typeAnomalie = ecart < 0 ? ANOMALIE_TYPES.MANQUANT : ANOMALIE_TYPES.EXCEDENT
        await get().genererPvComptable(typeAnomalie, Math.abs(ecart))
      }

      const montantVersementTotal = Object.values(nouveauxMontantsSaisis).reduce((sum, val) => sum + val, 0)
      const ecartTotal = Object.values(nouveauxEcarts).reduce((sum, val) => sum + val, 0)

      const remiseUpdated: RemiseCaisse | null = state.remise ? {
        ...state.remise,
        montantVersement: montantVersementTotal,
        ecart: ecartTotal
      } : null

      set({
        montantsSaisis: nouveauxMontantsSaisis,
        ecarts: nouveauxEcarts,
        remise: remiseUpdated
      })
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Erreur lors de la saisie du montant"
      set({ error: errorMessage })
    }
  },

  validerRemise: async () => {
    set({ isLoading: true, error: null })

    try {
      const state = get()
      
      if (!state.remise) {
        set({ error: "Aucune remise initialisée", isLoading: false })
        return
      }

      const isRealApi = useDataSourceStore.getState().isRealApi

      if (isRealApi) {
        const request: ValiderRemiseRequest = {
          societe: state.remise.societe,
          typeRemise: state.remise.typeRemise,
          montants: state.montantsSaisis
        }

        const response = await apiClient.post<ApiResponse<ValiderRemiseResponse>>('/api/saisie-contenu-caisse/valider-remise', request)
        
        if (response.data.data.success) {
          set({
            anomalies: [...state.anomalies, ...response.data.data.anomalies],
            ecarts: response.data.data.ecarts,
            isLoading: false
          })
        } else {
          set({ error: "Échec de la validation de la remise", isLoading: false })
        }
      } else {
        await new Promise(resolve => setTimeout(resolve, 1200))

        await get().mettreAJourStocks()

        const nouvellesAnomalies: PvComptable[] = Object.entries(state.ecarts)
          .filter(([, ecart]) => ecart !== 0)
          .map(([type, ecart]) => ({
            dateComptable: new Date(),
            typeAnomalie: ecart < 0 ? ANOMALIE_TYPES.MANQUANT : ANOMALIE_TYPES.EXCEDENT,
            montantEcart: Math.abs(ecart)
          }))

        set({
          anomalies: [...state.anomalies, ...nouvellesAnomalies],
          isLoading: false
        })
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Erreur lors de la validation de la remise"
      set({ error: errorMessage, isLoading: false })
    }
  },

  calculerEcarts: () => {
    const state = get()
    const nouveauxEcarts: Record<string, number> = {}

    const typesPaiement = ['monnaie', 'produits', 'cartes', 'cheques', 'od', 'devises']
    
    typesPaiement.forEach(type => {
      const montantVersement = state.montantsSaisis[type] || 0
      const montantCompte = state.montantsComptes[type] || 0
      nouveauxEcarts[type] = montantVersement - montantCompte
    })

    const ecartTotal = Object.values(nouveauxEcarts).reduce((sum, val) => sum + val, 0)

    const remiseUpdated: RemiseCaisse | null = state.remise ? {
      ...state.remise,
      ecart: ecartTotal
    } : null

    set({ 
      ecarts: nouveauxEcarts,
      remise: remiseUpdated
    })
  },

  chargerMontantsComptes: async (societe: string) => {
    set({ isLoading: true, error: null })

    try {
      const isRealApi = useDataSourceStore.getState().isRealApi

      if (isRealApi) {
        const response = await apiClient.get<ApiResponse<MontantsComptesResponse>>(`/api/saisie-contenu-caisse/montants-comptes?societe=${societe}`)
        
        set({
          montantsComptes: {
            monnaie: response.data.data.monnaie,
            produits: response.data.data.produits,
            cartes: response.data.data.cartes,
            cheques: response.data.data.cheques,
            od: response.data.data.od,
            devises: response.data.data.devises
          },
          isLoading: false
        })
      } else {
        await new Promise(resolve => setTimeout(resolve, 600))
        
        const montantsComptes = createMockMontantsComptes()
        
        set({
          montantsComptes: {
            monnaie: montantsComptes.monnaie,
            produits: montantsComptes.produits,
            cartes: montantsComptes.cartes,
            cheques: montantsComptes.cheques,
            od: montantsComptes.od,
            devises: montantsComptes.devises
          },
          isLoading: false
        })
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Erreur lors du chargement des montants comptés"
      set({ error: errorMessage, isLoading: false })
    }
  },

  genererPvComptable: async (typeAnomalie: string, montantEcart: number) => {
    try {
      const isRealApi = useDataSourceStore.getState().isRealApi

      if (isRealApi) {
        const request: GenererPvRequest = {
          typeAnomalie,
          montantEcart,
          dateComptable: new Date()
        }

        const response = await apiClient.post<ApiResponse<GenererPvResponse>>('/api/saisie-contenu-caisse/generer-pv', request)
        
        const nouveauPv: PvComptable = {
          dateComptable: request.dateComptable,
          typeAnomalie,
          montantEcart
        }

        const state = get()
        set({ anomalies: [...state.anomalies, nouveauPv] })
      } else {
        await new Promise(resolve => setTimeout(resolve, 300))

        const nouveauPv: PvComptable = {
          dateComptable: new Date(),
          typeAnomalie,
          montantEcart
        }

        const state = get()
        set({ anomalies: [...state.anomalies, nouveauPv] })
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Erreur lors de la génération du PV comptable"
      set({ error: errorMessage })
    }
  },

  mettreAJourStocks: async () => {
    try {
      const isRealApi = useDataSourceStore.getState().isRealApi

      if (isRealApi) {
        await apiClient.post('/api/saisie-contenu-caisse/maj-stocks', {})
      } else {
        await new Promise(resolve => setTimeout(resolve, 400))
      }

      const state = get()
      const stocksUpdated = state.stocksArticles.map(stock => ({
        ...stock,
        stockProduit: Math.max(0, stock.stockProduit - 1),
        total: stock.total * 0.98
      }))

      set({ stocksArticles: stocksUpdated })
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Erreur lors de la mise à jour des stocks"
      set({ error: errorMessage })
    }
  },

  reset: () => {
    set({
      remise: null,
      montantsSaisis: {},
      montantsComptes: {},
      ecarts: {},
      anomalies: [],
      stocksArticles: [],
      devisesSession: [],
      isLoading: false,
      error: null,
      validationErrors: {},
      coffre2Ouvert: false,
      uniBI: "UNI"
    })
  }
}))