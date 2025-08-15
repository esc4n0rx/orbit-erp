"use client"

import { useState } from "react"
import LoginScreen from "@/components/login-screen"
import Dashboard from "@/components/dashboard"
import { ThemeProvider } from "@/components/theme-provider"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState<{
    id: string
    name: string
    initials: string
    role?: string
    perfil?: {
      modules: string[]
      permissions: string[]
      restrictions: Record<string, any>
    }
  } | null>(null)

  const handleLogin = (userData: { 
    id: string
    name: string
    initials: string
    role?: string
    perfil?: {
      modules: string[]
      permissions: string[]
      restrictions: Record<string, any>
    }
  }) => {
    setCurrentUser(userData)
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setCurrentUser(null)
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={true} disableTransitionOnChange={false}>
      <div className="min-h-screen bg-background transition-colors duration-300">
        {!isLoggedIn || !currentUser ? (
          <LoginScreen onLogin={handleLogin} />
        ) : (
          <Dashboard user={currentUser} onLogout={handleLogout} />
        )}
      </div>
    </ThemeProvider>
  )
}