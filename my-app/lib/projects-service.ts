import projectsData from "@/data/projects.json"

export type Project = {
  id: string
  name: string
  documentCount: number
  createdAt: string
  updatedAt: string
}

// Function to fetch all projects
export async function fetchProjects(): Promise<Project[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  return projectsData.projects
}

// Function to create a new project
export async function createProject(name: string): Promise<Project> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Generate a new project
  const newProject: Project = {
    id: `project-${Date.now()}`,
    name,
    documentCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  // In a real app, this would save to a database
  // For now, we'll just return the new project
  return newProject
}

