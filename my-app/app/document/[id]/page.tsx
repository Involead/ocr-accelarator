import { Sidebar } from "@/components/sidebar"
import { DocumentView } from "@/components/document-view"

export default function DocumentPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <DocumentView documentId={params.id} />
      </main>
    </div>
  )
}

