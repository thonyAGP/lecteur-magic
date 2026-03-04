import { useCallback, useEffect, useState } from "react"
import { useAccountMergeStore } from "@/stores/accountMergeStore"
import { ScreenLayout } from "@/components/layout"
import { Button, Dialog, Input } from "@/components/ui"
import { cn } from "@/lib/utils"

export const AccountMergePage = () => {
  const {
    mergeHistories,
    sourceAccount,
    targetAccount,
    validationState,
    isLoading,
    error,
    mergeProgress,
    currentStep,
    validateMergeConditions,
    executeMerge,
    createMergeHistory,
    rollbackMerge,
    printMergeTicket,
    reset
  } = useAccountMergeStore()

  const [sourceAccountId, setSourceAccountId] = useState("")
  const [targetAccountId, setTargetAccountId] = useState("")
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showResultDialog, setShowResultDialog] = useState(false)

  useEffect(() => {
    return () => {
      reset()
    }
  }, [reset])

  useEffect(() => {
    if (currentStep === 'completed') {
      setShowResultDialog(true)
    }
  }, [currentStep])

  const handleValidateAccounts = useCallback(async () => {
    if (!sourceAccountId.trim() || !targetAccountId.trim()) {
      return
    }
    
    if (sourceAccountId === targetAccountId) {
      return
    }

    await validateMergeConditions(sourceAccountId.trim(), targetAccountId.trim())
  }, [sourceAccountId, targetAccountId, validateMergeConditions])

  const handleExecuteMerge = useCallback(async () => {
    setShowConfirmDialog(false)
    await executeMerge(sourceAccountId.trim(), targetAccountId.trim())
  }, [sourceAccountId, targetAccountId, executeMerge])

  const handlePrintTicket = useCallback(async () => {
    if (mergeHistories.length > 0) {
      await printMergeTicket(mergeHistories[0].id)
    }
  }, [mergeHistories, printMergeTicket])

  const handleCancel = useCallback(() => {
    setShowConfirmDialog(false)
    reset()
  }, [reset])

  const handleClose = useCallback(() => {
    setShowResultDialog(false)
    reset()
    setSourceAccountId("")
    setTargetAccountId("")
  }, [reset])

  const getStepTitle = (step: string) => {
    switch (step) {
      case 'validation': return 'Account Validation'
      case 'validated': return 'Ready to Merge'
      case 'executing': return 'Executing Merge'
      case 'completed': return 'Merge Completed'
      default: return step
    }
  }

  const getValidationStatusColor = (status: string) => {
    switch (status) {
      case 'V': return 'text-red-600'
      case 'P': return 'text-green-600'
      case 'A': return 'text-yellow-600'
      default: return 'text-gray-600'
    }
  }

  const getNetworkStatusColor = (status: string) => {
    switch (status) {
      case 'R': return 'text-red-600'
      case 'A': return 'text-green-600'
      case 'I': return 'text-yellow-600'
      default: return 'text-gray-600'
    }
  }

  const canProceedToMerge = validationState && 
    validationState.validationStatus !== 'V' && 
    validationState.networkStatus !== 'R' &&
    !validationState.isClosureInProgress

  return (
    <ScreenLayout className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Account Merge</h1>

        <div className="grid gap-6">
          {/* Account Selection Section */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4">Account Selection</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Source Account</label>
                <Input
                  value={sourceAccountId}
                  onChange={(e) => setSourceAccountId(e.target.value)}
                  placeholder="Enter source account number"
                  disabled={isLoading || currentStep === 'executing'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Target Account</label>
                <Input
                  value={targetAccountId}
                  onChange={(e) => setTargetAccountId(e.target.value)}
                  placeholder="Enter target account number"
                  disabled={isLoading || currentStep === 'executing'}
                />
              </div>
            </div>
            <div className="mt-4">
              <Button
                onClick={handleValidateAccounts}
                disabled={!sourceAccountId.trim() || !targetAccountId.trim() || isLoading || sourceAccountId === targetAccountId}
              >
                {isLoading && currentStep === 'validation' ? 'Validating...' : 'Validate Accounts'}
              </Button>
            </div>
          </div>

          {/* Validation Status Section */}
          {validationState && (
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-lg font-semibold mb-4">Validation Status</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Closure Status</h3>
                  <div className={cn(
                    "flex items-center gap-2 p-3 rounded-md",
                    validationState.isClosureInProgress ? "bg-red-50" : "bg-green-50"
                  )}>
                    <div className={cn(
                      "w-3 h-3 rounded-full",
                      validationState.isClosureInProgress ? "bg-red-500" : "bg-green-500"
                    )} />
                    <span className={validationState.isClosureInProgress ? "text-red-700" : "text-green-700"}>
                      {validationState.isClosureInProgress ? "Closure in Progress" : "No Active Closure"}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Network Status</h3>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <span className={getNetworkStatusColor(validationState.networkStatus)}>
                      Status: {validationState.networkStatus}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="font-medium mb-2">Validation Result</h3>
                <div className={cn(
                  "p-4 rounded-md border",
                  canProceedToMerge ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                )}>
                  <div className={cn(
                    "font-medium",
                    canProceedToMerge ? "text-green-800" : "text-red-800"
                  )}>
                    {canProceedToMerge ? "✓ Merge can proceed" : "✗ Merge cannot proceed"}
                  </div>
                  <div className={getValidationStatusColor(validationState.validationStatus)}>
                    Validation Status: {validationState.validationStatus}
                  </div>
                </div>
              </div>

              {sourceAccount && targetAccount && (
                <div className="mt-4 grid md:grid-cols-2 gap-4">
                  <div className="p-3 bg-blue-50 rounded-md">
                    <h4 className="font-medium text-blue-800">Source Account</h4>
                    <div className="text-sm text-blue-700">
                      <div>Number: {sourceAccount.accountNumber}</div>
                      <div>Balance: ${sourceAccount.balance.toFixed(2)}</div>
                      <div>Status: {sourceAccount.status}</div>
                    </div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-md">
                    <h4 className="font-medium text-green-800">Target Account</h4>
                    <div className="text-sm text-green-700">
                      <div>Number: {targetAccount.accountNumber}</div>
                      <div>Balance: ${targetAccount.balance.toFixed(2)}</div>
                      <div>Status: {targetAccount.status}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Merge Execution Section */}
          {validationState && (
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-lg font-semibold mb-4">Merge Execution</h2>
              
              {(currentStep === 'executing' || mergeProgress > 0) && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span>{mergeProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${mergeProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="mb-4">
                <div className="text-sm font-medium text-gray-700">Current Step:</div>
                <div className="text-lg text-blue-600">{getStepTitle(currentStep)}</div>
              </div>

              <div className="flex gap-3">
                {canProceedToMerge && currentStep !== 'executing' && currentStep !== 'completed' && (
                  <Button
                    onClick={() => setShowConfirmDialog(true)}
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Execute Merge
                  </Button>
                )}
                
                {currentStep === 'executing' && (
                  <Button
                    onClick={handleCancel}
                    disabled={mergeProgress > 50}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="text-red-800 font-medium">Error</div>
              <div className="text-red-700">{error}</div>
            </div>
          )}

          {/* Recent Merge History */}
          {mergeHistories.length > 0 && (
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-lg font-semibold mb-4">Recent Merge History</h2>
              <div className="space-y-3">
                {mergeHistories.slice(0, 5).map((history) => (
                  <div key={history.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <div>
                      <div className="font-medium">
                        {history.sourceAccount} → {history.targetAccount}
                      </div>
                      <div className="text-sm text-gray-600">
                        {history.mergeDate.toLocaleDateString()} by {history.operator}
                      </div>
                    </div>
                    <div className={cn(
                      "px-2 py-1 rounded text-sm",
                      history.status === 'COMPLETED' ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    )}>
                      {history.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Confirmation Dialog */}
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Confirm Merge</h3>
            <p className="mb-4">
              Are you sure you want to merge account {sourceAccountId} into account {targetAccountId}?
              This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleExecuteMerge} className="bg-red-600 hover:bg-red-700">
                Confirm Merge
              </Button>
            </div>
          </div>
        </Dialog>

        {/* Result Dialog */}
        <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Merge Completed</h3>
            
            {mergeHistories.length > 0 && (
              <div className="mb-4 p-4 bg-green-50 rounded-md">
                <div className="text-green-800 font-medium mb-2">✓ Merge Successful</div>
                <div className="text-sm space-y-1">
                  <div>Merge ID: {mergeHistories[0].id}</div>
                  <div>Source Account: {mergeHistories[0].sourceAccount}</div>
                  <div>Target Account: {mergeHistories[0].targetAccount}</div>
                  <div>Date: {mergeHistories[0].mergeDate.toLocaleString()}</div>
                  <div>Operator: {mergeHistories[0].operator}</div>
                </div>
              </div>
            )}

            {targetAccount && (
              <div className="mb-4 p-4 bg-blue-50 rounded-md">
                <div className="text-blue-800 font-medium mb-2">Final Account Balance</div>
                <div className="text-lg font-bold text-blue-900">
                  ${targetAccount.balance.toFixed(2)}
                </div>
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={handlePrintTicket}>
                Print Ticket
              </Button>
              <Button onClick={handleClose}>
                Close
              </Button>
            </div>
          </div>
        </Dialog>
      </div>
    </ScreenLayout>
  )
}