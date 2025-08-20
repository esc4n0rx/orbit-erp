"use client"

import { useState } from 'react'
import { 
  createMaterial, 
  updateMaterial, 
  getMaterialById, 
  searchMaterials,
  getAllMaterials
} from '@/lib/supabase/materials'
import type { Material, CreateMaterialData, UpdateMaterialData, MaterialSearchCriteria } from '@/types/material-management'

export function useMaterialOperations() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCreateMaterial = async (
    materialData: CreateMaterialData, 
    createdBy: string
  ): Promise<{ data: Material | null; error: string | null }> => {
    setLoading(true)
    setError(null)

    try {
      const result = await createMaterial(materialData, createdBy)
      if (result.error) {
        setError(result.error)
      }
      return result
    } catch (err) {
      const errorMessage = 'Erro interno do servidor'
      setError(errorMessage)
      return { data: null, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateMaterial = async (
    id: string, 
    materialData: UpdateMaterialData, 
    updatedBy: string
  ): Promise<{ data: Material | null; error: string | null }> => {
    setLoading(true)
    setError(null)

    try {
      const result = await updateMaterial(id, materialData, updatedBy)
      if (result.error) {
        setError(result.error)
      }
      return result
    } catch (err) {
      const errorMessage = 'Erro interno do servidor'
      setError(errorMessage)
      return { data: null, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const handleGetMaterial = async (id: string): Promise<{ data: Material | null; error: string | null }> => {
    setLoading(true)
    setError(null)

    try {
      const result = await getMaterialById(id)
      if (result.error) {
        setError(result.error)
      }
      return result
    } catch (err) {
      const errorMessage = 'Erro interno do servidor'
      setError(errorMessage)
      return { data: null, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const handleSearchMaterials = async (criteria: MaterialSearchCriteria): Promise<{ data: Material[] | null; error: string | null }> => {
    setLoading(true)
    setError(null)

    try {
      const result = await searchMaterials(criteria)
      if (result.error) {
        setError(result.error)
      }
      return result
    } catch (err) {
      const errorMessage = 'Erro interno do servidor'
      setError(errorMessage)
      return { data: null, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const handleGetAllMaterials = async (): Promise<{ data: Material[] | null; error: string | null }> => {
    setLoading(true)
    setError(null)

    try {
      const result = await getAllMaterials()
      if (result.error) {
        setError(result.error)
      }
      return result
    } catch (err) {
      const errorMessage = 'Erro interno do servidor'
      setError(errorMessage)
      return { data: null, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  return {
    createMaterial: handleCreateMaterial,
    updateMaterial: handleUpdateMaterial,
    getMaterial: handleGetMaterial,
    searchMaterials: handleSearchMaterials,
    getAllMaterials: handleGetAllMaterials,
    loading,
    error,
    setError
  }
}