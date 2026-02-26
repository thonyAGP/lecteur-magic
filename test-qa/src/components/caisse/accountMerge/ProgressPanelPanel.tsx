import type { MergeLog } from "@/types/accountMerge";
import { cn } from "@/lib/utils";
import { useAccountMergeStore } from "@/stores/accountMergeStore";

interface ProgressPanelProps {
  className?: string;
}

export const ProgressPanel = ({ className }: ProgressPanelProps) => {
  const { currentStep, progressData, mergeLogs, isProcessing } = useAccountMergeStore();

  const stepLabels = {
    validation: "Validation",
    preparation: "Préparation",
    execution: "Exécution",
    completion: "Finalisation",
  } as const;

  const progressPercentage = progressData.total > 0 
    ? Math.round((progressData.current / progressData.total) * 100) 
    : 0;

  return (
    <div className={cn("space-y-6 rounded-lg border bg-white p-6", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Étape actuelle</h3>
        <span className={cn(
          "rounded-full px-4 py-1 text-sm font-medium",
          isProcessing ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
        )}>
          {stepLabels[currentStep]}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Progression</span>
          <span className="font-medium">{progressPercentage}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div 
            className={cn(
              "h-full transition-all duration-300",
              isProcessing ? "bg-blue-600" : "bg-green-600"
            )}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {progressData.table && (
        <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
          <div className="text-sm text-gray-500">Table en cours</div>
          <div className="mt-1 font-mono text-base font-semibold text-gray-900">
            {progressData.table}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
          <div className="text-sm text-gray-500">Enregistrements traités</div>
          <div className="mt-1 text-2xl font-bold text-gray-900">
            {progressData.current}
          </div>
        </div>
        <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
          <div className="text-sm text-gray-500">Total</div>
          <div className="mt-1 text-2xl font-bold text-gray-900">
            {progressData.total}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-gray-700">Journal des opérations</h4>
        <div className="max-h-64 space-y-2 overflow-y-auto rounded-md border border-gray-200 bg-gray-50 p-4">
          {mergeLogs.length === 0 ? (
            <div className="text-center text-sm text-gray-500">
              Aucune opération enregistrée
            </div>
          ) : (
            mergeLogs.map((log) => (
              <div 
                key={log.id} 
                className={cn(
                  "flex items-start gap-3 rounded-md p-3 text-sm",
                  log.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
                )}
              >
                <div className={cn(
                  "mt-0.5 h-2 w-2 flex-shrink-0 rounded-full",
                  log.success ? "bg-green-500" : "bg-red-500"
                )}/>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{log.operation}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(log.timestamp).toLocaleTimeString('fr-FR')}
                    </span>
                  </div>
                  <div className="text-gray-600">
                    Table: <span className="font-mono">{log.tableName}</span>
                    {" • "}
                    {log.recordCount} enregistrement{log.recordCount > 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};