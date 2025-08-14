export interface User {
    id: string
    username: string
    nome_completo: string
    cpf: string
    email?: string
    endereco: string
    job_function: string
    role: string
    status: 'active' | 'inactive'
    password_hash: string
    profile: {
      modules: string[]
      permissions: string[]
      restrictions: Record<string, any>
    }
    created_at: string
    updated_at: string
    created_by: string
    updated_by: string
    last_login?: string
    is_logged?: boolean
  }
  
  export interface CreateUserData {
    username: string
    nome_completo: string
    cpf: string
    email?: string
    address: string
    job_function: string
    role: string
    status: 'active' | 'inactive'
    password: string
  }
  
  export interface UpdateUserData {
    username?: string
    nome_completo?: string
    cpf?: string
    email?: string
    address?: string
    job_function?: string
    role?: string
    status?: 'active' | 'inactive'
    password?: string
  }
  
  export interface UserSearchCriteria {
    username?: string
    nome_completo?: string
    cpf?: string
    role?: string
    status?: 'active' | 'inactive'
  }