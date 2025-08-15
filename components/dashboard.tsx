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
  Users,
  ChevronRight,
  Folder,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTheme } from "next-themes"
import ViewCard from "@/components/view-card"
import ViewRenderer from "@/components/view-renderer"
import BottomNavbar from "@/components/bottom-navbar"
import { Badge } from "@/components/ui/badge"
import { MessageBar } from "@/components/ui/message-bar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  getUserAccessibleViews, 
  getUserAccessibleModules,
  getRecentViews,
  getSuggestedViews,
  recordViewAccess,
  getViewsByModule
} from "@/lib/supabase/modules"
import { checkUserPermission } from "@/lib/utils/permissions"
import type { View, Module } from "@/types/module"

interface DashboardProps {
  user: {
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
  onLogout: () => void
}

interface Tab {
  id: string
  title: string
  viewId: string
  isActive: boolean
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [tabs, setTabs] = useState<Tab[]>([{ id: "home", title: "Home", viewId: "home", isActive: true }])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [permissionError, setPermissionError] = useState<string | null>(null)
  const [userViews, setUserViews] = useState<View[]>([])
  const [userModules, setUserModules] = useState<Module[]>([])
  const [recentViews, setRecentViews] = useState<any[]>([])
  const [suggestedViews, setSuggestedViews] = useState<any[]>([])
  const [expandedModules, setExpandedModules] = useState<string[]>([])
  const [moduleViews, setModuleViews] = useState<Record<string, View[]>>({})
  const [loading, setLoading] = useState(true)
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

  // Carregar dados do sistema
  useEffect(() => {
    const loadData = async () => {
      if (!user.role) return

      setLoading(true)
      
      try {
        // Carregar views acessíveis ao usuário
        const { data: views } = await getUserAccessibleViews(user.role)
        setUserViews(views || [])

        // Carregar módulos acessíveis ao usuário
        const { data: modules } = await getUserAccessibleModules(user.role)
        setUserModules(modules || [])

        // Carregar views recentes
        const { data: recent } = await getRecentViews(user.id)
        setRecentViews(recent || [])

        // Carregar views sugeridas
        const { data: suggested } = await getSuggestedViews(user.role)
        setSuggestedViews(suggested || [])

      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user])

  // Carregar views de um módulo quando expandido
  const loadModuleViews = async (moduleId: string) => {
    if (moduleViews[moduleId]) return // Já carregadas

    try {
      const { data: views } = await getViewsByModule(moduleId, user.role || '')
      setModuleViews(prev => ({
        ...prev,
        [moduleId]: views || []
      }))
    } catch (error) {
      console.error('Erro ao carregar views do módulo:', error)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      const searchTerm = searchQuery.toLowerCase()
      
      // Buscar view por alias
      const viewByAlias = userViews.find(view => 
        view.alias.toLowerCase() === searchTerm
      )
      
      if (viewByAlias) {
        openNewTab(viewByAlias.alias, viewByAlias.name)
      } else {
        // Se não encontrar por alias, buscar por nome
        const viewByName = userViews.find(view => 
          view.name.toLowerCase().includes(searchTerm)
        )
        
        if (viewByName) {
          openNewTab(viewByName.alias, viewByName.name)
        } else {
          setPermissionError(`View "${searchQuery}" não encontrada ou sem acesso`)
          setTimeout(() => setPermissionError(null), 3000)
        }
      }
      
      setSearchQuery("")
    }
  }

  const openNewTab = async (viewId: string, title: string) => {
    // Verificar se a view existe e o usuário tem acesso
    const view = userViews.find(v => v.alias === viewId)
    
    if (view) {
      const permissionCheck = checkUserPermission(
        user as any, 
        view.required_roles, 
        view.required_permissions
      )
      
      if (!permissionCheck.hasAccess) {
        setPermissionError(permissionCheck.reason || 'Acesso negado')
        setTimeout(() => setPermissionError(null), 5000)
        return
      }

      // Registrar acesso à view
      await recordViewAccess(user.id, viewId)
    }

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
    if (tabs.length === 1) return

    const tabIndex = tabs.findIndex((tab) => tab.id === tabId)
    const isActiveTab = tabs[tabIndex].isActive

    const newTabs = tabs.filter((tab) => tab.id !== tabId)

    if (isActiveTab && newTabs.length > 0) {
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

  const toggleModuleExpansion = (moduleId: string) => {
    setExpandedModules(prev => {
      if (prev.includes(moduleId)) {
        return prev.filter(id => id !== moduleId)
      } else {
        loadModuleViews(moduleId) // Carregar views quando expandir
        return [...prev, moduleId]
      }
    })
  }

  const activeTab = tabs.find((tab) => tab.isActive)
  const currentView = activeTab?.viewId || "home"

  // Filtrar views para quick access (primeiras 6)
  const quickAccessViews = userViews.slice(0, 6)

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Error Message Bar */}
      {permissionError && (
        <div className="fixed top-0 left-0 right-0 z-50 p-4">
          <MessageBar
            variant="destructive"
            title="Acesso Negado"
            onClose={() => setPermissionError(null)}
          >
            {permissionError}
          </MessageBar>
        </div>
      )}

      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-background border-b shadow-sm">
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
                placeholder="Digite o alias da view..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-8 text-sm border focus:border-blue-500 bg-background"
              />
            </form>

            <div className="w-px h-6 bg-border mx-2" />

            {/* Quick Access Views (dinâmico) */}
            {quickAccessViews.map((view) => (
              <Button
                key={view.alias}
                variant="ghost"
                size="sm"
                onClick={() => handleViewSelect(view.alias, view.name)}
                title={view.name}
                className="hover:bg-background/80"
              >
                <Users className="h-4 w-4" />
              </Button>
            ))}

            <div className="w-px h-6 bg-border mx-2" />

            <Button variant="ghost" size="sm" className="hover:bg-background/80">
              <Settings className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs bg-background">
              development
            </Badge>
            {user.role && (
              <Badge variant="secondary" className="text-xs">
                {user.role}
              </Badge>
            )}
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
                 <Users className="h-3 w-3 flex-shrink-0" />
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
     <main className={`pt-36 pb-16 ${permissionError ? 'pt-52' : ''}`}>
       {currentView === "home" ? (
         <div className="p-6 space-y-8">
           {/* Recent Views */}
           {recentViews.length > 0 && (
             <section>
               <h2 className="text-2xl font-semibold mb-6 text-foreground flex items-center gap-2">
                 <Clock className="h-6 w-6 text-blue-600" />
                 Views Recentes
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
           )}

           {/* Módulos */}
           {userModules.length > 0 && (
             <section>
               <h2 className="text-2xl font-semibold mb-6 text-foreground flex items-center gap-2">
                 <Folder className="h-6 w-6 text-purple-600" />
                 Módulos do Sistema
               </h2>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {userModules.map((module) => (
                   <Card key={module.id} className="cursor-pointer hover:shadow-md transition-shadow">
                     <CardHeader className="pb-3">
                       <div 
                         className="flex items-center justify-between"
                         onClick={() => toggleModuleExpansion(module.id)}
                       >
                         <CardTitle className="text-lg font-medium flex items-center gap-2">
                           <Folder className="h-5 w-5 text-purple-600" />
                           {module.name}
                         </CardTitle>
                         <ChevronRight 
                           className={`h-4 w-4 transition-transform ${
                             expandedModules.includes(module.id) ? 'rotate-90' : ''
                           }`} 
                         />
                       </div>
                     </CardHeader>
                     <CardContent>
                       <p className="text-muted-foreground text-sm mb-3">{module.description}</p>
                       <Badge variant="outline" className="bg-purple-50 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                         {module.alias}
                       </Badge>
                       
                       {/* Views do Módulo */}
                       {expandedModules.includes(module.id) && (
                         <div className="mt-4 space-y-2">
                           <h4 className="text-sm font-medium text-foreground">Views Disponíveis:</h4>
                           {moduleViews[module.id] ? (
                             <div className="space-y-1">
                               {moduleViews[module.id].map((view) => (
                                 <button
                                   key={view.alias}
                                   onClick={() => handleViewSelect(view.alias, view.name)}
                                   className="w-full text-left p-2 rounded hover:bg-muted transition-colors text-sm"
                                 >
                                   <div className="font-medium">{view.name}</div>
                                   <div className="text-muted-foreground text-xs">{view.alias}</div>
                                 </button>
                               ))}
                             </div>
                           ) : (
                             <div className="text-sm text-muted-foreground">Carregando...</div>
                           )}
                         </div>
                       )}
                     </CardContent>
                   </Card>
                 ))}
               </div>
             </section>
           )}

           {/* Mensagem quando não há views */}
           {userViews.length === 0 && !loading && (
             <div className="text-center py-12">
               <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
               <h3 className="text-xl font-semibold mb-2">Nenhuma view disponível</h3>
               <p className="text-muted-foreground">
                 Você não tem acesso a nenhuma view no momento. Entre em contato com o administrador.
               </p>
             </div>
           )}
         </div>
       ) : (
         <ViewRenderer 
           viewId={currentView} 
           currentUser={user as any}
           onOpenView={handleViewSelect} 
         />
       )}
     </main>

     {/* Bottom Navbar */}
     <BottomNavbar 
       currentView={activeTab?.title || "Home"} 
       currentTime={currentTime} 
       user={user}
     />
   </div>
 )
}