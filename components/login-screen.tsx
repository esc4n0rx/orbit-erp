"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import type { Environment } from "@/types/auth"

export default function LoginScreen() {
  const { login, isLoading } = useAuth()
  const [formData, setFormData] = useState({
    login: "",
    password: "",
    environment: "" as Environment | ""
  })
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (!formData.login || !formData.password || !formData.environment) {
      setError("Todos os campos são obrigatórios")
      return
    }

    try {
      const response = await login({
        login: formData.login,
        password: formData.password,
        environment: formData.environment
      })

      if (!response.success) {
        setError(response.error || "Erro ao fazer login")
      }
      // Se sucesso, o useAuth vai redirecionar automaticamente
    } catch (err) {
      setError("Erro de conexão. Tente novamente.")
      console.error("Erro no login:", err)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) setError("") // Limpar erro quando usuário começar a digitar
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
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="login" className="text-slate-600 dark:text-slate-300">
                  User
                </Label>
                <Input
                  id="login"
                  type="text"
                  placeholder="Enter your username"
                  value={formData.login}
                  onChange={(e) => handleInputChange("login", e.target.value)}
                  className="h-11 border-slate-200 dark:border-slate-600 focus:border-blue-500 dark:bg-slate-700"
                  required
                  disabled={isLoading}
                  autoComplete="username"
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
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="h-11 border-slate-200 dark:border-slate-600 focus:border-blue-500 dark:bg-slate-700"
                  required
                  disabled={isLoading}
                  autoComplete="current-password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="environment" className="text-slate-600 dark:text-slate-300">
                  Environment
                </Label>
                <Select 
                  value={formData.environment} 
                  onValueChange={(value) => handleInputChange("environment", value)}
                  required
                  disabled={isLoading}
                >
                  <SelectTrigger className="h-11 border-slate-200 dark:border-slate-600 focus:border-blue-500 dark:bg-slate-700">
                    <SelectValue placeholder="Select environment" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-slate-800 dark:border-slate-600">
                    <SelectItem value="production">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Production
                      </div>
                    </SelectItem>
                    <SelectItem value="staging">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        Staging
                      </div>
                    </SelectItem>
                    <SelectItem value="development">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Development
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  "Log On"
                )}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
                  disabled={isLoading}
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