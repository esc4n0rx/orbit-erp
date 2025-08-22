// components/modules/clients/ClientCreateView.tsx
"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ClientCreateForm from './ClientCreateForm'
import ClientPermissionCheck from './ClientPermissionCheck'
import type { User } from '@/types/user'

interface ClientCreateViewProps {
  currentUser: User
  onOpenView?: (viewId: string, title: string) => void
}

export default function ClientCreateView({ currentUser, onOpenView }: ClientCreateViewProps) {
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSuccess = (client: any) => {
    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
      // Abrir view de visualização do cliente criado
      onOpenView?.(`cm003?id=${client.id}`, `Visualizar Cliente: ${client.razao_social}`)
    }, 2000)
  }

  const handleCancel = () => {
    // Voltar ao home
    onOpenView?.('home', 'Home')
  }

  return (
    <ClientPermissionCheck 
      currentUser={currentUser} 
      requiredPermission="create"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <span>Cadastrar Cliente</span>
              </CardTitle>
              <div className="text-sm text-muted-foreground">
                View: cm001
              </div>
            </div>
          </CardHeader>
        </Card>

        <ClientCreateForm
          onSuccess={handleSuccess}
          onCancel={handleCancel}
          createdBy={currentUser.id}
        />
      </div>
    </ClientPermissionCheck>
  )
}