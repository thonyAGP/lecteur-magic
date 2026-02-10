// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useExtraitStore } from '../extraitStore';

vi.mock('@/services/api/endpoints-lot3', () => ({
  extraitApi: {
    searchAccount: vi.fn(),
    getExtrait: vi.fn(),
    printExtrait: vi.fn(),
  },
}));

import { extraitApi } from '@/services/api/endpoints-lot3';

const mockAccount = {
  codeAdherent: 1001,
  filiation: 0,
  nom: 'Dupont',
  prenom: 'Jean',
  societe: 'ADH',
};

const mockTransactions = [
  { id: 1, date: '2026-02-01', libelle: 'Achat', montant: -50, devise: 'EUR' },
  { id: 2, date: '2026-02-02', libelle: 'Credit', montant: 100, devise: 'EUR' },
];

const mockSummary = {
  solde: 250,
  devise: 'EUR',
  nbTransactions: 2,
};

describe('useExtraitStore', () => {
  beforeEach(() => {
    useExtraitStore.setState({
      selectedAccount: null,
      transactions: [],
      summary: null,
      searchResults: [],
      isSearching: false,
      isLoadingExtrait: false,
      isPrinting: false,
      error: null,
    });
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have default values', () => {
      const state = useExtraitStore.getState();
      expect(state.selectedAccount).toBeNull();
      expect(state.transactions).toEqual([]);
      expect(state.summary).toBeNull();
      expect(state.searchResults).toEqual([]);
      expect(state.isSearching).toBe(false);
      expect(state.isLoadingExtrait).toBe(false);
      expect(state.isPrinting).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('searchAccount', () => {
    it('should set search results on success', async () => {
      vi.mocked(extraitApi.searchAccount).mockResolvedValue({
        data: { data: [mockAccount] },
      } as never);

      await useExtraitStore.getState().searchAccount('ADH', 'Dupont');

      const state = useExtraitStore.getState();
      expect(state.searchResults).toEqual([mockAccount]);
      expect(state.isSearching).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should set isSearching during search', async () => {
      let resolve: (v: unknown) => void;
      const promise = new Promise((r) => { resolve = r; });
      vi.mocked(extraitApi.searchAccount).mockReturnValue(promise as never);

      const searchPromise = useExtraitStore.getState().searchAccount('ADH', 'Dupont');
      expect(useExtraitStore.getState().isSearching).toBe(true);

      resolve!({ data: { data: [] } });
      await searchPromise;
      expect(useExtraitStore.getState().isSearching).toBe(false);
    });

    it('should set error and clear results on failure', async () => {
      vi.mocked(extraitApi.searchAccount).mockRejectedValue(new Error('Network error'));

      await useExtraitStore.getState().searchAccount('ADH', 'test');

      const state = useExtraitStore.getState();
      expect(state.searchResults).toEqual([]);
      expect(state.error).toBe('Network error');
      expect(state.isSearching).toBe(false);
    });

    it('should handle non-Error exceptions', async () => {
      vi.mocked(extraitApi.searchAccount).mockRejectedValue('string error');

      await useExtraitStore.getState().searchAccount('ADH', 'test');

      expect(useExtraitStore.getState().error).toBe('Erreur recherche compte');
    });

    it('should handle null data response', async () => {
      vi.mocked(extraitApi.searchAccount).mockResolvedValue({
        data: { data: null },
      } as never);

      await useExtraitStore.getState().searchAccount('ADH', 'test');
      expect(useExtraitStore.getState().searchResults).toEqual([]);
    });
  });

  describe('selectAccount', () => {
    it('should set selected account and clear transactions', () => {
      useExtraitStore.setState({ transactions: mockTransactions, summary: mockSummary, error: 'old' });

      useExtraitStore.getState().selectAccount(mockAccount as never);

      const state = useExtraitStore.getState();
      expect(state.selectedAccount).toEqual(mockAccount);
      expect(state.transactions).toEqual([]);
      expect(state.summary).toBeNull();
      expect(state.error).toBeNull();
    });
  });

  describe('loadExtrait', () => {
    it('should load transactions and summary on success', async () => {
      vi.mocked(extraitApi.getExtrait).mockResolvedValue({
        data: { data: { transactions: mockTransactions, summary: mockSummary } },
      } as never);

      await useExtraitStore.getState().loadExtrait('ADH', 1001, 0);

      const state = useExtraitStore.getState();
      expect(state.transactions).toEqual(mockTransactions);
      expect(state.summary).toEqual(mockSummary);
      expect(state.isLoadingExtrait).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should set isLoadingExtrait during load', async () => {
      let resolve: (v: unknown) => void;
      const promise = new Promise((r) => { resolve = r; });
      vi.mocked(extraitApi.getExtrait).mockReturnValue(promise as never);

      const loadPromise = useExtraitStore.getState().loadExtrait('ADH', 1001, 0);
      expect(useExtraitStore.getState().isLoadingExtrait).toBe(true);

      resolve!({ data: { data: { transactions: [], summary: null } } });
      await loadPromise;
      expect(useExtraitStore.getState().isLoadingExtrait).toBe(false);
    });

    it('should set error on failure', async () => {
      vi.mocked(extraitApi.getExtrait).mockRejectedValue(new Error('Load failed'));

      await useExtraitStore.getState().loadExtrait('ADH', 1001, 0);

      const state = useExtraitStore.getState();
      expect(state.transactions).toEqual([]);
      expect(state.summary).toBeNull();
      expect(state.error).toBe('Load failed');
    });

    it('should handle null data', async () => {
      vi.mocked(extraitApi.getExtrait).mockResolvedValue({
        data: { data: null },
      } as never);

      await useExtraitStore.getState().loadExtrait('ADH', 1001, 0);

      expect(useExtraitStore.getState().transactions).toEqual([]);
      expect(useExtraitStore.getState().summary).toBeNull();
    });
  });

  describe('printExtrait', () => {
    it('should print without error', async () => {
      vi.mocked(extraitApi.printExtrait).mockResolvedValue({
        data: { data: { jobId: 'j1' } },
      } as never);

      await useExtraitStore.getState().printExtrait('ADH', 1001, 0, 'PDF');

      expect(useExtraitStore.getState().isPrinting).toBe(false);
      expect(useExtraitStore.getState().error).toBeNull();
    });

    it('should set isPrinting during printing', async () => {
      let resolve: (v: unknown) => void;
      const promise = new Promise((r) => { resolve = r; });
      vi.mocked(extraitApi.printExtrait).mockReturnValue(promise as never);

      const printPromise = useExtraitStore.getState().printExtrait('ADH', 1001, 0, 'PDF');
      expect(useExtraitStore.getState().isPrinting).toBe(true);

      resolve!({ data: { data: { jobId: 'j1' } } });
      await printPromise;
      expect(useExtraitStore.getState().isPrinting).toBe(false);
    });

    it('should set error on print failure', async () => {
      vi.mocked(extraitApi.printExtrait).mockRejectedValue(new Error('Printer offline'));

      await useExtraitStore.getState().printExtrait('ADH', 1001, 0, 'ESC_POS');

      expect(useExtraitStore.getState().error).toBe('Printer offline');
      expect(useExtraitStore.getState().isPrinting).toBe(false);
    });
  });

  describe('reset', () => {
    it('should reset all state to initial values', () => {
      useExtraitStore.setState({
        selectedAccount: mockAccount as never,
        transactions: mockTransactions as never,
        summary: mockSummary as never,
        searchResults: [mockAccount as never],
        isSearching: true,
        isLoadingExtrait: true,
        isPrinting: true,
        error: 'some error',
      });

      useExtraitStore.getState().reset();

      const state = useExtraitStore.getState();
      expect(state.selectedAccount).toBeNull();
      expect(state.transactions).toEqual([]);
      expect(state.summary).toBeNull();
      expect(state.searchResults).toEqual([]);
      expect(state.isSearching).toBe(false);
      expect(state.isLoadingExtrait).toBe(false);
      expect(state.isPrinting).toBe(false);
      expect(state.error).toBeNull();
    });
  });
});
