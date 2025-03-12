export type ProjectFile = {
  id: string
  name: string
  type: "file" | "folder"
  formType?: string
  status?: "Completed" | "Pending" | "Not Started"
  size?: string
  modifiedAt: string
  reviewed?: boolean
}

// Function to fetch files for a specific project
export async function fetchProjectFiles(
  projectId: string,
  filter: "all" | "recent" | "review" = "all",
  folderId: string | null = null,
): Promise<ProjectFile[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  // Generate mock files for the project or folder
  const files: ProjectFile[] = [
    {
      id: `${projectId}-file-1`,
      name: "invoice_2023_01.pdf",
      type: "file",
      formType: "Invoice",
      status: "Completed",
      size: "1.2 MB",
      modifiedAt: "2024-03-15T10:30:00Z",
      reviewed: true,
    },
    {
      id: `${projectId}-file-2`,
      name: "invoice_2023_02.pdf",
      type: "file",
      formType: "Invoice",
      status: "Pending",
      size: "0.9 MB",
      modifiedAt: "2024-03-10T14:45:00Z",
      reviewed: false,
    },
    {
      id: `${projectId}-folder-1`,
      name: "Financial Reports",
      type: "folder",
      modifiedAt: "2024-03-05T09:15:00Z",
    },
    {
      id: `${projectId}-file-4`,
      name: "w2_2023_employee1.pdf",
      type: "file",
      formType: "W2",
      status: "Completed",
      size: "0.5 MB",
      modifiedAt: "2024-03-02T11:20:00Z",
      reviewed: true,
    },
    {
      id: `${projectId}-file-5`,
      name: "w2_2023_employee2.pdf",
      type: "file",
      formType: "W2",
      status: "Not Started",
      size: "0.5 MB",
      modifiedAt: "2024-02-28T16:30:00Z",
      reviewed: false,
    },
    {
      id: `${projectId}-folder-2`,
      name: "Tax Documents",
      type: "folder",
      modifiedAt: "2024-02-25T13:45:00Z",
    },
    {
      id: `${projectId}-file-7`,
      name: "receipt_q1_2023.pdf",
      type: "file",
      formType: "Receipt",
      status: "Completed",
      size: "0.3 MB",
      modifiedAt: "2024-02-20T10:15:00Z",
      reviewed: true,
    },
    {
      id: `${projectId}-file-8`,
      name: "receipt_q2_2023.pdf",
      type: "file",
      formType: "Receipt",
      status: "Pending",
      size: "0.4 MB",
      modifiedAt: "2024-02-15T09:45:00Z",
      reviewed: false,
    },
    {
      id: `${projectId}-file-9`,
      name: "contract_vendor1.pdf",
      type: "file",
      formType: "Contract",
      status: "Completed",
      size: "1.5 MB",
      modifiedAt: "2024-02-10T14:20:00Z",
      reviewed: true,
    },
    {
      id: `${projectId}-file-10`,
      name: "contract_vendor2.pdf",
      type: "file",
      formType: "Contract",
      status: "Not Started",
      size: "1.3 MB",
      modifiedAt: "2024-02-05T11:10:00Z",
      reviewed: false,
    },
  ]

  // If we're in a folder, return different files
  if (folderId) {
    // In a real app, we would filter files by the folder ID
    // For this demo, we'll just return a different set of files
    return [
      {
        id: `${folderId}-file-1`,
        name: "folder_file_1.pdf",
        type: "file",
        formType: "Invoice",
        status: "Completed",
        size: "0.8 MB",
        modifiedAt: "2024-03-12T10:30:00Z",
        reviewed: true,
      },
      {
        id: `${folderId}-file-2`,
        name: "folder_file_2.pdf",
        type: "file",
        formType: "W2",
        status: "Pending",
        size: "0.6 MB",
        modifiedAt: "2024-03-08T14:45:00Z",
        reviewed: false,
      },
      {
        id: `${folderId}-subfolder-1`,
        name: "Subfolder",
        type: "folder",
        modifiedAt: "2024-03-01T09:15:00Z",
      },
    ]
  }

  // Apply filters
  let filteredFiles = [...files]

  if (filter === "recent") {
    // Sort by modified date (most recent first) and take the top 5
    filteredFiles = [...files]
      .sort((a, b) => new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime())
      .slice(0, 5)
  } else if (filter === "review") {
    // Filter files that need review (not reviewed and not folders)
    filteredFiles = files.filter((file) => file.type === "file" && !file.reviewed)
  }

  return filteredFiles
}

