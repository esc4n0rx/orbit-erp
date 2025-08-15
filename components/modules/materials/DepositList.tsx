"use client"

import { useState } from 'react'
import { Search, Eye, Edit, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MessageBar } from '@/components/ui/message-bar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Deposit, DepositSearchCriteria } from '@/types/material'

interface DepositListProps {
  deposits: Deposit[]
  loading: boolean
  error: string | null
  onSearch: (criteria: DepositSearchCriteria) => void
  onSelectDeposit: (deposit: Deposit, action: 'view' | 'edit') => void
  showActions?: boolean
}

export default function DepositList({ 
  deposits, 
  loading, 
  error, 
  onSearch, 
  onSelectDeposit, 
  showActions = true
}: DepositListProps) {
  const [searchCriteria, setSearchCriteria] = useState<DepositSearchCriteria>({})

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

  const formatCapacidade = (capacidade?: number) => {
    if (!capacidade) return 'Não definida'
    return `${capacidade.toLocaleString()} unidades`
  }

  return (
    <div className="space-y-6">
      {/* Filtros de Busca */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscar Depósitos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <Label htmlFor="search-nome">Nome do Depósito</Label>
              <Input
                id="search-nome"
                placeholder="Digite o nome"
                value={searchCriteria.nome || ''}
                onChange={(e) => setSearchCriteria(prev => ({ ...prev, nome: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="search-codigo">Código</Label>
              <Input
                id="search-codigo"
                placeholder="Digite o código"
                value={searchCriteria.codigo || ''}
                onChange={(e) => setSearchCriteria(prev => ({ ...prev, codigo: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="search-responsavel">Responsável</Label>
              <Input
                id="search-responsavel"
                placeholder="Digite o responsável"
                value={searchCriteria.responsavel || ''}
                onChange={(e) => setSearchCriteria(prev => ({ ...prev, responsavel: e.target.value }))}
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

      {/* Lista de Depósitos */}
      <Card>
        <CardHeader>
          <CardTitle>Resultados da Busca</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Buscando depósitos...</p>
            </div>
          ) : deposits.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum depósito encontrado</p>
            </div>
          ) : (
            <div className="space-y-4">
              {deposits.map((deposit) => (
                <div
                  key={deposit.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                      <p className="font-medium">{deposit.nome}</p>
                      <p className="text-sm text-muted-foreground">Código: {deposit.codigo}</p>
                    </div>
                    <div>
                      <p className="text-sm">{deposit.endereco || 'Não informado'}</p>
                      <p className="text-sm text-muted-foreground">Endereço</p>
                    </div>
                    <div>
                      <p className="text-sm">{deposit.responsavel || 'Não informado'}</p>
                      <p className="text-sm text-muted-foreground">Responsável</p>
                    </div>
                    <div className="space-y-1">
                      {getStatusBadge(deposit.status)}
                      {deposit.permite_transferencia && (
                        <Badge variant="outline" className="text-xs">Transferência</Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>Capacidade: {formatCapacidade(deposit.capacidade_maxima)}</p>
                      <p>Criado em: {new Date(deposit.created_at).toLocaleDateString()}</p>
                      {deposit.tipos_produtos_aceitos.length > 0 && (
                        <p className="text-xs">
                          {deposit.tipos_produtos_aceitos.length} categoria(s) aceita(s)
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {showActions && (
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onSelectDeposit(deposit, 'view')}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onSelectDeposit(deposit, 'edit')}
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