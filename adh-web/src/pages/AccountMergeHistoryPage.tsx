import { useEffect, useState, useCallback } from 'react';
import type { FusionSeparationHistoryEntry, OperationType } from '@/types/accountMergeHistory';
import { OPERATION_TYPES } from '@/types/accountMergeHistory';
import { useAccountMergeHistoryStore } from '@/stores/accountMergeHistoryStore';
import { ScreenLayout } from '@/components/layout';
import { Button, Input } from '@/components/ui';
import { cn } from '@/lib/utils';

export const AccountMergeHistoryPage = () => {
  const {
    isLoading,
    error,
    lastCreatedEntry,
    historyEntries,
    createHistoryEntry,
    getHistoryByAccount,
    getHistoryByDateRange,
    setLoading,
    setError,
    setLastCreatedEntry,
    setHistoryEntries,
    clearState,
  } = useAccountMergeHistoryStore();

  const [searchMode, setSearchMode] = useState<'account' | 'dateRange'>('account');
  const [accountNumber, setAccountNumber] = useState('');
  const [filiationNumber, setFiliationNumber] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filterOperationType, setFilterOperationType] = useState<OperationType | ''>('');

  useEffect(() => {
    return () => {
      clearState();
    };
  }, [clearState]);

  const handleSearchByAccount = useCallback(async () => {
    const accNum = parseInt(accountNumber, 10);
    if (isNaN(accNum)) return;
    
    const filNum = filiationNumber ? parseInt(filiationNumber, 10) : undefined;
    await getHistoryByAccount(accNum, filNum);
  }, [accountNumber, filiationNumber, getHistoryByAccount]);

  const handleSearchByDateRange = useCallback(async () => {
    if (!startDate || !endDate) return;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const opType = filterOperationType === '' ? undefined : filterOperationType;
    
    await getHistoryByDateRange(start, end, opType);
  }, [startDate, endDate, filterOperationType, getHistoryByDateRange]);

  const handleSearch = useCallback(() => {
    if (searchMode === 'account') {
      handleSearchByAccount();
    } else {
      handleSearchByDateRange();
    }
  }, [searchMode, handleSearchByAccount, handleSearchByDateRange]);

  const handleAccountModeClick = useCallback(() => {
    setSearchMode('account');
  }, []);

  const handleDateRangeModeClick = useCallback(() => {
    setSearchMode('dateRange');
  }, []);

  const getOperationLabel = useCallback((type: OperationType) => {
    switch (type) {
      case OPERATION_TYPES.ENTRY:
        return 'Entrée';
      case OPERATION_TYPES.FUSION:
        return 'Fusion';
      case OPERATION_TYPES.SEPARATION:
        return 'Séparation';
    }
  }, []);

  const formatDate = useCallback((date: Date) => {
    return new Date(date).toLocaleString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }, []);

  return (
    <ScreenLayout className="p-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Historique Fusion/Séparation</h1>
          <p className="text-sm text-gray-600 mt-1">
            Consultez l'historique des opérations de fusion et séparation de comptes
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleAccountModeClick}
            className={cn(
              'px-4 py-2 rounded-md font-medium transition-colors',
              searchMode === 'account'
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            )}
          >
            Par compte
          </Button>
          <Button
            onClick={handleDateRangeModeClick}
            className={cn(
              'px-4 py-2 rounded-md font-medium transition-colors',
              searchMode === 'dateRange'
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            )}
          >
            Par période
          </Button>
        </div>

        <div className="border rounded-lg p-4 space-y-4 bg-white shadow-sm">
          {searchMode === 'account' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Numéro de compte *
                </label>
                <Input
                  type="number"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="Ex: 1234"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Numéro de filiation
                </label>
                <Input
                  type="number"
                  value={filiationNumber}
                  onChange={(e) => setFiliationNumber(e.target.value)}
                  placeholder="Ex: 1"
                  className="w-full"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date début *
                </label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date fin *
                </label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type d'opération
                </label>
                <select
                  value={filterOperationType}
                  onChange={(e) => setFilterOperationType(e.target.value as OperationType | '')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Tous</option>
                  <option value={OPERATION_TYPES.ENTRY}>Entrée</option>
                  <option value={OPERATION_TYPES.FUSION}>Fusion</option>
                  <option value={OPERATION_TYPES.SEPARATION}>Séparation</option>
                </select>
              </div>
            </div>
          )}

          <div>
            <Button
              onClick={handleSearch}
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Recherche...' : 'Rechercher'}
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            <p className="font-medium">Erreur</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-500">Chargement des données...</p>
            </div>
          ) : historyEntries.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="mt-4 font-medium">Aucun résultat trouvé</p>
              <p className="mt-2 text-sm">Essayez de modifier vos critères de recherche</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Chrono
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nom complet
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Compte réf.
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ancien pointé
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nouveau pointé
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Société
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {historyEntries.map((entry) => (
                    <tr key={entry.chronoId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {entry.chronoId}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                        {formatDate(entry.timestamp)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={cn(
                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                            entry.operationType === OPERATION_TYPES.FUSION && 'bg-blue-100 text-blue-800',
                            entry.operationType === OPERATION_TYPES.SEPARATION && 'bg-purple-100 text-purple-800',
                            entry.operationType === OPERATION_TYPES.ENTRY && 'bg-green-100 text-green-800'
                          )}
                        >
                          {getOperationLabel(entry.operationType)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {entry.fullName}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 font-mono">
                        {entry.referenceAccount}/{entry.referenceFiliation}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 font-mono">
                        {entry.oldPointedAccount}/{entry.oldPointedFiliation}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 font-mono">
                        {entry.newPointedAccount}/{entry.newPointedFiliation}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {entry.companyCode}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {historyEntries.length > 0 && (
          <div className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 px-4 py-3 rounded-lg">
            <span>
              {historyEntries.length} résultat{historyEntries.length > 1 ? 's' : ''} trouvé{historyEntries.length > 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>
    </ScreenLayout>
  );
};