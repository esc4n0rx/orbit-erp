import { supabase } from '../supabase'
import type { User, CreateUserData, UpdateUserData, UserSearchCriteria } from '@/types/user'
import bcrypt from 'bcryptjs'

const TABLE_NAME = 'orbit_erp_users_dev'

export async function createUser(userData: CreateUserData, createdBy: string): Promise<{ data: User | null; error: string | null }> {
  try {
    // Verificar se login já existe
    const { data: existingUser } = await supabase
      .from(TABLE_NAME)
      .select('login')
      .eq('login', userData.login)
      .single()

    if (existingUser) {
      return { data: null, error: 'Nome de usuário já existe' }
    }

    // Hash da senha
    const senha = await bcrypt.hash(userData.password, 10)

    // Perfil padrão
    const defaultPerfil = {
      modules: ['*'],
      permissions: ['*'],
      restrictions: {}
    }

    const newUser = {
      ...userData,
      senha,
      perfil: defaultPerfil,
      status: userData.status || 'active',
      created_by: createdBy,
      updated_by: createdBy
    }

    delete (newUser as any).password

    const { data, error } = await supabase
      .from(TABLE_NAME)
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

export async function updateUser(id: string, userData: UpdateUserData, updatedBy: string): Promise<{ data: User | null; error: string | null }> {
  try {
    const updateData: any = {
      ...userData,
      updated_by: updatedBy,
      updated_at: new Date().toISOString()
    }

    // Se senha foi fornecida, fazer hash
    if (userData.password) {
      updateData.senha = await bcrypt.hash(userData.password, 10)
      delete updateData.password
    }

    const { data, error } = await supabase
      .from(TABLE_NAME)
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

export async function searchUsers(criteria: UserSearchCriteria): Promise<{ data: User[] | null; error: string | null }> {
  try {
    let query = supabase.from(TABLE_NAME).select('*')

    if (criteria.login) {
      query = query.ilike('login', `%${criteria.login}%`)
    }
    if (criteria.cpf) {
      query = query.eq('cpf', criteria.cpf)
    }
    if (criteria.nome_completo) {
      query = query.ilike('nome_completo', `%${criteria.nome_completo}%`)
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

export async function getUserById(id: string): Promise<{ data: User | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
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

export async function checkLoginExists(login: string, excludeId?: string): Promise<boolean> {
  try {
    let query = supabase
      .from(TABLE_NAME)
      .select('id')
      .eq('login', login)

    if (excludeId) {
      query = query.neq('id', excludeId)
    }

    const { data } = await query.single()
    return !!data
  } catch {
    return false
  }
}