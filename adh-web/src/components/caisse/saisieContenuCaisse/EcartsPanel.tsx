import type { ReactNode } from "react"
import { useMemo } from "react"
import { cn } from "@/lib/utils"
import { useSaisieContenuCaisseStore } from "@/stores/saisieContenuCaisseStore"

interface EcartsPanelProps {
  className?: string
  children?: ReactNode
}

interface EcartRow {
  id: string
  typePaiement: string
  montantCompte: number
  montantVerse: number
  ecart: number
}

export const EcartsPanel = ({ className }: EcartsPanelProps) => {
  const {
    montantsSaisis,
    montantsComptes,
    ecarts,
    anomalies,
    isLoading
  } = useSaisieContenuCaisseStore()

  const ecartRows = useMemo((): EcartRow[] => {
    const types = new Set([
      ...Object.keys(montantsSaisis),
      ...Object.keys(montantsComptes),
      ...Object.keys(ecarts)
    ])

    return Array.from(types).map(type => ({
      id: type,
      typePaiement: type,
      montantCompte: montantsComptes[type] || 0,
      montantVerse: montantsSaisis[type] || 0,
      ecart: ecarts[type] || 0
    })).filter(row => Math.abs(row.ecart) > 0.01)
  }, [montantsSaisis, montantsComptes, ecarts])

  const hasEcarts = ecartRows.length > 0
  const hasAnomalies = anomalies.length > 0

  if (isLoading) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="text-sm font-medium text-gray-700">Écarts détectés (si différence)</div>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-2" />
          <div className="space-y-2">
            <div className="h-6 bg-gray-100 rounded" />
            <div className="h-6 bg-gray-100 rounded" />
            <div className="h-6 bg-gray-100 rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (!hasEcarts) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="text-sm font-medium text-gray-700">Écarts détectés (si différence)</div>
        <div className="text-sm text-gray-500 italic py-4">
          Aucun écart détecté
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="text-sm font-medium text-gray-700">Écarts détectés (si différence)</div>
      
      {hasAnomalies && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Anomalies détectées
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>Des écarts ont été détectés. Veuillez vérifier les montants saisis.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type paiement
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Montant compté
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Montant versé
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Écart
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {ecartRows.map((row) => {
              const isPositive = row.ecart > 0
              const isNegative = row.ecart < 0
              
              return (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {row.typePaiement}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right font-mono">
                    {row.montantCompte.toFixed(2)} €
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right font-mono">
                    {row.montantVerse.toFixed(2)} €
                  </td>
                  <td className={cn(
                    "px-4 py-3 whitespace-nowrap text-sm text-right font-mono font-medium",
                    isPositive && "text-green-600",
                    isNegative && "text-red-600"
                  )}>
                    {isPositive && "+"}
                    {row.ecart.toFixed(2)} €
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="text-xs text-gray-500">
        Total écarts: {ecartRows.length}
      </div>
    </div>
  )
}