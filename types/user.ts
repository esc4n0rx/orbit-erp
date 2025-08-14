export interface User {
    id: string
    full_name: string
    username: string
    email?: string
    cpf: string
    password_hash: string
    status: 'active' | 'inactive'
    address: string
    job_function: string
    role: 'master' | 'admin' | 'user' | 'support'
    profile: UserProfile
    environment: string
    created_at: string
    updated_at: string
    created_by: string
    updated_by: string
  }
  
  export interface UserProfile {
    modules: string[]
    permissions: string[]
    restrictions: Record<string, any>
  }
  
  export interface CreateUserData {
    full_name: string
    username: string
    email?: string
    cpf: string
    password: string
    address: string
    job_function: string
    role: 'admin' | 'user' | 'support'
    status?: 'active' | 'inactive'
  }
  
  export interface UpdateUserData extends Partial<Omit<CreateUserData, 'password'>> {
    password?: string
  }
  
  export interface UserSearchCriteria {
    username?: string
    cpf?: string
    full_name?: string
  }