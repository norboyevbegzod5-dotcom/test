'use client'

import { useState } from 'react'
import { DimensionInput } from '@/components/DimensionInput'
import { ModuleEditor } from '@/components/ModuleEditor'
import { RenderViewer } from '@/components/RenderViewer'
import { MaterialsTable } from '@/components/MaterialsTable'
import { generateCabinet } from '@/lib/geometryEngine'
import { optimizeCutting } from '@/lib/cuttingEngine'
import { calculateHardware } from '@/lib/hardwareEngine'
import { calculateProjectCost } from '@/lib/costCalculator'
import { Material, MaterialThickness, Project, Specification } from '@/lib/types'
import { Save, Download, FileText } from 'lucide-react'
import { exportToPDF, exportToExcel } from '@/lib/export'
import { calculatePanels } from '@/lib/geometryEngine'

export default function ConstructorPage() {
  const [dimensions, setDimensions] = useState({
    width: 800,
    height: 2000,
    depth: 500,
  })
  const [materialThickness, setMaterialThickness] = useState<MaterialThickness>(16)
  const [material, setMaterial] = useState<Material>({
    type: 'ЛДСП',
    thickness: 16,
    pricePerSquareMeter: 1200,
    name: 'ЛДСП 16мм',
  })
  const [doorType, setDoorType] = useState<'swing' | 'sliding' | 'none'>('swing')
  const [shelfCount, setShelfCount] = useState(2)
  const [partitionCount, setPartitionCount] = useState(0)
  const [projectName, setProjectName] = useState('New Project')
  const [saving, setSaving] = useState(false)

  // Generate cabinet
  const cabinet = generateCabinet(
    dimensions.width,
    dimensions.height,
    dimensions.depth,
    materialThickness,
    material,
    doorType,
    shelfCount,
    partitionCount
  )

  // Calculate project details
  const { cuttingPlan, hardware, cost } = calculateProjectCost(cabinet)

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: null, // TODO: Get from auth
          name: projectName,
          cabinetData: cabinet,
          cuttingPlan,
          hardware,
          cost,
        }),
      })
      const data = await response.json()
      if (data.success) {
        alert('Project saved successfully!')
      } else {
        alert('Failed to save project')
      }
    } catch (error) {
      console.error('Save error:', error)
      alert('Error saving project')
    } finally {
      setSaving(false)
    }
  }

  const handleExportPDF = () => {
    const panels = calculatePanels(cabinet)
    const project: Project = {
      id: `temp-${Date.now()}`,
      name: projectName,
      cabinet,
      cuttingPlan,
      hardware,
      cost,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    const specification: Specification = {
      project,
      panels,
      hardware,
      cuttingPlan,
      cost,
    }
    exportToPDF(specification)
  }

  const handleExportExcel = () => {
    const panels = calculatePanels(cabinet)
    const project: Project = {
      id: `temp-${Date.now()}`,
      name: projectName,
      cabinet,
      cuttingPlan,
      hardware,
      cost,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    const specification: Specification = {
      project,
      panels,
      hardware,
      cuttingPlan,
      cost,
    }
    exportToExcel(specification)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Furniture Constructor</h1>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              <FileText className="w-4 h-4" />
              PDF
            </button>
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Download className="w-4 h-4" />
              Excel
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Inputs */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Project Settings</h2>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg mb-4"
                placeholder="Project name"
              />
            </div>

            <DimensionInput
              dimensions={dimensions}
              onChange={setDimensions}
            />

            <ModuleEditor
              materialThickness={materialThickness}
              onMaterialThicknessChange={setMaterialThickness}
              material={material}
              onMaterialChange={setMaterial}
              doorType={doorType}
              onDoorTypeChange={setDoorType}
              shelfCount={shelfCount}
              onShelfCountChange={setShelfCount}
              partitionCount={partitionCount}
              onPartitionCountChange={setPartitionCount}
            />
          </div>

          {/* Middle Column - 3D Preview */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">3D Preview</h2>
              <div className="h-96 border rounded-lg">
                <RenderViewer cabinet={cabinet} />
              </div>
            </div>
          </div>

          {/* Right Column - Materials & Cost */}
          <div className="lg:col-span-1 space-y-6">
            <MaterialsTable
              cuttingPlan={cuttingPlan}
              hardware={hardware}
              cost={cost}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
