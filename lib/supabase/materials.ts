import { supabase } from '../supabase'
import type { 
  Category, 
  CreateCategoryData, 
  UpdateCategoryData, 
  CategorySearchCriteria,
  Deposit,
  CreateDepositData,
  UpdateDepositData,
  DepositSearchCriteria
} from '@/types/material'

const CATEGORIES_TABLE = 'orbit_erp_categories_dev'
const DEPOSITS_TABLE = 'orbit_erp_deposits_dev'

// === CATEGORIAS ===

export async function createCategory(
  categoryData: CreateCategoryData, 
  createdBy: string
): Promise<{ data: Category | null; error: string | null }> {
  try {
    // Verificar se código interno já existe
    const { data: existingCategory } = await supabase
      .from(CATEGORIES_TABLE)
      .select('codigo_interno')
      .eq('codigo_interno', categoryData.codigo_interno)
      .single()

    if (existingCategory) {
      return { data: null, error: 'Código interno já existe' }
    }

    const newCategory = {
      ...categoryData,
      status: categoryData.status || 'active',
      created_by: createdBy,
      updated_by: createdBy
    }

    const { data, error } = await supabase
      .from(CATEGORIES_TABLE)
      .insert(newCategory)
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

export async function updateCategory(
  id: string, 
  categoryData: UpdateCategoryData, 
  updatedBy: string
): Promise<{ data: Category | null; error: string | null }> {
  try {
    // Verificar se código interno já existe em outra categoria
    if (categoryData.codigo_interno) {
      const { data: existingCategory } = await supabase
        .from(CATEGORIES_TABLE)
        .select('id')
        .eq('codigo_interno', categoryData.codigo_interno)
        .neq('id', id)
        .single()

      if (existingCategory) {
        return { data: null, error: 'Código interno já existe em outra categoria' }
      }
    }

    const updateData = {
      ...categoryData,
      updated_by: updatedBy,
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from(CATEGORIES_TABLE)
      .update(updateData)
      .eq('id', id)
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

export async function searchCategories(
  criteria: CategorySearchCriteria
): Promise<{ data: Category[] | null; error: string | null }> {
  try {
    let query = supabase.from(CATEGORIES_TABLE).select('*')

    if (criteria.codigo_interno) {
      query = query.ilike('codigo_interno', `%${criteria.codigo_interno}%`)
    }
    if (criteria.grupo_mercadoria) {
      query = query.ilike('grupo_mercadoria', `%${criteria.grupo_mercadoria}%`)
    }
    if (criteria.categoria) {
      query = query.ilike('categoria', `%${criteria.categoria}%`)
    }
    if (criteria.status) {
      query = query.eq('status', criteria.status)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    return { data: null, error: 'Erro interno do servidor' }
  }
}

export async function getCategoryById(
  id: string
): Promise<{ data: Category | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from(CATEGORIES_TABLE)
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    return { data: null, error: 'Erro interno do servidor' }
  }
}

export async function getAllCategories(): Promise<{ data: Category[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from(CATEGORIES_TABLE)
      .select('*')
      .eq('status', 'active')
      .order('categoria', { ascending: true })

    if (error) {
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    return { data: null, error: 'Erro interno do servidor' }
  }
}

// === DEPÓSITOS ===

export async function createDeposit(
  depositData: CreateDepositData, 
  createdBy: string
): Promise<{ data: Deposit | null; error: string | null }> {
  try {
    // Verificar se código já existe
    const { data: existingDeposit } = await supabase
      .from(DEPOSITS_TABLE)
      .select('codigo')
      .eq('codigo', depositData.codigo)
      .single()

    if (existingDeposit) {
      return { data: null, error: 'Código do depósito já existe' }
    }

    const newDeposit = {
      ...depositData,
      status: depositData.status || 'active',
      created_by: createdBy,
      updated_by: createdBy
    }

    const { data, error } = await supabase
      .from(DEPOSITS_TABLE)
      .insert(newDeposit)
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

export async function updateDeposit(
  id: string, 
  depositData: UpdateDepositData, 
  updatedBy: string
): Promise<{ data: Deposit | null; error: string | null }> {
  try {
    // Verificar se código já existe em outro depósito
    if (depositData.codigo) {
      const { data: existingDeposit } = await supabase
        .from(DEPOSITS_TABLE)
        .select('id')
        .eq('codigo', depositData.codigo)
        .neq('id', id)
        .single()

      if (existingDeposit) {
        return { data: null, error: 'Código do depósito já existe' }
      }
    }

    const updateData = {
      ...depositData,
      updated_by: updatedBy,
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from(DEPOSITS_TABLE)
      .update(updateData)
      .eq('id', id)
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

export async function searchDeposits(
  criteria: DepositSearchCriteria
): Promise<{ data: Deposit[] | null; error: string | null }> {
  try {
    let query = supabase.from(DEPOSITS_TABLE).select('*')

    if (criteria.nome) {
      query = query.ilike('nome', `%${criteria.nome}%`)
    }
    if (criteria.codigo) {
      query = query.ilike('codigo', `%${criteria.codigo}%`)
    }
    if (criteria.responsavel) {
      query = query.ilike('responsavel', `%${criteria.responsavel}%`)
    }
    if (criteria.status) {
      query = query.eq('status', criteria.status)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    return { data: null, error: 'Erro interno do servidor' }
  }
}

export async function getDepositById(
  id: string
): Promise<{ data: Deposit | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from(DEPOSITS_TABLE)
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    return { data: null, error: 'Erro interno do servidor' }
  }
}

export async function getAllDeposits(): Promise<{ data: Deposit[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from(DEPOSITS_TABLE)
      .select('*')
      .eq('status', 'active')
      .order('nome', { ascending: true })

    if (error) {
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    return { data: null, error: 'Erro interno do servidor' }
  }
}