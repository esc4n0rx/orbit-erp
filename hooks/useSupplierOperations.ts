// hooks/useSupplierOperations.ts
"use client"

import { useState } from 'react'
import {
  generateSupplierCode,
  createSupplier,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
  searchSuppliers,
  getSupplierMaterials,
  addSupplierMaterial,
  updateSupplierMaterial,
  removeSupplierMaterial,
  searchMaterials
} from '@/lib/supabase/suppliers'
import type { 
  Supplier, 
  CreateSupplierData, 
  UpdateSupplierData, 
  SupplierSearchCriteria,
  SupplierMaterial,
  CreateSupplierMaterialData,
  UpdateSupplierMaterialData
} from '@/types/supplier'

export function useSupplierOperations() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateCode = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await generateSupplierCode()
      setLoading(false)
      return result
    } catch (err) {
      setError('Erro ao gerar código do fornecedor')
      setLoading(false)
      return { data: null, error: 'Erro ao gerar código do fornecedor' }
    }
  }

  const createNewSupplier = async (supplierData: CreateSupplierData, createdBy: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await createSupplier(supplierData, createdBy)
      setLoading(false)
      return result
    } catch (err) {
      setError('Erro ao criar fornecedor')
      setLoading(false)
      return { data: null, error: 'Erro ao criar fornecedor' }
    }
  }

  const getSupplier = async (id: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await getSupplierById(id)
      setLoading(false)
      return result
    } catch (err) {
      setError('Erro ao buscar fornecedor')
      setLoading(false)
      return { data: null, error: 'Erro ao buscar fornecedor' }
    }
  }

  const updateExistingSupplier = async (id: string, supplierData: UpdateSupplierData, updatedBy: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await updateSupplier(id, supplierData, updatedBy)
      setLoading(false)
      return result
    } catch (err) {
      setError('Erro ao atualizar fornecedor')
      setLoading(false)
      return { data: null, error: 'Erro ao atualizar fornecedor' }
    }
  }

  const removeSupplier = async (id: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await deleteSupplier(id)
      setLoading(false)
      return result
    } catch (err) {
      setError('Erro ao excluir fornecedor')
      setLoading(false)
      return { success: false, error: 'Erro ao excluir fornecedor' }
    }
  }

  const searchForSuppliers = async (criteria: SupplierSearchCriteria) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await searchSuppliers(criteria)
      setLoading(false)
      return result
    } catch (err) {
      setError('Erro ao buscar fornecedores')
      setLoading(false)
      return { data: null, error: 'Erro ao buscar fornecedores' }
    }
  }

  return {
    loading,
    error,
    setError,
    generateCode,
    createSupplier: createNewSupplier,
    getSupplier,
    updateSupplier: updateExistingSupplier,
    deleteSupplier: removeSupplier,
    searchSuppliers: searchForSuppliers
  }
}

export function useSupplierMaterialOperations() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getMaterials = async (supplierId: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await getSupplierMaterials(supplierId)
      setLoading(false)
      return result
    } catch (err) {
      setError('Erro ao buscar materiais')
      setLoading(false)
      return { data: null, error: 'Erro ao buscar materiais' }
    }
  }

  const addMaterial = async (materialData: CreateSupplierMaterialData, createdBy: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await addSupplierMaterial(materialData, createdBy)
      setLoading(false)
      return result
    } catch (err) {
      setError('Erro ao adicionar material')
      setLoading(false)
      return { data: null, error: 'Erro ao adicionar material' }
    }
  }

  const updateMaterial = async (id: string, materialData: UpdateSupplierMaterialData, updatedBy: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await updateSupplierMaterial(id, materialData, updatedBy)
      setLoading(false)
      return result
    } catch (err) {
      setError('Erro ao atualizar material')
      setLoading(false)
      return { data: null, error: 'Erro ao atualizar material' }
    }
  }

  const removeMaterial = async (id: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await removeSupplierMaterial(id)
      setLoading(false)
      return result
    } catch (err) {
      setError('Erro ao remover material')
      setLoading(false)
      return { success: false, error: 'Erro ao remover material' }
    }
  }

  const searchForMaterials = async (searchTerm: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await searchMaterials(searchTerm)
      setLoading(false)
      return result
    } catch (err) {
      setError('Erro ao buscar materiais')
      setLoading(false)
      return { data: null, error: 'Erro ao buscar materiais' }
    }
  }

  return {
    loading,
    error,
    setError,
    getMaterials,
    addMaterial,
    updateMaterial,
    removeMaterial,
    searchMaterials: searchForMaterials
  }
}