import { supabase } from '../supabase'
import type { User, CreateUserData, UpdateUserData, UserSearchCriteria } from '@/types/user'
import { getTableName } from '@/lib/utils/environment'
import bcrypt from 'bcryptjs'

export async function createUser(userData: CreateUserData, environment: string, createdBy: string): Promise<{ data: User | null; error: string | null }> {
  try {
    const tableName = getTableName('users', environment)
    
    // Verificar se username já existe
    const { data: existingUser } = await supabase
      .from(tableName)
      .select('username')
      .eq('username', userData.username)
      .single()

    if (existingUser) {
      return { data: null, error: 'Nome de usuário já existe' }
    }

    // Hash da senha
    const password_hash = await bcrypt.hash(userData.password, 10)

    // Perfil padrão
    const defaultProfile = {
      modules: ['*'],
      permissions: ['*'],
      restrictions: {}
    }

    const newUser = {
      ...userData,
      password_hash,
      profile: defaultProfile,
      status: userData.status || 'active',
      environment,
      created_by: createdBy,
      updated_by: createdBy
    }

    delete (newUser as any).password

    const { data, error } = await supabase
      .from(tableName)
      .insert(newUser)
      .select()
      .single()

    if (error) {
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    return { data: null, error: 'Erro interno do servidor' }
  }
}

export async function updateUser(id: string, userData: UpdateUserData, environment: string, updatedBy: string): Promise<{ data: User | null; error: string | null }> {
  try {
    const tableName = getTableName('users', environment)
    
    const updateData: any = {
      ...userData,
      updated_by: updatedBy,
      updated_at: new Date().toISOString()
    }

    // Se senha foi fornecida, fazer hash
    if (userData.password) {
      updateData.password_hash = await bcrypt.hash(userData.password, 10)
      delete updateData.password
    }

    const { data, error } = await supabase
      .from(tableName)
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    return { data: null, error: 'Erro interno do servidor' }
  }
}

export async function searchUsers(criteria: UserSearchCriteria, environment: string): Promise<{ data: User[] | null; error: string | null }> {
  try {
    const tableName = getTableName('users', environment)
    let query = supabase.from(tableName).select('*')

    if (criteria.username) {
      query = query.ilike('username', `%${criteria.username}%`)
    }
    if (criteria.cpf) {
      query = query.eq('cpf', criteria.cpf)
    }
    if (criteria.full_name) {
      query = query.ilike('full_name', `%${criteria.full_name}%`)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    return { data: null, error: 'Erro interno do servidor' }
  }
}

export async function getUserById(id: string, environment: string): Promise<{ data: User | null; error: string | null }> {
  try {
    const tableName = getTableName('users', environment)
    
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    return { data: null, error: 'Erro interno do servidor' }
  }
}

export async function checkUsernameExists(username: string, environment: string, excludeId?: string): Promise<boolean> {
  try {
    const tableName = getTableName('users', environment)
    let query = supabase
      .from(tableName)
      .select('id')
      .eq('username', username)

    if (excludeId) {
      query = query.neq('id', excludeId)
    }

    const { data } = await query.single()
    return !!data
  } catch {
    return false
  }
}