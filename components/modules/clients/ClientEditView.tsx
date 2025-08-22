// components/modules/clients/ClientEditView.tsx
"use client"

import { useState, useEffect } from 'react'
import { Search, ArrowLeft, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageBar } from '@/components/ui/message-bar'
import ClientEditForm from './ClientEditForm'
import ClientList from './ClientList'
import ClientPermissionCheck from './ClientPermissionCheck'
import { useClientOperations } from '@/hooks/useClientOperations'
import type { User } from '@/types/user'
import type { Client, ClientSearchCriteria } from '@/types/client'

interface ClientEditViewProps {
  currentUser: User
  onOpenView?: (viewId: string, title: string) => void
}

export default function ClientEditView({ currentUser, onOpenView }: ClientEditViewProps) {
  const [step, setStep] = useState<'search' | 'edit'>('search')
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [clients, setClients] = useState<Client[]>([])
  const [searchError, setSearchError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  const { searchClients, loading } = useClientOperations()

  // Buscar todos os clientes inicialmente
  useEffect(() => {
    handleSearch({})
  }, [])

  const handleSearch = async (criteria: ClientSearchCriteria) => {
    setSearchError(null)

    try {
      const { data, error } = await searchClients(criteria)
      
      if (error) {
        setSearchError(error)
        setClients([])
      } else {
        setClients(data || [])
      }
    } catch (err) {
      setSearchError('Erro interno do servidor')
      setClients([])
    }
  }

  const handleSelectClient = (client: Client, action: 'view' | 'edit') => {
    if (action === 'edit') {
      setSelectedClient(client)
      setStep('edit')
    }
  }

  const handleUpdateSuccess = (updatedClient: Client) => {
    setSuccess(true)
    setSelectedClient(updatedClient)
    setTimeout(() => {
      setSuccess(false)
      setStep('search')
      // Recarregar lista após edição
      handleSearch({})
    }, 2000)
  }

  const handleBack = () => {
    setStep('search')
    setSelectedClient(null)
  }

  return (
    <ClientPermissionCheck 
      currentUser={currentUser} 
      requiredPermission="edit"
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
                <span>
                  {step === 'search' ? 'Editar Cliente' : `Editando: ${selectedClient?.razao_social}`}
                </span>
              </CardTitle>
              <div className="text-sm text-muted-foreground">
                View: cm002
              </div>
            </div>
          </CardHeader>
        </Card>

        {success && (
          <MessageBar variant="success" title="Sucesso">
            Cliente atualizado com sucesso!
          </MessageBar>
        )}

        {step === 'search' ? (
          <ClientList
            clients={clients}
            loading={loading}
            error={searchError}
            onSearch={handleSearch}
            onSelectClient={handleSelectClient}
            showActions={true}
          />
        ) : (
          selectedClient && (
            <ClientEditForm
              client={selectedClient}
              onSuccess={handleUpdateSuccess}
              onCancel={handleBack}
              updatedBy={currentUser.id}
            />
          )
        )}
      </div>
    </ClientPermissionCheck>
  )
}