import { supabase } from '../supabase'
import type { Module, View } from '@/types/module'

const MODULES_TABLE = 'orbit_erp_modules_dev'
const VIEWS_TABLE = 'orbit_erp_views_dev'
const HISTORY_TABLE = 'orbit_erp_view_access_history_dev'

// Interfaces para os retornos das consultas
interface ViewAccessHistoryItem {
  view_alias: string
  accessed_at: string
  view_id: string
}

interface ViewWithModule extends View {
  module_name?: string
}

export async function getUserAccessibleViews(userRole: string): Promise<{ data: View[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from(VIEWS_TABLE)
      .select('*')
      .eq('status', 'active')
      .contains('required_roles', [userRole])
      .order('alias', { ascending: true })

    if (error) {
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    return { data: null, error: 'Erro interno do servidor' }
  }
}

export async function getUserAccessibleModules(userRole: string): Promise<{ data: Module[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from(MODULES_TABLE)
      .select('*')
      .eq('status', 'active')
      .contains('required_roles', [userRole])
      .order('alias', { ascending: true })

    if (error) {
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    return { data: null, error: 'Erro interno do servidor' }
  }
}

export async function getModuleViews(moduleAlias: string): Promise<{ data: View[] | null; error: string | null }> {
  try {
    // Primeiro buscar o módulo
    const { data: module, error: moduleError } = await supabase
      .from(MODULES_TABLE)
      .select('id')
      .eq('alias', moduleAlias)
      .eq('status', 'active')
      .single()

    if (moduleError || !module) {
      return { data: null, error: moduleError?.message || 'Módulo não encontrado' }
    }

    // Buscar as views do módulo
    const { data, error } = await supabase
      .from(VIEWS_TABLE)
      .select('*')
      .eq('module_id', module.id)
      .eq('status', 'active')
      .order('alias', { ascending: true })

    if (error) {
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    return { data: null, error: 'Erro interno do servidor' }
  }
}

export async function getViewsByModule(moduleId: string, userRole: string): Promise<{ data: View[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from(VIEWS_TABLE)
      .select('*')
      .eq('module_id', moduleId)
      .eq('status', 'active')
      .contains('required_roles', [userRole])
      .order('alias', { ascending: true })

    if (error) {
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    return { data: null, error: 'Erro interno do servidor' }
  }
}

export async function getViewByAlias(alias: string): Promise<{ data: View | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from(VIEWS_TABLE)
      .select('*')
      .eq('alias', alias)
      .eq('status', 'active')
      .single()

    if (error) {
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    return { data: null, error: 'Erro interno do servidor' }
  }
}

export async function recordViewAccess(userId: string, viewAlias: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Buscar o ID da view
    const { data: view, error: viewError } = await supabase
      .from(VIEWS_TABLE)
      .select('id')
      .eq('alias', viewAlias)
      .single()

    if (viewError || !view) {
      return { success: false, error: 'View não encontrada' }
    }

    // Registrar o acesso
    const { error } = await supabase
      .from(HISTORY_TABLE)
      .insert({
        user_id: userId,
        view_id: view.id,
        view_alias: viewAlias
      })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: 'Erro interno do servidor' }
  }
}

export async function getRecentViews(userId: string, limit: number = 5): Promise<{ data: any[] | null; error: string | null }> {
  try {
    // Buscar histórico de acesso
    const { data: historyData, error: historyError } = await supabase
      .from(HISTORY_TABLE)
      .select('view_alias, accessed_at, view_id')
      .eq('user_id', userId)
      .order('accessed_at', { ascending: false })
      .limit(limit * 2) // Buscar mais para filtrar duplicatas

    if (historyError) {
      return { data: null, error: historyError.message }
    }

    if (!historyData || historyData.length === 0) {
      return { data: [], error: null }
    }

    // Buscar informações das views
    const viewAliases = [...new Set(historyData.map(item => item.view_alias))]
    const { data: viewsData, error: viewsError } = await supabase
      .from(VIEWS_TABLE)
      .select('alias, name, description')
      .in('alias', viewAliases)

    if (viewsError) {
      return { data: null, error: viewsError.message }
    }

    // Combinar dados e remover duplicatas
    const uniqueViews = new Map()
    
    historyData.forEach((historyItem: ViewAccessHistoryItem) => {
      if (!uniqueViews.has(historyItem.view_alias)) {
        const viewInfo = viewsData?.find(v => v.alias === historyItem.view_alias)
        if (viewInfo) {
          uniqueViews.set(historyItem.view_alias, {
            id: historyItem.view_alias,
            title: viewInfo.name || historyItem.view_alias,
            description: viewInfo.description || 'View do sistema',
            lastAccessed: new Date(historyItem.accessed_at).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          })
        }
      }
    })

    const result = Array.from(uniqueViews.values()).slice(0, limit)
    return { data: result, error: null }
  } catch (error) {
    return { data: null, error: 'Erro interno do servidor' }
  }
}

export async function getSuggestedViews(userRole: string, limit: number = 6): Promise<{ data: any[] | null; error: string | null }> {
  try {
    // Buscar views acessíveis
    const { data: viewsData, error: viewsError } = await supabase
      .from(VIEWS_TABLE)
      .select('*')
      .eq('status', 'active')
      .contains('required_roles', [userRole])
      .order('created_at', { ascending: false })
      .limit(limit)

    if (viewsError) {
      return { data: null, error: viewsError.message }
    }

    if (!viewsData || viewsData.length === 0) {
      return { data: [], error: null }
    }

    // Buscar informações dos módulos
    const moduleIds = [...new Set(viewsData.map(view => view.module_id).filter(Boolean))]
    let modulesData: any[] = []
    
    if (moduleIds.length > 0) {
      const { data: modules, error: modulesError } = await supabase
        .from(MODULES_TABLE)
        .select('id, name, alias')
        .in('id', moduleIds)

      if (!modulesError && modules) {
        modulesData = modules
      }
    }

    // Combinar dados
    const suggestedViews = viewsData.map((view: View) => {
      const module = modulesData.find(m => m.id === view.module_id)
      return {
        id: view.alias,
        title: view.name,
        description: view.description,
        category: module?.name || 'Sistema'
      }
    })

    return { data: suggestedViews, error: null }
  } catch (error) {
    return { data: null, error: 'Erro interno do servidor' }
  }
}

export async function getAllModules(): Promise<{ data: Module[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from(MODULES_TABLE)
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (error) {
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    return { data: null, error: 'Erro interno do servidor' }
  }
}

export async function getAllViews(): Promise<{ data: View[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from(VIEWS_TABLE)
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (error) {
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    return { data: null, error: 'Erro interno do servidor' }
  }
}

export async function getAllModulesAndViews(): Promise<{ 
  data: { modules: Module[], views: View[] } | null; 
  error: string | null 
}> {
  try {
    // Buscar todos os módulos
    const { data: modules, error: modulesError } = await supabase
      .from(MODULES_TABLE)
      .select('*')
      .eq('status', 'active')
      .order('name', { ascending: true })

    if (modulesError) {
      return { data: null, error: modulesError.message }
    }

    // Buscar todas as views
    const { data: views, error: viewsError } = await supabase
      .from(VIEWS_TABLE)
      .select('*')
      .eq('status', 'active')
      .order('name', { ascending: true })

    if (viewsError) {
      return { data: null, error: viewsError.message }
    }

    return { 
      data: { 
        modules: modules || [], 
        views: views || [] 
      }, 
      error: null 
    }
  } catch (error) {
    return { data: null, error: 'Erro interno do servidor' }
  }
}