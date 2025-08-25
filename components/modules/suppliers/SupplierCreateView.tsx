// components/modules/suppliers/SupplierCreateView.tsx
"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import SupplierCreateForm from './SupplierCreateForm'
import SupplierPermissionCheck from './SupplierPermissionCheck'
import type { User } from '@/types/user'

interface SupplierCreateViewProps {
  currentUser: User
  onOpenView?: (viewId: string, title: string) => void
}

export default function SupplierCreateView({ currentUser, onOpenView }: SupplierCreateViewProps) {
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSuccess = (supplier: any) => {
    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
      // Abrir view de visualização do fornecedor criado
      onOpenView?.(`fm003?id=${supplier.id}`, `Visualizar Fornecedor: ${supplier.razao_social}`)
    }, 2000)
  }

  const handleCancel = () => {
    // Voltar ao home
    onOpenView?.('home', 'Home')
  }

  return (
    <SupplierPermissionCheck 
      currentUser={currentUser} 
      requiredPermission="create"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <span>Cadastrar Fornecedor</span>
              </CardTitle>
              <div className="text-sm text-muted-foreground">
                View: fm001
              </div>
            </div>
          </CardHeader>
        </Card>

        <SupplierCreateForm
          onSuccess={handleSuccess}
          onCancel={handleCancel}
          createdBy={currentUser.id}
        />
      </div>
    </SupplierPermissionCheck>
  )
}