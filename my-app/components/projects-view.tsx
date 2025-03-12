"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { Search } from "@/components/search"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CreateProjectModal } from "@/components/create-project-modal"
import { fetchProjects } from "@/lib/projects-service"
import { FolderOpen, Clock, File, PlusCircle } from "lucide-react"

export function ProjectsView() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Fetch projects using React Query
  const {
    data: projects = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  })

  // Filter projects based on search query
  const filteredProjects = projects.filter((project) => project.name.toLowerCase().includes(searchQuery.toLowerCase()))

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Create Project
        </Button>
      </div>

      <div className="mb-6 max-w-md">
        <Search onSearch={setSearchQuery} />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-10">
          <p className="text-red-500 mb-2">Failed to load projects</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-2">No projects found</p>
          <Button variant="outline" onClick={() => setIsCreateModalOpen(true)}>
            Create your first project
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Link href={`/projects/${project.id}`} key={project.id}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <FolderOpen className="h-5 w-5 text-blue-500" />
                    {project.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <File className="h-4 w-4" />
                    <span>{project.documentCount} documents</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>Updated {formatDate(project.updatedAt)}</span>
                  </div>
                </CardContent>
                <CardFooter className="text-sm text-gray-500">Created {formatDate(project.createdAt)}</CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      <CreateProjectModal open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  )
}

