"use client"

import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { Search } from "@/components/search"
import { ProjectBulkActions } from "@/components/project-bulk-actions"
import { ProjectFilesList } from "@/components/project-files-list"
import { Button } from "@/components/ui/button"
import { fetchProjects } from "@/lib/projects-service"
import { fetchProjectFiles } from "@/lib/project-files-service"
import { Download, FolderPlus } from "lucide-react"
import { UploadFilesModal } from "@/components/upload-files-modal"
import { UploadStatusWindow } from "@/components/upload-status-window"
import { useUploadStore } from "@/lib/store/upload-store"
import { motion, AnimatePresence } from "framer-motion"
import { debounce } from "lodash"

type FilterView = "all" | "recent" | "review"

export function ProjectDetailView({ projectId }: { projectId: string }) {
  const [activeFilter, setActiveFilter] = useState<FilterView>("all")
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

  const { addFiles, updateFileProgress, updateFileStatus } = useUploadStore()

  // Debounced search handler
  const debouncedSetSearchQuery = debounce(setSearchQuery, 300)

  // Reset state when project changes
  useEffect(() => {
    setActiveFilter("all")
    setSelectedFiles([])
    setSearchQuery("")
    setCurrentFolderId(null)
  }, [projectId])

  // Fetch project details
  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Find the current project
  const currentProject = projects.find((project) => project.id === projectId)
  const projectName = currentProject?.name || "Project"

  // Fetch project files
  const {
    data: filesData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["project-files", projectId, activeFilter, currentFolderId],
    queryFn: () => fetchProjectFiles(projectId, activeFilter, currentFolderId),
    staleTime: 60 * 1000, // 1 minute
  })

  // Filter files based on search query
  const filteredFiles = filesData?.filter((file) => file.name.toLowerCase().includes(searchQuery.toLowerCase())) || []

  // Handle folder navigation
  const handleFolderClick = (folderId: string) => {
    setCurrentFolderId(folderId)
    setSelectedFiles([])
  }

  // Handle back navigation
  const handleBackClick = () => {
    setCurrentFolderId(null)
    setSelectedFiles([])
  }

  // Handle new uploads
  const handleNewUploads = (files: File[]) => {
    // Add files to upload store
    const uploadFiles = addFiles(
      files.map((file) => ({
        name: file.name,
        projectName: `${projectName}${currentFolderId ? " / Folder" : ""}`,
        projectId,
        folderId: currentFolderId,
      })),
    )

    // Simulate upload and processing for each file
    uploadFiles.forEach((uploadFile) => {
      let progress = 0
      const uploadInterval = setInterval(() => {
        progress += Math.random() * 10
        if (progress >= 100) {
          clearInterval(uploadInterval)
          updateFileProgress(uploadFile.id, 100)
          updateFileStatus(uploadFile.id, "processing")

          // Simulate processing
          setTimeout(
            () => {
              updateFileStatus(uploadFile.id, "completed")
              // Refetch files after upload completes
              refetch()
            },
            2000 + Math.random() * 3000,
          )
        } else {
          updateFileProgress(uploadFile.id, Math.round(progress))
        }
      }, 200)
    })
  }

  return (
    <motion.div className="p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className="mb-6">
        <Search onSearch={debouncedSetSearchQuery} />
      </div>
      <div className="space-y-4 mb-6">
        {/* Upload and Create Folder buttons */}
        <motion.div
          className="flex gap-2"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Button variant="outline" size="sm" onClick={() => setIsUploadModalOpen(true)}>
            <Download className="h-4 w-4 mr-2 rotate-180" />
            Upload or drop
          </Button>
          <Button variant="outline" size="sm">
            <FolderPlus className="h-4 w-4 mr-2" />
            Create folder
          </Button>
        </motion.div>

        <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
          <h2 className="text-lg font-medium text-gray-800">
            All files - {projectName}
            {currentFolderId && " / Folder"}
          </h2>
        </motion.div>

        {/* Tabs and Bulk Actions on the same line */}
        <motion.div
          className="flex justify-between items-center"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <Button
              variant={activeFilter === "all" ? "default" : "outline"}
              className={`rounded-r-none ${activeFilter === "all" ? "bg-primary text-primary-foreground" : ""}`}
              onClick={() => setActiveFilter("all")}
            >
              All files
            </Button>
            <Button
              variant={activeFilter === "recent" ? "default" : "outline"}
              className={`rounded-l-none rounded-r-none border-l-0 ${activeFilter === "recent" ? "bg-primary text-primary-foreground" : ""}`}
              onClick={() => setActiveFilter("recent")}
            >
              Recents
            </Button>
            <Button
              variant={activeFilter === "review" ? "default" : "outline"}
              className={`rounded-l-none border-l-0 ${activeFilter === "review" ? "bg-primary text-primary-foreground" : ""}`}
              onClick={() => setActiveFilter("review")}
            >
              Review
            </Button>
          </div>

          <ProjectBulkActions selectedCount={selectedFiles.length} />
        </motion.div>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, type: "spring", damping: 20 }}
      >
        <ProjectFilesList
          files={filteredFiles}
          isLoading={isLoading}
          isError={isError}
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
          onFolderClick={handleFolderClick}
          onBackClick={handleBackClick}
          isInFolder={!!currentFolderId}
        />
      </motion.div>

      {/* Upload Files Modal */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <UploadFilesModal
            open={isUploadModalOpen}
            onClose={() => setIsUploadModalOpen(false)}
            projectId={projectId}
            folderId={currentFolderId}
            projectName={projectName}
            onUpload={handleNewUploads}
          />
        )}
      </AnimatePresence>

      {/* Upload Status Window */}
      <UploadStatusWindow />
    </motion.div>
  )
}

