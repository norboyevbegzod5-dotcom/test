import { NextRequest, NextResponse } from 'next/server'
import { optimizeCutting } from '@/lib/cuttingEngine'
import { Panel } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { panels, sheetWidth = 2800, sheetHeight = 2070 } = body

    const cuttingPlan = optimizeCutting(
      panels as Panel[],
      sheetWidth,
      sheetHeight
    )

    return NextResponse.json({
      success: true,
      cuttingPlan,
    })
  } catch (error) {
    console.error('Cutting optimization error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to optimize cutting' },
      { status: 500 }
    )
  }
}
