"use client"

import type React from "react"

import { useState } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  type ColumnDef,
  type SortingState,
  flexRender,
  type PaginationState,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { MoreHorizontal, File, Folder, CheckCircle, AlertCircle, ChevronDown, ChevronLeft } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { ProjectFile } from "@/lib/project-files-service"

// Add these imports at the top
import { motion } from "framer-motion"
import { isEmpty } from "lodash"

interface ProjectFilesListProps {
  files: ProjectFile[]
  isLoading: boolean
  isError: boolean
  selectedFiles: string[]
  setSelectedFiles: React.Dispatch<React.SetStateAction<string[]>>
  onFolderClick?: (folderId: string) => void
  onBackClick?: () => void
  isInFolder?: boolean
}

export function ProjectFilesList({
  files = [],
  isLoading,
  isError,
  selectedFiles = [],
  setSelectedFiles,
  onFolderClick,
  onBackClick,
  isInFolder = false,
}: ProjectFilesListProps) {
  // Table state
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 25,
  })

  // Ensure selectedFiles is always an array
  const safeSelectedFiles = Array.isArray(selectedFiles) ? selectedFiles : []

  // Format date to mm/dd/yyyy hh:mm AM/PM
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  // Define columns
  const columns: ColumnDef<ProjectFile>[] = [
    {
      id: "select",
      header: ({ table }) => {
        const rows = table.getFilteredRowModel().rows
        const rowsLength = rows.length

        return (
          <div className="w-10">
            <Checkbox
              checked={rowsLength > 0 && rows.every((row) => safeSelectedFiles.includes(row.original.id))}
              onCheckedChange={(value) => {
                if (value) {
                  setSelectedFiles(rows.map((row) => row.original.id))
                } else {
                  setSelectedFiles([])
                }
              }}
              aria-label="Select all"
            />
          </div>
        )
      },
      cell: ({ row }) => (
        <div className="w-10">
          <Checkbox
            checked={safeSelectedFiles.includes(row.original.id)}
            onCheckedChange={(value) => {
              if (value) {
                setSelectedFiles((prev) => [...(Array.isArray(prev) ? prev : []), row.original.id])
              } else {
                setSelectedFiles((prev) => (Array.isArray(prev) ? prev.filter((id) => id !== row.original.id) : []))
              }
            }}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="font-medium"
          >
            Name
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="flex items-center gap-2 max-w-[300px] cursor-pointer"
                onClick={() => {
                  if (row.original.type === "folder" && onFolderClick) {
                    onFolderClick(row.original.id)
                  }
                }}
              >
                {row.original.type === "file" ? (
                  <div className="bg-gray-200 rounded-full p-1 flex-shrink-0">
                    <File className="h-4 w-4 text-gray-500" />
                  </div>
                ) : (
                  <Folder className="h-5 w-5 text-gray-500 flex-shrink-0" />
                )}
                <span className="truncate text-[14px]">{row.original.name}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{row.original.name}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
    {
      accessorKey: "formType",
      header: ({ column }) => {
        return (
          <div className="w-32">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="font-medium"
            >
              Form type
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => {
        const formType = row.original.formType || ""
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-32 truncate text-[14px]">{formType}</div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{formType}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <div className="w-32">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="font-medium"
            >
              Data Extract
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => {
        const status = row.original.status
        if (!status) return <div className="w-32"></div>

        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 w-32 truncate">
                  {status === "Completed" && <CheckCircle className="h-4 w-4 text-gray-400 flex-shrink-0" />}
                  <span className="text-[14px]">{status}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{status}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      },
    },
    {
      accessorKey: "size",
      header: ({ column }) => {
        return (
          <div className="w-24">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="font-medium"
            >
              Size
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => {
        const size = row.original.size || ""
        return <div className="w-24 truncate text-[14px]">{size}</div>
      },
    },
    {
      accessorKey: "modifiedAt",
      header: ({ column }) => {
        return (
          <div className="w-40">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="font-medium"
            >
              Modified
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => {
        const date = formatDate(row.original.modifiedAt)
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-40 truncate text-[14px]">{date}</div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{date}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      },
    },
    {
      accessorKey: "reviewed",
      header: ({ column }) => {
        return (
          <div className="w-24">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="font-medium"
            >
              Review
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => {
        if (row.original.type !== "file") return <div className="w-24"></div>

        return (
          <div className="w-24">
            {row.original.reviewed ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-500" />
            )}
          </div>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <div className="w-10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View</DropdownMenuItem>
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem>Download</DropdownMenuItem>
                <DropdownMenuItem>Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]

  // Create table instance
  const table = useReactTable({
    data: files,
    columns,
    state: {
      sorting,
      pagination,
    },
    pageCount: Math.ceil(files.length / pagination.pageSize),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  // Show error message if there's an error
  if (isError) {
    return (
      <div className="bg-white rounded-md shadow-sm p-6 text-center">
        <p className="text-red-500 mb-2">Error loading files</p>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    )
  }

  // Update the table rendering part to include animations
  return (
    <motion.div
      className="bg-white rounded-md shadow-sm overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", damping: 20 }}
    >
      {isInFolder && onBackClick && (
        <motion.div
          className="p-2 border-b border-gray-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button variant="ghost" size="sm" onClick={onBackClick} className="text-[14px]">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to parent folder
          </Button>
        </motion.div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: pagination.pageSize }).map((_, index) => (
                <motion.tr
                  key={index}
                  className="border-b border-gray-200 animate-pulse"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {Array.from({ length: columns.length }).map((_, colIndex) => (
                    <td key={colIndex} className="px-4 py-3">
                      <div className="h-4 bg-gray-200 rounded"></div>
                    </td>
                  ))}
                </motion.tr>
              ))
            ) : isEmpty(files) ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500 text-[14px]">
                  No files found
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row, index) => (
                <motion.tr
                  key={row.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <motion.div
        className="flex items-center justify-between px-4 py-3 border-t border-gray-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="text-sm text-gray-500 text-[14px]">
          {isLoading
            ? "Loading..."
            : `Showing ${pagination.pageIndex * pagination.pageSize + 1} to ${Math.min((pagination.pageIndex + 1) * pagination.pageSize, files.length)} of ${files.length} results`}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage() || isLoading}
            className="text-[14px]"
          >
            Previous
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, table.getPageCount()) }).map((_, index) => {
              const pageNumber =
                pagination.pageIndex < 2
                  ? index + 1
                  : pagination.pageIndex > table.getPageCount() - 3
                    ? table.getPageCount() - 4 + index
                    : pagination.pageIndex - 1 + index

              if (pageNumber <= table.getPageCount()) {
                return (
                  <Button
                    key={pageNumber}
                    variant={pagination.pageIndex === pageNumber - 1 ? "default" : "outline"}
                    size="sm"
                    className="w-8 h-8 p-0 text-[14px]"
                    onClick={() => table.setPageIndex(pageNumber - 1)}
                    disabled={isLoading}
                  >
                    {pageNumber}
                  </Button>
                )
              }
              return null
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage() || isLoading}
            className="text-[14px]"
          >
            Next
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}

