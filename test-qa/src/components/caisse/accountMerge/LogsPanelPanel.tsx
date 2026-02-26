import type { MergeLog } from "@/types/accountMerge";
import { cn } from "@/lib/utils";

interface LogsPanelProps {
  logs: MergeLog[];
  className?: string;
}

export const LogsPanel = ({ logs, className }: LogsPanelProps) => {
  const formatTimestamp = (timestamp: Date) => {
    const date = new Date(timestamp);
    return date.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  if (logs.length === 0) {
    return (
      <div className={cn("flex items-center justify-center p-8 text-gray-500", className)}>
        Aucun log disponible
      </div>
    );
  }

  return (
    <div className={cn("w-full overflow-auto", className)}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="p-3 text-left text-sm font-medium text-gray-700">Table</th>
            <th className="p-3 text-left text-sm font-medium text-gray-700">Enregistrements</th>
            <th className="p-3 text-left text-sm font-medium text-gray-700">Statut</th>
            <th className="p-3 text-left text-sm font-medium text-gray-700">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="p-3 text-sm text-gray-900">{log.tableName}</td>
              <td className="p-3 text-sm text-gray-900">{log.recordCount}</td>
              <td className="p-3 text-sm">
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
              <td className="p-3 text-sm text-gray-600">{formatTimestamp(log.timestamp)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};