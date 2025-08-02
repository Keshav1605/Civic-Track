"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: string
  name: string
  email: string
  role: "citizen" | "authority" | "admin"
  avatar?: string
  language: string
  location?: {
    lat: number
    lng: number
    address: string
  }
  verified: boolean
  joinedAt: string
  preferences: {
    notifications: {
      push: boolean
      email: boolean
      sms: boolean
    }
    language: string
    theme: "light" | "dark" | "system"
  }
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  loginWithGoogle: () => Promise<boolean>
  signup: (userData: Partial<User> & { password: string }) => Promise<boolean>
  logout: () => void
  updateProfile: (updates: Partial<User>) => Promise<boolean>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Load user from localStorage on mount
    const savedUser = localStorage.getItem("civictrack_user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error("Error parsing saved user:", error)
        localStorage.removeItem("civictrack_user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock user data
      const mockUser: User = {
        id: "user_" + Date.now(),
        name: email.split("@")[0],
        email,
        role: email.includes("authority") ? "authority" : "citizen",
        language: "en",
        verified: true,
        joinedAt: new Date().toISOString(),
        preferences: {
          notifications: { push: true, email: true, sms: false },
          language: "en",
          theme: "system",
        },
      }

      setUser(mockUser)
      localStorage.setItem("civictrack_user", JSON.stringify(mockUser))

      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      })

      return true
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithGoogle = async (): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Simulate Google OAuth
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const mockUser: User = {
        id: "google_" + Date.now(),
        name: "John Doe",
        email: "john.doe@gmail.com",
        role: "citizen",
        avatar: "/placeholder-user.jpg",
        language: "en",
        verified: true,
        joinedAt: new Date().toISOString(),
        preferences: {
          notifications: { push: true, email: true, sms: false },
          language: "en",
          theme: "system",
        },
      }

      setUser(mockUser)
      localStorage.setItem("civictrack_user", JSON.stringify(mockUser))

      toast({
        title: "Welcome!",
        description: "You have successfully logged in with Google.",
      })

      return true
    } catch (error) {
      toast({
        title: "Google login failed",
        description: "Please try again later.",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (userData: Partial<User> & { password: string }): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newUser: User = {
        id: "user_" + Date.now(),
        name: userData.name || "",
        email: userData.email || "",
        role: userData.role || "citizen",
        language: userData.language || "en",
        verified: false,
        joinedAt: new Date().toISOString(),
        preferences: {
          notifications: { push: true, email: true, sms: false },
          language: userData.language || "en",
          theme: "system",
        },
      }

      setUser(newUser)
      localStorage.setItem("civictrack_user", JSON.stringify(newUser))

      toast({
        title: "Account created!",
        description: "Welcome to CivicTrack. Please verify your email.",
      })

      return true
    } catch (error) {
      toast({
        title: "Signup failed",
        description: "Please try again later.",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("civictrack_user")
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
  }

  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!user) return false

    try {
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      localStorage.setItem("civictrack_user", JSON.stringify(updatedUser))

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      })

      return true
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Please try again later.",
        variant: "destructive",
      })
      return false
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        loginWithGoogle,
        signup,
        logout,
        updateProfile,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
