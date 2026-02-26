import type { SessionConcurrency } from "@/types/sessionConcurrency"
import { Button, Dialog } from "@/components/ui"
import { cn } from "@/lib/utils"

interface ConflictWarningPanelProps {
  isOpen: boolean
  conflictingSession: SessionConcurrency | null
  warningMessage: string
  onCancel: () => void
  onForceOpen: () => void
  isForcing?: boolean
  className?: string
}

export const ConflictWarningPanel = ({
  isOpen,
  conflictingSession,
  warningMessage,
  onCancel,
  onForceOpen,
  isForcing = false,
  className
}: ConflictWarningPanelProps) => {
  const formatTimestamp = (timestamp: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(new Date(timestamp))
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => !isForcing && onCancel()}>
      <div className={cn("p-6 max-w-md mx-auto", className)}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Conflit de session détecté
          </h3>
        </div>

        <div className="mb-6">
          <p className="text-gray-700 mb-4">
            {warningMessage}
          </p>

          {conflictingSession && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <h4 className="font-medium text-gray-900 mb-3">
                Détails de la session en cours :
              </h4>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Terminal :</span>
                  <span className="font-mono font-medium text-gray-900">
                    {conflictingSession.terminalId}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Ouverture :</span>
                  <span className="font-medium text-gray-900">
                    {formatTimestamp(conflictingSession.timestamp)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Société :</span>
                  <span className="font-medium text-gray-900">
                    {conflictingSession.societe}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Compte :</span>
                  <span className="font-medium text-gray-900">
                    {conflictingSession.compte}
                  </span>
                </div>

                {conflictingSession.codeCalcul && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Code calcul :</span>
                    <span className="font-mono font-medium text-gray-900">
                      {conflictingSession.codeCalcul}
                    </span>
                  </div>
                )}

                {conflictingSession.coffreEnCoursComptage && (
                  <div className="flex items-center gap-2 pt-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-red-700 text-xs font-medium">
                      Comptage en cours
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isForcing}
            className="px-6"
          >
            Annuler
          </Button>
          
          <Button
            variant="destructive"
            onClick={onForceOpen}
            disabled={isForcing}
            className="px-6"
          >
            {isForcing ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Ouverture...
              </>
            ) : (
              "Forcer l'ouverture"
            )}
          </Button>
        </div>
      </div>
    </Dialog>
  )
}