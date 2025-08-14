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
import { Loader2 } from 'lucide-react'
import type { User, CreateUserData, UpdateUserData, CreateUserFormData, UpdateUserFormData } from '@/types/user'

const createUserSchema = z.object({
  nome_completo: z.string().min(3, 'Nome completo deve ter pelo menos 3 caracteres'),
  login: z.string().min(3, 'Nome de usuário deve ter pelo menos 3 caracteres').regex(/^[a-zA-Z0-9_]+$/, 'Nome de usuário deve conter apenas letras, números e underscore'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  cpf: z.string().regex(/^\d{11}$/, 'CPF deve conter 11 dígitos'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  endereco: z.string().min(5, 'Endereço deve ter pelo menos 5 caracteres'),
  funcao: z.string().min(2, 'Função deve ter pelo menos 2 caracteres'),
  role: z.enum(['admin', 'user', 'support']),
  status: z.enum(['active', 'inactive'])
})

const updateUserSchema = z.object({
  nome_completo: z.string().min(3, 'Nome completo deve ter pelo menos 3 caracteres'),
  login: z.string().min(3, 'Nome de usuário deve ter pelo menos 3 caracteres').regex(/^[a-zA-Z0-9_]+$/, 'Nome de usuário deve conter apenas letras, números e underscore'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  cpf: z.string().regex(/^\d{11}$/, 'CPF deve conter 11 dígitos'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres').optional().or(z.literal('')),
  endereco: z.string().min(5, 'Endereço deve ter pelo menos 5 caracteres'),
  funcao: z.string().min(2, 'Função deve ter pelo menos 2 caracteres'),
  role: z.enum(['admin', 'user', 'support']),
  status: z.enum(['active', 'inactive'])
})

interface UserFormProps {
  mode: 'create' | 'edit' | 'view'
  user?: User
  onSubmit: (data: CreateUserData | UpdateUserData) => Promise<void>
  loading?: boolean
  error?: string | null
}

export default function UserForm({ mode, user, onSubmit, loading = false, error }: UserFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  
  // Tipagem condicional baseada no mode
  const isCreateMode = mode === 'create'
  const schema = isCreateMode ? createUserSchema : updateUserSchema
  
  type FormData = typeof isCreateMode extends true ? CreateUserFormData : UpdateUserFormData
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: user ? {
      nome_completo: user.nome_completo,
      login: user.login,
      email: user.email || '',
      cpf: user.cpf,
      password: '',
      endereco: user.endereco,
      funcao: user.funcao,
      role: user.role as 'admin' | 'user' | 'support',
      status: user.status
    } as FormData : {
      status: 'active'
    } as FormData
  })

  const isReadOnly = mode === 'view'

  const handleFormSubmit = async (data: FormData) => {
    if (isReadOnly) return

    if (mode === 'create') {
      const submitData: CreateUserData = {
        nome_completo: data.nome_completo,
        login: data.login,
        email: data.email || undefined,
        cpf: data.cpf,
        password: (data as CreateUserFormData).password,
        endereco: data.endereco,
        funcao: data.funcao,
        role: data.role,
        status: data.status
      }
      await onSubmit(submitData)
    } else if (mode === 'edit') {
      const updateData = data as UpdateUserFormData
      const submitData: UpdateUserData = {
        nome_completo: updateData.nome_completo,
        login: updateData.login,
        email: updateData.email || undefined,
        cpf: updateData.cpf,
        endereco: updateData.endereco,
        funcao: updateData.funcao,
        role: updateData.role,
        status: updateData.status
      }
      
      // Só incluir password se foi fornecida
      if (updateData.password && updateData.password.trim() !== '') {
        submitData.password = updateData.password
      }
      
      await onSubmit(submitData)
    }
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
          {/* Dados Pessoais */}
          <Card>
            <CardHeader>
              <CardTitle>Dados Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="nome_completo">Nome Completo *</Label>
                <Input
                  id="nome_completo"
                  {...register('nome_completo')}
                  disabled={isReadOnly}
                  className={errors.nome_completo ? 'border-destructive' : ''}
                />
                {errors.nome_completo && (
                  <p className="text-sm text-destructive mt-1">{errors.nome_completo.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="cpf">CPF *</Label>
                <Input
                  id="cpf"
                  {...register('cpf')}
                  disabled={isReadOnly}
                  placeholder="Apenas números"
                  className={errors.cpf ? 'border-destructive' : ''}
                />
                {errors.cpf && (
                  <p className="text-sm text-destructive mt-1">{errors.cpf.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  disabled={isReadOnly}
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="endereco">Endereço *</Label>
                <Input
                  id="endereco"
                  {...register('endereco')}
                  disabled={isReadOnly}
                  className={errors.endereco ? 'border-destructive' : ''}
                />
                {errors.endereco && (
                  <p className="text-sm text-destructive mt-1">{errors.endereco.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="funcao">Função *</Label>
                <Input
                  id="funcao"
                  {...register('funcao')}
                  disabled={isReadOnly}
                  className={errors.funcao ? 'border-destructive' : ''}
                />
                {errors.funcao && (
                  <p className="text-sm text-destructive mt-1">{errors.funcao.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Dados do Sistema */}
          <Card>
            <CardHeader>
              <CardTitle>Dados do Sistema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="login">Nome de Usuário *</Label>
                <Input
                  id="login"
                  {...register('login')}
                  disabled={isReadOnly}
                  className={errors.login ? 'border-destructive' : ''}
                />
                {errors.login && (
                  <p className="text-sm text-destructive mt-1">{errors.login.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="password">
                  {mode === 'create' ? 'Senha *' : 'Nova Senha'}
                </Label>
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  disabled={isReadOnly}
                  placeholder={mode === 'edit' ? 'Deixe em branco para manter a atual' : ''}
                  className={errors.password ? 'border-destructive' : ''}
                />
                {!isReadOnly && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="mt-1"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? 'Ocultar' : 'Mostrar'} senha
                  </Button>
                )}
                {errors.password && (
                  <p className="text-sm text-destructive mt-1">{errors.password.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="role">Role *</Label>
                <Select
                  value={watch('role')}
                  onValueChange={(value) => setValue('role', value as 'admin' | 'user' | 'support')}
                  disabled={isReadOnly}
                >
                  <SelectTrigger className={errors.role ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Selecione uma role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="user">Usuário</SelectItem>
                    <SelectItem value="support">Suporte</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && (
                  <p className="text-sm text-destructive mt-1">{errors.role.message}</p>
                )}
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

              {/* Perfil Info */}
              {user && (
                <div>
                  <Label>Perfil Atual</Label>
                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-sm">
                      <strong>Módulos:</strong> {user.perfil.modules.join(', ')}
                    </p>
                    <p className="text-sm">
                      <strong>Permissões:</strong> {user.perfil.permissions.join(', ')}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {!isReadOnly && (
          <div className="flex gap-4 justify-end">
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === 'create' ? 'Criar Usuário' : 'Salvar Alterações'}
            </Button>
          </div>
        )}
      </form>
    </div>
  )
}