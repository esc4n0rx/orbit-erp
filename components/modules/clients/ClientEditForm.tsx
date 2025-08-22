// components/modules/clients/ClientEditForm.tsx
"use client"

import { useState, useEffect } from 'react'
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
import type { Client, CreateClientData, UpdateClientData } from '@/types/client'

interface ClientEditFormProps {
  client: Client
  onSuccess?: (client: any) => void
  onCancel?: () => void
  updatedBy: string
}


export default function ClientEditForm({ client, onSuccess, onCancel, updatedBy }: ClientEditFormProps) {
  const { updateClient, loading, error, setError } = useClientOperations()
  const [activeTab, setActiveTab] = useState('basic')
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState<CreateClientData>({
    codigo_interno: client.codigo_interno || '',
    // components/modules/clients/ClientEditForm.tsx (continuação)
    tipo_cliente: client.tipo_cliente,
    razao_social: client.razao_social,
    nome_fantasia: client.nome_fantasia,
    cpf: client.cpf,
    rg: client.rg,
    cnpj: client.cnpj,
    inscricao_estadual: client.inscricao_estadual,
    logradouro: client.logradouro,
    numero: client.numero,
    complemento: client.complemento,
    bairro: client.bairro,
    cidade: client.cidade,
    estado: client.estado,
    cep: client.cep,
    pais: client.pais,
    telefone_fixo: client.telefone_fixo,
    telefone_celular: client.telefone_celular,
    email: client.email,
    contato_principal_nome: client.contato_principal_nome,
    contato_principal_funcao: client.contato_principal_funcao,
    tipo_classificacao: client.tipo_classificacao,
    grupo_cliente: client.grupo_cliente,
    ramo_atividade: client.ramo_atividade,
    condicao_pagamento_padrao: client.condicao_pagamento_padrao,
    limite_credito: client.limite_credito,
    bloqueado_venda: client.bloqueado_venda,
    moeda_padrao: client.moeda_padrao,
    tabela_preco_padrao: client.tabela_preco_padrao,
    status: client.status
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

    if (!formData.codigo_interno?.trim()) {
      newErrors.codigo_interno = 'Código interno é obrigatório'
    }
    if (!formData.tipo_cliente) {
      newErrors.tipo_cliente = 'Tipo de cliente é obrigatório'
    }
    if (!formData.razao_social?.trim()) {
      newErrors.razao_social = formData.tipo_cliente === 'fisica' ? 'Nome completo é obrigatório' : 'Razão social é obrigatória'
    }
    if (!formData.tipo_classificacao) {
      newErrors.tipo_classificacao = 'Tipo de classificação é obrigatório'
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
      const { data, error } = await updateClient(client.id, formData, updatedBy)

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

  return (
    <div className="space-y-6">
      {error && (
        <MessageBar variant="destructive" title="Erro">
          {error}
        </MessageBar>
      )}

      {success && (
        <MessageBar variant="success" title="Sucesso">
          Cliente atualizado com sucesso!
        </MessageBar>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Editar Cliente: {client.razao_social}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">
                Dados Básicos
              </TabsTrigger>
              <TabsTrigger value="address">
                Endereço
              </TabsTrigger>
              <TabsTrigger value="contact">
                Contatos
              </TabsTrigger>
              <TabsTrigger value="classification">
                Classificação
              </TabsTrigger>
              <TabsTrigger value="financial">
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