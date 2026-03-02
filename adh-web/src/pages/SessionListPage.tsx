import { useEffect, useCallback } from "react"
import { ScreenLayout } from "@/components/layout"
import { Button, Dialog, Input } from "@/components/ui"
import { cn } from "@/lib/utils"
import { useSessionListStore } from "@/stores/sessionListStore"

export const SessionListPage = () => {
  const {
    sessions,
    isLoading,
    error,
    filters,
    fetchSessions,
    setFilters,
    clearError,
    reset,
    selectedSession,
    showDeleteDialog,
    showEditDialog,
    editFormData,
    validationErrors,
    searchQuery,
    sortConfig,
    pageSize,
    currentPage,
    totalCount,
    hasNextPage,
    hasPreviousPage,
    lastFetchTime,
    isInitialized,
    isDirty,
    optimisticUpdates,
    cachedFilters,
    retryCount,
    maxRetries,
    autoRefresh,
    refreshInterval
  } = useSessionListStore()

  const handleExisteSessionChange = useCallback((checked: boolean) => {
    setFilters({ existeSession: checked })
  }, [setFilters])

  const handleExisteSessionOuverteChange = useCallback((checked: boolean) => {
    setFilters({ existeSessionOuverte: checked })
  }, [setFilters])

  const handleSocieteChange = useCallback((value: string) => {
    setFilters({ societe: value || null })
  }, [setFilters])

  const handleRefresh = useCallback(() => {
    fetchSessions(filters)
  }, [fetchSessions, filters])

  const handleClearError = useCallback(() => {
    clearError()
  }, [clearError])

  useEffect(() => {
    fetchSessions(filters)
    
    return () => {
      reset()
    }
  }, [fetchSessions, filters, reset])

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const formatMontant = (montant: number | null) => {
    if (montant === null) return '-'
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(montant)
  }

  const getEtatLabel = (etat: string) => {
    switch (etat) {
      case 'O': return 'Ouverte'
      case 'F': return 'Fermée'
      case '': return 'Indéfinie'
      default: return etat
    }
  }

  const getEtatColor = (etat: string) => {
    switch (etat) {
      case 'O': return 'text-green-600 bg-green-50'
      case 'F': return 'text-red-600 bg-red-50'
      case '': return 'text-orange-600 bg-orange-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <ScreenLayout className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Sessions de Caisse</h1>
          <Button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <svg className={cn("w-4 h-4", isLoading && "animate-spin")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Actualiser
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Filtres</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="existeSession"
                checked={filters.existeSession}
                onChange={(e) => handleExisteSessionChange(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label htmlFor="existeSession" className="text-sm font-medium text-gray-700">
                Session existe
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="existeSessionOuverte"
                checked={filters.existeSessionOuverte}
                onChange={(e) => handleExisteSessionOuverteChange(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label htmlFor="existeSessionOuverte" className="text-sm font-medium text-gray-700">
                Session ouverte
              </label>
            </div>

            <div>
              <label htmlFor="societe" className="block text-sm font-medium text-gray-700 mb-1">
                Société
              </label>
              <Input
                id="societe"
                type="text"
                value={filters.societe || ''}
                onChange={(e) => handleSocieteChange(e.target.value)}
                placeholder="Filtrer par société..."
                className="w-full"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
                <div className="mt-2">
                  <Button
                    onClick={handleClearError}
                    className="text-red-800 bg-red-50 hover:bg-red-100 border-red-200"
                    size="sm"
                  >
                    Fermer
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Sessions ({sessions.length})</h2>
          </div>

          {isLoading ? (
            <div className="p-8 text-center">
              <div className="inline-flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-gray-500">Chargement des sessions...</span>
              </div>
            </div>
          ) : sessions.length === 0 ? (
            <div className="p-8 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v3m2 4h10M7 7h10" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune session</h3>
              <p className="mt-1 text-sm text-gray-500">
                Aucune session ne correspond aux critères de filtrage.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Société
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Caisse
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Opérateur
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date d'ouverture
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      État
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Montant ouverture
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sessions.map((session) => (
                    <tr key={session.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {session.societe}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {session.caisse}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {session.operateur}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(session.dateOuverture)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={cn(
                          "inline-flex px-2 py-1 text-xs font-semibold rounded-full",
                          getEtatColor(session.etat)
                        )}>
                          {getEtatLabel(session.etat)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                        {formatMontant(session.montantOuverture)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </ScreenLayout>
  )
}