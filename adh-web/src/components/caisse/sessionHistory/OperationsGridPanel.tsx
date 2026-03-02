import type { SessionOperation } from "@/types/sessionHistory"
import { useSessionHistoryStore } from "@/stores/sessionHistoryStore"
import { Button } from "@/components/ui"
import { cn } from "@/lib/utils"

interface OperationsGridPanelProps {
  className?: string
}

export const OperationsGridPanel = ({ className }: OperationsGridPanelProps) => {
  const {
    operations,
    isLoading,
    sortOrder,
    toggleSortOrder,
    exportToCSV,
    localCurrency,
    amountMask
  } = useSessionHistoryStore()

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency || localCurrency
    }).format(amount)
  }

  const handleExport = () => {
    exportToCSV()
  }

  if (isLoading) {
    return (
      <div className={cn("flex items-center justify-center p-8", className)}>
        <div className="text-muted-foreground">Chargement des opérations...</div>
      </div>
    )
  }

  if (operations.length === 0) {
    return (
      <div className={cn("flex flex-col items-center justify-center p-8 space-y-4", className)}>
        <div className="text-muted-foreground">Aucune opération trouvée</div>
        <div className="text-sm text-muted-foreground">Aucune opération ne correspond aux critères de recherche</div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {operations.length} opération{operations.length > 1 ? 's' : ''}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSortOrder}
          >
            Tri: {sortOrder === 'asc' ? 'Croissant' : 'Décroissant'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={operations.length === 0}
          >
            Exporter
          </Button>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Date/Heure
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Type d'opération
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Compte
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Description
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                  Montant
                </th>
                <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">
                  Devise
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {operations.map((operation) => (
                <tr key={operation.id} className="hover:bg-muted/20">
                  <td className="px-4 py-3 text-sm">
                    {formatDateTime(operation.timestamp)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={cn(
                      "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                      operation.operationType === 'SALE' && "bg-green-100 text-green-800",
                      operation.operationType === 'PAYMENT' && "bg-blue-100 text-blue-800",
                      operation.operationType === 'REFUND' && "bg-red-100 text-red-800",
                      operation.operationType === 'ADJUSTMENT' && "bg-yellow-100 text-yellow-800",
                      operation.operationType === 'TRANSFER' && "bg-purple-100 text-purple-800"
                    )}>
                      {operation.operationType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {operation.accountName || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {operation.description || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-mono">
                    <span className={cn(
                      operation.amount >= 0 ? "text-green-600" : "text-red-600"
                    )}>
                      {formatAmount(operation.amount, operation.currency)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-center">
                    <span className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-gray-800 text-xs font-medium">
                      {operation.currency}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}