import { createClient } from '@supabase/supabase-js'
import type { Environment } from '@/types/auth'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Retorna o nome da tabela de usuários baseado no ambiente
 */
export function getUserTableName(environment: Environment): string {
  const tableMap = {
    production: 'orbit_erp_users_prod',
    staging: 'orbit_erp_users_stg',
    development: 'orbit_erp_users_dev'
  }
  
  return tableMap[environment]
}

/**
 * Cliente Supabase configurado para um ambiente específico
 */
export class EnvironmentSupabaseClient {
  private tableName: string
  
  constructor(private environment: Environment) {
    this.tableName = getUserTableName(environment)
  }
  
  get users() {
    return supabase.from(this.tableName)
  }
  
  getTableName() {
    return this.tableName
  }
  
  getEnvironment() {
    return this.environment
  }
}