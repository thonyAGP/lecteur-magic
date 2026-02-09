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
