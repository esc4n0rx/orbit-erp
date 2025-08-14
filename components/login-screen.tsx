"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { MessageBar } from "@/components/ui/message-bar"
import { supabase } from "@/lib/supabase"
import { getTableName } from "@/lib/utils/environment"
import bcrypt from 'bcryptjs'

interface LoginScreenProps {
  onLogin: (userData: { 
    id: string
    name: string
    initials: string
    environment: string
    role: string
    profile: {
      modules: string[]
      permissions: string[]
      restrictions: Record<string, any>
    }
  }) => void
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [environment, setEnvironment] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!username || !password || !environment) {
      setError("Todos os campos são obrigatórios")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const tableName = getTableName('users', environment)
      
      // Buscar usuário no banco
      const { data: user, error: fetchError } = await supabase
        .from(tableName)
        .select('*')
        .eq('username', username)
        .eq('status', 'active')
        .single()

      if (fetchError || !user) {
        setError("Usuário não encontrado ou inativo")
        return
      }

      // Verificar senha
      const passwordMatch = await bcrypt.compare(password, user.password_hash)
      
      if (!passwordMatch) {
        setError("Senha incorreta")
        return
      }

      // Gerar iniciais do nome completo
      const initials = user.full_name
        .split(" ")
        .map((name: string) => name[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)

      // Fazer login
      onLogin({
        id: user.id,
        name: user.full_name,
        initials: initials || username.slice(0, 2).toUpperCase(),
        environment,
        role: user.role,
        profile: user.profile || {
          modules: ['*'],
          permissions: ['*'],
          restrictions: {}
        }
      })

    } catch (err) {
      console.error('Erro no login:', err)
      setError('Erro interno do servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-lg text-2xl font-bold mb-4">
            O
          </div>
          <h1 className="text-3xl font-light text-slate-700 dark:text-slate-200">Orbit</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Enterprise Resource Planning</p>
        </div>

        <Card className="shadow-lg border-0 dark:bg-slate-800 dark:border-slate-700">
          <CardHeader className="space-y-1 pb-4">
            <h2 className="text-xl font-medium text-center text-slate-700 dark:text-slate-200">Sign In</h2>
          </CardHeader>
          <CardContent>
            {error && (
              <MessageBar variant="destructive" className="mb-4">
                {error}
              </MessageBar>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-slate-600 dark:text-slate-300">
                  User
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-11 border-slate-200 dark:border-slate-600 focus:border-blue-500 dark:bg-slate-700"
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-600 dark:text-slate-300">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 border-slate-200 dark:border-slate-600 focus:border-blue-500 dark:bg-slate-700"
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="environment" className="text-slate-600 dark:text-slate-300">
                  Environment
                </Label>
                <Select value={environment} onValueChange={setEnvironment} required disabled={loading}>
                  <SelectTrigger className="h-11 border-slate-200 dark:border-slate-600 focus:border-blue-500 dark:bg-slate-700">
                    <SelectValue placeholder="Select environment" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-slate-800 dark:border-slate-600">
                    <SelectItem value="production">Production</SelectItem>
                    <SelectItem value="staging">Staging</SelectItem>
                    <SelectItem value="development">Development</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Entrando...
                  </>
                ) : (
                  'Log On'
                )}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
                  disabled={loading}
                >
                  Change Password
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}