'use client'

import { Material, MaterialThickness, MaterialType } from '@/lib/types'
import { Settings } from 'lucide-react'

interface ModuleEditorProps {
  materialThickness: MaterialThickness
  onMaterialThicknessChange: (thickness: MaterialThickness) => void
  material: Material
  onMaterialChange: (material: Material) => void
  doorType: 'swing' | 'sliding' | 'none'
  onDoorTypeChange: (type: 'swing' | 'sliding' | 'none') => void
  shelfCount: number
  onShelfCountChange: (count: number) => void
  partitionCount: number
  onPartitionCountChange: (count: number) => void
}

export function ModuleEditor({
  materialThickness,
  onMaterialThicknessChange,
  material,
  onMaterialChange,
  doorType,
  onDoorTypeChange,
  shelfCount,
  onShelfCountChange,
  partitionCount,
  onPartitionCountChange,
}: ModuleEditorProps) {
  const materialTypes: MaterialType[] = ['ЛДСП', 'МДФ', 'Фанера']
  const thicknesses: MaterialThickness[] = [16, 18, 25]

  const updateMaterialType = (type: MaterialType) => {
    onMaterialChange({
      ...material,
      type,
      thickness: materialThickness,
    })
  }

  const updateMaterialPrice = (price: number) => {
    onMaterialChange({
      ...material,
      pricePerSquareMeter: price,
    })
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5 text-primary-600" />
        <h2 className="text-xl font-semibold">Module Settings</h2>
      </div>

      <div className="space-y-4">
        {/* Material Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Material Type
          </label>
          <select
            value={material.type}
            onChange={(e) => updateMaterialType(e.target.value as MaterialType)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            {materialTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Material Thickness */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Thickness (mm)
          </label>
          <select
            value={materialThickness}
            onChange={(e) =>
              onMaterialThicknessChange(parseInt(e.target.value) as MaterialThickness)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            {thicknesses.map((thickness) => (
              <option key={thickness} value={thickness}>
                {thickness} mm
              </option>
            ))}
          </select>
        </div>

        {/* Material Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price per m² (₽)
          </label>
          <input
            type="number"
            value={material.pricePerSquareMeter}
            onChange={(e) => updateMaterialPrice(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            min="0"
            step="10"
          />
        </div>

        {/* Door Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Door Type
          </label>
          <select
            value={doorType}
            onChange={(e) =>
              onDoorTypeChange(e.target.value as 'swing' | 'sliding' | 'none')
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="swing">Swing Doors</option>
            <option value="sliding">Sliding Doors</option>
            <option value="none">No Doors</option>
          </select>
        </div>

        {/* Shelf Count */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Shelves Count
          </label>
          <input
            type="number"
            value={shelfCount}
            onChange={(e) => onShelfCountChange(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            min="0"
            max="10"
          />
        </div>

        {/* Partition Count */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Partitions Count
          </label>
          <input
            type="number"
            value={partitionCount}
            onChange={(e) =>
              onPartitionCountChange(Math.max(0, parseInt(e.target.value) || 0))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            min="0"
            max="5"
          />
        </div>
      </div>
    </div>
  )
}
