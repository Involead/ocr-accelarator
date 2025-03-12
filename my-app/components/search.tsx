"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { SearchIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { debounce } from "lodash"

interface SearchProps {
  onSearch?: (query: string) => void
}

export function Search({ onSearch }: SearchProps) {
  const [query, setQuery] = useState("")

  // Use useCallback to memoize the debounced function
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      if (onSearch) {
        onSearch(value)
      }
    }, 300),
    [onSearch],
  )

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    debouncedSearch(value)
  }

  return (
    <div className="relative">
      <Input
        type="text"
        placeholder="Search"
        value={query}
        onChange={handleSearch}
        className="pl-10 pr-4 py-2 w-full"
        aria-label="Search input"
      />
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <SearchIcon className="h-5 w-5 text-gray-400" data-testid="search-icon" />
      </div>
    </div>
  )
}

