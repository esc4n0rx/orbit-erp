"use client"

import { useState } from 'react'
import { UserPlus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageBar } from '@/components/ui/message-bar'
import UserForm from './UserForm'
import UserPermissionCheck from './UserPermissionCheck'
import { createUser } from '@/lib/supabase/users'
import type { User, CreateUserData, UpdateUserData} from '@/types/user'

interface UserCreateViewProps {
  currentUser: User
  environment: string
  onSuccess?: () => void
}

export default function UserCreateView({ currentUser, environment, onSuccess }: UserCreateViewProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleCreateUser = async (data: CreateUserData | UpdateUserData) => {
    const userData = data as CreateUserData

    setLoading(true)
    setError(null)

    try {
      const { data, error: createError } = await createUser(userData, environment, currentUser.id)
      
      if (createError) {
        setError(createError)
      } else {
        setSuccess(true)
        setTimeout(() => {
          setSuccess(false)
          onSuccess?.()
        }, 2000)
      }
    } catch (err) {
      setError('Erro interno do servidor')
    } finally {
      setLoading(false)
    }
  }


  return (
    <UserPermissionCheck
      user={currentUser}
      requiredRoles={['master', 'admin']}
      requiredPermissions={['users.create']}
    >
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <UserPlus className="h-8 w-8 text-blue-600" />
              Criar Usuário
            </h1>
            <p className="text-muted-foreground mt-2">
              Crie um novo usuário no sistema com as informações necessárias
            </p>
          </div>
        </div>

        {success && (
          <MessageBar variant="success" title="Sucesso">
            Usuário criado com sucesso!
          </MessageBar>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Informações do Usuário</CardTitle>
          </CardHeader>
          <CardContent>
            <UserForm
              mode="create"
              onSubmit={handleCreateUser}
              loading={loading}
              error={error}
            />
          </CardContent>
        </Card>
      </div>
    </UserPermissionCheck>
  )
}