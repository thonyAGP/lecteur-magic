import { useCallback } from "react"
import { useAccountMergeStore } from "@/stores/accountMergeStore"
import { Button } from "@/components/ui"
import { cn } from "@/lib/utils"

interface MergeExecutionPanelProps {
  className?: string
  onCancel?: () => void
}

const MERGE_STEPS = [
  { key: 'validation', label: 'Validating Accounts' },
  { key: 'preparation', label: 'Preparing Merge' },
  { key: 'dataTransfer', label: 'Transferring Data' },
  { key: 'balanceConsolidation', label: 'Consolidating Balance' },
  { key: 'cleanup', label: 'Cleaning Up' },
  { key: 'completed', label: 'Completed' }
] as const

export const MergeExecutionPanel = ({ className, onCancel }: MergeExecutionPanelProps) => {
  const {
    sourceAccount,
    targetAccount,
    mergeProgress,
    currentStep,
    isLoading,
    error,
    executeMerge
  } = useAccountMergeStore()

  const handleExecuteMerge = useCallback(async () => {
    if (!sourceAccount || !targetAccount) {
      return
    }
    
    await executeMerge(sourceAccount.accountNumber, targetAccount.accountNumber)
  }, [sourceAccount, targetAccount, executeMerge])

  const handleCancel = useCallback(() => {
    if (onCancel) {
      onCancel()
    }
  }, [onCancel])

  const getCurrentStepIndex = () => {
    return MERGE_STEPS.findIndex(step => step.key === currentStep)
  }

  const isExecutionInProgress = isLoading && currentStep !== 'idle'
  const isExecutionCompleted = currentStep === 'completed'
  const canExecute = sourceAccount && targetAccount && !isLoading && currentStep === 'idle'

  return (
    <div className={cn("bg-white rounded-lg border p-6", className)}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Merge Execution
          </h3>
          {error && (
            <div className="text-sm text-red-600 bg-red-50 px-3 py-1 rounded">
              {error}
            </div>
          )}
        </div>

        {(isExecutionInProgress || isExecutionCompleted) && (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Progress</span>
                <span className="text-gray-900 font-medium">{Math.round(mergeProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${mergeProgress}%` }}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-sm font-medium text-gray-700">Current Step:</div>
              <div className="space-y-2">
                {MERGE_STEPS.map((step, index) => {
                  const currentIndex = getCurrentStepIndex()
                  const isCurrentStep = step.key === currentStep
                  const isCompleted = index < currentIndex || isExecutionCompleted
                  const isPending = index > currentIndex

                  return (
                    <div
                      key={step.key}
                      className={cn(
                        "flex items-center space-x-3 text-sm",
                        isCurrentStep && "text-blue-600 font-medium",
                        isCompleted && "text-green-600",
                        isPending && "text-gray-400"
                      )}
                    >
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full",
                          isCurrentStep && "bg-blue-600 animate-pulse",
                          isCompleted && "bg-green-600",
                          isPending && "bg-gray-300"
                        )}
                      />
                      <span>{step.label}</span>
                      {isCurrentStep && isLoading && (
                        <div className="animate-spin w-3 h-3 border border-blue-600 border-t-transparent rounded-full" />
                      )}
                      {isCompleted && (
                        <div className="w-3 h-3 text-green-600">
                          <svg fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {!isExecutionInProgress && !isExecutionCompleted && (
          <div className="text-center py-8">
            <div className="text-gray-500 mb-4">
              {canExecute ? "Ready to execute merge" : "Please validate accounts first"}
            </div>
            {sourceAccount && targetAccount && (
              <div className="text-sm text-gray-600 space-y-1">
                <div>From: {sourceAccount.accountNumber}</div>
                <div>To: {targetAccount.accountNumber}</div>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          
          <Button
            onClick={handleExecuteMerge}
            disabled={!canExecute || isLoading}
            className={cn(
              isExecutionCompleted && "bg-green-600 hover:bg-green-700"
            )}
          >
            {isLoading ? "Executing..." : isExecutionCompleted ? "Merge Completed" : "Execute Merge"}
          </Button>
        </div>
      </div>
    </div>
  )
}