'use client'

import { Dimensions } from '@/lib/types'
import { Ruler } from 'lucide-react'

interface DimensionInputProps {
  dimensions: Dimensions
  onChange: (dimensions: Dimensions) => void
}

export function DimensionInput({ dimensions, onChange }: DimensionInputProps) {
  const updateDimension = (field: keyof Dimensions, value: number) => {
    onChange({
      ...dimensions,
      [field]: Math.max(100, Math.min(3000, value)), // Clamp between 100-3000mm
    })
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-2 mb-4">
        <Ruler className="w-5 h-5 text-primary-600" />
        <h2 className="text-xl font-semibold">Dimensions (mm)</h2>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Width (Ширина)
          </label>
          <input
            type="number"
            value={dimensions.width}
            onChange={(e) => updateDimension('width', parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            min="100"
            max="3000"
            step="10"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Height (Высота)
          </label>
          <input
            type="number"
            value={dimensions.height}
            onChange={(e) => updateDimension('height', parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            min="100"
            max="3000"
            step="10"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Depth (Глубина)
          </label>
          <input
            type="number"
            value={dimensions.depth}
            onChange={(e) => updateDimension('depth', parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            min="100"
            max="1000"
            step="10"
          />
        </div>
      </div>
    </div>
  )
}
