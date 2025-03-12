import documentsData from "@/data/documents.json"

export type Document = {
  id: string
  name: string
  type: "file" | "folder"
  formType?: string
  status?: "Completed" | "Pending" | "Not Started"
  project?: string
  reviewed?: boolean
}

export type PaginatedResponse = {
  data: Document[]
  meta: {
    total: number
    pageCount: number
    page: number
    pageSize: number
  }
}

// This function simulates an API call but runs entirely client-side
export async function fetchDocuments({
  page = 1,
  pageSize = 25,
  sortBy = "name",
  sortOrder = "asc",
  filterReview = false,
}: {
  page: number
  pageSize: number
  sortBy: string
  sortOrder: string
  filterReview: boolean
}): Promise<PaginatedResponse> {
  // Simulate network delay for realistic behavior
  await new Promise((resolve) => setTimeout(resolve, 300))

  // Get all documents
  const allDocuments: Document[] = documentsData.documents

  // Apply review filter if needed
  const filteredDocuments = filterReview
    ? allDocuments.filter((doc) => doc.type === "file" && !doc.reviewed)
    : allDocuments

  // Apply sorting
  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    // Handle special case for sorting by review status
    if (sortBy === "reviewed") {
      const aValue = a.reviewed ? 1 : 0
      const bValue = b.reviewed ? 1 : 0
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue
    }

    // Handle other fields
    const aValue = a[sortBy as keyof Document]
    const bValue = b[sortBy as keyof Document]

    if (aValue === undefined || bValue === undefined) {
      return 0
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    return 0
  })

  // Calculate pagination
  const total = sortedDocuments.length
  const pageCount = Math.ceil(total / pageSize)
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const paginatedDocuments = sortedDocuments.slice(start, end)

  // Return paginated response
  return {
    data: paginatedDocuments,
    meta: {
      total,
      pageCount,
      page,
      pageSize,
    },
  }
}

