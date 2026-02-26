import type { ApiResponse } from "@/services/api/apiClient"

// Entities
export interface RemiseCaisse {
  societe: string
  deviseLocale: string
  typeRemise: string
  montantCompte: number
  montantVersement: number
  ecart: number
}

export interface PvComptable {
  dateComptable: Date
  typeAnomalie: string
  montantEcart: number
}

export interface GestionDeviseSession {
  deviseLocale: string
  nombreDevises: number
  nombreDevisesComptees: number
  montantVersementDevises: number
}

export interface GestionArticleSession {
  stockProduit: number
  total: number
}

// Store State
export interface SaisieContenuCaisseState {
  remise: RemiseCaisse | null
  montantsSaisis: Record<string, number>
  montantsComptes: Record<string, number>
  ecarts: Record<string, number>
  anomalies: PvComptable[]
  stocksArticles: GestionArticleSession[]
  devisesSession: GestionDeviseSession[]
  isLoading: boolean
  error: string | null
  validationErrors: Record<string, string>
  coffre2Ouvert: boolean
  uniBI: string
}

// Action Types
export type SaisieContenuCaisseActions = {
  initialiserRemise: (societe: string, deviseLocale: string, typeRemise: string) => Promise<void>
  saisirMontant: (type: string, montant: number) => Promise<void>
  validerRemise: () => Promise<void>
  calculerEcarts: () => void
  chargerMontantsComptes: (societe: string) => Promise<void>
  genererPvComptable: (typeAnomalie: string, montantEcart: number) => Promise<void>
  mettreAJourStocks: () => Promise<void>
  reset: () => void
}

// API Request/Response Types
export type MontantsComptesResponse = {
  monnaie: number
  produits: number
  cartes: number
  cheques: number
  od: number
  devises: number
}

export type ValiderRemiseRequest = {
  societe: string
  typeRemise: string
  montants: Record<string, number>
}

export type ValiderRemiseResponse = {
  success: boolean
  anomalies: PvComptable[]
  ecarts: Record<string, number>
}

export type GenererPvRequest = {
  typeAnomalie: string
  montantEcart: number
  dateComptable: Date
}

export type GenererPvResponse = {
  pvId: number
  dateCreation: Date
}

// Constants
export const REMISE_TYPES = {
  PRODUIT: 'P',
  MONNAIE: 'M',
  CARTE: 'C'
} as const

export const ANOMALIE_TYPES = {
  MANQUANT: 'MANQUANT',
  EXCEDENT: 'EXCEDENT',
  DIFFERENCE: 'DIFFERENCE'
} as const