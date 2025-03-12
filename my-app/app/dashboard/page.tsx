import { Sidebar } from "@/components/sidebar"
import { Dashboard } from "@/components/dashboard"

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Dashboard />
      </main>
    </div>
  )
}

