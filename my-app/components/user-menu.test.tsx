import { render, screen, fireEvent, waitFor } from "@/lib/test-utils"
import { UserMenu } from "./user-menu"
import { useRouter } from "next/navigation"
import { logout } from "@/lib/auth-utils"

// Mock the dependencies
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}))

jest.mock("@/lib/auth-utils", () => ({
  logout: jest.fn(),
}))

describe("UserMenu Component", () => {
  const mockPush = jest.fn()
  const mockRefresh = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()

    // Setup router mock
    ;(useRouter as jest.Mock).mockImplementation(() => ({
      push: mockPush,
      refresh: mockRefresh,
    }))

    // Setup logout mock
    ;(logout as jest.Mock).mockResolvedValue(true)
  })

  it("renders the user menu button with avatar", () => {
    render(<UserMenu />)

    // Check for avatar
    expect(screen.getByRole("img", { name: /user/i })).toBeInTheDocument()
  })

  it("opens dropdown menu when clicked", async () => {
    render(<UserMenu />)

    // Click the avatar button
    fireEvent.click(screen.getByRole("button"))

    // Check that dropdown content is visible
    await waitFor(() => {
      expect(screen.getByText("Profile")).toBeInTheDocument()
      expect(screen.getByText("Settings")).toBeInTheDocument()
      expect(screen.getByText("Log out")).toBeInTheDocument()
    })
  })

  it("logs out when logout option is clicked", async () => {
    // Mock localStorage
    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    }
    Object.defineProperty(window, "localStorage", { value: localStorageMock })

    render(<UserMenu />)

    // Open the dropdown
    fireEvent.click(screen.getByRole("button"))

    // Click the logout option
    const logoutOption = await screen.findByText("Log out")
    fireEvent.click(logoutOption)

    // Check that it shows loading state
    expect(screen.getByText("Logging out...")).toBeInTheDocument()

    // Wait for the logout process to complete
    await waitFor(() => {
      expect(localStorageMock.removeItem).toHaveBeenCalledWith("isLoggedIn")
      expect(mockPush).toHaveBeenCalledWith("/")
      expect(mockRefresh).toHaveBeenCalled()
    })
  })
})

