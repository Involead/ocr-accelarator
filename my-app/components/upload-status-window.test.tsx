import { render, screen, fireEvent } from "@/lib/test-utils"
import { UploadStatusWindow } from "./upload-status-window"
import { useUploadStore } from "@/lib/store/upload-store"

// Mock the Zustand store
jest.mock("@/lib/store/upload-store")

describe("UploadStatusWindow Component", () => {
  const mockSetMinimized = jest.fn()
  const mockSetShowStatusWindow = jest.fn()
  const mockClearCompleted = jest.fn()
  const mockSetActiveTab = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()

    // Setup mock implementation for useUploadStore
    ;(useUploadStore as jest.Mock).mockImplementation(() => ({
      files: [
        {
          id: "1",
          name: "test-file.pdf",
          projectName: "Test Project",
          timestamp: "3/12/2025, 2:30:00 PM",
          status: "completed",
          progress: 100,
        },
        {
          id: "2",
          name: "uploading-file.pdf",
          projectName: "Test Project",
          timestamp: "3/12/2025, 2:35:00 PM",
          status: "uploading",
          progress: 50,
        },
      ],
      showStatusWindow: true,
      isMinimized: false,
      activeTab: "all",
      setMinimized: mockSetMinimized,
      setShowStatusWindow: mockSetShowStatusWindow,
      clearCompleted: mockClearCompleted,
      setActiveTab: mockSetActiveTab,
    }))
  })

  it("renders the upload status window with files", () => {
    render(<UploadStatusWindow />)

    expect(screen.getByText("Uploads")).toBeInTheDocument()
    expect(screen.getByText("test-file.pdf")).toBeInTheDocument()
    expect(screen.getByText("uploading-file.pdf")).toBeInTheDocument()
    expect(screen.getByText("1 in progress")).toBeInTheDocument()
  })

  it("calls setMinimized when minimize button is clicked", () => {
    render(<UploadStatusWindow />)

    const minimizeButton = screen.getByLabelText("Minimize") || screen.getByRole("button", { name: /minimize/i })
    fireEvent.click(minimizeButton)

    expect(mockSetMinimized).toHaveBeenCalledWith(true)
  })

  it("calls setShowStatusWindow when close button is clicked", () => {
    render(<UploadStatusWindow />)

    const closeButton = screen.getByLabelText("Close") || screen.getByRole("button", { name: /close/i })
    fireEvent.click(closeButton)

    expect(mockSetShowStatusWindow).toHaveBeenCalledWith(false)
  })

  it("changes tab when a tab is clicked", () => {
    render(<UploadStatusWindow />)

    const completedTab = screen.getByRole("tab", { name: /completed/i })
    fireEvent.click(completedTab)

    expect(mockSetActiveTab).toHaveBeenCalledWith("completed")
  })

  it("calls clearCompleted when clear completed button is clicked", () => {
    // Set active tab to 'completed'
    ;(useUploadStore as jest.Mock).mockImplementation(() => ({
      files: [
        {
          id: "1",
          name: "test-file.pdf",
          projectName: "Test Project",
          timestamp: "3/12/2025, 2:30:00 PM",
          status: "completed",
          progress: 100,
        },
      ],
      showStatusWindow: true,
      isMinimized: false,
      activeTab: "completed",
      setMinimized: mockSetMinimized,
      setShowStatusWindow: mockSetShowStatusWindow,
      clearCompleted: mockClearCompleted,
      setActiveTab: mockSetActiveTab,
    }))

    render(<UploadStatusWindow />)

    const clearButton = screen.getByRole("button", { name: /clear completed/i })
    fireEvent.click(clearButton)

    expect(mockClearCompleted).toHaveBeenCalled()
  })
})

