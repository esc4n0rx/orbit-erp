"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface LoginScreenProps {
  onLogin: (userData: { name: string; initials: string; environment: string }) => void
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [environment, setEnvironment] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (username && password && environment) {
      // Generate initials from username
      const initials = username
        .split(" ")
        .map((name) => name[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)

      onLogin({
        name: username,
        initials: initials || username.slice(0, 2).toUpperCase(),
        environment,
      })
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
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="environment" className="text-slate-600 dark:text-slate-300">
                  Environment
                </Label>
                <Select value={environment} onValueChange={setEnvironment} required>
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

              <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium">
                Log On
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
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
