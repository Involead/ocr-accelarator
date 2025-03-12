"use client"

import { useState } from "react"
import { Search } from "@/components/search"
import { BulkActions } from "@/components/bulk-actions"
import { DocumentList } from "@/components/document-list"
import { StatsCards } from "@/components/stats-cards"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<"all" | "review">("all")
  // Initialize with empty array to avoid undefined
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([])

  return (
    <div className="p-6 font-sans">
      <div className="mb-6">
        <Search />
      </div>
      <div className="flex justify-between items-center mb-6">
        <StatsCards />
        <Button className="bg-gray-500 text-white hover:bg-gray-600">
          <PlusCircle className="h-4 w-4 mr-2" />
          Create Project
        </Button>
      </div>
      <div className="flex justify-between items-center mb-6">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <Button
            variant={activeTab === "all" ? "default" : "outline"}
            className={`rounded-r-none ${activeTab === "all" ? "bg-primary text-primary-foreground" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            All files
          </Button>
          <Button
            variant={activeTab === "review" ? "default" : "outline"}
            className={`rounded-l-none ${activeTab === "review" ? "bg-primary text-primary-foreground" : ""}`}
            onClick={() => setActiveTab("review")}
          >
            Review
          </Button>
        </div>
        <BulkActions selectedCount={selectedDocuments?.length || 0} />
      </div>
      <DocumentList
        filterReview={activeTab === "review"}
        selectedDocuments={selectedDocuments}
        setSelectedDocuments={setSelectedDocuments}
      />
    </div>
  )
}

