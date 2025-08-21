"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Monitor, Smartphone, Tablet, X } from 'lucide-react'
import { useState } from 'react'
import DynamicViewRenderer from '@/components/DynamicViewRenderer'
import type { DynamicViewConfig } from '@/types/view-builder'

interface PreviewModalProps {
  open: boolean
  onClose: () => void
  config: DynamicViewConfig
}

export default function PreviewModal({ open, onClose, config }: PreviewModalProps) {
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')

  const viewportStyles = {
    desktop: { width: '100%', height: '100%' },
    tablet: { width: '768px', height: '1024px', margin: '0 auto' },
    mobile: { width: '375px', height: '667px', margin: '0 auto' }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] w-[90vw] p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                Preview: {config.name || 'View sem nome'}
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Visualize como sua view ficará para os usuários
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Viewport Controls */}
              <div className="flex items-center gap-1 border rounded-lg p-1">
                <Button
                  size="sm"
                  variant={viewport === 'desktop' ? 'default' : 'ghost'}
                  onClick={() => setViewport('desktop')}
                  className="h-8 w-8 p-0"
                >
                  <Monitor className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={viewport === 'tablet' ? 'default' : 'ghost'}
                  onClick={() => setViewport('tablet')}
                  className="h-8 w-8 p-0"
                >
                  <Tablet className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={viewport === 'mobile' ? 'default' : 'ghost'}
                  onClick={() => setViewport('mobile')}
                  className="h-8 w-8 p-0"
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
              </div>

              <Badge variant="outline" className="text-xs">
                {config.components.length} elemento(s)
              </Badge>

              <Button size="sm" variant="outline" onClick={onClose}>
                <X className="h-4 w-4 mr-2" />
                Fechar
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Preview Area */}
        <div className="flex-1 overflow-auto bg-muted/20 p-6">
          <div 
            className="bg-background border border-border rounded-lg shadow-lg overflow-auto"
            style={viewportStyles[viewport]}
          >
            {config.components.length > 0 ? (
              <DynamicViewRenderer 
                config={config}
                currentUser={{ id: 'preview-user' }}
              />
            ) : (
              <div className="h-full flex items-center justify-center p-8">
                <div className="text-center space-y-4">
                  <div className="text-6xl opacity-20">👁️</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Preview Vazio</h3>
                    <p className="text-muted-foreground">
                      Adicione alguns elementos à sua view para ver o preview
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Preview Info */}
        <div className="border-t bg-muted/20 p-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>Viewport: {viewport}</span>
              <span>Resolução: {
                viewport === 'desktop' ? 'Responsiva' :
                viewport === 'tablet' ? '768x1024' :
                '375x667'
              }</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Componentes: {config.components.length}</span>
              <span>Grid: {config.layout.gridCols} colunas</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}