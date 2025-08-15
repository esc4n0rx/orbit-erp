"use client"

import { useState, useEffect } from 'react'
import { Eye, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import UserForm from './UserForm'
import UserList from './UserList'
import UserPermissionCheck from './UserPermissionCheck'
import { searchUsers } from '@/lib/supabase/users'
import type { User, UserSearchCriteria } from '@/types/user'

interface UserViewViewProps {
  currentUser: User
}

export default function UserViewView({ currentUser }: UserViewViewProps) {
  const [step, setStep] = useState<'search' | 'view'>('search')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)

  const handleSearch = async (criteria: UserSearchCriteria) => {
    setSearchLoading(true)
    setSearchError(null)

    try {
      const { data, error } = await searchUsers(criteria)
      
      if (error) {
        setSearchError(error)
        setUsers([])
      } else {
        setUsers(data || [])
      }
    } catch (err) {
      setSearchError('Erro interno do servidor')
      setUsers([])
    } finally {
      setSearchLoading(false)
    }
  }

  const handleSelectUser = (user: User, action: 'view' | 'edit') => {
    if (action === 'view') {
      setSelectedUser(user)
      setStep('view')
    }
  }

  const handleBackToSearch = () => {
    setStep('search')
    setSelectedUser(null)
  }

  useEffect(() => {
    // Buscar todos os usuários inicialmente
    handleSearch({})
  }, [])

  return (
    <UserPermissionCheck
      user={currentUser}
      requiredRoles={['master', 'admin']}
      requiredPermissions={['users.view']}
    >
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {step === 'view' && (
              <Button variant="ghost" onClick={handleBackToSearch}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Eye className="h-8 w-8 text-green-600" />
                {step === 'search' ? 'Visualizar Usuário' : `Visualizando: ${selectedUser?.nome_completo}`}
              </h1>
              <p className="text-muted-foreground mt-2">
                {step === 'search' 
                  ? 'Busque e selecione um usuário para visualizar suas informações'
                  : 'Informações detalhadas do usuário selecionado'
                }
              </p>
            </div>
          </div>
        </div>

        {step === 'search' ? (
          <UserList
            users={users}
            loading={searchLoading}
            error={searchError}
            onSearch={handleSearch}
            onSelectUser={handleSelectUser}
            showActions={false}
          />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Informações do Usuário</CardTitle>
            </CardHeader>
            <CardContent>
              <UserForm
                mode="view"
                user={selectedUser!}
                onSubmit={async () => {}} // Não usado no modo view
              />
            </CardContent>
          </Card>
        )}
      </div>
    </UserPermissionCheck>
  )
}