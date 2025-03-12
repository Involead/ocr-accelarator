"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, X } from "lucide-react"

type UploadFile = {
  id: string
  name: string
  project: string
  date: string
  status: "completed" | "failed" | "uploading"
}

export function UploadModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [files, setFiles] = useState<UploadFile[]>([
    { id: "1", name: "document_name.pdf", project: "Project n", date: "2025-02-13 at 2:18 PM", status: "completed" },
    { id: "2", name: "document_name.pdf", project: "Project n", date: "2025-02-13 at 2:18 PM", status: "completed" },
    { id: "3", name: "document_name.pdf", project: "Project n", date: "2025-02-13 at 2:18 PM", status: "completed" },
    { id: "4", name: "document_name.pdf", project: "Project n", date: "2025-02-13 at 2:18 PM", status: "completed" },
  ])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Uploads</DialogTitle>
          <Button variant="ghost" size="sm" className="absolute right-4 top-4" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <Tabs defaultValue="all">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="all">All uploads</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="failed">Failed</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-2">
            {files.map((file) => (
              <div key={file.id} className="bg-gray-200 p-4 rounded-md flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-gray-600" />
                <div className="flex-1">
                  <div className="font-medium">{file.name}</div>
                  <div className="text-sm text-gray-600">{file.date}</div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Uploaded to</span>
                  <span className="font-medium">{file.project}</span>
                </div>
              </div>
            ))}
          </TabsContent>
          <TabsContent value="completed">
            <div className="text-center py-4 text-gray-500">No completed uploads</div>
          </TabsContent>
          <TabsContent value="failed">
            <div className="text-center py-4 text-gray-500">No failed uploads</div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

