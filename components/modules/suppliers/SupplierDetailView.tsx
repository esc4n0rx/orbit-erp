// components/modules/suppliers/SupplierDetailView.tsx
"use client"

import { useState, useEffect } from 'react'
import { Eye, ArrowLeft, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageBar } from '@/components/ui/message-bar'
import SupplierViewForm from './SupplierViewForm'
import SupplierList from './SupplierList'
import SupplierPermissionCheck from './SupplierPermissionCheck'
import { useSupplierOperations } from '@/hooks/useSupplierOperations'
import type { User } from '@/types/user'
import type { Supplier, SupplierSearchCriteria } from '@/types/supplier'

interface SupplierDetailViewProps {
  currentUser: User
  onOpenView?: (viewId: string, title: string) => void
}

export default function SupplierDetailView({ currentUser, onOpenView }: SupplierDetailViewProps) {
  const [step, setStep] = useState<'search' | 'view'>('search')
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [searchError, setSearchError] = useState<string | null>(null)
  
  const { searchSuppliers, loading } = useSupplierOperations()

  // Buscar todos os fornecedores inicialmente
  useEffect(() => {
    handleSearch({})
  }, [])

  const handleSearch = async (criteria: SupplierSearchCriteria) => {
    setSearchError(null)

    try {
      const { data, error } = await searchSuppliers(criteria)
      
      if (error) {
        setSearchError(error)
        setSuppliers([])
      } else {
        setSuppliers(data || [])
      }
    } catch (err) {
      setSearchError('Erro interno do servidor')
      setSuppliers([])
    }
  }

  const handleSelectSupplier = (supplier: Supplier, action: 'view' | 'edit') => {
    if (action === 'view') {
      setSelectedSupplier(supplier)
      setStep('view')
    } else if (action === 'edit') {
      // Redirecionar para view de edição
      onOpenView?.('fm002', `Editar Fornecedor: ${supplier.razao_social}`)
    }
  }

  const handleEdit = () => {
    if (selectedSupplier) {
      onOpenView?.('fm002', `Editar Fornecedor: ${selectedSupplier.razao_social}`)
    }
  }

  const handleBack = () => {
    setStep('search')
    setSelectedSupplier(null)
  }

  const canEdit = ['master', 'admin', 'comercial'].includes(currentUser.role)

  return (
    <SupplierPermissionCheck 
      currentUser={currentUser} 
      requiredPermission="read"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                {step === 'view' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBack}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                )}
                <Eye className="h-5 w-5" />
                <span>
                  {step === 'search' ? 'Visualizar Fornecedor' : `Fornecedor: ${selectedSupplier?.razao_social}`}
                </span>
              </CardTitle>
              <div className="flex items-center gap-2">
                <div className="text-sm text-muted-foreground">
                  View: fm003
                </div>
                {step === 'view' && canEdit && (
                  <Button
                    size="sm"
                    onClick={handleEdit}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {step === 'search' ? (
          <SupplierList
            suppliers={suppliers}
            loading={loading}
            error={searchError}
            onSearch={handleSearch}
            onSelectSupplier={handleSelectSupplier}
            showActions={true}
          />
        ) : (
          selectedSupplier && (
            <SupplierViewForm 
              supplier={selectedSupplier} 
              currentUserId={currentUser.id}
            />
          )
        )}
      </div>
    </SupplierPermissionCheck>
  )
}