"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { X, Upload, File, AlertCircle, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

// Add these imports at the top
import { motion, AnimatePresence } from "framer-motion"
import { isEmpty } from "lodash"

// Allowed file types
const ALLOWED_FILE_TYPES = [
  "application/pdf", // PDF
  "application/msword", // DOC
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
  "application/vnd.ms-excel", // XLS
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // XLSX
  "image/jpeg", // JPEG/JPG
  "image/png", // PNG
  "image/gif", // GIF
  "image/tiff", // TIFF
  "application/vnd.ms-powerpoint", // PPT
  "application/vnd.openxmlformats-officedocument.presentationml.presentation", // PPTX
  "text/plain", // TXT
  "application/rtf", // RTF
]

// Maximum file size (500MB in bytes)
const MAX_FILE_SIZE = 500 * 1024 * 1024

// File type display names
const FILE_TYPE_NAMES: Record<string, string> = {
  "application/pdf": "PDF",
  "application/msword": "Word",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "Word",
  "application/vnd.ms-excel": "Excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "Excel",
  "image/jpeg": "Image",
  "image/png": "Image",
  "image/gif": "Image",
  "image/tiff": "Image",
  "application/vnd.ms-powerpoint": "PowerPoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "PowerPoint",
  "text/plain": "Text",
  "application/rtf": "Rich Text",
}

// Format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

interface UploadFile {
  file: File
  id: string
  progress: number
  status: "pending" | "uploading" | "success" | "error"
  error?: string
}

interface UploadFilesModalProps {
  open: boolean
  onClose: () => void
  projectId: string
  folderId?: string | null
  projectName: string
  onUpload: (files: File[]) => void
}

export function UploadFilesModal({ open, onClose, projectId, folderId, projectName, onUpload }: UploadFilesModalProps) {
  const [files, setFiles] = useState<UploadFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Handle file selection
  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return

    const newFiles: UploadFile[] = []
    let hasErrors = false

    Array.from(selectedFiles).forEach((file) => {
      // Validate file type
      const isValidType = ALLOWED_FILE_TYPES.includes(file.type)

      // Validate file size
      const isValidSize = file.size <= MAX_FILE_SIZE

      const uploadFile: UploadFile = {
        file,
        id: `${Date.now()}-${file.name}`,
        progress: 0,
        status: "pending",
      }

      if (!isValidType) {
        uploadFile.status = "error"
        uploadFile.error = "File type not allowed"
        hasErrors = true
      } else if (!isValidSize) {
        uploadFile.status = "error"
        uploadFile.error = "File exceeds 500MB limit"
        hasErrors = true
      }

      newFiles.push(uploadFile)
    })

    setFiles((prev) => [...prev, ...newFiles])

    if (hasErrors) {
      toast({
        title: "Invalid files detected",
        description: "Some files were not added due to type or size restrictions.",
        variant: "destructive",
      })
    }
  }

  // Handle file input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files)
    // Reset the input value so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Handle drag events
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  // Remove a file from the list
  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id))
  }

  // Simulate file upload
  const uploadFiles = async () => {
    if (files.length === 0 || files.every((file) => file.status === "error")) {
      toast({
        title: "No valid files to upload",
        description: "Please add valid files to upload.",
        variant: "destructive",
      })
      return
    }

    const validFiles = files.filter((file) => file.status === "pending").map((file) => file.file)

    onUpload(validFiles)
    onClose()
  }

  // Handle modal close
  const handleClose = () => {
    if (isUploading) {
      toast({
        title: "Upload in progress",
        description: "Please wait for the upload to complete or cancel it.",
        variant: "destructive",
      })
      return
    }
    setFiles([])
    onClose()
  }

  // Update the Dialog content to include animations
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
          <Button variant="ghost" size="sm" className="absolute right-4 top-4" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 20 }}
        >
          {/* Upload destination */}
          <div className="text-sm text-gray-600">
            Uploading to:{" "}
            <span className="font-medium">
              {projectName}
              {folderId ? " / Folder" : ""}
            </span>
          </div>

          {/* Drag and drop area */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={cn(
              "border-2 border-dashed rounded-md p-8 text-center cursor-pointer transition-colors",
              isDragging ? "border-primary bg-primary/5" : "border-gray-300 hover:border-gray-400",
              isUploading ? "pointer-events-none opacity-50" : "",
            )}
            onClick={() => fileInputRef.current?.click()}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleInputChange}
              className="hidden"
              multiple
              disabled={isUploading}
            />
            <Upload className="h-10 w-10 text-gray-400 mx-auto mb-4" />
            <p className="text-lg text-gray-600 mb-2">Drag and drop files here</p>
            <p className="text-sm text-gray-500 mb-4">or click to browse</p>
            <div className="text-xs text-gray-500 space-y-1">
              <p>Allowed file types: PDF, Word, Excel, PowerPoint, Images, Text</p>
              <p>Maximum file size: 500MB</p>
            </div>
          </motion.div>

          {/* File list */}
          <AnimatePresence>
            {!isEmpty(files) && (
              <motion.div
                className="border rounded-md overflow-hidden"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: "spring", damping: 20 }}
              >
                <div className="bg-gray-50 px-4 py-2 text-sm font-medium text-gray-600 border-b">
                  Files ({files.length})
                </div>
                <div className="divide-y max-h-[200px] overflow-y-auto">
                  <AnimatePresence>
                    {files.map((file) => (
                      <motion.div
                        key={file.id}
                        className="px-4 py-3 flex items-center justify-between"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ type: "spring", damping: 20 }}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <File className="h-5 w-5 text-gray-400 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium truncate">{file.file.name}</p>
                              <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                                {formatFileSize(file.file.size)}
                              </span>
                            </div>
                            {file.status === "uploading" && <Progress value={file.progress} className="h-1 mt-1" />}
                            {file.status === "error" && (
                              <div className="flex items-center gap-1 text-xs text-red-500 mt-1">
                                <AlertCircle className="h-3 w-3" />
                                <span>{file.error}</span>
                              </div>
                            )}
                            {file.status === "success" && (
                              <div className="flex items-center gap-1 text-xs text-green-500 mt-1">
                                <CheckCircle className="h-3 w-3" />
                                <span>Upload complete</span>
                              </div>
                            )}
                          </div>
                        </div>
                        {!isUploading && file.status !== "success" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 ml-2"
                            onClick={() => removeFile(file.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isUploading}>
            Cancel
          </Button>
          <Button onClick={uploadFiles} disabled={isUploading || isEmpty(files)}>
            {isUploading ? "Uploading..." : "Upload Files"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

