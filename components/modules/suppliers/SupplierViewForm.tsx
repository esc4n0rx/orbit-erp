// components/modules/suppliers/SupplierViewForm.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Building2, User, MapPin, Phone, Mail, CreditCard, Package } from 'lucide-react'
import SupplierMaterialsTab from './SupplierMaterialsTab'
import type { Supplier } from '@/types/supplier'

interface SupplierViewFormProps {
  supplier: Supplier
  currentUserId?: string
}

export default function SupplierViewForm({ supplier, currentUserId }: SupplierViewFormProps) {
  const formatCurrency = (value?: number) => {
    if (!value) return 'R$ 0,00'
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  const formatDocument = () => {
    if (supplier.tipo_fornecedor === 'fisica') {
      return supplier.cpf || 'Não informado'
    } else {
      return supplier.cnpj || 'Não informado'
    }
  }

  const getTipoIcon = () => {
    return supplier.tipo_fornecedor === 'fisica' ? (
      <User className="h-5 w-5" />
    ) : (
      <Building2 className="h-5 w-5" />
    )
  }

  const getStatusBadge = () => {
    return supplier.status === 'active' ? (
      <Badge className="bg-green-500">Ativo</Badge>
    ) : (
      <Badge variant="secondary">Inativo</Badge>
    )
  }

  const getClassificacaoLabel = (tipo: string) => {
    const labels = {
      'nacional': 'Fornecedor Nacional',
      'internacional': 'Fornecedor Internacional',
      'local': 'Fornecedor Local'
    }
    return labels[tipo as keyof typeof labels] || tipo
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-muted">
                {getTipoIcon()}
              </div>
              <div>
                <CardTitle className="text-2xl">{supplier.razao_social}</CardTitle>
                {supplier.nome_fantasia && (
                  <p className="text-muted-foreground mt-1">{supplier.nome_fantasia}</p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">{supplier.codigo_interno}</Badge>
                  {getStatusBadge()}
                  {supplier.bloqueado_compra && (
                    <Badge variant="destructive">Bloqueado para Compra</Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="address">Endereço</TabsTrigger>
          <TabsTrigger value="contact">Contato</TabsTrigger>
          <TabsTrigger value="financial">Financeiro</TabsTrigger>
          <TabsTrigger value="materials">Materiais</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Informações Básicas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getTipoIcon()}
                  Informações Básicas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="text-sm font-medium">Tipo de Fornecedor:</span>
                  <p className="text-sm text-muted-foreground">
                    {supplier.tipo_fornecedor === 'fisica' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium">Documento:</span>
                  <p className="text-sm text-muted-foreground font-mono">{formatDocument()}</p>
                </div>
                {supplier.inscricao_estadual && (
                  <div>
                    <span className="text-sm font-medium">Inscrição Estadual:</span>
                    <p className="text-sm text-muted-foreground">{supplier.inscricao_estadual}</p>
                  </div>
                )}
                {supplier.rg && (
                  <div>
                    <span className="text-sm font-medium">RG:</span>
                    <p className="text-sm text-muted-foreground">{supplier.rg}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Classificação */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Classificação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="text-sm font-medium">Classificação:</span>
                  <p className="text-sm text-muted-foreground">
                    {getClassificacaoLabel(supplier.tipo_classificacao)}
                  </p>
                </div>
                {supplier.grupo_fornecedor && (
                  <div>
                    <span className="text-sm font-medium">Grupo:</span>
                    <p className="text-sm text-muted-foreground">{supplier.grupo_fornecedor}</p>
                  </div>
                )}
                {supplier.ramo_atividade && (
                  <div>
                    <span className="text-sm font-medium">Ramo de Atividade:</span>
                    <p className="text-sm text-muted-foreground">{supplier.ramo_atividade}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="address">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Endereço Principal
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {supplier.logradouro && (
                <div>
                  <span className="text-sm font-medium">Logradouro:</span>
                  <p className="text-sm text-muted-foreground">
                  {supplier.logradouro}{supplier.numero ? `, ${supplier.numero}` : ''}
                  </p>
                </div>
              )}
              {supplier.complemento && (
                <div>
                  <span className="text-sm font-medium">Complemento:</span>
                  <p className="text-sm text-muted-foreground">{supplier.complemento}</p>
                </div>
              )}
              {supplier.bairro && (
                <div>
                  <span className="text-sm font-medium">Bairro:</span>
                  <p className="text-sm text-muted-foreground">{supplier.bairro}</p>
                </div>
              )}
              {supplier.cidade && (
                <div>
                  <span className="text-sm font-medium">Cidade:</span>
                  <p className="text-sm text-muted-foreground">
                    {supplier.cidade}{supplier.estado ? ` - ${supplier.estado}` : ''}
                  </p>
                </div>
              )}
              {supplier.cep && (
                <div>
                  <span className="text-sm font-medium">CEP:</span>
                  <p className="text-sm text-muted-foreground">{supplier.cep}</p>
                </div>
              )}
              {supplier.pais && (
                <div>
                  <span className="text-sm font-medium">País:</span>
                  <p className="text-sm text-muted-foreground">{supplier.pais}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Telefones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {supplier.telefone_fixo && (
                  <div>
                    <span className="text-sm font-medium">Telefone Fixo:</span>
                    <p className="text-sm text-muted-foreground">{supplier.telefone_fixo}</p>
                  </div>
                )}
                {supplier.telefone_celular && (
                  <div>
                    <span className="text-sm font-medium">Telefone Celular:</span>
                    <p className="text-sm text-muted-foreground">{supplier.telefone_celular}</p>
                  </div>
                )}
                {supplier.email && (
                  <div>
                    <span className="text-sm font-medium">E-mail:</span>
                    <p className="text-sm text-muted-foreground">{supplier.email}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Contato Principal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {supplier.contato_principal_nome && (
                  <div>
                    <span className="text-sm font-medium">Nome:</span>
                    <p className="text-sm text-muted-foreground">{supplier.contato_principal_nome}</p>
                  </div>
                )}
                {supplier.contato_principal_funcao && (
                  <div>
                    <span className="text-sm font-medium">Função:</span>
                    <p className="text-sm text-muted-foreground">{supplier.contato_principal_funcao}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Informações Financeiras
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {supplier.condicao_pagamento_padrao && (
                  <div>
                    <span className="text-sm font-medium">Condição de Pagamento:</span>
                    <p className="text-sm text-muted-foreground">{supplier.condicao_pagamento_padrao}</p>
                  </div>
                )}
                <div>
                  <span className="text-sm font-medium">Limite de Crédito:</span>
                  <p className="text-sm text-muted-foreground">{formatCurrency(supplier.limite_credito)}</p>
                </div>
                {supplier.moeda_padrao && (
                  <div>
                    <span className="text-sm font-medium">Moeda Padrão:</span>
                    <p className="text-sm text-muted-foreground">{supplier.moeda_padrao}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="materials">
          {currentUserId && (
            <SupplierMaterialsTab
              supplierId={supplier.id}
              currentUserId={currentUserId}
              readOnly={true}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}