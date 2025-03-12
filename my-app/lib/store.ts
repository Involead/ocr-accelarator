import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Document = {
  id: string
  name: string
  type: "file" | "folder"
  formType?: string
  status?: "Completed" | "Pending" | "Not Started"
  modified?: string
  project?: string
  reviewed?: boolean
}

export type Project = {
  id: string
  name: string
  documents: Document[]
}

type Store = {
  projects: Project[]
  selectedProject: string | null
  selectedDocuments: string[]
  addProject: (project: Project) => void
  addDocument: (projectId: string, document: Document) => void
  selectProject: (projectId: string | null) => void
  selectDocument: (documentId: string) => void
  unselectDocument: (documentId: string) => void
  selectAllDocuments: (projectId: string) => void
  unselectAllDocuments: () => void
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      projects: [],
      selectedProject: null,
      selectedDocuments: [],
      addProject: (project) =>
        set((state) => ({
          projects: [...state.projects, project],
        })),
      addDocument: (projectId, document) =>
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === projectId ? { ...project, documents: [...project.documents, document] } : project,
          ),
        })),
      selectProject: (projectId) => set({ selectedProject: projectId }),
      selectDocument: (documentId) =>
        set((state) => ({
          selectedDocuments: [...state.selectedDocuments, documentId],
        })),
      unselectDocument: (documentId) =>
        set((state) => ({
          selectedDocuments: state.selectedDocuments.filter((id) => id !== documentId),
        })),
      selectAllDocuments: (projectId) =>
        set((state) => {
          const project = state.projects.find((p) => p.id === projectId)
          if (!project) return { selectedDocuments: [] }
          return {
            selectedDocuments: project.documents.map((doc) => doc.id),
          }
        }),
      unselectAllDocuments: () => set({ selectedDocuments: [] }),
    }),
    {
      name: "parse-genie-storage",
    },
  ),
)

