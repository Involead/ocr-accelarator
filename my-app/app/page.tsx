"use client"

import { LoginPage } from "@/components/login-page"
import { AuthenticatedHome } from "@/components/authenticated-home"

// Simple client-side component to check login status
export default function Home() {
  return <ClientHome />
}


import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

function ClientHome() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in from localStorage
    const loggedIn = localStorage.getItem("isLoggedIn") === "true"
    setIsLoggedIn(loggedIn)
    setIsLoading(false)
  }, [])

  // Show loading state while checking
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  // Show login page or authenticated home based on login status
  return isLoggedIn ? <AuthenticatedHome /> : <LoginPage />
}

