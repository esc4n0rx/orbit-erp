import bcrypt from 'bcryptjs'
import { EnvironmentSupabaseClient } from './supabase'
import type { LoginCredentials, User, AuthResponse, Environment } from '@/types/auth'

/**
 * Realiza login do usuário
 */
export async function loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    const { login, password, environment } = credentials
    
    // Criar cliente para o ambiente específico
    const client = new EnvironmentSupabaseClient(environment)
    
    // Buscar usuário pelo login
    const { data: userData, error: fetchError } = await client.users
      .select('*')
      .eq('login', login)
      .eq('status', 'active')
      .single()
    
    if (fetchError || !userData) {
      return {
        success: false,
        error: 'Usuário não encontrado ou inativo'
      }
    }
    
    // Verificar senha usando o campo 'senha' do banco
    const isPasswordValid = await bcrypt.compare(password, userData.senha)
    
    if (!isPasswordValid) {
      return {
        success: false,
        error: 'Senha incorreta'
      }
    }
    
    // Atualizar status de logged e last_login
    const { error: updateError } = await client.users
      .update({ 
        is_logged: true, 
        last_login: new Date().toISOString() 
      })
      .eq('id', userData.id)
    
    if (updateError) {
      console.error('Erro ao atualizar status do usuário:', updateError)
    }
    
    // Converter dados para o formato esperado
    const user: User = {
      id: userData.id,
      login: userData.login,
      nomeCompleto: userData.nome_completo,
      cpf: userData.cpf,
      status: userData.status,
      isLogged: true,
      endereco: userData.endereco,
      funcao: userData.funcao,
      role: userData.role,
      perfil: userData.perfil,
      createdAt: userData.created_at,
      updatedAt: userData.updated_at,
      lastLogin: userData.last_login,
      createdBy: userData.created_by,
      updatedBy: userData.updated_by
    }
    
    return {
      success: true,
      user,
      token: generateToken(user, environment)
    }
    
  } catch (error) {
    console.error('Erro no login:', error)
    return {
      success: false,
      error: 'Erro interno do servidor'
    }
  }
}

/**
 * Realiza logout do usuário
 */
export async function logoutUser(userId: string, environment: Environment): Promise<void> {
  try {
    const client = new EnvironmentSupabaseClient(environment)
    
    await client.users
      .update({ is_logged: false })
      .eq('id', userId)
      
  } catch (error) {
    console.error('Erro no logout:', error)
  }
}

/**
 * Verifica se o usuário tem permissão para uma ação específica
 */
export function hasPermission(user: User, permission: string): boolean {
  // Master tem todas as permissões
  if (user.role === 'master') {
    return true
  }
  
  // Verificar permissões no perfil
  if (user.perfil?.permissions?.includes(permission)) {
    return true
  }
  
  // Verificar permissões baseadas no role
  const rolePermissions = {
    admin: ['*'], // Todas as permissões
    manager: ['read', 'write', 'update'],
    user: ['read', 'write'],
    viewer: ['read']
  }
  
  const userPermissions = rolePermissions[user.role] || []
  return userPermissions.includes('*') || userPermissions.includes(permission)
}

/**
 * Gera token simples para sessão (implementar JWT real em produção)
 */
function generateToken(user: User, environment: Environment): string {
  const payload = {
    userId: user.id,
    login: user.login,
    role: user.role,
    environment,
    timestamp: Date.now()
  }
  
  return btoa(JSON.stringify(payload))
}

/**
 * Hash da senha usando bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

/**
 * Valida CPF (algoritmo básico)
 */
export function isValidCPF(cpf: string): boolean {
  // Remove caracteres não numéricos
  const cleanCPF = cpf.replace(/[^\d]/g, '')
  
  // Verifica se tem 11 dígitos
  if (cleanCPF.length !== 11) return false
  
  // Verifica se não são todos números iguais
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false
  
  // Validação dos dígitos verificadores
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i)
  }
  
  let remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cleanCPF.charAt(9))) return false
  
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i)
  }
  
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cleanCPF.charAt(10))) return false
  
  return true
}