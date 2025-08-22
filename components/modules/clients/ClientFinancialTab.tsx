// components/modules/clients/ClientFinancialTab.tsx
"use client"

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { CreateClientData } from '@/types/client'

interface ClientFinancialTabProps {
  data: CreateClientData
  onChange: (field: string, value: any) => void
  errors: Record<string, string>
}

const CONDICOES_PAGAMENTO = [
  { value: 'a_vista', label: 'À Vista' },
  { value: '15_dias', label: '15 Dias' },
  { value: '30_dias', label: '30 Dias' },
  { value: '45_dias', label: '45 Dias' },
  { value: '60_dias', label: '60 Dias' },
  { value: '30_60', label: '30/60 Dias' },
  { value: '30_60_90', label: '30/60/90 Dias' }
]

const MOEDAS = [
  { value: 'BRL', label: 'Real (R$)' },
  { value: 'USD', label: 'Dólar (US$)' },
  { value: 'EUR', label: 'Euro (€)' }
]

const TABELAS_PRECO = [
  { value: 'padrao', label: 'Padrão' },
  { value: 'varejo', label: 'Varejo' },
  { value: 'atacado', label: 'Atacado' },
  { value: 'promocional', label: 'Promocional' },
  { value: 'especial', label: 'Especial' }
]

export default function ClientFinancialTab({ data, onChange, errors }: ClientFinancialTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Condições Comerciais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="condicao_pagamento_padrao">Condição de Pagamento Padrão</Label>
            <Select 
              value={data.condicao_pagamento_padrao || ''} 
              onValueChange={(value) => onChange('condicao_pagamento_padrao', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a condição" />
              </SelectTrigger>
              <SelectContent>
                {CONDICOES_PAGAMENTO.map((condicao) => (
                  <SelectItem key={condicao.value} value={condicao.value}>
                    {condicao.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="limite_credito">Limite de Crédito</Label>
              <Input
                id="limite_credito"
                type="number"
                step="0.01"
                min="0"
                value={data.limite_credito || ''}
                onChange={(e) => onChange('limite_credito', parseFloat(e.target.value) || 0)}
                placeholder="0,00"
                className={errors.limite_credito ? 'border-red-500' : ''}
              />
              {errors.limite_credito && (
                <p className="text-sm text-red-500">{errors.limite_credito}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="moeda_padrao">Moeda Padrão</Label>
              <Select 
                value={data.moeda_padrao || 'BRL'} 
                onValueChange={(value) => onChange('moeda_padrao', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MOEDAS.map((moeda) => (
                    <SelectItem key={moeda.value} value={moeda.value}>
                      {moeda.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tabela_preco_padrao">Tabela de Preço Padrão</Label>
            <Select 
              value={data.tabela_preco_padrao || ''} 
              onValueChange={(value) => onChange('tabela_preco_padrao', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a tabela" />
              </SelectTrigger>
              <SelectContent>
                {TABELAS_PRECO.map((tabela) => (
                  <SelectItem key={tabela.value} value={tabela.value}>
                    {tabela.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Controles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="bloqueado_venda">Bloqueado para Venda</Label>
              <p className="text-sm text-muted-foreground">
                Impede que este cliente realize novos pedidos
              </p>
            </div>
            <Switch
              id="bloqueado_venda"
              checked={data.bloqueado_venda || false}
              onCheckedChange={(checked) => onChange('bloqueado_venda', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}