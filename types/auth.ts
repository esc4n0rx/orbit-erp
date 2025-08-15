export type UserRole = 'master' | 'admin' | 'manager' | 'user' | 'viewer'

export type UserStatus = 'active' | 'inactive' | 'suspended'

export interface Address {
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface UserPerfil {
  permissions: string[]
  modules: string[]
  restrictions?: Record<string, any>
}

export interface User {
  id: string
  login: string
  nomeCompleto: string
  cpf: string
  status: UserStatus
  isLogged: boolean
  endereco?: Address
  funcao?: string
  role: UserRole
  perfil?: UserPerfil
  createdAt: string
  updatedAt: string
  lastLogin?: string
  createdBy?: string
  updatedBy?: string
}

export interface LoginCredentials {
  login: string
  password: string
}

export interface AuthResponse {
  success: boolean
  user?: User
  error?: string
  token?: string
}

export interface AuthContextType {
  user: User | null
  login: (credentials: LoginCredentials) => Promise<AuthResponse>
  logout: () => Promise<void>
  isLoading: boolean
  updateUser: (userData: Partial<User>) => Promise<void>
}