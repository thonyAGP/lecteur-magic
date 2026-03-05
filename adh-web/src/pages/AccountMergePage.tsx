import { useCallback, useEffect, useState } from "react";
import { useAccountMergeStore } from "@/stores/accountMergeStore";
import { ScreenLayout } from "@/components/layout";
import { Button, Input } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { BusinessRulesResult } from "@/types/accountMerge";

const getValidationStepStatuses = (currentStep: string) => ({
  isValidated: currentStep === "validated" || currentStep === "transferring" || currentStep === "updating" || currentStep === "finalizing" || currentStep === "completed",
  isMergeInProgress: currentStep === "transferring" || currentStep === "updating" || currentStep === "finalizing",
  isMergeCompleted: currentStep === "completed"
});

const ValidationStatusIndicator = ({ isValid, label }: { isValid: boolean; label: string }) => (
  <div className="flex items-center gap-2">
    <div className={cn("h-3 w-3 rounded-full", isValid ? "bg-success" : "bg-destructive")} />
    <span className="text-sm">{label}</span>
  </div>
);

const ProgressBar = ({ progress }: { progress: number }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-sm">
      <span>Progress</span>
      <span>{progress}%</span>
    </div>
    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
      <div
        className="h-full bg-primary transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  </div>
);

const TaskProgressIndicator = ({ currentTask, totalTasks }: { currentTask: number; totalTasks: number }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-sm">
      <span>Task Progress</span>
      <span>{currentTask} / {totalTasks}</span>
    </div>
    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
      <div
        className="h-full bg-secondary transition-all duration-300"
        style={{ width: `${(currentTask / totalTasks) * 100}%` }}
      />
    </div>
  </div>
);

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
    currentTask,
    validateMergeConditions,
    executeMerge,
    printMergeTicket,
    reset,
    checkBusinessRules,
    validateNetworkStatus,
    validateClosureBlocking,
    evaluateBusinessRule005,
    evaluateBusinessRule006,
    evaluateBusinessRule007,
    evaluateBusinessRule008,
    evaluateBusinessRule009,
    evaluateBusinessRule010,
    evaluateBusinessRule011,
    evaluateBusinessRule012,
    evaluateBusinessRule013,
    validateAllBusinessRules,
  } = useAccountMergeStore();

  const [sourceAccountInput, setSourceAccountInput] = useState("");
  const [targetAccountInput, setTargetAccountInput] = useState("");
  const [businessRulesResult, setBusinessRulesResult] = useState<BusinessRulesResult | null>(null);
  const [showDetailedRules, setShowDetailedRules] = useState(false);

  const { isValidated, isMergeInProgress, isMergeCompleted } = getValidationStepStatuses(currentStep);

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  const evaluateAllBusinessRules = useCallback((): BusinessRulesResult | null => {
    if (!sourceAccount || !targetAccount) {
      return null;
    }

    // RM-005: W0 chrono histo [BA] different de 'F'
    const rm005 = evaluateBusinessRule005(sourceAccount);

    // RM-006: Negation de (W0 code LOG existe [BB]) (condition inversee)
    const rm006 = evaluateBusinessRule006(sourceAccount);

    // RM-007: Si W0 Filiation garantie ... [BF] alors IF (W0 reprise confirmee [BD] sinon 'RETRY','DONE'),'PASSED')
    const rm007 = evaluateBusinessRule007(sourceAccount);

    // RM-008: Negation de (W0 reprise confirmee [BD]) (condition inversee)
    const rm008 = evaluateBusinessRule008(sourceAccount);

    // RM-009: Negation de (W0 Compte remplace à l... [BI]) (condition inversee)
    const rm009 = evaluateBusinessRule009(sourceAccount);

    // RM-010: Condition composite: [BK]=6 OR P0 Reprise Auto [I]
    const rm010 = evaluateBusinessRule010(sourceAccount, targetAccount);

    // RM-011: Condition toujours vraie (flag actif)
    const rm011 = evaluateBusinessRule011();

    // RM-012: Negation de P0.Sans interface [J] (condition inversee)
    const rm012 = evaluateBusinessRule012(targetAccount);

    // RM-013: Negation de VG78 (condition inversee)
    const rm013 = evaluateBusinessRule013(validationState);

    return {
      rm005: { passed: rm005, description: "Chrono histo different de 'F'" },
      rm006: { passed: rm006, description: "Code LOG n'existe pas" },
      rm007: { passed: rm007 === 'PASSED', status: rm007, description: "Filiation garantie validation" },
      rm008: { passed: rm008, description: "Reprise non confirmee" },
      rm009: { passed: rm009, description: "Compte non remplace" },
      rm010: { passed: rm010, description: "Status BK=6 ou Reprise Auto" },
      rm011: { passed: rm011, description: "Flag actif" },
      rm012: { passed: rm012, description: "Interface disponible" },
      rm013: { passed: rm013, description: "VG78 non active" }
    };
  }, [
    sourceAccount,
    targetAccount,
    validationState,
    evaluateBusinessRule005,
    evaluateBusinessRule006,
    evaluateBusinessRule007,
    evaluateBusinessRule008,
    evaluateBusinessRule009,
    evaluateBusinessRule010,
    evaluateBusinessRule011,
    evaluateBusinessRule012,
    evaluateBusinessRule013
  ]);

  const validateBusinessRulesFlow = useCallback(async (sourceAccNum: string, targetAccNum: string) => {
    try {
      await validateNetworkStatus(sourceAccNum, targetAccNum);
      await validateClosureBlocking(sourceAccNum, targetAccNum);
      
      if (checkBusinessRules) {
        await checkBusinessRules(sourceAccNum, targetAccNum);
      }

      if (validateAllBusinessRules) {
        const storeResult = await validateAllBusinessRules(sourceAccNum, targetAccNum);
        setBusinessRulesResult(storeResult);
        return storeResult;
      }
      
      const rulesResult = evaluateAllBusinessRules();
      setBusinessRulesResult(rulesResult);
      
      return rulesResult;
    } catch (err) {
      console.error("Business rules validation failed:", err);
      throw err;
    }
  }, [
    validateNetworkStatus,
    validateClosureBlocking,
    checkBusinessRules,
    validateAllBusinessRules,
    evaluateAllBusinessRules
  ]);

  const handleValidateAccounts = useCallback(async () => {
    if (!sourceAccountInput || !targetAccountInput) {
      return;
    }
    try {
      await validateMergeConditions(sourceAccountInput, targetAccountInput);
      await validateBusinessRulesFlow(sourceAccountInput, targetAccountInput);
    } catch (err) {
      console.error("Validation failed:", err);
    }
  }, [sourceAccountInput, targetAccountInput, validateMergeConditions, validateBusinessRulesFlow]);

  const checkAllRulesPassed = useCallback((rulesResult: BusinessRulesResult): boolean => {
    return Object.values(rulesResult).every(rule => rule.passed);
  }, []);

  const handleExecuteMerge = useCallback(async () => {
    if (!sourceAccount || !targetAccount) {
      return;
    }

    const rulesResult = businessRulesResult || evaluateAllBusinessRules();
    if (!rulesResult) {
      return;
    }

    if (!checkAllRulesPassed(rulesResult)) {
      console.error("Business rules validation failed - cannot proceed with merge");
      return;
    }

    try {
      await executeMerge(sourceAccount.accountNumber, targetAccount.accountNumber);
    } catch (err) {
      console.error("Merge execution failed:", err);
    }
  }, [sourceAccount, targetAccount, businessRulesResult, evaluateAllBusinessRules, checkAllRulesPassed, executeMerge]);

  const handlePrintTicket = useCallback(async () => {
    if (mergeHistories.length === 0) {
      return;
    }
    const latestMerge = mergeHistories[mergeHistories.length - 1];
    try {
      await printMergeTicket(latestMerge.id);
    } catch (err) {
      console.error("Print ticket failed:", err);
    }
  }, [mergeHistories, printMergeTicket]);

  const handleClose = useCallback(() => {
    reset();
    setSourceAccountInput("");
    setTargetAccountInput("");
    setBusinessRulesResult(null);
    setShowDetailedRules(false);
  }, [reset]);

  useEffect(() => {
    if (sourceAccount && targetAccount) {
      const rulesResult = evaluateAllBusinessRules();
      setBusinessRulesResult(rulesResult);
    }
  }, [sourceAccount, targetAccount, evaluateAllBusinessRules]);

  const totalTasks = 192;

  return (
    <ScreenLayout className="p-6">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Account Merge</h1>
          <p className="text-muted-foreground mt-2">Merge source account into target account (192 task workflow)</p>
        </div>

        {error && (
          <div className="rounded-lg bg-destructive/10 p-4 text-destructive border border-destructive/20">
            {error}
          </div>
        )}

        {!isValidated && (
          <div className="rounded-lg border bg-card p-6 space-y-4">
            <h2 className="text-xl font-semibold">Account Selection</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="sourceAccount" className="text-sm font-medium">
                  Source Account
                </label>
                <Input
                  id="sourceAccount"
                  value={sourceAccountInput}
                  onChange={(e) => setSourceAccountInput(e.target.value)}
                  placeholder="Enter source account number"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="targetAccount" className="text-sm font-medium">
                  Target Account
                </label>
                <Input
                  id="targetAccount"
                  value={targetAccountInput}
                  onChange={(e) => setTargetAccountInput(e.target.value)}
                  placeholder="Enter target account number"
                  disabled={isLoading}
                />
              </div>
            </div>
            <Button
              onClick={handleValidateAccounts}
              disabled={!sourceAccountInput || !targetAccountInput || isLoading}
              className="w-full"
            >
              {isLoading ? "Validating..." : "Validate Accounts"}
            </Button>
          </div>
        )}

        {isValidated && !isMergeCompleted && (
          <div className="rounded-lg border bg-card p-6 space-y-4">
            <h2 className="text-xl font-semibold">Validation Status</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="text-sm font-medium">Source Account</div>
                <div className="text-muted-foreground">
                  {sourceAccount?.accountNumber} - Balance: ${sourceAccount?.balance.toFixed(2)}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium">Target Account</div>
                <div className="text-muted-foreground">
                  {targetAccount?.accountNumber} - Balance: ${targetAccount?.balance.toFixed(2)}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <ValidationStatusIndicator
                isValid={!validationState?.isClosureInProgress}
                label={`Closure Status: ${validationState?.isClosureInProgress ? "In Progress" : "Not In Progress"}`}
              />
              <ValidationStatusIndicator
                isValid={validationState?.networkStatus !== "R"}
                label={`Network Status: ${validationState?.networkStatus}`}
              />
              <ValidationStatusIndicator
                isValid={validationState?.validationStatus === "PASSED"}
                label={`Validation Status: ${validationState?.validationStatus}`}
              />
            </div>
          </div>
        )}

        {businessRulesResult && isValidated && !isMergeCompleted && (
          <div className="rounded-lg border bg-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Business Rules Validation</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDetailedRules(!showDetailedRules)}
              >
                {showDetailedRules ? "Hide Details" : "Show Details"}
              </Button>
            </div>
            
            <div className="space-y-2">
              <ValidationStatusIndicator
                isValid={businessRulesResult.rm005.passed}
                label={`RM-005: ${businessRulesResult.rm005.description}`}
              />
              <ValidationStatusIndicator
                isValid={businessRulesResult.rm006.passed}
                label={`RM-006: ${businessRulesResult.rm006.description}`}
              />
              <ValidationStatusIndicator
                isValid={businessRulesResult.rm007.passed}
                label={`RM-007: ${businessRulesResult.rm007.description} (${businessRulesResult.rm007.status || 'N/A'})`}
              />
              <ValidationStatusIndicator
                isValid={businessRulesResult.rm008.passed}
                label={`RM-008: ${businessRulesResult.rm008.description}`}
              />
              <ValidationStatusIndicator
                isValid={businessRulesResult.rm009.passed}
                label={`RM-009: ${businessRulesResult.rm009.description}`}
              />
              <ValidationStatusIndicator
                isValid={businessRulesResult.rm010.passed}
                label={`RM-010: ${businessRulesResult.rm010.description}`}
              />
              <ValidationStatusIndicator
                isValid={businessRulesResult.rm011.passed}
                label={`RM-011: ${businessRulesResult.rm011.description}`}
              />
              <ValidationStatusIndicator
                isValid={businessRulesResult.rm012.passed}
                label={`RM-012: ${businessRulesResult.rm012.description}`}
              />
              <ValidationStatusIndicator
                isValid={businessRulesResult.rm013.passed}
                label={`RM-013: ${businessRulesResult.rm013.description}`}
              />
            </div>

            {showDetailedRules && (
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <h3 className="text-sm font-medium mb-2">Rule Details</h3>
                <div className="text-xs space-y-1 text-muted-foreground">
                  <div>RM-005: Validates chrono history field [BA] is not 'F'</div>
                  <div>RM-006: Ensures LOG code [BB] does not exist (inverted condition)</div>
                  <div>RM-007: Complex filiation guarantee validation with confirmation status</div>
                  <div>RM-008: Confirms reprise is not confirmed [BD] (inverted condition)</div>
                  <div>RM-009: Ensures account is not replaced [BI] (inverted condition)</div>
                  <div>RM-010: Composite condition: status BK=6 OR auto reprise enabled</div>
                  <div>RM-011: Always true flag for active processing</div>
                  <div>RM-012: Ensures interface is available [J] (inverted condition)</div>
                  <div>RM-013: Validates VG78 flag is not active (inverted condition)</div>
                </div>
              </div>
            )}
            
            <div className="mt-4">
              <ValidationStatusIndicator
                isValid={checkAllRulesPassed(businessRulesResult)}
                label="All Business Rules Status"
              />
            </div>
          </div>
        )}

        {isValidated && !isMergeCompleted && (
          <div className="rounded-lg border bg-card p-6 space-y-4">
            <h2 className="text-xl font-semibold">Merge Execution</h2>
            {isMergeInProgress && (
              <div className="space-y-4">
                <ProgressBar progress={mergeProgress} />
                <TaskProgressIndicator currentTask={currentTask} totalTasks={totalTasks} />
                <div className="text-sm text-muted-foreground">
                  Current Step: {currentStep} | Task: {currentTask}/{totalTasks}
                </div>
              </div>
            )}
            <div className="flex gap-2">
              <Button
                onClick={handleExecuteMerge}
                disabled={
                  isMergeInProgress || 
                  isLoading || 
                  currentStep !== "validated" || 
                  !businessRulesResult ||
                  !checkAllRulesPassed(businessRulesResult)
                }
                className="flex-1"
              >
                {isMergeInProgress ? "Executing..." : "Execute Merge"}
              </Button>
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isMergeInProgress}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {isMergeCompleted && (
          <div className="rounded-lg border bg-card p-6 space-y-4">
            <h2 className="text-xl font-semibold">Merge Completed</h2>
            <div className="rounded-lg bg-success/10 p-4 border border-success/20">
              <div className="font-medium text-success">Merge completed successfully!</div>
              <div className="text-sm text-muted-foreground mt-2">
                Account {sourceAccount?.accountNumber} has been merged into {targetAccount?.accountNumber}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Processed {totalTasks} tasks successfully
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handlePrintTicket} className="flex-1">
                Print Ticket
              </Button>
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
            </div>
          </div>
        )}
      </div>
    </ScreenLayout>
  );
};