import { useAccountMergeStore } from '@/stores/accountMergeStore'
import { Input, Button } from '@/components/ui'
import { cn } from '@/lib/utils'

interface SourceSelectionPanelProps {
  societeValue: string
  compteValue: string
  filiationValue: string
  onSocieteChange: (value: string) => void
  onCompteChange: (value: string) => void
  onFiliationChange: (value: string) => void
  onNext: () => void
  className?: string
}

export const SourceSelectionPanel = ({
  societeValue,
  compteValue,
  filiationValue,
  onSocieteChange,
  onCompteChange,
  onFiliationChange,
  onNext,
  className
}: SourceSelectionPanelProps) => {
  const { sourceAccount, isProcessing } = useAccountMergeStore()

  return (
    <div className={cn('space-y-6', className)}>
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Compte Source</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Société"
            value={societeValue}
            onChange={(e) => onSocieteChange(e.target.value)}
            placeholder="Code société"
            disabled={isProcessing}
          />
          
          <Input
            label="Compte"
            value={compteValue}
            onChange={(e) => onCompteChange(e.target.value)}
            placeholder="Numéro de compte"
            disabled={isProcessing}
          />
          
          <Input
            label="Filiation"
            value={filiationValue}
            onChange={(e) => onFiliationChange(e.target.value)}
            placeholder="Numéro filiation"
            disabled={isProcessing}
          />
        </div>
      </div>

      {sourceAccount && (
        <div className="border border-gray-200 rounded-lg p-4 space-y-2 bg-gray-50">
          <h3 className="font-medium text-sm text-gray-700">Résumé du compte source</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-gray-600">Compte:</div>
            <div className="font-medium">{sourceAccount.id}</div>
            
            <div className="text-gray-600">Client:</div>
            <div className="font-medium">{sourceAccount.clientName || 'N/A'}</div>
            
            <div className="text-gray-600">Statut:</div>
            <div className={cn(
              'font-medium',
              sourceAccount.status === 'active' && 'text-green-600',
              sourceAccount.status === 'inactive' && 'text-gray-600',
              sourceAccount.status === 'suspended' && 'text-red-600'
            )}>
              {sourceAccount.status === 'active' ? 'Actif' : sourceAccount.status === 'inactive' ? 'Inactif' : 'Suspendu'}
            </div>
            
            <div className="text-gray-600">Solde:</div>
            <div className="font-medium">{sourceAccount.balance.toFixed(2)} €</div>
            
            {sourceAccount.linkedAccounts !== null && (
              <>
                <div className="text-gray-600">Comptes liés:</div>
                <div className="font-medium">{sourceAccount.linkedAccounts}</div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <Button
          onClick={onNext}
          disabled={!compteValue || isProcessing}
        >
          Suivant
        </Button>
      </div>
    </div>
  )
}