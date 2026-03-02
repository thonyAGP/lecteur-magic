import type { MouvementCaisse } from "@/types/gestionCaisse"
import { DataGrid } from "@/components/ui"
import { cn } from "@/lib/utils"

interface MouvementsSectionPanelProps {
  mouvements: MouvementCaisse[]
  isLoading?: boolean
  className?: string
}

export const MouvementsSectionPanel = ({ 
  mouvements, 
  isLoading = false, 
  className 
}: MouvementsSectionPanelProps) => {
  const columns = [
    {
      key: 'dateHeure' as const,
      header: 'Date/Heure',
      sortable: true,
      render: (value: Date) => new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(new Date(value))
    },
    {
      key: 'type' as const,
      header: 'Type',
      sortable: true,
      render: (value: string) => (
        <span className={cn(
          "px-2 py-1 rounded-sm text-xs font-medium",
          value === 'APPORT' && "bg-green-100 text-green-800",
          value === 'REMISE' && "bg-blue-100 text-blue-800",
          value === 'INITIAL' && "bg-gray-100 text-gray-800"
        )}>
          {value}
        </span>
      )
    },
    {
      key: 'deviseCode' as const,
      header: 'Devise',
      sortable: true
    },
    {
      key: 'montant' as const,
      header: 'Montant',
      sortable: true,
      render: (value: number) => new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2
      }).format(value)
    }
  ]

  if (isLoading) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="h-6 w-48 bg-gray-200 animate-pulse rounded" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 animate-pulse rounded" />
          ))}
        </div>
      </div>
    )
  }

  if (mouvements.length === 0) {
    return (
      <div className={cn("space-y-4", className)}>
        <h3 className="text-lg font-semibold text-gray-900">
          Mouvements de caisse
        </h3>
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-4">📝</div>
          <p className="text-lg font-medium mb-2">Aucun mouvement</p>
          <p className="text-sm">Les mouvements de la session apparaîtront ici</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Mouvements de caisse
        </h3>
        <span className="text-sm text-gray-500">
          {mouvements.length} mouvement{mouvements.length > 1 ? 's' : ''}
        </span>
      </div>
      <DataGrid
        data={mouvements}
        columns={columns}
        keyField="mouvementId"
        className="border border-gray-200 rounded-lg"
        pagination={{
          pageSize: 10,
          showSizeChanger: true
        }}
        sortable
      />
    </div>
  )
}