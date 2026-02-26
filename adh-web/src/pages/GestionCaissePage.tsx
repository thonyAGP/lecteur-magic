import { useCallback, useEffect } from "react"
import { ScreenLayout } from "@/components/layout"
import { Button, Dialog, Input } from "@/components/ui"
import { cn } from "@/lib/utils"
import { useGestionCaisseStore } from "@/stores/gestionCaisseStore"

export const GestionCaissePage = () => {
  const {
    sessionActive,
    parametres,
    sessionsConcurrentes,
    mouvements,
    historique,
    dateComptable,
    isLoading,
    error,
    showHistoriqueDialog,
    showConsultationDialog,
    selectedSessionId,
    chargerDonnees,
    ouvrirSession,
    fermerSession,
    apportCoffre,
    apportProduit,
    remiseCoffre,
    ouvrirHistorique,
    fermerHistorique,
    ouvrirConsultation,
    fermerConsultation,
    reimprimer,
    reset,
    setSelectedSessionId
  } = useGestionCaisseStore()

  const handleOuvrirSession = useCallback(async () => {
    await ouvrirSession(500.00)
  }, [ouvrirSession])

  const handleFermerSession = useCallback(async () => {
    if (sessionActive) {
      await fermerSession(sessionActive.sessionId, 485.50)
    }
  }, [sessionActive, fermerSession])

  const handleApportCoffre = useCallback(async () => {
    if (sessionActive) {
      await apportCoffre(sessionActive.sessionId, 200.00, "EUR")
    }
  }, [sessionActive, apportCoffre])

  const handleApportProduit = useCallback(async () => {
    if (sessionActive) {
      await apportProduit(sessionActive.sessionId, 150.00, "USD")
    }
  }, [sessionActive, apportProduit])

  const handleRemiseCoffre = useCallback(async () => {
    if (sessionActive) {
      await remiseCoffre(sessionActive.sessionId, 100.00, "EUR")
    }
  }, [sessionActive, remiseCoffre])

  const handleConsulterHistorique = useCallback(() => {
    ouvrirHistorique()
  }, [ouvrirHistorique])

  const handleConsultation = useCallback(() => {
    ouvrirConsultation()
  }, [ouvrirConsultation])

  const handleReimprimer = useCallback(async () => {
    if (sessionActive) {
      await reimprimer(sessionActive.sessionId)
    }
  }, [sessionActive, reimprimer])

  const handleConsulterSession = useCallback(async (sessionId: number) => {
    setSelectedSessionId(sessionId)
  }, [setSelectedSessionId])

  useEffect(() => {
    const loadData = async () => {
      await chargerDonnees()
    }
    
    loadData()

    return () => {
      reset()
    }
  }, [chargerDonnees, reset])

  const montantActuel = sessionActive 
    ? sessionActive.montantOuverture + mouvements
        .filter(m => m.sessionId === sessionActive.sessionId)
        .reduce((acc, m) => acc + m.montant, 0)
    : 0

  const ecart = sessionActive?.montantFermeture 
    ? (sessionActive.montantFermeture - sessionActive.montantOuverture)
    : null

  const integriteCoffre = sessionsConcurrentes.length === 0

  if (isLoading) {
    return (
      <ScreenLayout className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Chargement des données de caisse...</div>
        </div>
      </ScreenLayout>
    )
  }

  if (error) {
    return (
      <ScreenLayout className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">Erreur: {error}</div>
        </div>
      </ScreenLayout>
    )
  }

  return (
    <ScreenLayout className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Opérateur
              </label>
              <div className="text-lg font-semibold text-gray-900">
                {sessionActive?.operateurNom || "Aucune session active"}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date comptable
              </label>
              <div className="text-lg font-semibold text-gray-900">
                {dateComptable?.date.toLocaleDateString() || "Non définie"}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Statut session
              </label>
              <div className={cn(
                "text-lg font-semibold px-3 py-1 rounded-md inline-block",
                sessionActive?.statut === "OUVERT" ? "bg-green-100 text-green-800" :
                sessionActive?.statut === "FERME" ? "bg-gray-100 text-gray-800" :
                sessionActive?.statut === "EN_CLOTURE" ? "bg-yellow-100 text-yellow-800" :
                "bg-red-100 text-red-800"
              )}>
                {sessionActive?.statut || "INACTIF"}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Montants</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ouverture
                </label>
                <div className="text-xl font-bold text-blue-600">
                  {sessionActive?.montantOuverture?.toFixed(2) || "0.00"} €
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Actuel
                </label>
                <div className="text-xl font-bold text-green-600">
                  {montantActuel.toFixed(2)} €
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fermeture
                </label>
                <div className="text-xl font-bold text-gray-600">
                  {sessionActive?.montantFermeture?.toFixed(2) || "—"} €
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Écart
                </label>
                <div className={cn(
                  "text-xl font-bold",
                  ecart === null ? "text-gray-400" :
                  ecart > 0 ? "text-green-600" : "text-red-600"
                )}>
                  {ecart !== null ? `${ecart.toFixed(2)} €` : "—"}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Alertes</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Sessions concurrentes
                </span>
                <span className={cn(
                  "px-2 py-1 rounded-full text-xs font-medium",
                  sessionsConcurrentes.length > 0 
                    ? "bg-red-100 text-red-800" 
                    : "bg-green-100 text-green-800"
                )}>
                  {sessionsConcurrentes.length}
                </span>
              </div>
              {sessionsConcurrentes.map((session) => (
                <div key={session.sessionId} className="text-sm text-gray-600">
                  {session.posteId} - {session.operateurNom}
                </div>
              ))}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Intégrité coffre
                </span>
                <span className={cn(
                  "px-2 py-1 rounded-full text-xs font-medium",
                  integriteCoffre 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"
                )}>
                  {integriteCoffre ? "OK" : "ERREUR"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
          <div className="grid grid-cols-4 gap-3">
            <Button
              onClick={handleOuvrirSession}
              disabled={!!sessionActive}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Ouvrir session
            </Button>
            <Button
              onClick={handleFermerSession}
              disabled={!sessionActive || sessionActive.statut !== "OUVERT"}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Fermer session
            </Button>
            <Button
              onClick={handleApportCoffre}
              disabled={!sessionActive || sessionActive.statut !== "OUVERT"}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Apport coffre
            </Button>
            <Button
              onClick={handleApportProduit}
              disabled={!sessionActive || sessionActive.statut !== "OUVERT"}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Apport produit
            </Button>
            <Button
              onClick={handleRemiseCoffre}
              disabled={!sessionActive || sessionActive.statut !== "OUVERT"}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Remise coffre
            </Button>
            <Button
              onClick={handleConsulterHistorique}
              className="bg-gray-600 hover:bg-gray-700 text-white"
            >
              Historique
            </Button>
            <Button
              onClick={handleConsultation}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Consultation
            </Button>
            <Button
              onClick={handleReimprimer}
              disabled={!sessionActive}
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              Réimprimer
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Mouvements de caisse
          </h3>
          {mouvements.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucun mouvement enregistré
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-3 font-medium text-gray-700">
                      Date/Heure
                    </th>
                    <th className="text-left py-2 px-3 font-medium text-gray-700">
                      Type
                    </th>
                    <th className="text-left py-2 px-3 font-medium text-gray-700">
                      Devise
                    </th>
                    <th className="text-right py-2 px-3 font-medium text-gray-700">
                      Montant
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mouvements.map((mouvement) => (
                    <tr key={mouvement.mouvementId} className="border-b border-gray-100">
                      <td className="py-2 px-3 text-sm text-gray-900">
                        {mouvement.dateHeure.toLocaleString()}
                      </td>
                      <td className="py-2 px-3">
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          mouvement.type === "APPORT" ? "bg-green-100 text-green-800" :
                          mouvement.type === "REMISE" ? "bg-red-100 text-red-800" :
                          "bg-blue-100 text-blue-800"
                        )}>
                          {mouvement.type}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-sm text-gray-900">
                        {mouvement.deviseCode}
                      </td>
                      <td className="py-2 px-3 text-sm text-gray-900 text-right font-medium">
                        {mouvement.montant.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <Dialog open={showHistoriqueDialog} onOpenChange={fermerHistorique}>
          <div className="max-w-4xl mx-auto bg-white rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Historique des sessions
            </h2>
            {historique.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Aucune session dans l'historique
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-3 font-medium text-gray-700">
                        Session
                      </th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">
                        Opérateur
                      </th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">
                        Ouverture
                      </th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">
                        Fermeture
                      </th>
                      <th className="text-left py-2 px-3 font-medium text-gray-700">
                        Statut
                      </th>
                      <th className="text-right py-2 px-3 font-medium text-gray-700">
                        Écart
                      </th>
                      <th className="text-center py-2 px-3 font-medium text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {historique.map((session) => (
                      <tr key={session.sessionId} className="border-b border-gray-100">
                        <td className="py-2 px-3 text-sm text-gray-900">
                          {session.sessionId}
                        </td>
                        <td className="py-2 px-3 text-sm text-gray-900">
                          {session.operateurNom}
                        </td>
                        <td className="py-2 px-3 text-sm text-gray-900">
                          {session.dateOuverture.toLocaleString()}
                        </td>
                        <td className="py-2 px-3 text-sm text-gray-900">
                          {session.dateFermeture?.toLocaleString() || "—"}
                        </td>
                        <td className="py-2 px-3">
                          <span className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium",
                            session.statut === "OUVERT" ? "bg-green-100 text-green-800" :
                            session.statut === "FERME" ? "bg-gray-100 text-gray-800" :
                            "bg-yellow-100 text-yellow-800"
                          )}>
                            {session.statut}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-sm text-gray-900 text-right">
                          {session.ecart !== null ? `${session.ecart.toFixed(2)} €` : "—"}
                        </td>
                        <td className="py-2 px-3 text-center">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleConsulterSession(session.sessionId)}
                          >
                            Consulter
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="mt-4 flex justify-end">
              <Button onClick={fermerHistorique}>
                Fermer
              </Button>
            </div>
          </div>
        </Dialog>

        <Dialog open={showConsultationDialog} onOpenChange={fermerConsultation}>
          <div className="max-w-2xl mx-auto bg-white rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Consultation de session
            </h2>
            {selectedSessionId && (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">
                    Session #{selectedSessionId}
                  </h3>
                  <div className="text-sm text-gray-600">
                    Détails de la session sélectionnée
                  </div>
                </div>
              </div>
            )}
            <div className="mt-6 flex justify-end">
              <Button onClick={fermerConsultation}>
                Fermer
              </Button>
            </div>
          </div>
        </Dialog>
      </div>
    </ScreenLayout>
  )
}