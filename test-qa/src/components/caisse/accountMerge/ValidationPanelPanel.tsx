import type { Account, ValidationStatus } from "@/types/accountMerge";
import { cn } from "@/lib/utils";

interface ValidationPanelProps {
  validationStatus: ValidationStatus | null;
  sourceAccount: Account | null;
  targetAccount: Account | null;
  error: string | null;
  className?: string;
}

export const ValidationPanel = ({
  validationStatus,
  sourceAccount,
  targetAccount,
  error,
  className,
}: ValidationPanelProps) => {
  const hasData = validationStatus || sourceAccount || targetAccount;

  if (!hasData && !error) {
    return (
      <div className={cn("p-8 text-center text-slate-500 dark:text-slate-400", className)}>
        Aucune validation en cours
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {validationStatus && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Statut de validation
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div
                className={cn(
                  "w-3 h-3 rounded-full flex-shrink-0",
                  validationStatus.network ? "bg-green-500" : "bg-red-500"
                )}
              />
              <div className="min-w-0">
                <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  Réseau
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 truncate">
                  {validationStatus.network ? "Disponible" : "Mode 'R'"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div
                className={cn(
                  "w-3 h-3 rounded-full flex-shrink-0",
                  validationStatus.closure ? "bg-green-500" : "bg-red-500"
                )}
              />
              <div className="min-w-0">
                <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  Clôture
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 truncate">
                  {validationStatus.closure ? "Valide" : "Non valide"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div
                className={cn(
                  "w-3 h-3 rounded-full flex-shrink-0",
                  validationStatus.validation === "V"
                    ? "bg-green-500"
                    : "bg-yellow-500"
                )}
              />
              <div className="min-w-0">
                <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  Validation
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 truncate">
                  {validationStatus.validation || "Non défini"}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {(sourceAccount || targetAccount) && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Comptes
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {sourceAccount && (
              <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                <div className="text-sm font-semibold mb-3 text-blue-600 dark:text-blue-400">
                  Compte Source
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">ID:</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {sourceAccount.id}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Statut:</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {sourceAccount.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Solde:</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {sourceAccount.balance.toFixed(2)} €
                    </span>
                  </div>
                  {sourceAccount.clientName && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Client:</span>
                      <span className="font-medium text-slate-900 dark:text-slate-100 truncate ml-2">
                        {sourceAccount.clientName}
                      </span>
                    </div>
                  )}
                  {sourceAccount.linkedAccounts !== null && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Liés:</span>
                      <span className="font-medium text-slate-900 dark:text-slate-100">
                        {sourceAccount.linkedAccounts}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {targetAccount && (
              <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                <div className="text-sm font-semibold mb-3 text-green-600 dark:text-green-400">
                  Compte Cible
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">ID:</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {targetAccount.id}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Statut:</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {targetAccount.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Solde:</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {targetAccount.balance.toFixed(2)} €
                    </span>
                  </div>
                  {targetAccount.clientName && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Client:</span>
                      <span className="font-medium text-slate-900 dark:text-slate-100 truncate ml-2">
                        {targetAccount.clientName}
                      </span>
                    </div>
                  )}
                  {targetAccount.linkedAccounts !== null && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Liés:</span>
                      <span className="font-medium text-slate-900 dark:text-slate-100">
                        {targetAccount.linkedAccounts}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-red-800 dark:text-red-200 mb-1">
                Erreur
              </div>
              <div className="text-sm text-red-700 dark:text-red-300 break-words">
                {error}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};