"use client"

import { useState, useEffect } from 'react'
import { Shield, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import UserPermissionForm from './UserPermissionForm'
import UserList from './UserList'
import UserPermissionCheck from './UserPermissionCheck'
import { searchUsers } from '@/lib/supabase/users'
import type { User, UserSearchCriteria } from '@/types/user'

interface UserPermissionViewProps {
  currentUser: User
}

export default function UserPermissionView({ currentUser }: UserPermissionViewProps) {
  const [step, setStep] = useState<'search' | 'edit'>('search')
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
    setSelectedUser(user)
    setStep('edit')
  }

  const handleBackToSearch = () => {
    setStep('search')
    setSelectedUser(null)
  }

  const handleSuccess = () => {
    // Recarregar lista de usuários após sucesso
    handleSearch({})
  }

  useEffect(() => {
    // Buscar todos os usuários inicialmente
    handleSearch({})
  }, [])

  return (
    <UserPermissionCheck
      user={currentUser}
      requiredRoles={['master', 'admin']}
      requiredPermissions={['users.permissions']}
    >
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {step === 'edit' && (
              <Button variant="ghost" onClick={handleBackToSearch}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Shield className="h-8 w-8 text-purple-600" />
                {step === 'search' 
                  ? 'Gerenciar Permissões de Usuário' 
                  : `Permissões: ${selectedUser?.nome_completo}`
                }
              </h1>
              <p className="text-muted-foreground mt-2">
                {step === 'search' 
                  ? 'Selecione um usuário para gerenciar suas permissões de acesso'
                  : 'Configure os módulos, views e permissões do usuário'
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
            mode="permission" // Modo específico para permissões
          />
        ) : (
          <UserPermissionForm
            user={selectedUser!}
            currentUser={currentUser}
            onSuccess={handleSuccess}
            onCancel={handleBackToSearch}
          />
        )}
      </div>
    </UserPermissionCheck>
  )
}