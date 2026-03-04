import type { MergeHistory } from "@/types/accountMerge";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

interface CompletionPanelProps {
  mergeHistory: MergeHistory;
  onPrintTicket: () => void;
  onClose: () => void;
  isLoading?: boolean;
  className?: string;
}

export const CompletionPanel = ({
  mergeHistory,
  onPrintTicket,
  onClose,
  isLoading = false,
  className,
}: CompletionPanelProps) => {
  const isSuccess = mergeHistory.status.toLowerCase() === "success";

  return (
    <div className={cn("flex flex-col gap-6 p-6 bg-white rounded-lg shadow", className)}>
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Résultat de la fusion</h2>
        
        <div className={cn(
          "flex items-center gap-2 p-4 rounded-lg",
          isSuccess ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
        )}>
          <div className={cn(
            "w-3 h-3 rounded-full",
            isSuccess ? "bg-green-500" : "bg-red-500"
          )} />
          <span className={cn(
            "font-medium",
            isSuccess ? "text-green-900" : "text-red-900"
          )}>
            {isSuccess ? "Fusion réussie" : "Fusion échouée"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-gray-600">Compte source</span>
            <span className="font-medium">{mergeHistory.sourceAccount}</span>
          </div>
          
          <div className="flex flex-col gap-1">
            <span className="text-sm text-gray-600">Compte cible</span>
            <span className="font-medium">{mergeHistory.targetAccount}</span>
          </div>
          
          <div className="flex flex-col gap-1">
            <span className="text-sm text-gray-600">Date de fusion</span>
            <span className="font-medium">
              {new Date(mergeHistory.mergeDate).toLocaleString("fr-FR")}
            </span>
          </div>
          
          <div className="flex flex-col gap-1">
            <span className="text-sm text-gray-600">Opérateur</span>
            <span className="font-medium">{mergeHistory.operator}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <Button
          onClick={onPrintTicket}
          disabled={isLoading}
          className="bg-gray-200 hover:bg-gray-300 text-gray-900"
        >
          Imprimer le ticket
        </Button>
        
        <Button
          onClick={onClose}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Fermer
        </Button>
      </div>
    </div>
  );
};