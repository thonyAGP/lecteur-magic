import type { SessionConcurrente } from "@/types/gestionCaisse"
import { useGestionCaisseStore } from "@/stores/gestionCaisseStore"
import { cn } from "@/lib/utils"

interface AlertesSectionPanelProps {
  className?: string
}

export const AlertesSectionPanel = ({ className }: AlertesSectionPanelProps) => {
  const { sessionsConcurrentes, sessionActive, parametres, isLoading } = useGestionCaisseStore()

  const coffreIntegrite = sessionActive && parametres 
    ? sessionActive.montantOuverture >= parametres.seuilAlerte
    : true

  return (
    <div className={cn("space-y-6", className)}>
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Sessions Concurrentes</h3>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : sessionsConcurrentes.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            Aucune session concurrente détectée
          </div>
        ) : (
          <div className="space-y-3">
            {sessionsConcurrentes.map((session) => (
              <div
                key={session.sessionId}
                className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div>
                    <div className="font-medium text-slate-900">
                      {session.operateurNom}
                    </div>
                    <div className="text-sm text-slate-600">
                      Poste: {session.posteId}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-slate-600">
                  {new Date(session.dateOuverture).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Intégrité Coffre</h3>
        
        <div className={cn(
          "flex items-center space-x-3 p-4 rounded-lg",
          coffreIntegrite 
            ? "bg-green-50 border border-green-200" 
            : "bg-red-50 border border-red-200"
        )}>
          <div className={cn(
            "w-3 h-3 rounded-full",
            coffreIntegrite ? "bg-green-500" : "bg-red-500"
          )}></div>
          <div className="flex-1">
            <div className="font-medium text-slate-900">
              {coffreIntegrite ? "Coffre conforme" : "Alerte coffre"}
            </div>
            <div className="text-sm text-slate-600">
              {sessionActive && parametres ? (
                <>
                  Montant actuel: {sessionActive.montantOuverture.toFixed(2)} € 
                  (Seuil: {parametres.seuilAlerte.toFixed(2)} €)
                </>
              ) : (
                "Vérification en cours..."
              )}
            </div>
          </div>
          {!coffreIntegrite && (
            <div className="text-red-600 font-medium">
              ⚠️
            </div>
          )}
        </div>
      </div>
    </div>
  )
}