"use client"

import { useState, useEffect } from "react"
import LoginScreen from "@/components/login-screen"
import Dashboard from "@/components/dashboard"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider, useAuth } from "@/hooks/use-auth"
import { Loader2 } from "lucide-react"

function AppContent() {
  const { user, isLoading } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  // Show login or dashboard based on auth state
  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {!user ? <LoginScreen /> : <Dashboard />}
    </div>
  )
}

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={true} disableTransitionOnChange={false}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  )
}