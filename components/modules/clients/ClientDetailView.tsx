// components/modules/clients/ClientDetailView.tsx
"use client"

import { useState, useEffect } from 'react'
import { Eye, ArrowLeft, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageBar } from '@/components/ui/message-bar'
import ClientViewForm from './ClientViewForm'
import ClientList from './ClientList'
import ClientPermissionCheck from './ClientPermissionCheck'
import { useClientOperations } from '@/hooks/useClientOperations'
import type { User } from '@/types/user'
import type { Client, ClientSearchCriteria } from '@/types/client'

interface ClientDetailViewProps {
  currentUser: User
  onOpenView?: (viewId: string, title: string) => void
}

export default function ClientDetailView({ currentUser, onOpenView }: ClientDetailViewProps) {
  const [step, setStep] = useState<'search' | 'view'>('search')
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [clients, setClients] = useState<Client[]>([])
  const [searchError, setSearchError] = useState<string | null>(null)
  
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
    if (action === 'view') {
      setSelectedClient(client)
      setStep('view')
    } else if (action === 'edit') {
      // Redirecionar para view de edição
      onOpenView?.('cm002', `Editar Cliente: ${client.razao_social}`)
    }
  }

  const handleEdit = () => {
    if (selectedClient) {
      onOpenView?.('cm002', `Editar Cliente: ${selectedClient.razao_social}`)
    }
  }

  const handleBack = () => {
    setStep('search')
    setSelectedClient(null)
  }

  const canEdit = ['master', 'admin', 'comercial'].includes(currentUser.role)

  return (
    <ClientPermissionCheck 
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
                  {step === 'search' ? 'Visualizar Cliente' : `Cliente: ${selectedClient?.razao_social}`}
                </span>
              </CardTitle>
              <div className="flex items-center gap-2">
                <div className="text-sm text-muted-foreground">
                  View: cm003
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
            <ClientViewForm client={selectedClient} />
          )
        )}
      </div>
    </ClientPermissionCheck>
  )
}