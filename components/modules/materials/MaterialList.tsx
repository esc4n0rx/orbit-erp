"use client"

import { useState } from 'react'
import { Search, Eye, Edit, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MessageBar } from '@/components/ui/message-bar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Loader2 } from 'lucide-react'
import type { Material, MaterialSearchCriteria } from '@/types/material-management'

interface MaterialListProps {
  materials: Material[]
  loading: boolean
  error: string | null
  onSearch: (criteria: MaterialSearchCriteria) => void
  onSelectMaterial: (material: Material, action: 'view' | 'edit') => void
  showActions?: boolean
  showViewAction?: boolean
}

export default function MaterialList({ 
  materials, 
  loading, 
  error, 
  onSearch, 
  onSelectMaterial, 
  showActions = true,
  showViewAction = false
}: MaterialListProps) {
  const [searchCriteria, setSearchCriteria] = useState<MaterialSearchCriteria>({})

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
            Buscar Materiais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="codigo_material">Código do Material</Label>
              <Input
                id="codigo_material"
                value={searchCriteria.codigo_material || ''}
                onChange={(e) => setSearchCriteria(prev => ({ ...prev, codigo_material: e.target.value }))}
                placeholder="Ex: MAT123456"
              />
            </div>

            <div>
              <Label htmlFor="codigo_interno">Código Interno</Label>
              <Input
                id="codigo_interno"
                value={searchCriteria.codigo_interno || ''}
                onChange={(e) => setSearchCriteria(prev => ({ ...prev, codigo_interno: e.target.value }))}
                placeholder="Ex: INT12345678"
              />
            </div>

            <div>
              <Label htmlFor="descricao">Descrição</Label>
              <Input
                id="descricao"
                value={searchCriteria.descricao || ''}
                onChange={(e) => setSearchCriteria(prev => ({ ...prev, descricao: e.target.value }))}
                placeholder="Nome do material"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={searchCriteria.status || 'all'}
                onValueChange={(value) => setSearchCriteria(prev => ({ 
                  ...prev, 
                  status: value === 'all' ? undefined : value as 'active' | 'inactive' 
                }))}>
                <SelectTrigger>
                  <SelectValue />
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
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              Buscar
            </Button>
            <Button variant="outline" onClick={handleClearSearch}>
              Limpar
            </Button>
          </div>
        </CardContent>
      </Card>
 
      {/* Resultados */}
      {error && (
        <MessageBar variant="destructive" title="Erro">
          {error}
        </MessageBar>
      )}
 
      {materials.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              Materiais Encontrados ({materials.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código Material</TableHead>
                    <TableHead>Código Interno</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Unidade</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Depósito</TableHead>
                    <TableHead>Status</TableHead>
                    {(showActions || showViewAction) && <TableHead className="w-24">Ações</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {materials.map((material) => (
                    <TableRow key={material.id}>
                      <TableCell className="font-medium">
                        {material.codigo_material}
                      </TableCell>
                      <TableCell>{material.codigo_interno}</TableCell>
                      <TableCell>{material.descricao}</TableCell>
                      <TableCell>{material.unidade_medida}</TableCell>
                      <TableCell>
                        {material.categoria?.grupo_mercadoria} - {material.categoria?.categoria}
                      </TableCell>
                      <TableCell>
                        {material.deposito?.codigo} - {material.deposito?.nome}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(material.status)}
                      </TableCell>
                      {(showActions || showViewAction) && (
                        <TableCell>
                          <div className="flex gap-1">
                            {showViewAction && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onSelectMaterial(material, 'view')}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            )}
                            {showActions && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onSelectMaterial(material, 'edit')}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
 
      {!loading && materials.length === 0 && !error && (
        <Card>
          <CardContent className="text-center py-8">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Nenhum material encontrado. Use os filtros acima para buscar.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
 }