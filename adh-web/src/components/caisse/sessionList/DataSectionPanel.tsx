import type { FC } from "react"
import { DataGrid } from "@/components/ui"
import type { Column } from "@/components/ui"
import { useSessionListStore } from "@/stores/sessionListStore"
import type { Session } from "@/types/session"

interface DataSectionPanelProps {
  className?: string
}

export const DataSectionPanel: FC<DataSectionPanelProps> = ({ className }) => {
  const { sessions, isLoading, error } = useSessionListStore()

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const formatMontant = (montant: number | null) => {
    if (montant === null) return '-'
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(montant)
  }

  const columns: Column<Session>[] = [
    {
      key: 'id',
      title: 'ID',
      width: 80,
      render: (session) => session.id.toString()
    },
    {
      key: 'societe',
      title: 'Société',
      width: 120,
      render: (session) => session.societe
    },
    {
      key: 'caisse',
      title: 'Caisse',
      width: 100,
      render: (session) => session.caisse
    },
    {
      key: 'operateur',
      title: 'Opérateur',
      width: 120,
      render: (session) => session.operateur
    },
    {
      key: 'dateOuverture',
      title: 'Date ouverture',
      width: 140,
      render: (session) => formatDate(session.dateOuverture)
    },
    {
      key: 'etat',
      title: 'État',
      width: 100,
      render: (session) => (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          session.etat === 'OUVERTE' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {session.etat}
        </span>
      )
    },
    {
      key: 'montantOuverture',
      title: 'Montant ouverture',
      width: 140,
      render: (session) => formatMontant(session.montantOuverture)
    }
  ]

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
        <div className="text-red-600 text-sm mb-2">Erreur lors du chargement des données</div>
        <div className="text-gray-500 text-xs">{error}</div>
      </div>
    )
  }

  if (!isLoading && sessions.length === 0) {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <div className="text-center">
          <div className="text-gray-400 text-sm">Aucune session trouvée</div>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <DataGrid
        data={sessions}
        columns={columns}
        loading={isLoading}
        className="h-full"
      />
    </div>
  )
}