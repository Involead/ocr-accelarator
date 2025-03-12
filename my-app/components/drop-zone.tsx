"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"

export function DropZone() {
  const [files, setFiles] = useState<File[]>([])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-gray-300 rounded-md p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:border-gray-400 transition-colors"
    >
      <input {...getInputProps()} />
      <div className="mb-4">
        <Upload className="h-12 w-12 text-gray-400 mx-auto" />
      </div>
      <p className="text-lg text-gray-600 mb-2">Drop files here to upload</p>
      <Button variant="secondary" className="mt-4 bg-gray-500 text-white hover:bg-gray-600">
        Upload
      </Button>
    </div>
  )
}

