import type { SessionCaisse } from "@/types/gestionCaisse"
import { cn } from "@/lib/utils"

interface MontantsSectionPanelProps {
  sessionActive: SessionCaisse | null
  isLoading: boolean
  className?: string
}

export const MontantsSectionPanel = ({ sessionActive, isLoading, className }: MontantsSectionPanelProps) => {
  const calculerMontantActuel = () => {
    if (!sessionActive) return 0
    return sessionActive.montantOuverture
  }

  const calculerEcart = () => {
    if (!sessionActive || !sessionActive.montantFermeture) return 0
    return sessionActive.montantFermeture - calculerMontantActuel()
  }

  const formatMontant = (montant: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(montant)
  }

  const getEcartColor = (ecart: number) => {
    if (ecart === 0) return "text-green-600"
    if (ecart > 0) return "text-blue-600"
    return "text-red-600"
  }

  return (
    <div className={cn("bg-white rounded-lg border border-gray-200 p-6", className)}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Montants</h3>
        {isLoading && (
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Montant d'ouverture
          </label>
          <div className="p-3 bg-gray-50 rounded-md border">
            <span className="text-lg font-semibold text-gray-900">
              {sessionActive ? formatMontant(sessionActive.montantOuverture) : "€0,00"}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Montant actuel
          </label>
          <div className="p-3 bg-gray-50 rounded-md border">
            <span className="text-lg font-semibold text-blue-600">
              {formatMontant(calculerMontantActuel())}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Montant de fermeture
          </label>
          <div className="p-3 bg-gray-50 rounded-md border">
            <span className="text-lg font-semibold text-gray-900">
              {sessionActive?.montantFermeture 
                ? formatMontant(sessionActive.montantFermeture) 
                : "€0,00"
              }
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Écart
          </label>
          <div className="p-3 bg-gray-50 rounded-md border">
            <span className={cn("text-lg font-semibold", getEcartColor(calculerEcart()))}>
              {formatMontant(calculerEcart())}
            </span>
          </div>
        </div>
      </div>

      {!sessionActive && (
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
          <p className="text-sm text-amber-800">
            Aucune session active. Ouvrez une session pour voir les montants.
          </p>
        </div>
      )}
    </div>
  )
}