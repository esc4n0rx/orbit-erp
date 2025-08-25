// components/modules/suppliers/SupplierBasicDataTab.tsx
"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RefreshCw } from 'lucide-react'
import { useSupplierOperations } from '@/hooks/useSupplierOperations'
import type { CreateSupplierData } from '@/types/supplier'

interface SupplierBasicDataTabProps {
  data: CreateSupplierData
  onChange: (field: string, value: any) => void
  errors: Record<string, string>
}

export default function SupplierBasicDataTab({ data, onChange, errors }: SupplierBasicDataTabProps) {
  const { generateCode, loading } = useSupplierOperations()

  const handleGenerateCode = async () => {
    const { data: newCode, error } = await generateCode()
    if (newCode && !error) {
      onChange('codigo_interno', newCode)
    }
  }

  return (
    <div className="space-y-6">
      {/* Código e Tipo */}
      <Card>
        <CardHeader>
          <CardTitle>Identificação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="codigo_interno">Código Interno *</Label>
              <div className="flex gap-2">
                <Input
                  id="codigo_interno"
                  value={data.codigo_interno}
                  onChange={(e) => onChange('codigo_interno', e.target.value)}
                  placeholder="FN0001"
                  className={errors.codigo_interno ? 'border-red-500' : ''}
                />
                <Button 
                  type="button"
                  variant="outline"
                  onClick={handleGenerateCode}
                  disabled={loading}
                  className="shrink-0"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
              {errors.codigo_interno && (
                <p className="text-sm text-red-500">{errors.codigo_interno}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo_fornecedor">Tipo de Fornecedor *</Label>
              <Select value={data.tipo_fornecedor} onValueChange={(value) => onChange('tipo_fornecedor', value)}>
                <SelectTrigger className={errors.tipo_fornecedor ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fisica">Pessoa Física</SelectItem>
                  <SelectItem value="juridica">Pessoa Jurídica</SelectItem>
                </SelectContent>
              </Select>
              {errors.tipo_fornecedor && (
                <p className="text-sm text-red-500">{errors.tipo_fornecedor}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dados Básicos */}
      <Card>
        <CardHeader>
          <CardTitle>Dados Básicos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="razao_social">
              {data.tipo_fornecedor === 'fisica' ? 'Nome Completo *' : 'Razão Social *'}
            </Label>
            <Input
              id="razao_social"
              value={data.razao_social}
              onChange={(e) => onChange('razao_social', e.target.value)}
              placeholder={data.tipo_fornecedor === 'fisica' ? 'Nome completo' : 'Razão social da empresa'}
              className={errors.razao_social ? 'border-red-500' : ''}
            />
            {errors.razao_social && (
              <p className="text-sm text-red-500">{errors.razao_social}</p>
            )}
          </div>

          {data.tipo_fornecedor === 'juridica' && (
            <div className="space-y-2">
              <Label htmlFor="nome_fantasia">Nome Fantasia</Label>
              <Input
                id="nome_fantasia"
                value={data.nome_fantasia || ''}
                onChange={(e) => onChange('nome_fantasia', e.target.value)}
                placeholder="Nome fantasia"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Documentos */}
      <Card>
        <CardHeader>
          <CardTitle>Documentos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.tipo_fornecedor === 'fisica' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  value={data.cpf || ''}
                  onChange={(e) => onChange('cpf', e.target.value)}
                  placeholder="000.000.000-00"
                  className={errors.cpf ? 'border-red-500' : ''}
                />
                {errors.cpf && (
                  <p className="text-sm text-red-500">{errors.cpf}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="rg">RG</Label>
                <Input
                  id="rg"
                  value={data.rg || ''}
                  onChange={(e) => onChange('rg', e.target.value)}
                  placeholder="00.000.000-0"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input
                  id="cnpj"
                  value={data.cnpj || ''}
                  onChange={(e) => onChange('cnpj', e.target.value)}
                  placeholder="00.000.000/0000-00"
                  className={errors.cnpj ? 'border-red-500' : ''}
                />
                {errors.cnpj && (
                  <p className="text-sm text-red-500">{errors.cnpj}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="inscricao_estadual">Inscrição Estadual</Label>
                <Input
                  id="inscricao_estadual"
                  value={data.inscricao_estadual || ''}
                  onChange={(e) => onChange('inscricao_estadual', e.target.value)}
                  placeholder="000.000.000.000"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status */}
      <Card>
        <CardHeader>
          <CardTitle>Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select value={data.status} onValueChange={(value) => onChange('status', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}