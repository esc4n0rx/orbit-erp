// lib/supabase/suppliers.ts
import { supabase } from '../supabase'
import type { 
  Supplier, 
  CreateSupplierData, 
  UpdateSupplierData, 
  SupplierSearchCriteria,
  SupplierMaterial,
  CreateSupplierMaterialData,
  UpdateSupplierMaterialData
} from '@/types/supplier'

const SUPPLIERS_TABLE = 'orbit_erp_suppliers_dev'
const SUPPLIER_MATERIALS_TABLE = 'orbit_erp_supplier_materials_dev'

export async function generateSupplierCode(): Promise<{ data: string | null; error: string | null }> {
  try {
    // Buscar último código
    const { data, error } = await supabase
      .from(SUPPLIERS_TABLE)
      .select('codigo_interno')
      .like('codigo_interno', 'FN%')
      .order('codigo_interno', { ascending: false })
      .limit(1)

    if (error) {
      return { data: null, error: error.message }
    }

    let newNumber = 1
    if (data && data.length > 0) {
      const lastCode = data[0].codigo_interno
      const lastNumber = parseInt(lastCode.replace('FN', ''))
      newNumber = lastNumber + 1
    }

    const newCode = `FN${newNumber.toString().padStart(4, '0')}`
    return { data: newCode, error: null }
  } catch (error) {
    return { data: null, error: 'Erro interno do servidor' }
  }
}

export async function createSupplier(
  supplierData: CreateSupplierData,
  createdBy: string
): Promise<{ data: Supplier | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from(SUPPLIERS_TABLE)
      .insert({
        ...supplierData,
        created_by: createdBy,
        updated_by: createdBy
      })
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

export async function getSupplierById(id: string): Promise<{ data: Supplier | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from(SUPPLIERS_TABLE)
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

export async function updateSupplier(
  id: string,
  supplierData: UpdateSupplierData,
  updatedBy: string
): Promise<{ data: Supplier | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from(SUPPLIERS_TABLE)
      .update({
        ...supplierData,
        updated_by: updatedBy,
        updated_at: new Date().toISOString()
      })
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

export async function deleteSupplier(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from(SUPPLIERS_TABLE)
      .delete()
      .eq('id', id)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: 'Erro interno do servidor' }
  }
}

export async function searchSuppliers(criteria: SupplierSearchCriteria): Promise<{ data: Supplier[] | null; error: string | null }> {
  try {
    let query = supabase
      .from(SUPPLIERS_TABLE)
      .select('*')

    if (criteria.codigo_interno) {
      query = query.ilike('codigo_interno', `%${criteria.codigo_interno}%`)
    }
    if (criteria.razao_social) {
      query = query.ilike('razao_social', `%${criteria.razao_social}%`)
    }
    if (criteria.cnpj) {
      query = query.ilike('cnpj', `%${criteria.cnpj}%`)
    }
    if (criteria.cpf) {
      query = query.ilike('cpf', `%${criteria.cpf}%`)
    }
    if (criteria.tipo_fornecedor) {
      query = query.eq('tipo_fornecedor', criteria.tipo_fornecedor)
    }
    if (criteria.status) {
      query = query.eq('status', criteria.status)
    }

    const { data, error } = await query.order('razao_social', { ascending: true })

    if (error) {
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    return { data: null, error: 'Erro interno do servidor' }
  }
}

// ===== OPERAÇÕES DE MATERIAIS =====

export async function getSupplierMaterials(supplierId: string): Promise<{ data: SupplierMaterial[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from(SUPPLIER_MATERIALS_TABLE)
      .select(`
        *,
        material:orbit_erp_materials_dev!material_id (
          id,
          codigo_material,
          codigo_interno,
          descricao
        )
      `)
      .eq('supplier_id', supplierId)
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

export async function addSupplierMaterial(
  materialData: CreateSupplierMaterialData,
  createdBy: string
): Promise<{ data: SupplierMaterial | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from(SUPPLIER_MATERIALS_TABLE)
      .insert({
        ...materialData,
        created_by: createdBy,
        updated_by: createdBy
      })
      .select(`
        *,
        material:orbit_erp_materials_dev!material_id (
          id,
          codigo_material,
          codigo_interno,
          descricao
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

export async function updateSupplierMaterial(
  id: string,
  materialData: UpdateSupplierMaterialData,
  updatedBy: string
): Promise<{ data: SupplierMaterial | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from(SUPPLIER_MATERIALS_TABLE)
      .update({
        ...materialData,
        updated_by: updatedBy,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        material:orbit_erp_materials_dev!material_id (
          id,
          codigo_material,
          codigo_interno,
          descricao
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

export async function removeSupplierMaterial(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from(SUPPLIER_MATERIALS_TABLE)
      .delete()
      .eq('id', id)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: 'Erro interno do servidor' }
  }
}

export async function searchMaterials(searchTerm: string): Promise<{ data: any[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('orbit_erp_materials_dev')
      .select('id, codigo_material, codigo_interno, descricao')
      .or(`codigo_material.ilike.%${searchTerm}%,codigo_interno.ilike.%${searchTerm}%,descricao.ilike.%${searchTerm}%`)
      .eq('status', 'active')
      .limit(20)

    if (error) {
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    return { data: null, error: 'Erro interno do servidor' }
  }
}