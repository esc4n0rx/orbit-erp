'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { FileText, Download, Search, Calendar, Filter } from 'lucide-react'
import type { User } from '@/types/auth'
import type { ReportItem } from '@/types/menu'

interface ReportsModalProps {
  open: boolean
  onClose: () => void
  user: User
}

export function ReportsModal({ open, onClose, user }: ReportsModalProps) {
  const [reports, setReports] = useState<ReportItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (open) {
      loadReports()
    }
  }, [open])

  const loadReports = async () => {
    setLoading(true)
    try {
      // Mock data - integrar com supabase posteriormente
      const mockReports: ReportItem[] = [
        {
          id: 'users-report',
          name: 'Relatório de Usuários',
          description: 'Lista completa de usuários do sistema',
          module: 'Usuários',
          lastGenerated: '2024-08-20'
        },
        {
          id: 'access-report',
          name: 'Relatório de Acessos',
          description: 'Histórico de acessos às views',
          module: 'Auditoria',
          lastGenerated: '2024-08-19'
        },
        {
          id: 'modules-report',
          name: 'Relatório de Módulos',
          description: 'Status e utilização dos módulos',
          module: 'Sistema',
          lastGenerated: '2024-08-18'
        },
        {
          id: 'performance-report',
          name: 'Relatório de Performance',
          description: 'Métricas de performance do sistema',
          module: 'Monitoramento',
          lastGenerated: '2024-08-17'
        }
      ]
      setReports(mockReports)
    } catch (error) {
      console.error('Erro ao carregar relatórios:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateReport = (reportId: string) => {
    console.log(`Gerando relatório: ${reportId}`)
    // Implementar lógica de geração de relatório
  }

  const downloadReport = (reportId: string) => {
    console.log(`Baixando relatório: ${reportId}`)
    // Implementar lógica de download
  }

  const filteredReports = reports.filter(report =>
    report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.module.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Central de Relatórios
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar relatórios..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Lista de Relatórios */}
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Carregando relatórios...</p>
              </div>
            ) : (
              filteredReports.map((report) => (
                <Card key={report.id} className="transition-shadow hover:shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-medium flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      {report.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-3">{report.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="outline">{report.module}</Badge>
                      {report.lastGenerated && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          Última geração: {new Date(report.lastGenerated).toLocaleDateString('pt-BR')}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => generateReport(report.id)}
                      >
                        Gerar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadReport(report.id)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}

            {!loading && filteredReports.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                            <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                            <p>Nenhum relatório encontrado</p>
                        </div>
                        )}
                    </div>
                    </div>
                </DialogContent>
                </Dialog>
            )
            }