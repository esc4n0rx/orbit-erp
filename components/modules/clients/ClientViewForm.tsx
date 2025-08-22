// components/modules/clients/ClientViewForm.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  User, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Tag, 
  CreditCard,
  Shield,
  Calendar
} from 'lucide-react'
import type { Client } from '@/types/client'

interface ClientViewFormProps {
  client: Client
}

export default function ClientViewForm({ client }: ClientViewFormProps) {
  const formatCurrency = (value?: number) => {
    if (!value) return 'R$ 0,00'
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status: string) => {
    return status === 'active' ? (
      <Badge variant="default" className="bg-green-500">Ativo</Badge>
    ) : (
      <Badge variant="secondary">Inativo</Badge>
    )
  }

  const getTipoClienteBadge = (tipo: string) => {
    return tipo === 'fisica' ? (
      <Badge variant="outline">Pessoa Física</Badge>
    ) : (
      <Badge variant="outline">Pessoa Jurídica</Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header com informações principais */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                {client.tipo_cliente === 'fisica' ? (
                  <User className="h-6 w-6 text-blue-600" />
                ) : (
                  <Building2 className="h-6 w-6 text-blue-600" />
                )}
                <div>
                  <CardTitle className="text-xl">{client.razao_social}</CardTitle>
                  {client.nome_fantasia && (
                    <p className="text-sm text-muted-foreground">
                      {client.nome_fantasia}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{client.codigo_interno}</Badge>
                {getTipoClienteBadge(client.tipo_cliente)}
                {getStatusBadge(client.status)}
                {client.bloqueado_venda && (
                  <Badge variant="destructive">Bloqueado</Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Documentos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Documentos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {client.tipo_cliente === 'fisica' ? (
              <>
                {client.cpf && (
                  <div>
                    <span className="text-sm font-medium">CPF:</span>
                    <p className="text-sm text-muted-foreground">{client.cpf}</p>
                  </div>
                )}
                {client.rg && (
                  <div>
                    <span className="text-sm font-medium">RG:</span>
                    <p className="text-sm text-muted-foreground">{client.rg}</p>
                  </div>
                )}
              </>
            ) : (
              <>
                {client.cnpj && (
                  <div>
                    <span className="text-sm font-medium">CNPJ:</span>
                    <p className="text-sm text-muted-foreground">{client.cnpj}</p>
                  </div>
                )}
                {client.inscricao_estadual && (
                  <div>
                    <span className="text-sm font-medium">Inscrição Estadual:</span>
                    <p className="text-sm text-muted-foreground">{client.inscricao_estadual}</p>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Endereço */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Endereço
            </CardTitle>
          </CardHeader>
          <CardContent>
            {client.logradouro ? (
              <div className="space-y-1">
                <p className="text-sm">
                  {client.logradouro}
                  {client.numero && `, ${client.numero}`}
                  {client.complemento && ` - ${client.complemento}`}
                </p>
                {client.bairro && (
                  <p className="text-sm text-muted-foreground">{client.bairro}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  {client.cidade}
                  {client.estado && ` - ${client.estado}`}
                  {client.cep && ` - ${client.cep}`}
                </p>
                {client.pais && (
                  <p className="text-sm text-muted-foreground">{client.pais}</p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Nenhum endereço cadastrado</p>
            )}
          </CardContent>
        </Card>

        {/* Contatos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Contatos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {client.telefone_fixo && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{client.telefone_fixo}</span>
              </div>
            )}
            {client.telefone_celular && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{client.telefone_celular}</span>
              </div>
            )}
            {client.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{client.email}</span>
              </div>
            )}
            
            {client.contato_principal_nome && (
              <>
                <Separator />
                <div>
                  <span className="text-sm font-medium">Contato Principal:</span>
                  <p className="text-sm text-muted-foreground">
                    {client.contato_principal_nome}
                    {client.contato_principal_funcao && (
                      <span> - {client.contato_principal_funcao}</span>
                    )}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Classificação */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Classificação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="text-sm font-medium">Tipo:</span>
              <p className="text-sm text-muted-foreground">
                {client.tipo_classificacao === 'externo' ? 'Cliente Externo' : 'Loja/Filial Interna'}
              </p>
            </div>
            {client.grupo_cliente && (
              <div>
                <span className="text-sm font-medium">Grupo:</span>
                <p className="text-sm text-muted-foreground">{client.grupo_cliente}</p>
              </div>
            )}
            {client.ramo_atividade && (
              <div>
                <span className="text-sm font-medium">Ramo de Atividade:</span>
                <p className="text-sm text-muted-foreground">{client.ramo_atividade}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Informações Financeiras */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Informações Financeiras
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {client.condicao_pagamento_padrao && (
                <div>
                  <span className="text-sm font-medium">Condição de Pagamento:</span>
                  <p className="text-sm text-muted-foreground">{client.condicao_pagamento_padrao}</p>
                </div>
              )}
              <div>
                <span className="text-sm font-medium">Limite de Crédito:</span>
                <p className="text-sm text-muted-foreground">{formatCurrency(client.limite_credito)}</p>
              </div>
              {client.moeda_padrao && (
                <div>
                  <span className="text-sm font-medium">Moeda Padrão:</span>
                  <p className="text-sm text-muted-foreground">{client.moeda_padrao}</p>
                </div>
              )}
              {client.tabela_preco_padrao && (
                <div>
                  <span className="text-sm font-medium">Tabela de Preço:</span>
                  <p className="text-sm text-muted-foreground">{client.tabela_preco_padrao}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Informações do Sistema */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Informações do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium">Data de Cadastro:</span>
                <p className="text-sm text-muted-foreground">{formatDate(client.created_at)}</p>
              </div>
              <div>
                <span className="text-sm font-medium">Última Atualização:</span>
                <p className="text-sm text-muted-foreground">{formatDate(client.updated_at)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}