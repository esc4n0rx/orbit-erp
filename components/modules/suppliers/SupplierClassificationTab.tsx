// components/modules/suppliers/SupplierClassificationTab.tsx
"use client"

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { CreateSupplierData } from '@/types/supplier'

interface SupplierClassificationTabProps {
  data: CreateSupplierData
  onChange: (field: string, value: any) => void
  errors: Record<string, string>
}

const GRUPOS_FORNECEDOR = [
  { value: 'materia_prima', label: 'Matéria Prima' },
  { value: 'insumos', label: 'Insumos' },
  { value: 'embalagens', label: 'Embalagens' },
  { value: 'servicos', label: 'Serviços' },
  { value: 'equipamentos', label: 'Equipamentos' },
  { value: 'manutencao', label: 'Manutenção' },
  { value: 'logistica', label: 'Logística' },
  { value: 'terceirizados', label: 'Terceirizados' }
]

const RAMOS_ATIVIDADE = [
  { value: 'alimenticio', label: 'Alimentício' },
  { value: 'farmaceutico', label: 'Farmacêutico' },
  { value: 'quimico', label: 'Químico' },
  { value: 'textil', label: 'Têxtil' },
  { value: 'metalurgico', label: 'Metalúrgico' },
  { value: 'plastico', label: 'Plástico' },
  { value: 'eletronicos', label: 'Eletrônicos' },
  { value: 'construcao', label: 'Construção Civil' },
  { value: 'automotivo', label: 'Automotivo' },
  { value: 'servicos', label: 'Serviços' },
  { value: 'logistica', label: 'Logística' },
  { value: 'agricultura', label: 'Agricultura' },
  { value: 'outros', label: 'Outros' }
]

export default function SupplierClassificationTab({ data, onChange, errors }: SupplierClassificationTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Classificação do Fornecedor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tipo_classificacao">Tipo de Classificação *</Label>
            <Select 
              value={data.tipo_classificacao} 
              onValueChange={(value) => onChange('tipo_classificacao', value)}
            >
              <SelectTrigger className={errors.tipo_classificacao ? 'border-red-500' : ''}>
                <SelectValue placeholder="Selecione a classificação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nacional">Fornecedor Nacional</SelectItem>
                <SelectItem value="internacional">Fornecedor Internacional</SelectItem>
                <SelectItem value="local">Fornecedor Local</SelectItem>
              </SelectContent>
            </Select>
            {errors.tipo_classificacao && (
              <p className="text-sm text-red-500">{errors.tipo_classificacao}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="grupo_fornecedor">Grupo do Fornecedor</Label>
              <Select 
                value={data.grupo_fornecedor || ''} 
                onValueChange={(value) => onChange('grupo_fornecedor', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o grupo" />
                </SelectTrigger>
                <SelectContent>
                  {GRUPOS_FORNECEDOR.map(grupo => (
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
                  {RAMOS_ATIVIDADE.map(ramo => (
                    <SelectItem key={ramo.value} value={ramo.value}>
                      {ramo.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}