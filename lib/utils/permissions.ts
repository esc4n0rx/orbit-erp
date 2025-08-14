import type { User } from '@/types/user'
import type { View, Module } from '@/types/module'

export function checkUserPermission(
  user: User | null,
  requiredRoles: string[],
  requiredPermissions: string[] = []
): { hasAccess: boolean; reason?: string } {
  if (!user) {
    return { hasAccess: false, reason: 'Usuário não autenticado' }
  }

  // Verificar role
  if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
    return { 
      hasAccess: false, 
      reason: `Acesso negado. Roles necessárias: ${requiredRoles.join(', ')}` 
    }
  }

  // Verificar permissões específicas
  if (requiredPermissions.length > 0) {
    const userPermissions = user.perfil.permissions
    const hasAllPermissions = requiredPermissions.every(
      permission => userPermissions.includes('*') || userPermissions.includes(permission)
    )
    
    if (!hasAllPermissions) {
      return { 
        hasAccess: false, 
        reason: `Permissões insuficientes. Necessárias: ${requiredPermissions.join(', ')}` 
      }
    }
  }

  return { hasAccess: true }
}

export function checkViewAccess(user: User | null, view: View): { hasAccess: boolean; reason?: string } {
  return checkUserPermission(user, view.required_roles, view.required_permissions)
}

export function checkModuleAccess(user: User | null, module: Module): { hasAccess: boolean; reason?: string } {
  return checkUserPermission(user, module.required_roles)
}