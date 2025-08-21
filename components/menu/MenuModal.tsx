'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronRight, Search, Folder, Eye, Loader2 } from 'lucide-react'
import { getUserAccessibleModules, getViewsByModule } from '@/lib/supabase/modules'
import type { Module, View } from '@/types/module'
import type { User } from '@/types/auth'

interface MenuModalProps {
  open: boolean
  onClose: () => void
  user: User
  onViewSelect: (viewId: string, title: string) => void
}

export function MenuModal({ open, onClose, user, onViewSelect }: MenuModalProps) {
  const [modules, setModules] = useState<Module[]>([])
  const [moduleViews, setModuleViews] = useState<Record<string, View[]>>({})
  const [expandedModules, setExpandedModules] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (open && user?.role) {
      loadModules()
    }
  }, [open, user?.role])

  const loadModules = async () => {
    setLoading(true)
    try {
      const { data } = await getUserAccessibleModules(user.role || '')
      setModules(data || [])
    } catch (error) {
      console.error('Erro ao carregar módulos:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadModuleViews = async (moduleId: string) => {
    if (moduleViews[moduleId]) return

    try {
      const { data } = await getViewsByModule(moduleId, user.role || '')
      setModuleViews(prev => ({
        ...prev,
        [moduleId]: data || []
      }))
    } catch (error) {
      console.error('Erro ao carregar views:', error)
    }
  }

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => {
      if (prev.includes(moduleId)) {
        return prev.filter(id => id !== moduleId)
      } else {
        loadModuleViews(moduleId)
        return [...prev, moduleId]
      }
    })
  }

  const handleViewSelect = (viewAlias: string, viewName: string) => {
    onViewSelect(viewAlias, viewName)
    onClose()
  }

  const filteredModules = modules.filter(module =>
    module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    module.alias.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Folder className="h-5 w-5 text-blue-600" />
            Menu de Módulos e Views
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar módulos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Lista de Módulos */}
          <div className="max-h-96 overflow-y-auto space-y-3">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">Carregando módulos...</span>
              </div>
            ) : (
              filteredModules.map((module) => (
                <Card key={module.id} className="transition-shadow hover:shadow-md">
                  <Collapsible>
                    <CardHeader className="pb-3">
                      <CollapsibleTrigger asChild>
                        <div className="flex items-center justify-between cursor-pointer">
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
                      </CollapsibleTrigger>
                      <p className="text-muted-foreground text-sm">{module.description}</p>
                      <Badge variant="outline" className="w-fit">
                        {module.alias}
                      </Badge>
                    </CardHeader>

                    <CollapsibleContent>
                      <CardContent className="pt-0">
                        {moduleViews[module.id] ? (
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">Views Disponíveis:</h4>
                            {moduleViews[module.id].map((view) => (
                              <Button
                                key={view.alias}
                                variant="ghost"
                                className="w-full justify-start text-left p-3 h-auto"
                                onClick={() => handleViewSelect(view.alias, view.name)}
                              >
                                <div className="flex items-center gap-3">
                                  <Eye className="h-4 w-4 text-green-600" />
                                  <div>
                                    <div className="font-medium">{view.name}</div>
                                    <div className="text-muted-foreground text-xs">{view.alias}</div>
                                  </div>
                                </div>
                              </Button>
                            ))}
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground">
                            Clique para carregar views...
                          </div>
                        )}
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              ))
            )}

            {!loading && filteredModules.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum módulo encontrado
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}