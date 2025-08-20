"use client"

import { useState, useEffect } from 'react'
import { Search, ArrowLeft, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageBar } from '@/components/ui/message-bar'
import MaterialEditForm from './MaterialEditForm'
import MaterialList from './MaterialList'
import MaterialPermissionCheck from './MaterialPermissionCheck'
import { useMaterialOperations } from '@/hooks/useMaterialOperations'
import { User } from '@/types/user'
import type { Material, MaterialSearchCriteria } from '@/types/material-management'

interface MaterialEditViewProps {
  currentUser: User
  onSuccess?: () => void
}

export default function MaterialEditView({ currentUser, onSuccess }: MaterialEditViewProps) {
  const [step, setStep] = useState<'search' | 'edit'>('search')
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null)
  const [materials, setMaterials] = useState<Material[]>([])
  const [searchError, setSearchError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  const { searchMaterials, loading } = useMaterialOperations()

  const handleSearch = async (criteria: MaterialSearchCriteria) => {
    setSearchError(null)

    try {
      const { data, error } = await searchMaterials(criteria)
      
      if (error) {
        setSearchError(error)
        setMaterials([])
      } else {
        setMaterials(data || [])
      }
    } catch (err) {
      setSearchError('Erro interno do servidor')
      setMaterials([])
    }
  }

  const handleSelectMaterial = (material: Material, action: 'view' | 'edit') => {
    if (action === 'edit') {
      setSelectedMaterial(material)
      setStep('edit')
    }
  }

  const handleUpdateSuccess = (updatedMaterial: Material) => {
    setSuccess(true)
    setSelectedMaterial(updatedMaterial)
    setTimeout(() => {
      setSuccess(false)
      setStep('search')
      onSuccess?.()
    }, 2000)
  }

  const handleBack = () => {
    setStep('search')
    setSelectedMaterial(null)
  }

  return (
    <MaterialPermissionCheck 
      currentUser={currentUser} 
      requiredPermission="update"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                {step === 'edit' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBack}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                )}
                <Edit className="h-5 w-5" />
                <span>Editar Material</span>
              </CardTitle>
              <div className="text-sm text-muted-foreground">
                View: cr002
              </div>
            </div>
          </CardHeader>
        </Card>

        {success && (
          <MessageBar variant="success" title="Sucesso">
            Material atualizado com sucesso!
          </MessageBar>
        )}

        {step === 'search' ? (
          <MaterialList
            materials={materials}
            loading={loading}
            error={searchError}
            onSearch={handleSearch}
            onSelectMaterial={handleSelectMaterial}
            showActions={true}
          />
        ) : (
          selectedMaterial && (
            <MaterialEditForm
              material={selectedMaterial}
              onSuccess={handleUpdateSuccess}
              onCancel={handleBack}
              updatedBy={currentUser.id}
            />
          )
        )}
      </div>
    </MaterialPermissionCheck>
  )
}