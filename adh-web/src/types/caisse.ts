export interface Denomination {
  id: number;
  deviseCode: string;
  valeur: number;
  type: 'billet' | 'piece';
  libelle: string;
}

export interface DenominationCount {
  denominationId: number;
  quantite: number;
  total: number;
}

export interface CaisseConfig {
  id: number;
  numero: string;
  societe: string;
  libelle: string;
  devisePrincipale: string;
  devisesAutorisees: string[];
}
