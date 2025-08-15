"use client"

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageBar } from '@/components/ui/message-bar'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Shield, Trash2 } from 'lucide-react'
import ModuleViewSelector from './ModuleViewSelector'
import { getUserPermissions, updateUserPermissions, type UserPermissionUpdate } from '@/lib/supabase/permissions'
import type { User } from '@/types/user'

const permissionSchema = z.object({
  customPermissions: z.string().optional(),
  restrictions: z.string().optional()
})

interface UserPermissionFormProps {
  user: User
  currentUser: User
  onSuccess?: () => void
  onCancel?: () => void
}

type FormData = z.infer<typeof permissionSchema>

export default function UserPermissionForm({ 
  user, 
  currentUser, 
  onSuccess, 
  onCancel 
}: UserPermissionFormProps) {
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  // Estado para permissões
  const [selectedModules, setSelectedModules] = useState<string[]>([])
  const [selectedViews, setSelectedViews] = useState<string[]>([])
  const [hasAllAccess, setHasAllAccess] = useState(false)
  const [currentPermissions, setCurrentPermissions] = useState<UserPermissionUpdate | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<FormData>({
    resolver: zodResolver(permissionSchema),
    defaultValues: {
      customPermissions: '',
      restrictions: ''
    }
  })

  useEffect(() => {
    loadUserPermissions()
  }, [user.id])

  const loadUserPermissions = async () => {
    setLoadingData(true)
    setError(null)

    try {
      const { data, error: fetchError } = await getUserPermissions(user.id)
      
      if (fetchError) {
        setError(fetchError)
      } else if (data) {
        setCurrentPermissions(data)
        
        // Verificar se tem acesso total
        const hasAll = data.modules.includes('*') || data.permissions.includes('*')
        setHasAllAccess(hasAll)
        
        if (!hasAll) {
          setSelectedModules(data.modules.filter(m => m !== '*'))
          setSelectedViews(data.permissions.filter(p => p !== '*' && !p.includes('.')))
        }

        // Preencher campos de texto
        const customPerms = data.permissions.filter(p => p !== '*' && p.includes('.')).join(', ')
        setValue('customPermissions', customPerms)
        
        if (data.restrictions && Object.keys(data.restrictions).length > 0) {
          setValue('restrictions', JSON.stringify(data.restrictions, null, 2))
        }
      }
    } catch (err) {
      setError('Erro ao carregar permissões do usuário')
    } finally {
      setLoadingData(false)
    }
  }

  const handleFormSubmit = async (formData: FormData) => {
    setLoading(true)
    setError(null)

    try {
      // Preparar dados de permissões
      let modules = selectedModules
      let permissions = selectedViews

      if (hasAllAccess) {
        modules = ['*']
        permissions = ['*']
      } else {
        // Adicionar permissões customizadas
        if (formData.customPermissions) {
          const customPerms = formData.customPermissions
            .split(',')
            .map(p => p.trim())
            .filter(p => p.length > 0)
          permissions = [...permissions, ...customPerms]
        }
      }

      // Processar restrições
      let restrictions = {}
      if (formData.restrictions) {
        try {
          restrictions = JSON.parse(formData.restrictions)
        } catch {
          setError('JSON de restrições inválido')
          return
        }
      }

      const updateData: UserPermissionUpdate = {
        modules,
        permissions,
        restrictions
      }

      const { success: updateSuccess, error: updateError } = await updateUserPermissions(
        user.id,
        updateData,
        currentUser.id
      )

      if (updateError) {
        setError(updateError)
      } else {
        setSuccess(true)
        setTimeout(() => {
          setSuccess(false)
          onSuccess?.()
        }, 2000)
      }
    } catch (err) {
      setError('Erro interno do servidor')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async () => {
    setHasAllAccess(true)
    setSelectedModules(['*'])
    setSelectedViews(['*'])
    setValue('customPermissions', '')
    setValue('restrictions', '')
  }

  if (loadingData) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando permissões...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <MessageBar variant="destructive" title="Erro">
          {error}
        </MessageBar>
      )}

      {success && (
        <MessageBar variant="success" title="Sucesso">
          Permissões atualizadas com sucesso!
        </MessageBar>
      )}

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Informações do Usuário */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Permissões de {user.nome_completo}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <Label className="text-muted-foreground">Login</Label>
                <p className="font-medium">{user.login}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Role</Label>
                <p className="font-medium capitalize">{user.role}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Status</Label>
                <p className="font-medium capitalize">{user.status}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seletor de Módulos e Views */}
        <ModuleViewSelector
          selectedModules={selectedModules}
          selectedViews={selectedViews}
          onModulesChange={setSelectedModules}
          onViewsChange={setSelectedViews}
          hasAllAccess={hasAllAccess}
          onAllAccessChange={setHasAllAccess}
        />

        {/* Permissões Customizadas */}
        {!hasAllAccess && (
          <Card>
            <CardHeader>
              <CardTitle>Permissões Customizadas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="customPermissions">
                  Permissões Específicas
                </Label>
                <Input
                  id="customPermissions"
                  {...register('customPermissions')}
                  placeholder="Ex: users.create, reports.export (separadas por vírgula)"
                  className={errors.customPermissions ? 'border-destructive' : ''}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Digite permissões específicas separadas por vírgula. Ex: users.create, reports.view
                </p>
                {errors.customPermissions && (
                  <p className="text-sm text-destructive mt-1">{errors.customPermissions.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="restrictions">
                  Restrições (JSON)
                </Label>
                <Textarea
                  id="restrictions"
                  {...register('restrictions')}
                  placeholder='{"maxUsers": 10, "allowedIPs": ["192.168.1.1"]}'
                  rows={4}
                  className={errors.restrictions ? 'border-destructive' : ''}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Configure restrições específicas em formato JSON
                </p>
                {errors.restrictions && (
                  <p className="text-sm text-destructive mt-1">{errors.restrictions.message}</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Permissões Atuais */}
        {currentPermissions && (
          <Card>
            <CardHeader>
              <CardTitle>Permissões Atuais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div>
                  <Label className="text-muted-foreground">Módulos:</Label>
                  <p>{currentPermissions.modules.join(', ')}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Permissões:</Label>
                  <p>{currentPermissions.permissions.join(', ')}</p>
                </div>
                {Object.keys(currentPermissions.restrictions).length > 0 && (
                  <div>
                    <Label className="text-muted-foreground">Restrições:</Label>
                    <pre className="bg-muted p-2 rounded text-xs overflow-auto">
                      {JSON.stringify(currentPermissions.restrictions, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Ações */}
        <div className="flex gap-4 justify-end">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Acesso Total
          </Button>

          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar Permissões
          </Button>
        </div>
      </form>
    </div>
  )
}