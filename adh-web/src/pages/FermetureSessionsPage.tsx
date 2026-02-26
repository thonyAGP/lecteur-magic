import { useCallback, useEffect, useState } from 'react'
import { useFermetureSessionsStore } from '@/stores/fermetureSessionsStore'
import { ScreenLayout } from '@/components/layout'
import { Button, Dialog, Input } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { Session } from '@/types/fermetureSessions'

export const FermetureSessionsPage = () => {
  const {
    sessions,
    currentSession,
    unilateralBilateralTypes,
    isLoading,
    error,
    isClosing,
    loadSessions,
    loadUnilateralBilateralTypes,
    fermerSession,
    generateClosureCode,
    validateSessionClosure,
    reset
  } = useFermetureSessionsStore()

  const [selectedSessions, setSelectedSessions] = useState<number[]>([])
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [closureCode, setClosureCode] = useState('')
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [closureResult, setClosureResult] = useState<{
    success: boolean
    message: string
    details?: unknown
  } | null>(null)

  useEffect(() => {
    loadSessions()
    loadUnilateralBilateralTypes()
    
    return () => {
      reset()
    }
  }, [loadSessions, loadUnilateralBilateralTypes, reset])

  const handleSessionSelection = useCallback((sessionId: number, checked: boolean) => {
    setSelectedSessions(prev => 
      checked 
        ? [...prev, sessionId]
        : prev.filter(id => id !== sessionId)
    )
  }, [])

  const handleSelectAll = useCallback((checked: boolean) => {
    setSelectedSessions(checked ? sessions.map(s => s.id) : [])
  }, [sessions])

  const handleInitiateClosure = useCallback(() => {
    if (selectedSessions.length === 0) return
    
    const firstSessionId = selectedSessions[0]
    const code = generateClosureCode(firstSessionId)
    setClosureCode(code)
    setShowConfirmDialog(true)
  }, [selectedSessions, generateClosureCode])

  const handleConfirmClosure = useCallback(async () => {
    setValidationErrors([])
    
    try {
      for (const sessionId of selectedSessions) {
        const isValid = await validateSessionClosure(sessionId)
        if (!isValid) {
          setValidationErrors(prev => [...prev, `Session ${sessionId} ne peut pas être fermée`])
          return
        }
      }

      for (const sessionId of selectedSessions) {
        await fermerSession(sessionId)
      }

      setClosureResult({
        success: true,
        message: `${selectedSessions.length} session(s) fermée(s) avec succès`,
        details: { closureCode, sessionIds: selectedSessions }
      })

      setShowConfirmDialog(false)
      setSelectedSessions([])
      await loadSessions()
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Erreur lors de la fermeture'
      setClosureResult({
        success: false,
        message: errorMessage
      })
      setShowConfirmDialog(false)
    }
  }, [selectedSessions, validateSessionClosure, fermerSession, closureCode, loadSessions])

  const handleCancelClosure = useCallback(() => {
    setShowConfirmDialog(false)
    setClosureCode('')
    setValidationErrors([])
  }, [])

  const handlePrintReport = useCallback(() => {
    if (!closureResult?.details) return
    
    const printContent = `
      Rapport de Fermeture de Sessions
      ================================
      Date: ${new Date().toLocaleString()}
      Code de fermeture: ${closureCode}
      Sessions fermées: ${selectedSessions.join(', ')}
      Statut: ${closureResult.success ? 'Succès' : 'Échec'}
    `
    
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`<pre>${printContent}</pre>`)
      printWindow.print()
      printWindow.close()
    }
  }, [closureResult, closureCode, selectedSessions])

  const formatSessionDateTime = useCallback((date: Date) => {
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }, [])

  const getStatusIndicator = useCallback((session: Session) => {
    const isSelected = selectedSessions.includes(session.id)
    return (
      <div className={cn(
        "w-3 h-3 rounded-full",
        session.statut === 'O' && !isSelected && "bg-green-500",
        session.statut === 'O' && isSelected && "bg-orange-500",
        session.statut === 'C' && "bg-gray-400"
      )} />
    )
  }, [selectedSessions])

  if (isLoading && sessions.length === 0) {
    return (
      <ScreenLayout className="flex items-center justify-center">
        <div className="text-lg">Chargement des sessions...</div>
      </ScreenLayout>
    )
  }

  if (error) {
    return (
      <ScreenLayout className="flex items-center justify-center">
        <div className="text-red-600 text-lg">{error}</div>
      </ScreenLayout>
    )
  }

  return (
    <ScreenLayout className="p-6 space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Fermeture des Sessions</h2>
          <div className="flex items-center gap-4">
            <Button
              onClick={handleInitiateClosure}
              disabled={selectedSessions.length === 0 || isClosing}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Fermer les sessions sélectionnées
            </Button>
            <Button
              onClick={loadSessions}
              disabled={isLoading}
              variant="outline"
            >
              Actualiser
            </Button>
          </div>
        </div>

        {sessions.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Aucune session ouverte trouvée
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <input
                type="checkbox"
                checked={selectedSessions.length === sessions.length && sessions.length > 0}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium">
                Sélectionner tout ({selectedSessions.length}/{sessions.length})
              </span>
            </div>

            <div className="grid gap-2">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className={cn(
                    "flex items-center gap-4 p-4 border rounded-lg transition-colors",
                    selectedSessions.includes(session.id) && "bg-blue-50 border-blue-200"
                  )}
                >
                  <input
                    type="checkbox"
                    checked={selectedSessions.includes(session.id)}
                    onChange={(e) => handleSessionSelection(session.id, e.target.checked)}
                    className="w-4 h-4"
                  />
                  
                  <div className="flex items-center gap-2">
                    {getStatusIndicator(session)}
                    <span className="font-medium">Session #{session.id}</span>
                  </div>
                  
                  <div className="flex-1 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Ouverture:</span>
                      <span className="ml-2">{formatSessionDateTime(session.dateOuverture)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Statut:</span>
                      <span className={cn(
                        "ml-2 px-2 py-1 rounded text-xs",
                        session.statut === 'O' && "bg-green-100 text-green-800",
                        session.statut === 'C' && "bg-gray-100 text-gray-800"
                      )}>
                        {session.statut === 'O' ? 'Ouverte' : 'Fermée'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Dialog open={showConfirmDialog} onClose={handleCancelClosure}>
        <div className="p-6 space-y-4">
          <h3 className="text-lg font-semibold">Confirmation de fermeture</h3>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">
                Vous êtes sur le point de fermer {selectedSessions.length} session(s).
              </p>
              
              {closureCode && (
                <div className="bg-gray-50 p-3 rounded">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Code de fermeture généré:
                  </label>
                  <Input
                    value={closureCode}
                    readOnly
                    className="bg-white"
                  />
                </div>
              )}
            </div>

            {validationErrors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded p-3">
                <h4 className="text-sm font-medium text-red-800 mb-2">Erreurs de validation:</h4>
                <ul className="text-sm text-red-600 space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleConfirmClosure}
              disabled={isClosing || validationErrors.length > 0}
              className="bg-red-600 hover:bg-red-700"
            >
              {isClosing ? 'Fermeture...' : 'Confirmer la fermeture'}
            </Button>
            <Button
              onClick={handleCancelClosure}
              variant="outline"
              disabled={isClosing}
            >
              Annuler
            </Button>
          </div>
        </div>
      </Dialog>

      {closureResult && (
        <div className={cn(
          "bg-white rounded-lg shadow p-6",
          closureResult.success && "border-l-4 border-green-500",
          !closureResult.success && "border-l-4 border-red-500"
        )}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={cn(
                "text-lg font-semibold",
                closureResult.success && "text-green-800",
                !closureResult.success && "text-red-800"
              )}>
                {closureResult.success ? 'Fermeture réussie' : 'Erreur de fermeture'}
              </h3>
              <p className="text-gray-600 mt-1">{closureResult.message}</p>
            </div>
            
            {closureResult.success && (
              <Button
                onClick={handlePrintReport}
                variant="outline"
                className="ml-4"
              >
                Imprimer le rapport
              </Button>
            )}
          </div>

          {closureResult.success && closureResult.details && (
            <div className="mt-4 p-4 bg-gray-50 rounded">
              <h4 className="font-medium mb-2">Détails de la fermeture:</h4>
              <div className="text-sm space-y-1">
                <div>Code de fermeture: {closureCode}</div>
                <div>Sessions fermées: {selectedSessions.join(', ')}</div>
                <div>Date: {new Date().toLocaleString()}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </ScreenLayout>
  )
}