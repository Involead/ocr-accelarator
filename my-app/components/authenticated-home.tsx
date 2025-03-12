"use client"

import { Sidebar } from "@/components/sidebar"
import { Dashboard } from "@/components/dashboard"

export function AuthenticatedHome() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Dashboard />
      </main>
    </div>
  )
}

