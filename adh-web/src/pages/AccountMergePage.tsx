import { useCallback, useEffect, useState } from "react";
import { useAccountMergeStore } from "@/stores/accountMergeStore";
import { ScreenLayout } from "@/components/layout";
import { Button, Input } from "@/components/ui";
import { cn } from "@/lib/utils";

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
    printMergeTicket,
    reset,
    checkBusinessRules,
  } = useAccountMergeStore();

  const [sourceAccountInput, setSourceAccountInput] = useState("");
  const [targetAccountInput, setTargetAccountInput] = useState("");
  const [businessRulesResult, setBusinessRulesResult] = useState<{
    rm005: boolean;
    rm006: boolean;
    rm007: string;
    rm008: boolean;
    rm009: boolean;
    rm010: boolean;
    rm011: boolean;
    rm012: boolean;
    rm013: boolean;
  } | null>(null);

  const { isValidated, isMergeInProgress, isMergeCompleted } = getValidationStepStatuses(currentStep);

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  const evaluateBusinessRules = useCallback(() => {
    if (!sourceAccount || !targetAccount) {
      return null;
    }

    // RM-005: Condition: W0 chrono histo [BA] different de 'F'
    const rm005 = sourceAccount.chronoHisto !== 'F';

    // RM-006: Negation de (W0 code LOG existe [BB]) (condition inversee)
    const rm006 = !sourceAccount.logCodeExists;

    // RM-007: Si W0 Filiation garantie ... [BF] alors IF (W0 reprise confirmee [BD] sinon 'RETRY','DONE'),'PASSED')
    const rm007 = sourceAccount.filiationGarantie 
      ? (sourceAccount.repriseConfirmee ? 'PASSED' : 'DONE')
      : 'RETRY';

    // RM-008: Negation de (W0 reprise confirmee [BD]) (condition inversee)
    const rm008 = !sourceAccount.repriseConfirmee;

    // RM-009: Negation de (W0 Compte remplace à l... [BI]) (condition inversee)
    const rm009 = !sourceAccount.compteRemplace;

    // RM-010: Condition composite: [BK]=6 OR P0 Reprise Auto [I]
    const rm010 = sourceAccount.statusBK === 6 || targetAccount.repriseAuto;

    // RM-011: Condition toujours vraie (flag actif)
    const rm011 = true;

    // RM-012: Negation de P0.Sans interface [J] (condition inversee)
    const rm012 = !targetAccount.sansInterface;

    // RM-013: Negation de VG78 (condition inversee)
    const rm013 = !validationState?.vg78Flag;

    return {
      rm005,
      rm006,
      rm007,
      rm008,
      rm009,
      rm010,
      rm011,
      rm012,
      rm013
    };
  }, [sourceAccount, targetAccount, validationState]);

  const handleValidateAccounts = useCallback(async () => {
    if (!sourceAccountInput || !targetAccountInput) {
      return;
    }
    try {
      await validateMergeConditions(sourceAccountInput, targetAccountInput);
      const rulesResult = evaluateBusinessRules();
      setBusinessRulesResult(rulesResult);
      
      if (checkBusinessRules) {
        await checkBusinessRules(sourceAccountInput, targetAccountInput);
      }
    } catch (err) {
      console.error("Validation failed:", err);
    }
  }, [sourceAccountInput, targetAccountInput, validateMergeConditions, evaluateBusinessRules, checkBusinessRules]);

  const handleExecuteMerge = useCallback(async () => {
    if (!sourceAccount || !targetAccount) {
      return;
    }

    const rulesResult = evaluateBusinessRules();
    if (!rulesResult) {
      return;
    }

    const allRulesPassed = rulesResult.rm005 && 
                          rulesResult.rm006 && 
                          rulesResult.rm007 === 'PASSED' && 
                          rulesResult.rm008 && 
                          rulesResult.rm009 && 
                          rulesResult.rm010 && 
                          rulesResult.rm011 && 
                          rulesResult.rm012 && 
                          rulesResult.rm013;

    if (!allRulesPassed) {
      console.error("Business rules validation failed");
      return;
    }

    try {
      await executeMerge(sourceAccount.accountNumber, targetAccount.accountNumber);
    } catch (err) {
      console.error("Merge execution failed:", err);
    }
  }, [sourceAccount, targetAccount, executeMerge, evaluateBusinessRules]);

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
  }, [reset]);

  useEffect(() => {
    if (sourceAccount && targetAccount) {
      const rulesResult = evaluateBusinessRules();
      setBusinessRulesResult(rulesResult);
    }
  }, [sourceAccount, targetAccount, evaluateBusinessRules]);

  return (
    <ScreenLayout className="p-6">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Account Merge</h1>
          <p className="text-muted-foreground mt-2">Merge source account into target account</p>
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
            <h2 className="text-xl font-semibold">Business Rules Validation</h2>
            <div className="space-y-2">
              <ValidationStatusIndicator
                isValid={businessRulesResult.rm005}
                label="RM-005: Chrono histo different de 'F'"
              />
              <ValidationStatusIndicator
                isValid={businessRulesResult.rm006}
                label="RM-006: Code LOG n'existe pas"
              />
              <ValidationStatusIndicator
                isValid={businessRulesResult.rm007 === 'PASSED'}
                label={`RM-007: Filiation garantie status: ${businessRulesResult.rm007}`}
              />
              <ValidationStatusIndicator
                isValid={businessRulesResult.rm008}
                label="RM-008: Reprise non confirmee"
              />
              <ValidationStatusIndicator
                isValid={businessRulesResult.rm009}
                label="RM-009: Compte non remplace"
              />
              <ValidationStatusIndicator
                isValid={businessRulesResult.rm010}
                label="RM-010: Status BK=6 ou Reprise Auto"
              />
              <ValidationStatusIndicator
                isValid={businessRulesResult.rm011}
                label="RM-011: Flag actif"
              />
              <ValidationStatusIndicator
                isValid={businessRulesResult.rm012}
                label="RM-012: Interface disponible"
              />
              <ValidationStatusIndicator
                isValid={businessRulesResult.rm013}
                label="RM-013: VG78 non active"
              />
            </div>
          </div>
        )}

        {isValidated && !isMergeCompleted && (
          <div className="rounded-lg border bg-card p-6 space-y-4">
            <h2 className="text-xl font-semibold">Merge Execution</h2>
            {isMergeInProgress && (
              <div className="space-y-2">
                <ProgressBar progress={mergeProgress} />
                <div className="text-sm text-muted-foreground">
                  Current Step: {currentStep}
                </div>
              </div>
            )}
            <div className="flex gap-2">
              <Button
                onClick={handleExecuteMerge}
                disabled={isMergeInProgress || isLoading || currentStep !== "validated"}
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