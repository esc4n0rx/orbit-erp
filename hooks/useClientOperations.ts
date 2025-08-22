// hooks/useClientOperations.ts
"use client"

import { useState } from 'react'
import {
  generateClientCode,
  createClient,
  getClientById,
  updateClient,
  deleteClient,
  searchClients
} from '@/lib/supabase/clients'
import type { Client, CreateClientData, UpdateClientData, ClientSearchCriteria } from '@/types/client'

export function useClientOperations() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateCode = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await generateClientCode()
      setLoading(false)
      return result
    } catch (err) {
      setError('Erro ao gerar código do cliente')
      setLoading(false)
      return { data: null, error: 'Erro ao gerar código do cliente' }
    }
  }

  const createNewClient = async (clientData: CreateClientData, createdBy: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await createClient(clientData, createdBy)
      setLoading(false)
      return result
    } catch (err) {
      setError('Erro ao criar cliente')
      setLoading(false)
      return { data: null, error: 'Erro ao criar cliente' }
    }
  }

  const getClient = async (id: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await getClientById(id)
      setLoading(false)
      return result
    } catch (err) {
      setError('Erro ao buscar cliente')
      setLoading(false)
      return { data: null, error: 'Erro ao buscar cliente' }
    }
  }

  const updateExistingClient = async (id: string, clientData: UpdateClientData, updatedBy: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await updateClient(id, clientData, updatedBy)
      setLoading(false)
      return result
    } catch (err) {
      setError('Erro ao atualizar cliente')
      setLoading(false)
      return { data: null, error: 'Erro ao atualizar cliente' }
    }
  }

  const removeClient = async (id: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await deleteClient(id)
      setLoading(false)
      return result
    } catch (err) {
      setError('Erro ao excluir cliente')
      setLoading(false)
      return { success: false, error: 'Erro ao excluir cliente' }
    }
  }

  const searchForClients = async (criteria: ClientSearchCriteria) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await searchClients(criteria)
      setLoading(false)
      return result
    } catch (err) {
      setError('Erro ao buscar clientes')
      setLoading(false)
      return { data: null, error: 'Erro ao buscar clientes' }
    }
  }

  return {
    loading,
    error,
    setError,
    generateCode,
    createClient: createNewClient,
    getClient,
    updateClient: updateExistingClient,
    deleteClient: removeClient,
    searchClients: searchForClients
  }
}