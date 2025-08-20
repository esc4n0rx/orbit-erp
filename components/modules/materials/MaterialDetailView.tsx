"use client"

import { useState, useEffect } from 'react'
import { Search, ArrowLeft, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageBar } from '@/components/ui/message-bar'
import MaterialViewForm from './MaterialViewForm'
import MaterialList from './MaterialList'
import MaterialPermissionCheck from './MaterialPermissionCheck'
import { useMaterialOperations } from '@/hooks/useMaterialOperations'
import { User } from '@/types/user'
import type { Material, MaterialSearchCriteria } from '@/types/material-management'

interface MaterialDetailViewProps {
  currentUser: User
  onSuccess?: () => void
}

export default function MaterialDetailView({ currentUser, onSuccess }: MaterialDetailViewProps) {
  const [step, setStep] = useState<'search' | 'view'>('search')
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null)
  const [materials, setMaterials] = useState<Material[]>([])
  const [searchError, setSearchError] = useState<string | null>(null)
  
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
    if (action === 'view') {
      setSelectedMaterial(material)
      setStep('view')
    }
  }

  const handleBack = () => {
    setStep('search')
    setSelectedMaterial(null)
  }

  return (
    <MaterialPermissionCheck 
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
                <span>Visualizar Material</span>
              </CardTitle>
              <div className="text-sm text-muted-foreground">
                View: cr003
              </div>
            </div>
          </CardHeader>
        </Card>

        {step === 'search' ? (
          <MaterialList
            materials={materials}
            loading={loading}
            error={searchError}
            onSearch={handleSearch}
            onSelectMaterial={handleSelectMaterial}
            showActions={false}
            showViewAction={true}
          />
        ) : (
          selectedMaterial && (
            <MaterialViewForm
              material={selectedMaterial}
              onBack={handleBack}
            />
          )
        )}
      </div>
    </MaterialPermissionCheck>
  )
}