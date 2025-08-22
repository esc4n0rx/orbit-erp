// components/modules/clients/ClientClassificationTab.tsx
"use client"

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { CreateClientData } from '@/types/client'

interface ClientClassificationTabProps {
  data: CreateClientData
  onChange: (field: string, value: any) => void
  errors: Record<string, string>
}

const GRUPOS_CLIENTE = [
  { value: 'varejo', label: 'Varejo' },
  { value: 'atacado', label: 'Atacado' },
  { value: 'parceiro_estrategico', label: 'Parceiro Estratégico' },
  { value: 'distribuidor', label: 'Distribuidor' },
  { value: 'revendedor', label: 'Revendedor' }
]

const RAMOS_ATIVIDADE = [
  { value: 'alimenticio', label: 'Alimentício' },
  { value: 'farmaceutico', label: 'Farmacêutico' },
  { value: 'textil', label: 'Têxtil' },
  { value: 'eletronicos', label: 'Eletrônicos' },
  { value: 'construcao', label: 'Construção Civil' },
  { value: 'automotivo', label: 'Automotivo' },
  { value: 'servicos', label: 'Serviços' },
  { value: 'industria', label: 'Indústria' },
  { value: 'agricultura', label: 'Agricultura' },
  { value: 'outros', label: 'Outros' }
]

export default function ClientClassificationTab({ data, onChange, errors }: ClientClassificationTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Classificação do Cliente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tipo_classificacao">Tipo de Classificação *</Label>
            <Select 
              value={data.tipo_classificacao} 
              onValueChange={(value) => onChange('tipo_classificacao', value)}
            >
              <SelectTrigger className={errors.tipo_classificacao ? 'border-red-500' : ''}>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="externo">Cliente Externo</SelectItem>
                <SelectItem value="loja_filial">Loja/Filial Interna</SelectItem>
              </SelectContent>
            </Select>
            {errors.tipo_classificacao && (
              <p className="text-sm text-red-500">{errors.tipo_classificacao}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="grupo_cliente">Grupo de Cliente</Label>
            <Select 
              value={data.grupo_cliente || ''} 
              onValueChange={(value) => onChange('grupo_cliente', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o grupo" />
              </SelectTrigger>
              <SelectContent>
                {GRUPOS_CLIENTE.map((grupo) => (
                  <SelectItem key={grupo.value} value={grupo.value}>
                    {grupo.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ramo_atividade">Ramo de Atividade</Label>
            <Select 
              value={data.ramo_atividade || ''} 
              onValueChange={(value) => onChange('ramo_atividade', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o ramo" />
              </SelectTrigger>
              <SelectContent>
                {RAMOS_ATIVIDADE.map((ramo) => (
                  <SelectItem key={ramo.value} value={ramo.value}>
                    {ramo.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}