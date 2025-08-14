"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Search,
  Moon,
  Sun,
  LogOut,
  Plus,
  X,
  Home,
  Settings,
  Star,
  Clock,
  BarChart3,
  Package,
  Users,
  FileText,
  Calculator,
  Briefcase,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTheme } from "next-themes"
import ViewCard from "@/components/view-card"
import ViewRenderer from "@/components/view-renderer"
import BottomNavbar from "@/components/bottom-navbar"
import { Badge } from "@/components/ui/badge"

interface DashboardProps {
  user: {
    name: string
    initials: string
    environment: string
  }
  onLogout: () => void
}

interface Tab {
  id: string
  title: string
  viewId: string
  isActive: boolean
}

const recentViews = [
  {
    id: "financial-report",
    title: "Financial Report",
    description: "Monthly financial overview",
    lastAccessed: "2 hours ago",
  },
  {
    id: "inventory-control",
    title: "Inventory Control",
    description: "Stock management system",
    lastAccessed: "1 day ago",
  },
  {
    id: "sales-dashboard",
    title: "Sales Dashboard",
    description: "Sales performance metrics",
    lastAccessed: "3 days ago",
  },
]

const suggestedViews = [
  {
    id: "purchase-orders",
    title: "Purchase Orders",
    description: "Manage procurement processes",
    category: "Procurement",
  },
  {
    id: "hr-management",
    title: "HR Management",
    description: "Employee and payroll management",
    category: "Human Resources",
  },
  {
    id: "production-planning",
    title: "Production Planning",
    description: "Manufacturing schedule and resources",
    category: "Manufacturing",
  },
]

const quickAccessViews = [
  { id: "financial-report", title: "Financeiro", icon: BarChart3 },
  { id: "inventory-control", title: "Estoque", icon: Package },
  { id: "hr-management", title: "RH", icon: Users },
  { id: "sales-dashboard", title: "Vendas", icon: FileText },
  { id: "purchase-orders", title: "Compras", icon: Calculator },
  { id: "production-planning", title: "Produção", icon: Briefcase },
]

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [tabs, setTabs] = useState<Tab[]>([{ id: "home", title: "Home", viewId: "home", isActive: true }])
  const [currentTime, setCurrentTime] = useState(new Date())
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      const viewId = searchQuery.toLowerCase().replace(/\s+/g, "-")
      openNewTab(viewId, searchQuery)
      setSearchQuery("")
    }
  }

  const openNewTab = (viewId: string, title: string) => {
    const existingTab = tabs.find((tab) => tab.viewId === viewId)

    if (existingTab) {
      // Switch to existing tab
      setTabs(
        tabs.map((tab) => ({
          ...tab,
          isActive: tab.id === existingTab.id,
        })),
      )
    } else {
      // Create new tab
      const newTab: Tab = {
        id: `tab-${Date.now()}`,
        title,
        viewId,
        isActive: true,
      }

      setTabs((prevTabs) => [...prevTabs.map((tab) => ({ ...tab, isActive: false })), newTab])
    }
  }

  const switchTab = (tabId: string) => {
    setTabs(
      tabs.map((tab) => ({
        ...tab,
        isActive: tab.id === tabId,
      })),
    )
  }

  const closeTab = (tabId: string) => {
    if (tabs.length === 1) return // Don't close the last tab

    const tabIndex = tabs.findIndex((tab) => tab.id === tabId)
    const isActiveTab = tabs[tabIndex].isActive

    const newTabs = tabs.filter((tab) => tab.id !== tabId)

    if (isActiveTab && newTabs.length > 0) {
      // Activate the previous tab or the first one
      const newActiveIndex = Math.max(0, tabIndex - 1)
      newTabs[newActiveIndex].isActive = true
    }

    setTabs(newTabs)
  }

  const handleViewSelect = (viewId: string, title: string) => {
    openNewTab(viewId, title)
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const activeTab = tabs.find((tab) => tab.isActive)
  const currentView = activeTab?.viewId || "home"

  // Prevent hydration mismatch
  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b shadow-sm">
        {/* Top Menu Bar */}
        <div className="flex h-12 items-center justify-between px-4 bg-slate-800 dark:bg-slate-900 text-white">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-600 text-white rounded flex items-center justify-center text-sm font-bold">
                O
              </div>
              <span className="font-semibold">Orbit ERP</span>
            </div>

            <nav className="flex items-center space-x-4 text-sm">
              <button className="hover:bg-slate-700 dark:hover:bg-slate-800 px-3 py-1 rounded transition-colors">
                Menu
              </button>
              <button className="hover:bg-slate-700 dark:hover:bg-slate-800 px-3 py-1 rounded transition-colors">
                Processar
              </button>
              <button className="hover:bg-slate-700 dark:hover:bg-slate-800 px-3 py-1 rounded transition-colors">
                Favoritos
              </button>
              <button className="hover:bg-slate-700 dark:hover:bg-slate-800 px-3 py-1 rounded transition-colors">
                Relatórios
              </button>
              <button className="hover:bg-slate-700 dark:hover:bg-slate-800 px-3 py-1 rounded transition-colors">
                Sistemas
              </button>
              <button className="hover:bg-slate-700 dark:hover:bg-slate-800 px-3 py-1 rounded transition-colors">
                Ajuda
              </button>
            </nav>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="text-white hover:bg-slate-700 dark:hover:bg-slate-800"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="text-white hover:bg-slate-700 dark:hover:bg-slate-800"
            >
              <LogOut className="h-4 w-4" />
            </Button>

            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
              {user.initials}
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex h-12 items-center justify-between px-4 bg-slate-100 dark:bg-slate-800 border-b">
          <div className="flex items-center space-x-2 flex-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => switchTab("home")}
              className={`${tabs.find((t) => t.id === "home")?.isActive ? "bg-background shadow-sm" : ""} hover:bg-background/80`}
            >
              <Home className="h-4 w-4" />
            </Button>

            {/* Search Input */}
            <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Digite o nome da view..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-8 text-sm border focus:border-blue-500 bg-background"
              />
            </form>

            <div className="w-px h-6 bg-border mx-2" />

            {quickAccessViews.map((view) => {
              const Icon = view.icon
              return (
                <Button
                  key={view.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewSelect(view.id, view.title)}
                  title={view.title}
                  className="hover:bg-background/80"
                >
                  <Icon className="h-4 w-4" />
                </Button>
              )
            })}

            <div className="w-px h-6 bg-border mx-2" />

            <Button variant="ghost" size="sm" className="hover:bg-background/80">
              <Settings className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs bg-background">
              {user.environment}
            </Badge>
            <span className="text-xs text-muted-foreground">{currentTime.toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center bg-background border-b overflow-x-auto">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`flex items-center min-w-0 border-r transition-colors ${
                tab.isActive
                  ? "bg-background border-b-2 border-b-blue-600"
                  : "bg-muted/50 hover:bg-muted dark:bg-slate-800 dark:hover:bg-slate-700"
              }`}
            >
              <button
                onClick={() => switchTab(tab.id)}
                className="flex items-center space-x-2 px-4 py-2 text-sm truncate"
              >
                {tab.viewId === "home" ? (
                  <Home className="h-3 w-3 flex-shrink-0" />
                ) : (
                  <FileText className="h-3 w-3 flex-shrink-0" />
                )}
                <span className="truncate max-w-32">{tab.title}</span>
              </button>

              {tab.id !== "home" && (
                <button onClick={() => closeTab(tab.id)} className="p-1 hover:bg-red-500/20 rounded transition-colors">
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => openNewTab("new-view", "Nova View")}
            className="flex-shrink-0 px-2 hover:bg-muted"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Main Content with top padding for fixed header */}
      <main className="pt-36 pb-16">
        {currentView === "home" ? (
          <div className="p-6">
            {/* Recent Views */}
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-6 text-foreground flex items-center gap-2">
                <Clock className="h-6 w-6" />
                Minhas Views Recentes
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentViews.map((view) => (
                  <ViewCard
                    key={view.id}
                    title={view.title}
                    description={view.description}
                    metadata={view.lastAccessed}
                    onClick={() => handleViewSelect(view.id, view.title)}
                    variant="recent"
                  />
                ))}
              </div>
            </section>

            {/* Suggested Views */}
            <section>
              <h2 className="text-2xl font-semibold mb-6 text-foreground flex items-center gap-2">
                <Star className="h-6 w-6" />
                Sugestões de Uso
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {suggestedViews.map((view) => (
                  <ViewCard
                    key={view.id}
                    title={view.title}
                    description={view.description}
                    metadata={view.category}
                    onClick={() => handleViewSelect(view.id, view.title)}
                    variant="suggested"
                  />
                ))}
              </div>
            </section>
          </div>
        ) : (
          <ViewRenderer viewId={currentView} onOpenView={handleViewSelect} />
        )}
      </main>

      {/* Bottom Navbar */}
      <BottomNavbar currentView={activeTab?.title || "Home"} currentTime={currentTime} environment={user.environment} />
    </div>
  )
}
