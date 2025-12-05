import { NextRequest, NextResponse } from 'next/server'
import { saveProject, getUserProjects } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      )
    }

    const projects = await getUserProjects(userId)
    return NextResponse.json({ success: true, projects })
  } catch (error) {
    console.error('Get projects error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get projects' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, name, cabinetData, cuttingPlan, hardware, cost } = body

    const projectId = await saveProject(
      userId || null,
      name,
      cabinetData,
      cuttingPlan,
      hardware,
      cost
    )

    return NextResponse.json({ success: true, projectId })
  } catch (error) {
    console.error('Save project error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to save project' },
      { status: 500 }
    )
  }
}
