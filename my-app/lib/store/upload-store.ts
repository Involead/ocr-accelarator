import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"
import { omit } from "lodash"

export type UploadStatus = "uploading" | "processing" | "completed" | "failed"

export interface UploadFile {
  id: string
  name: string
  projectName: string
  projectId: string
  folderId?: string | null
  timestamp: string
  status: UploadStatus
  progress: number
  error?: string
}

interface UploadState {
  files: UploadFile[]
  showStatusWindow: boolean
  isMinimized: boolean
  activeTab: "all" | "completed" | "failed"
  // Actions
  addFiles: (files: Omit<UploadFile, "id" | "timestamp" | "status" | "progress">[]) => void
  updateFileProgress: (id: string, progress: number) => void
  updateFileStatus: (id: string, status: UploadStatus, error?: string) => void
  removeFile: (id: string) => void
  clearCompleted: () => void
  setShowStatusWindow: (show: boolean) => void
  setMinimized: (minimized: boolean) => void
  setActiveTab: (tab: "all" | "completed" | "failed") => void
}

export const useUploadStore = create<UploadState>()(
  devtools(
    persist(
      (set, get) => ({
        files: [],
        showStatusWindow: false,
        isMinimized: false,
        activeTab: "all",

        addFiles: (newFiles) => {
          const files = newFiles.map((file) => ({
            ...file,
            id: `${Date.now()}-${file.name}`,
            timestamp: new Date().toLocaleString(),
            status: "uploading" as UploadStatus,
            progress: 0,
          }))

          set((state) => ({
            files: [...state.files, ...files],
            showStatusWindow: true,
            isMinimized: false,
          }))

          return files
        },

        updateFileProgress: (id, progress) => {
          set((state) => ({
            files: state.files.map((file) => (file.id === id ? { ...file, progress } : file)),
          }))
        },

        updateFileStatus: (id, status, error) => {
          set((state) => ({
            files: state.files.map((file) =>
              file.id === id ? { ...file, status, ...(error ? { error } : {}) } : file,
            ),
          }))
        },

        removeFile: (id) => {
          set((state) => ({
            files: state.files.filter((file) => file.id !== id),
          }))
        },

        clearCompleted: () => {
          set((state) => ({
            files: state.files.filter((file) => file.status !== "completed"),
          }))
        },

        setShowStatusWindow: (show) => {
          set({ showStatusWindow: show })
        },

        setMinimized: (minimized) => {
          set({ isMinimized: minimized })
        },

        setActiveTab: (tab) => {
          set({ activeTab: tab })
        },
      }),
      {
        name: "upload-storage",
        partialize: (state) => omit(state, ["showStatusWindow", "isMinimized"]),
      },
    ),
  ),
)

