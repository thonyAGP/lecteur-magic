import { useAccountMergeStore } from '@/stores/accountMergeStore'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'

interface ValidationPanelProps {
  onContinue?: () => void
  className?: string
}

export const ValidationPanel = ({ onContinue, className }: ValidationPanelProps) => {
  const {
    validationStatus,
    currentStep,
    isProcessing,
    error,
    setCurrentStep
  } = useAccountMergeStore()

  const handleContinue = () => {
    if (onContinue) {
      onContinue()
    } else {
      setCurrentStep('preparation')
    }
  }

  const isNetworkOk = validationStatus?.network ?? false
  const isSessionOk = validationStatus?.closure ?? false
  const canContinue = isNetworkOk && isSessionOk && currentStep === 'validation' && !isProcessing

  return (
    <div className={cn("p-6 bg-white rounded-lg shadow space-y-6", className)}>
      <h2 className="text-xl font-semibold">Validation des prérequis</h2>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "h-4 w-4 rounded-full flex-shrink-0",
            isNetworkOk ? "bg-green-500" : "bg-red-500"
          )} />
          <span className="text-sm">
            <strong>Réseau:</strong> {isNetworkOk ? "Connecté" : "Déconnecté"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className={cn(
            "h-4 w-4 rounded-full flex-shrink-0",
            isSessionOk ? "bg-green-500" : "bg-red-500"
          )} />
          <span className="text-sm">
            <strong>Session:</strong> {isSessionOk ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      {validationStatus?.validation && (
        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 text-sm">
          {validationStatus.validation}
        </div>
      )}

      {error && (
        <div className="p-4 border border-red-300 rounded-lg bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="flex justify-end">
        <Button
          onClick={handleContinue}
          disabled={!canContinue}
        >
          {isProcessing ? "Validation en cours..." : "Continuer"}
        </Button>
      </div>
    </div>
  )
}