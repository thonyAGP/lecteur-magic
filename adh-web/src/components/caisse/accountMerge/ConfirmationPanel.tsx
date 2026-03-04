import type { FC } from 'react'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'
import { useAccountMergeStore } from '@/stores/accountMergeStore'

export const ConfirmationPanel: FC = () => {
  const {
    mergeRequest,
    sourceAccount,
    targetAccount,
    validationStatus,
    isProcessing,
    executeMerge,
    cancelMerge
  } = useAccountMergeStore()

  if (!sourceAccount || !targetAccount || !mergeRequest) {
    return null
  }

  const affectedTables = [
    { name: 'operations', recordCount: 150 },
    { name: 'transactions', recordCount: 320 },
    { name: 'soldes', recordCount: 12 },
    { name: 'garanties', recordCount: 5 }
  ] as const

  const warnings: string[] = []
  
  if (sourceAccount.balance !== 0) {
    warnings.push(`Le compte source a un solde non nul: ${sourceAccount.balance.toFixed(2)}€`)
  }
  
  if (sourceAccount.linkedAccounts && sourceAccount.linkedAccounts > 0) {
    warnings.push(`Le compte source a ${sourceAccount.linkedAccounts} compte(s) lié(s)`)
  }
  
  if (validationStatus && !validationStatus.network) {
    warnings.push('Validation réseau échouée')
  }
  
  if (validationStatus && !validationStatus.closure) {
    warnings.push('Validation clôture échouée')
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Récapitulatif de la fusion</h3>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-3 font-medium text-gray-700">Compte</th>
              <th className="text-left py-2 px-3 font-medium text-gray-700">Numéro</th>
              <th className="text-left py-2 px-3 font-medium text-gray-700">Client</th>
              <th className="text-left py-2 px-3 font-medium text-gray-700">Solde</th>
              <th className="text-left py-2 px-3 font-medium text-gray-700">Statut</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-3 px-3 font-medium">Source</td>
              <td className="py-3 px-3">{sourceAccount.id}</td>
              <td className="py-3 px-3">{sourceAccount.clientName || 'N/A'}</td>
              <td className="py-3 px-3">{sourceAccount.balance.toFixed(2)}€</td>
              <td className="py-3 px-3">
                <span className={cn(
                  'inline-block px-2 py-1 rounded text-sm',
                  sourceAccount.status === 'active' && 'bg-green-100 text-green-800',
                  sourceAccount.status === 'inactive' && 'bg-gray-100 text-gray-800',
                  sourceAccount.status === 'suspended' && 'bg-red-100 text-red-800'
                )}>
                  {sourceAccount.status}
                </span>
              </td>
            </tr>
            <tr>
              <td className="py-3 px-3 font-medium">Cible</td>
              <td className="py-3 px-3">{targetAccount.id}</td>
              <td className="py-3 px-3">{targetAccount.clientName || 'N/A'}</td>
              <td className="py-3 px-3">{targetAccount.balance.toFixed(2)}€</td>
              <td className="py-3 px-3">
                <span className={cn(
                  'inline-block px-2 py-1 rounded text-sm',
                  targetAccount.status === 'active' && 'bg-green-100 text-green-800',
                  targetAccount.status === 'inactive' && 'bg-gray-100 text-gray-800',
                  targetAccount.status === 'suspended' && 'bg-red-100 text-red-800'
                )}>
                  {targetAccount.status}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Tables affectées</h3>
        <ul className="space-y-2">
          {affectedTables.map((table) => (
            <li key={table.name} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
              <span className="font-medium">{table.name}</span>
              <span className="text-sm text-gray-600">{table.recordCount} enregistrement(s)</span>
            </li>
          ))}
        </ul>
      </div>

      {warnings.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-3">Avertissements</h3>
          <ul className="space-y-2">
            {warnings.map((warning, index) => (
              <li key={index} className="flex items-start text-yellow-800">
                <span className="mr-2">⚠️</span>
                <span>{warning}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex justify-end gap-4">
        <Button
          onClick={cancelMerge}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800"
          disabled={isProcessing}
        >
          Annuler
        </Button>
        <Button
          onClick={executeMerge}
          className="bg-blue-600 hover:bg-blue-700 text-white"
          disabled={isProcessing}
        >
          {isProcessing ? 'Traitement en cours...' : 'Confirmer la fusion'}
        </Button>
      </div>
    </div>
  )
}