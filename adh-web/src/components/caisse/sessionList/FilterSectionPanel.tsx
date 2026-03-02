import { useCallback } from "react"
import type { SessionFilter } from "@/types/session"

interface FilterSectionPanelProps {
  filters: SessionFilter
  onFiltersChange: (filters: Partial<SessionFilter>) => void
  societeOptions: string[]
  isLoading?: boolean
  className?: string
}

export const FilterSectionPanel = ({
  filters,
  onFiltersChange,
  societeOptions,
  isLoading = false,
  className
}: FilterSectionPanelProps) => {
  const handleExisteSessionChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ existeSession: event.target.checked })
  }, [onFiltersChange])

  const handleExisteSessionOuverteChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ existeSessionOuverte: event.target.checked })
  }, [onFiltersChange])

  const handleSocieteChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value
    onFiltersChange({ societe: value === '' ? null : value })
  }, [onFiltersChange])

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 space-y-4 ${className || ''}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtres</h3>
      
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <input
            id="existe-session"
            type="checkbox"
            checked={filters.existeSession}
            onChange={handleExisteSessionChange}
            disabled={isLoading}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 disabled:opacity-50"
          />
          <label
            htmlFor="existe-session"
            className="text-sm font-medium text-gray-700 cursor-pointer"
          >
            Existe session
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            id="existe-session-ouverte"
            type="checkbox"
            checked={filters.existeSessionOuverte}
            onChange={handleExisteSessionOuverteChange}
            disabled={isLoading}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 disabled:opacity-50"
          />
          <label
            htmlFor="existe-session-ouverte"
            className="text-sm font-medium text-gray-700 cursor-pointer"
          >
            Existe session ouverte
          </label>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="societe-select"
            className="block text-sm font-medium text-gray-700"
          >
            Société
          </label>
          <select
            id="societe-select"
            value={filters.societe || ''}
            onChange={handleSocieteChange}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">Toutes les sociétés</option>
            {societeOptions.map((societe) => (
              <option key={societe} value={societe}>
                {societe}
              </option>
            ))}
          </select>
          {societeOptions.length === 0 && !isLoading && (
            <p className="text-sm text-gray-500 italic">Aucune société disponible</p>
          )}
        </div>
      </div>
    </div>
  )
}