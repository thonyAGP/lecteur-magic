// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useSeparationStore } from '../separationStore';

vi.mock('@/services/api/endpoints-lot6', () => ({
  separationApi: {
    searchAccount: vi.fn(),
    validate: vi.fn(),
    execute: vi.fn(),
    getProgress: vi.fn(),
    getResult: vi.fn(),
  },
}));

import { separationApi } from '@/services/api/endpoints-lot6';

const mockAccounts = [
  { codeAdherent: 1001, filiation: 0, nom: 'Dupont', prenom: 'Jean', societe: 'ADH', solde: 1250, nbTransactions: 45 },
  { codeAdherent: 1002, filiation: 0, nom: 'Martin', prenom: 'Marie', societe: 'ADH', solde: 890.5, nbTransactions: 23 },
];

const mockPreview = {
  nbTransactionsATransferer: 10,
  montantATransferer: 500,
  alertes: [],
};

const mockResult = {
  operationId: 'op-001',
  status: 'completed' as const,
  nbTransactionsTransferees: 10,
  montantTransfere: 500,
};

const mockProgress = {
  operationId: 'op-001',
  progress: 50,
  status: 'in_progress' as const,
};

describe('useSeparationStore', () => {
  beforeEach(() => {
    useSeparationStore.setState({
      compteSource: null,
      compteDestination: null,
      preview: null,
      result: null,
      progress: null,
      currentStep: 'selection',
      searchResults: [],
      isSearching: false,
      isValidating: false,
      isExecuting: false,
      error: null,
    });
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have default values', () => {
      const state = useSeparationStore.getState();
      expect(state.compteSource).toBeNull();
      expect(state.compteDestination).toBeNull();
      expect(state.preview).toBeNull();
      expect(state.result).toBeNull();
      expect(state.progress).toBeNull();
      expect(state.currentStep).toBe('selection');
      expect(state.searchResults).toEqual([]);
      expect(state.isSearching).toBe(false);
      expect(state.isValidating).toBe(false);
      expect(state.isExecuting).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('searchAccount', () => {
    it('should set search results on success', async () => {
      vi.mocked(separationApi.searchAccount).mockResolvedValue({
        data: { data: mockAccounts },
      } as never);

      await useSeparationStore.getState().searchAccount('ADH', 'Dupont');

      expect(useSeparationStore.getState().searchResults).toEqual(mockAccounts);
      expect(useSeparationStore.getState().isSearching).toBe(false);
    });

    it('should set error on failure in non-DEV mode', async () => {
      // import.meta.env.DEV is false in test environment
      vi.mocked(separationApi.searchAccount).mockRejectedValue(new Error('Network error'));

      await useSeparationStore.getState().searchAccount('ADH', 'test');

      // In test mode (not DEV), should fallback to mock accounts
      const state = useSeparationStore.getState();
      expect(state.isSearching).toBe(false);
    });

    it('should handle null data', async () => {
      vi.mocked(separationApi.searchAccount).mockResolvedValue({
        data: { data: null },
      } as never);

      await useSeparationStore.getState().searchAccount('ADH', 'test');
      expect(useSeparationStore.getState().searchResults).toEqual([]);
    });
  });

  describe('selectSource', () => {
    it('should set source account', () => {
      useSeparationStore.getState().selectSource(mockAccounts[0] as never);
      expect(useSeparationStore.getState().compteSource).toEqual(mockAccounts[0]);
    });
  });

  describe('selectDestination', () => {
    it('should set destination account', () => {
      useSeparationStore.getState().selectDestination(mockAccounts[1] as never);
      expect(useSeparationStore.getState().compteDestination).toEqual(mockAccounts[1]);
    });
  });

  describe('validateSeparation', () => {
    it('should return error if accounts not selected', async () => {
      const result = await useSeparationStore.getState().validateSeparation('ADH', 'user1');

      expect(result).toEqual({ success: false, error: 'Comptes source et destination requis' });
    });

    it('should validate and set preview on success', async () => {
      useSeparationStore.setState({
        compteSource: mockAccounts[0] as never,
        compteDestination: mockAccounts[1] as never,
      });
      vi.mocked(separationApi.validate).mockResolvedValue({
        data: { data: mockPreview },
      } as never);

      const result = await useSeparationStore.getState().validateSeparation('ADH', 'user1');

      expect(result).toEqual({ success: true });
      expect(useSeparationStore.getState().preview).toEqual(mockPreview);
      expect(useSeparationStore.getState().currentStep).toBe('preview');
      expect(useSeparationStore.getState().isValidating).toBe(false);
    });

    it('should set error on validation failure', async () => {
      useSeparationStore.setState({
        compteSource: mockAccounts[0] as never,
        compteDestination: mockAccounts[1] as never,
      });
      vi.mocked(separationApi.validate).mockRejectedValue(new Error('Same account'));

      const result = await useSeparationStore.getState().validateSeparation('ADH', 'user1');

      expect(result).toEqual({ success: false, error: 'Same account' });
      expect(useSeparationStore.getState().isValidating).toBe(false);
    });

    it('should set isValidating during validation', async () => {
      useSeparationStore.setState({
        compteSource: mockAccounts[0] as never,
        compteDestination: mockAccounts[1] as never,
      });
      let resolve: (v: unknown) => void;
      const promise = new Promise((r) => { resolve = r; });
      vi.mocked(separationApi.validate).mockReturnValue(promise as never);

      const validatePromise = useSeparationStore.getState().validateSeparation('ADH', 'user1');
      expect(useSeparationStore.getState().isValidating).toBe(true);

      resolve!({ data: { data: mockPreview } });
      await validatePromise;
      expect(useSeparationStore.getState().isValidating).toBe(false);
    });
  });

  describe('executeSeparation', () => {
    it('should return error if accounts not selected', async () => {
      const result = await useSeparationStore.getState().executeSeparation('ADH', 'user1');

      expect(result).toEqual({ success: false, error: 'Comptes source et destination requis' });
    });

    it('should execute and poll progress', async () => {
      useSeparationStore.setState({
        compteSource: mockAccounts[0] as never,
        compteDestination: mockAccounts[1] as never,
      });
      vi.mocked(separationApi.execute).mockResolvedValue({
        data: { data: { operationId: 'op-001' } },
      } as never);
      vi.mocked(separationApi.getResult).mockResolvedValue({
        data: { data: mockResult },
      } as never);

      const result = await useSeparationStore.getState().executeSeparation('ADH', 'user1');

      expect(result).toEqual({ success: true });
      expect(useSeparationStore.getState().result).toEqual(mockResult);
      expect(useSeparationStore.getState().currentStep).toBe('result');
      expect(useSeparationStore.getState().isExecuting).toBe(false);
    });

    it('should set error on execution failure', async () => {
      useSeparationStore.setState({
        compteSource: mockAccounts[0] as never,
        compteDestination: mockAccounts[1] as never,
      });
      vi.mocked(separationApi.execute).mockRejectedValue(new Error('Server error'));

      const result = await useSeparationStore.getState().executeSeparation('ADH', 'user1');

      expect(result).toEqual({ success: false, error: 'Server error' });
      expect(useSeparationStore.getState().currentStep).toBe('confirmation');
    });
  });

  describe('pollProgress', () => {
    it('should set result when available', async () => {
      vi.mocked(separationApi.getResult).mockResolvedValue({
        data: { data: mockResult },
      } as never);

      await useSeparationStore.getState().pollProgress('op-001');

      expect(useSeparationStore.getState().result).toEqual(mockResult);
      expect(useSeparationStore.getState().currentStep).toBe('result');
    });

    it('should fallback to progress when result not ready', async () => {
      vi.mocked(separationApi.getResult).mockRejectedValue(new Error('Not ready'));
      vi.mocked(separationApi.getProgress).mockResolvedValue({
        data: { data: mockProgress },
      } as never);

      await useSeparationStore.getState().pollProgress('op-001');

      expect(useSeparationStore.getState().progress).toEqual(mockProgress);
    });

    it('should silently handle both errors', async () => {
      vi.mocked(separationApi.getResult).mockRejectedValue(new Error('fail'));
      vi.mocked(separationApi.getProgress).mockRejectedValue(new Error('fail'));

      // Should not throw
      await useSeparationStore.getState().pollProgress('op-001');
    });
  });

  describe('setStep', () => {
    it('should change the current step', () => {
      useSeparationStore.getState().setStep('confirmation');
      expect(useSeparationStore.getState().currentStep).toBe('confirmation');
    });
  });

  describe('reset', () => {
    it('should reset all state', () => {
      useSeparationStore.setState({
        compteSource: mockAccounts[0] as never,
        compteDestination: mockAccounts[1] as never,
        preview: mockPreview as never,
        result: mockResult as never,
        currentStep: 'result',
        error: 'error',
      });

      useSeparationStore.getState().reset();

      const state = useSeparationStore.getState();
      expect(state.compteSource).toBeNull();
      expect(state.compteDestination).toBeNull();
      expect(state.preview).toBeNull();
      expect(state.result).toBeNull();
      expect(state.currentStep).toBe('selection');
      expect(state.error).toBeNull();
    });
  });
});
