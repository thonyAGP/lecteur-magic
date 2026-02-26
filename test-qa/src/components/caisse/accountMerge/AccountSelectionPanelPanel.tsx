import type { ValidationStatus } from "@/types/accountMerge";
import { Input, Button } from "@/components/ui";
import { cn } from "@/lib/utils";

interface AccountSelectionPanelProps {
  sourceAccountId: string;
  targetAccountId: string;
  onSourceAccountChange: (value: string) => void;
  onTargetAccountChange: (value: string) => void;
  onValidate: () => void;
  validationStatus: ValidationStatus | null;
  error: string | null;
  isProcessing: boolean;
}

export const AccountSelectionPanel = ({
  sourceAccountId,
  targetAccountId,
  onSourceAccountChange,
  onTargetAccountChange,
  onValidate,
  validationStatus,
  error,
  isProcessing,
}: AccountSelectionPanelProps) => {
  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="sourceAccount" className="text-sm font-medium text-gray-700">
            Compte source
          </label>
          <Input
            id="sourceAccount"
            type="text"
            value={sourceAccountId}
            onChange={(e) => onSourceAccountChange(e.target.value)}
            placeholder="Numéro de compte source"
            disabled={isProcessing}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="targetAccount" className="text-sm font-medium text-gray-700">
            Compte cible
          </label>
          <Input
            id="targetAccount"
            type="text"
            value={targetAccountId}
            onChange={(e) => onTargetAccountChange(e.target.value)}
            placeholder="Numéro de compte cible"
            disabled={isProcessing}
            className="w-full"
          />
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={onValidate}
          disabled={isProcessing || !sourceAccountId || !targetAccountId}
          className="px-6 py-2"
        >
          {isProcessing ? "Validation en cours..." : "Valider"}
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {validationStatus && (
        <div className="space-y-3 p-4 bg-gray-50 border border-gray-200 rounded-md">
          <h3 className="text-sm font-semibold text-gray-900">Statut de validation</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Réseau:</span>
              <span
                className={cn(
                  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                  validationStatus.network
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                )}
              >
                {validationStatus.network ? "Valide" : "Invalide"}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Clôture:</span>
              <span
                className={cn(
                  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                  validationStatus.closure
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                )}
              >
                {validationStatus.closure ? "Valide" : "Invalide"}
              </span>
            </div>
          </div>

          {validationStatus.validation && (
            <div className="pt-2 border-t border-gray-200">
              <span className="text-sm text-gray-600">Message: </span>
              <span className="text-sm text-gray-900">{validationStatus.validation}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};