"use client"

import { useState, useEffect } from 'react'
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
import { Badge } from '@/components/ui/badge'
import { Loader2, X } from 'lucide-react'
import { getAllCategories } from '@/lib/supabase/materials'
import type { Deposit, CreateDepositData, UpdateDepositData, Category } from '@/types/material'

const depositSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  codigo: z.string().min(1, 'Código é obrigatório'),
  endereco: z.string().optional(),
  responsavel: z.string().optional(),
  capacidade_maxima: z.number().optional(),
  controle_zonas: z.string().optional(),
  status: z.enum(['active', 'inactive']),
  permite_transferencia: z.boolean(),
  observacoes: z.string().optional()
})

interface DepositFormProps {
  mode: 'create' | 'edit' | 'view'
  deposit?: Deposit
  onSubmit: (data: CreateDepositData | UpdateDepositData) => Promise<void>
  loading?: boolean
  error?: string | null
}

type FormData = z.infer<typeof depositSchema>

export default function DepositForm({ mode, deposit, onSubmit, loading = false, error }: DepositFormProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<FormData>({
    resolver: zodResolver(depositSchema),
    defaultValues: deposit ? {
      nome: deposit.nome,
      codigo: deposit.codigo,
      endereco: deposit.endereco || '',
      responsavel: deposit.responsavel || '',
      capacidade_maxima: deposit.capacidade_maxima || undefined,
      controle_zonas: deposit.controle_zonas || '',
      status: deposit.status,
      permite_transferencia: deposit.permite_transferencia,
      observacoes: deposit.observacoes || ''
    } : {
      permite_transferencia: true,
      status: 'active'
    }
  })

  useEffect(() => {
    loadCategories()
    if (deposit) {
      setSelectedCategories(deposit.tipos_produtos_aceitos || [])
    }
  }, [deposit])

  const loadCategories = async () => {
    try {
      const { data } = await getAllCategories()
      setCategories(data || [])
    } catch (err) {
      console.error('Erro ao carregar categorias:', err)
    } finally {
      setLoadingCategories(false)
    }
  }

  const isReadOnly = mode === 'view'

  const handleFormSubmit = async (data: FormData) => {
    if (isReadOnly) return

    const submitData = {
      nome: data.nome,
      codigo: data.codigo,
      endereco: data.endereco || undefined,
      responsavel: data.responsavel || undefined,
      capacidade_maxima: data.capacidade_maxima || undefined,
      tipos_produtos_aceitos: selectedCategories,
      controle_zonas: data.controle_zonas || undefined,
      status: data.status,
      permite_transferencia: data.permite_transferencia,
      observacoes: data.observacoes || undefined
    }

    await onSubmit(submitData)
  }

  const handleCategoryToggle = (categoryId: string) => {
    if (isReadOnly) return

    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const removeCategory = (categoryId: string) => {
    if (isReadOnly) return
    setSelectedCategories(prev => prev.filter(id => id !== categoryId))
  }

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
                <Label htmlFor="nome">Nome do Depósito *</Label>
                <Input
                  id="nome"
                  {...register('nome')}
                  disabled={isReadOnly}
                  className={errors.nome ? 'border-destructive' : ''}
                />
                {errors.nome && (
                  <p className="text-sm text-destructive mt-1">{errors.nome.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="codigo">Código *</Label>
                <Input
                  id="codigo"
                  {...register('codigo')}
                  disabled={isReadOnly}
                  className={errors.codigo ? 'border-destructive' : ''}
                />
                {errors.codigo && (
                  <p className="text-sm text-destructive mt-1">{errors.codigo.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="endereco">Endereço/Localização</Label>
                <Input
                  id="endereco"
                  {...register('endereco')}
                  disabled={isReadOnly}
                />
              </div>

              <div>
                <Label htmlFor="responsavel">Responsável</Label>
                <Input
                  id="responsavel"
                  {...register('responsavel')}
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
                <Label htmlFor="capacidade_maxima">Capacidade Máxima</Label>
                <Input
                  id="capacidade_maxima"
                  type="number"
                  {...register('capacidade_maxima', { valueAsNumber: true })}
                  disabled={isReadOnly}
                  placeholder="Ex: 1000"
                />
              </div>

              <div>
                <Label htmlFor="controle_zonas">Controle de Zonas/Ruas/Prateleiras</Label>
                <Input
                  id="controle_zonas"
                  {...register('controle_zonas')}
                  disabled={isReadOnly}
                  placeholder="Ex: Zona A, Rua 1, Prateleira 1-10"
                />
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

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="permite_transferencia"
                  checked={watch('permite_transferencia')}
                  onCheckedChange={(checked) => setValue('permite_transferencia', checked as boolean)}
                  disabled={isReadOnly}
                />
                <label htmlFor="permite_transferencia" className="text-sm font-medium">
                  Permite Transferência Interna
                </label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tipos de Produtos Aceitos */}
        <Card>
          <CardHeader>
            <CardTitle>Tipos de Produtos Aceitos</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingCategories ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Carregando categorias...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {!isReadOnly && (
                  <div>
                    <Label>Selecionar Categorias</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2 max-h-40 overflow-y-auto border rounded p-2">
                      {categories.map((category) => (
                        <div
                          key={category.id}
                          className={`p-2 border rounded cursor-pointer transition-colors ${
                            selectedCategories.includes(category.id)
                              ? 'bg-primary/10 border-primary'
                              : 'hover:bg-muted'
                          }`}
                          onClick={() => handleCategoryToggle(category.id)}
                        >
                          <p className="text-sm font-medium">{category.categoria}</p>
                          <p className="text-xs text-muted-foreground">{category.grupo_mercadoria}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedCategories.length > 0 && (
                  <div>
                    <Label>Categorias Selecionadas</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedCategories.map((categoryId) => {
                        const category = categories.find(c => c.id === categoryId)
                        return (
                          <Badge key={categoryId} variant="secondary" className="flex items-center gap-1">
                            {category?.categoria || categoryId}
                            {!isReadOnly && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                                onClick={() => removeCategory(categoryId)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            )}
                          </Badge>
                        )
                      })}
                    </div>
                  </div>
                )}

                {selectedCategories.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Nenhuma categoria selecionada. Deixe vazio para aceitar todos os tipos de produtos.
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Observações */}
        <Card>
          <CardHeader>
            <CardTitle>Observações</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              {...register('observacoes')}
              placeholder="Observações adicionais sobre o depósito..."
              rows={4}
              disabled={isReadOnly}
            />
          </CardContent>
        </Card>

        {!isReadOnly && (
          <div className="flex gap-4 justify-end">
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === 'create' ? 'Criar Depósito' : 'Salvar Alterações'}
            </Button>
          </div>
        )}
      </form>
    </div>
  )
}