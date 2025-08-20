"use client"

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getAllCategories, getAllDeposits } from '@/lib/supabase/materials'
import CodeGeneratorButton from './CodeGeneratorButton'
import type { Category, Deposit } from '@/types/material'

interface MaterialBasicDataTabProps {
  data: {
    codigo_material: string
    codigo_interno: string
    descricao: string
    unidade_medida: string
    categoria_id: string
    deposito_id: string
    ean?: string
    ean2?: string
    quantidade_por_caixa?: number
    status: 'active' | 'inactive'
  }
  onChange: (field: string, value: any) => void
  errors: Record<string, string>
  isReadOnly?: boolean
}

const unidadesMedida = [
  'unidade', 'kg', 'g', 'ton', 'litro', 'ml', 'm', 'cm', 'mm', 'm²', 'm³', 'caixa', 'pacote', 'dúzia'
]

export default function MaterialBasicDataTab({ 
  data, 
  onChange, 
  errors, 
  isReadOnly = false 
}: MaterialBasicDataTabProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [deposits, setDeposits] = useState<Deposit[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [categoriesResult, depositsResult] = await Promise.all([
        getAllCategories(),
        getAllDeposits()
      ])

      if (categoriesResult.data) {
        setCategories(categoriesResult.data)
      }

      if (depositsResult.data) {
        setDeposits(depositsResult.data)
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Dados Básicos *</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="codigo_material">Código do Material *</Label>
              <div className="flex gap-2">
                <Input
                  id="codigo_material"
                  value={data.codigo_material}
                  onChange={(e) => onChange('codigo_material', e.target.value)}
                  disabled={isReadOnly}
                  className={errors.codigo_material ? 'border-destructive' : ''}
                />
                {!isReadOnly && (
                  <CodeGeneratorButton
                    type="material"
                    onCodeGenerated={(code) => onChange('codigo_material', code)}
                  />
                )}
              </div>
              {errors.codigo_material && (
                <p className="text-sm text-destructive mt-1">{errors.codigo_material}</p>
              )}
            </div>

            <div>
              <Label htmlFor="codigo_interno">Código Interno *</Label>
              <div className="flex gap-2">
                <Input
                  id="codigo_interno"
                  value={data.codigo_interno}
                  onChange={(e) => onChange('codigo_interno', e.target.value)}
                  disabled={isReadOnly}
                  className={errors.codigo_interno ? 'border-destructive' : ''}
                />
                {!isReadOnly && (
                  <CodeGeneratorButton
                    type="internal"
                    onCodeGenerated={(code) => onChange('codigo_interno', code)}
                  />
                )}
              </div>
              {errors.codigo_interno && (
                <p className="text-sm text-destructive mt-1">{errors.codigo_interno}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="descricao">Descrição do Material *</Label>
            <Input
              id="descricao"
              value={data.descricao}
              onChange={(e) => onChange('descricao', e.target.value)}
              disabled={isReadOnly}
              className={errors.descricao ? 'border-destructive' : ''}
            />
            {errors.descricao && (
              <p className="text-sm text-destructive mt-1">{errors.descricao}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="unidade_medida">Unidade de Medida *</Label>
              <Select
                value={data.unidade_medida}
                onValueChange={(value) => onChange('unidade_medida', value)}
                disabled={isReadOnly}
              >
                <SelectTrigger className={errors.unidade_medida ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Selecione uma unidade" />
                </SelectTrigger>
                <SelectContent>
                  {unidadesMedida.map((unidade) => (
                    <SelectItem key={unidade} value={unidade}>
                      {unidade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.unidade_medida && (
                <p className="text-sm text-destructive mt-1">{errors.unidade_medida}</p>
              )}
            </div>

            <div>
              <Label htmlFor="categoria_id">Categoria *</Label>
              <Select
                value={data.categoria_id}
                onValueChange={(value) => onChange('categoria_id', value)}
                disabled={isReadOnly || loading}
              >
                <SelectTrigger className={errors.categoria_id ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((categoria) => (
                    <SelectItem key={categoria.id} value={categoria.id}>
                      {categoria.grupo_mercadoria} - {categoria.categoria}
                      {categoria.subcategoria && ` - ${categoria.subcategoria}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoria_id && (
                <p className="text-sm text-destructive mt-1">{errors.categoria_id}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="deposito_id">Depósito *</Label>
            <Select
              value={data.deposito_id}
              onValueChange={(value) => onChange('deposito_id', value)}
              disabled={isReadOnly || loading}
            >
              <SelectTrigger className={errors.deposito_id ? 'border-destructive' : ''}>
                <SelectValue placeholder="Selecione um depósito" />
              </SelectTrigger>
              <SelectContent>
                {deposits.map((deposito) => (
                  <SelectItem key={deposito.id} value={deposito.id}>
                    {deposito.codigo} - {deposito.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.deposito_id && (
              <p className="text-sm text-destructive mt-1">{errors.deposito_id}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="ean">EAN</Label>
              <div className="flex gap-2">
                <Input
                  id="ean"
                  value={data.ean || ''}
                  onChange={(e) => onChange('ean', e.target.value)}
                  disabled={isReadOnly}
                  placeholder="Código EAN-13"
                />
                {!isReadOnly && (
                  <CodeGeneratorButton
                    type="ean13"
                    onCodeGenerated={(code) => onChange('ean', code)}
                  />
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="ean2">EAN2</Label>
              <div className="flex gap-2">
                <Input
                  id="ean2"
                  value={data.ean2 || ''}
                  onChange={(e) => onChange('ean2', e.target.value)}
                  disabled={isReadOnly}
                  placeholder="Código EAN-8"
                />
                {!isReadOnly && (
                  <CodeGeneratorButton
                    type="ean8"
                    onCodeGenerated={(code) => onChange('ean2', code)}
                  />
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="quantidade_por_caixa">Quantidade por Caixa</Label>
              <Input
                id="quantidade_por_caixa"
                type="number"
                value={data.quantidade_por_caixa || ''}
                onChange={(e) => onChange('quantidade_por_caixa', parseInt(e.target.value) || undefined)}
                disabled={isReadOnly}
                min="1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="status">Status *</Label>
            <Select
              value={data.status}
              onValueChange={(value) => onChange('status', value)}
              disabled={isReadOnly}
            >
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