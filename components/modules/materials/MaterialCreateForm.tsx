"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MessageBar } from '@/components/ui/message-bar'
import { Loader2, Save, ArrowLeft } from 'lucide-react'
import MaterialBasicDataTab from './MaterialBasicDataTab'
import MaterialWarehouseTab from './MaterialWarehouseTab'
import MaterialSalesTab from './MaterialSalesTab'
import MaterialParametersTab from './MaterialParametersTab'
import { useMaterialOperations } from '@/hooks/useMaterialOperations'
import type { CreateMaterialData } from '@/types/material-management'

interface MaterialCreateFormProps {
  onSuccess?: (material: any) => void
  onCancel?: () => void
  createdBy: string
}

export default function MaterialCreateForm({ onSuccess, onCancel, createdBy }: MaterialCreateFormProps) {
  const { createMaterial, loading, error, setError } = useMaterialOperations()
  const [activeTab, setActiveTab] = useState('basic')
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState<CreateMaterialData>({
    codigo_material: '',
    codigo_interno: '',
    descricao: '',
    unidade_medida: '',
    categoria_id: '',
    deposito_id: '',
    status: 'active',
    controle_lote: false,
    controle_serie: false,
    controle_validade: false
  })

  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Limpar erro do campo quando ele for modificado
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateBasicData = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.codigo_material.trim()) {
      newErrors.codigo_material = 'Código do material é obrigatório'
    }
    if (!formData.codigo_interno.trim()) {
      newErrors.codigo_interno = 'Código interno é obrigatório'
    }
    if (!formData.descricao.trim()) {
      newErrors.descricao = 'Descrição é obrigatória'
    }
    if (!formData.unidade_medida) {
      newErrors.unidade_medida = 'Unidade de medida é obrigatória'
    }
    if (!formData.categoria_id) {
      newErrors.categoria_id = 'Categoria é obrigatória'
    }
    if (!formData.deposito_id) {
      newErrors.deposito_id = 'Depósito é obrigatório'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateBasicData()) {
      setActiveTab('basic')
      return
    }

    setError(null)

    try {
      const { data, error } = await createMaterial(formData, createdBy)

      if (error) {
        setError(error)
        return
      }

      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        onSuccess?.(data)
      }, 2000)

    } catch (err) {
      setError('Erro interno do servidor')
    }
  }

  const canProceedToTab = (tab: string): boolean => {
    if (tab === 'basic') return true
    
    // Para outras abas, verificar se dados básicos estão preenchidos
    return !!(
      formData.codigo_material.trim() &&
      formData.codigo_interno.trim() &&
      formData.descricao.trim() &&
      formData.unidade_medida &&
      formData.categoria_id &&
      formData.deposito_id
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <MessageBar variant="destructive" title="Erro">
          {error}
        </MessageBar>
      )}

      {success && (
        <MessageBar variant="success" title="Sucesso">
          Material criado com sucesso!
        </MessageBar>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Criar Material</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">
                Dados Básicos*
              </TabsTrigger>
              <TabsTrigger 
                value="warehouse" 
                disabled={!canProceedToTab('warehouse')}
              >
                Warehouse
              </TabsTrigger>
              <TabsTrigger 
                value="sales" 
                disabled={!canProceedToTab('sales')}
              >
                Venda
              </TabsTrigger>
              <TabsTrigger 
                value="parameters" 
                disabled={!canProceedToTab('parameters')}
              >
                Parâmetros
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic">
              <MaterialBasicDataTab
                data={formData}
                onChange={handleFieldChange}
                errors={errors}
              />
            </TabsContent>

            <TabsContent value="warehouse">
              <MaterialWarehouseTab
                data={formData}
                onChange={handleFieldChange}
                errors={errors}
              />
            </TabsContent>

            <TabsContent value="sales">
              <MaterialSalesTab
                data={formData}
                onChange={handleFieldChange}
                errors={errors}
              />
            </TabsContent>

            <TabsContent value="parameters">
              <MaterialParametersTab
                data={formData}
                onChange={handleFieldChange}
                errors={errors}
              />
            </TabsContent>
          </Tabs>

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Cancelar
            </Button>

            <Button
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Criar Material
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}