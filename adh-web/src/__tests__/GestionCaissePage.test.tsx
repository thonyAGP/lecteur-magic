/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"

vi.mock("@/stores/gestionCaisseStore", () => ({
  useGestionCaisseStore: vi.fn()
}))

import { GestionCaissePage } from "@/pages/GestionCaissePage"
import { useGestionCaisseStore } from "@/stores/gestionCaisseStore"

const mockStore = {
  sessionActive: null,
  parametres: null,
  sessionsConcurrentes: [],
  mouvements: [],
  historique: [],
  dateComptable: null,
  isLoading: false,
  error: null,
  showHistoriqueDialog: false,
  showConsultationDialog: false,
  selectedSessionId: null,
  chargerDonnees: vi.fn(),
  ouvrirSession: vi.fn(),
  fermerSession: vi.fn(),
  apportCoffre: vi.fn(),
  apportProduit: vi.fn(),
  remiseCoffre: vi.fn(),
  ouvrirHistorique: vi.fn(),
  fermerHistorique: vi.fn(),
  ouvrirConsultation: vi.fn(),
  fermerConsultation: vi.fn(),
  reimprimer: vi.fn(),
  reset: vi.fn(),
  setSelectedSessionId: vi.fn()
}

describe("GestionCaissePage", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(useGestionCaisseStore as Mock).mockReturnValue(mockStore)
  })

  it("renders without crashing", () => {
    render(<GestionCaissePage />)
    expect(screen.getByText("Actions")).toBeInTheDocument()
  })

  it("displays loading state", () => {
    ;(useGestionCaisseStore as Mock).mockReturnValue({
      ...mockStore,
      isLoading: true
    })

    render(<GestionCaissePage />)
    expect(screen.getByText("Chargement des données de caisse...")).toBeInTheDocument()
  })

  it("displays error state", () => {
    ;(useGestionCaisseStore as Mock).mockReturnValue({
      ...mockStore,
      error: "Erreur de connexion"
    })

    render(<GestionCaissePage />)
    expect(screen.getByText("Erreur: Erreur de connexion")).toBeInTheDocument()
  })

  it("displays data when loaded", () => {
    const sessionActive = {
      sessionId: 123,
      dateOuverture: new Date("2024-01-15T08:00:00Z"),
      dateFermeture: null,
      operateurId: 1,
      operateurNom: "Jean Dupont",
      statut: "OUVERT" as const,
      montantOuverture: 500.00,
      montantFermeture: null,
      ecart: null
    }

    const dateComptable = {
      date: new Date("2024-01-15"),
      valide: true
    }

    const mouvements = [
      {
        mouvementId: 1,
        sessionId: 123,
        type: "APPORT" as const,
        deviseCode: "EUR",
        montant: 100.00,
        dateHeure: new Date("2024-01-15T10:00:00Z")
      }
    ]

    ;(useGestionCaisseStore as Mock).mockReturnValue({
      ...mockStore,
      sessionActive,
      dateComptable,
      mouvements
    })

    render(<GestionCaissePage />)

    expect(screen.getByText("Jean Dupont")).toBeInTheDocument()
    expect(screen.getByText("OUVERT")).toBeInTheDocument()
    expect(screen.getByText("500.00 €")).toBeInTheDocument()
    expect(screen.getByText("600.00 €")).toBeInTheDocument()
    expect(screen.getByText("APPORT")).toBeInTheDocument()
  })

  it("handles opening session click", async () => {
    render(<GestionCaissePage />)

    const ouvrirButton = screen.getByText("Ouvrir session")
    fireEvent.click(ouvrirButton)

    await waitFor(() => {
      expect(mockStore.ouvrirSession).toHaveBeenCalledWith(500.00)
    })
  })

  it("handles closing session click", async () => {
    const sessionActive = {
      sessionId: 123,
      dateOuverture: new Date("2024-01-15T08:00:00Z"),
      dateFermeture: null,
      operateurId: 1,
      operateurNom: "Jean Dupont",
      statut: "OUVERT" as const,
      montantOuverture: 500.00,
      montantFermeture: null,
      ecart: null
    }

    ;(useGestionCaisseStore as Mock).mockReturnValue({
      ...mockStore,
      sessionActive
    })

    render(<GestionCaissePage />)

    const fermerButton = screen.getByText("Fermer session")
    fireEvent.click(fermerButton)

    await waitFor(() => {
      expect(mockStore.fermerSession).toHaveBeenCalledWith(123, 485.50)
    })
  })

  it("handles apport coffre click", async () => {
    const sessionActive = {
      sessionId: 123,
      dateOuverture: new Date("2024-01-15T08:00:00Z"),
      dateFermeture: null,
      operateurId: 1,
      operateurNom: "Jean Dupont",
      statut: "OUVERT" as const,
      montantOuverture: 500.00,
      montantFermeture: null,
      ecart: null
    }

    ;(useGestionCaisseStore as Mock).mockReturnValue({
      ...mockStore,
      sessionActive
    })

    render(<GestionCaissePage />)

    const apportCoffreButton = screen.getByText("Apport coffre")
    fireEvent.click(apportCoffreButton)

    await waitFor(() => {
      expect(mockStore.apportCoffre).toHaveBeenCalledWith(123, 200.00, "EUR")
    })
  })

  it("handles apport produit click", async () => {
    const sessionActive = {
      sessionId: 123,
      dateOuverture: new Date("2024-01-15T08:00:00Z"),
      dateFermeture: null,
      operateurId: 1,
      operateurNom: "Jean Dupont",
      statut: "OUVERT" as const,
      montantOuverture: 500.00,
      montantFermeture: null,
      ecart: null
    }

    ;(useGestionCaisseStore as Mock).mockReturnValue({
      ...mockStore,
      sessionActive
    })

    render(<GestionCaissePage />)

    const apportProduitButton = screen.getByText("Apport produit")
    fireEvent.click(apportProduitButton)

    await waitFor(() => {
      expect(mockStore.apportProduit).toHaveBeenCalledWith(123, 150.00, "USD")
    })
  })

  it("handles remise coffre click", async () => {
    const sessionActive = {
      sessionId: 123,
      dateOuverture: new Date("2024-01-15T08:00:00Z"),
      dateFermeture: null,
      operateurId: 1,
      operateurNom: "Jean Dupont",
      statut: "OUVERT" as const,
      montantOuverture: 500.00,
      montantFermeture: null,
      ecart: null
    }

    ;(useGestionCaisseStore as Mock).mockReturnValue({
      ...mockStore,
      sessionActive
    })

    render(<GestionCaissePage />)

    const remiseCoffreButton = screen.getByText("Remise coffre")
    fireEvent.click(remiseCoffreButton)

    await waitFor(() => {
      expect(mockStore.remiseCoffre).toHaveBeenCalledWith(123, 100.00, "EUR")
    })
  })

  it("handles historique dialog opening", () => {
    render(<GestionCaissePage />)

    const historiqueButton = screen.getByText("Historique")
    fireEvent.click(historiqueButton)

    expect(mockStore.ouvrirHistorique).toHaveBeenCalled()
  })

  it("handles consultation dialog opening", () => {
    render(<GestionCaissePage />)

    const consultationButton = screen.getByText("Consultation")
    fireEvent.click(consultationButton)

    expect(mockStore.ouvrirConsultation).toHaveBeenCalled()
  })

  it("handles reimprimer click", async () => {
    const sessionActive = {
      sessionId: 123,
      dateOuverture: new Date("2024-01-15T08:00:00Z"),
      dateFermeture: null,
      operateurId: 1,
      operateurNom: "Jean Dupont",
      statut: "OUVERT" as const,
      montantOuverture: 500.00,
      montantFermeture: null,
      ecart: null
    }

    ;(useGestionCaisseStore as Mock).mockReturnValue({
      ...mockStore,
      sessionActive
    })

    render(<GestionCaissePage />)

    const reimprimerButton = screen.getByText("Réimprimer")
    fireEvent.click(reimprimerButton)

    await waitFor(() => {
      expect(mockStore.reimprimer).toHaveBeenCalledWith(123)
    })
  })

  it("displays historique dialog when open", () => {
    const historique = [
      {
        sessionId: 100,
        dateOuverture: new Date("2024-01-14T08:00:00Z"),
        dateFermeture: new Date("2024-01-14T18:00:00Z"),
        operateurId: 1,
        operateurNom: "Marie Martin",
        statut: "FERME" as const,
        montantOuverture: 500.00,
        montantFermeture: 485.50,
        ecart: -14.50
      }
    ]

    ;(useGestionCaisseStore as Mock).mockReturnValue({
      ...mockStore,
      showHistoriqueDialog: true,
      historique
    })

    render(<GestionCaissePage />)

    expect(screen.getByText("Historique des sessions")).toBeInTheDocument()
    expect(screen.getByText("Marie Martin")).toBeInTheDocument()
    expect(screen.getByText("FERME")).toBeInTheDocument()
    expect(screen.getByText("-14.50 €")).toBeInTheDocument()
  })

  it("displays consultation dialog when open", () => {
    ;(useGestionCaisseStore as Mock).mockReturnValue({
      ...mockStore,
      showConsultationDialog: true,
      selectedSessionId: 123
    })

    render(<GestionCaissePage />)

    expect(screen.getByText("Consultation de session")).toBeInTheDocument()
    expect(screen.getByText("Session #123")).toBeInTheDocument()
  })

  it("handles session consultation from historique", () => {
    const historique = [
      {
        sessionId: 100,
        dateOuverture: new Date("2024-01-14T08:00:00Z"),
        dateFermeture: new Date("2024-01-14T18:00:00Z"),
        operateurId: 1,
        operateurNom: "Marie Martin",
        statut: "FERME" as const,
        montantOuverture: 500.00,
        montantFermeture: 485.50,
        ecart: -14.50
      }
    ]

    ;(useGestionCaisseStore as Mock).mockReturnValue({
      ...mockStore,
      showHistoriqueDialog: true,
      historique
    })

    render(<GestionCaissePage />)

    const consulterButton = screen.getByText("Consulter")
    fireEvent.click(consulterButton)

    expect(mockStore.setSelectedSessionId).toHaveBeenCalledWith(100)
  })

  it("displays concurrent sessions alert", () => {
    const sessionsConcurrentes = [
      {
        sessionId: 124,
        posteId: "POSTE-02",
        operateurNom: "Paul Durand",
        dateOuverture: new Date("2024-01-15T09:00:00Z")
      }
    ]

    ;(useGestionCaisseStore as Mock).mockReturnValue({
      ...mockStore,
      sessionsConcurrentes
    })

    render(<GestionCaissePage />)

    expect(screen.getByText("1")).toBeInTheDocument()
    expect(screen.getByText("POSTE-02 - Paul Durand")).toBeInTheDocument()
  })

  it("disables buttons appropriately based on session state", () => {
    render(<GestionCaissePage />)

    expect(screen.getByText("Fermer session")).toBeDisabled()
    expect(screen.getByText("Apport coffre")).toBeDisabled()
    expect(screen.getByText("Apport produit")).toBeDisabled()
    expect(screen.getByText("Remise coffre")).toBeDisabled()
    expect(screen.getByText("Réimprimer")).toBeDisabled()
  })

  it("enables buttons when session is active", () => {
    const sessionActive = {
      sessionId: 123,
      dateOuverture: new Date("2024-01-15T08:00:00Z"),
      dateFermeture: null,
      operateurId: 1,
      operateurNom: "Jean Dupont",
      statut: "OUVERT" as const,
      montantOuverture: 500.00,
      montantFermeture: null,
      ecart: null
    }

    ;(useGestionCaisseStore as Mock).mockReturnValue({
      ...mockStore,
      sessionActive
    })

    render(<GestionCaissePage />)

    expect(screen.getByText("Ouvrir session")).toBeDisabled()
    expect(screen.getByText("Fermer session")).not.toBeDisabled()
    expect(screen.getByText("Apport coffre")).not.toBeDisabled()
    expect(screen.getByText("Apport produit")).not.toBeDisabled()
    expect(screen.getByText("Remise coffre")).not.toBeDisabled()
    expect(screen.getByText("Réimprimer")).not.toBeDisabled()
  })

  it("calls chargerDonnees on mount and reset on unmount", () => {
    const { unmount } = render(<GestionCaissePage />)

    expect(mockStore.chargerDonnees).toHaveBeenCalled()

    unmount()

    expect(mockStore.reset).toHaveBeenCalled()
  })

  it("displays empty state for movements", () => {
    render(<GestionCaissePage />)
    
    expect(screen.getByText("Aucun mouvement enregistré")).toBeInTheDocument()
  })

  it("displays empty state for historique dialog", () => {
    ;(useGestionCaisseStore as Mock).mockReturnValue({
      ...mockStore,
      showHistoriqueDialog: true
    })

    render(<GestionCaissePage />)
    
    expect(screen.getByText("Aucune session dans l'historique")).toBeInTheDocument()
  })
})