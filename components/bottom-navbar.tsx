"use client"

interface BottomNavbarProps {
  currentView: string
  currentTime: Date
  user?: {
    id: string
    name: string
    initials: string
    role?: string
    perfil?: {
      modules: string[]
      permissions: string[]
      restrictions: Record<string, any>
    }
  }
}

export default function BottomNavbar({ currentView, currentTime, user }: BottomNavbarProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "master":
        return "text-purple-600 dark:text-purple-400"
      case "admin":
        return "text-red-600 dark:text-red-400"
      case "manager":
        return "text-orange-600 dark:text-orange-400"
      case "user":
        return "text-blue-600 dark:text-blue-400"
      case "viewer":
        return "text-gray-600 dark:text-gray-400"
      default:
        return "text-gray-600 dark:text-gray-400"
    }
  }

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
      <div className="flex items-center justify-between px-6 py-3 text-sm">
        <div className="flex items-center space-x-6">
          <span className="font-medium text-foreground">View: {currentView}</span>
          <span className="text-muted-foreground">{formatTime(currentTime)}</span>
          {user && (
            <span className="text-muted-foreground">
              User: <span className="font-medium text-foreground">{user.name}</span>
            </span>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {user && user.role && (
            <div className="flex items-center space-x-2">
              <span className="text-muted-foreground">Role:</span>
              <span className={`font-medium capitalize ${getRoleColor(user.role)}`}>{user.role}</span>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <span className="text-muted-foreground">Environment:</span>
            <span className="font-medium capitalize text-blue-600 dark:text-blue-400">development</span>
          </div>
        </div>
      </div>
    </footer>
  )
}