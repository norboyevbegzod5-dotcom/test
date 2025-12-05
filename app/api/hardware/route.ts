import { NextRequest, NextResponse } from 'next/server'
import { calculateHardware } from '@/lib/hardwareEngine'
import { Cabinet } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { cabinet } = body

    const hardware = calculateHardware(cabinet as Cabinet)

    return NextResponse.json({
      success: true,
      hardware,
    })
  } catch (error) {
    console.error('Hardware calculation error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to calculate hardware' },
      { status: 500 }
    )
  }
}
