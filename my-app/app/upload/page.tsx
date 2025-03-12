import { Sidebar } from "@/components/sidebar"
import { DropZone } from "@/components/drop-zone"

export default function UploadPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Upload Documents</h1>
        <div className="bg-white p-6 rounded-md shadow-sm">
          <DropZone />
        </div>
      </main>
    </div>
  )
}

