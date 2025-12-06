'use client'

import { CuttingPlan, Hardware, CostBreakdown } from '@/lib/types'
import { Package, Wrench, Calculator } from 'lucide-react'

interface MaterialsTableProps {
  cuttingPlan: CuttingPlan
  hardware: Hardware[]
  cost: CostBreakdown
}

export function MaterialsTable({ cuttingPlan, hardware, cost }: MaterialsTableProps) {
  return (
    <div className="space-y-6">
      {/* Cost Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="w-5 h-5 text-primary-600" />
          <h2 className="text-xl font-semibold">Cost Summary</h2>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Materials:</span>
            <span className="font-semibold">{cost.materials.toFixed(2)} ₽</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Hardware:</span>
            <span className="font-semibold">{cost.hardware.toFixed(2)} ₽</span>
          </div>
          {cost.labor && (
            <div className="flex justify-between">
              <span className="text-gray-600">Labor:</span>
              <span className="font-semibold">{cost.labor.toFixed(2)} ₽</span>
            </div>
          )}
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between text-lg">
              <span className="font-bold">Total:</span>
              <span className="font-bold text-primary-600">{cost.total.toFixed(2)} ₽</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cutting Plan */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <Package className="w-5 h-5 text-primary-600" />
          <h2 className="text-xl font-semibold">Cutting Plan</h2>
        </div>
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            <div>Sheets: {cuttingPlan.sheets.length}</div>
            <div>Total Area: {cuttingPlan.totalSquareMeters.toFixed(2)} m²</div>
            <div>Waste: {cuttingPlan.totalWaste.toFixed(1)}%</div>
          </div>
          <div className="max-h-48 overflow-y-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Sheet</th>
                  <th className="text-right py-2">Panels</th>
                  <th className="text-right py-2">Waste</th>
                </tr>
              </thead>
              <tbody>
                {cuttingPlan.sheets.map((sheet, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2">#{index + 1}</td>
                    <td className="text-right">{sheet.panels.length}</td>
                    <td className="text-right">{sheet.waste.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Hardware List */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <Wrench className="w-5 h-5 text-primary-600" />
          <h2 className="text-xl font-semibold">Hardware</h2>
        </div>
        <div className="max-h-64 overflow-y-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Item</th>
                <th className="text-right py-2">Qty</th>
                <th className="text-right py-2">Price</th>
              </tr>
            </thead>
            <tbody>
              {hardware.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="py-2">{item.name}</td>
                  <td className="text-right">{item.quantity}</td>
                  <td className="text-right">{item.totalPrice.toFixed(2)} ₽</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
