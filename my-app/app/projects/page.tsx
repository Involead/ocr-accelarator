import { Sidebar } from "@/components/sidebar"
import { ProjectsView } from "@/components/projects-view"

export default function ProjectsPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <ProjectsView />
      </main>
    </div>
  )
}

