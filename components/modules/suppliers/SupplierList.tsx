// components/modules/suppliers/SupplierList.tsx
"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { MessageBar } from '@/components/ui/message-bar'
import { Search, Eye, Edit, User, Building2 } from 'lucide-react'
import type { Supplier, SupplierSearchCriteria } from '@/types/supplier'

interface SupplierListProps {
  suppliers: Supplier[]
  loading: boolean
  error: string | null
  onSearch: (criteria: SupplierSearchCriteria) => void
  onSelectSupplier: (supplier: Supplier, action: 'view' | 'edit') => void
  showActions: boolean
}

export default function SupplierList({
  suppliers,
  loading,
  error,
  onSearch,
  onSelectSupplier,
  showActions
}: SupplierListProps) {
  const [searchCriteria, setSearchCriteria] = useState<SupplierSearchCriteria>({})

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchCriteria)
  }

  const handleClearSearch = () => {
    setSearchCriteria({})
    onSearch({})
  }

  const handleTipoChange = (value: string) => {
    if (value === 'all') {
      setSearchCriteria(prev => ({ ...prev, tipo_fornecedor: undefined }))
    } else {
      setSearchCriteria(prev => ({ ...prev, tipo_fornecedor: value as 'fisica' | 'juridica' }))
    }
  }

  const handleStatusChange = (value: string) => {
    if (value === 'all') {
      setSearchCriteria(prev => ({ ...prev, status: undefined }))
    } else {
      setSearchCriteria(prev => ({ ...prev, status: value as 'active' | 'inactive' }))
    }
  }

  const formatDocument = (supplier: Supplier) => {
    if (supplier.tipo_fornecedor === 'fisica') {
      return supplier.cpf || 'Não informado'
    } else {
      return supplier.cnpj || 'Não informado'
    }
  }

  const getStatusBadge = (status: string) => {
    return status === 'active' ? (
      <Badge variant="default" className="bg-green-500">Ativo</Badge>
    ) : (
      <Badge variant="secondary">Inativo</Badge>
    )
  }

  const getTipoBadge = (tipo: string) => {
    return tipo === 'fisica' ? (
      <Badge variant="outline" className="flex items-center gap-1">
        <User className="h-3 w-3" />
        Pessoa Física
      </Badge>
    ) : (
      <Badge variant="outline" className="flex items-center gap-1">
        <Building2 className="h-3 w-3" />
        Pessoa Jurídica
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filtros de Busca */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscar Fornecedores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="codigo_interno">Código Interno</Label>
                <Input
                  id="codigo_interno"
                  value={searchCriteria.codigo_interno || ''}
                  onChange={(e) => setSearchCriteria(prev => ({ ...prev, codigo_interno: e.target.value }))}
                  placeholder="FN0001"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="razao_social">Razão Social/Nome</Label>
                <Input
                  id="razao_social"
                  value={searchCriteria.razao_social || ''}
                  onChange={(e) => setSearchCriteria(prev => ({ ...prev, razao_social: e.target.value }))}
                  placeholder="Nome do fornecedor"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="documento">CPF/CNPJ</Label>
                <Input
                  id="documento"
                  value={searchCriteria.cnpj || searchCriteria.cpf || ''}
                  onChange={(e) => {
                    const value = e.target.value
                    if (value.length <= 14) {
                      setSearchCriteria(prev => ({ ...prev, cpf: value, cnpj: undefined }))
                    } else {
                      setSearchCriteria(prev => ({ ...prev, cnpj: value, cpf: undefined }))
                    }
                  }}
                  placeholder="000.000.000-00 ou 00.000.000/0000-00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo_fornecedor">Tipo</Label>
                <Select onValueChange={handleTipoChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    <SelectItem value="fisica">Pessoa Física</SelectItem>
                    <SelectItem value="juridica">Pessoa Jurídica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select onValueChange={handleStatusChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </Button>
              <Button type="button" variant="outline" onClick={handleClearSearch} disabled={loading}>
                Limpar Filtros
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Mensagem de Erro */}
      {error && (
        <MessageBar variant="destructive">{error}</MessageBar>
      )}

      {/* Resultados */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Fornecedores Encontrados</CardTitle>
            <Badge variant="outline">
              {suppliers.length} {suppliers.length === 1 ? 'resultado' : 'resultados'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Carregando fornecedores...</p>
              </div>
            </div>
          ) : suppliers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Building2 className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>Nenhum fornecedor encontrado</p>
              <p className="text-sm mt-2">Tente ajustar os filtros de busca</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Fornecedor</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Documento</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Status</TableHead>
                    {showActions && <TableHead>Ações</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suppliers.map((supplier) => (
                    <TableRow key={supplier.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        {supplier.codigo_interno}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{supplier.razao_social}</div>
                          {supplier.nome_fantasia && (
                            <div className="text-sm text-muted-foreground">
                              {supplier.nome_fantasia}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getTipoBadge(supplier.tipo_fornecedor)}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {formatDocument(supplier)}
                      </TableCell>
                      <TableCell>
                        <div>
                          {supplier.telefone_celular && (
                            <div className="text-sm">{supplier.telefone_celular}</div>
                          )}
                          {supplier.email && (
                            <div className="text-sm text-muted-foreground">{supplier.email}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(supplier.status)}
                      </TableCell>
                      {showActions && (
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onSelectSupplier(supplier, 'view')}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onSelectSupplier(supplier, 'edit')}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}