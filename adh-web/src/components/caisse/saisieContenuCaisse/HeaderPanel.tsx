import type { RemiseCaisse } from "@/types/saisieContenuCaisse"

interface HeaderPanelProps {
  className?: string
  remise: RemiseCaisse | null
}

export const HeaderPanel = ({ className, remise }: HeaderPanelProps) => {
  return (
    <div className={`bg-white border-b border-gray-200 p-6 ${className || ''}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Remise en caisse
          </h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Société
            </label>
            <div className="text-lg font-semibold text-gray-900">
              {remise?.societe || '-'}
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Devise locale
            </label>
            <div className="text-lg font-semibold text-gray-900">
              {remise?.deviseLocale || '-'}
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de remise
            </label>
            <div className="text-lg font-semibold text-gray-900">
              {remise?.typeRemise || '-'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}