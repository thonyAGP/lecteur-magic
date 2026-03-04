import type { MergeRequest, MergeLog } from '@/types/accountMerge'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'

interface ResultPanelProps {
  mergeRequest: MergeRequest | null
  mergeLogs: MergeLog[]
  error: string | null
  onPrintTicket: () => void
  onClose: () => void
  className?: string
}

export const ResultPanel = ({
  mergeRequest,
  mergeLogs,
  error,
  onPrintTicket,
  onClose,
  className
}: ResultPanelProps) => {
  const hasErrors = mergeLogs.some(log => !log.success)
  const isSuccess = mergeRequest?.status === 'completed' && !hasErrors

  return (
    <div className={cn('space-y-6', className)}>
      <div
        className={cn(
          'p-4 rounded-lg border',
          isSuccess
            ? 'bg-green-50 border-green-200 text-green-800'
            : 'bg-red-50 border-red-200 text-red-800'
        )}
      >
        <h3 className="font-semibold mb-2">
          {isSuccess ? 'Fusion réussie' : 'Échec de la fusion'}
        </h3>
        <p className="text-sm">
          {isSuccess
            ? 'La fusion des comptes a été effectuée avec succès.'
            : error || 'Des erreurs se sont produites lors de la fusion.'}
        </p>
      </div>

      {mergeRequest && (
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b">
            <h4 className="font-semibold">Détails de la fusion</h4>
          </div>
          <table className="w-full">
            <tbody className="divide-y">
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-600">ID Fusion</td>
                <td className="px-4 py-3 text-sm">{mergeRequest.id}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-600">Compte Source</td>
                <td className="px-4 py-3 text-sm">{mergeRequest.sourceAccountId}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-600">Compte Cible</td>
                <td className="px-4 py-3 text-sm">{mergeRequest.targetAccountId}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-600">Statut</td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={cn(
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      mergeRequest.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : mergeRequest.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    )}
                  >
                    {mergeRequest.status}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-600">Code Chrono</td>
                <td className="px-4 py-3 text-sm font-mono">{mergeRequest.chronoCode}</td>
              </tr>
              {mergeRequest.validatedBy && (
                <>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-600">Validé par</td>
                    <td className="px-4 py-3 text-sm">{mergeRequest.validatedBy}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-600">Date validation</td>
                    <td className="px-4 py-3 text-sm">
                      {mergeRequest.validatedAt
                        ? new Date(mergeRequest.validatedAt).toLocaleString('fr-FR')
                        : '-'}
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      )}

      {mergeLogs.length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b">
            <h4 className="font-semibold">Journal des opérations</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                    Opération
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                    Table
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                    Enregistrements
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                    Horodatage
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {mergeLogs.map((log) => (
                  <tr
                    key={log.id}
                    className={cn(!log.success && 'bg-red-50')}
                  >
                    <td className="px-4 py-3 text-sm">{log.operation}</td>
                    <td className="px-4 py-3 text-sm font-mono">{log.tableName}</td>
                    <td className="px-4 py-3 text-sm">{log.recordCount}</td>
                    <td className="px-4 py-3 text-sm">
                      {new Date(log.timestamp).toLocaleString('fr-FR')}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={cn(
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                          log.success
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        )}
                      >
                        {log.success ? 'Succès' : 'Échec'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3">
        {isSuccess && (
          <Button
            onClick={onPrintTicket}
            variant="outline"
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            Imprimer le ticket
          </Button>
        )}
        <Button onClick={onClose}>Fermer</Button>
      </div>
    </div>
  )
}