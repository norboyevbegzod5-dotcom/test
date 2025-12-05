import Link from 'next/link'
import { Ruler, Calculator, Box, FileText } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Furniture Design & Calculation Tool
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Professional furniture design, material calculation, and cost estimation
            similar to Базис Мебельщик
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <Link
            href="/constructor"
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow group"
          >
            <Ruler className="w-12 h-12 text-primary-600 mb-4 group-hover:scale-110 transition-transform" />
            <h2 className="text-xl font-semibold mb-2">Constructor</h2>
            <p className="text-gray-600">
              Design your furniture with automatic component calculation
            </p>
          </Link>

          <Link
            href="/projects"
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow group"
          >
            <Box className="w-12 h-12 text-primary-600 mb-4 group-hover:scale-110 transition-transform" />
            <h2 className="text-xl font-semibold mb-2">Projects</h2>
            <p className="text-gray-600">
              View and manage your saved furniture projects
            </p>
          </Link>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <Calculator className="w-12 h-12 text-primary-600 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Calculator</h2>
            <p className="text-gray-600">
              Material cutting optimization and cost calculation
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <FileText className="w-12 h-12 text-primary-600 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Specifications</h2>
            <p className="text-gray-600">
              Generate detailed project specifications and exports
            </p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/constructor"
            className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Start Designing
          </Link>
        </div>
      </div>
    </div>
  )
}
