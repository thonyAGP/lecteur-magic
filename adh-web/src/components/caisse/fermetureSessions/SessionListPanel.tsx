import { useCallback } from 'react'
import { useFermetureSessionsStore } from '@/stores/fermetureSessionsStore'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { Session } from '@/types/fermetureSessions'

interface SessionListPanelProps {
  selectedSessions: number[]
  onSessionSelection: (sessionId: number, checked: boolean) => void
  onSelectAll: (checked: boolean) => void
  onInitiateClosure: () => void
  className?: string
}

export const SessionListPanel = ({
  selectedSessions,
  onSessionSelection,
  onSelectAll,
  onInitiateClosure,
  className
}: SessionListPanelProps) => {
  const { sessions, isLoading } = useFermetureSessionsStore()

  const getStatusIndicator = useCallback((session: Session) => {
    const isOpen = session.statut === 'O'
    return (
      <div className={cn(
        'w-3 h-3 rounded-full',
        isOpen ? 'bg-green-500' : 'bg-red-500'
      )} />
    )
  }, [])

  const formatDate = useCallback((date: Date | null) => {
    if (!date) return '-'
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }, [])

  const areAllSelected = sessions.length > 0 && selectedSessions.length === sessions.length
  const hasSelectedSessions = selectedSessions.length > 0

  if (isLoading) {
    return (
      <div className={cn('p-4', className)}>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Sessions ouvertes</h3>
        <Button 
          onClick={onInitiateClosure}
          disabled={!hasSelectedSessions}
          variant={hasSelectedSessions ? 'primary' : 'secondary'}
        >
          Fermer les sessions sélectionnées ({selectedSessions.length})
        </Button>
      </div>

      {sessions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Aucune session ouverte
        </div>
      ) : (
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={areAllSelected}
                      onChange={(e) => onSelectAll(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                    Statut
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                    ID Session
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                    Date d'ouverture
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                    Date de fermeture
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sessions.map((session) => (
                  <tr 
                    key={session.id}
                    className={cn(
                      'hover:bg-gray-50 transition-colors',
                      selectedSessions.includes(session.id) && 'bg-blue-50'
                    )}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedSessions.includes(session.id)}
                        onChange={(e) => onSessionSelection(session.id, e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        {getStatusIndicator(session)}
                        <span className="text-sm">
                          {session.statut === 'O' ? 'Ouverte' : 'Fermée'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-mono">
                      {session.id}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {formatDate(session.dateOuverture)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {formatDate(session.dateFermeture)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}