"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X, Monitor, Tablet, Smartphone } from 'lucide-react'
import { useState } from 'react'
import type { DynamicViewConfig } from '@/types/view-builder'

interface PreviewModalProps {
  open: boolean
  onClose: () => void
  config: DynamicViewConfig
}

export default function PreviewModal({ open, onClose, config }: PreviewModalProps) {
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')

  if (!open) return null

  const previewSizes = {
    desktop: 'w-full',
    tablet: 'w-[768px] mx-auto',
    mobile: 'w-[375px] mx-auto'
  }

  const renderComponent = (component: any) => {
    switch (component.type) {
      case 'text':
        if (component.props.variant === 'h1') {
          return (
            <h1 className={`text-2xl font-bold ${component.props.color === 'primary' ? 'text-primary' : ''}`}>
              {component.props.content}
            </h1>
          )
        }
        if (component.props.variant === 'h2') {
          return (
            <h2 className={`text-xl font-semibold ${component.props.color === 'primary' ? 'text-primary' : ''}`}>
              {component.props.content}
            </h2>
          )
        }
        return (
          <p className={component.props.color === 'muted' ? 'text-muted-foreground' : ''}>
            {component.props.content}
          </p>
        )

      case 'card':
        return (
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">{component.props.title}</h3>
              <p className="text-muted-foreground">{component.props.content}</p>
            </CardContent>
          </Card>
        )

      case 'button':
        return (
          <Button 
            size={component.props.size || 'default'}
            variant={component.props.variant || 'default'}
          >
            {component.props.text}
          </Button>
        )

      case 'input':
        return (
          <input
            type={component.props.type || 'text'}
            placeholder={component.props.placeholder}
            className="w-full px-3 py-2 border border-border rounded-md bg-background"
          />
        )

      case 'form':
        return (
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">{component.props.title}</h3>
              <div className="space-y-4">
                {component.props.fields?.map((field: any, index: number) => (
                  <div key={index}>
                    <label className="block text-sm font-medium mb-1">{field.label}</label>
                    <input
                      type={field.type}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      required={field.required}
                    />
                  </div>
                ))}
                <Button className="w-full">
                  {component.props.submitText || 'Enviar'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )

      case 'table':
      case 'data_table':
        return (
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">{component.props.title}</h3>
              <div className="border border-border rounded-lg overflow-hidden">
                <div className="bg-muted p-3 font-medium text-sm">
                  <div className="grid grid-cols-3 gap-4">
                    {component.props.columns?.slice(0, 3).map((col: string, index: number) => (
                      <div key={index}>{col}</div>
                    ))}
                  </div>
                </div>
                {[1, 2, 3].map((row) => (
                  <div key={row} className="p-3 border-t border-border">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>Dados {row}</div>
                      <div>Exemplo {row}</div>
                      <div>Valor {row}</div>
                    </div>
                  </div>
                ))}
              </div>
              {component.data_binding && (
                <Badge className="mt-2">Conectado aos dados</Badge>
              )}
            </CardContent>
          </Card>
        )

      default:
        return (
          <div className="border border-dashed border-muted-foreground rounded p-4 text-center">
            <span className="text-muted-foreground">{component.type}</span>
          </div>
        )
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="border-b border-border p-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Preview - {config.name}</h2>
            <p className="text-sm text-muted-foreground">
              {config.components.length} componentes • Layout {config.layout.responsive ? 'responsivo' : 'fixo'}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Device Toggle */}
            <div className="flex border border-border rounded-lg overflow-hidden">
              <Button
                size="sm"
                variant={previewMode === 'desktop' ? 'default' : 'ghost'}
                onClick={() => setPreviewMode('desktop')}
                className="rounded-none"
              >
                <Monitor className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={previewMode === 'tablet' ? 'default' : 'ghost'}
                onClick={() => setPreviewMode('tablet')}
                className="rounded-none"
              >
                <Tablet className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={previewMode === 'mobile' ? 'default' : 'ghost'}
                onClick={() => setPreviewMode('mobile')}
                className="rounded-none"
              >
                <Smartphone className="h-4 w-4" />
              </Button>
            </div>
            
            <Button variant="ghost" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-auto bg-muted/20 p-4">
          <div className={`${previewSizes[previewMode]} transition-all duration-300`}>
            <div className={`
              grid gap-4 
              ${config.layout.responsive 
                ? `grid-cols-1 md:grid-cols-${Math.min(config.layout.gridCols, 3)} lg:grid-cols-${config.layout.gridCols}`
                : `grid-cols-${config.layout.gridCols}`
              } 
              ${config.layout.className || ''}
            `}>
              {config.components.map((component) => (
                <div
                  key={component.id}
                  className="transition-all duration-200"
                  style={{
                    gridColumn: `span ${Math.min(component.position.w, config.layout.gridCols)}`,
                  }}
                >
                  {renderComponent(component)}
                </div>
              ))}
            </div>

            {/* Empty State */}
            {config.components.length === 0 && (
              <div className="text-center py-12">
                <div className="text-4xl opacity-20 mb-4">📐</div>
                <h3 className="text-lg font-semibold mb-2">Nenhum componente para visualizar</h3>
                <p className="text-muted-foreground">
                  Adicione elementos ao canvas para visualizar o preview da sua view.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border p-4 bg-muted/20">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div>
              Preview Mode: {previewMode} • {config.components.length} componentes
            </div>
            <div>
              {config.data_sources.length > 0 && (
                <Badge variant="outline">
                  {config.data_sources.length} fonte(s) de dados conectada(s)
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}