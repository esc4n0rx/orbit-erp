"use client"

import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import MaterialCreateForm from './MaterialCreateForm'
import MaterialPermissionCheck from './MaterialPermissionCheck'
import { User } from '@/types/user'

interface MaterialCreateViewProps {
  currentUser: User
  onSuccess?: () => void
}

export default function MaterialCreateView({ currentUser, onSuccess }: MaterialCreateViewProps) {
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSuccess = (material: any) => {
    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
      onSuccess?.()
    }, 2000)
  }

  return (
    <MaterialPermissionCheck 
      currentUser={currentUser} 
      requiredPermission="create"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <span>Criar Material</span>
              </CardTitle>
              <div className="text-sm text-muted-foreground">
                View: cr001
              </div>
            </div>
          </CardHeader>
        </Card>

        <MaterialCreateForm
          onSuccess={handleSuccess}
          onCancel={onSuccess}
          createdBy={currentUser.id}
        />
      </div>
    </MaterialPermissionCheck>
  )
}