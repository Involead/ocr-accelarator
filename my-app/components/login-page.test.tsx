import { render, screen, fireEvent, waitFor } from "@/lib/test-utils"
import { LoginPage } from "./login-page"
import { useRouter } from "next/navigation"

// Mock the next/navigation module
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}))

describe("LoginPage Component", () => {
  const mockPush = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()

    // Setup router mock
    ;(useRouter as jest.Mock).mockImplementation(() => ({
      push: mockPush,
    }))
  })

  it("renders the login form by default", () => {
    render(<LoginPage />)

    // Check for login form elements
    expect(screen.getByText("Welcome back")).toBeInTheDocument()
    expect(screen.getByLabelText("Email")).toBeInTheDocument()
    expect(screen.getByLabelText("Password")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument()
  })

  it("switches to request access form when tab is clicked", async () => {
    render(<LoginPage />)

    // Click on the Request Access tab
    fireEvent.click(screen.getByRole("tab", { name: /request access/i }))

    // Check that the request access form is displayed
    await waitFor(() => {
      expect(screen.getByText("Request Access")).toBeInTheDocument()
      expect(screen.getByRole("button", { name: /request access/i })).toBeInTheDocument()
    })
  })

  it("validates email format in login form", async () => {
    render(<LoginPage />)

    // Enter invalid email
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "invalid-email" } })

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }))

    // Check for validation error
    await waitFor(() => {
      expect(screen.getByText("Please enter a valid email address")).toBeInTheDocument()
    })
  })

  it("validates password length in login form", async () => {
    render(<LoginPage />)

    // Enter valid email but short password
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "test@example.com" } })
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "1234" } })

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }))

    // Check for validation error
    await waitFor(() => {
      expect(screen.getByText("Password must be at least 8 characters")).toBeInTheDocument()
    })
  })

  it("submits login form with valid data and redirects to home", async () => {
    // Mock localStorage
    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    }
    Object.defineProperty(window, "localStorage", { value: localStorageMock })

    render(<LoginPage />)

    // Enter valid credentials
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "test@example.com" } })
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "password123" } })

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }))

    // Check that the button shows loading state
    expect(screen.getByRole("button", { name: /signing in/i })).toBeInTheDocument()

    // Wait for the form submission to complete
    await waitFor(
      () => {
        expect(localStorageMock.setItem).toHaveBeenCalledWith("isLoggedIn", "true")
        expect(mockPush).toHaveBeenCalledWith("/")
      },
      { timeout: 2000 },
    )
  })

  it("toggles password visibility when eye icon is clicked", () => {
    render(<LoginPage />)

    // Password field should be of type password initially
    const passwordInput = screen.getByLabelText("Password") as HTMLInputElement
    expect(passwordInput.type).toBe("password")

    // Click the eye icon to show password
    fireEvent.click(screen.getByRole("button", { name: /show password/i }))

    // Password field should now be of type text
    expect(passwordInput.type).toBe("text")

    // Click the eye icon again to hide password
    fireEvent.click(screen.getByRole("button", { name: /hide password/i }))

    // Password field should be back to type password
    expect(passwordInput.type).toBe("password")
  })

  it("submits request access form with valid email", async () => {
    render(<LoginPage />)

    // Switch to request access tab
    fireEvent.click(screen.getByRole("tab", { name: /request access/i }))

    // Wait for tab content to appear
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /request access/i })).toBeInTheDocument()
    })

    // Enter valid email
    fireEvent.change(screen.getByRole("textbox", { name: /email/i }), {
      target: { value: "request@example.com" },
    })

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /request access/i }))

    // Check that the button shows loading state
    expect(screen.getByRole("button", { name: /submitting/i })).toBeInTheDocument()

    // Wait for the form submission to complete
    await waitFor(
      () => {
        // Form should be reset
        const emailInput = screen.getByRole("textbox", { name: /email/i }) as HTMLInputElement
        expect(emailInput.value).toBe("")
      },
      { timeout: 2000 },
    )
  })
})

