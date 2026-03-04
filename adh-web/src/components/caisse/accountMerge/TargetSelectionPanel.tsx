import { useState } from 'react'
import { Button, Input } from '@/components/ui'
import { cn } from '@/lib/utils'
import { useAccountMergeStore } from '@/stores/accountMergeStore'

interface TargetSelectionPanelProps {
  className?: string
  onNext: (societe: string, compte: string, filiation: string) => void
}

export const TargetSelectionPanel = ({ className, onNext }: TargetSelectionPanelProps) => {
  const [societe, setSociete] = useState('')
  const [compte, setCompte] = useState('')
  const [filiation, setFiliation] = useState('')

  const { targetAccount, isProcessing, error } = useAccountMergeStore()

  const handleNext = () => {
    onNext(societe, compte, filiation)
  }

  const canProceed = societe !== '' && compte !== '' && filiation !== ''

  return (
    <div className={cn('space-y-6', className)}>
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Sélection du compte cible</h2>
        
        <div className="space-y-3">
          <Input
            label="Société cible"
            value={societe}
            onChange={(e) => setSociete(e.target.value)}
            placeholder="Code société"
            disabled={isProcessing}
          />
          <Input
            label="Compte cible"
            value={compte}
            onChange={(e) => setCompte(e.target.value)}
            placeholder="Numéro de compte"
            disabled={isProcessing}
          />
          <Input
            label="Filiation cible"
            value={filiation}
            onChange={(e) => setFiliation(e.target.value)}
            placeholder="Code filiation"
            disabled={isProcessing}
          />
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      {targetAccount && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-3">
          <h3 className="font-semibold text-gray-900">Résumé du compte cible</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Numéro de compte:</span>
              <span className="font-medium text-gray-900">{targetAccount.id}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Statut:</span>
              <span className={cn(
                'font-medium',
                targetAccount.status === 'active' ? 'text-green-600' : 'text-gray-600'
              )}>
                {targetAccount.status === 'active' ? 'Actif' :
                 targetAccount.status === 'inactive' ? 'Inactif' : 'Suspendu'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Solde:</span>
              <span className="font-medium text-gray-900">
                {new Intl.NumberFormat('fr-FR', {
                  style: 'currency',
                  currency: 'EUR'
                }).format(targetAccount.balance)}
              </span>
            </div>
            {targetAccount.clientName && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Client:</span>
                <span className="font-medium text-gray-900">{targetAccount.clientName}</span>
              </div>
            )}
            {targetAccount.linkedAccounts !== null && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Comptes liés:</span>
                <span className="font-medium text-gray-900">{targetAccount.linkedAccounts}</span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-end pt-4 border-t border-gray-200">
        <Button
          onClick={handleNext}
          disabled={!canProceed || isProcessing}
        >
          {isProcessing ? 'Chargement...' : 'Suivant'}
        </Button>
      </div>
    </div>
  )
}