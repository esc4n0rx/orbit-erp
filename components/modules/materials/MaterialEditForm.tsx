"use client"

import { useState, useEffect } from 'react'
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
import type { Material, UpdateMaterialData } from '@/types/material-management'

interface MaterialEditFormProps {
  material: Material
  onSuccess?: (material: Material) => void
  onCancel?: () => void
  updatedBy: string
}

export default function MaterialEditForm({ material, onSuccess, onCancel, updatedBy }: MaterialEditFormProps) {
  const { updateMaterial, loading, error, setError } = useMaterialOperations()
  const [activeTab, setActiveTab] = useState('basic')
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState<UpdateMaterialData>({
    codigo_material: material.codigo_material,
    codigo_interno: material.codigo_interno,
    descricao: material.descricao,
    unidade_medida: material.unidade_medida,
    categoria_id: material.categoria_id,
    deposito_id: material.deposito_id,
    ean: material.ean,
    ean2: material.ean2,
    quantidade_por_caixa: material.quantidade_por_caixa,
    status: material.status,
    localizacao: material.localizacao,
    ponto_reposicao: material.ponto_reposicao,
    estoque_minimo: material.estoque_minimo,
    estoque_maximo: material.estoque_maximo,
    tempo_reposicao: material.tempo_reposicao,
    controle_lote: material.controle_lote,
    controle_serie: material.controle_serie,
    controle_validade: material.controle_validade,
    preco_custo: material.preco_custo,
    preco_venda: material.preco_venda,
    margem_lucro: material.margem_lucro,
    icms: material.icms,
    ipi: material.ipi,
    ncm: material.ncm,
    origem: material.origem,
    peso_liquido: material.peso_liquido,
    peso_bruto: material.peso_bruto,
    altura: material.altura,
    largura: material.largura,
    profundidade: material.profundidade,
    volume: material.volume,
    cor: material.cor,
    tamanho: material.tamanho,
    modelo: material.modelo,
    marca: material.marca
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

    if (!formData.codigo_material?.trim()) {
      newErrors.codigo_material = 'Código do material é obrigatório'
    }
    if (!formData.codigo_interno?.trim()) {
      newErrors.codigo_interno = 'Código interno é obrigatório'
    }
    if (!formData.descricao?.trim()) {
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
      const { data, error } = await updateMaterial(material.id, formData, updatedBy)

      if (error) {
        setError(error)
        return
      }

      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        onSuccess?.(data!)
      }, 2000)

    } catch (err) {
      setError('Erro interno do servidor')
    }
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
          Material atualizado com sucesso!
        </MessageBar>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Editar Material: {material.descricao}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">
                Dados Básicos
              </TabsTrigger>
              <TabsTrigger value="warehouse">
                Warehouse
              </TabsTrigger>
              <TabsTrigger value="sales">
                Venda
              </TabsTrigger>
              <TabsTrigger value="parameters">
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
              Voltar
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
              Salvar Alterações
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}