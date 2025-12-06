import { NextRequest, NextResponse } from 'next/server'
import { exportToExcel } from '@/lib/export'
import { Specification } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { specification } = body

    // Generate Excel (this will download on client side)
    exportToExcel(specification as Specification)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Excel export error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to export Excel' },
      { status: 500 }
    )
  }
}
