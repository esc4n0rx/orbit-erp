'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Settings, Database, Server, Monitor, Shield, Activity } from 'lucide-react'
import type { User } from '@/types/auth'
import type { SystemInfo } from '@/types/menu'

interface SystemsModalProps {
  open: boolean
  onClose: () => void
  user: User
}

export function SystemsModal({ open, onClose, user }: SystemsModalProps) {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (open) {
      loadSystemInfo()
    }
  }, [open])

  const loadSystemInfo = async () => {
    setLoading(true)
    try {
      // Mock data - integrar com APIs reais posteriormente
      const mockSystemInfo: SystemInfo = {
        version: '2.1.0',
        environment: 'Development',
        database: 'PostgreSQL 15.3',
        lastUpdate: '2024-08-20'
      }
      setSystemInfo(mockSystemInfo)
    } catch (error) {
      console.error('Erro ao carregar informações do sistema:', error)
    } finally {
      setLoading(false)
    }
  }

  const systemModules = [
    {
      id: 'database',
      name: 'Banco de Dados',
      description: 'Configurações e status do banco de dados',
      icon: Database,
      status: 'online',
      action: () => console.log('Abrir configurações do banco')
    },
    {
      id: 'server',
      name: 'Servidor',
      description: 'Monitoramento e configurações do servidor',
      icon: Server,
      status: 'online',
      action: () => console.log('Abrir configurações do servidor')
    },
    {
      id: 'monitoring',
      name: 'Monitoramento',
      description: 'Logs e métricas de performance',
      icon: Monitor,
      status: 'active',
      action: () => console.log('Abrir monitoramento')
    },
    {
      id: 'security',
      name: 'Segurança',
      description: 'Configurações de segurança e auditoria',
      icon: Shield,
      status: 'secure',
      action: () => console.log('Abrir configurações de segurança')
    },
    {
      id: 'health',
      name: 'Health Check',
      description: 'Status geral do sistema',
      icon: Activity,
      status: 'healthy',
      action: () => console.log('Verificar health check')
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
      case 'active':
      case 'healthy':
      case 'secure':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'error':
      case 'offline':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-gray-600" />
            Configurações do Sistema
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações do Sistema */}
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Carregando informações...</p>
            </div>
          ) : systemInfo && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-blue-600" />
                  Informações do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Versão</p>
                    <p className="font-semibold">{systemInfo.version}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Ambiente</p>
                    <Badge variant="outline">{systemInfo.environment}</Badge>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Banco de Dados</p>
                    <p className="font-semibold text-sm">{systemInfo.database}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Última Atualização</p>
                    <p className="font-semibold text-sm">
                      {new Date(systemInfo.lastUpdate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Módulos do Sistema */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {systemModules.map((module) => {
              const IconComponent = module.icon
              return (
                <Card key={module.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-medium flex items-center gap-2">
                        <IconComponent className="h-5 w-5 text-gray-600" />
                        {module.name}
                      </CardTitle>
                      <Badge className={getStatusColor(module.status)}>
                        {module.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4">{module.description}</p>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full"
                      onClick={module.action}
                    >
                      Configurar
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}