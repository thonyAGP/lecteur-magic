import { useEffect, useState, useCallback } from "react";
import { ScreenLayout } from "@/components/layout";
import { Button, Dialog, Input } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useAccountMergeStore } from "@/stores/accountMergeStore";
import type { MergeHistory, MergeLog } from "@/types/accountMerge";

export const AccountMergePage = () => {
  const {
    mergeRequest,
    sourceAccount,
    targetAccount,
    mergeHistory,
    mergeLogs,
    validationStatus,
    currentStep,
    isProcessing,
    error,
    progressData,
    validatePrerequisites,
    loadAccounts,
    executeMerge,
    cancelMerge,
    printMergeTicket,
    getMergeHistory,
    getMergeLogs,
    setError,
    reset,
  } = useAccountMergeStore();

  const [sourceAccountId, setSourceAccountId] = useState("");
  const [targetAccountId, setTargetAccountId] = useState("");
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [showLogsDialog, setShowLogsDialog] = useState(false);
  const [historyStartDate, setHistoryStartDate] = useState("");
  const [historyEndDate, setHistoryEndDate] = useState("");
  const [historyAccountId, setHistoryAccountId] = useState("");
  const [selectedMergeId, setSelectedMergeId] = useState<number | null>(null);

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  const handleValidate = useCallback(async () => {
    if (!sourceAccountId || !targetAccountId) {
      setError("Veuillez saisir les comptes source et cible");
      return;
    }

    const sourceId = parseInt(sourceAccountId, 10);
    const targetId = parseInt(targetAccountId, 10);

    if (isNaN(sourceId) || isNaN(targetId)) {
      setError("Les numéros de compte doivent être des nombres valides");
      return;
    }

    try {
      await validatePrerequisites(sourceId, targetId);
      await loadAccounts(sourceId, targetId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de validation");
    }
  }, [sourceAccountId, targetAccountId, validatePrerequisites, loadAccounts, setError]);

  const handleExecute = useCallback(async () => {
    try {
      await executeMerge(false, false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la fusion");
    }
  }, [executeMerge, setError]);

  const handleCancel = useCallback(async () => {
    try {
      await cancelMerge();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'annulation");
    }
  }, [cancelMerge, setError]);

  const handlePrintTicket = useCallback(async () => {
    if (!mergeRequest) {
      setError("Aucune fusion à imprimer");
      return;
    }

    try {
      await printMergeTicket(mergeRequest.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'impression");
    }
  }, [mergeRequest, printMergeTicket, setError]);

  const handleViewHistory = useCallback(async () => {
    try {
      const filters = {
        ...(historyStartDate && { startDate: new Date(historyStartDate) }),
        ...(historyEndDate && { endDate: new Date(historyEndDate) }),
        ...(historyAccountId && { accountId: parseInt(historyAccountId, 10) }),
      };
      await getMergeHistory(filters);
      setShowHistoryDialog(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du chargement de l'historique");
    }
  }, [historyStartDate, historyEndDate, historyAccountId, getMergeHistory, setError]);

  const handleViewLogs = useCallback(async (mergeId: number) => {
    try {
      await getMergeLogs(mergeId);
      setSelectedMergeId(mergeId);
      setShowLogsDialog(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du chargement des logs");
    }
  }, [getMergeLogs, setError]);

  const getStepLabel = (step: typeof currentStep): string => {
    const labels = {
      validation: "Validation des prérequis",
      preparation: "Préparation de la fusion",
      execution: "Exécution de la fusion",
      completion: "Finalisation",
    };
    return labels[step];
  };

  const getStepIndex = (step: typeof currentStep): number => {
    const indices = { validation: 1, preparation: 2, execution: 3, completion: 4 };
    return indices[step];
  };

  return (
    <ScreenLayout className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Fusion de comptes</h1>
          {currentStep !== "validation" && (
            <div className="text-sm text-gray-600">
              Étape {getStepIndex(currentStep)}/4: {getStepLabel(currentStep)}
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            <div className="flex items-center justify-between">
              <span>{error}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setError(null)}
                className="text-red-800 hover:text-red-900"
              >
                ✕
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6 space-y-4">
              <h2 className="text-lg font-semibold">Sélection des comptes</h2>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Compte source</label>
                <Input
                  type="number"
                  value={sourceAccountId}
                  onChange={(e) => setSourceAccountId(e.target.value)}
                  placeholder="Numéro de compte source"
                  disabled={isProcessing || currentStep !== "validation"}
                />
                {sourceAccount && (
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Client: {sourceAccount.clientName}</div>
                    <div>Solde: {sourceAccount.balance.toFixed(2)} €</div>
                    <div>Statut: {sourceAccount.status}</div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Compte cible</label>
                <Input
                  type="number"
                  value={targetAccountId}
                  onChange={(e) => setTargetAccountId(e.target.value)}
                  placeholder="Numéro de compte cible"
                  disabled={isProcessing || currentStep !== "validation"}
                />
                {targetAccount && (
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Client: {targetAccount.clientName}</div>
                    <div>Solde: {targetAccount.balance.toFixed(2)} €</div>
                    <div>Statut: {targetAccount.status}</div>
                  </div>
                )}
              </div>

              <Button
                onClick={handleValidate}
                disabled={isProcessing || !sourceAccountId || !targetAccountId}
                className="w-full"
              >
                {isProcessing ? "Validation en cours..." : "Valider les comptes"}
              </Button>
            </div>

            {validationStatus && (
              <div className="bg-white rounded-lg shadow p-6 space-y-4">
                <h2 className="text-lg font-semibold">Statut de validation</h2>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Réseau disponible</span>
                    <span className={cn(
                      "px-2 py-1 rounded text-xs font-medium",
                      validationStatus.network
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    )}>
                      {validationStatus.network ? "OK" : "KO"}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Clôture disponible</span>
                    <span className={cn(
                      "px-2 py-1 rounded text-xs font-medium",
                      validationStatus.closure
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    )}>
                      {validationStatus.closure ? "OK" : "KO"}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Validation globale</span>
                    <span className={cn(
                      "px-2 py-1 rounded text-xs font-medium",
                      validationStatus.validation === "V"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    )}>
                      {validationStatus.validation}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {(currentStep === "execution" || currentStep === "completion") && (
              <div className="bg-white rounded-lg shadow p-6 space-y-4">
                <h2 className="text-lg font-semibold">Progression</h2>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Étape: {getStepLabel(currentStep)}</span>
                    <span>{progressData.current} / {progressData.total}</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{
                        width: progressData.total > 0
                          ? `${(progressData.current / progressData.total) * 100}%`
                          : "0%"
                      }}
                    />
                  </div>
                  
                  {progressData.table && (
                    <div className="text-sm text-gray-600">
                      Table en cours: {progressData.table}
                    </div>
                  )}
                </div>

                {mergeLogs.length > 0 && (
                  <div className="max-h-48 overflow-y-auto space-y-1">
                    <div className="text-sm font-medium">Messages de statut:</div>
                    {mergeLogs.slice(-10).map((log) => (
                      <div key={log.id} className="text-xs text-gray-600 flex items-center justify-between">
                        <span>{log.tableName}: {log.recordCount} enregistrements</span>
                        <span className={cn(
                          "px-1.5 py-0.5 rounded",
                          log.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        )}>
                          {log.success ? "OK" : "KO"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="bg-white rounded-lg shadow p-6 space-y-4">
              <h2 className="text-lg font-semibold">Actions</h2>
              
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={handleExecute}
                  disabled={isProcessing || !validationStatus || currentStep !== "validation"}
                  variant="default"
                >
                  Exécuter la fusion
                </Button>
                
                <Button
                  onClick={handleCancel}
                  disabled={!isProcessing}
                  variant="secondary"
                >
                  Annuler
                </Button>
                
                <Button
                  onClick={handlePrintTicket}
                  disabled={!mergeRequest || currentStep !== "completion"}
                  variant="secondary"
                >
                  Imprimer ticket
                </Button>
                
                <Button
                  onClick={() => setShowHistoryDialog(true)}
                  variant="secondary"
                >
                  Voir historique
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Historique des fusions</h2>
          
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Date début</label>
              <Input
                type="date"
                value={historyStartDate}
                onChange={(e) => setHistoryStartDate(e.target.value)}
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium">Date fin</label>
              <Input
                type="date"
                value={historyEndDate}
                onChange={(e) => setHistoryEndDate(e.target.value)}
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium">Compte</label>
              <Input
                type="number"
                value={historyAccountId}
                onChange={(e) => setHistoryAccountId(e.target.value)}
                placeholder="Numéro de compte"
              />
            </div>
          </div>
          
          <Button onClick={handleViewHistory} className="mb-4">
            Filtrer
          </Button>

          {mergeHistory.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Aucun historique disponible
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">ID Fusion</th>
                    <th className="px-4 py-2 text-left">Opération</th>
                    <th className="px-4 py-2 text-left">Date/Heure</th>
                    <th className="px-4 py-2 text-left">Détails</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {mergeHistory.map((history) => (
                    <tr key={history.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{history.mergeRequestId}</td>
                      <td className="px-4 py-2">{history.operation}</td>
                      <td className="px-4 py-2">
                        {new Date(history.timestamp).toLocaleString("fr-FR")}
                      </td>
                      <td className="px-4 py-2">{history.details || "-"}</td>
                      <td className="px-4 py-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewLogs(history.mergeRequestId)}
                        >
                          Logs
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          <div className="mt-4 flex justify-end">
            <Button onClick={() => setShowHistoryDialog(false)} variant="secondary">
              Fermer
            </Button>
          </div>
        </div>
      </Dialog>

      <Dialog open={showLogsDialog} onOpenChange={setShowLogsDialog}>
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">
            Logs de fusion {selectedMergeId ? `#${selectedMergeId}` : ""}
          </h2>

          {mergeLogs.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Aucun log disponible
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Table</th>
                    <th className="px-4 py-2 text-left">Enregistrements</th>
                    <th className="px-4 py-2 text-left">Statut</th>
                    <th className="px-4 py-2 text-left">Date/Heure</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {mergeLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 font-mono">{log.tableName}</td>
                      <td className="px-4 py-2">{log.recordCount}</td>
                      <td className="px-4 py-2">
                        <span className={cn(
                          "px-2 py-1 rounded text-xs font-medium",
                          log.success
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        )}>
                          {log.success ? "Succès" : "Échec"}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        {new Date(log.timestamp).toLocaleString("fr-FR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          <div className="mt-4 flex justify-end">
            <Button onClick={() => setShowLogsDialog(false)} variant="secondary">
              Fermer
            </Button>
          </div>
        </div>
      </Dialog>
    </ScreenLayout>
  );
};