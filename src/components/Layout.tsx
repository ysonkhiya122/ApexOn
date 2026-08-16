import { ReactNode } from 'react'
import { cn } from '../utils/cn'

interface LayoutProps {
  children: ReactNode
  className?: string
}

export function Layout({ children, className }: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950">
      <header className="sticky top-0 z-50 bg-slate-900 shadow-lg border-b border-slate-800">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">ApexOn</h1>
          <div className="flex gap-6">
            <a href="/" className="text-gray-300 hover:text-white transition-colors">
              Home
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">
              Schedules
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">
              Results
            </a>
          </div>
        </nav>
      </header>

      <main className={cn('max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8', className)}>
        {children}
      </main>

      <footer className="bg-slate-900 border-t border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-400">
            © {new Date().getFullYear()} ApexOn. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
