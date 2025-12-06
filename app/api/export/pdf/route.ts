import { NextRequest, NextResponse } from 'next/server'
import { exportToPDF } from '@/lib/export'
import { Specification } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { specification } = body

    // Generate PDF (this will download on client side)
    // For server-side, we'd need to return the PDF buffer
    exportToPDF(specification as Specification)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('PDF export error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to export PDF' },
      { status: 500 }
    )
  }
}
