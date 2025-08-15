"use client"

import { useState } from 'react'
import { Building2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageBar } from '@/components/ui/message-bar'
import DepositForm from './DepositForm'
import MaterialPermissionCheck from './MaterialPermissionCheck'
import { createDeposit } from '@/lib/supabase/materials'
import {User} from '@/types/user'
import type { CreateDepositData, UpdateDepositData } from '@/types/material'

interface DepositCreateViewProps {
  currentUser: User
  onSuccess?: () => void
}

export default function DepositCreateView({ currentUser, onSuccess }: DepositCreateViewProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleCreateDeposit = async (data: CreateDepositData | UpdateDepositData) => {
    const depositData = data as CreateDepositData

    setLoading(true)
    setError(null)

    try {
      const { data: result, error: createError } = await createDeposit(depositData, currentUser.id)
      
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
    <MaterialPermissionCheck
      user={currentUser}
      requiredRoles={['master', 'admin', 'support']}
      requiredPermissions={['materials.deposits.create']}
    >
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Building2 className="h-8 w-8 text-green-600" />
              Criar Depósito
            </h1>
            <p className="text-muted-foreground mt-2">
              Crie um novo depósito para armazenamento de materiais
            </p>
          </div>
        </div>

        {success && (
          <MessageBar variant="success" title="Sucesso">
            Depósito criado com sucesso!
          </MessageBar>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Informações do Depósito</CardTitle>
          </CardHeader>
          <CardContent>
            <DepositForm
              mode="create"
              onSubmit={handleCreateDeposit}
              loading={loading}
              error={error}
            />
          </CardContent>
        </Card>
      </div>
    </MaterialPermissionCheck>
  )
}