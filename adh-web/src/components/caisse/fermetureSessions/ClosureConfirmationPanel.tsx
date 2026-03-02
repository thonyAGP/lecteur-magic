import { useCallback } from 'react'
import type { Session } from '@/types/fermetureSessions'
import { Button, Dialog } from '@/components/ui'
import { cn } from '@/lib/utils'

interface ClosureConfirmationPanelProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  selectedSessions: number[]
  sessions: Session[]
  closureCode: string
  validationErrors: string[]
  isClosing: boolean
  closureResult: {
    success: boolean
    message: string
    details?: unknown
  } | null
}

export const ClosureConfirmationPanel = ({
  isOpen,
  onClose,
  onConfirm,
  selectedSessions,
  sessions,
  closureCode,
  validationErrors,
  isClosing,
  closureResult
}: ClosureConfirmationPanelProps) => {
  const selectedSessionsData = sessions.filter(s => selectedSessions.includes(s.id))

  const handleConfirm = useCallback(async () => {
    await onConfirm()
  }, [onConfirm])

  const handleClose = useCallback(() => {
    if (!isClosing) {
      onClose()
    }
  }, [onClose, isClosing])

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <div className="p-6 max-w-md mx-auto">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Confirmer la fermeture des sessions
          </h2>
          <p className="text-sm text-gray-600">
            Vous êtes sur le point de fermer {selectedSessions.length} session(s).
            Cette action est irréversible.
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-900 mb-2">
            Sessions sélectionnées:
          </h3>
          <div className="bg-gray-50 rounded-lg p-3 max-h-32 overflow-y-auto">
            {selectedSessionsData.map(session => (
              <div key={session.id} className="text-sm text-gray-700 py-1">
                Session #{session.id} - {new Date(session.dateOuverture).toLocaleDateString()}
              </div>
            ))}
          </div>
        </div>

        {closureCode && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              Code de fermeture généré:
            </h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <code className="text-sm font-mono text-blue-800">{closureCode}</code>
            </div>
          </div>
        )}

        {validationErrors.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-red-900 mb-2">
              Erreurs de validation:
            </h3>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              {validationErrors.map((error, index) => (
                <div key={index} className="text-sm text-red-700 mb-1 last:mb-0">
                  • {error}
                </div>
              ))}
            </div>
          </div>
        )}

        {closureResult && (
          <div className="mb-6">
            <div className={cn(
              "border rounded-lg p-3",
              closureResult.success 
                ? "bg-green-50 border-green-200" 
                : "bg-red-50 border-red-200"
            )}>
              <div className={cn(
                "text-sm font-medium mb-1",
                closureResult.success ? "text-green-900" : "text-red-900"
              )}>
                {closureResult.success ? "Fermeture réussie" : "Échec de la fermeture"}
              </div>
              <div className={cn(
                "text-sm",
                closureResult.success ? "text-green-700" : "text-red-700"
              )}>
                {closureResult.message}
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isClosing}
          >
            Annuler
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isClosing || validationErrors.length > 0 || (closureResult && !closureResult.success)}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isClosing ? 'Fermeture en cours...' : 'Confirmer la fermeture'}
          </Button>
        </div>
      </div>
    </Dialog>
  )
}