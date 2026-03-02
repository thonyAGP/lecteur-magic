import type { MouseEvent } from "react"
import { Button } from "@/components/ui"
import { useSaisieContenuCaisseStore } from "@/stores/saisieContenuCaisseStore"
import { cn } from "@/lib/utils"

interface ActionsPanelProps {
  className?: string
  onValider?: () => void
  onAnnuler?: () => void
  onReinitialiser?: () => void
  disabled?: boolean
}

export const ActionsPanel = ({ 
  className, 
  onValider, 
  onAnnuler, 
  onReinitialiser,
  disabled = false 
}: ActionsPanelProps) => {
  const { 
    isLoading, 
    remise, 
    montantsSaisis,
    validationErrors,
    ecarts
  } = useSaisieContenuCaisseStore()

  const handleValider = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (!disabled && !isLoading && onValider) {
      onValider()
    }
  }

  const handleAnnuler = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (!disabled && !isLoading && onAnnuler) {
      onAnnuler()
    }
  }

  const handleReinitialiser = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (!disabled && !isLoading && onReinitialiser) {
      onReinitialiser()
    }
  }

  const hasMontantsSaisis = Object.keys(montantsSaisis).length > 0
  const hasValidationErrors = Object.keys(validationErrors).length > 0
  const hasEcarts = Object.values(ecarts).some(ecart => Math.abs(ecart) > 0.01)

  const isValiderDisabled = disabled || 
    isLoading || 
    !remise || 
    !hasMontantsSaisis || 
    hasValidationErrors

  return (
    <div className={cn(
      "flex items-center justify-end gap-3 p-4 bg-gray-50 border-t border-gray-200",
      className
    )}>
      <Button
        variant="ghost"
        onClick={handleReinitialiser}
        disabled={disabled || isLoading}
        className="text-gray-600 hover:text-gray-800"
      >
        Réinitialiser
      </Button>
      
      <Button
        variant="secondary"
        onClick={handleAnnuler}
        disabled={disabled || isLoading}
        className="min-w-24"
      >
        Annuler
      </Button>
      
      <Button
        variant="primary"
        onClick={handleValider}
        disabled={isValiderDisabled}
        className={cn(
          "min-w-32",
          hasEcarts && "bg-orange-600 hover:bg-orange-700"
        )}
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            Validation...
          </>
        ) : hasEcarts ? (
          "Valider avec écarts"
        ) : (
          "Valider la remise"
        )}
      </Button>
    </div>
  )
}