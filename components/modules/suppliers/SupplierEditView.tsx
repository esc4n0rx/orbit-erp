// components/modules/suppliers/SupplierEditView.tsx
"use client"

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageBar } from '@/components/ui/message-bar'
import { Loader2, Edit, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import SupplierEditForm from './SupplierEditForm'
import SupplierPermissionCheck from './SupplierPermissionCheck'
import { useSupplierOperations } from '@/hooks/useSupplierOperations'
import type { User } from '@/types/user'
import type { Supplier } from '@/types/supplier'

interface SupplierEditViewProps {
  currentUser: User
  onOpenView?: (viewId: string, title: string) => void
}

export default function SupplierEditView({ currentUser, onOpenView }: SupplierEditViewProps) {
  const searchParams = useSearchParams()
  const supplierId = searchParams.get('id')
  
  const { getSupplier, loading, error } = useSupplierOperations()
  const [supplier, setSupplier] = useState<Supplier | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    if (supplierId) {
      loadSupplier()
    } else {
      setLoadError('ID do fornecedor não fornecido')
    }
  }, [supplierId])

  const loadSupplier = async () => {
    if (!supplierId) return

    const { data, error } = await getSupplier(supplierId)
    
    if (error) {
      setLoadError(error)
    } else if (data) {
      setSupplier(data)
    }
  }

  const handleSuccess = (updatedSupplier: Supplier) => {
    // Redirecionar para view de visualização
    onOpenView?.(`fm003?id=${updatedSupplier.id}`, `Visualizar Fornecedor: ${updatedSupplier.razao_social}`)
  }

  const handleCancel = () => {
    if (supplier) {
      // Voltar para visualização
      onOpenView?.(`fm003?id=${supplier.id}`, `Visualizar Fornecedor: ${supplier.razao_social}`)
    } else {
      // Voltar ao home
      onOpenView?.('home', 'Home')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">Carregando dados do fornecedor...</p>
        </div>
      </div>
    )
  }

  if (loadError || error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5" />
                Editar Fornecedor
              </CardTitle>
              <div className="text-sm text-muted-foreground">
                View: fm002
              </div>
            </div>
          </CardHeader>
        </Card>
        <MessageBar variant="destructive">{error}</MessageBar>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                Não foi possível carregar os dados do fornecedor.
              </p>
              <Button variant="outline" onClick={() => onOpenView?.('home', 'Home')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Início
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!supplier) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5" />
                Editar Fornecedor
              </CardTitle>
              <div className="text-sm text-muted-foreground">
                View: fm002
              </div>
            </div>
          </CardHeader>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                Fornecedor não encontrado.
              </p>
              <Button variant="outline" onClick={() => onOpenView?.('home', 'Home')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Início
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <SupplierPermissionCheck 
      currentUser={currentUser} 
      requiredPermission="update"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5" />
                Editar Fornecedor: {supplier.razao_social}
              </CardTitle>
              <div className="text-sm text-muted-foreground">
                View: fm002
              </div>
            </div>
          </CardHeader>
        </Card>

        <SupplierEditForm
          supplier={supplier}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
          updatedBy={currentUser.id}
        />
      </div>
    </SupplierPermissionCheck>
  )
}