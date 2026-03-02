import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import { useSessionHistoryStore } from '@/stores/sessionHistoryStore'

interface SessionDetailsPanelProps {
  className?: string
}

export const SessionDetailsPanel = ({ className }: SessionDetailsPanelProps) => {
  const {
    selectedSessionDetails,
    selectedSessionCurrencies,
    isLoading
  } = useSessionHistoryStore()

  const currencyColumns = useMemo(() => [
    { 
      key: 'currencyCode', 
      label: 'Currency Code',
      render: (value: string) => (
        <span className="font-mono text-sm font-medium">{value}</span>
      )
    },
    { 
      key: 'amount', 
      label: 'Amount',
      render: (value: number) => (
        <span className="text-right font-mono">
          {value.toLocaleString(undefined, { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
          })}
        </span>
      )
    },
    { 
      key: 'isLocalCurrency', 
      label: 'Local Currency',
      render: (value: boolean) => (
        <span className={cn(
          "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
          value 
            ? "bg-green-100 text-green-800" 
            : "bg-gray-100 text-gray-600"
        )}>
          {value ? 'Yes' : 'No'}
        </span>
      )
    }
  ], [])

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date)
  }

  if (isLoading) {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded w-full"></div>
            <div className="h-8 bg-gray-200 rounded w-full"></div>
            <div className="h-8 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!selectedSessionDetails) {
    return (
      <div className={cn(
        "flex items-center justify-center py-12 text-center", 
        className
      )}>
        <div className="space-y-3">
          <div className="text-gray-400">
            <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">No Session Selected</p>
          <p className="text-sm text-gray-400 max-w-sm">
            Select a session from the list to view its details and currency information.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Details</h3>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">Session ID</dt>
            <dd className="mt-1 text-sm text-gray-900 font-mono">
              #{selectedSessionDetails.sessionId}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Operator ID</dt>
            <dd className="mt-1 text-sm text-gray-900 font-mono">
              {selectedSessionDetails.operatorId}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Opened At</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {formatDate(selectedSessionDetails.openedAt)}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Closed At</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {selectedSessionDetails.closedAt 
                ? formatDate(selectedSessionDetails.closedAt)
                : (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Active
                  </span>
                )
              }
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Total Amount</dt>
            <dd className="mt-1 text-lg font-semibold text-gray-900">
              {selectedSessionDetails.totalAmount.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </dd>
          </div>
        </dl>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Currencies</h3>
        {selectedSessionCurrencies && selectedSessionCurrencies.length > 0 ? (
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {currencyColumns.map((column) => (
                    <th
                      key={column.key}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {selectedSessionCurrencies.map((currency, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    {currencyColumns.map((column) => (
                      <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm">
                        {column.render(currency[column.key as keyof typeof currency] as never)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400">
              <svg className="w-8 h-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <p className="mt-2 text-sm text-gray-500">No currency data available</p>
          </div>
        )}
      </div>
    </div>
  )
}