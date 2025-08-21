"use client"

import { useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2, Move, Settings } from 'lucide-react'
import type { DynamicViewConfig, ViewComponent, ElementType } from '@/types/view-builder'

interface CanvasProps {
  config: DynamicViewConfig
  selectedElement: string | null
  onElementSelect: (elementId: string | null) => void
  onElementUpdate: (elementId: string, updates: Partial<ViewComponent>) => void
  onElementDelete: (elementId: string) => void
}

export default function Canvas({
  config,
  selectedElement,
  onElementSelect,
  onElementUpdate,
  onElementDelete
}: CanvasProps) {
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    
    try {
      const elementData = JSON.parse(e.dataTransfer.getData('application/json')) as ElementType
      const rect = e.currentTarget.getBoundingClientRect()
      const x = Math.floor((e.clientX - rect.left) / 50) // Grid snap
      const y = Math.floor((e.clientY - rect.top) / 50)
      
      // Será implementado pelo componente pai
      console.log('Drop element:', elementData, 'at position:', { x, y })
    } catch (error) {
      console.error('Erro ao processar drop:', error)
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  const renderComponent = (component: ViewComponent) => {
    const isSelected = selectedElement === component.id
    
    return (
      <div
        key={component.id}
        className={`absolute border-2 transition-all ${
          isSelected 
            ? 'border-primary bg-primary/5' 
            : 'border-transparent hover:border-muted-foreground/30'
        }`}
        style={{
          left: `${component.position.x * 50}px`,
          top: `${component.position.y * 50}px`,
          width: `${component.position.w * 50}px`,
          minHeight: `${component.position.h * 50}px`
        }}
        onClick={(e) => {
          e.stopPropagation()
          onElementSelect(component.id)
        }}
      >
        {/* Element Content */}
        <div className="w-full h-full p-2">
          {renderElementContent(component)}
        </div>

        {/* Selection Controls */}
        {isSelected && (
          <div className="absolute -top-8 left-0 flex gap-1 bg-background border border-border rounded-md p-1">
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation()
                // TODO: Implementar drag/resize
              }}
            >
              <Move className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation()
                onElementDelete(component.id)
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        )}

        {/* Resize Handles */}
        {isSelected && (
          <>
            <div 
              className="absolute bottom-0 right-0 w-3 h-3 bg-primary cursor-se-resize"
              onMouseDown={(e) => {
                // TODO: Implementar resize
                e.stopPropagation()
              }}
            />
          </>
        )}
      </div>
    )
  }

  const renderElementContent = (component: ViewComponent) => {
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
          <Card className="w-full h-full">
            <div className="p-4">
              {component.props.title && (
                <h3 className="font-semibold mb-2">{component.props.title}</h3>
              )}
              {component.props.content && (
                <p className="text-sm text-muted-foreground">{component.props.content}</p>
              )}
            </div>
          </Card>
        )

      case 'button':
        return (
          <Button
            variant={component.props.variant || 'default'}
            size={component.props.size || 'default'}
            className="w-full"
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
          <Card className="w-full h-full">
            <div className="p-4">
              <h3 className="font-semibold mb-4">{component.props.title}</h3>
              <div className="space-y-3">
                {component.props.fields?.slice(0, 2).map((field: any, index: number) => (
                  <div key={index}>
                    <label className="text-sm font-medium block mb-1">{field.label}</label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm"
                    />
                  </div>
                ))}
                <Button size="sm" className="w-full mt-3">
                  {component.props.submitText || 'Enviar'}
                </Button>
              </div>
            </div>
          </Card>
        )

      case 'table':
        return (
          <Card className="w-full h-full">
            <div className="p-4">
              <h3 className="font-semibold mb-3">{component.props.title}</h3>
              <div className="border border-border rounded">
                <div className="grid grid-cols-3 gap-2 p-2 bg-muted text-xs font-medium">
                  {component.props.columns?.slice(0, 3).map((col: string, index: number) => (
                    <div key={index}>{col}</div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-2 p-2 text-xs">
                  <div>Dados 1</div>
                  <div>Dados 2</div>
                  <div>Dados 3</div>
                </div>
              </div>
            </div>
          </Card>
        )

      default:
        return (
          <div className="w-full h-full border border-dashed border-muted-foreground rounded flex items-center justify-center">
            <span className="text-xs text-muted-foreground">{component.type}</span>
          </div>
        )
    }
  }

  return (
    <div className="h-full bg-background">
      {/* Canvas Header */}
      <div className="border-b border-border p-4 bg-muted/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold">Canvas de Design</h2>
            <p className="text-sm text-muted-foreground">
              Arraste elementos do painel lateral para construir sua view
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-primary rounded"></div>
              Grid: 50px
            </div>
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div
        className="relative w-full h-full overflow-auto bg-gradient-to-br from-background to-muted/20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => onElementSelect(null)}
      >
        {/* Grid Container */}
        <div className="relative min-h-full" style={{ minWidth: '1200px', minHeight: '800px' }}>
          {config.components.map(renderComponent)}

          {/* Empty State */}
          {config.components.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-4 p-8">
                <div className="text-6xl opacity-20">📐</div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Canvas Vazio</h3>
                  <p className="text-muted-foreground max-w-md">
                    Arraste elementos do painel lateral para começar a construir sua view personalizada.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}