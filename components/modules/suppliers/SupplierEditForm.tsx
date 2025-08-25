// components/modules/suppliers/SupplierEditForm.tsx
"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MessageBar } from '@/components/ui/message-bar'
import { Loader2, Save, ArrowLeft } from 'lucide-react'
import SupplierBasicDataTab from './SupplierBasicDataTab'
import SupplierAddressTab from './SupplierAddressTab'
import SupplierContactTab from './SupplierContactTab'
import SupplierClassificationTab from './SupplierClassificationTab'
import SupplierFinancialTab from './SupplierFinancialTab'
import SupplierMaterialsTab from './SupplierMaterialsTab'
import { useSupplierOperations } from '@/hooks/useSupplierOperations'
import type { Supplier, CreateSupplierData, UpdateSupplierData } from '@/types/supplier'

interface SupplierEditFormProps {
  supplier: Supplier
  onSuccess?: (supplier: any) => void
  onCancel?: () => void
  updatedBy: string
}

export default function SupplierEditForm({ supplier, onSuccess, onCancel, updatedBy }: SupplierEditFormProps) {
  const { updateSupplier, loading, error, setError } = useSupplierOperations()
  const [activeTab, setActiveTab] = useState('basic')
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState<CreateSupplierData>({
    codigo_interno: supplier.codigo_interno,
    tipo_fornecedor: supplier.tipo_fornecedor,
    razao_social: supplier.razao_social,
    nome_fantasia: supplier.nome_fantasia,
    cpf: supplier.cpf,
    rg: supplier.rg,
    cnpj: supplier.cnpj,
    inscricao_estadual: supplier.inscricao_estadual,
    logradouro: supplier.logradouro,
    numero: supplier.numero,
    complemento: supplier.complemento,
    bairro: supplier.bairro,
    cidade: supplier.cidade,
    estado: supplier.estado,
    cep: supplier.cep,
    pais: supplier.pais,
    telefone_fixo: supplier.telefone_fixo,
    telefone_celular: supplier.telefone_celular,
    email: supplier.email,
    contato_principal_nome: supplier.contato_principal_nome,
    contato_principal_funcao: supplier.contato_principal_funcao,
    tipo_classificacao: supplier.tipo_classificacao,
    grupo_fornecedor: supplier.grupo_fornecedor,
    ramo_atividade: supplier.ramo_atividade,
    condicao_pagamento_padrao: supplier.condicao_pagamento_padrao,
    limite_credito: supplier.limite_credito,
    bloqueado_compra: supplier.bloqueado_compra,
    moeda_padrao: supplier.moeda_padrao,
    status: supplier.status
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

    if (!formData.codigo_interno.trim()) {
      newErrors.codigo_interno = 'Código interno é obrigatório'
    }
    if (!formData.tipo_fornecedor) {
      newErrors.tipo_fornecedor = 'Tipo de fornecedor é obrigatório'
    }
    if (!formData.razao_social.trim()) {
      newErrors.razao_social = formData.tipo_fornecedor === 'fisica' ? 
        'Nome completo é obrigatório' : 'Razão social é obrigatória'
    }
    if (!formData.tipo_classificacao) {
      newErrors.tipo_classificacao = 'Tipo de classificação é obrigatório'
    }

    // Validação de CPF/CNPJ se fornecido
    if (formData.tipo_fornecedor === 'fisica' && formData.cpf) {
      const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/
      if (!cpfRegex.test(formData.cpf)) {
        newErrors.cpf = 'CPF deve estar no formato 000.000.000-00'
      }
    }
    if (formData.tipo_fornecedor === 'juridica' && formData.cnpj) {
      const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$|^\d{14}$/
      if (!cnpjRegex.test(formData.cnpj)) {
        newErrors.cnpj = 'CNPJ deve estar no formato 00.000.000/0000-00'
      }
    }

    // Validação de email se fornecido
    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'E-mail deve ter um formato válido'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateBasicData()) {
      setActiveTab('basic')
      return
    }

    const { data, error } = await updateSupplier(supplier.id, formData, updatedBy)
    
    if (data && !error) {
      setSuccess(true)
      setTimeout(() => {
        onSuccess?.(data)
      }, 1500)
    }
  }

  if (success) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="text-green-600 text-6xl">✓</div>
            <div>
              <h3 className="text-lg font-semibold">Fornecedor atualizado com sucesso!</h3>
              <p className="text-muted-foreground">
                Os dados do fornecedor {formData.razao_social} foram atualizados.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <MessageBar variant="destructive">{error}</MessageBar>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="basic">Dados Básicos</TabsTrigger>
          <TabsTrigger value="address">Endereço</TabsTrigger>
          <TabsTrigger value="contact">Contato</TabsTrigger>
          <TabsTrigger value="classification">Classificação</TabsTrigger>
          <TabsTrigger value="financial">Financeiro</TabsTrigger>
          <TabsTrigger value="materials">Materiais</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="mt-6">
          <SupplierBasicDataTab
            data={formData}
            onChange={handleFieldChange}
            errors={errors}
          />
        </TabsContent>

        <TabsContent value="address" className="mt-6">
          <SupplierAddressTab
            data={formData}
            onChange={handleFieldChange}
            errors={errors}
          />
        </TabsContent>

        <TabsContent value="contact" className="mt-6">
          <SupplierContactTab
            data={formData}
            onChange={handleFieldChange}
            errors={errors}
          />
        </TabsContent>

        <TabsContent value="classification" className="mt-6">
          <SupplierClassificationTab
            data={formData}
            onChange={handleFieldChange}
            errors={errors}
          />
        </TabsContent>

        <TabsContent value="financial" className="mt-6">
          <SupplierFinancialTab
            data={formData}
            onChange={handleFieldChange}
            errors={errors}
          />
        </TabsContent>

        <TabsContent value="materials" className="mt-6">
          <SupplierMaterialsTab
            supplierId={supplier.id}
            currentUserId={updatedBy}
            readOnly={false}
          />
        </TabsContent>
      </Tabs>

      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              <Save className="h-4 w-4 mr-2" />
              Salvar Alterações
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}