/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, vi } from "vitest"
import { useSessionConcurrencyStore } from "@/stores/sessionConcurrencyStore"
import { useDataSourceStore } from "@/stores/dataSourceStore"
import { apiClient } from "@/services/api/apiClient"
import type { SessionConcurrency, CheckConcurrencyApiResponse, RegisterSessionApiResponse, ReleaseSessionApiResponse, ForceOpenSessionApiResponse } from "@/types/sessionConcurrency"

vi.mock("@/services/api/apiClient")
vi.mock("@/stores/dataSourceStore")

const MOCK_SESSION_CONCURRENCY: SessionConcurrency = {
  societe: "ADH001",
  compte: 12345,
  filiation: 1,
  terminalId: "T01",
  timestamp: new Date("2024-01-01T10:00:00.000Z"),
  codeCalcul: "C",
  coffreEnCoursComptage: false
} as const

const MOCK_CONFLICTING_SESSION: SessionConcurrency = {
  societe: "ADH001",
  compte: 12345,
  filiation: 1,
  terminalId: "T02",
  timestamp: new Date("2024-01-01T09:30:00.000Z"),
  codeCalcul: "D",
  coffreEnCoursComptage: true
} as const

const MOCK_CHECK_CONCURRENCY_SUCCESS: CheckConcurrencyApiResponse = {
  success: true,
  data: {
    allowed: true
  },
  message: "Concurrency check successful"
} as const

const MOCK_CHECK_CONCURRENCY_CONFLICT: CheckConcurrencyApiResponse = {
  success: true,
  data: {
    allowed: false,
    conflictingSession: MOCK_CONFLICTING_SESSION
  },
  message: "Conflict detected"
} as const

const MOCK_REGISTER_SUCCESS: RegisterSessionApiResponse = {
  success: true,
  data: { success: true },
  message: "Session registered"
} as const

const MOCK_RELEASE_SUCCESS: ReleaseSessionApiResponse = {
  success: true,
  data: { success: true },
  message: "Session released"
} as const

const MOCK_FORCE_OPEN_SUCCESS: ForceOpenSessionApiResponse = {
  success: true,
  data: { success: true },
  message: "Session forced open"
} as const

describe("sessionConcurrencyStore", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useSessionConcurrencyStore.getState().reset()
  })

  describe("checkConcurrency", () => {
    it("should check concurrency successfully with real API", async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({ isRealApi: true })
      vi.mocked(apiClient.get).mockResolvedValue({ data: MOCK_CHECK_CONCURRENCY_SUCCESS })

      const result = await useSessionConcurrencyStore.getState().checkConcurrency({
        societe: "ADH001",
        compte: 12345,
        filiation: 1
      })

      expect(result.allowed).toBe(true)
      expect(useSessionConcurrencyStore.getState().conflictDetected).toBe(false)
      expect(useSessionConcurrencyStore.getState().conflictingSession).toBeNull()
      expect(useSessionConcurrencyStore.getState().isLoading).toBe(false)
      expect(apiClient.get).toHaveBeenCalledWith("/api/sessions/check-concurrency?societe=ADH001&compte=12345&filiation=1")
    })

    it("should detect conflict with real API", async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({ isRealApi: true })
      vi.mocked(apiClient.get).mockResolvedValue({ data: MOCK_CHECK_CONCURRENCY_CONFLICT })

      const result = await useSessionConcurrencyStore.getState().checkConcurrency({
        societe: "ADH001",
        compte: 12345,
        filiation: 1
      })

      expect(result.allowed).toBe(false)
      expect(result.conflictingSession).toEqual(MOCK_CONFLICTING_SESSION)
      expect(useSessionConcurrencyStore.getState().conflictDetected).toBe(true)
      expect(useSessionConcurrencyStore.getState().conflictingSession).toEqual(MOCK_CONFLICTING_SESSION)
    })

    it("should handle business rule RM-001: code calcul C (Creation)", async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({ isRealApi: false })

      const result = await useSessionConcurrencyStore.getState().checkConcurrency({
        societe: "ADH001",
        compte: 12345,
        filiation: 1
      })

      expect(result.allowed).toBe(false)
      expect(result.conflictingSession?.codeCalcul).toBe("C")
    })

    it("should handle business rule RM-002: code calcul D (Destruction)", async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({ isRealApi: false })

      const result = await useSessionConcurrencyStore.getState().checkConcurrency({
        societe: "ADH001",
        compte: 67890,
        filiation: 1
      })

      expect(result.allowed).toBe(false)
      expect(result.conflictingSession?.codeCalcul).toBe("D")
    })

    it("should handle business rule RM-003: coffre en cours comptage", async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({ isRealApi: false })

      const result = await useSessionConcurrencyStore.getState().checkConcurrency({
        societe: "ADH001",
        compte: 67890,
        filiation: 1
      })

      expect(result.allowed).toBe(false)
      expect(result.conflictingSession?.coffreEnCoursComptage).toBe(true)
    })

    it("should allow access when no conflicts exist", async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({ isRealApi: false })

      const result = await useSessionConcurrencyStore.getState().checkConcurrency({
        societe: "ADH999",
        compte: 99999,
        filiation: 1
      })

      expect(result.allowed).toBe(true)
      expect(result.conflictingSession).toBeUndefined()
      expect(useSessionConcurrencyStore.getState().conflictDetected).toBe(false)
    })

    it("should handle API error", async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({ isRealApi: true })
      const error = new Error("Network error")
      vi.mocked(apiClient.get).mockRejectedValue(error)

      await expect(
        useSessionConcurrencyStore.getState().checkConcurrency({
          societe: "ADH001",
          compte: 12345,
          filiation: 1
        })
      ).rejects.toThrow("Network error")

      expect(useSessionConcurrencyStore.getState().error).toBe("Network error")
      expect(useSessionConcurrencyStore.getState().isLoading).toBe(false)
    })

    it("should set loading state during API call", async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({ isRealApi: true })
      let resolvePromise: (value: unknown) => void
      const promise = new Promise((resolve) => { resolvePromise = resolve })
      vi.mocked(apiClient.get).mockReturnValue(promise)

      const checkPromise = useSessionConcurrencyStore.getState().checkConcurrency({
        societe: "ADH001",
        compte: 12345,
        filiation: 1
      })

      expect(useSessionConcurrencyStore.getState().isLoading).toBe(true)

      resolvePromise({ data: MOCK_CHECK_CONCURRENCY_SUCCESS })
      await checkPromise

      expect(useSessionConcurrencyStore.getState().isLoading).toBe(false)
    })
  })

  describe("registerSession", () => {
    it("should register session successfully with real API", async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({ isRealApi: true })
      vi.mocked(apiClient.post).mockResolvedValue({ data: MOCK_REGISTER_SUCCESS })

      await useSessionConcurrencyStore.getState().registerSession({
        societe: "ADH001",
        compte: 12345,
        filiation: 1,
        terminalId: "T01",
        codeCalcul: "C"
      })

      expect(useSessionConcurrencyStore.getState().isLoading).toBe(false)
      expect(useSessionConcurrencyStore.getState().error).toBeNull()
      expect(apiClient.post).toHaveBeenCalledWith("/api/sessions/register", {
        societe: "ADH001",
        compte: 12345,
        filiation: 1,
        terminalId: "T01",
        codeCalcul: "C"
      })
    })

    it("should register session with mock data", async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({ isRealApi: false })

      await useSessionConcurrencyStore.getState().registerSession({
        societe: "ADH999",
        compte: 99999,
        filiation: 1,
        terminalId: "T99",
        codeCalcul: "C"
      })

      const activeSessions = useSessionConcurrencyStore.getState().activeSessions
      const newSession = activeSessions.find(s => s.societe === "ADH999" && s.compte === 99999)
      
      expect(newSession).toBeDefined()
      expect(newSession?.terminalId).toBe("T99")
      expect(newSession?.codeCalcul).toBe("C")
      expect(newSession?.coffreEnCoursComptage).toBe(false)
    })

    it("should update existing session in mock data", async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({ isRealApi: false })

      await useSessionConcurrencyStore.getState().registerSession({
        societe: "ADH001",
        compte: 12345,
        filiation: 1,
        terminalId: "T99",
        codeCalcul: "D"
      })

      const activeSessions = useSessionConcurrencyStore.getState().activeSessions
      const updatedSession = activeSessions.find(s => s.societe === "ADH001" && s.compte === 12345)
      
      expect(updatedSession?.terminalId).toBe("T99")
      expect(updatedSession?.codeCalcul).toBe("D")
    })

    it("should handle API error", async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({ isRealApi: true })
      const error = new Error("Registration failed")
      vi.mocked(apiClient.post).mockRejectedValue(error)

      await expect(
        useSessionConcurrencyStore.getState().registerSession({
          societe: "ADH001",
          compte: 12345,
          filiation: 1,
          terminalId: "T01",
          codeCalcul: "C"
        })
      ).rejects.toThrow("Registration failed")

      expect(useSessionConcurrencyStore.getState().error).toBe("Registration failed")
      expect(useSessionConcurrencyStore.getState().isLoading).toBe(false)
    })

    it("should handle API failure response", async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({ isRealApi: true })
      vi.mocked(apiClient.post).mockResolvedValue({
        data: { success: false, message: "Registration denied", data: { success: false } }
      })

      await expect(
        useSessionConcurrencyStore.getState().registerSession({
          societe: "ADH001",
          compte: 12345,
          filiation: 1,
          terminalId: "T01",
          codeCalcul: "C"
        })
      ).rejects.toThrow("Registration denied")
    })
  })

  describe("releaseSession", () => {
    it("should release session successfully with real API", async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({ isRealApi: true })
      vi.mocked(apiClient.delete).mockResolvedValue({ data: MOCK_RELEASE_SUCCESS })

      await useSessionConcurrencyStore.getState().releaseSession({
        societe: "ADH001",
        compte: 12345,
        filiation: 1,
        terminalId: "T01"
      })

      expect(useSessionConcurrencyStore.getState().isLoading).toBe(false)
      expect(useSessionConcurrencyStore.getState().conflictDetected).toBe(false)
      expect(useSessionConcurrencyStore.getState().conflictingSession).toBeNull()
      expect(apiClient.delete).toHaveBeenCalledWith("/api/sessions/release?societe=ADH001&compte=12345&filiation=1&terminalId=T01")
    })

    it("should remove session from mock data", async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({ isRealApi: false })

      await useSessionConcurrencyStore.getState().releaseSession({
        societe: "ADH001",
        compte: 12345,
        filiation: 1,
        terminalId: "T01"
      })

      const activeSessions = useSessionConcurrencyStore.getState().activeSessions
      const releasedSession = activeSessions.find(s => 
        s.societe === "ADH001" && 
        s.compte === 12345 && 
        s.terminalId === "T01"
      )
      
      expect(releasedSession).toBeUndefined()
    })

    it("should handle non-existent session in mock data", async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({ isRealApi: false })

      await useSessionConcurrencyStore.getState().releaseSession({
        societe: "ADH999",
        compte: 99999,
        filiation: 1,
        terminalId: "T99"
      })

      expect(useSessionConcurrencyStore.getState().error).toBeNull()
    })

    it("should handle API error", async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({ isRealApi: true })
      const error = new Error("Release failed")
      vi.mocked(apiClient.delete).mockRejectedValue(error)

      await expect(
        useSessionConcurrencyStore.getState().releaseSession({
          societe: "ADH001",
          compte: 12345,
          filiation: 1,
          terminalId: "T01"
        })
      ).rejects.toThrow("Release failed")

      expect(useSessionConcurrencyStore.getState().error).toBe("Release failed")
    })
  })

  describe("forceOpenSession", () => {
    it("should force open session successfully with real API", async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({ isRealApi: true })
      vi.mocked(apiClient.post).mockResolvedValue({ data: MOCK_FORCE_OPEN_SUCCESS })

      await useSessionConcurrencyStore.getState().forceOpenSession({
        societe: "ADH001",
        compte: 12345,
        filiation: 1,
        terminalId: "T01",
        reason: "Emergency access"
      })

      expect(useSessionConcurrencyStore.getState().isLoading).toBe(false)
      expect(useSessionConcurrencyStore.getState().conflictDetected).toBe(false)
      expect(useSessionConcurrencyStore.getState().conflictingSession).toBeNull()
      expect(apiClient.post).toHaveBeenCalledWith("/api/sessions/force-open", {
        societe: "ADH001",
        compte: 12345,
        filiation: 1,
        terminalId: "T01",
        reason: "Emergency access"
      })
    })

    it("should force open session with mock data", async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({ isRealApi: false })

      await useSessionConcurrencyStore.getState().forceOpenSession({
        societe: "ADH999",
        compte: 99999,
        filiation: 1,
        terminalId: "T99",
        reason: "Override conflict"
      })

      const activeSessions = useSessionConcurrencyStore.getState().activeSessions
      const forcedSession = activeSessions.find(s => s.societe === "ADH999" && s.compte === 99999)
      
      expect(forcedSession).toBeDefined()
      expect(forcedSession?.terminalId).toBe("T99")
      expect(forcedSession?.codeCalcul).toBeNull()
      expect(forcedSession?.coffreEnCoursComptage).toBe(false)
    })

    it("should replace existing conflicting session", async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({ isRealApi: false })

      await useSessionConcurrencyStore.getState().forceOpenSession({
        societe: "ADH001",
        compte: 12345,
        filiation: 1,
        terminalId: "T99",
        reason: "Force override"
      })

      const activeSessions = useSessionConcurrencyStore.getState().activeSessions
      const forcedSession = activeSessions.find(s => s.societe === "ADH001" && s.compte === 12345)
      
      expect(forcedSession?.terminalId).toBe("T99")
      expect(forcedSession?.codeCalcul).toBeNull()
    })

    it("should handle API error", async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({ isRealApi: true })
      const error = new Error("Force open failed")
      vi.mocked(apiClient.post).mockRejectedValue(error)

      await expect(
        useSessionConcurrencyStore.getState().forceOpenSession({
          societe: "ADH001",
          compte: 12345,
          filiation: 1,
          terminalId: "T01",
          reason: "Emergency"
        })
      ).rejects.toThrow("Force open failed")

      expect(useSessionConcurrencyStore.getState().error).toBe("Force open failed")
    })

    it("should handle API failure response", async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({ isRealApi: true })
      vi.mocked(apiClient.post).mockResolvedValue({
        data: { success: false, message: "Force open denied", data: { success: false } }
      })

      await expect(
        useSessionConcurrencyStore.getState().forceOpenSession({
          societe: "ADH001",
          compte: 12345,
          filiation: 1,
          terminalId: "T01",
          reason: "Emergency"
        })
      ).rejects.toThrow("Force open denied")
    })
  })

  describe("reset", () => {
    it("should reset store to initial state", () => {
      const store = useSessionConcurrencyStore.getState()
      
      store.activeSessions.push(MOCK_SESSION_CONCURRENCY)
      store.conflictDetected = true
      store.conflictingSession = MOCK_CONFLICTING_SESSION
      store.error = "Test error"
      
      store.reset()

      expect(useSessionConcurrencyStore.getState().activeSessions).toEqual([])
      expect(useSessionConcurrencyStore.getState().isLoading).toBe(false)
      expect(useSessionConcurrencyStore.getState().error).toBeNull()
      expect(useSessionConcurrencyStore.getState().conflictDetected).toBe(false)
      expect(useSessionConcurrencyStore.getState().conflictingSession).toBeNull()
    })
  })
})