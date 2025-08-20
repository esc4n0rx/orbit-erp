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
import type {
  Material,
  CreateMaterialData,
  UpdateMaterialData,
  MaterialSearchCriteria
} from '@/types/material-management'

const CATEGORIES_TABLE = 'orbit_erp_categories_dev'
const DEPOSITS_TABLE = 'orbit_erp_deposits_dev'
const MATERIALS_TABLE = 'orbit_erp_materials_dev'

// === CATEGORIAS === (código existente mantido)

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
      .order('grupo_mercadoria', { ascending: true })

    if (error) {
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    return { data: null, error: 'Erro interno do servidor' }
  }
}

// === DEPÓSITOS === (código existente mantido)

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
      return { data: null, error: 'Código já existe' }
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
        return { data: null, error: 'Código já existe em outro depósito' }
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

// === MATERIAIS === (novas funções)

export async function createMaterial(
  materialData: CreateMaterialData, 
  createdBy: string
): Promise<{ data: Material | null; error: string | null }> {
  try {
    // Verificar se códigos já existem
    const { data: existingMaterial } = await supabase
      .from(MATERIALS_TABLE)
      .select('codigo_material, codigo_interno')
      .or(`codigo_material.eq.${materialData.codigo_material},codigo_interno.eq.${materialData.codigo_interno}`)
      .single()

    if (existingMaterial) {
      return { data: null, error: 'Código do material ou código interno já existe' }
    }

    const newMaterial = {
      ...materialData,
      status: materialData.status || 'active',
      controle_lote: materialData.controle_lote || false,
      controle_serie: materialData.controle_serie || false,
      controle_validade: materialData.controle_validade || false,
      created_by: createdBy,
      updated_by: createdBy
    }

    const { data, error } = await supabase
      .from(MATERIALS_TABLE)
      .insert(newMaterial)
      .select(`
        *,
        categoria:categoria_id (
          id,
          grupo_mercadoria,
          categoria,
          subcategoria
        ),
        deposito:deposito_id (
          id,
          codigo,
          nome
        )
      `)
      .single()

    if (error) {
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    return { data: null, error: 'Erro interno do servidor' }
  }
}

export async function updateMaterial(
  id: string, 
  materialData: UpdateMaterialData, 
  updatedBy: string
): Promise<{ data: Material | null; error: string | null }> {
  try {
    // Verificar se códigos já existem em outros materiais
    if (materialData.codigo_material || materialData.codigo_interno) {
      const conditions = []
      if (materialData.codigo_material) {
        conditions.push(`codigo_material.eq.${materialData.codigo_material}`)
      }
      if (materialData.codigo_interno) {
        conditions.push(`codigo_interno.eq.${materialData.codigo_interno}`)
      }

      const { data: existingMaterial } = await supabase
        .from(MATERIALS_TABLE)
        .select('id')
        .or(conditions.join(','))
        .neq('id', id)
        .single()

      if (existingMaterial) {
        return { data: null, error: 'Código do material ou código interno já existe em outro material' }
      }
    }

    const updateData = {
      ...materialData,
      updated_by: updatedBy,
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from(MATERIALS_TABLE)
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        categoria:categoria_id (
          id,
          grupo_mercadoria,
          categoria,
          subcategoria
        ),
        deposito:deposito_id (
          id,
          codigo,
          nome
        )
      `)
      .single()

    if (error) {
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    return { data: null, error: 'Erro interno do servidor' }
  }
}

export async function searchMaterials(
  criteria: MaterialSearchCriteria
): Promise<{ data: Material[] | null; error: string | null }> {
  try {
    let query = supabase
      .from(MATERIALS_TABLE)
      .select(`
        *,
        categoria:categoria_id (
          id,
          grupo_mercadoria,
          categoria,
          subcategoria
        ),
        deposito:deposito_id (
          id,
          codigo,
          nome
        )
      `)

    if (criteria.codigo_material) {
      query = query.ilike('codigo_material', `%${criteria.codigo_material}%`)
    }
    if (criteria.codigo_interno) {
      query = query.ilike('codigo_interno', `%${criteria.codigo_interno}%`)
    }
    if (criteria.descricao) {
      query = query.ilike('descricao', `%${criteria.descricao}%`)
    }
    if (criteria.categoria_id) {
      query = query.eq('categoria_id', criteria.categoria_id)
    }
    if (criteria.deposito_id) {
      query = query.eq('deposito_id', criteria.deposito_id)
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

export async function getMaterialById(
  id: string
): Promise<{ data: Material | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from(MATERIALS_TABLE)
      .select(`
        *,
        categoria:categoria_id (
          id,
          grupo_mercadoria,
          categoria,
          subcategoria
        ),
        deposito:deposito_id (
          id,
          codigo,
          nome
        )
      `)
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

export async function getAllMaterials(): Promise<{ data: Material[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from(MATERIALS_TABLE)
      .select(`
        *,
        categoria:categoria_id (
          id,
          grupo_mercadoria,
          categoria,
          subcategoria
        ),
        deposito:deposito_id (
          id,
          codigo,
          nome
        )
      `)
      .eq('status', 'active')
      .order('descricao', { ascending: true })

    if (error) {
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    return { data: null, error: 'Erro interno do servidor' }
  }
}

// Função para verificar se código já existe
export async function checkCodeExists(
  code: string, 
  field: 'codigo_material' | 'codigo_interno' | 'ean' | 'ean2'
): Promise<{ exists: boolean; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from(MATERIALS_TABLE)
      .select('id')
      .eq(field, code)
      .single()

    if (error && error.code !== 'PGRST116') {
      return { exists: false, error: error.message }
    }

    return { exists: !!data, error: null }
  } catch (error) {
    return { exists: false, error: 'Erro interno do servidor' }
  }
}