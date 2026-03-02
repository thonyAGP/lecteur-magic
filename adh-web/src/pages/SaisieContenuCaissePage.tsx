import { useCallback, useEffect } from "react"
import { ScreenLayout } from "@/components/layout"
import { Button, Dialog, Input } from "@/components/ui"
import { cn } from "@/lib/utils"
import { useSaisieContenuCaisseStore } from "@/stores/saisieContenuCaisseStore"
import type { PvComptable } from "@/types/saisieContenuCaisse"

export const SaisieContenuCaissePage = () => {
  const {
    remise,
    montantsSaisis,
    montantsComptes,
    ecarts,
    anomalies,
    stocksArticles,
    devisesSession,
    isLoading,
    error,
    validationErrors,
    coffre2Ouvert,
    uniBI,
    initialiserRemise,
    saisirMontant,
    validerRemise,
    calculerEcarts,
    chargerMontantsComptes,
    genererPvComptable,
    mettreAJourStocks,
    reset
  } = useSaisieContenuCaisseStore()

  const handleInitialiser = useCallback(async () => {
    await initialiserRemise("SOC001", "EUR", "REMISE_JOURNALIERE")
  }, [initialiserRemise])

  const handleSaisirMontant = useCallback(async (type: string, value: string) => {
    const montant = parseFloat(value) || 0
    await saisirMontant(type, montant)
    calculerEcarts()
  }, [saisirMontant, calculerEcarts])

  const handleValiderRemise = useCallback(async () => {
    await validerRemise()
  }, [validerRemise])

  const handleAnnuler = useCallback(() => {
    reset()
  }, [reset])

  const handleReinitialiser = useCallback(() => {
    reset()
  }, [reset])

  useEffect(() => {
    handleInitialiser()

    return () => {
      reset()
    }
  }, [handleInitialiser, reset])

  const hasEcarts = Object.values(ecarts).some(ecart => Math.abs(ecart) > 0.01)
  const hasAnomalies = anomalies.length > 0

  if (isLoading) {
    return (
      <ScreenLayout className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement des données de caisse...</p>
        </div>
      </ScreenLayout>
    )
  }

  if (error) {
    return (
      <ScreenLayout className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Erreur de chargement</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={handleInitialiser}>Réessayer</Button>
        </div>
      </ScreenLayout>
    )
  }

  return (
    <ScreenLayout className="p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Remise en caisse</h1>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Société</label>
              <div className="text-sm text-gray-600">{remise?.societe || "SOC001"}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Devise locale</label>
              <div className="text-sm text-gray-600">{remise?.deviseLocale || "EUR"}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Montants comptés (lecture seule)</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monnaie comptée</label>
              <div className="text-sm font-mono text-gray-900 bg-gray-50 p-2 rounded border">
                {(montantsComptes.monnaie || 0).toFixed(2)} €
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Produits comptés</label>
              <div className="text-sm font-mono text-gray-900 bg-gray-50 p-2 rounded border">
                {(montantsComptes.produits || 0).toFixed(2)} €
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cartes comptées</label>
              <div className="text-sm font-mono text-gray-900 bg-gray-50 p-2 rounded border">
                {(montantsComptes.cartes || 0).toFixed(2)} €
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Chèques comptés</label>
              <div className="text-sm font-mono text-gray-900 bg-gray-50 p-2 rounded border">
                {(montantsComptes.cheques || 0).toFixed(2)} €
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">OD comptés</label>
              <div className="text-sm font-mono text-gray-900 bg-gray-50 p-2 rounded border">
                {(montantsComptes.od || 0).toFixed(2)} €
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Devises comptées</label>
              <div className="text-sm font-mono text-gray-900 bg-gray-50 p-2 rounded border">
                {(montantsComptes.devises || 0).toFixed(2)} €
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Saisie des versements</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Versement monnaie</label>
              <Input
                type="number"
                step="0.01"
                value={montantsSaisis.monnaie?.toString() || ""}
                onChange={(e) => handleSaisirMontant("monnaie", e.target.value)}
                placeholder="0.00"
                className={cn(validationErrors.monnaie && "border-red-500")}
              />
              {validationErrors.monnaie && (
                <p className="text-sm text-red-600 mt-1">{validationErrors.monnaie}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Versement produits</label>
              <Input
                type="number"
                step="0.01"
                value={montantsSaisis.produits?.toString() || ""}
                onChange={(e) => handleSaisirMontant("produits", e.target.value)}
                placeholder="0.00"
                className={cn(validationErrors.produits && "border-red-500")}
              />
              {validationErrors.produits && (
                <p className="text-sm text-red-600 mt-1">{validationErrors.produits}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Versement cartes</label>
              <Input
                type="number"
                step="0.01"
                value={montantsSaisis.cartes?.toString() || ""}
                onChange={(e) => handleSaisirMontant("cartes", e.target.value)}
                placeholder="0.00"
                className={cn(validationErrors.cartes && "border-red-500")}
              />
              {validationErrors.cartes && (
                <p className="text-sm text-red-600 mt-1">{validationErrors.cartes}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Versement chèques</label>
              <Input
                type="number"
                step="0.01"
                value={montantsSaisis.cheques?.toString() || ""}
                onChange={(e) => handleSaisirMontant("cheques", e.target.value)}
                placeholder="0.00"
                className={cn(validationErrors.cheques && "border-red-500")}
              />
              {validationErrors.cheques && (
                <p className="text-sm text-red-600 mt-1">{validationErrors.cheques}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Versement OD</label>
              <Input
                type="number"
                step="0.01"
                value={montantsSaisis.od?.toString() || ""}
                onChange={(e) => handleSaisirMontant("od", e.target.value)}
                placeholder="0.00"
                className={cn(validationErrors.od && "border-red-500")}
              />
              {validationErrors.od && (
                <p className="text-sm text-red-600 mt-1">{validationErrors.od}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Versement devises</label>
              <Input
                type="number"
                step="0.01"
                value={montantsSaisis.devises?.toString() || ""}
                onChange={(e) => handleSaisirMontant("devises", e.target.value)}
                placeholder="0.00"
                className={cn(validationErrors.devises && "border-red-500")}
              />
              {validationErrors.devises && (
                <p className="text-sm text-red-600 mt-1">{validationErrors.devises}</p>
              )}
            </div>
          </div>
        </div>

        {hasEcarts && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Écarts détectés</h2>
            {hasAnomalies && (
              <div className="bg-orange-50 border border-orange-200 rounded-md p-4 mb-4">
                <div className="flex">
                  <svg className="w-5 h-5 text-orange-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="text-sm font-medium text-orange-800">Anomalies détectées</h3>
                    <p className="text-sm text-orange-700 mt-1">Des écarts ont été identifiés dans la remise.</p>
                  </div>
                </div>
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type paiement
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Montant compté
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Montant versé
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Écart
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(ecarts).map(([type, ecart]) => {
                    if (Math.abs(ecart) < 0.01) return null
                    return (
                      <tr key={type}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                          {type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                          {(montantsComptes[type] || 0).toFixed(2)} €
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                          {(montantsSaisis[type] || 0).toFixed(2)} €
                        </td>
                        <td className={cn(
                          "px-6 py-4 whitespace-nowrap text-sm font-mono font-semibold",
                          ecart > 0 ? "text-green-600" : "text-red-600"
                        )}>
                          {ecart > 0 ? "+" : ""}{ecart.toFixed(2)} €
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <Button variant="ghost" onClick={handleReinitialiser}>
            Réinitialiser
          </Button>
          <Button variant="secondary" onClick={handleAnnuler}>
            Annuler
          </Button>
          <Button onClick={handleValiderRemise} disabled={isLoading}>
            Valider la remise
          </Button>
        </div>
      </div>
    </ScreenLayout>
  )
}