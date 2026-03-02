/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeEach, vi } from "vitest"
import { useFermetureSessionsStore } from "@/stores/fermetureSessionsStore"
import { useDataSourceStore } from "@/stores/dataSourceStore"
import { apiClient } from "@/services/api/apiClient"
import type { 
  Session, 
  UnilateralBilateral, 
  SessionCloseResponse, 
  SessionValidationResponse,
  SESSION_STATUTS 
} from "@/types/fermetureSessions"

vi.mock("@/services/api/apiClient", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn()
  }
}))

vi.mock("@/stores/dataSourceStore", () => ({
  useDataSourceStore: {
    getState: vi.fn()
  }
}))

const MOCK_SESSIONS: Session[] = [
  {
    id: 101,
    dateOuverture: new Date('2024-01-15T08:00:00'),
    dateFermeture: null,
    statut: 'O'
  },
  {
    id: 102,
    dateOuverture: new Date('2024-01-16T08:30:00'),
    dateFermeture: null,
    statut: 'O'
  }
]

const MOCK_TYPES: UnilateralBilateral[] = [
  {
    code: 'UNI',
    libelle: 'Opération Unilatérale',
    type: 'UNILATERAL'
  },
  {
    code: 'BIL',
    libelle: 'Opération Bilatérale',
    type: 'BILATERAL'
  }
]

const MOCK_SESSION_CLOSE_SUCCESS: SessionCloseResponse = {
  success: true,
  closureCode: 'N15.5CZ'
}

const MOCK_VALIDATION_SUCCESS: SessionValidationResponse = {
  valid: true,
  errors: []
}

describe('fermetureSessionsStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useFermetureSessionsStore.getState().reset()
  })

  describe('loadSessions', () => {
    it('should load sessions successfully with real API', async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({ isRealApi: true })
      vi.mocked(apiClient.get).mockResolvedValue({
        success: true,
        data: MOCK_SESSIONS.map(s => ({
          ...s,
          dateOuverture: s.dateOuverture.toISOString(),
          dateFermeture: s.dateFermeture?.toISOString() || null
        }))
      })

      const store = useFermetureSessionsStore.getState()
      
      await store.loadSessions()
      
      expect(apiClient.get).toHaveBeenCalledWith('/api/fermeture-sessions/sessions?statut=O')
      expect(store.sessions).toHaveLength(2)
      expect(store.sessions[0].id).toBe(101)
      expect(store.isLoading).toBe(false)
      expect(store.error).toBeNull()
    })

    it('should load sessions successfully with mock data', async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({ isRealApi: false })

      const store = useFermetureSessionsStore.getState()
      
      await store.loadSessions()
      
      expect(store.sessions).toHaveLength(2)
      expect(store.sessions.every(s => s.statut === 'O')).toBe(true)
      expect(store.isLoading).toBe(false)
      expect(store.error).toBeNull()
    })

    it('should handle API error', async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({ isRealApi: true })
      vi.mocked(apiClient.get).mockRejectedValue(new Error('Network error'))

      const store = useFermetureSessionsStore.getState()
      
      await store.loadSessions()
      
      expect(store.sessions).toHaveLength(0)
      expect(store.error).toBe('Network error')
      expect(store.isLoading).toBe(false)
    })

    it('should set loading state during request', async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({ isRealApi: false })
      
      const store = useFermetureSessionsStore.getState()
      const loadPromise = store.loadSessions()
      
      expect(useFermetureSessionsStore.getState().isLoading).toBe(true)
      
      await loadPromise
      
      expect(useFermetureSessionsStore.getState().isLoading).toBe(false)
    })

    it('should filter only open sessions (status O)', async () => {
      const sessionsWithClosed = [
        ...MOCK_SESSIONS,
        {
          id: 103,
          dateOuverture: new Date('2024-01-17T09:00:00'),
          dateFermeture: new Date('2024-01-17T18:00:00'),
          statut: 'C'
        }
      ]

      vi.mocked(useDataSourceStore.getState).mockReturnValue({ isRealApi: true })
      vi.mocked(apiClient.get).mockResolvedValue({
        success: true,
        data: sessionsWithClosed.map(s => ({
          ...s,
          dateOuverture: s.dateOuverture.toISOString(),
          dateFermeture: s.dateFermeture?.toISOString() || null
        }))
      })

      const store = useFermetureSessionsStore.getState()
      
      await store.loadSessions()
      
      expect(store.sessions.every(s => s.statut === 'O')).toBe(true)
    })
  })

  describe('loadUnilateralBilateralTypes', () => {
    it('should load types successfully with real API', async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({ isRealApi: true })
      vi.mocked(apiClient.get).mockResolvedValue({
        success: true,
        data: MOCK_TYPES
      })

      const store = useFermetureSessionsStore.getState()
      
      await store.loadUnilateralBilateralTypes()
      
      expect(apiClient.get).toHaveBeenCalledWith('/api/fermeture-sessions/types')
      expect(store.unilateralBilateralTypes).toHaveLength(2)
      expect(store.unilateralBilateralTypes[0].code).toBe('UNI')
      expect(store.isLoading).toBe(false)
      expect(store.error).toBeNull()
    })

    it('should load types successfully with mock data', async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({ isRealApi: false })

      const store = useFermetureSessionsStore.getState()
      
      await store.loadUnilateralBilateralTypes()
      
      expect(store.unilateralBilateralTypes).toHaveLength(3)
      expect(store.unilateralBilateralTypes.find(t => t.code === 'MIX')).toBeDefined()
      expect(store.isLoading).toBe(false)
      expect(store.error).toBeNull()
    })

    it('should handle API error', async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({ isRealApi: true })
      vi.mocked(apiClient.get).mockRejectedValue(new Error('API error'))

      const store = useFermetureSessionsStore.getState()
      
      await store.loadUnilateralBilateralTypes()
      
      expect(store.unilateralBilateralTypes).toHaveLength(0)
      expect(store.error).toBe('API error')
      expect(store.isLoading).toBe(false)
    })
  })

  describe('fermerSession', () => {
    beforeEach(() => {
      const store = useFermetureSessionsStore.getState()
      store.sessions = [...MOCK_SESSIONS]
    })

    it('should close session successfully with real API', async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({ isRealApi: true })
      vi.mocked(apiClient.post)
        .mockResolvedValueOnce({ success: true, data: { valid: true, errors: [] } })
        .mockResolvedValueOnce({ success: true, data: MOCK_SESSION_CLOSE_SUCCESS })

      const store = useFermetureSessionsStore.getState()
      
      await store.fermerSession(101)
      
      expect(apiClient.post).toHaveBeenCalledWith('/api/fermeture-sessions/validate/101')
      expect(apiClient.post).toHaveBeenCalledWith('/api/fermeture-sessions/close/101')
      expect(store.sessions.find(s => s.id === 101)).toBeUndefined()
      expect(store.isClosing).toBe(false)
      expect(store.error).toBeNull()
    })

    it('should close session successfully with mock data', async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({ isRealApi: false })

      const store = useFermetureSessionsStore.getState()
      const initialCount = store.sessions.length
      
      await store.fermerSession(101)
      
      expect(store.sessions).toHaveLength(initialCount - 1)
      expect(store.sessions.find(s => s.id === 101)).toBeUndefined()
      expect(store.isClosing).toBe(false)
      expect(store.error).toBeNull()
    })

    it('should handle validation failure', async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({ isRealApi: true })
      vi.mocked(apiClient.post).mockResolvedValue({ 
        success: true, 
        data: { valid: false, errors: ['Pending operations'] } 
      })

      const store = useFermetureSessionsStore.getState()
      
      await store.fermerSession(101)
      
      expect(store.error).toBe('La session ne peut pas être fermée')
      expect(store.isClosing).toBe(false)
      expect(store.sessions.find(s => s.id === 101)).toBeDefined()
    })

    it('should handle API error during closure', async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({ isRealApi: true })
      vi.mocked(apiClient.post)
        .mockResolvedValueOnce({ success: true, data: { valid: true, errors: [] } })
        .mockRejectedValueOnce(new Error('Closure failed'))

      const store = useFermetureSessionsStore.getState()
      
      await store.fermerSession(101)
      
      expect(store.error).toBe('Closure failed')
      expect(store.isClosing).toBe(false)
    })

    it('should set closing state during request', async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({ isRealApi: false })
      
      const store = useFermetureSessionsStore.getState()
      const closePromise = store.fermerSession(101)
      
      expect(useFermetureSessionsStore.getState().isClosing).toBe(true)
      
      await closePromise
      
      expect(useFermetureSessionsStore.getState().isClosing).toBe(false)
    })
  })

  describe('generateClosureCode', () => {
    beforeEach(() => {
      const store = useFermetureSessionsStore.getState()
      store.sessions = [...MOCK_SESSIONS]
    })

    it('should generate closure code with RM-001 format', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5)

      const store = useFermetureSessionsStore.getState()
      const code = store.generateClosureCode(101)
      
      expect(code).toBe('N15.5CZ')
    })

    it('should generate closure code without decimal when D=0', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.05)

      const store = useFermetureSessionsStore.getState()
      const code = store.generateClosureCode(101)
      
      expect(code).toBe('N15CZ')
    })

    it('should return empty string for non-existent session', () => {
      const store = useFermetureSessionsStore.getState()
      const code = store.generateClosureCode(999)
      
      expect(code).toBe('')
    })

    it('should handle maximum D value (9)', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.95)

      const store = useFermetureSessionsStore.getState()
      const code = store.generateClosureCode(101)
      
      expect(code).toBe('N15.9CZ')
    })
  })

  describe('validateSessionClosure', () => {
    beforeEach(() => {
      const store = useFermetureSessionsStore.getState()
      store.sessions = [...MOCK_SESSIONS]
    })

    it('should validate session successfully with real API', async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({ isRealApi: true })
      vi.mocked(apiClient.post).mockResolvedValue({
        success: true,
        data: MOCK_VALIDATION_SUCCESS
      })

      const store = useFermetureSessionsStore.getState()
      const isValid = await store.validateSessionClosure(101)
      
      expect(apiClient.post).toHaveBeenCalledWith('/api/fermeture-sessions/validate/101')
      expect(isValid).toBe(true)
    })

    it('should validate session successfully with mock data', async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({ isRealApi: false })

      const store = useFermetureSessionsStore.getState()
      const isValid = await store.validateSessionClosure(101)
      
      expect(isValid).toBe(true)
    })

    it('should return false for non-existent session', async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({ isRealApi: false })

      const store = useFermetureSessionsStore.getState()
      const isValid = await store.validateSessionClosure(999)
      
      expect(isValid).toBe(false)
    })

    it('should return false for closed session', async () => {
      const store = useFermetureSessionsStore.getState()
      store.sessions = [{
        id: 103,
        dateOuverture: new Date('2024-01-17T09:00:00'),
        dateFermeture: new Date('2024-01-17T18:00:00'),
        statut: 'C'
      }]

      const isValid = await store.validateSessionClosure(103)
      
      expect(isValid).toBe(false)
    })

    it('should handle API error', async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({ isRealApi: true })
      vi.mocked(apiClient.post).mockRejectedValue(new Error('Validation error'))

      const store = useFermetureSessionsStore.getState()
      const isValid = await store.validateSessionClosure(101)
      
      expect(isValid).toBe(false)
    })

    it('should return false when API returns invalid', async () => {
      vi.mocked(useDataSourceStore.getState).mockReturnValue({ isRealApi: true })
      vi.mocked(apiClient.post).mockResolvedValue({
        success: true,
        data: { valid: false, errors: ['Pending operations'] }
      })

      const store = useFermetureSessionsStore.getState()
      const isValid = await store.validateSessionClosure(101)
      
      expect(isValid).toBe(false)
    })
  })

  describe('reset', () => {
    it('should reset all state to initial values', () => {
      const store = useFermetureSessionsStore.getState()
      store.sessions = [...MOCK_SESSIONS]
      store.unilateralBilateralTypes = [...MOCK_TYPES]
      store.error = 'Some error'
      store.isLoading = true
      store.isClosing = true
      
      store.reset()
      
      expect(store.sessions).toHaveLength(0)
      expect(store.currentSession).toBeNull()
      expect(store.unilateralBilateralTypes).toHaveLength(0)
      expect(store.isLoading).toBe(false)
      expect(store.error).toBeNull()
      expect(store.isClosing).toBe(false)
    })
  })
})