import type { SaisieContenuCaisseState } from "@/types/saisieContenuCaisse"

interface MontantsComptesPanelProps {
  montantsComptes: SaisieContenuCaisseState['montantsComptes']
  className?: string
}

export const MontantsComptesPanel = ({ montantsComptes, className }: MontantsComptesPanelProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(amount)
  }

  const montantItems = [
    { key: 'monnaie', label: 'Monnaie comptée' },
    { key: 'produits', label: 'Produits comptés' },
    { key: 'cartes', label: 'Cartes comptées' },
    { key: 'cheques', label: 'Chèques comptés' },
    { key: 'od', label: 'OD comptés' },
    { key: 'devises', label: 'Devises comptées' }
  ] as const

  return (
    <div className={cn("bg-white rounded-lg border border-gray-200 p-6", className)}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Montants comptés</h3>
        <p className="text-sm text-gray-500">(lecture seule)</p>
      </div>

      <div className="space-y-4">
        {montantItems.map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
            <label className="text-sm font-medium text-gray-700 min-w-0 flex-1">
              {label}
            </label>
            <div className="ml-4 min-w-[120px] text-right">
              <span className="inline-flex items-center px-3 py-1.5 rounded-md bg-gray-50 text-sm font-mono text-gray-900 border">
                {formatCurrency(montantsComptes[key] || 0)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-base font-semibold text-gray-900">Total comptés</span>
          <span className="text-base font-bold text-blue-600 font-mono">
            {formatCurrency(
              Object.values(montantsComptes).reduce((sum, amount) => sum + (amount || 0), 0)
            )}
          </span>
        </div>
      </div>
    </div>
  )
}