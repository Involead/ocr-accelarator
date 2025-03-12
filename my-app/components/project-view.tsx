import { Search } from "@/components/search"
import { BulkActions } from "@/components/bulk-actions"
import { DocumentList } from "@/components/document-list"
import { Button } from "@/components/ui/button"

export function ProjectView({ projectId }: { projectId: string }) {
  return (
    <div className="p-6">
      <div className="mb-6">
        <Search />
      </div>
      <div className="space-y-4 mb-6">
        <BulkActions />
        <div>
          <h2 className="text-lg font-medium text-gray-800">All files - Project n</h2>
          <div className="mt-2 flex gap-2">
            <Button variant="outline" size="sm">
              Recents
            </Button>
            <Button variant="outline" size="sm">
              Review
            </Button>
          </div>
        </div>
      </div>
      <DocumentList />
    </div>
  )
}

