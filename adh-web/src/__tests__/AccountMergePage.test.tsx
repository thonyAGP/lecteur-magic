/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, vi } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"

const { mockStore, mockSetState } = vi.hoisted(() => {
  const store = {
    mergeHistories: [],
    sourceAccount: null,
    targetAccount: null,
    validationState: null,
    isLoading: false,
    error: null,
    mergeProgress: 0,
    currentStep: '',
    validateMergeConditions: vi.fn(),
    executeMerge: vi.fn(),
    createMergeHistory: vi.fn(),
    rollbackMerge: vi.fn(),
    printMergeTicket: vi.fn(),
    reset: vi.fn(),
    setState: vi.fn()
  }
  return {
    mockStore: store,
    mockSetState: vi.fn()
  }
})

vi.mock("@/stores/accountMergeStore", () => {
  const mockHook = (() => mockStore) as typeof mockStore & { setState: typeof mockSetState }
  mockHook.setState = mockSetState
  return { useAccountMergeStore: mockHook }
})

vi.mock("@/components/layout", () => ({
  ScreenLayout: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={className}>{children}</div>
  )
}))

vi.mock("@/components/ui", () => ({
  Button: ({ children, onClick, disabled, variant, className }: {
    children: React.ReactNode
    onClick?: () => void
    disabled?: boolean
    variant?: string
    className?: string
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
      data-variant={variant}
    >
      {children}
    </button>
  ),
  Input: ({ value, onChange, placeholder, disabled }: {
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    placeholder?: string
    disabled?: boolean
  }) => (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
    />
  ),
  Dialog: ({ open, onOpenChange, children }: {
    open: boolean
    onOpenChange: (open: boolean) => void
    children: React.ReactNode
  }) => (
    open ? (
      <div data-testid="dialog" onClick={() => onOpenChange(false)}>
        {children}
      </div>
    ) : null
  )
}))

vi.mock("@/lib/utils", () => ({
  cn: (...classes: (string | undefined)[]) => classes.filter(Boolean).join(" ")
}))

import { AccountMergePage } from "@/pages/AccountMergePage"

describe("AccountMergePage", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockStore.mergeHistories = []
    mockStore.sourceAccount = null
    mockStore.targetAccount = null
    mockStore.validationState = null
    mockStore.isLoading = false
    mockStore.error = null
    mockStore.mergeProgress = 0
    mockStore.currentStep = ''
  })

  it("renders without crashing", () => {
    render(<AccountMergePage />)
    expect(screen.getByText("Account Merge")).toBeInTheDocument()
    expect(screen.getByText("Account Selection")).toBeInTheDocument()
  })

  it("displays account input fields", () => {
    render(<AccountMergePage />)
    
    expect(screen.getByPlaceholderText("Enter source account number")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Enter target account number")).toBeInTheDocument()
    expect(screen.getByText("Validate Accounts")).toBeInTheDocument()
  })

  it("handles account input changes", () => {
    render(<AccountMergePage />)
    
    const sourceInput = screen.getByPlaceholderText("Enter source account number")
    const targetInput = screen.getByPlaceholderText("Enter target account number")
    
    fireEvent.change(sourceInput, { target: { value: "123456" } })
    fireEvent.change(targetInput, { target: { value: "789012" } })
    
    expect(sourceInput).toHaveValue("123456")
    expect(targetInput).toHaveValue("789012")
  })

  it("validates accounts when validate button is clicked", async () => {
    render(<AccountMergePage />)
    
    const sourceInput = screen.getByPlaceholderText("Enter source account number")
    const targetInput = screen.getByPlaceholderText("Enter target account number")
    const validateButton = screen.getByText("Validate Accounts")
    
    fireEvent.change(sourceInput, { target: { value: "123456" } })
    fireEvent.change(targetInput, { target: { value: "789012" } })
    fireEvent.click(validateButton)
    
    await waitFor(() => {
      expect(mockStore.validateMergeConditions).toHaveBeenCalledWith("123456", "789012")
    })
  })

  it("disables validate button when accounts are empty or same", () => {
    render(<AccountMergePage />)
    
    const validateButton = screen.getByText("Validate Accounts")
    expect(validateButton).toBeDisabled()
    
    const sourceInput = screen.getByPlaceholderText("Enter source account number")
    const targetInput = screen.getByPlaceholderText("Enter target account number")
    
    fireEvent.change(sourceInput, { target: { value: "123456" } })
    fireEvent.change(targetInput, { target: { value: "123456" } })
    
    expect(validateButton).toBeDisabled()
  })

  it("displays loading state during validation", () => {
    mockStore.isLoading = true
    mockStore.currentStep = 'validation'
    
    render(<AccountMergePage />)
    
    expect(screen.getByText("Validating...")).toBeInTheDocument()
  })

  it("displays validation status when validation state is available", () => {
    mockStore.validationState = {
      isClosureInProgress: false,
      networkStatus: 'A',
      validationStatus: 'P'
    }
    mockStore.sourceAccount = {
      accountNumber: "123456",
      balance: 1000.50,
      status: 'A',
      createdDate: new Date()
    }
    mockStore.targetAccount = {
      accountNumber: "789012",
      balance: 2500.75,
      status: 'A',
      createdDate: new Date()
    }
    
    render(<AccountMergePage />)
    
    expect(screen.getByText("Validation Status")).toBeInTheDocument()
    expect(screen.getByText("No Active Closure")).toBeInTheDocument()
    expect(screen.getByText("✓ Merge can proceed")).toBeInTheDocument()
    
    const sourceAccountElements = screen.getAllByText((content, element) => {
      return element?.tagName.toLowerCase() === 'h4' && content === 'Source Account'
    })
    expect(sourceAccountElements).toHaveLength(1)
    
    expect(screen.getByText((content, element) => {
      return content.includes("$1,000.50")
    })).toBeInTheDocument()
    
    expect(screen.getByText((content, element) => {
      return content.includes("$2,500.75")
    })).toBeInTheDocument()
  })

  it("displays merge execution section when validation is complete", () => {
    mockStore.validationState = {
      isClosureInProgress: false,
      networkStatus: 'A',
      validationStatus: 'P'
    }
    
    render(<AccountMergePage />)
    
    expect(screen.getByText("Merge Execution")).toBeInTheDocument()
    expect(screen.getByText("Execute Merge")).toBeInTheDocument()
  })

  it("shows confirmation dialog when execute merge is clicked", async () => {
    mockStore.validationState = {
      isClosureInProgress: false,
      networkStatus: 'A',
      validationStatus: 'P'
    }
    
    render(<AccountMergePage />)
    
    const executeButton = screen.getByText("Execute Merge")
    fireEvent.click(executeButton)
    
    await waitFor(() => {
      expect(screen.getByTestId("dialog")).toBeInTheDocument()
      const confirmElements = screen.getAllByText((content, element) => {
        return element?.tagName.toLowerCase() === 'h3' && content === 'Confirm Merge'
      })
      expect(confirmElements).toHaveLength(1)
    })
  })

  it("executes merge when confirmed in dialog", async () => {
    mockStore.validationState = {
      isClosureInProgress: false,
      networkStatus: 'A',
      validationStatus: 'P'
    }
    
    render(<AccountMergePage />)
    
    const sourceInput = screen.getByPlaceholderText("Enter source account number")
    const targetInput = screen.getByPlaceholderText("Enter target account number")
    
    fireEvent.change(sourceInput, { target: { value: "123456" } })
    fireEvent.change(targetInput, { target: { value: "789012" } })
    
    const executeButton = screen.getByText("Execute Merge")
    fireEvent.click(executeButton)
    
    await waitFor(() => {
      const confirmButtons = screen.getAllByText((content, element) => {
        return element?.tagName.toLowerCase() === 'button' && content === 'Confirm Merge'
      })
      expect(confirmButtons).toHaveLength(1)
      fireEvent.click(confirmButtons[0])
    })
    
    await waitFor(() => {
      expect(mockStore.executeMerge).toHaveBeenCalledWith("123456", "789012")
    })
  })

  it("displays progress bar during merge execution", () => {
    mockStore.currentStep = 'executing'
    mockStore.mergeProgress = 45
    
    render(<AccountMergePage />)
    
    expect(screen.getByText("Progress")).toBeInTheDocument()
    expect(screen.getByText("45%")).toBeInTheDocument()
    expect(screen.getByText("Executing Merge")).toBeInTheDocument()
  })

  it("shows result dialog when merge is completed", () => {
    mockStore.currentStep = 'completed'
    mockStore.mergeHistories = [{
      id: 1,
      sourceAccount: "123456",
      targetAccount: "789012",
      mergeDate: new Date(),
      operator: "admin",
      status: "COMPLETED"
    }]
    
    render(<AccountMergePage />)
    
    expect(screen.getByText("Merge Completed")).toBeInTheDocument()
    expect(screen.getByText("✓ Merge Successful")).toBeInTheDocument()
  })

  it("displays error state when error occurs", () => {
    mockStore.error = "Network error occurred"
    
    render(<AccountMergePage />)
    
    expect(screen.getByText("Error")).toBeInTheDocument()
    expect(screen.getByText("Network error occurred")).toBeInTheDocument()
  })

  it("displays merge history when available", () => {
    mockStore.mergeHistories = [
      {
        id: 1,
        sourceAccount: "123456",
        targetAccount: "789012",
        mergeDate: new Date('2024-01-15'),
        operator: "admin",
        status: "COMPLETED"
      },
      {
        id: 2,
        sourceAccount: "111111",
        targetAccount: "222222",
        mergeDate: new Date('2024-01-14'),
        operator: "user1",
        status: "PENDING"
      }
    ]
    
    render(<AccountMergePage />)
    
    expect(screen.getByText("Recent Merge History")).toBeInTheDocument()
    expect(screen.getByText("123456 → 789012")).toBeInTheDocument()
    expect(screen.getByText("111111 → 222222")).toBeInTheDocument()
    expect(screen.getByText("COMPLETED")).toBeInTheDocument()
    expect(screen.getByText("PENDING")).toBeInTheDocument()
  })

  it("calls print ticket function when print button is clicked", async () => {
    mockStore.currentStep = 'completed'
    mockStore.mergeHistories = [{
      id: 1,
      sourceAccount: "123456",
      targetAccount: "789012",
      mergeDate: new Date(),
      operator: "admin",
      status: "COMPLETED"
    }]
    
    render(<AccountMergePage />)
    
    const printButton = screen.getByText("Print Ticket")
    fireEvent.click(printButton)
    
    await waitFor(() => {
      expect(mockStore.printMergeTicket).toHaveBeenCalledWith(1)
    })
  })

  it("prevents merge when closure is in progress", () => {
    mockStore.validationState = {
      isClosureInProgress: true,
      networkStatus: 'A',
      validationStatus: 'P'
    }
    
    render(<AccountMergePage />)
    
    expect(screen.getByText("Closure in Progress")).toBeInTheDocument()
    expect(screen.getByText("✗ Merge cannot proceed")).toBeInTheDocument()
    expect(screen.queryByText("Execute Merge")).not.toBeInTheDocument()
  })

  it("resets store on component unmount", () => {
    const { unmount } = render(<AccountMergePage />)
    
    unmount()
    
    expect(mockStore.reset).toHaveBeenCalled()
  })

  it("closes dialogs and resets form when close button is clicked", async () => {
    mockStore.currentStep = 'completed'
    mockStore.mergeHistories = [{
      id: 1,
      sourceAccount: "123456",
      targetAccount: "789012",
      mergeDate: new Date(),
      operator: "admin",
      status: "COMPLETED"
    }]
    
    render(<AccountMergePage />)
    
    const closeButton = screen.getByText("Close")
    fireEvent.click(closeButton)
    
    await waitFor(() => {
      expect(mockStore.reset).toHaveBeenCalled()
    })
  })
})