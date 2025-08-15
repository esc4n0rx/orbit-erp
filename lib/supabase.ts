import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Retorna o nome da tabela baseado no tipo
 * Sempre usa o sufixo _dev (development)
 */
export function getTableName(tableType: string): string {
  return `orbit_erp_${tableType}_dev`
}

/**
 * Cliente Supabase configurado para development
 */
export class SupabaseClient {
  get users() {
    return supabase.from('orbit_erp_users_dev')
  }
  
  get modules() {
    return supabase.from('orbit_erp_modules_dev')
  }
  
  get views() {
    return supabase.from('orbit_erp_views_dev')
  }
  
  get viewAccessHistory() {
    return supabase.from('orbit_erp_view_access_history_dev')
  }
}

// Instância padrão
export const dbClient = new SupabaseClient()