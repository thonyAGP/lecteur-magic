import { apiClient } from "@/services/api/apiClient"
import type { ApiResponse } from "@/services/api/apiClient"
import type { 
  ParametresCaisse, 
  SessionCaisse, 
  DateComptable, 
  SessionConcurrente, 
  MouvementCaisse,
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

export const gestionCaisseService = {
  getParametres: async (): Promise<ChargerParametresResponse> => {
    return await apiClient.get('/api/gestion-caisse/parametres')
  },

  getSessionActive: async (): Promise<ChargerSessionActiveResponse> => {
    return await apiClient.get('/api/gestion-caisse/session-active')
  },

  getDateComptable: async (): Promise<ChargerDateComptableResponse> => {
    return await apiClient.get('/api/gestion-caisse/date-comptable')
  },

  getSessionsConcurrentes: async (): Promise<SessionsConcurrentesResponse> => {
    return await apiClient.get('/api/gestion-caisse/sessions-concurrentes')
  },

  ouvrirSession: async (): Promise<OuvrirSessionResponse> => {
    return await apiClient.post('/api/gestion-caisse/ouvrir-session')
  },

  apportCoffre: async (montant: number, deviseCode: string): Promise<ApportCoffreResponse> => {
    return await apiClient.post('/api/gestion-caisse/apport-coffre', { montant, deviseCode })
  },

  apportProduit: async (produitId: number, quantite: number): Promise<ApportProduitResponse> => {
    return await apiClient.post('/api/gestion-caisse/apport-produit', { produitId, quantite })
  },

  remiseCoffre: async (montant: number, deviseCode: string): Promise<RemiseCoffreResponse> => {
    return await apiClient.post('/api/gestion-caisse/remise-coffre', { montant, deviseCode })
  },

  fermerSession: async (): Promise<FermerSessionResponse> => {
    return await apiClient.post('/api/gestion-caisse/fermer-session')
  },

  getHistorique: async (
    dateDebut?: string, 
    dateFin?: string, 
    operateurId?: number
  ): Promise<HistoriqueResponse> => {
    return await apiClient.get('/api/gestion-caisse/historique', { 
      params: { dateDebut, dateFin, operateurId } 
    })
  },

  getSessionDetail: async (sessionId: number): Promise<SessionDetailResponse> => {
    return await apiClient.get(`/api/gestion-caisse/session/${sessionId}`)
  },

  getMouvements: async (sessionId: number): Promise<MouvementsResponse> => {
    return await apiClient.get(`/api/gestion-caisse/mouvements/${sessionId}`)
  },

  reimprimerTickets: async (sessionId: number): Promise<ApiResponse<void>> => {
    return await apiClient.post(`/api/gestion-caisse/reimprimer-tickets/${sessionId}`)
  }
}