"use client"

import { useState } from 'react'
import { FolderPlus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageBar } from '@/components/ui/message-bar'
import CategoryForm from './CategoryForm'
import MaterialPermissionCheck from './MaterialPermissionCheck'
import { createCategory } from '@/lib/supabase/materials'
import {User} from '@/types/user'
import type {CreateCategoryData, UpdateCategoryData } from '@/types/material'

interface CategoryCreateViewProps {
  currentUser: User
  onSuccess?: () => void
}

export default function CategoryCreateView({ currentUser, onSuccess }: CategoryCreateViewProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleCreateCategory = async (data: CreateCategoryData | UpdateCategoryData) => {
    const categoryData = data as CreateCategoryData

    setLoading(true)
    setError(null)

    try {
      const { data: result, error: createError } = await createCategory(categoryData, currentUser.id)
      
      if (createError) {
        setError(createError)
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

  return (
    <MaterialPermissionCheck
    user={currentUser}
     requiredRoles={['master', 'admin', 'support']}
     requiredPermissions={['materials.categories.create']}
   >
     <div className="p-6 space-y-6">
       <div className="flex items-center justify-between">
         <div>
           <h1 className="text-3xl font-bold flex items-center gap-3">
             <FolderPlus className="h-8 w-8 text-blue-600" />
             Criar Categoria
           </h1>
           <p className="text-muted-foreground mt-2">
             Crie uma nova categoria para organizar os materiais do sistema
           </p>
         </div>
       </div>

       {success && (
         <MessageBar variant="success" title="Sucesso">
           Categoria criada com sucesso!
         </MessageBar>
       )}

       <Card>
         <CardHeader>
           <CardTitle>Informações da Categoria</CardTitle>
         </CardHeader>
         <CardContent>
           <CategoryForm
             mode="create"
             onSubmit={handleCreateCategory}
             loading={loading}
             error={error}
           />
         </CardContent>
       </Card>
     </div>
   </MaterialPermissionCheck>
 )
}