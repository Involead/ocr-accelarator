import { Sidebar } from "@/components/sidebar"
import { ProjectDetailView } from "@/components/project-detail-view"

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <ProjectDetailView projectId={params.id} />
      </main>
    </div>
  )
}

