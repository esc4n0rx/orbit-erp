"use client"

import { useState, useEffect } from 'react'
import { Check, ChevronDown, Package, Eye, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Checkbox } from '@/components/ui/checkbox'
import { MessageBar } from '@/components/ui/message-bar'
import { getAllModulesAndViews } from '@/lib/supabase/modules'
import type { Module, View } from '@/types/module'

interface ModuleViewSelectorProps {
  selectedModules: string[]
  selectedViews: string[]
  onModulesChange: (modules: string[]) => void
  onViewsChange: (views: string[]) => void
  hasAllAccess: boolean
  onAllAccessChange: (hasAll: boolean) => void
}

export default function ModuleViewSelector({
  selectedModules,
  selectedViews,
  onModulesChange,
  onViewsChange,
  hasAllAccess,
  onAllAccessChange
}: ModuleViewSelectorProps) {
  const [modules, setModules] = useState<Module[]>([])
  const [views, setViews] = useState<View[]>([])
  const [expandedModules, setExpandedModules] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)

    try {
      const { data, error: fetchError } = await getAllModulesAndViews()
      
      if (fetchError) {
        setError(fetchError)
      } else if (data) {
        setModules(data.modules)
        setViews(data.views)
      }
    } catch (err) {
      setError('Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  const toggleModuleExpansion = (moduleId: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    )
  }

  const handleAllAccessToggle = (checked: boolean) => {
    onAllAccessChange(checked)
    if (checked) {
      onModulesChange(['*'])
      onViewsChange(['*'])
    } else {
      onModulesChange([])
      onViewsChange([])
    }
  }

  const handleModuleToggle = (moduleId: string, checked: boolean) => {
    if (hasAllAccess) return

    let newModules = [...selectedModules]
    
    if (checked) {
      if (!newModules.includes(moduleId)) {
        newModules.push(moduleId)
      }
    } else {
      newModules = newModules.filter(id => id !== moduleId)
      
      // Remover também todas as views deste módulo
      const moduleViews = views.filter(v => v.module_id === moduleId).map(v => v.id)
      const newViews = selectedViews.filter(viewId => !moduleViews.includes(viewId))
      onViewsChange(newViews)
    }
    
    onModulesChange(newModules)
  }

  const handleViewToggle = (viewId: string, checked: boolean) => {
    if (hasAllAccess) return

    let newViews = [...selectedViews]
    
    if (checked) {
      if (!newViews.includes(viewId)) {
        newViews.push(viewId)
      }
    } else {
      newViews = newViews.filter(id => id !== viewId)
    }
    
    onViewsChange(newViews)
  }

  const isModuleSelected = (moduleId: string) => {
    return hasAllAccess || selectedModules.includes('*') || selectedModules.includes(moduleId)
  }

  const isViewSelected = (viewId: string) => {
    return hasAllAccess || selectedViews.includes('*') || selectedViews.includes(viewId)
  }

  const getModuleViews = (moduleId: string) => {
    return views.filter(view => view.module_id === moduleId)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando módulos e views...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <MessageBar variant="destructive" title="Erro">
            {error}
          </MessageBar>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Controle de Acesso Total */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Check className="h-5 w-5" />
            Controle de Acesso
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="all-access"
              checked={hasAllAccess}
              onCheckedChange={handleAllAccessToggle}
            />
            <label htmlFor="all-access" className="text-sm font-medium">
              Acesso total ao sistema (*)
            </label>
          </div>
          {hasAllAccess && (
            <p className="text-sm text-muted-foreground mt-2">
              Este usuário terá acesso a todos os módulos e views do sistema.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Seleção de Módulos e Views */}
      {!hasAllAccess && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Módulos e Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {modules.map(module => {
                const moduleViews = getModuleViews(module.id)
                const isExpanded = expandedModules.includes(module.id)
                const isSelected = isModuleSelected(module.id)
                
                return (
                  <div key={module.id} className="border rounded-lg p-4">
                    <Collapsible>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) => handleModuleToggle(module.id, checked as boolean)}
                          />
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-purple-600" />
                            <span className="font-medium">{module.name}</span>
                            <Badge variant="outline">{module.alias}</Badge>
                          </div>
                        </div>
                        
                        <CollapsibleTrigger
                          onClick={() => toggleModuleExpansion(module.id)}
                          className="hover:bg-muted p-1 rounded"
                        >
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${
                              isExpanded ? 'rotate-180' : ''
                            }`}
                          />
                        </CollapsibleTrigger>
                      </div>

                      <p className="text-sm text-muted-foreground mt-1 ml-6">
                        {module.description}
                      </p>

                      <CollapsibleContent className="mt-3">
                        {moduleViews.length > 0 ? (
                          <div className="ml-6 space-y-2">
                            <h5 className="text-sm font-medium">Views disponíveis:</h5>
                            {moduleViews.map(view => (
                              <div key={view.id} className="flex items-center space-x-2 p-2 rounded hover:bg-muted">
                                <Checkbox
                                  checked={isViewSelected(view.id)}
                                  onCheckedChange={(checked) => handleViewToggle(view.id, checked as boolean)}
                                  disabled={!isSelected}
                                />
                                <Eye className="h-3 w-3 text-green-600" />
                                <span className="text-sm">{view.name}</span>
                                <Badge variant="secondary" className="text-xs">{view.alias}</Badge>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground ml-6">
                            Nenhuma view disponível neste módulo.
                          </p>
                        )}
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resumo da Seleção */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo da Seleção</CardTitle>
        </CardHeader>
        <CardContent>
          {hasAllAccess ? (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm">
                <strong>Acesso Total:</strong> Usuário terá acesso a todos os módulos e views.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium mb-2">Módulos selecionados ({selectedModules.length}):</p>
                {selectedModules.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {selectedModules.map(moduleId => {
                      const module = modules.find(m => m.id === moduleId)
                      return (
                        <Badge key={moduleId} variant="outline">
                          {module?.name || moduleId}
                        </Badge>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Nenhum módulo selecionado</p>
                )}
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Views selecionadas ({selectedViews.length}):</p>
                {selectedViews.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {selectedViews.map(viewId => {
                      const view = views.find(v => v.id === viewId)
                      return (
                        <Badge key={viewId} variant="secondary">
                          {view?.name || viewId}
                        </Badge>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Nenhuma view selecionada</p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}