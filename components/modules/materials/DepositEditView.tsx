"use client"

import { useState, useEffect } from 'react'
import { Building2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageBar } from '@/components/ui/message-bar'
import DepositForm from './DepositForm'
import DepositList from './DepositList'
import MaterialPermissionCheck from './MaterialPermissionCheck'
import { searchDeposits, updateDeposit } from '@/lib/supabase/materials'
import {User} from '@/types/user'
import type {Deposit, DepositSearchCriteria, UpdateDepositData } from '@/types/material'

interface DepositEditViewProps {
  currentUser: User
  onSuccess?: () => void
}

export default function DepositEditView({ currentUser, onSuccess }: DepositEditViewProps) {
  const [step, setStep] = useState<'search' | 'edit'>('search')
  const [selectedDeposit, setSelectedDeposit] = useState<Deposit | null>(null)
  const [deposits, setDeposits] = useState<Deposit[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [updateError, setUpdateError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSearch = async (criteria: DepositSearchCriteria) => {
    setSearchLoading(true)
    setSearchError(null)

    try {
      const { data, error } = await searchDeposits(criteria)
      
      if (error) {
        setSearchError(error)
        setDeposits([])
      } else {
        setDeposits(data || [])
      }
    } catch (err) {
      setSearchError('Erro interno do servidor')
      setDeposits([])
    } finally {
      setSearchLoading(false)
    }
  }

  const handleSelectDeposit = (deposit: Deposit, action: 'view' | 'edit') => {
    if (action === 'edit') {
      setSelectedDeposit(deposit)
      setStep('edit')
    }
  }

  const handleUpdateDeposit = async (depositData: UpdateDepositData) => {
    if (!selectedDeposit) return

    setUpdateLoading(true)
    setUpdateError(null)

    try {
      const { data, error } = await updateDeposit(selectedDeposit.id, depositData, currentUser.id)
      
      if (error) {
        setUpdateError(error)
      } else {
        setSuccess(true)
        setSelectedDeposit(data)
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
    setSelectedDeposit(null)
    setUpdateError(null)
    setSuccess(false)
  }

  useEffect(() => {
    // Buscar todos os depósitos inicialmente
    handleSearch({})
  }, [])

  return (
    <MaterialPermissionCheck
      user={currentUser}
      requiredRoles={['master', 'admin', 'support']}
      requiredPermissions={['materials.deposits.edit']}
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
                <Building2 className="h-8 w-8 text-orange-600" />
                {step === 'search' ? 'Editar Depósito' : `Editando: ${selectedDeposit?.nome}`}
              </h1>
              <p className="text-muted-foreground mt-2">
                {step === 'search' 
                  ? 'Busque e selecione um depósito para editar suas informações'
                  : 'Modifique as informações do depósito selecionado'
                }
              </p>
            </div>
          </div>
        </div>

        {step === 'search' ? (
          <DepositList
            deposits={deposits}
            loading={searchLoading}
            error={searchError}
            onSearch={handleSearch}
            onSelectDeposit={handleSelectDeposit}
            showActions={true}
          />
        ) : (
          <>
            {success && (
              <MessageBar variant="success" title="Sucesso">
                Depósito atualizado com sucesso!
              </MessageBar>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Editar Informações do Depósito</CardTitle>
              </CardHeader>
              <CardContent>
                <DepositForm
                  mode="edit"
                  deposit={selectedDeposit!}
                  onSubmit={handleUpdateDeposit}
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