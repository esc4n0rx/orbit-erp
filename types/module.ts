export interface Module {
    id: string
    name: string
    description: string
    alias: string
    status: 'active' | 'inactive'
    required_roles: string[]
    environment: string
    created_at: string
    updated_at: string
  }
  
  export interface View {
    id: string
    module_id: string
    name: string
    description: string
    alias: string
    component_path: string
    required_roles: string[]
    required_permissions: string[]
    status: 'active' | 'inactive'
    environment: string
    created_at: string
    updated_at: string
  }
  
  export interface ModuleAccess {
    module: Module
    views: View[]
    hasAccess: boolean
    reason?: string
  }