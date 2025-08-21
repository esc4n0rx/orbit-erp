"use client"

import { useState, useEffect } from 'react'
import { FolderEdit, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageBar } from '@/components/ui/message-bar'
import CategoryForm from './CategoryForm'
import CategoryList from './CategoryList'
import MaterialPermissionCheck from './MaterialPermissionCheck'
import { searchCategories, updateCategory } from '@/lib/supabase/materials'
import {User} from '@/types/user'
import type {Category, CategorySearchCriteria, UpdateCategoryData } from '@/types/material'

interface CategoryEditViewProps {
  currentUser: User
  onSuccess?: () => void
}

export default function CategoryEditView({ currentUser, onSuccess }: CategoryEditViewProps) {
  const [step, setStep] = useState<'search' | 'edit'>('search')
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [updateError, setUpdateError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSearch = async (criteria: CategorySearchCriteria) => {
    setSearchLoading(true)
    setSearchError(null)

    try {
      const { data, error } = await searchCategories(criteria)
      
      if (error) {
        setSearchError(error)
        setCategories([])
      } else {
        setCategories(data || [])
      }
    } catch (err) {
      setSearchError('Erro interno do servidor')
      setCategories([])
    } finally {
      setSearchLoading(false)
    }
  }

  const handleSelectCategory = (category: Category, action: 'view' | 'edit') => {
    if (action === 'edit') {
      setSelectedCategory(category)
      setStep('edit')
    }
  }

  const handleUpdateCategory = async (categoryData: UpdateCategoryData) => {
    if (!selectedCategory) return

    setUpdateLoading(true)
    setUpdateError(null)

    try {
      const { data, error } = await updateCategory(selectedCategory.id, categoryData, currentUser.id)
      
      if (error) {
        setUpdateError(error)
      } else {
        setSuccess(true)
        setSelectedCategory(data)
        setTimeout(() => {
          setSuccess(false)
          onSuccess?.()
        }, 2000)
      }
    } catch (err) {
      setUpdateError('Erro interno do servidor')
    } finally {
      setUpdateLoading(false)
    }
  }

  const handleBackToSearch = () => {
    setStep('search')
    setSelectedCategory(null)
    setUpdateError(null)
    setSuccess(false)
  }

  useEffect(() => {
    // Buscar todas as categorias inicialmente
    handleSearch({})
  }, [])

  return (
    <MaterialPermissionCheck
      currentUser={currentUser}
      requiredPermission="update"
    >
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {step === 'edit' && (
              <Button variant="ghost" onClick={handleBackToSearch}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <FolderEdit className="h-8 w-8 text-orange-600" />
                {step === 'search' ? 'Editar Categoria' : `Editando: ${selectedCategory?.categoria}`}
              </h1>
              <p className="text-muted-foreground mt-2">
                {step === 'search' 
                  ? 'Busque e selecione uma categoria para editar suas informações'
                  : 'Modifique as informações da categoria selecionada'
                }
              </p>
            </div>
          </div>
        </div>

        {step === 'search' ? (
          <CategoryList
            categories={categories}
            loading={searchLoading}
            error={searchError}
            onSearch={handleSearch}
            onSelectCategory={handleSelectCategory}
            showActions={true}
          />
        ) : (
          <>
            {success && (
              <MessageBar variant="success" title="Sucesso">
                Categoria atualizada com sucesso!
              </MessageBar>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Editar Informações da Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <CategoryForm
                  mode="edit"
                  category={selectedCategory!}
                  onSubmit={handleUpdateCategory}
                  loading={updateLoading}
                  error={updateError}
                />
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </MaterialPermissionCheck>
  )
}