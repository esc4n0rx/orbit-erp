"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { AuthContextType, User, LoginCredentials, AuthResponse, Environment } from '@/types/auth'
import { loginUser, logoutUser } from '@/lib/auth'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [environment, setEnvironment] = useState<Environment | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('orbit_user')
      const savedEnvironment = localStorage.getItem('orbit_environment')
      
      if (savedUser && savedEnvironment) {
        try {
          setUser(JSON.parse(savedUser))
          setEnvironment(savedEnvironment as Environment)
        } catch (error) {
          console.error('Erro ao carregar dados salvos:', error)
          localStorage.removeItem('orbit_user')
          localStorage.removeItem('orbit_environment')
        }
      }
    }
  }, [])

  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    setIsLoading(true)
    
    try {
      const response = await loginUser(credentials)
      
      if (response.success && response.user) {
        setUser(response.user)
        setEnvironment(credentials.environment)
        
        // Salvar no localStorage
        localStorage.setItem('orbit_user', JSON.stringify(response.user))
        localStorage.setItem('orbit_environment', credentials.environment)
        localStorage.setItem('orbit_token', response.token || '')
      }
      
      return response
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    if (user && environment) {
      await logoutUser(user.id, environment)
    }
    
    setUser(null)
    setEnvironment(null)
    
    // Limpar localStorage
    localStorage.removeItem('orbit_user')
    localStorage.removeItem('orbit_environment')
    localStorage.removeItem('orbit_token')
  }

  const updateUser = async (userData: Partial<User>): Promise<void> => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem('orbit_user', JSON.stringify(updatedUser))
    }
  }

  const value: AuthContextType = {
    user,
    environment,
    login,
    logout,
    isLoading,
    updateUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}


