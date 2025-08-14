export interface User {
    id: string
    login: string
    nome_completo: string
    cpf: string
    email?: string
    endereco: string
    funcao: string
    job_function: string
    role: string
    status: 'active' | 'inactive'
    is_logged: boolean
    perfil: {
      modules: string[]
      permissions: string[]
      restrictions: Record<string, any>
    }
    created_at: string
    updated_at: string
    last_login: string
    created_by: string
    updated_by: string
  }
  
  export interface CreateUserData {
    nome_completo: string
    login: string
    email?: string
    cpf: string
    password: string
    endereco: string
    funcao: string
    role: string
    status: 'active' | 'inactive'
  }
  
  export interface UpdateUserData {
    nome_completo?: string
    login?: string
    email?: string
    cpf?: string
    password?: string
    endereco?: string
    funcao?: string
    role?: string
    status?: 'active' | 'inactive'
  }
  
  export interface UserSearchCriteria {
    login?: string
    cpf?: string
    nome_completo?: string
  }
  
  // Tipos específicos para o formulário
  export interface CreateUserFormData {
    nome_completo: string
    login: string
    email?: string
    cpf: string
    password: string
    endereco: string
    funcao: string
    role: 'admin' | 'user' | 'support'
    status: 'active' | 'inactive'
  }
  
  export interface UpdateUserFormData {
    nome_completo: string
    login: string
    email?: string
    cpf: string
    password?: string
    endereco: string
    funcao: string
    role: 'admin' | 'user' | 'support'
    status: 'active' | 'inactive'
  }