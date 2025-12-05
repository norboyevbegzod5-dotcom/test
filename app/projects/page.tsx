'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Folder, Calendar, Trash2 } from 'lucide-react'

interface Project {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    // TODO: Load projects from database
    // For now, use mock data
    setProjects([
      {
        id: '1',
        name: 'Kitchen Cabinet',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ])
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
          <Link
            href="/constructor"
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <Plus className="w-4 h-4" />
            New Project
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Folder className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No projects yet</p>
            <Link
              href="/constructor"
              className="inline-block px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Create Your First Project
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold">{project.name}</h3>
                  <button className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Updated: {new Date(project.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <Link
                  href={`/constructor?project=${project.id}`}
                  className="block w-full text-center px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200"
                >
                  Open
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
