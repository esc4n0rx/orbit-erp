"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageBar } from '@/components/ui/message-bar'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Loader2 } from 'lucide-react'
import type { Category, CreateCategoryData, UpdateCategoryData } from '@/types/material'

const categorySchema = z.object({
  codigo_interno: z.string().min(1, 'Código interno é obrigatório'),
  grupo_mercadoria: z.string().min(1, 'Grupo de mercadoria é obrigatório'),
  categoria: z.string().min(1, 'Categoria é obrigatória'),
  subcategoria: z.string().optional(),
  secao: z.string().optional(),
  descricao_detalhada: z.string().optional(),
  unidade_padrao: z.string().optional(),
  controle_lote: z.boolean(),
  controle_serie: z.boolean(),
  status: z.enum(['active', 'inactive'])
})

interface CategoryFormProps {
  mode: 'create' | 'edit' | 'view'
  category?: Category
  onSubmit: (data: CreateCategoryData | UpdateCategoryData) => Promise<void>
  loading?: boolean
  error?: string | null
}

type FormData = z.infer<typeof categorySchema>

export default function CategoryForm({ mode, category, onSubmit, loading = false, error }: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<FormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: category ? {
      codigo_interno: category.codigo_interno,
      grupo_mercadoria: category.grupo_mercadoria,
      categoria: category.categoria,
      subcategoria: category.subcategoria || '',
      secao: category.secao || '',
      descricao_detalhada: category.descricao_detalhada || '',
      unidade_padrao: category.unidade_padrao || '',
      controle_lote: category.controle_lote,
      controle_serie: category.controle_serie,
      status: category.status
    } : {
      controle_lote: false,
      controle_serie: false,
      status: 'active'
    }
  })

  const isReadOnly = mode === 'view'

  const handleFormSubmit = async (data: FormData) => {
    if (isReadOnly) return

    const submitData = {
      codigo_interno: data.codigo_interno,
      grupo_mercadoria: data.grupo_mercadoria,
      categoria: data.categoria,
      subcategoria: data.subcategoria || undefined,
      secao: data.secao || undefined,
      descricao_detalhada: data.descricao_detalhada || undefined,
      unidade_padrao: data.unidade_padrao === 'none' ? undefined : data.unidade_padrao,
      controle_lote: data.controle_lote,
      controle_serie: data.controle_serie,
      status: data.status
    }

    await onSubmit(submitData)
  }

  const unidadesPadrao = [
    'unidade', 'kg', 'g', 'ton', 'litro', 'ml', 'm', 'cm', 'mm', 'm²', 'm³', 'caixa', 'pacote', 'dúzia'
  ]

  return (
    <div className="space-y-6">
      {error && (
        <MessageBar variant="destructive" title="Erro">
          {error}
        </MessageBar>
      )}

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="codigo_interno">Código Interno *</Label>
                <Input
                  id="codigo_interno"
                  {...register('codigo_interno')}
                  disabled={isReadOnly}
                  className={errors.codigo_interno ? 'border-destructive' : ''}
                />
                {errors.codigo_interno && (
                  <p className="text-sm text-destructive mt-1">{errors.codigo_interno.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="grupo_mercadoria">Grupo de Mercadoria *</Label>
                <Input
                  id="grupo_mercadoria"
                  {...register('grupo_mercadoria')}
                  disabled={isReadOnly}
                  className={errors.grupo_mercadoria ? 'border-destructive' : ''}
                />
                {errors.grupo_mercadoria && (
                  <p className="text-sm text-destructive mt-1">{errors.grupo_mercadoria.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="categoria">Categoria *</Label>
                <Input
                  id="categoria"
                  {...register('categoria')}
                  disabled={isReadOnly}
                  className={errors.categoria ? 'border-destructive' : ''}
                />
                {errors.categoria && (
                  <p className="text-sm text-destructive mt-1">{errors.categoria.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="subcategoria">Subcategoria</Label>
                <Input
                  id="subcategoria"
                  {...register('subcategoria')}
                  disabled={isReadOnly}
                />
              </div>

              <div>
                <Label htmlFor="secao">Seção</Label>
                <Input
                  id="secao"
                  {...register('secao')}
                  disabled={isReadOnly}
                />
              </div>
            </CardContent>
          </Card>

          {/* Configurações */}
          <Card>
            <CardHeader>
              <CardTitle>Configurações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="unidade_padrao">Unidade Padrão</Label>
                <Select
                  value={watch('unidade_padrao') || 'none'}
                  onValueChange={(value) => setValue('unidade_padrao', value === 'none' ? '' : value)}
                  disabled={isReadOnly}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma unidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhuma</SelectItem>
                    {unidadesPadrao.map((unidade) => (
                      <SelectItem key={unidade} value={unidade}>
                        {unidade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={watch('status')}
                  onValueChange={(value) => setValue('status', value as 'active' | 'inactive')}
                  disabled={isReadOnly}
                >
                  <SelectTrigger className={errors.status ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Selecione um status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-sm text-destructive mt-1">{errors.status.message}</p>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="controle_lote"
                    checked={watch('controle_lote')}
                    onCheckedChange={(checked) => setValue('controle_lote', checked as boolean)}
                    disabled={isReadOnly}
                  />
                  <label htmlFor="controle_lote" className="text-sm font-medium">
                    Controle por Lote/Validade
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="controle_serie"
                    checked={watch('controle_serie')}
                    onCheckedChange={(checked) => setValue('controle_serie', checked as boolean)}
                    disabled={isReadOnly}
                  />
                  <label htmlFor="controle_serie" className="text-sm font-medium">
                    Controle por Número de Série
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Descrição Detalhada */}
        <Card>
          <CardHeader>
            <CardTitle>Descrição Detalhada</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              {...register('descricao_detalhada')}
              placeholder="Descrição detalhada da categoria e sua finalidade..."
              rows={4}
              disabled={isReadOnly}
            />
          </CardContent>
        </Card>

        {!isReadOnly && (
          <div className="flex gap-4 justify-end">
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === 'create' ? 'Criar Categoria' : 'Salvar Alterações'}
            </Button>
          </div>
        )}
      </form>
    </div>
  )
}