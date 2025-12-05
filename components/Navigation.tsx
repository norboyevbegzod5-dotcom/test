'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Box, Settings, LogOut } from 'lucide-react'
import { signOut } from '@/lib/auth'

export function Navigation() {
  const pathname = usePathname()

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/'
  }

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/constructor', label: 'Constructor', icon: Settings },
    { href: '/projects', label: 'Projects', icon: Box },
  ]

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold text-primary-600">
              Furniture Tool
            </Link>
            <div className="flex gap-4">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  )
}
