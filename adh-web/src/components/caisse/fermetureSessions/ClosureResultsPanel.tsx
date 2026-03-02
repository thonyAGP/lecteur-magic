import type { ReactElement } from 'react'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'

interface ClosureResultsPanelProps {
  result: {
    success: boolean
    message: string
    details?: {
      sessionId: number
      closureCode: string
      closedAt: Date
      summary?: {
        totalTransactions: number
        totalAmount: number
      }
    }
  } | null
  onPrintReport: () => void
  className?: string
}

export const ClosureResultsPanel = ({
  result,
  onPrintReport,
  className
}: ClosureResultsPanelProps): ReactElement => {
  if (!result) {
    return (
      <div className={cn(
        "bg-gray-50 border border-gray-200 rounded-lg p-6",
        className
      )}>
        <p className="text-gray-500 text-center">
          Aucun résultat de fermeture disponible
        </p>
      </div>
    )
  }

  return (
    <div className={cn(
      "bg-white border rounded-lg p-6 space-y-4",
      result.success ? "border-green-200" : "border-red-200",
      className
    )}>
      <div className="flex items-center gap-3">
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center",
          result.success ? "bg-green-100" : "bg-red-100"
        )}>
          {result.success ? (
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>
        
        <div className="flex-1">
          <h3 className={cn(
            "font-semibold text-lg",
            result.success ? "text-green-800" : "text-red-800"
          )}>
            {result.success ? "Fermeture réussie" : "Échec de la fermeture"}
          </h3>
          <p className={cn(
            "text-sm",
            result.success ? "text-green-600" : "text-red-600"
          )}>
            {result.message}
          </p>
        </div>
      </div>

      {result.success && result.details && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <h4 className="font-medium text-gray-900">Détails de la fermeture</h4>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Session ID:</span>
              <span className="ml-2 font-medium">{result.details.sessionId}</span>
            </div>
            
            <div>
              <span className="text-gray-500">Code de fermeture:</span>
              <span className="ml-2 font-mono text-xs bg-gray-200 px-2 py-1 rounded">
                {result.details.closureCode}
              </span>
            </div>
            
            <div className="col-span-2">
              <span className="text-gray-500">Date de fermeture:</span>
              <span className="ml-2 font-medium">
                {result.details.closedAt.toLocaleString('fr-FR')}
              </span>
            </div>
          </div>

          {result.details.summary && (
            <div className="border-t border-gray-200 pt-3 mt-3">
              <h5 className="font-medium text-gray-900 mb-2">Résumé</h5>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Transactions:</span>
                  <span className="ml-2 font-medium">
                    {result.details.summary.totalTransactions.toLocaleString('fr-FR')}
                  </span>
                </div>
                
                <div>
                  <span className="text-gray-500">Montant total:</span>
                  <span className="ml-2 font-medium">
                    {result.details.summary.totalAmount.toLocaleString('fr-FR', {
                      style: 'currency',
                      currency: 'EUR'
                    })}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {result.success && (
        <div className="flex justify-end pt-2">
          <Button
            onClick={onPrintReport}
            variant="outline"
            className="flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Imprimer le rapport
          </Button>
        </div>
      )}
    </div>
  )
}