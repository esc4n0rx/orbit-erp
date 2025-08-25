// components/modules/suppliers/SupplierPermissionCheck.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle } from 'lucide-react'
import { checkUserPermission } from '@/lib/utils/permissions'
import type { User } from '@/types/user'

interface SupplierPermissionCheckProps {
  currentUser: User
  requiredPermission: 'create' | 'read' | 'update' | 'delete'
  children: React.ReactNode
}

const PERMISSION_MESSAGES = {
  create: 'Você não tem permissão para criar fornecedores',
  read: 'Você não tem permissão para visualizar fornecedores', 
  update: 'Você não tem permissão para editar fornecedores',
  delete: 'Você não tem permissão para excluir fornecedores'
}

export default function SupplierPermissionCheck({ 
  currentUser, 
  requiredPermission, 
  children 
}: SupplierPermissionCheckProps) {
  const hasPermission = checkUserPermission(currentUser, ['comercial'], [requiredPermission])

  if (!hasPermission) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="h-5 w-5" />
            Acesso Negado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {PERMISSION_MESSAGES[requiredPermission]}. Entre em contato com o administrador do sistema para solicitar acesso.
          </p>
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Informações de Acesso:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>Usuário:</strong> {currentUser.nome_completo} ({currentUser.email})</li>
              <li>• <strong>Role:</strong> {currentUser.role}</li>
              <li>• <strong>Permissão necessária:</strong> {requiredPermission} em fornecedores</li>
              <li>• <strong>Módulo:</strong> Comercial</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    )
  }

  return <>{children}</>
}