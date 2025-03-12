import { act, renderHook } from "@testing-library/react"
import { useUploadStore } from "./upload-store"

describe("Upload Store", () => {
  beforeEach(() => {
    // Clear the store before each test
    act(() => {
      useUploadStore.setState({
        files: [],
        showStatusWindow: false,
        isMinimized: false,
        activeTab: "all",
      })
    })
  })

  it("should add files correctly", () => {
    const { result } = renderHook(() => useUploadStore())

    act(() => {
      result.current.addFiles([
        {
          name: "test-file.pdf",
          projectName: "Test Project",
          projectId: "project-1",
          folderId: null,
        },
      ])
    })

    expect(result.current.files.length).toBe(1)
    expect(result.current.files[0].name).toBe("test-file.pdf")
    expect(result.current.files[0].status).toBe("uploading")
    expect(result.current.files[0].progress).toBe(0)
    expect(result.current.showStatusWindow).toBe(true)
  })

  it("should update file progress", () => {
    const { result } = renderHook(() => useUploadStore())

    // Add a file first
    act(() => {
      result.current.addFiles([
        {
          name: "test-file.pdf",
          projectName: "Test Project",
          projectId: "project-1",
          folderId: null,
        },
      ])
    })

    const fileId = result.current.files[0].id

    // Update progress
    act(() => {
      result.current.updateFileProgress(fileId, 50)
    })

    expect(result.current.files[0].progress).toBe(50)
  })

  it("should update file status", () => {
    const { result } = renderHook(() => useUploadStore())

    // Add a file first
    act(() => {
      result.current.addFiles([
        {
          name: "test-file.pdf",
          projectName: "Test Project",
          projectId: "project-1",
          folderId: null,
        },
      ])
    })

    const fileId = result.current.files[0].id

    // Update status
    act(() => {
      result.current.updateFileStatus(fileId, "completed")
    })

    expect(result.current.files[0].status).toBe("completed")
  })

  it("should remove a file", () => {
    const { result } = renderHook(() => useUploadStore())

    // Add files first
    act(() => {
      result.current.addFiles([
        {
          name: "test-file-1.pdf",
          projectName: "Test Project",
          projectId: "project-1",
          folderId: null,
        },
        {
          name: "test-file-2.pdf",
          projectName: "Test Project",
          projectId: "project-1",
          folderId: null,
        },
      ])
    })

    expect(result.current.files.length).toBe(2)

    const fileId = result.current.files[0].id

    // Remove a file
    act(() => {
      result.current.removeFile(fileId)
    })

    expect(result.current.files.length).toBe(1)
    expect(result.current.files[0].name).toBe("test-file-2.pdf")
  })

  it("should clear completed files", () => {
    const { result } = renderHook(() => useUploadStore())

    // Add files with different statuses
    act(() => {
      result.current.addFiles([
        {
          name: "completed-file.pdf",
          projectName: "Test Project",
          projectId: "project-1",
          folderId: null,
        },
        {
          name: "uploading-file.pdf",
          projectName: "Test Project",
          projectId: "project-1",
          folderId: null,
        },
      ])
    })

    const completedFileId = result.current.files[0].id
    const uploadingFileId = result.current.files[1].id

    // Set one file as completed
    act(() => {
      result.current.updateFileStatus(completedFileId, "completed")
    })

    expect(result.current.files.length).toBe(2)

    // Clear completed files
    act(() => {
      result.current.clearCompleted()
    })

    expect(result.current.files.length).toBe(1)
    expect(result.current.files[0].id).toBe(uploadingFileId)
  })

  it("should toggle minimized state", () => {
    const { result } = renderHook(() => useUploadStore())

    expect(result.current.isMinimized).toBe(false)

    act(() => {
      result.current.setMinimized(true)
    })

    expect(result.current.isMinimized).toBe(true)
  })

  it("should change active tab", () => {
    const { result } = renderHook(() => useUploadStore())

    expect(result.current.activeTab).toBe("all")

    act(() => {
      result.current.setActiveTab("completed")
    })

    expect(result.current.activeTab).toBe("completed")
  })
})

