import { supabase } from '../supabase'
import type { DataSource, DataSourceColumn } from '@/types/data-sources'

export async function getAvailableDataSources(): Promise<{ data: DataSource[] | null; error: string | null }> {
  try {
    // Buscar tabelas disponíveis no schema público
    const { data: tables, error: tablesError } = await supabase
      .rpc('get_table_info')

    if (tablesError) {
      console.error('Erro ao buscar tabelas:', tablesError)
      // Fallback: retornar tabelas conhecidas hardcoded
      const hardcodedTables: DataSource[] = [
        {
          id: 'users',
          name: 'Usuários',
          type: 'table',
          table_name: 'orbit_erp_users_dev',
          columns: [
            { name: 'id', type: 'text', nullable: false },
            { name: 'name', type: 'text', nullable: false },
            { name: 'email', type: 'text', nullable: false },
            { name: 'role', type: 'text', nullable: false },
            { name: 'created_at', type: 'date', nullable: false },
            { name: 'updated_at', type: 'date', nullable: false }
          ],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'materials',
          name: 'Materiais',
          type: 'table',
          table_name: 'orbit_erp_materials_dev',
          columns: [
            { name: 'id', type: 'text', nullable: false },
            { name: 'codigo_material', type: 'text', nullable: false },
            { name: 'codigo_interno', type: 'text', nullable: true },
            { name: 'descricao', type: 'text', nullable: false },
            { name: 'categoria_id', type: 'text', nullable: true },
            { name: 'deposito_id', type: 'text', nullable: true },
            { name: 'status', type: 'text', nullable: false },
            { name: 'created_at', type: 'date', nullable: false },
            { name: 'updated_at', type: 'date', nullable: false }
          ],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'categories',
          name: 'Categorias',
          type: 'table',
          table_name: 'orbit_erp_categories_dev',
          columns: [
            { name: 'id', type: 'text', nullable: false },
            { name: 'codigo_interno', type: 'text', nullable: false },
            { name: 'grupo_mercadoria', type: 'text', nullable: false },
            { name: 'categoria', type: 'text', nullable: false },
            { name: 'subcategoria', type: 'text', nullable: true },
            { name: 'status', type: 'text', nullable: false },
            { name: 'created_at', type: 'date', nullable: false },
            { name: 'updated_at', type: 'date', nullable: false }
          ],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'deposits',
          name: 'Depósitos',
          type: 'table',
          table_name: 'orbit_erp_deposits_dev',
          columns: [
            { name: 'id', type: 'text', nullable: false },
            { name: 'codigo', type: 'text', nullable: false },
            { name: 'nome', type: 'text', nullable: false },
            { name: 'endereco', type: 'text', nullable: true },
            { name: 'status', type: 'text', nullable: false },
            { name: 'created_at', type: 'date', nullable: false },
            { name: 'updated_at', type: 'date', nullable: false }
          ],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]
      
      return { data: hardcodedTables, error: null }
    }

    return { data: tables || [], error: null }
  } catch (error) {
    return { data: null, error: 'Erro ao carregar fontes de dados' }
  }
}

export async function testDataSourceConnection(
  tableName: string
): Promise<{ success: boolean; error: string | null; sampleData?: any[] }> {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(5)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, error: null, sampleData: data }
  } catch (error) {
    return { success: false, error: 'Erro ao testar conexão' }
  }
}

export async function executeCustomQuery(
  query: string
): Promise<{ data: any[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase.rpc('execute_custom_query', { query_text: query })

    if (error) {
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    return { data: null, error: 'Erro ao executar consulta personalizada' }
  }
}