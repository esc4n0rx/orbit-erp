"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  Calendar,
  Settings,
  ExternalLink
} from 'lucide-react'
import { getAllDevelopmentViews, deleteDevelopmentView } from '@/lib/supabase/view-renderer'
import type { DevelopmentView } from '@/types/view-builder'
import type { User } from '@/types/user'

interface ViewBuilderManagerProps {
  currentUser: User
  onCreateNew?: () => void
  onEditView?: (view: DevelopmentView) => void
  onOpenView?: (viewId: string, title: string) => void
}

export default function ViewBuilderManager({ 
  currentUser, 
  onCreateNew, 
  onEditView,
  onOpenView 
}: ViewBuilderManagerProps) {
  const [views, setViews] = useState<DevelopmentView[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')

  useEffect(() => {
    loadViews()
  }, [])

  const loadViews = async () => {
    setLoading(true)
    setError(null)

    try {
      const { data, error: fetchError } = await getAllDevelopmentViews()
      
      if (fetchError) {
        setError(fetchError)
      } else {
        setViews(data || [])
      }
    } catch (err) {
      setError('Erro ao carregar views')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteView = async (viewId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta view?')) return

    try {
      const { success, error } = await deleteDevelopmentView(viewId)
      
      if (success) {
        setViews(views.filter(v => v.id !== viewId))
      } else {
        alert(error || 'Erro ao excluir view')
      }
    } catch (err) {
      alert('Erro ao excluir view')
    }
  }

  const filteredViews = views.filter(view => {
    const matchesSearch = view.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         view.alias.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || view.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const statusOptions = [
    { value: 'all', label: 'Todos', count: views.length },
    { value: 'development', label: 'Desenvolvimento', count: views.filter(v => v.status === 'development').length },
    { value: 'testing', label: 'Teste', count: views.filter(v => v.status === 'testing').length },
    { value: 'ready', label: 'Pronto', count: views.filter(v => v.status === 'ready').length },
    { value: 'published', label: 'Publicado', count: views.filter(v => v.status === 'published').length }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'development': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'testing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'ready': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'published': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando views...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Settings className="h-8 w-8 text-blue-600" />
            Gerenciar Views
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie suas views personalizadas criadas no View Builder
          </p>
        </div>
        
        <Button onClick={onCreateNew}>
          <Plus className="h-4 w-4 mr-2" />
          Nova View
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou alias..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              {statusOptions.map(option => (
                <Badge
                  key={option.value}
                  variant={selectedStatus === option.value ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setSelectedStatus(option.value)}
                >
                  {option.label} ({option.count})
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Views Grid */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="p-4">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredViews.map(view => (
          <Card key={view.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-1">{view.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {view.description || 'Sem descrição'}
                  </p>
                </div>
                <Badge className={getStatusColor(view.status)}>
                  {view.status}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Info */}
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Alias:</span>
                  <code className="bg-muted px-2 py-1 rounded text-xs">{view.alias}</code>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Criado em {new Date(view.created_at).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Componentes: {view.schema_json?.components?.length || 0}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onOpenView?.(view.alias, view.name)}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Visualizar
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEditView?.(view)}
                >
                  <Edit className="h-4 w-4" />
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDeleteView(view.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredViews.length === 0 && !loading && (
        <Card>
          <CardContent className="py-16">
            <div className="text-center space-y-4">
              <div className="text-6xl opacity-20">📋</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  {searchTerm || selectedStatus !== 'all' 
                    ? 'Nenhuma view encontrada' 
                    : 'Nenhuma view criada ainda'
                  }
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  {searchTerm || selectedStatus !== 'all'
                    ? 'Tente ajustar os filtros de busca para encontrar suas views.'
                    : 'Comece criando sua primeira view personalizada com o View Builder.'
                  }
                </p>
              </div>
              {(!searchTerm && selectedStatus === 'all') && (
                <Button onClick={onCreateNew}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeira View
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}