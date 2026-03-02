import { useCallback } from "react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useAccountMergeStore } from "@/stores/accountMergeStore";

interface ActionsPanelProps {
  className?: string;
  onViewHistory: () => void;
}

export const ActionsPanel = ({ className, onViewHistory }: ActionsPanelProps) => {
  const {
    mergeRequest,
    sourceAccount,
    targetAccount,
    isProcessing,
    executeMerge,
    cancelMerge,
    printMergeTicket,
    setError,
  } = useAccountMergeStore();

  const handleExecute = useCallback(async () => {
    if (!sourceAccount || !targetAccount) {
      setError("Veuillez valider les comptes avant d'exécuter la fusion");
      return;
    }

    try {
      await executeMerge(false, false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la fusion");
    }
  }, [sourceAccount, targetAccount, executeMerge, setError]);

  const handleCancel = useCallback(async () => {
    try {
      await cancelMerge();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'annulation");
    }
  }, [cancelMerge, setError]);

  const handlePrintTicket = useCallback(async () => {
    if (!mergeRequest) {
      setError("Aucune fusion en cours");
      return;
    }

    try {
      await printMergeTicket(mergeRequest.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'impression");
    }
  }, [mergeRequest, printMergeTicket, setError]);

  const canExecute = sourceAccount && targetAccount && !isProcessing;
  const canCancel = isProcessing;
  const canPrintTicket = mergeRequest !== null && !isProcessing;

  return (
    <div className={cn("bg-white rounded-lg border border-gray-200 p-4 shadow-sm", className)}>
      <h3 className="text-base font-semibold text-gray-900 mb-4">Actions</h3>
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={handleExecute}
          disabled={!canExecute}
          variant="primary"
        >
          Exécuter la fusion
        </Button>
        
        <Button
          onClick={handleCancel}
          disabled={!canCancel}
          variant="secondary"
        >
          Annuler
        </Button>
        
        <Button
          onClick={handlePrintTicket}
          disabled={!canPrintTicket}
          variant="secondary"
        >
          Imprimer ticket
        </Button>
        
        <Button
          onClick={onViewHistory}
          variant="secondary"
        >
          Voir historique
        </Button>
      </div>
    </div>
  );
};