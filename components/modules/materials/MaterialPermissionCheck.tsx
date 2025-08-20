"use client"

import { ReactNode } from 'react'
import { Shield, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageBar } from '@/components/ui/message-bar'
import { User } from '@/types/user'

interface MaterialPermissionCheckProps {
  children: ReactNode
  currentUser: User
  requiredPermission: 'create' | 'read' | 'update' | 'delete'
}

export default function MaterialPermissionCheck({ 
  children, 
  currentUser, 
  requiredPermission 
}: MaterialPermissionCheckProps) {
  
  // Verificação básica de permissões baseada no role
  const hasPermission = () => {
    const userRole = currentUser.role?.toLowerCase()
    
    // Master e admin têm todas as permissões
    if (userRole === 'master' || userRole === 'admin') {
      return true
    }
    
    // Support pode ler e criar
    if (userRole === 'support') {
      return ['read', 'create'].includes(requiredPermission)
    }
    
    // Viewer só pode ler
    if (userRole === 'viewer') {
      return requiredPermission === 'read'
    }
    
    return false
  }

  if (!hasPermission()) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Shield className="h-5 w-5" />
            Acesso Negado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MessageBar variant="destructive" title="Permissão Insuficiente">
            Você não tem permissão para acessar esta funcionalidade. 
            Entre em contato com o administrador do sistema.
          </MessageBar>
        </CardContent>
      </Card>
    )
  }

  return <>{children}</>
}