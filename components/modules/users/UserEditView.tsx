"use client"

import { useState, useEffect } from 'react'
import { User2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageBar } from '@/components/ui/message-bar'
import UserForm from './UserForm'
import UserList from './UserList'
import UserPermissionCheck from './UserPermissionCheck'
import { searchUsers, updateUser } from '@/lib/supabase/users'
import type { User, UserSearchCriteria, UpdateUserData } from '@/types/user'

interface UserEditViewProps {
  currentUser: User
  environment: string
  onSuccess?: () => void
}

export default function UserEditView({ currentUser, environment, onSuccess }: UserEditViewProps) {
  const [step, setStep] = useState<'search' | 'edit'>('search')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [updateError, setUpdateError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSearch = async (criteria: UserSearchCriteria) => {
    setSearchLoading(true)
    setSearchError(null)

    try {
      const { data, error } = await searchUsers(criteria, environment)
      
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
    if (action === 'edit') {
      setSelectedUser(user)
      setStep('edit')
    }
  }

  const handleUpdateUser = async (userData: UpdateUserData) => {
    if (!selectedUser) return

    setUpdateLoading(true)
    setUpdateError(null)

    try {
      const { data, error } = await updateUser(selectedUser.id, userData, environment, currentUser.id)
      
      if (error) {
        setUpdateError(error)
      } else {
        setSuccess(true)
        setSelectedUser(data)
        setTimeout(() => {
          setSuccess(false)
          onSuccess?.()
        }, 2000)
      }
    } catch (err) {
      setUpdateError('Erro interno do servidor')
    } finally {
      setUpdateLoading(false)
    }
  }

  const handleBackToSearch = () => {
    setStep('search')
    setSelectedUser(null)
    setUpdateError(null)
    setSuccess(false)
  }

  useEffect(() => {
    // Buscar todos os usuários inicialmente
    handleSearch({})
  }, [])

  return (
    <UserPermissionCheck
      user={currentUser}
      requiredRoles={['master', 'admin']}
      requiredPermissions={['users.edit']}
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
                <User2 className="h-8 w-8 text-orange-600" />
                {step === 'search' ? 'Editar Usuário' : `Editando: ${selectedUser?.nome_completo}`}
              </h1>
              <p className="text-muted-foreground mt-2">
                {step === 'search' 
                  ? 'Busque e selecione um usuário para editar suas informações'
                  : 'Modifique as informações do usuário selecionado'
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
            showActions={true}
          />
        ) : (
          <>
            {success && (
              <MessageBar variant="success" title="Sucesso">
                Usuário atualizado com sucesso!
              </MessageBar>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Editar Informações do Usuário</CardTitle>
              </CardHeader>
              <CardContent>
                <UserForm
                  mode="edit"
                  user={selectedUser!}
                  onSubmit={handleUpdateUser}
                  loading={updateLoading}
                  error={updateError}
                />
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </UserPermissionCheck>
  )
}