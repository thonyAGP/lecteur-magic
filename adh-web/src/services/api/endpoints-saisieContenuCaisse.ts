import type { ApiResponse } from "@/services/api/apiClient"
import { apiClient } from "@/services/api/apiClient"
import { useDataSourceStore } from "@/stores/dataSourceStore"

import type { 
  MontantsComptesResponse, 
  ValiderRemiseRequest, 
  ValiderRemiseResponse, 
  GenererPvRequest, 
  GenererPvResponse,
  GestionArticleSession,
  GestionDeviseSession
} from "@/types/saisieContenuCaisse"

export const saisieContenuCaisseService = {
  // Récupérer les montants des comptes
  getMontantsComptes: async (societe: string, sessionId?: string): Promise<ApiResponse<MontantsComptesResponse>> => {
    const isRealApi = useDataSourceStore.getState().isRealApi

    if (!isRealApi) {
      return {
        success: true,
        data: {
          monnaie: 1000,
          produits: 500,
          cartes: 200,
          cheques: 300,
          od: 100,
          devises: 50
        }
      }
    }

    return apiClient.get('/api/saisie-contenu-caisse/montants-comptes', {
      params: { societe, sessionId }
    })
  },

  // Valider une remise
  validerRemise: async (data: ValiderRemiseRequest): Promise<ApiResponse<ValiderRemiseResponse>> => {
    const isRealApi = useDataSourceStore.getState().isRealApi

    if (!isRealApi) {
      return {
        success: true,
        data: {
          success: true,
          anomalies: [],
          ecarts: {}
        }
      }
    }

    return apiClient.post('/api/saisie-contenu-caisse/valider-remise', data)
  },

  // Récupérer les stocks d'articles
  getStocksArticles: async (societe: string, sessionId?: string): Promise<ApiResponse<GestionArticleSession[]>> => {
    const isRealApi = useDataSourceStore.getState().isRealApi

    if (!isRealApi) {
      return {
        success: true,
        data: [
          { stockProduit: 100, total: 1000 },
          { stockProduit: 50, total: 500 }
        ]
      }
    }

    return apiClient.get('/api/saisie-contenu-caisse/stocks-articles', {
      params: { societe, sessionId }
    })
  },

  // Récupérer les devises de session
  getDevisesSession: async (societe: string, sessionId?: string): Promise<ApiResponse<GestionDeviseSession[]>> => {
    const isRealApi = useDataSourceStore.getState().isRealApi

    if (!isRealApi) {
      return {
        success: true,
        data: [
          { 
            deviseLocale: 'EUR', 
            nombreDevises: 10, 
            nombreDevisesComptees: 8, 
            montantVersementDevises: 1000 
          }
        ]
      }
    }

    return apiClient.get('/api/saisie-contenu-caisse/devises-session', {
      params: { societe, sessionId }
    })
  },

  // Générer un procès-verbal
  genererPv: async (data: GenererPvRequest): Promise<ApiResponse<GenererPvResponse>> => {
    const isRealApi = useDataSourceStore.getState().isRealApi

    if (!isRealApi) {
      return {
        success: true,
        data: {
          pvId: Math.floor(Math.random() * 1000),
          dateCreation: new Date()
        }
      }
    }

    return apiClient.post('/api/saisie-contenu-caisse/generer-pv', data)
  }
}