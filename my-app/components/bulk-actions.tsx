import { Button } from "@/components/ui/button"
import { Edit, Download } from "lucide-react"

interface BulkActionsProps {
  selectedCount: number
}

export function BulkActions({ selectedCount = 0 }: BulkActionsProps) {
  // Determine if buttons should be enabled
  const isDisabled = selectedCount === 0

  return (
    <div className="flex gap-2 items-center">
      <Button
        variant="outline"
        size="sm"
        disabled={isDisabled}
        className={isDisabled ? "opacity-50 cursor-not-allowed" : ""}
      >
        <Edit className="h-4 w-4 mr-2" />
        Edit Form Type
      </Button>
      <Button
        variant="outline"
        size="sm"
        disabled={isDisabled}
        className={isDisabled ? "opacity-50 cursor-not-allowed" : ""}
      >
        <Download className="h-4 w-4 mr-2" />
        Extract Data
      </Button>
    </div>
  )
}

