import type { SessionSummary } from "@/types/sessionHistory"
import { cn } from "@/lib/utils"

interface SessionSummaryPanelProps {
  sessionSummary: SessionSummary | null
  isLoading?: boolean
  className?: string
  localCurrency?: string
  amountMask?: string
}

export const SessionSummaryPanel = ({
  sessionSummary,
  isLoading = false,
  className,
  localCurrency = "EUR",
  amountMask = "#,##0.00"
}: SessionSummaryPanelProps) => {
  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className={cn("bg-white rounded-lg border p-6", className)}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="h-4 bg-gray-200 rounded w-28"></div>
            <div className="h-4 bg-gray-200 rounded w-28"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!sessionSummary) {
    return (
      <div className={cn("bg-white rounded-lg border p-6", className)}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Summary</h3>
        <div className="text-gray-500 text-center py-8">
          No session summary available
        </div>
      </div>
    )
  }

  return (
    <div className={cn("bg-white rounded-lg border p-6", className)}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Summary</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Session ID
            </label>
            <div className="text-sm text-gray-900 font-mono">
              {sessionSummary.sessionId}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Operator Name
            </label>
            <div className="text-sm text-gray-900">
              {sessionSummary.operatorId}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Opened At
            </label>
            <div className="text-sm text-gray-900">
              {formatDateTime(sessionSummary.openedAt)}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Closed At
            </label>
            <div className="text-sm text-gray-900">
              {sessionSummary.closedAt 
                ? formatDateTime(sessionSummary.closedAt)
                : <span className="text-amber-600 font-medium">Session Active</span>
              }
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Amount
            </label>
            <div className="text-lg font-semibold text-gray-900">
              {formatAmount(sessionSummary.totalAmount, localCurrency)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}