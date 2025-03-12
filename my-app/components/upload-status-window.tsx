"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Minus, CheckCircle, AlertCircle, ChevronUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useUploadStore } from "@/lib/store/upload-store"
import { isEmpty } from "lodash"

export function UploadStatusWindow() {
  const {
    files,
    showStatusWindow,
    isMinimized,
    activeTab,
    setMinimized,
    setShowStatusWindow,
    clearCompleted,
    setActiveTab,
  } = useUploadStore()

  // Auto-expand when new files are added
  useEffect(() => {
    if (files.some((file) => file.status === "uploading" || file.status === "processing")) {
      setMinimized(false)
    }
  }, [files, setMinimized])

  // Close window if no files
  useEffect(() => {
    if (isEmpty(files)) {
      setShowStatusWindow(false)
    }
  }, [files, setShowStatusWindow])

  const completedFiles = files.filter((file) => file.status === "completed")
  const failedFiles = files.filter((file) => file.status === "failed")
  const activeFiles = files.filter((file) => file.status === "uploading" || file.status === "processing")

  const getFilteredFiles = () => {
    switch (activeTab) {
      case "completed":
        return completedFiles
      case "failed":
        return failedFiles
      default:
        return files
    }
  }

  if (!showStatusWindow || isEmpty(files)) return null

  return (
    <motion.div
      className="fixed bottom-4 right-4 w-[400px] bg-white rounded-lg shadow-lg border border-gray-200 z-50"
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
      data-testid="upload-status-window"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <h3 className="font-medium">Uploads</h3>
          {activeFiles.length > 0 && (
            <motion.span
              className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", damping: 20 }}
            >
              {activeFiles.length} in progress
            </motion.span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setMinimized(!isMinimized)}
            aria-label={isMinimized ? "Expand" : "Minimize"}
          >
            {isMinimized ? <ChevronUp className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setShowStatusWindow(false)}
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            className="p-2"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
              <TabsList className="grid w-full grid-cols-3 mb-2">
                <TabsTrigger value="all">
                  All uploads
                  {files.length > 0 && <span className="ml-1">({files.length})</span>}
                </TabsTrigger>
                <TabsTrigger value="completed">
                  Completed
                  {completedFiles.length > 0 && <span className="ml-1">({completedFiles.length})</span>}
                </TabsTrigger>
                <TabsTrigger value="failed">
                  Failed
                  {failedFiles.length > 0 && <span className="ml-1">({failedFiles.length})</span>}
                </TabsTrigger>
              </TabsList>

              <ScrollArea className="h-[300px]">
                <motion.div
                  className="space-y-2"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: { transition: { staggerChildren: 0.05 } },
                  }}
                >
                  <AnimatePresence>
                    {getFilteredFiles().map((file) => (
                      <UploadFileItem key={file.id} file={file} />
                    ))}
                  </AnimatePresence>
                </motion.div>
              </ScrollArea>

              {activeTab === "completed" && completedFiles.length > 0 && (
                <div className="mt-2 flex justify-end">
                  <Button variant="ghost" size="sm" onClick={clearCompleted}>
                    Clear completed
                  </Button>
                </div>
              )}
            </Tabs>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function UploadFileItem({ file }: { file: ReturnType<typeof useUploadStore>["files"][0] }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", damping: 20 }}
      className={`p-3 rounded-md ${file.status === "failed" ? "bg-red-50" : "bg-gray-50"}`}
      data-testid={`upload-file-${file.id}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {file.status === "completed" && <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />}
            {file.status === "failed" && <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />}
            <span className="text-sm font-medium truncate">{file.name}</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">Uploaded to {file.projectName}</div>
          {file.status === "failed" && file.error && <div className="text-xs text-red-500 mt-1">{file.error}</div>}
          {(file.status === "uploading" || file.status === "processing") && (
            <div className="flex items-center gap-2 mt-2">
              <motion.div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${file.progress}%` }}
                  transition={{ type: "spring", damping: 20 }}
                />
              </motion.div>
              <span className="text-xs text-gray-500">{file.progress}%</span>
            </div>
          )}
        </div>
        <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{file.timestamp}</span>
      </div>
    </motion.div>
  )
}

