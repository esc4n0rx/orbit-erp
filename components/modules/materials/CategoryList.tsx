"use client"

import { useState } from 'react'
import { Search, Eye, Edit, FolderOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MessageBar } from '@/components/ui/message-bar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Category, CategorySearchCriteria } from '@/types/material'

interface CategoryListProps {
  categories: Category[]
  loading: boolean
  error: string | null
  onSearch: (criteria: CategorySearchCriteria) => void
  onSelectCategory: (category: Category, action: 'view' | 'edit') => void
  showActions?: boolean
}

export default function CategoryList({ 
  categories, 
  loading, 
  error, 
  onSearch, 
  onSelectCategory, 
  showActions = true
}: CategoryListProps) {
  const [searchCriteria, setSearchCriteria] = useState<CategorySearchCriteria>({})

  const handleSearch = () => {
    onSearch(searchCriteria)
  }

  const handleClearSearch = () => {
    setSearchCriteria({})
    onSearch({})
  }

  const getStatusBadge = (status: string) => {
    const variant = status === 'active' ? 'default' : 'secondary'
    const text = status === 'active' ? 'Ativo' : 'Inativo'
    return <Badge variant={variant}>{text}</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Filtros de Busca */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscar Categorias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <Label htmlFor="search-codigo">Código Interno</Label>
              <Input
                id="search-codigo"
                placeholder="Digite o código"
                value={searchCriteria.codigo_interno || ''}
                onChange={(e) => setSearchCriteria(prev => ({ ...prev, codigo_interno: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="search-grupo">Grupo de Mercadoria</Label>
              <Input
                id="search-grupo"
                placeholder="Digite o grupo"
                value={searchCriteria.grupo_mercadoria || ''}
                onChange={(e) => setSearchCriteria(prev => ({ ...prev, grupo_mercadoria: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="search-categoria">Categoria</Label>
              <Input
                id="search-categoria"
                placeholder="Digite a categoria"
                value={searchCriteria.categoria || ''}
                onChange={(e) => setSearchCriteria(prev => ({ ...prev, categoria: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="search-status">Status</Label>
              <Select
                value={searchCriteria.status || 'all'}
                onValueChange={(value) => setSearchCriteria(prev => ({ 
                  ...prev, 
                  status: value === 'all' ? undefined : value as 'active' | 'inactive'
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSearch} disabled={loading}>
              <Search className="mr-2 h-4 w-4" />
              Buscar
            </Button>
            <Button variant="outline" onClick={handleClearSearch}>
              Limpar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Mensagem de Erro */}
      {error && (
        <MessageBar variant="destructive" title="Erro na busca">
          {error}
        </MessageBar>
      )}

      {/* Lista de Categorias */}
      <Card>
        <CardHeader>
          <CardTitle>Resultados da Busca</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Buscando categorias...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-8">
              <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhuma categoria encontrada</p>
            </div>
          ) : (
            <div className="space-y-4">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                      <p className="font-medium">{category.codigo_interno}</p>
                      <p className="text-sm text-muted-foreground">Código</p>
                    </div>
                    <div>
                      <p className="font-medium">{category.grupo_mercadoria}</p>
                      <p className="text-sm text-muted-foreground">Grupo</p>
                    </div>
                    <div>
                      <p className="font-medium">{category.categoria}</p>
                      <p className="text-sm text-muted-foreground">Categoria</p>
                    </div>
                    <div className="space-y-1">
                      {getStatusBadge(category.status)}
                      {category.unidade_padrao && (
                        <Badge variant="outline">{category.unidade_padrao}</Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>Criado em: {new Date(category.created_at).toLocaleDateString()}</p>
                      {(category.controle_lote || category.controle_serie) && (
                        <div className="flex gap-1 mt-1">
                          {category.controle_lote && <Badge variant="secondary" className="text-xs">Lote</Badge>}
                          {category.controle_serie && <Badge variant="secondary" className="text-xs">Série</Badge>}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {showActions && (
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onSelectCategory(category, 'view')}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onSelectCategory(category, 'edit')}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}