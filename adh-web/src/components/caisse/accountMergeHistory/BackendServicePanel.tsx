import { useDataSourceStore } from "@/stores/dataSourceStore";
import { useAccountMergeHistoryStore } from "@/stores/accountMergeHistoryStore";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";

interface BackendServicePanelProps {
  className?: string;
}

export const BackendServicePanel = ({ className }: BackendServicePanelProps) => {
  const isRealApi = useDataSourceStore((state) => state.isRealApi);
  const { isLoading, error, lastCreatedEntry, historyEntries } = useAccountMergeHistoryStore();

  const formatTimestamp = (date: Date | null | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString("fr-FR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const serviceStatus = isLoading ? "Processing" : "Idle";
  const apiMode = isRealApi ? "Real API" : "Mock Data";

  return (
    <div className={cn("rounded-lg border border-gray-200 bg-white p-4 shadow-sm", className)}>
      <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-3">
        <h3 className="text-lg font-semibold text-gray-900">Backend Service Status</h3>
        <div className="flex items-center gap-2">
          <span className={cn("h-2.5 w-2.5 rounded-full", isLoading ? "bg-yellow-500" : "bg-green-500")} />
          <span className="text-sm font-medium text-gray-700">{serviceStatus}</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2">
          <span className="text-sm font-medium text-gray-600">API Mode:</span>
          <span className={cn("text-sm font-semibold", isRealApi ? "text-blue-600" : "text-purple-600")}>
            {apiMode}
          </span>
        </div>

        <div className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2">
          <span className="text-sm font-medium text-gray-600">Cached Entries:</span>
          <span className="text-sm font-semibold text-gray-900">{historyEntries.length}</span>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 px-3 py-2">
            <p className="text-sm font-medium text-red-800">Error:</p>
            <p className="mt-1 text-sm text-red-600">{error}</p>
          </div>
        )}

        {lastCreatedEntry && (
          <div className="rounded-md border border-gray-200 bg-gray-50 p-3">
            <p className="mb-2 text-sm font-medium text-gray-700">Last Created Entry:</p>
            <div className="space-y-1 text-xs text-gray-600">
              <div className="flex justify-between">
                <span className="font-medium">Chrono ID:</span>
                <span>{lastCreatedEntry.chronoId}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Operation:</span>
                <span className="font-mono">{lastCreatedEntry.operationType}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Account:</span>
                <span>
                  {lastCreatedEntry.referenceAccount}/{lastCreatedEntry.referenceFiliation}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Name:</span>
                <span>{lastCreatedEntry.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Timestamp:</span>
                <span>{formatTimestamp(lastCreatedEntry.timestamp)}</span>
              </div>
            </div>
          </div>
        )}

        {!lastCreatedEntry && !error && (
          <div className="rounded-md bg-gray-50 px-3 py-2 text-center">
            <p className="text-sm text-gray-500">No operations recorded yet</p>
          </div>
        )}
      </div>

      <div className="mt-4 border-t border-gray-200 pt-3">
        <p className="text-xs text-gray-500">
          This service is called by the Fusion program (IDE 28) to persist account merge/separation history.
        </p>
      </div>
    </div>
  );
};