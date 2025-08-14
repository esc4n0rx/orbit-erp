"use client"

import { useState } from 'react'
import { Search, Eye, Edit, User } from 'lucide-react'
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
}

export default function UserList({ 
  users, 
  loading, 
  error, 
  onSearch, 
  onSelectUser, 
  showActions = true 
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
              <Label htmlFor="search-username">Nome de Usuário</Label>
              <Input
                id="search-username"
                placeholder="Digite o nome de usuário"
                value={searchCriteria.username || ''}
                onChange={(e) => setSearchCriteria(prev => ({ ...prev, username: e.target.value }))}
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
          <CardTitle>Resultados da Busca</CardTitle>
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
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="font-medium">{user.nome_completo}</p>
                      <p className="text-sm text-muted-foreground">@{user.username}</p>
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
                  
                  {showActions && (
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onSelectUser(user, 'view')}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onSelectUser(user, 'edit')}
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