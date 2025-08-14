import { supabase } from '../supabase'
import type { Module, View } from '@/types/module'
import { getTableName } from '@/lib/utils/environment'

export async function getUserAccessibleViews(userRole: string, environment: string): Promise<{ data: View[] | null; error: string | null }> {
  try {
    const viewsTable = getTableName('views', environment)
    
    const { data, error } = await supabase
      .from(viewsTable)
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

export async function getUserAccessibleModules(userRole: string, environment: string): Promise<{ data: Module[] | null; error: string | null }> {
  try {
    const modulesTable = getTableName('modules', environment)
    
    const { data, error } = await supabase
      .from(modulesTable)
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

export async function getModuleViews(moduleAlias: string, environment: string): Promise<{ data: View[] | null; error: string | null }> {
  try {
    const modulesTable = getTableName('modules', environment)
    const viewsTable = getTableName('views', environment)
    
    // Primeiro buscar o módulo
    const { data: module, error: moduleError } = await supabase
      .from(modulesTable)
      .select('id')
      .eq('alias', moduleAlias)
      .eq('status', 'active')
      .single()

    if (moduleError || !module) {
      return { data: null, error: moduleError?.message || 'Módulo não encontrado' }
    }

    // Buscar as views do módulo
    const { data, error } = await supabase
      .from(viewsTable)
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

export async function getViewByAlias(alias: string, environment: string): Promise<{ data: View | null; error: string | null }> {
  try {
    const viewsTable = getTableName('views', environment)
    
    const { data, error } = await supabase
      .from(viewsTable)
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

export async function recordViewAccess(userId: string, viewAlias: string, environment: string): Promise<{ success: boolean; error?: string }> {
  try {
    const historyTable = getTableName('view_access_history', environment)
    const viewsTable = getTableName('views', environment)
    
    // Buscar o ID da view
    const { data: view, error: viewError } = await supabase
      .from(viewsTable)
      .select('id')
      .eq('alias', viewAlias)
      .single()

    if (viewError || !view) {
      return { success: false, error: 'View não encontrada' }
    }

    // Registrar o acesso
    const { error } = await supabase
      .from(historyTable)
      .insert({
        user_id: userId,
        view_id: view.id,
        view_alias: viewAlias,
        environment
      })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: 'Erro interno do servidor' }
  }
}

export async function getRecentViews(userId: string, environment: string, limit: number = 5): Promise<{ data: any[] | null; error: string | null }> {
  try {
    const historyTable = getTableName('view_access_history', environment)
    const viewsTable = getTableName('views', environment)
    
    const { data, error } = await supabase
      .from(historyTable)
      .select(`
        view_alias,
        accessed_at,
        view:${viewsTable}(
          name,
          description
        )
      `)
      .eq('user_id', userId)
      .order('accessed_at', { ascending: false })
      .limit(limit)

    if (error) {
      return { data: null, error: error.message }
    }

    // Remover duplicatas (manter apenas o acesso mais recente de cada view)
    const uniqueViews = new Map()
    data?.forEach(item => {
      if (!uniqueViews.has(item.view_alias)) {
        uniqueViews.set(item.view_alias, {
          id: item.view_alias,
          title: item.view?.name || item.view_alias,
          description: item.view?.description || 'View do sistema',
          lastAccessed: new Date(item.accessed_at).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        })
      }
    })

    return { data: Array.from(uniqueViews.values()), error: null }
  } catch (error) {
    return { data: null, error: 'Erro interno do servidor' }
  }
}

export async function getSuggestedViews(userRole: string, environment: string, limit: number = 6): Promise<{ data: any[] | null; error: string | null }> {
  try {
    const viewsTable = getTableName('views', environment)
    const modulesTable = getTableName('modules', environment)
    
    const { data, error } = await supabase
      .from(viewsTable)
      .select(`
        *,
        module:${modulesTable}(
          name,
          alias
        )
      `)
      .eq('status', 'active')
      .contains('required_roles', [userRole])
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      return { data: null, error: error.message }
    }

    const suggestedViews = data?.map(view => ({
      id: view.alias,
      title: view.name,
      description: view.description,
      category: view.module?.name || 'Sistema'
    })) || []

    return { data: suggestedViews, error: null }
  } catch (error) {
    return { data: null, error: 'Erro interno do servidor' }
  }
}

export async function getAllModules(environment: string): Promise<{ data: Module[] | null; error: string | null }> {
  try {
    const modulesTable = getTableName('modules', environment)
    
    const { data, error } = await supabase
      .from(modulesTable)
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

export async function getAllViews(environment: string): Promise<{ data: View[] | null; error: string | null }> {
  try {
    const viewsTable = getTableName('views', environment)
    
    const { data, error } = await supabase
      .from(viewsTable)
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