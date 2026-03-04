import { describe, it, expect, beforeEach, vi } from "vitest"
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react"
import type { FusionSeparationHistoryEntry } from "@/types/accountMergeHistory"
import { OPERATION_TYPES } from "@/types/accountMergeHistory"

const { mockStore, mockSetState } = vi.hoisted(() => {
  const store = {
    isLoading: false,
    error: null,
    lastCreatedEntry: null,
    historyEntries: [] as FusionSeparationHistoryEntry[],
    createHistoryEntry: vi.fn(),
    getHistoryByAccount: vi.fn(),
    getHistoryByDateRange: vi.fn(),
    setLoading: vi.fn(),
    setError: vi.fn(),
    setLastCreatedEntry: vi.fn(),
    setHistoryEntries: vi.fn(),
    clearState: vi.fn(),
    setState: vi.fn()
  }
  return {
    mockStore: store,
    mockSetState: vi.fn()
  }
})

vi.mock("@/stores/accountMergeHistoryStore", () => {
  const mockHook = (() => mockStore) as typeof mockStore & { setState: typeof mockSetState }
  mockHook.setState = mockSetState
  return { useAccountMergeHistoryStore: mockHook }
})

import { AccountMergeHistoryPage } from "@/pages/AccountMergeHistoryPage"

describe("AccountMergeHistoryPage", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockStore.isLoading = false
    mockStore.error = null
    mockStore.lastCreatedEntry = null
    mockStore.historyEntries = []
  })

  it("renders without crashing", () => {
    render(<AccountMergeHistoryPage />)
    
    expect(screen.getByText("Historique Fusion/Séparation")).toBeInTheDocument()
    expect(screen.getByText("Consultez l'historique des opérations de fusion et séparation de comptes")).toBeInTheDocument()
  })

  it("displays loading state", () => {
    mockStore.isLoading = true
    
    render(<AccountMergeHistoryPage />)
    
    expect(screen.getByText("Chargement des données...")).toBeInTheDocument()
  })

  it("displays empty state when no data", () => {
    mockStore.historyEntries = []
    
    render(<AccountMergeHistoryPage />)
    
    expect(screen.getByText("Aucun résultat trouvé")).toBeInTheDocument()
    expect(screen.getByText("Essayez de modifier vos critères de recherche")).toBeInTheDocument()
  })

  it("displays data when loaded", () => {
    mockStore.historyEntries = [
      {
        chronoId: 1,
        companyCode: "01",
        referenceAccount: 1234,
        referenceFiliation: 1,
        oldPointedAccount: 5678,
        oldPointedFiliation: 2,
        newPointedAccount: 9012,
        newPointedFiliation: 3,
        operationType: OPERATION_TYPES.FUSION,
        lastName: "Dupont",
        firstName: "Jean",
        fullName: "Dupont Jean",
        timestamp: new Date("2025-01-15T10:30:00"),
      },
    ]
    
    render(<AccountMergeHistoryPage />)
    
    expect(screen.getByText("1")).toBeInTheDocument()
    expect(screen.getByText("Dupont Jean")).toBeInTheDocument()
    expect(screen.getByText("1234/1")).toBeInTheDocument()
    expect(screen.getByText("5678/2")).toBeInTheDocument()
    expect(screen.getByText("9012/3")).toBeInTheDocument()
    expect(screen.getByText("01")).toBeInTheDocument()
    expect(screen.getByText("Fusion")).toBeInTheDocument()
  })

  it("switches between search modes", () => {
    const { container } = render(<AccountMergeHistoryPage />)
    
    const accountButton = screen.getByText("Par compte")
    const dateRangeButton = screen.getByText("Par période")
    
    expect(accountButton).toHaveClass("bg-blue-600")
    expect(dateRangeButton).toHaveClass("bg-gray-200")
    
    fireEvent.click(dateRangeButton)
    
    const startDateLabel = screen.getByText("Date début *")
    const endDateLabel = screen.getByText("Date fin *")
    expect(startDateLabel).toBeInTheDocument()
    expect(endDateLabel).toBeInTheDocument()
    
    const dateInputs = container.querySelectorAll('input[type="date"]')
    expect(dateInputs).toHaveLength(2)
    
    fireEvent.click(accountButton)
    
    expect(screen.getByPlaceholderText("Ex: 1234")).toBeInTheDocument()
  })

  it("handles search by account", async () => {
    mockStore.getHistoryByAccount.mockResolvedValue([])
    
    render(<AccountMergeHistoryPage />)
    
    const accountInput = screen.getByPlaceholderText("Ex: 1234")
    const filiationInput = screen.getByPlaceholderText("Ex: 1")
    const searchButton = screen.getByText("Rechercher")
    
    fireEvent.change(accountInput, { target: { value: "1234" } })
    fireEvent.change(filiationInput, { target: { value: "1" } })
    fireEvent.click(searchButton)
    
    await waitFor(() => {
      expect(mockStore.getHistoryByAccount).toHaveBeenCalledWith(1234, 1)
    })
  })

  it("handles search by date range", async () => {
    mockStore.getHistoryByDateRange.mockResolvedValue([])
    
    const { container } = render(<AccountMergeHistoryPage />)
    
    const dateRangeButton = screen.getByText("Par période")
    fireEvent.click(dateRangeButton)
    
    const dateInputs = container.querySelectorAll('input[type="date"]')
    const startDateInput = dateInputs[0] as HTMLInputElement
    const endDateInput = dateInputs[1] as HTMLInputElement
    const searchButton = screen.getByText("Rechercher")
    
    fireEvent.change(startDateInput, { target: { value: "2025-01-01" } })
    fireEvent.change(endDateInput, { target: { value: "2025-01-31" } })
    fireEvent.click(searchButton)
    
    await waitFor(() => {
      expect(mockStore.getHistoryByDateRange).toHaveBeenCalledWith(
        new Date("2025-01-01"),
        new Date("2025-01-31"),
        undefined
      )
    })
  })

  it("handles search by date range with operation type filter", async () => {
    mockStore.getHistoryByDateRange.mockResolvedValue([])
    
    const { container } = render(<AccountMergeHistoryPage />)
    
    const dateRangeButton = screen.getByText("Par période")
    fireEvent.click(dateRangeButton)
    
    const dateInputs = container.querySelectorAll('input[type="date"]')
    const startDateInput = dateInputs[0] as HTMLInputElement
    const endDateInput = dateInputs[1] as HTMLInputElement
    const operationTypeSelect = screen.getByRole("combobox")
    const searchButton = screen.getByText("Rechercher")
    
    fireEvent.change(startDateInput, { target: { value: "2025-01-01" } })
    fireEvent.change(endDateInput, { target: { value: "2025-01-31" } })
    fireEvent.change(operationTypeSelect, { target: { value: OPERATION_TYPES.FUSION } })
    fireEvent.click(searchButton)
    
    await waitFor(() => {
      expect(mockStore.getHistoryByDateRange).toHaveBeenCalledWith(
        new Date("2025-01-01"),
        new Date("2025-01-31"),
        OPERATION_TYPES.FUSION
      )
    })
  })

  it("displays error state", () => {
    mockStore.error = "Une erreur est survenue lors de la récupération des données"
    
    render(<AccountMergeHistoryPage />)
    
    expect(screen.getByText("Erreur")).toBeInTheDocument()
    expect(screen.getByText("Une erreur est survenue lors de la récupération des données")).toBeInTheDocument()
  })

  it("displays result count when data loaded", () => {
    mockStore.historyEntries = [
      {
        chronoId: 1,
        companyCode: "01",
        referenceAccount: 1234,
        referenceFiliation: 1,
        oldPointedAccount: 5678,
        oldPointedFiliation: 2,
        newPointedAccount: 9012,
        newPointedFiliation: 3,
        operationType: OPERATION_TYPES.FUSION,
        lastName: "Dupont",
        firstName: "Jean",
        fullName: "Dupont Jean",
        timestamp: new Date("2025-01-15T10:30:00"),
      },
      {
        chronoId: 2,
        companyCode: "02",
        referenceAccount: 2345,
        referenceFiliation: 1,
        oldPointedAccount: 6789,
        oldPointedFiliation: 2,
        newPointedAccount: 1234,
        newPointedFiliation: 1,
        operationType: OPERATION_TYPES.SEPARATION,
        lastName: "Martin",
        firstName: "Marie",
        fullName: "Martin Marie",
        timestamp: new Date("2025-01-16T14:20:00"),
      },
    ]
    
    render(<AccountMergeHistoryPage />)
    
    expect(screen.getByText("2 résultats trouvés")).toBeInTheDocument()
  })

  it("calls clearState on unmount", () => {
    const { unmount } = render(<AccountMergeHistoryPage />)
    
    unmount()
    
    expect(mockStore.clearState).toHaveBeenCalled()
  })

  it("disables search button when loading", () => {
    mockStore.isLoading = true
    
    render(<AccountMergeHistoryPage />)
    
    const searchButton = screen.getByText("Recherche...")
    
    expect(searchButton).toBeDisabled()
  })

  it("displays correct operation type labels", () => {
    mockStore.historyEntries = [
      {
        chronoId: 1,
        companyCode: "01",
        referenceAccount: 1234,
        referenceFiliation: 1,
        oldPointedAccount: 5678,
        oldPointedFiliation: 2,
        newPointedAccount: 9012,
        newPointedFiliation: 3,
        operationType: OPERATION_TYPES.ENTRY,
        lastName: "Dupont",
        firstName: "Jean",
        fullName: "Dupont Jean",
        timestamp: new Date("2025-01-15T10:30:00"),
      },
    ]
    
    render(<AccountMergeHistoryPage />)
    
    expect(screen.getByText("Entrée")).toBeInTheDocument()
  })
})