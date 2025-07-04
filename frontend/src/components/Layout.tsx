import React, { ReactNode } from "react"
import { Search, User } from "lucide-react"
import Sidebar from "./Sidebar"

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r">
        <Sidebar />
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between bg-white px-6 py-4 border-b">
          <h1 className="text-2xl font-semibold">Coffee Shop</h1>
          <div className="flex items-center space-x-4">
            <button aria-label="Search" className="p-2 hover:bg-gray-100 rounded">
              <Search className="w-5 h-5 text-gray-600" />
            </button>
            <button aria-label="Profile" className="p-2 hover:bg-gray-100 rounded">
              <User className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>

        {/* Footer */}
        <footer className="bg-white text-center py-4 border-t">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Coffee Shop. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  )
}
