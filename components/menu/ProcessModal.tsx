'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload, Download, RefreshCw, Database, FileText, Settings } from 'lucide-react'
import type { User } from '@/types/auth'

interface ProcessModalProps {
  open: boolean
  onClose: () => void
  user: User
}

export function ProcessModal({ open, onClose, user }: ProcessModalProps) {
  const processActions = [
    {
      id: 'import-data',
      name: 'Importar Dados',
      description: 'Importar dados de planilhas Excel ou CSV',
      icon: Upload,
      action: () => console.log('Importar dados')
    },
    {
      id: 'export-data',
      name: 'Exportar Dados',
      description: 'Exportar dados para planilhas ou relatórios',
      icon: Download,
      action: () => console.log('Exportar dados')
    },
    {
      id: 'sync-data',
      name: 'Sincronizar Dados',
      description: 'Sincronizar dados com sistemas externos',
      icon: RefreshCw,
      action: () => console.log('Sincronizar dados')
    },
    {
      id: 'backup-db',
      name: 'Backup Database',
      description: 'Realizar backup do banco de dados',
      icon: Database,
      action: () => console.log('Backup database')
    },
    {
      id: 'generate-reports',
      name: 'Gerar Relatórios',
      description: 'Gerar relatórios automáticos do sistema',
      icon: FileText,
      action: () => console.log('Gerar relatórios')
    },
    {
      id: 'system-maintenance',
      name: 'Manutenção do Sistema',
      description: 'Executar rotinas de manutenção',
      icon: Settings,
      action: () => console.log('Manutenção do sistema')
    }
  ]

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-orange-600" />
            Central de Processamento
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {processActions.map((action) => {
            const IconComponent = action.icon
            return (
              <Card key={action.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <IconComponent className="h-5 w-5 text-orange-600" />
                    {action.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4">{action.description}</p>
                  <Button 
                    className="w-full" 
                    onClick={action.action}
                  >
                    Executar
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}