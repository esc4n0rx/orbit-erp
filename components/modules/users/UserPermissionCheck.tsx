"use client"

import { useEffect, useState } from 'react'
import { MessageBar } from '@/components/ui/message-bar'
import { checkUserPermission } from '@/lib/utils/permissions'
import type { User } from '@/types/user'

interface UserPermissionCheckProps {
  user: User | null
  requiredRoles: string[]
  requiredPermissions?: string[]
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function UserPermissionCheck({
  user,
  requiredRoles,
  requiredPermissions = [],
  children,
  fallback
}: UserPermissionCheckProps) {
  const [permissionCheck, setPermissionCheck] = useState<{
    hasAccess: boolean
    reason?: string
  }>({ hasAccess: false })

  useEffect(() => {
    const result = checkUserPermission(user, requiredRoles, requiredPermissions)
    setPermissionCheck(result)
  }, [user, requiredRoles, requiredPermissions])

  if (!permissionCheck.hasAccess) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="p-6">
        <MessageBar
          variant="destructive"
          title="Acesso Negado"
          closable={false}
        >
          {permissionCheck.reason || 'Você não tem permissão para acessar esta funcionalidade.'}
        </MessageBar>
      </div>
    )
  }

  return <>{children}</>
}