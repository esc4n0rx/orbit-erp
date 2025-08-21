import { supabase } from '../supabase'
import type { DatabaseView, DevelopmentView, ViewRenderConfig } from '@/types/view-builder'

const VIEWS_TABLE = 'orbit_erp_views_dev'
const DEVELOPMENT_VIEWS_TABLE = 'orbit_erp_dynamic_views_temp_dev'

export async function getViewRenderConfig(
  viewAlias: string,
  userRole: string
): Promise<{ data: ViewRenderConfig | null; error: string | null }> {
  try {
    // 1. Primeiro tentar buscar na tabela principal (views publicadas)
    const { data: databaseView, error: dbError } = await supabase
      .from(VIEWS_TABLE)
      .select('*')
      .eq('alias', viewAlias)
      .eq('status', 'active')
      .contains('required_roles', [userRole])
      .single()

    if (databaseView && !dbError) {
      return {
        data: {
          viewId: viewAlias,
          viewType: 'database',
          componentPath: databaseView.component_path
        },
        error: null
      }
    }

    // 2. Se não encontrar, buscar nas views em desenvolvimento
    const { data: devView, error: devError } = await supabase
      .from(DEVELOPMENT_VIEWS_TABLE)
      .select('*')
      .eq('alias', viewAlias)
      .in('status', ['development', 'testing'])
      .single()

    if (devView && !devError) {
      return {
        data: {
          viewId: viewAlias,
          viewType: 'development',
          config: devView.schema_json
        },
        error: null
      }
    }

    // 3. Se não encontrar em nenhum lugar, verificar se é uma view hardcoded
    const hardcodedViews = [
      'usr001', 'usr002', 'usr003', 'usr004',
      'mcat01', 'mcat02', 'mdep01', 'mdep02',
      'cr001', 'cr002', 'cr003'
    ]

    if (hardcodedViews.includes(viewAlias)) {
      return {
        data: {
          viewId: viewAlias,
          viewType: 'hardcoded'
        },
        error: null
      }
    }

    return { data: null, error: 'View não encontrada' }

  } catch (error) {
    return { data: null, error: 'Erro interno do servidor' }
  }
}

export async function getDevelopmentView(
  viewAlias: string
): Promise<{ data: DevelopmentView | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from(DEVELOPMENT_VIEWS_TABLE)
      .select('*')
      .eq('alias', viewAlias)
      .single()

    if (error) {
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    return { data: null, error: 'Erro interno do servidor' }
  }
}

export async function getAllDevelopmentViews(): Promise<{
  data: DevelopmentView[] | null
  error: string | null
}> {
  try {
    const { data, error } = await supabase
      .from(DEVELOPMENT_VIEWS_TABLE)
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    return { data: null, error: 'Erro interno do servidor' }
  }
}

export async function saveDevelopmentView(
  viewData: Omit<DevelopmentView, 'id' | 'created_at' | 'updated_at'>
): Promise<{ data: DevelopmentView | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from(DEVELOPMENT_VIEWS_TABLE)
      .insert(viewData)
      .select()
      .single()

    if (error) {
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    return { data: null, error: 'Erro interno do servidor' }
  }
}

export async function updateDevelopmentView(
  viewId: string,
  updates: Partial<DevelopmentView>
): Promise<{ data: DevelopmentView | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from(DEVELOPMENT_VIEWS_TABLE)
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', viewId)
      .select()
      .single()

    if (error) {
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    return { data: null, error: 'Erro interno do servidor' }
  }
}

export async function deleteDevelopmentView(
  viewId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from(DEVELOPMENT_VIEWS_TABLE)
      .delete()
      .eq('id', viewId)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: 'Erro interno do servidor' }
  }
}

export async function promoteViewToProduction(
  developmentViewId: string,
  moduleId: string,
  requiredRoles: string[] = ['admin'],
  requiredPermissions: string[] = []
): Promise<{ success: boolean; error?: string }> {
  try {
    // Buscar a view de desenvolvimento
    const { data: devView, error: devError } = await supabase
      .from(DEVELOPMENT_VIEWS_TABLE)
      .select('*')
      .eq('id', developmentViewId)
      .single()

    if (devError || !devView) {
      return { success: false, error: 'View de desenvolvimento não encontrada' }
    }

    // Inserir na tabela principal
    const { error: insertError } = await supabase
      .from(VIEWS_TABLE)
      .insert({
        module_id: moduleId,
        name: devView.name,
        description: devView.description,
        alias: devView.alias,
        component_path: `dynamic:${devView.id}`,
        required_roles: requiredRoles,
        required_permissions: requiredPermissions,
        status: 'active'
      })

    if (insertError) {
      return { success: false, error: insertError.message }
    }

    // Atualizar status da view de desenvolvimento
    await supabase
      .from(DEVELOPMENT_VIEWS_TABLE)
      .update({ status: 'published' })
      .eq('id', developmentViewId)

    return { success: true }
  } catch (error) {
    return { success: false, error: 'Erro interno do servidor' }
  }
}