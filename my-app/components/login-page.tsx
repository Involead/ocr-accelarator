"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"

// Remove the import for auth-utils
// import { login } from "@/lib/auth-utils"

// Define validation schemas
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
})

const requestAccessSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
})

type LoginFormValues = z.infer<typeof loginSchema>
type RequestAccessFormValues = z.infer<typeof requestAccessSchema>

export function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState<"login" | "request">("login")

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // Request access form
  const requestForm = useForm<RequestAccessFormValues>({
    resolver: zodResolver(requestAccessSchema),
    defaultValues: {
      email: "",
    },
  })

  // Update the onLoginSubmit function to use the login utility
  const onLoginSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // For demo purposes, just show success message and redirect
      toast({
        title: "Login successful",
        description: "Welcome to ParseGenie",
      })

      // Set a simple flag in localStorage to simulate being logged in
      localStorage.setItem("isLoggedIn", "true")

      // Redirect to home page
      router.push("/")
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle request access submission
  const onRequestSubmit = async (data: RequestAccessFormValues) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Access request submitted",
        description: "We'll review your request and get back to you soon",
      })
      requestForm.reset()
    } catch (error) {
      toast({
        title: "Request failed",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12">
              <svg viewBox="0 0 100 100" className="h-full w-full">
                <polygon points="10,90 10,10 50,10 90,50 50,90" fill="#0047AB" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">ParseGenie</h1>
          <p className="text-gray-600 mt-2">Intelligent document processing and data extraction</p>
        </div>

        <Tabs
          defaultValue="login"
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "login" | "request")}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="request">Request Access</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Welcome back</CardTitle>
                <CardDescription>Sign in to your account to continue</CardDescription>
              </CardHeader>
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        {...loginForm.register("email")}
                        className="pl-10"
                      />
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                    {loginForm.formState.errors.email && (
                      <p className="text-sm text-red-500">{loginForm.formState.errors.email.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="password">Password</Label>
                      <Button variant="link" size="sm" className="p-0 h-auto text-xs" type="button">
                        Forgot password?
                      </Button>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...loginForm.register("password")}
                        className="pl-10"
                      />
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                        <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                      </Button>
                    </div>
                    {loginForm.formState.errors.password && (
                      <p className="text-sm text-red-500">{loginForm.formState.errors.password.message}</p>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign in"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="request">
            <Card>
              <CardHeader>
                <CardTitle>Request Access</CardTitle>
                <CardDescription>Don't have an account? Request access to ParseGenie</CardDescription>
              </CardHeader>
              <form onSubmit={requestForm.handleSubmit(onRequestSubmit)}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="request-email">Email</Label>
                    <div className="relative">
                      <Input
                        id="request-email"
                        type="email"
                        placeholder="name@example.com"
                        {...requestForm.register("email")}
                        className="pl-10"
                      />
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                    {requestForm.formState.errors.email && (
                      <p className="text-sm text-red-500">{requestForm.formState.errors.email.message}</p>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    <p>By requesting access, you agree to our Terms of Service and Privacy Policy.</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Submitting..." : "Request Access"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>

        <p className="text-center text-gray-500 text-sm mt-8">
          © {new Date().getFullYear()} ParseGenie. All rights reserved.
        </p>
      </motion.div>
    </div>
  )
}

