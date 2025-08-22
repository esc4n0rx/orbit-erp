// components/modules/clients/ClientCreateForm.tsx
"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MessageBar } from '@/components/ui/message-bar'
import { Loader2, Save, ArrowLeft } from 'lucide-react'
import ClientBasicDataTab from './ClientBasicDataTab'
import ClientAddressTab from './ClientAddressTab'
import ClientContactTab from './ClientContactTab'
import ClientClassificationTab from './ClientClassificationTab'
import ClientFinancialTab from './ClientFinancialTab'
import { useClientOperations } from '@/hooks/useClientOperations'
import type { CreateClientData } from '@/types/client'

interface ClientCreateFormProps {
  onSuccess?: (client: any) => void
  onCancel?: () => void
  createdBy: string
}

export default function ClientCreateForm({ onSuccess, onCancel, createdBy }: ClientCreateFormProps) {
  const { createClient, loading, error, setError } = useClientOperations()
  const [activeTab, setActiveTab] = useState('basic')
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState<CreateClientData>({
    codigo_interno: '',
    tipo_cliente: 'fisica',
    razao_social: '',
    tipo_classificacao: 'externo',
    status: 'active',
    bloqueado_venda: false,
    pais: 'Brasil',
    moeda_padrao: 'BRL'
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
    if (!formData.tipo_cliente) {
      newErrors.tipo_cliente = 'Tipo de cliente é obrigatório'
    }
    if (!formData.razao_social.trim()) {
      newErrors.razao_social = formData.tipo_cliente === 'fisica' ? 'Nome completo é obrigatório' : 'Razão social é obrigatória'
    }
    if (!formData.tipo_classificacao) {
      newErrors.tipo_classificacao = 'Tipo de classificação é obrigatório'
    }

    // Validações específicas por tipo
    if (formData.tipo_cliente === 'fisica') {
      if (formData.cpf && !isValidCPF(formData.cpf)) {
        newErrors.cpf = 'CPF inválido'
      }
    } else {
      if (formData.cnpj && !isValidCNPJ(formData.cnpj)) {
        newErrors.cnpj = 'CNPJ inválido'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidCPF = (cpf: string): boolean => {
    // Validação básica de CPF (implementar validação completa se necessário)
    const cleanCPF = cpf.replace(/\D/g, '')
    return cleanCPF.length === 11
  }

  const isValidCNPJ = (cnpj: string): boolean => {
    // Validação básica de CNPJ (implementar validação completa se necessário)
    const cleanCNPJ = cnpj.replace(/\D/g, '')
    return cleanCNPJ.length === 14
  }

  const handleSubmit = async () => {
    if (!validateBasicData()) {
      setActiveTab('basic')
      return
    }

    setError(null)

    try {
      const { data, error } = await createClient(formData, createdBy)

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
      formData.codigo_interno.trim() &&
      formData.tipo_cliente &&
      formData.razao_social.trim() &&
      formData.tipo_classificacao
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
          Cliente criado com sucesso!
        </MessageBar>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Criar Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">
                Dados Básicos*
              </TabsTrigger>
              <TabsTrigger 
                value="address" 
                disabled={!canProceedToTab('address')}
              >
                Endereço
              </TabsTrigger>
              <TabsTrigger 
                value="contact" 
                disabled={!canProceedToTab('contact')}
              >
                Contatos
              </TabsTrigger>
              <TabsTrigger 
                value="classification" 
                disabled={!canProceedToTab('classification')}
              >
                Classificação
              </TabsTrigger>
              <TabsTrigger 
                value="financial" 
                disabled={!canProceedToTab('financial')}
              >
                Financeiro
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic">
              <ClientBasicDataTab
                data={formData}
                onChange={handleFieldChange}
                errors={errors}
              />
            </TabsContent>

            <TabsContent value="address">
              <ClientAddressTab
                data={formData}
                onChange={handleFieldChange}
                errors={errors}
              />
            </TabsContent>

            <TabsContent value="contact">
              <ClientContactTab
                data={formData}
                onChange={handleFieldChange}
                errors={errors}
              />
            </TabsContent>

            <TabsContent value="classification">
              <ClientClassificationTab
                data={formData}
                onChange={handleFieldChange}
                errors={errors}
              />
            </TabsContent>

            <TabsContent value="financial">
              <ClientFinancialTab
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
              Criar Cliente
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}