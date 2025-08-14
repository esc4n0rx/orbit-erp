"use client"

interface BottomNavbarProps {
  currentView: string
  currentTime: Date
  environment: string
}

export default function BottomNavbar({ currentView, currentTime, environment }: BottomNavbarProps) {
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

  const getEnvironmentColor = (env: string) => {
    switch (env.toLowerCase()) {
      case "production":
        return "text-green-600 dark:text-green-400"
      case "staging":
        return "text-yellow-600 dark:text-yellow-400"
      case "development":
        return "text-blue-600 dark:text-blue-400"
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
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-muted-foreground">Environment:</span>
          <span className={`font-medium capitalize ${getEnvironmentColor(environment)}`}>{environment}</span>
        </div>
      </div>
    </footer>
  )
}
