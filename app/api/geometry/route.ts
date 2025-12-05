import { NextRequest, NextResponse } from 'next/server'
import { generateCabinet, calculatePanels } from '@/lib/geometryEngine'
import { Material, MaterialThickness } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      width,
      height,
      depth,
      materialThickness = 16,
      material,
      doorType = 'swing',
      shelfCount = 1,
      partitionCount = 0,
    } = body

    const cabinet = generateCabinet(
      width,
      height,
      depth,
      materialThickness as MaterialThickness,
      material as Material,
      doorType,
      shelfCount,
      partitionCount
    )

    const panels = calculatePanels(cabinet)

    return NextResponse.json({
      success: true,
      cabinet,
      panels,
    })
  } catch (error) {
    console.error('Geometry calculation error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to calculate geometry' },
      { status: 500 }
    )
  }
}
