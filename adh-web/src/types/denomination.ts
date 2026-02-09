export interface DenominationCatalog {
  id: number;
  deviseCode: string;
  valeur: number;
  type: 'billet' | 'piece';
  libelle: string;
  ordre: number;
}

export interface DenominationCounting {
  denominationId: number;
  quantite: number;
  total: number;
}

export interface CountingResult {
  deviseCode: string;
  totalCompte: number;
  totalAttendu: number;
  ecart: number;
  details: DenominationCounting[];
}

export interface CountingSession {
  sessionId: number;
  type: 'ouverture' | 'fermeture';
  deviseResults: CountingResult[];
  timestamp: string;
}
