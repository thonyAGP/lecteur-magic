import type { SessionStatut } from "@/types/gestionCaisse"
import { useGestionCaisseStore } from "@/stores/gestionCaisseStore"
import { cn } from "@/lib/utils"

interface HeaderSectionPanelProps {
  className?: string
}

export const HeaderSectionPanel = ({ className }: HeaderSectionPanelProps) => {
  const { sessionActive, dateComptable } = useGestionCaisseStore()

  const getStatutColor = (statut: typeof SessionStatut[keyof typeof SessionStatut]) => {
    switch (statut) {
      case 'OUVERT':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'FERME':
        return 'text-gray-600 bg-gray-50 border-gray-200'
      case 'EN_CLOTURE':
        return 'text-orange-600 bg-orange-50 border-orange-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const formatDate = (date: Date | null) => {
    if (!date) return 'Non définie'
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date)
  }

  const getStatutLabel = (statut: typeof SessionStatut[keyof typeof SessionStatut]) => {
    switch (statut) {
      case 'OUVERT':
        return 'Ouverte'
      case 'FERME':
        return 'Fermée'
      case 'EN_CLOTURE':
        return 'En clôture'
      default:
        return 'Inconnue'
    }
  }

  return (
    <div className={cn(
      "bg-white rounded-lg border border-gray-200 p-6 shadow-sm",
      className
    )}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Opérateur
          </label>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-blue-600">
                {sessionActive?.operateurNom?.charAt(0)?.toUpperCase() || 'N'}
              </span>
            </div>
            <span className="text-sm text-gray-900">
              {sessionActive?.operateurNom || 'Non connecté'}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Date comptable
          </label>
          <div className="flex items-center space-x-2">
            <div className={cn(
              "w-3 h-3 rounded-full",
              dateComptable?.valide ? "bg-green-500" : "bg-red-500"
            )} />
            <span className="text-sm text-gray-900">
              {formatDate(dateComptable?.date || null)}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Statut session
          </label>
          <div className={cn(
            "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border",
            sessionActive?.statut ? getStatutColor(sessionActive.statut) : "text-gray-600 bg-gray-50 border-gray-200"
          )}>
            {sessionActive?.statut ? getStatutLabel(sessionActive.statut) : 'Aucune session'}
          </div>
        </div>
      </div>
    </div>
  )
}