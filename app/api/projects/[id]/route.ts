import { NextRequest, NextResponse } from 'next/server'
import { getProject, updateProject, deleteProject } from '@/lib/database'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')

    const project = await getProject(id, userId || undefined)
    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, project })
  } catch (error) {
    console.error('Get project error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get project' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { userId, name, cabinetData, cuttingPlan, hardware, cost } = body

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      )
    }

    await updateProject(id, userId, name, cabinetData, cuttingPlan, hardware, cost)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update project error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update project' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      )
    }

    await deleteProject(id, userId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete project error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete project' },
      { status: 500 }
    )
  }
}
