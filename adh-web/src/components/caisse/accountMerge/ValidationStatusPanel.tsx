import type { MergeValidation } from "@/types/accountMerge";
import { useAccountMergeStore } from "@/stores/accountMergeStore";
import { cn } from "@/lib/utils";

interface ValidationStatusPanelProps {
  className?: string;
}

const getClosureStatusColor = (isInProgress: boolean): string => {
  return isInProgress 
    ? "bg-yellow-100 text-yellow-800 border-yellow-200" 
    : "bg-green-100 text-green-800 border-green-200";
};

const getNetworkStatusColor = (status: string): string => {
  const normalizedStatus = status.toLowerCase();
  if (normalizedStatus === "online" || normalizedStatus === "connected") {
    return "bg-green-100 text-green-800 border-green-200";
  }
  if (normalizedStatus === "offline" || normalizedStatus === "disconnected") {
    return "bg-red-100 text-red-800 border-red-200";
  }
  return "bg-gray-100 text-gray-800 border-gray-200";
};

const getValidationStatusColor = (status: string): string => {
  const normalizedStatus = status.toLowerCase();
  if (normalizedStatus === "valid" || normalizedStatus === "success" || normalizedStatus === "ok") {
    return "bg-green-100 text-green-800 border-green-200";
  }
  if (normalizedStatus === "invalid" || normalizedStatus === "error" || normalizedStatus === "failed") {
    return "bg-red-100 text-red-800 border-red-200";
  }
  if (normalizedStatus === "warning" || normalizedStatus === "pending") {
    return "bg-yellow-100 text-yellow-800 border-yellow-200";
  }
  return "bg-gray-100 text-gray-800 border-gray-200";
};

export const ValidationStatusPanel = ({ className }: ValidationStatusPanelProps) => {
  const { validationState } = useAccountMergeStore();

  if (!validationState) {
    return (
      <div className={cn("rounded-lg border border-gray-200 bg-white p-6", className)}>
        <p className="text-sm text-gray-500">Aucune validation en cours</p>
      </div>
    );
  }

  return (
    <div className={cn("rounded-lg border border-gray-200 bg-white p-6", className)}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Statut de validation</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Clôture en cours</span>
          <span className={cn(
            "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
            getClosureStatusColor(validationState.isClosureInProgress)
          )}>
            {validationState.isClosureInProgress ? "En cours" : "Aucune"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Statut réseau</span>
          <span className={cn(
            "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
            getNetworkStatusColor(validationState.networkStatus)
          )}>
            {validationState.networkStatus}
          </span>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Résultat de validation</span>
            <span className={cn(
              "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
              getValidationStatusColor(validationState.validationStatus)
            )}>
              {validationState.validationStatus}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};