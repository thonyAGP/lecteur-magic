import type { MergeValidation } from "@/types/accountMerge"

interface ValidationStatusPanelProps {
  validationState: MergeValidation | null
  isLoading?: boolean
  className?: string
}

export const ValidationStatusPanel = ({
  validationState,
  isLoading = false,
  className
}: ValidationStatusPanelProps) => {
  const getClosureStatusColor = () => {
    if (!validationState) return "bg-gray-100 text-gray-500"
    return validationState.isClosureInProgress 
      ? "bg-red-100 text-red-700" 
      : "bg-green-100 text-green-700"
  }

  const getNetworkStatusColor = () => {
    if (!validationState) return "bg-gray-100 text-gray-500"
    
    switch (validationState.networkStatus?.toLowerCase()) {
      case "online":
      case "connected":
        return "bg-green-100 text-green-700"
      case "offline":
      case "disconnected":
        return "bg-red-100 text-red-700"
      case "unstable":
      case "degraded":
        return "bg-yellow-100 text-yellow-700"
      default:
        return "bg-gray-100 text-gray-500"
    }
  }

  const getValidationResultColor = () => {
    if (!validationState) return "bg-gray-100 text-gray-500"
    
    switch (validationState.validationStatus?.toLowerCase()) {
      case "passed":
      case "valid":
      case "success":
        return "bg-green-100 text-green-700"
      case "failed":
      case "invalid":
      case "error":
        return "bg-red-100 text-red-700"
      case "warning":
      case "pending":
        return "bg-yellow-100 text-yellow-700"
      default:
        return "bg-gray-100 text-gray-500"
    }
  }

  const getClosureStatusText = () => {
    if (isLoading) return "Checking..."
    if (!validationState) return "Not checked"
    return validationState.isClosureInProgress ? "In Progress" : "Available"
  }

  const getNetworkStatusText = () => {
    if (isLoading) return "Checking..."
    if (!validationState?.networkStatus) return "Unknown"
    return validationState.networkStatus.charAt(0).toUpperCase() + validationState.networkStatus.slice(1)
  }

  const getValidationResultText = () => {
    if (isLoading) return "Validating..."
    if (!validationState?.validationStatus) return "Not validated"
    return validationState.validationStatus.charAt(0).toUpperCase() + validationState.validationStatus.slice(1)
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-700">Closure Status</h3>
            {isLoading && (
              <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full" />
            )}
          </div>
          <div className={cn(
            "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium",
            getClosureStatusColor()
          )}>
            <div className={cn(
              "w-2 h-2 rounded-full mr-2",
              validationState?.isClosureInProgress ? "bg-red-500" : "bg-green-500",
              !validationState && "bg-gray-400"
            )} />
            {getClosureStatusText()}
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-700">Network Status</h3>
            {isLoading && (
              <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full" />
            )}
          </div>
          <div className={cn(
            "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium",
            getNetworkStatusColor()
          )}>
            <div className={cn(
              "w-2 h-2 rounded-full mr-2",
              validationState?.networkStatus?.toLowerCase() === "online" || validationState?.networkStatus?.toLowerCase() === "connected" ? "bg-green-500" : "bg-red-500",
              !validationState?.networkStatus && "bg-gray-400"
            )} />
            {getNetworkStatusText()}
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-700">Validation Result</h3>
            {isLoading && (
              <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full" />
            )}
          </div>
          <div className={cn(
            "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium",
            getValidationResultColor()
          )}>
            <div className={cn(
              "w-2 h-2 rounded-full mr-2",
              validationState?.validationStatus?.toLowerCase() === "passed" || validationState?.validationStatus?.toLowerCase() === "valid" || validationState?.validationStatus?.toLowerCase() === "success" ? "bg-green-500" : "bg-red-500",
              !validationState?.validationStatus && "bg-gray-400"
            )} />
            {getValidationResultText()}
          </div>
        </div>
      </div>

      {validationState && (
        <div className="bg-white rounded-lg border p-4 shadow-sm">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Validation Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Account Closure:</span>
              <span className={cn(
                "font-medium",
                validationState.isClosureInProgress ? "text-red-600" : "text-green-600"
              )}>
                {validationState.isClosureInProgress ? "Blocked - closure in progress" : "Ready for merge"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Network Connection:</span>
              <span className={cn(
                "font-medium capitalize",
                validationState.networkStatus?.toLowerCase() === "online" || validationState.networkStatus?.toLowerCase() === "connected" ? "text-green-600" : "text-red-600"
              )}>
                {validationState.networkStatus || "Unknown"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Overall Status:</span>
              <span className={cn(
                "font-medium capitalize",
                validationState.validationStatus?.toLowerCase() === "passed" || validationState.validationStatus?.toLowerCase() === "valid" || validationState.validationStatus?.toLowerCase() === "success" ? "text-green-600" : "text-red-600"
              )}>
                {validationState.validationStatus || "Not validated"}
              </span>
            </div>
          </div>
        </div>
      )}

      {!validationState && !isLoading && (
        <div className="bg-gray-50 rounded-lg border p-6 text-center">
          <div className="text-gray-400 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">No validation data available</p>
          <p className="text-gray-400 text-xs mt-1">Run account validation to see status</p>
        </div>
      )}
    </div>
  )
}