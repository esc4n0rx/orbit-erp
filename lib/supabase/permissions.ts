import { supabase } from '../supabase'
import type { User } from '@/types/user'

const USERS_TABLE = 'orbit_erp_users_dev'

export interface UserPermissionUpdate {
  modules: string[]
  permissions: string[]
  restrictions: Record<string, any>
}

export async function updateUserPermissions(
  userId: string, 
  permissions: UserPermissionUpdate,
  updatedBy: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from(USERS_TABLE)
      .update({
        perfil: permissions,
        updated_by: updatedBy,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: 'Erro interno do servidor' }
  }
}

export async function getUserPermissions(userId: string): Promise<{ 
  data: UserPermissionUpdate | null; 
  error: string | null 
}> {
  try {
    const { data, error } = await supabase
      .from(USERS_TABLE)
      .select('perfil')
      .eq('id', userId)
      .single()

    if (error) {
      return { data: null, error: error.message }
    }

    // Retornar perfil com valores padrão se não existir
    const permissions: UserPermissionUpdate = data.perfil || {
      modules: [],
      permissions: [],
      restrictions: {}
    }

    return { data: permissions, error: null }
  } catch (error) {
    return { data: null, error: 'Erro interno do servidor' }
  }
}

export async function resetUserPermissions(
  userId: string,
  updatedBy: string
): Promise<{ success: boolean; error?: string }> {
  const defaultPermissions: UserPermissionUpdate = {
    modules: ['*'],
    permissions: ['*'],
    restrictions: {}
  }

  return updateUserPermissions(userId, defaultPermissions, updatedBy)
}

export async function addModuleToUser(
  userId: string,
  moduleId: string,
  updatedBy: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Buscar permissões atuais
    const { data: currentPermissions, error: fetchError } = await getUserPermissions(userId)
    
    if (fetchError || !currentPermissions) {
      return { success: false, error: fetchError || 'Usuário não encontrado' }
    }

    // Adicionar módulo se não existir
    if (!currentPermissions.modules.includes(moduleId) && !currentPermissions.modules.includes('*')) {
      currentPermissions.modules.push(moduleId)
    }

    return updateUserPermissions(userId, currentPermissions, updatedBy)
  } catch (error) {
    return { success: false, error: 'Erro interno do servidor' }
  }
}

export async function removeModuleFromUser(
  userId: string,
  moduleId: string,
  updatedBy: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Buscar permissões atuais
    const { data: currentPermissions, error: fetchError } = await getUserPermissions(userId)
    
    if (fetchError || !currentPermissions) {
      return { success: false, error: fetchError || 'Usuário não encontrado' }
    }

    // Remover módulo específico (não remove '*')
    currentPermissions.modules = currentPermissions.modules.filter(id => id !== moduleId)

    return updateUserPermissions(userId, currentPermissions, updatedBy)
  } catch (error) {
    return { success: false, error: 'Erro interno do servidor' }
  }
}

export async function addPermissionToUser(
  userId: string,
  permission: string,
  updatedBy: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Buscar permissões atuais
    const { data: currentPermissions, error: fetchError } = await getUserPermissions(userId)
    
    if (fetchError || !currentPermissions) {
      return { success: false, error: fetchError || 'Usuário não encontrado' }
    }

    // Adicionar permissão se não existir
    if (!currentPermissions.permissions.includes(permission) && !currentPermissions.permissions.includes('*')) {
      currentPermissions.permissions.push(permission)
    }

    return updateUserPermissions(userId, currentPermissions, updatedBy)
  } catch (error) {
    return { success: false, error: 'Erro interno do servidor' }
  }
}

export async function removePermissionFromUser(
  userId: string,
  permission: string,
  updatedBy: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Buscar permissões atuais
    const { data: currentPermissions, error: fetchError } = await getUserPermissions(userId)
    
    if (fetchError || !currentPermissions) {
      return { success: false, error: fetchError || 'Usuário não encontrado' }
    }

    // Remover permissão específica (não remove '*')
    currentPermissions.permissions = currentPermissions.permissions.filter(p => p !== permission)

    return updateUserPermissions(userId, currentPermissions, updatedBy)
  } catch (error) {
    return { success: false, error: 'Erro interno do servidor' }
  }
}