export interface Session {
  id: number;
  dateOuverture: string;
  status: 'open' | 'closed';
  caisseId: number;
}

export interface OpenSessionRequest {
  caisseId: number;
  userId: number;
}

export interface SessionSummary {
  id: number;
  dateOuverture: string;
  dateFermeture?: string;
  totalVentes: number;
}

export interface Transaction {
  id: number;
  sessionId: number;
  type: string;
  montant: number;
  devise: string;
}

export interface TransactionLine {
  description: string;
  montant: number;
  devise: string;
}

export interface CreateTransactionRequest {
  sessionId: number;
  type: string;
  lignes: TransactionLine[];
}

export interface Denomination {
  id: number;
  deviseCode: string;
  valeur: number;
  type: 'billet' | 'piece';
}

export interface SaveCountingRequest {
  sessionId: number;
  items: { denominationId: number; quantite: number }[];
}

export interface Account {
  id: number;
  numero: string;
  nom: string;
}

export interface ExtraitCompte {
  compte: Account;
  operations: { date: string; libelle: string; montant: number }[];
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}
