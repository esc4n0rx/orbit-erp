// components/modules/clients/ClientList.tsx - Correção nos SelectItem
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
import type { Client, ClientSearchCriteria } from '@/types/client'

interface ClientListProps {
  clients: Client[]
  loading: boolean
  error: string | null
  onSearch: (criteria: ClientSearchCriteria) => void
  onSelectClient: (client: Client, action: 'view' | 'edit') => void
  showActions: boolean
}

export default function ClientList({
  clients,
  loading,
  error,
  onSearch,
  onSelectClient,
  showActions
}: ClientListProps) {
  const [searchCriteria, setSearchCriteria] = useState<ClientSearchCriteria>({})

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
      setSearchCriteria(prev => ({ ...prev, tipo_cliente: undefined }))
    } else {
      setSearchCriteria(prev => ({ ...prev, tipo_cliente: value as 'fisica' | 'juridica' }))
    }
  }

  const handleStatusChange = (value: string) => {
    if (value === 'all') {
      setSearchCriteria(prev => ({ ...prev, status: undefined }))
    } else {
      setSearchCriteria(prev => ({ ...prev, status: value as 'active' | 'inactive' }))
    }
  }

  const formatDocument = (client: Client) => {
    if (client.tipo_cliente === 'fisica') {
      return client.cpf || 'Não informado'
    } else {
      return client.cnpj || 'Não informado'
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
      <Badge variant="outline">PF</Badge>
    ) : (
      <Badge variant="outline">PJ</Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filtros de Busca */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscar Clientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="codigo_interno">Código Interno</Label>
                <Input
                  id="codigo_interno"
                  value={searchCriteria.codigo_interno || ''}
                  onChange={(e) => setSearchCriteria(prev => ({ ...prev, codigo_interno: e.target.value }))}
                  placeholder="CL0001"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="razao_social">Razão Social / Nome</Label>
                <Input
                  id="razao_social"
                  value={searchCriteria.razao_social || ''}
                  onChange={(e) => setSearchCriteria(prev => ({ ...prev, razao_social: e.target.value }))}
                  placeholder="Nome do cliente"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo_cliente">Tipo</Label>
                <Select 
                  value={searchCriteria.tipo_cliente || 'all'} 
                  onValueChange={handleTipoChange}
                >
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
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  value={searchCriteria.cpf || ''}
                  onChange={(e) => setSearchCriteria(prev => ({ ...prev, cpf: e.target.value }))}
                  placeholder="000.000.000-00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input
                  id="cnpj"
                  value={searchCriteria.cnpj || ''}
                  onChange={(e) => setSearchCriteria(prev => ({ ...prev, cnpj: e.target.value }))}
                  placeholder="00.000.000/0000-00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={searchCriteria.status || 'all'} 
                  onValueChange={handleStatusChange}
                >
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
                {loading ? 'Buscando...' : 'Buscar'}
              </Button>
              <Button type="button" variant="outline" onClick={handleClearSearch}>
                Limpar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Mensagem de Erro */}
      {error && (
        <MessageBar variant="destructive" title="Erro na busca">
          {error}
        </MessageBar>
      )}

      {/* Lista de Resultados */}
      <Card>
        <CardHeader>
          <CardTitle>
            Resultados da Busca ({clients.length} cliente{clients.length !== 1 ? 's' : ''})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Buscando clientes...</p>
            </div>
          ) : clients.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-muted-foreground">
                {Object.keys(searchCriteria).some(key => searchCriteria[key as keyof ClientSearchCriteria]) 
                  ? 'Nenhum cliente encontrado com os critérios informados.'
                  : 'Use os filtros acima para buscar clientes.'
                }
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Documento</TableHead>
                    <TableHead>Status</TableHead>
                    {showActions && <TableHead>Ações</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map((client) => (
                    <TableRow key={client.id} className="hover:bg-muted/50">
                      <TableCell>
                        <Badge variant="secondary">{client.codigo_interno}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {client.tipo_cliente === 'fisica' ? (
                            <User className="h-4 w-4 text-blue-600" />
                          ) : (
                            <Building2 className="h-4 w-4 text-blue-600" />
                          )}
                          <div>
                            <div className="font-medium">{client.razao_social}</div>
                            {client.nome_fantasia && (
                              <div className="text-sm text-muted-foreground">
                                {client.nome_fantasia}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getTipoBadge(client.tipo_cliente)}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {formatDocument(client)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(client.status)}
                        {client.bloqueado_venda && (
                          <Badge variant="destructive" className="ml-2">Bloqueado</Badge>
                        )}
                      </TableCell>
                      {showActions && (
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onSelectClient(client, 'view')}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => onSelectClient(client, 'edit')}
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