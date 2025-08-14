export interface User {
    id: string
    login: string
    nome_completo: string
    cpf: string
    email?: string
    endereco: string
    funcao: string
    role: string
    status: 'active' | 'inactive'
    senha: string
    perfil: {
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
    login: string
    nome_completo: string
    cpf: string
    email?: string
    address: string
    funcao: string
    role: string
    status: 'active' | 'inactive'
    password: string
  }
  
  export interface UpdateUserData {
    login?: string
    nome_completo?: string
    cpf?: string
    email?: string
    address?: string
    funcao?: string
    role?: string
    status?: 'active' | 'inactive'
    password?: string
  }
  
  export interface UserSearchCriteria {
    login?: string
    nome_completo?: string
    cpf?: string
    role?: string
    status?: 'active' | 'inactive'
  }