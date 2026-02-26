import { useState, useCallback } from "react";
import { Button, Dialog, Input } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { MergeHistory, MergeLog } from "@/types/accountMerge";

interface HistoryPanelProps {
  history: MergeHistory[];
  isLoading: boolean;
  onFilterApply: (filters: {
    startDate?: string;
    endDate?: string;
    accountId?: string;
  }) => void;
  onViewLogs: (mergeId: number) => Promise<MergeLog[]>;
  className?: string;
}

export const HistoryPanel = ({
  history,
  isLoading,
  onFilterApply,
  onViewLogs,
  className,
}: HistoryPanelProps) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [accountId, setAccountId] = useState("");
  const [showLogsDialog, setShowLogsDialog] = useState(false);
  const [selectedMergeId, setSelectedMergeId] = useState<number | null>(null);
  const [logs, setLogs] = useState<MergeLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  const handleApplyFilters = useCallback(() => {
    onFilterApply({
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      accountId: accountId || undefined,
    });
  }, [startDate, endDate, accountId, onFilterApply]);

  const handleViewLogs = useCallback(
    async (mergeId: number) => {
      setSelectedMergeId(mergeId);
      setShowLogsDialog(true);
      setLoadingLogs(true);
      try {
        const fetchedLogs = await onViewLogs(mergeId);
        setLogs(fetchedLogs);
      } catch {
        setLogs([]);
      } finally {
        setLoadingLogs(false);
      }
    },
    [onViewLogs]
  );

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("fr-FR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date);
  };

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Historique des fusions
        </h3>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div>
            <label
              htmlFor="startDate"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Date début
            </label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="endDate"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Date fin
            </label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="accountId"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              N° Compte
            </label>
            <Input
              id="accountId"
              type="text"
              placeholder="Filtrer par compte"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
            />
          </div>

          <div className="flex items-end">
            <Button
              onClick={handleApplyFilters}
              disabled={isLoading}
              className="w-full"
            >
              Appliquer les filtres
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
            </div>
          ) : history.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              Aucun historique de fusion trouvé
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                    Merge ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                    Date/Heure
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                    Opération
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                    Détails
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {history.map((item) => (
                  <tr
                    key={item.id}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                      {item.id}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                      {item.mergeRequestId}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                      {formatDate(item.timestamp)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                      {item.operation}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {item.details || "-"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewLogs(item.mergeRequestId)}
                      >
                        Voir logs
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Dialog
        open={showLogsDialog}
        onClose={() => setShowLogsDialog(false)}
        title={`Logs de fusion - Merge ID: ${selectedMergeId}`}
      >
        <div className="mt-4">
          {loadingLogs ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
            </div>
          ) : logs.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              Aucun log disponible pour cette fusion
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                      ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                      Opération
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                      Table
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                      Enreg.
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                      Date/Heure
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                      Statut
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {logs.map((log) => (
                    <tr
                      key={log.id}
                      className="transition-colors hover:bg-gray-50"
                    >
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                        {log.id}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                        {log.operation}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                        {log.tableName}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                        {log.recordCount}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                        {formatDate(log.timestamp)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                            log.success
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          )}
                        >
                          {log.success ? "Succès" : "Échec"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setShowLogsDialog(false)}>
            Fermer
          </Button>
        </div>
      </Dialog>
    </div>
  );
};