import { useCallback, useMemo } from "react"
import { Input } from "@/components/ui"
import { cn } from "@/lib/utils"
import { useSaisieContenuCaisseStore } from "@/stores/saisieContenuCaisseStore"

interface SaisieVersementsPanelProps {
  className?: string
  disabled?: boolean
  onMontantChange?: (type: string, montant: number) => void
}

export const SaisieVersementsPanel = ({ 
  className, 
  disabled = false,
  onMontantChange 
}: SaisieVersementsPanelProps) => {
  const { montantsSaisis, saisirMontant, validationErrors } = useSaisieContenuCaisseStore()

  const versementTypes = useMemo(() => [
    { key: 'monnaie', label: 'Versement monnaie', placeholder: '0,00' },
    { key: 'produits', label: 'Versement produits', placeholder: '0,00' },
    { key: 'cartes', label: 'Versement cartes', placeholder: '0,00' },
    { key: 'cheques', label: 'Versement chèques', placeholder: '0,00' },
    { key: 'od', label: 'Versement OD', placeholder: '0,00' },
    { key: 'devises', label: 'Versement devises', placeholder: '0,00' }
  ], [])

  const handleInputChange = useCallback(async (type: string, value: string) => {
    const numericValue = value === '' ? 0 : parseFloat(value.replace(',', '.')) || 0
    
    await saisirMontant(type, numericValue)
    
    if (onMontantChange) {
      onMontantChange(type, numericValue)
    }
  }, [saisirMontant, onMontantChange])

  const formatValue = useCallback((value: number): string => {
    return value === 0 ? '' : value.toFixed(2).replace('.', ',')
  }, [])

  return (
    <div className={cn("bg-white rounded-lg border border-gray-200 p-6", className)}>
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Saisie des versements
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {versementTypes.map(({ key, label, placeholder }) => (
          <div key={key} className="space-y-2">
            <label 
              htmlFor={`versement-${key}`}
              className="block text-sm font-medium text-gray-700"
            >
              {label}
            </label>
            <Input
              id={`versement-${key}`}
              type="text"
              inputMode="decimal"
              value={formatValue(montantsSaisis[key] || 0)}
              onChange={(e) => handleInputChange(key, e.target.value)}
              placeholder={placeholder}
              disabled={disabled}
              className={cn(
                "text-right font-mono",
                validationErrors[key] && "border-red-500 focus:border-red-500"
              )}
            />
            {validationErrors[key] && (
              <p className="text-sm text-red-600 mt-1">
                {validationErrors[key]}
              </p>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center text-sm font-medium">
          <span className="text-gray-700">Total des versements :</span>
          <span className="text-lg font-semibold text-blue-600">
            {Object.values(montantsSaisis).reduce((sum, value) => sum + (value || 0), 0)
              .toFixed(2).replace('.', ',')} €
          </span>
        </div>
      </div>
    </div>
  )
}