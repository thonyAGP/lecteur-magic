import { create } from 'zustand';
import type { CaisseConfig, Denomination, DenominationCount } from '@/types';
import { denominationApi } from '@/services/api/endpoints';

interface CaisseStore {
  config: CaisseConfig | null;
  denominations: Denomination[];
  counting: DenominationCount[];
  isLoadingDenominations: boolean;
  setConfig: (config: CaisseConfig) => void;
  setDenominations: (denoms: Denomination[]) => void;
  updateCount: (denominationId: number, quantite: number) => void;
  resetCounting: () => void;
  getTotalByDevise: (deviseCode: string) => number;
  loadDenominations: (deviseCode: string) => Promise<void>;
  getCounting: () => { denominationId: number; quantite: number }[];
}

export const useCaisseStore = create<CaisseStore>()((set, get) => ({
  config: null,
  denominations: [],
  counting: [],
  isLoadingDenominations: false,

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

  loadDenominations: async (deviseCode) => {
    set({ isLoadingDenominations: true });
    try {
      const response = await denominationApi.getByDevise(deviseCode);
      const denoms = response.data.data;
      set({
        denominations: denoms.map((d) => ({
          id: d.id,
          deviseCode: d.deviseCode,
          valeur: d.valeur,
          type: d.type,
          libelle: d.libelle ?? `${d.valeur}`,
        })),
      });
    } finally {
      set({ isLoadingDenominations: false });
    }
  },

  getCounting: () => {
    const state = get();
    return state.counting
      .filter((c) => c.quantite > 0)
      .map((c) => ({ denominationId: c.denominationId, quantite: c.quantite }));
  },
}));
