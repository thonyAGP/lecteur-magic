import type { SessionOperationType } from "@/types/sessionHistory"
import { sessionOperationTypes } from "@/types/sessionHistory"
import { Button, Input } from "@/components/ui"
import { cn } from "@/lib/utils"

interface FiltersPanelProps {
  className?: string
  filters: {
    startDate?: Date
    endDate?: Date
    operationType?: SessionOperationType
  }
  onStartDateChange: (value: string) => void
  onEndDateChange: (value: string) => void
  onOperationTypeChange: (value: string) => void
  onApplyFilters: () => void
  onClearFilters: () => void
  isLoading?: boolean
}

export const FiltersPanel = ({
  className,
  filters,
  onStartDateChange,
  onEndDateChange,
  onOperationTypeChange,
  onApplyFilters,
  onClearFilters,
  isLoading = false
}: FiltersPanelProps) => {
  const formatDateForInput = (date?: Date) => {
    if (!date) return ""
    return date.toISOString().split('T')[0]
  }

  return (
    <div className={cn(
      "bg-white rounded-lg border border-gray-200 p-6 space-y-4",
      className
    )}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtres</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
            Date de début
          </label>
          <Input
            id="startDate"
            type="date"
            value={formatDateForInput(filters.startDate)}
            onChange={(e) => onStartDateChange(e.target.value)}
            disabled={isLoading}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
            Date de fin
          </label>
          <Input
            id="endDate"
            type="date"
            value={formatDateForInput(filters.endDate)}
            onChange={(e) => onEndDateChange(e.target.value)}
            disabled={isLoading}
            className="w-full"
            min={formatDateForInput(filters.startDate)}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="operationType" className="block text-sm font-medium text-gray-700">
            Type d'opération
          </label>
          <select
            id="operationType"
            value={filters.operationType || ""}
            onChange={(e) => onOperationTypeChange(e.target.value)}
            disabled={isLoading}
            className="w-full h-10 px-3 py-2 text-sm bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">Tous les types</option>
            {sessionOperationTypes.map((type) => (
              <option key={type} value={type}>
                {type === "SALE" && "Vente"}
                {type === "PAYMENT" && "Paiement"}
                {type === "REFUND" && "Remboursement"}
                {type === "ADJUSTMENT" && "Ajustement"}
                {type === "TRANSFER" && "Transfert"}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          onClick={onApplyFilters}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6"
        >
          {isLoading ? "Application..." : "Appliquer les filtres"}
        </Button>
        
        <Button
          onClick={onClearFilters}
          disabled={isLoading}
          variant="outline"
          className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6"
        >
          Effacer les filtres
        </Button>
      </div>
    </div>
  )
}