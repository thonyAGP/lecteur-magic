import { create } from 'zustand';
import type { CaisseConfig, Denomination, DenominationCount } from '@/types';

interface CaisseStore {
  config: CaisseConfig | null;
  denominations: Denomination[];
  counting: DenominationCount[];
  setConfig: (config: CaisseConfig) => void;
  setDenominations: (denoms: Denomination[]) => void;
  updateCount: (denominationId: number, quantite: number) => void;
  resetCounting: () => void;
  getTotalByDevise: (deviseCode: string) => number;
}

export const useCaisseStore = create<CaisseStore>()((set, get) => ({
  config: null,
  denominations: [],
  counting: [],

  setConfig: (config) => set({ config }),
  setDenominations: (denominations) => set({ denominations }),

  updateCount: (denominationId, quantite) =>
    set((state) => {
      const denom = state.denominations.find((d) => d.id === denominationId);
      if (!denom) return state;
      const existing = state.counting.find(
        (c) => c.denominationId === denominationId
      );
      if (existing) {
        return {
          counting: state.counting.map((c) =>
            c.denominationId === denominationId
              ? { ...c, quantite, total: quantite * denom.valeur }
              : c
          ),
        };
      }
      return {
        counting: [
          ...state.counting,
          { denominationId, quantite, total: quantite * denom.valeur },
        ],
      };
    }),

  resetCounting: () => set({ counting: [] }),

  getTotalByDevise: (deviseCode) => {
    const state = get();
    return state.counting
      .filter((c) => {
        const denom = state.denominations.find(
          (d) => d.id === c.denominationId
        );
        return denom?.deviseCode === deviseCode;
      })
      .reduce((sum, c) => sum + c.total, 0);
  },
}));
