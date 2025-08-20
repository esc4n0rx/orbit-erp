"use client"

import { useState } from 'react'
import { 
  generateMaterialCode, 
  generateInternalCode, 
  generateEAN13, 
  generateEAN8 
} from '@/lib/utils/material-codes'
import { checkCodeExists } from '@/lib/supabase/materials'

export function useCodeGeneration() {
  const [loading, setLoading] = useState(false)

  const generateUniqueCode = async (
    type: 'material' | 'internal' | 'ean13' | 'ean8'
  ): Promise<string | null> => {
    setLoading(true)

    try {
      let code: string
      let attempts = 0
      const maxAttempts = 10

      do {
        switch (type) {
          case 'material':
            code = generateMaterialCode()
            break
          case 'internal':
            code = generateInternalCode()
            break
          case 'ean13':
            code = generateEAN13()
            break
          case 'ean8':
            code = generateEAN8()
            break
          default:
            return null
        }

        // Verificar se o código já existe
        const field = type === 'material' ? 'codigo_material' : 
                     type === 'internal' ? 'codigo_interno' : 
                     type === 'ean13' ? 'ean' : 'ean2'

        const { exists, error } = await checkCodeExists(code, field)

        if (error) {
          console.error('Erro ao verificar código:', error)
          // Em caso de erro, retorna o código gerado (fallback)
          return code
        }

        if (!exists) {
          return code // Código é único
        }

        attempts++
      } while (attempts < maxAttempts)

      // Se não conseguir gerar código único, retorna null
      console.error('Não foi possível gerar um código único após', maxAttempts, 'tentativas')
      return null

    } catch (error) {
      console.error('Erro ao gerar código:', error)
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    generateUniqueCode,
    loading
  }
}