import { useCallback, useEffect } from 'react'
import { ScreenLayout } from '@/components/layout'
import { Button, Input } from '@/components/ui'
import { cn } from '@/lib/utils'
import { useSessionHistoryStore } from '@/stores/sessionHistoryStore'

export const SessionHistoryPage = () => {
  const {
    sessions,
    selectedSessionId,
    selectedSessionDetails,
    selectedSessionCurrencies,
    isLoading,
    error,
    filters,
    startDate,
    endDate,
    status,
    operatorId,
    isFiltersApplied,
    totalSessions,
    currentPage,
    pageSize,
    sortBy,
    sortOrder,
    hasNextPage,
    hasPreviousPage,
    canApplyFilters,
    canClearFilters,
    lastUpdated,
    loadSessions,
    loadSessionDetails,
    selectSession,
    setFilters,
    setStartDate,
    setEndDate,
    setStatus,
    setOperatorId,
    applyFilters,
    clearFilters,
    setPage,
    setSortBy,
    toggleSortOrder,
    reset
  } = useSessionHistoryStore()

  useEffect(() => {
    loadSessions()
    return () => {
      reset()
    }
  }, [loadSessions, reset])

  const handleApplyFilters = useCallback(() => {
    applyFilters()
  }, [applyFilters])

  const handleClearFilters = useCallback(() => {
    clearFilters()
  }, [clearFilters])

  const handleSessionSelect = useCallback((sessionId: string) => {
    selectSession(sessionId)
    loadSessionDetails(sessionId)
  }, [selectSession, loadSessionDetails])

  const handleStartDateChange = useCallback((value: string) => {
    setStartDate(value ? new Date(value) : null)
  }, [setStartDate])

  const handleEndDateChange = useCallback((value: string) => {
    setEndDate(value ? new Date(value) : null)
  }, [setEndDate])

  const handleStatusChange = useCallback((value: string) => {
    setStatus(value || null)
  }, [setStatus])

  const handleOperatorIdChange = useCallback((value: string) => {
    setOperatorId(value)
  }, [setOperatorId])

  const handleSort = useCallback((column: string) => {
    if (sortBy === column) {
      toggleSortOrder()
    } else {
      setSortBy(column)
    }
  }, [sortBy, setSortBy, toggleSortOrder])

  const formatDate = (date: Date | null) => {
    if (!date) return '-'
    return date.toLocaleDateString('fr-FR')
  }

  const formatTime = (time: string | null) => {
    if (!time) return '-'
    return time
  }

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 text-xs rounded-full font-medium"
    switch (status) {
      case 'OPEN':
        return `${baseClasses} bg-green-100 text-green-800`
      case 'CLOSED':
        return `${baseClasses} bg-gray-100 text-gray-800`
      default:
        return `${baseClasses} bg-blue-100 text-blue-800`
    }
  }

  if (error) {
    return (
      <ScreenLayout className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Erreur: {error}</p>
        </div>
      </ScreenLayout>
    )
  }

  return (
    <ScreenLayout className="p-6 space-y-6">
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-semibold text-gray-900">Historique des Sessions</h1>
          <p className="text-gray-600 mt-1">Consultation des sessions de caisse ouvertes et fermées</p>
        </div>

        <div className="p-6 border-b bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date début
              </label>
              <Input
                type="date"
                value={startDate ? startDate.toISOString().split('T')[0] : ''}
                onChange={(e) => handleStartDateChange(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date fin
              </label>
              <Input
                type="date"
                value={endDate ? endDate.toISOString().split('T')[0] : ''}
                onChange={(e) => handleEndDateChange(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Statut
              </label>
              <select
                value={status || ''}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tous</option>
                <option value="OPEN">Ouvert</option>
                <option value="CLOSED">Fermé</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID Opérateur
              </label>
              <Input
                value={operatorId}
                onChange={(e) => handleOperatorIdChange(e.target.value)}
                placeholder="Rechercher par opérateur..."
                className="w-full"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleApplyFilters}
              disabled={!canApplyFilters || isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Appliquer les filtres
            </Button>
            <Button
              onClick={handleClearFilters}
              disabled={!canClearFilters || isLoading}
              variant="outline"
            >
              Effacer les filtres
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Sessions ({totalSessions})</h2>
              {isLoading && (
                <div className="text-sm text-gray-500">Chargement...</div>
              )}
            </div>

            {sessions.length === 0 && !isLoading ? (
              <div className="text-center py-8 text-gray-500">
                Aucune session trouvée
              </div>
            ) : (
              <div className="bg-white border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort('sessionId')}
                        >
                          ID Session
                          {sortBy === 'sessionId' && (
                            <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </th>
                        <th
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSort('openedDate')}
                        >
                          Date ouverture
                          {sortBy === 'openedDate' && (
                            <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Heure ouverture
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date fermeture
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Heure fermeture
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Opérateur
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {sessions.map((session) => (
                        <tr
                          key={session.sessionId}
                          className={cn(
                            "hover:bg-gray-50 cursor-pointer",
                            selectedSessionId === session.sessionId && "bg-blue-50"
                          )}
                          onClick={() => handleSessionSelect(session.sessionId)}
                        >
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {session.sessionId}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {formatDate(session.openedDate)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {formatTime(session.openedTime)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {formatDate(session.closedDate)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {formatTime(session.closedTime)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {session.operatorId}
                          </td>
                          <td className="px-4 py-3">
                            <span className={getStatusBadge(session.status)}>
                              {session.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Détails de la session</h2>
              {selectedSessionDetails ? (
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-500">ID Session:</span>
                      <p className="text-sm text-gray-900">{selectedSessionDetails.sessionId}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Opérateur:</span>
                      <p className="text-sm text-gray-900">{selectedSessionDetails.operatorId}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Date ouverture:</span>
                      <p className="text-sm text-gray-900">
                        {formatDate(selectedSessionDetails.openedDate)} {selectedSessionDetails.openedTime}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Date fermeture:</span>
                      <p className="text-sm text-gray-900">
                        {selectedSessionDetails.closedDate 
                          ? `${formatDate(selectedSessionDetails.closedDate)} ${selectedSessionDetails.closedTime}`
                          : 'Session ouverte'
                        }
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Statut:</span>
                      <p className="text-sm">
                        <span className={getStatusBadge(selectedSessionDetails.status)}>
                          {selectedSessionDetails.status}
                        </span>
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Total montant:</span>
                      <p className="text-sm text-gray-900">{selectedSessionDetails.totalAmount?.toFixed(2) || '0.00'} €</p>
                    </div>
                  </div>
                  {selectedSessionDetails.description && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Description:</span>
                      <p className="text-sm text-gray-900">{selectedSessionDetails.description}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
                  Sélectionnez une session pour voir les détails
                </div>
              )}
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Devises</h2>
              {selectedSessionCurrencies.length > 0 ? (
                <div className="bg-white border rounded-lg overflow-hidden">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Code devise
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Montant
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Locale
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedSessionCurrencies.map((currency, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {currency.currencyCode}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700 text-right">
                            {currency.amount.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {currency.isLocalCurrency ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Oui
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                Non
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : selectedSessionDetails ? (
                <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
                  Aucune devise pour cette session
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
                  Sélectionnez une session pour voir les devises
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ScreenLayout>
  )
}