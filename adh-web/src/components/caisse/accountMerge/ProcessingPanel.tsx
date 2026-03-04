import { useAccountMergeStore } from "@/stores/accountMergeStore"
import { Button } from "@/components/ui"
import { cn } from "@/lib/utils"

interface ProcessingPanelProps {
  className?: string
}

export const ProcessingPanel = ({ className }: ProcessingPanelProps) => {
  const {
    currentStep,
    isProcessing,
    progressData,
    mergeLogs,
    cancelMerge
  } = useAccountMergeStore()

  const stepLabels = {
    validation: 'Validation',
    preparation: 'Préparation',
    execution: 'Exécution',
    completion: 'Finalisation'
  } as const

  const progressPercent = progressData.total > 0 
    ? Math.round((progressData.current / progressData.total) * 100)
    : 0

  return (
    <div className={cn("space-y-4", className)}>
      <div className="text-lg font-semibold">
        Étape actuelle: {stepLabels[currentStep]}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Progression</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div 
            className="bg-blue-600 h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <span className="text-sm font-medium">Tables traitées</span>
        <span className="text-lg font-bold">
          {progressData.current} / {progressData.total}
        </span>
      </div>

      {progressData.table && (
        <div className="text-sm text-gray-600">
          Table en cours: <span className="font-mono">{progressData.table}</span>
        </div>
      )}

      <div className="space-y-2">
        <div className="text-sm font-medium">Messages de traitement</div>
        <div className="border rounded-lg p-3 bg-white max-h-64 overflow-y-auto space-y-1">
          {mergeLogs.length === 0 ? (
            <div className="text-sm text-gray-400">Aucun message pour le moment</div>
          ) : (
            mergeLogs.map((log) => (
              <div 
                key={log.id}
                className={cn(
                  "text-xs p-2 rounded",
                  log.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
                )}
              >
                <div className="flex justify-between items-start">
                  <span className="font-medium">{log.operation}</span>
                  <span className="text-gray-500">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="mt-1">
                  Table: <span className="font-mono">{log.tableName}</span>
                  {' - '}
                  {log.recordCount} enregistrement(s)
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {isProcessing && (
        <Button
          onClick={cancelMerge}
          variant="destructive"
          className="w-full"
        >
          Annuler le traitement
        </Button>
      )}
    </div>
  )
}