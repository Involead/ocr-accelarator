"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { Home, FolderClosed, PlusCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { CreateProjectModal } from "@/components/create-project-modal"
import { fetchProjects } from "@/lib/projects-service"
import { cn } from "@/lib/utils"
import { UserMenu } from "@/components/user-menu"

export function Sidebar() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const pathname = usePathname()

  // Determine active routes
  const isHome = pathname === "/" // This will now correctly highlight home when on the root path
  const isProjects = pathname === "/projects" || pathname.startsWith("/projects/")

  // Fetch projects using React Query
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  })

  return (
    <div className="w-[240px] bg-white border-r border-gray-200 h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-10 w-10">
            <svg viewBox="0 0 100 100" className="h-full w-full">
              <polygon points="10,90 10,10 50,10 90,50 50,90" fill="#0047AB" />
            </svg>
          </div>
          <span className="text-2xl font-semibold text-gray-800">ParseGenie</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="space-y-1 px-2">
          <Link
            href="/"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
              isHome ? "bg-primary text-primary-foreground font-medium" : "text-gray-600 hover:bg-gray-100",
            )}
          >
            <Home className="h-5 w-5" />
            <span>Home</span>
          </Link>
          <div className="pt-4">
            <div className="px-3 mb-2 flex items-center justify-between">
              <div
                className={cn(
                  "text-xs font-semibold uppercase tracking-wider",
                  isProjects ? "text-primary" : "text-gray-500",
                )}
              >
                Projects
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 text-gray-500 hover:text-gray-700"
                      onClick={() => setIsCreateModalOpen(true)}
                    >
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Create a project</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Link
              href="/projects"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                isProjects && pathname === "/projects"
                  ? "bg-primary text-primary-foreground font-medium"
                  : "text-gray-600 hover:bg-gray-100",
              )}
            >
              <FolderClosed className="h-5 w-5" />
              <span>All projects</span>
            </Link>
            <div className="mt-2 space-y-1 pl-2">
              {isLoading
                ? // Show loading skeleton
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-2 pl-8 pr-3 py-1.5">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                    </div>
                  ))
                : // Show projects
                  projects.map((project) => (
                    <ProjectItem
                      key={project.id}
                      name={project.name}
                      id={project.id}
                      isActive={pathname === `/projects/${project.id}`}
                    />
                  ))}
            </div>
          </div>
        </nav>
      </div>

      <div className="mt-auto p-4 border-t border-gray-200">
        <UserMenu />
      </div>

      {/* Create Project Modal */}
      <CreateProjectModal open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  )
}

function ProjectItem({ name, id, isActive }: { name: string; id: string; isActive: boolean }) {
  return (
    <Link
      href={`/projects/${id}`}
      className={cn(
        "flex items-center gap-2 pl-8 pr-3 py-1.5 text-sm rounded-md transition-colors",
        isActive ? "bg-primary/10 text-primary font-medium" : "text-gray-600 hover:bg-gray-100",
      )}
    >
      <span className="flex items-center gap-1">
        <span>›</span>
        <span>{name}</span>
      </span>
    </Link>
  )
}

