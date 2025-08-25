// components/modules/suppliers/SupplierFinancialTab.tsx
"use client"

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { CreateSupplierData } from '@/types/supplier'

interface SupplierFinancialTabProps {
  data: CreateSupplierData
  onChange: (field: string, value: any) => void
  errors: Record<string, string>
}

const CONDICOES_PAGAMENTO = [
  { value: '30_dias', label: '30 dias' },
  { value: '45_dias', label: '45 dias' },
  { value: '60_dias', label: '60 dias' },
  { value: 'a_vista', label: 'À vista' },
  { value: '15_dias', label: '15 dias' },
  { value: '7_dias', label: '7 dias' },
  { value: '30_45_dias', label: '30/45 dias' },
  { value: '30_60_dias', label: '30/60 dias' },
  { value: 'personalizado', label: 'Personalizado' }
]

const MOEDAS = [
  { value: 'BRL', label: 'Real (BRL)' },
  { value: 'USD', label: 'Dólar (USD)' },
  { value: 'EUR', label: 'Euro (EUR)' },
  { value: 'ARS', label: 'Peso Argentino (ARS)' },
  { value: 'UYU', label: 'Peso Uruguaio (UYU)' }
]

export default function SupplierFinancialTab({ data, onChange, errors }: SupplierFinancialTabProps) {
  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/\D/g, '')
    const formattedValue = (parseFloat(numericValue) / 100).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
    return formattedValue === 'NaN' ? '' : formattedValue
  }

  const handleCurrencyChange = (field: string, value: string) => {
    const numericValue = parseFloat(value.replace(/\D/g, '')) / 100
    onChange(field, isNaN(numericValue) ? 0 : numericValue)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Condições Comerciais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  {CONDICOES_PAGAMENTO.map(condicao => (
                    <SelectItem key={condicao.value} value={condicao.value}>
                      {condicao.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="moeda_padrao">Moeda Padrão</Label>
              <Select 
                value={data.moeda_padrao || ''} 
                onValueChange={(value) => onChange('moeda_padrao', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a moeda" />
                </SelectTrigger>
                <SelectContent>
                  {MOEDAS.map(moeda => (
                    <SelectItem key={moeda.value} value={moeda.value}>
                      {moeda.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="limite_credito">Limite de Crédito</Label>
            <Input
              id="limite_credito"
              value={formatCurrency(((data.limite_credito || 0) * 100).toString())}
              onChange={(e) => handleCurrencyChange('limite_credito', e.target.value)}
              placeholder="0,00"
              className={errors.limite_credito ? 'border-red-500' : ''}
            />
            {errors.limite_credito && (
              <p className="text-sm text-red-500">{errors.limite_credito}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Controles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="bloqueado_compra"
              checked={data.bloqueado_compra || false}
              onCheckedChange={(checked) => onChange('bloqueado_compra', checked)}
            />
            <Label htmlFor="bloqueado_compra" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Bloqueado para Compra
            </Label>
          </div>
          {data.bloqueado_compra && (
            <p className="text-sm text-amber-600">
              Este fornecedor está bloqueado para novas compras
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}