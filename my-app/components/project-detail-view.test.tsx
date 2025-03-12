import { render, screen, waitFor } from "@/lib/test-utils"
import { ProjectDetailView } from "./project-detail-view"
import { useQuery } from "@tanstack/react-query"
import { useUploadStore } from "@/lib/store/upload-store"

// Mock the dependencies
jest.mock("@tanstack/react-query")
jest.mock("@/lib/store/upload-store")
jest.mock("@/lib/projects-service")
jest.mock("@/lib/project-files-service")

describe("ProjectDetailView Component", () => {
  const mockAddFiles = jest.fn()
  const mockUpdateFileProgress = jest.fn()
  const mockUpdateFileStatus = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()

    // Mock useQuery
    ;(useQuery as jest.Mock).mockImplementation(({ queryKey }) => {
      if (queryKey[0] === "projects") {
        return {
          data: [{ id: "project-1", name: "Test Project", documents: [] }],
          isLoading: false,
          isError: false,
        }
      }

      if (queryKey[0] === "project-files") {
        return {
          data: [
            {
              id: "file-1",
              name: "test-file.pdf",
              type: "file",
              formType: "PDF",
              status: "Completed",
              size: "1.2 MB",
              modifiedAt: "2024-03-15T10:30:00Z",
              reviewed: true,
            },
          ],
          isLoading: false,
          isError: false,
          refetch: jest.fn(),
        }
      }

      return { data: null, isLoading: false, isError: false }
    })

    // Mock useUploadStore
    ;(useUploadStore as jest.Mock).mockImplementation(() => ({
      addFiles: mockAddFiles,
      updateFileProgress: mockUpdateFileProgress,
      updateFileStatus: mockUpdateFileStatus,
    }))
  })

  it("renders the project detail view", async () => {
    render(<ProjectDetailView projectId="project-1" />)

    // Wait for the component to render with data
    await waitFor(() => {
      expect(screen.getByText("All files - Test Project")).toBeInTheDocument()
    })

    // Check for upload button
    expect(screen.getByText("Upload or drop")).toBeInTheDocument()

    // Check for create folder button
    expect(screen.getByText("Create folder")).toBeInTheDocument()

    // Check for filter tabs
    expect(screen.getByRole("button", { name: /all files/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /recents/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /review/i })).toBeInTheDocument()
  })

  it("displays file data in the table", async () => {
    render(<ProjectDetailView projectId="project-1" />)

    // Wait for the file to be displayed
    await waitFor(() => {
      expect(screen.getByText("test-file.pdf")).toBeInTheDocument()
    })

    // Check for file details
    expect(screen.getByText("PDF")).toBeInTheDocument()
    expect(screen.getByText("Completed")).toBeInTheDocument()
    expect(screen.getByText("1.2 MB")).toBeInTheDocument()
  })

  it("handles filter tab changes", async () => {
    render(<ProjectDetailView projectId="project-1" />)

    // Wait for the component to render
    await waitFor(() => {
      expect(screen.getByText("All files - Test Project")).toBeInTheDocument()
    })

    // Click on the Recents tab
    const recentsTab = screen.getByRole("button", { name: /recents/i })
    recentsTab.click()

    // Verify that the query was called with the correct filter
    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: expect.arrayContaining(["project-files", "project-1", "recent"]),
      }),
    )
  })

  it("opens the upload modal when upload button is clicked", async () => {
    render(<ProjectDetailView projectId="project-1" />)

    // Wait for the component to render
    await waitFor(() => {
      expect(screen.getByText("All files - Test Project")).toBeInTheDocument()
    })

    // Click on the upload button
    const uploadButton = screen.getByText("Upload or drop")
    uploadButton.click()

    // Check if the upload modal is opened
    // Note: The actual modal might be rendered in a portal, so we might need to adjust this test
    // depending on how the modal is implemented
    await waitFor(() => {
      expect(screen.getByText("Upload Files")).toBeInTheDocument()
    })
  })
})

