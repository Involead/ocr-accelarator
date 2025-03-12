import { render, screen } from "@/lib/test-utils"
import { AuthenticatedHome } from "./authenticated-home"

// Mock the components used in AuthenticatedHome
jest.mock("@/components/sidebar", () => ({
  Sidebar: () => <div data-testid="sidebar">Sidebar</div>,
}))

jest.mock("@/components/dashboard", () => ({
  Dashboard: () => <div data-testid="dashboard">Dashboard</div>,
}))

describe("AuthenticatedHome Component", () => {
  it("renders the sidebar and dashboard", () => {
    render(<AuthenticatedHome />)

    expect(screen.getByTestId("sidebar")).toBeInTheDocument()
    expect(screen.getByTestId("dashboard")).toBeInTheDocument()
  })
})

