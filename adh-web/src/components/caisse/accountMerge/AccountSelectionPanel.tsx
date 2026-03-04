import { useCallback } from "react"
import type { Account, MergeValidation } from "@/types/accountMerge"
import { useAccountMergeStore } from "@/stores/accountMergeStore"
import { Button, Input } from "@/components/ui"
import { cn } from "@/lib/utils"

interface AccountSelectionPanelProps {
  sourceAccountId: string
  targetAccountId: string
  onSourceAccountChange: (value: string) => void
  onTargetAccountChange: (value: string) => void
  onValidateAccounts: () => Promise<void>
  className?: string
}

export const AccountSelectionPanel = ({
  sourceAccountId,
  targetAccountId,
  onSourceAccountChange,
  onTargetAccountChange,
  onValidateAccounts,
  className
}: AccountSelectionPanelProps) => {
  const {
    sourceAccount,
    targetAccount,
    validationState,
    isLoading,
    error
  } = useAccountMergeStore()

  const isValidationDisabled = !sourceAccountId.trim() || 
                               !targetAccountId.trim() || 
                               sourceAccountId === targetAccountId ||
                               isLoading

  const handleValidation = useCallback(async () => {
    if (!isValidationDisabled) {
      await onValidateAccounts()
    }
  }, [isValidationDisabled, onValidateAccounts])

  const renderAccountInfo = (account: Account | null, type: 'source' | 'target') => {
    if (!account) return null

    return (
      <div className={cn(
        "mt-2 p-3 rounded-md border",
        type === 'source' ? "bg-blue-50 border-blue-200" : "bg-green-50 border-green-200"
      )}>
        <div className="text-sm font-medium">
          Account: {account.accountNumber}
        </div>
        <div className="text-sm text-gray-600">
          Balance: ${account.balance.toLocaleString()}
        </div>
        <div className="text-sm text-gray-600">
          Status: <span className={cn(
            "font-medium",
            account.status === 'active' ? "text-green-600" : "text-orange-600"
          )}>
            {account.status}
          </span>
        </div>
      </div>
    )
  }

  const renderValidationResults = () => {
    if (!validationState) return null

    const hasErrors = validationState.isClosureInProgress || 
                      validationState.networkStatus !== 'online' ||
                      validationState.validationStatus !== 'valid'

    return (
      <div className={cn(
        "mt-4 p-3 rounded-md border",
        hasErrors ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"
      )}>
        <div className="text-sm font-medium mb-2">
          Validation Results
        </div>
        
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Closure in Progress:</span>
            <span className={cn(
              "font-medium",
              validationState.isClosureInProgress ? "text-red-600" : "text-green-600"
            )}>
              {validationState.isClosureInProgress ? "Yes" : "No"}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span>Network Status:</span>
            <span className={cn(
              "font-medium",
              validationState.networkStatus === 'online' ? "text-green-600" : "text-orange-600"
            )}>
              {validationState.networkStatus}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span>Validation Status:</span>
            <span className={cn(
              "font-medium",
              validationState.validationStatus === 'valid' ? "text-green-600" : "text-red-600"
            )}>
              {validationState.validationStatus}
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Source Account ID
          </label>
          <Input
            value={sourceAccountId}
            onChange={(e) => onSourceAccountChange(e.target.value)}
            placeholder="Enter source account ID"
            disabled={isLoading}
            className="w-full"
          />
          {renderAccountInfo(sourceAccount, 'source')}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Target Account ID
          </label>
          <Input
            value={targetAccountId}
            onChange={(e) => onTargetAccountChange(e.target.value)}
            placeholder="Enter target account ID"
            disabled={isLoading}
            className="w-full"
          />
          {renderAccountInfo(targetAccount, 'target')}
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <Button
          onClick={handleValidation}
          disabled={isValidationDisabled}
          className="w-full"
        >
          {isLoading ? "Validating..." : "Validate Accounts"}
        </Button>

        {renderValidationResults()}
      </div>
    </div>
  )
}