"use client"

import { useState } from 'react'
import { Search, Eye, Edit, User, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MessageBar } from '@/components/ui/message-bar'
import type { User as UserType, UserSearchCriteria } from '@/types/user'

interface UserListProps {
  users: UserType[]
  loading: boolean
  error: string | null
  onSearch: (criteria: UserSearchCriteria) => void
  onSelectUser: (user: UserType, action: 'view' | 'edit') => void
  showActions?: boolean
  mode?: 'default' | 'permission' // Novo prop para identificar o modo
}

export default function UserList({ 
  users, 
  loading, 
  error, 
  onSearch, 
  onSelectUser, 
  showActions = true,
  mode = 'default'
}: UserListProps) {
  const [searchCriteria, setSearchCriteria] = useState<UserSearchCriteria>({})

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

  const getRoleBadge = (role: string) => {
    const roleMap = {
      master: { text: 'Master', variant: 'destructive' as const },
      admin: { text: 'Admin', variant: 'default' as const },
      user: { text: 'Usuário', variant: 'secondary' as const },
      support: { text: 'Suporte', variant: 'outline' as const }
    }
    
    const roleInfo = roleMap[role as keyof typeof roleMap] || { text: role, variant: 'outline' as const }
    return <Badge variant={roleInfo.variant}>{roleInfo.text}</Badge>
  }

  const handleUserClick = (user: UserType) => {
    if (mode === 'permission') {
      onSelectUser(user, 'edit') // No modo permission, sempre usar 'edit'
    }
  }

  return (
    <div className="space-y-6">
      {/* Filtros de Busca */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Buscar Usuários
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label htmlFor="search-login">Nome de Usuário</Label>
              <Input
                id="search-login"
                placeholder="Digite o nome de usuário"
                value={searchCriteria.login || ''}
                onChange={(e) => setSearchCriteria(prev => ({ ...prev, login: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="search-cpf">CPF</Label>
              <Input
                id="search-cpf"
                placeholder="Digite o CPF"
                value={searchCriteria.cpf || ''}
                onChange={(e) => setSearchCriteria(prev => ({ ...prev, cpf: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="search-name">Nome Completo</Label>
              <Input
                id="search-name"
                placeholder="Digite o nome completo"
                value={searchCriteria.nome_completo || ''}
                onChange={(e) => setSearchCriteria(prev => ({ ...prev, nome_completo: e.target.value }))}
              />
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

      {/* Lista de Usuários */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Resultados da Busca</span>
            {mode === 'permission' && (
              <Badge variant="outline" className="bg-purple-50 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                <Settings className="h-3 w-3 mr-1" />
                Clique no usuário para gerenciar permissões
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Buscando usuários...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8">
              <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum usuário encontrado</p>
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${
                    mode === 'permission' 
                      ? 'cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-300 dark:hover:border-purple-700' 
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => handleUserClick(user)}
                >
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="font-medium flex items-center gap-2">
                        {user.nome_completo}
                        {mode === 'permission' && (
                          <Settings className="h-3 w-3 text-purple-600" />
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">@{user.login}</p>
                    </div>
                    <div>
                      <p className="text-sm">CPF: {user.cpf}</p>
                      <p className="text-sm text-muted-foreground">{user.job_function}</p>
                    </div>
                    <div className="space-y-1">
                      {getStatusBadge(user.status)}
                      {getRoleBadge(user.role)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>Criado em: {new Date(user.created_at).toLocaleDateString()}</p>
                      <p>Atualizado em: {new Date(user.updated_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  {/* Botões de ação - apenas no modo padrão */}
                  {showActions && mode === 'default' && (
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          onSelectUser(user, 'view')
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          onSelectUser(user, 'edit')
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  {/* Indicador visual no modo permission */}
                  {mode === 'permission' && (
                    <div className="ml-4">
                      <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                        <Settings className="h-3 w-3 text-purple-600" />
                      </div>
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