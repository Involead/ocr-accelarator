import { render, screen, fireEvent, waitFor } from "@/lib/test-utils"
import { Search } from "./search"

describe("Search Component", () => {
  it("renders the search input", () => {
    render(<Search />)

    const searchInput = screen.getByPlaceholderText("Search")
    expect(searchInput).toBeInTheDocument()
  })

  it("calls onSearch when input changes", async () => {
    const mockOnSearch = jest.fn()
    render(<Search onSearch={mockOnSearch} />)

    const searchInput = screen.getByPlaceholderText("Search")
    fireEvent.change(searchInput, { target: { value: "test query" } })

    // Wait for debounce
    await waitFor(
      () => {
        expect(mockOnSearch).toHaveBeenCalledWith("test query")
      },
      { timeout: 400 },
    ) // Adjust timeout based on your debounce delay
  })

  it("displays the search icon", () => {
    render(<Search />)

    const searchIcon = screen.getByTestId("search-icon")
    expect(searchIcon).toBeInTheDocument()
  })
})

