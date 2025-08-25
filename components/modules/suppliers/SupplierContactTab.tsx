// components/modules/suppliers/SupplierContactTab.tsx
"use client"

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { CreateSupplierData } from '@/types/supplier'

interface SupplierContactTabProps {
  data: CreateSupplierData
  onChange: (field: string, value: any) => void
  errors: Record<string, string>
}

export default function SupplierContactTab({ data, onChange, errors }: SupplierContactTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informações de Contato</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="telefone_fixo">Telefone Fixo</Label>
              <Input
                id="telefone_fixo"
                value={data.telefone_fixo || ''}
                onChange={(e) => onChange('telefone_fixo', e.target.value)}
                placeholder="(11) 3000-0000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone_celular">Telefone Celular</Label>
              <Input
                id="telefone_celular"
                value={data.telefone_celular || ''}
                onChange={(e) => onChange('telefone_celular', e.target.value)}
                placeholder="(11) 99000-0000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={data.email || ''}
              onChange={(e) => onChange('email', e.target.value)}
              placeholder="contato@fornecedor.com"
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contato Principal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contato_principal_nome">Nome do Contato</Label>
              <Input
                id="contato_principal_nome"
                value={data.contato_principal_nome || ''}
                onChange={(e) => onChange('contato_principal_nome', e.target.value)}
                placeholder="Nome completo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contato_principal_funcao">Função/Cargo</Label>
              <Input
                id="contato_principal_funcao"
                value={data.contato_principal_funcao || ''}
                onChange={(e) => onChange('contato_principal_funcao', e.target.value)}
                placeholder="Gerente, Vendedor, etc."
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}