// components/modules/clients/ClientPermissionCheck.tsx
"use client"

import { MessageBar } from '@/components/ui/message-bar'
import { Card, CardContent } from '@/components/ui/card'
import { ShieldX } from 'lucide-react'
import type { User } from '@/types/user'

interface ClientPermissionCheckProps {
  currentUser: User
  requiredPermission: 'create' | 'edit' | 'read' | 'delete'
  children: React.ReactNode
}

export default function ClientPermissionCheck({ 
  currentUser, 
  requiredPermission, 
  children 
}: ClientPermissionCheckProps) {
  // Verificar se o usuário tem permissão para o módulo comercial
  const hasModuleAccess = ['master','admin', 'comercial', 'vendas'].includes(currentUser.role)
  
  // Verificar permissões específicas
  const hasPermission = () => {
    switch (requiredPermission) {
    
      case 'create':
        return ['admin', 'comercial','master'].includes(currentUser.role)
      case 'edit':
        return ['admin', 'comercial','master'].includes(currentUser.role)
      case 'read':
        return ['admin', 'comercial', 'vendas','master'].includes(currentUser.role)
      case 'delete':
        return ['admin','master'].includes(currentUser.role)
      default:
        return false
    }
  }

  if (!hasModuleAccess) {
    return (
      <Card>
        <CardContent className="p-6">
          <MessageBar variant="destructive" title="Acesso Negado">
            <div className="flex items-center gap-2">
              <ShieldX className="h-4 w-4" />
              <span>Você não tem permissão para acessar o módulo Comercial.</span>
            </div>
          </MessageBar>
        </CardContent>
      </Card>
    )
  }

  if (!hasPermission()) {
    return (
      <Card>
        <CardContent className="p-6">
          <MessageBar variant="destructive" title="Permissão Insuficiente">
            <div className="flex items-center gap-2">
              <ShieldX className="h-4 w-4" />
              <span>Você não tem permissão para realizar esta ação com clientes.</span>
            </div>
          </MessageBar>
        </CardContent>
      </Card>
    )
  }

  return <>{children}</>
}