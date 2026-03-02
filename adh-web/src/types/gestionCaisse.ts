import type { ApiResponse } from "@/services/api/apiClient"

export const SessionStatut = {
  OUVERT: 'OUVERT',
  FERME: 'FERME',
  EN_CLOTURE: 'EN_CLOTURE'
} as const

export const MouvementType = {
  APPORT: 'APPORT',
  REMISE: 'REMISE',
  INITIAL: 'INITIAL'
} as const

export interface SessionCaisse {
  sessionId: number
  dateOuverture: Date
  dateFermeture: Date | null
  operateurId: number
  operateurNom: string
  statut: typeof SessionStatut[keyof typeof SessionStatut]
  montantOuverture: number
  montantFermeture: number | null
  ecart: number | null
}

export interface ParametresCaisse {
  caisseId: number
  seuilAlerte: number
  deviseLocale: string
  impressionAuto: boolean
}

export interface SessionCoffre {
  sessionId: number
  montantCoffre: number
  integrite: boolean
}

export interface MouvementCaisse {
  mouvementId: number
  sessionId: number
  type: typeof MouvementType[keyof typeof MouvementType]
  deviseCode: string
  montant: number
  dateHeure: Date
}

export interface SessionConcurrente {
  sessionId: number
  posteId: string
  operateurNom: string
  dateOuverture: Date
}

export interface DateComptable {
  date: Date
  valide: boolean
}

export interface GestionCaisseState {
  sessionActive: SessionCaisse | null
  parametres: ParametresCaisse | null
  sessionsConcurrentes: SessionConcurrente[]
  mouvements: MouvementCaisse[]
  historique: SessionCaisse[]
  dateComptable: DateComptable | null
  isLoading: boolean
  error: string | null
  showHistoriqueDialog: boolean
  showConsultationDialog: boolean
  selectedSessionId: number | null
}

export type ChargerParametresResponse = ApiResponse<ParametresCaisse>
export type ChargerSessionActiveResponse = ApiResponse<SessionCaisse | null>
export type ChargerDateComptableResponse = ApiResponse<DateComptable>
export type SessionsConcurrentesResponse = ApiResponse<SessionConcurrente[]>
export type OuvrirSessionResponse = ApiResponse<SessionCaisse>
export type ApportCoffreResponse = ApiResponse<MouvementCaisse>
export type ApportProduitResponse = ApiResponse<MouvementCaisse>
export type RemiseCoffreResponse = ApiResponse<MouvementCaisse>
export type FermerSessionResponse = ApiResponse<SessionCaisse>
export type HistoriqueResponse = ApiResponse<SessionCaisse[]>
export type SessionDetailResponse = ApiResponse<SessionCaisse>
export type MouvementsResponse = ApiResponse<MouvementCaisse[]>