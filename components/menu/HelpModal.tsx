'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  HelpCircle, 
  Book, 
  MessageCircle, 
  Mail, 
  Phone, 
  FileText,
  Video,
  ExternalLink
} from 'lucide-react'
import type { User } from '@/types/auth'

interface HelpModalProps {
  open: boolean
  onClose: () => void
  user: User
}

export function HelpModal({ open, onClose, user }: HelpModalProps) {
  const helpSections = [
    {
      id: 'documentation',
      title: 'Documentação',
      description: 'Guias completos e manuais do usuário',
      icon: Book,
      items: [
        { name: 'Manual do Usuário', type: 'PDF', action: () => console.log('Abrir manual') },
        { name: 'Guia de Primeiros Passos', type: 'Web', action: () => console.log('Abrir guia') },
        { name: 'FAQ - Perguntas Frequentes', type: 'Web', action: () => console.log('Abrir FAQ') }
      ]
    },
    {
      id: 'tutorials',
      title: 'Tutoriais',
      description: 'Vídeos e tutoriais passo a passo',
      icon: Video,
      items: [
        { name: 'Como criar usuários', type: 'Vídeo', action: () => console.log('Abrir tutorial') },
        { name: 'Configurando módulos', type: 'Vídeo', action: () => console.log('Abrir tutorial') },
        { name: 'Gerando relatórios', type: 'Vídeo', action: () => console.log('Abrir tutorial') }
      ]
    },
    {
      id: 'support',
      title: 'Suporte Técnico',
      description: 'Entre em contato conosco',
      icon: MessageCircle,
      items: [
        { name: 'Chat Online', type: 'Chat', action: () => console.log('Abrir chat') },
        { name: 'Abrir Ticket', type: 'Form', action: () => console.log('Abrir ticket') },
        { name: 'Base de Conhecimento', type: 'Web', action: () => console.log('Abrir base') }
      ]
    }
  ]

  const contactInfo = [
    {
      type: 'Email',
      value: 'suporte@orbit-erp.com',
      icon: Mail,
      action: () => window.open('mailto:suporte@orbit-erp.com')
    },
    {
      type: 'Telefone',
      value: '+55 (11) 9999-9999',
      icon: Phone,
      action: () => window.open('tel:+5511999999999')
    }
  ]

  const systemVersion = '2.1.0'

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-blue-600" />
            Central de Ajuda
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Seções de Ajuda */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {helpSections.map((section) => {
              const IconComponent = section.icon
              return (
                <Card key={section.id} className="h-full">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-medium flex items-center gap-2">
                      <IconComponent className="h-5 w-5 text-blue-600" />
                      {section.title}
                    </CardTitle>
                    <p className="text-muted-foreground text-sm">{section.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {section.items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-2 rounded hover:bg-muted transition-colors">
                          <div>
                            <p className="font-medium text-sm">{item.name}</p>
                            <Badge variant="outline" className="text-xs mt-1">
                              {item.type}
                            </Badge>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={item.action}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <Separator />

          {/* Informações de Contato */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-green-600" />
                  Contato Direto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {contactInfo.map((contact, index) => {
                    const IconComponent = contact.icon
                    return (
                      <div key={index} className="flex items-center gap-3">
                        <IconComponent className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">{contact.type}</p>
                          <Button
                            variant="link"
                            className="p-0 h-auto font-medium"
                            onClick={contact.action}
                          >
                            {contact.value}
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-600" />
                  Informações do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Versão do Sistema</p>
                    <p className="font-semibold">{systemVersion}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Usuário</p>
                    <p className="font-semibold">{user.nomeCompleto}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Perfil</p>
                    <Badge variant="secondary">{user.role}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Ambiente</p>
                    <Badge variant="outline">Development</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}