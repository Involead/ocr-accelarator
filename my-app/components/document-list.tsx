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
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { MoreHorizontal, File, Folder, CheckCircle, AlertCircle, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { fetchDocuments, type Document } from "@/lib/documents-service"

interface DocumentListProps {
  filterReview?: boolean
  selectedDocuments: string[]
  setSelectedDocuments: React.Dispatch<React.SetStateAction<string[]>>
}

export function DocumentList({
  filterReview = false,
  selectedDocuments = [], // Provide default empty array
  setSelectedDocuments,
}: DocumentListProps) {
  // Table state
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 25, // Default page size set to 25
  })

  // Ensure selectedDocuments is always an array
  const safeSelectedDocuments = Array.isArray(selectedDocuments) ? selectedDocuments : []

  // React Query for data fetching
  const {
    data: queryResult,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [
      "documents",
      pagination.pageIndex + 1,
      pagination.pageSize,
      sorting.length > 0 ? sorting[0].id : "name",
      sorting.length > 0 ? sorting[0].direction : "asc",
      filterReview,
    ],
    queryFn: () =>
      fetchDocuments({
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
        sortBy: sorting.length > 0 ? sorting[0].id : "name",
        sortOrder: sorting.length > 0 ? sorting[0].direction : "asc",
        filterReview,
      }),
    keepPreviousData: true, // Keep previous data while loading new data
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Extract data from query result
  const data = queryResult?.data || []
  const pageCount = queryResult?.meta?.pageCount || 0
  const totalCount = queryResult?.meta?.total || 0

  // Define columns
  const columns: ColumnDef<Document>[] = [
    {
      id: "select",
      header: ({ table }) => {
        const rows = table.getFilteredRowModel().rows
        const rowsLength = rows.length

        return (
          <div className="w-10">
            <Checkbox
              checked={rowsLength > 0 && rows.every((row) => safeSelectedDocuments.includes(row.original.id))}
              onCheckedChange={(value) => {
                if (value) {
                  setSelectedDocuments(rows.map((row) => row.original.id))
                } else {
                  setSelectedDocuments([])
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
            checked={safeSelectedDocuments.includes(row.original.id)}
            onCheckedChange={(value) => {
              if (value) {
                setSelectedDocuments((prev) => [...(Array.isArray(prev) ? prev : []), row.original.id])
              } else {
                setSelectedDocuments((prev) => (Array.isArray(prev) ? prev.filter((id) => id !== row.original.id) : []))
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
              <div className="flex items-center gap-2 max-w-[300px]">
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
      accessorKey: "project",
      header: ({ column }) => {
        return (
          <div className="w-32">
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="font-medium"
            >
              Project
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )
      },
      cell: ({ row }) => {
        const project = row.original.project || ""
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-32 truncate text-[14px]">{project}</div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{project}</p>
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
    data,
    columns,
    state: {
      sorting,
      pagination,
    },
    manualPagination: true,
    manualSorting: true,
    pageCount,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  // Show error message if there's an error
  if (isError) {
    return (
      <div className="bg-white rounded-md shadow-sm p-6 text-center">
        <p className="text-red-500 mb-2">Error loading documents</p>
        <p className="text-gray-600">{error instanceof Error ? error.message : "Unknown error"}</p>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-md shadow-sm overflow-hidden">
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
                <tr key={index} className="border-b border-gray-200 animate-pulse">
                  {Array.from({ length: columns.length }).map((_, colIndex) => (
                    <td key={colIndex} className="px-4 py-3">
                      <div className="h-4 bg-gray-200 rounded"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500 text-[14px]">
                  {filterReview ? "No documents require review" : "No documents found"}
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b border-gray-200 hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
        <div className="text-sm text-gray-500 text-[14px]">
          {isLoading
            ? "Loading..."
            : `Showing ${pagination.pageIndex * pagination.pageSize + 1} to ${Math.min((pagination.pageIndex + 1) * pagination.pageSize, totalCount)} of ${totalCount} results`}
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
            {Array.from({ length: Math.min(5, pageCount) }).map((_, index) => {
              const pageNumber =
                pagination.pageIndex < 2
                  ? index + 1
                  : pagination.pageIndex > pageCount - 3
                    ? pageCount - 4 + index
                    : pagination.pageIndex - 1 + index

              if (pageNumber <= pageCount) {
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
      </div>
    </div>
  )
}

