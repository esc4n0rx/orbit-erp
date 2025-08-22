// lib/supabase/clients.ts
import { supabase } from '../supabase'
import type { Client, CreateClientData, UpdateClientData, ClientSearchCriteria } from '@/types/client'

const CLIENTS_TABLE = 'orbit_erp_clients_dev'

export async function generateClientCode(): Promise<{ data: string | null; error: string | null }> {
  try {
    // Buscar último código
    const { data, error } = await supabase
      .from(CLIENTS_TABLE)
      .select('codigo_interno')
      .like('codigo_interno', 'CL%')
      .order('codigo_interno', { ascending: false })
      .limit(1)

    if (error) {
      return { data: null, error: error.message }
    }

    let newNumber = 1
    if (data && data.length > 0) {
      const lastCode = data[0].codigo_interno
      const lastNumber = parseInt(lastCode.replace('CL', ''))
      newNumber = lastNumber + 1
    }

    const newCode = `CL${newNumber.toString().padStart(4, '0')}`
    return { data: newCode, error: null }
  } catch (error) {
    return { data: null, error: 'Erro interno do servidor' }
  }
}

export async function createClient(
  clientData: CreateClientData,
  createdBy: string
): Promise<{ data: Client | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from(CLIENTS_TABLE)
      .insert({
        ...clientData,
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

export async function getClientById(id: string): Promise<{ data: Client | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from(CLIENTS_TABLE)
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

export async function updateClient(
  id: string,
  clientData: UpdateClientData,
  updatedBy: string
): Promise<{ data: Client | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from(CLIENTS_TABLE)
      .update({
        ...clientData,
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

export async function deleteClient(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from(CLIENTS_TABLE)
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

export async function searchClients(
  criteria: ClientSearchCriteria
): Promise<{ data: Client[] | null; error: string | null }> {
  try {
    let query = supabase.from(CLIENTS_TABLE).select('*')

    if (criteria.codigo_interno) {
      query = query.ilike('codigo_interno', `%${criteria.codigo_interno}%`)
    }
    if (criteria.razao_social) {
      query = query.ilike('razao_social', `%${criteria.razao_social}%`)
    }
    if (criteria.cnpj) {
      query = query.eq('cnpj', criteria.cnpj)
    }
    if (criteria.cpf) {
      query = query.eq('cpf', criteria.cpf)
    }
    if (criteria.tipo_cliente) {
      query = query.eq('tipo_cliente', criteria.tipo_cliente)
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