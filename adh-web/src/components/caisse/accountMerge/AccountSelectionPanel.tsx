import type { Account, MergeValidation } from "@/types/accountMerge";
import { Button, Input } from "@/components/ui";
import { cn } from "@/lib/utils";

interface AccountSelectionPanelProps {
  sourceAccountInput: string;
  targetAccountInput: string;
  onSourceAccountChange: (value: string) => void;
  onTargetAccountChange: (value: string) => void;
  onValidate: () => void;
  isLoading?: boolean;
  error?: string | null;
  sourceAccount?: Account | null;
  targetAccount?: Account | null;
  validationState?: MergeValidation | null;
  className?: string;
}

export const AccountSelectionPanel = ({
  sourceAccountInput,
  targetAccountInput,
  onSourceAccountChange,
  onTargetAccountChange,
  onValidate,
  isLoading = false,
  error = null,
  sourceAccount = null,
  targetAccount = null,
  validationState = null,
  className,
}: AccountSelectionPanelProps) => {
  const isValidationDisabled = !sourceAccountInput || !targetAccountInput || isLoading;

  return (
    <div className={cn("space-y-6", className)}>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Sélection des comptes</h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="source-account" className="block text-sm font-medium text-gray-700 mb-1">
              Compte source
            </label>
            <Input
              id="source-account"
              type="text"
              value={sourceAccountInput}
              onChange={(e) => onSourceAccountChange(e.target.value)}
              placeholder="Numéro de compte source"
              disabled={isLoading}
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor="target-account" className="block text-sm font-medium text-gray-700 mb-1">
              Compte cible
            </label>
            <Input
              id="target-account"
              type="text"
              value={targetAccountInput}
              onChange={(e) => onTargetAccountChange(e.target.value)}
              placeholder="Numéro de compte cible"
              disabled={isLoading}
              className="w-full"
            />
          </div>

          <Button
            onClick={onValidate}
            disabled={isValidationDisabled}
            className="w-full"
          >
            {isLoading ? "Validation en cours..." : "Valider les comptes"}
          </Button>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>
      </div>

      {sourceAccount && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-md font-semibold mb-3">Compte source</h3>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <dt className="text-gray-600">Numéro de compte:</dt>
            <dd className="font-medium">{sourceAccount.accountNumber}</dd>
            <dt className="text-gray-600">Solde:</dt>
            <dd className="font-medium">{sourceAccount.balance.toFixed(2)} €</dd>
            <dt className="text-gray-600">Statut:</dt>
            <dd className="font-medium">{sourceAccount.status}</dd>
            <dt className="text-gray-600">Date de création:</dt>
            <dd className="font-medium">
              {new Date(sourceAccount.createdDate).toLocaleDateString()}
            </dd>
          </dl>
        </div>
      )}

      {targetAccount && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-md font-semibold mb-3">Compte cible</h3>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <dt className="text-gray-600">Numéro de compte:</dt>
            <dd className="font-medium">{targetAccount.accountNumber}</dd>
            <dt className="text-gray-600">Solde:</dt>
            <dd className="font-medium">{targetAccount.balance.toFixed(2)} €</dd>
            <dt className="text-gray-600">Statut:</dt>
            <dd className="font-medium">{targetAccount.status}</dd>
            <dt className="text-gray-600">Date de création:</dt>
            <dd className="font-medium">
              {new Date(targetAccount.createdDate).toLocaleDateString()}
            </dd>
          </dl>
        </div>
      )}

      {validationState && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-md font-semibold mb-3">État de validation</h3>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <dt className="text-gray-600">Clôture en cours:</dt>
            <dd className="font-medium">
              {validationState.isClosureInProgress ? "Oui" : "Non"}
            </dd>
            <dt className="text-gray-600">Statut réseau:</dt>
            <dd className="font-medium">{validationState.networkStatus}</dd>
            <dt className="text-gray-600">Statut de validation:</dt>
            <dd className={cn(
              "font-medium",
              validationState.validationStatus === "OK" ? "text-green-600" : "text-red-600"
            )}>
              {validationState.validationStatus}
            </dd>
          </dl>
        </div>
      )}
    </div>
  );
};