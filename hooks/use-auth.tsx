"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { AuthContextType, User, LoginCredentials, AuthResponse } from '@/types/auth'
import { loginUser, logoutUser } from '@/lib/auth'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('orbit_user')
      
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser))
        } catch (error) {
          console.error('Erro ao carregar dados salvos:', error)
          localStorage.removeItem('orbit_user')
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
        
        // Salvar no localStorage
        localStorage.setItem('orbit_user', JSON.stringify(response.user))
        localStorage.setItem('orbit_token', response.token || '')
      }
      
      return response
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    if (user) {
      await logoutUser(user.id)
    }
    
    setUser(null)
    
    // Limpar localStorage
    localStorage.removeItem('orbit_user')
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