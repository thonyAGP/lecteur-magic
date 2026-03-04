import type { MergeHistory } from "@/types/accountMerge"

interface CompletionPanelProps {
  mergeHistories: MergeHistory[]
  isLoading: boolean
  onPrintTicket: () => Promise<void>
  onClose: () => void
  className?: string
}

export const CompletionPanel = ({
  mergeHistories,
  isLoading,
  onPrintTicket,
  onClose,
  className
}: CompletionPanelProps) => {
  const latestMerge = mergeHistories[0]

  if (!latestMerge) {
    return (
      <div className={cn("flex flex-col items-center justify-center p-8 text-center", className)}>
        <div className="text-gray-500 mb-4">No merge result available</div>
        <Button onClick={onClose} variant="outline">
          Close
        </Button>
      </div>
    )
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'text-green-600 bg-green-50'
      case 'failed':
        return 'text-red-600 bg-red-50'
      case 'pending':
        return 'text-yellow-600 bg-yellow-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className={cn("bg-white rounded-lg border shadow-sm p-6", className)}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Merge Complete</h2>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Operation Finished</span>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-3">Merge Result Summary</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Source Account
              </label>
              <div className="text-sm text-gray-900 font-mono">
                {latestMerge.sourceAccount}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Account
              </label>
              <div className="text-sm text-gray-900 font-mono">
                {latestMerge.targetAccount}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Merge Date
              </label>
              <div className="text-sm text-gray-900">
                {formatDate(latestMerge.mergeDate)}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <span className={cn(
                "inline-flex px-2 py-1 rounded-full text-xs font-medium",
                getStatusColor(latestMerge.status)
              )}>
                {latestMerge.status}
              </span>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Operator
              </label>
              <div className="text-sm text-gray-900">
                {latestMerge.operator}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Merge ID
              </label>
              <div className="text-sm text-gray-900 font-mono">
                #{latestMerge.id}
              </div>
            </div>
          </div>
        </div>

        {latestMerge.status.toLowerCase() === 'completed' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-green-800">
                  Account merge completed successfully
                </h4>
                <p className="text-sm text-green-700 mt-1">
                  The source account has been merged into the target account. All data and balances have been transferred.
                </p>
              </div>
            </div>
          </div>
        )}

        {latestMerge.status.toLowerCase() === 'failed' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-red-800">
                  Account merge failed
                </h4>
                <p className="text-sm text-red-700 mt-1">
                  The merge operation could not be completed. Please check the accounts and try again.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <Button
          onClick={onPrintTicket}
          disabled={isLoading}
          variant="outline"
          className="flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          {isLoading ? "Printing..." : "Print Ticket"}
        </Button>
        
        <Button 
          onClick={onClose}
          disabled={isLoading}
        >
          Close
        </Button>
      </div>
    </div>
  )
}