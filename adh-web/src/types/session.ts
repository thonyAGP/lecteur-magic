export type SessionStatus = 'closed' | 'opening' | 'open' | 'closing';

export interface DeviseSession {
  deviseCode: string;
  fondCaisse: number;
  totalVentes: number;
  totalEncaissements: number;
}

export interface Session {
  id: number;
  caisseId: number;
  userId: number;
  dateOuverture: string;
  dateFermeture?: string;
  status: SessionStatus;
  devises: DeviseSession[];
}

export type SessionDetailType = 'I' | 'C' | 'K' | 'L';
export type SessionDetailQuand = 'O' | 'F';

export interface SessionDetail {
  type: SessionDetailType;
  quand: SessionDetailQuand;
  montant: number;
  montantMonnaie: number;
  montantProduits: number;
  montantCartes: number;
  montantCheques: number;
  montantOd: number;
  nbreDevises: number;
}

export interface EcartDevise {
  deviseCode: string;
  attendu: number;
  compte: number;
  ecart: number;
}

export interface SessionEcart {
  attendu: number;
  compte: number;
  ecart: number;
  estEquilibre: boolean;
  statut: 'equilibre' | 'positif' | 'negatif' | 'alerte';
  ecartsDevises: EcartDevise[];
}

export interface SessionHistoryItem {
  id: number;
  caisseId: number;
  caisseNumero: string;
  userId: number;
  userLogin: string;
  dateOuverture: string;
  dateFermeture?: string;
  status: SessionStatus;
  ecart?: SessionEcart;
}

export interface SessionSummary {
  session: Session;
  details: SessionDetail[];
  ecart?: SessionEcart;
}
