import type { SessionCaisse } from "@/types/gestionCaisse"
import { Button } from "@/components/ui"
import { cn } from "@/lib/utils"

interface ActionsSectionPanelProps {
  sessionActive: SessionCaisse | null
  isLoading: boolean
  onOuvrirSession: () => void
  onFermerSession: () => void
  onApportCoffre: () => void
  onApportProduit: () => void
  onRemiseCoffre: () => void
  onHistorique: () => void
  onConsultation: () => void
  onReimprimer: () => void
  className?: string
}

export const ActionsSectionPanel = ({
  sessionActive,
  isLoading,
  onOuvrirSession,
  onFermerSession,
  onApportCoffre,
  onApportProduit,
  onRemiseCoffre,
  onHistorique,
  onConsultation,
  onReimprimer,
  className
}: ActionsSectionPanelProps) => {
  const isSessionActive = sessionActive?.statut === 'OUVERT'

  return (
    <div className={cn("bg-white rounded-lg border p-6", className)}>
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Actions</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <Button
            onClick={onOuvrirSession}
            disabled={isLoading || isSessionActive}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300"
          >
            Ouvrir Session
          </Button>
          
          <Button
            onClick={onFermerSession}
            disabled={isLoading || !isSessionActive}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-300"
          >
            Fermer Session
          </Button>
          
          <Button
            onClick={onApportCoffre}
            disabled={isLoading || !isSessionActive}
            variant="outline"
            className="w-full border-blue-300 text-blue-700 hover:bg-blue-50 disabled:border-gray-300 disabled:text-gray-400"
          >
            Apport Coffre
          </Button>
          
          <Button
            onClick={onApportProduit}
            disabled={isLoading || !isSessionActive}
            variant="outline"
            className="w-full border-purple-300 text-purple-700 hover:bg-purple-50 disabled:border-gray-300 disabled:text-gray-400"
          >
            Apport Produit
          </Button>
        </div>
        
        <div className="space-y-3">
          <Button
            onClick={onRemiseCoffre}
            disabled={isLoading || !isSessionActive}
            variant="outline"
            className="w-full border-orange-300 text-orange-700 hover:bg-orange-50 disabled:border-gray-300 disabled:text-gray-400"
          >
            Remise Coffre
          </Button>
          
          <Button
            onClick={onHistorique}
            disabled={isLoading}
            variant="outline"
            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 disabled:border-gray-300 disabled:text-gray-400"
          >
            Historique
          </Button>
          
          <Button
            onClick={onConsultation}
            disabled={isLoading}
            variant="outline"
            className="w-full border-indigo-300 text-indigo-700 hover:bg-indigo-50 disabled:border-gray-300 disabled:text-gray-400"
          >
            Consultation
          </Button>
          
          <Button
            onClick={onReimprimer}
            disabled={isLoading || !sessionActive}
            variant="outline"
            className="w-full border-teal-300 text-teal-700 hover:bg-teal-50 disabled:border-gray-300 disabled:text-gray-400"
          >
            Réimprimer
          </Button>
        </div>
      </div>
    </div>
  )
}