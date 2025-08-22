"use client"

import { useCallback, useState, useRef } from 'react'
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
  onElementAdd: (component: ViewComponent) => void
}

export default function Canvas({
  config,
  selectedElement,
  onElementSelect,
  onElementUpdate,
  onElementDelete,
  onElementAdd
}: CanvasProps) {
  const [draggedElement, setDraggedElement] = useState<ViewComponent | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const canvasRef = useRef<HTMLDivElement>(null)

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    
    try {
      const elementData = e.dataTransfer.getData('application/json')
      if (!elementData) return

      const elementType = JSON.parse(elementData) as ElementType
      const rect = e.currentTarget.getBoundingClientRect()
      const x = Math.floor((e.clientX - rect.left) / 50)
      const y = Math.floor((e.clientY - rect.top) / 50)
      
      const newComponent: ViewComponent = {
        id: `element-${Date.now()}`,
        type: elementType.id as any,
        props: { ...elementType.defaultProps },
        position: {
          x: Math.max(0, x),
          y: Math.max(0, y),
          w: elementType.id === 'table' || elementType.id === 'data_table' ? 8 : 6,
          h: elementType.id === 'table' || elementType.id === 'data_table' ? 6 : 4
        }
      }

      onElementAdd(newComponent)
    } catch (error) {
      console.error('Erro ao processar drop:', error)
    }
  }, [onElementAdd])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  const handleElementDragStart = useCallback((e: React.MouseEvent, component: ViewComponent) => {
    e.stopPropagation()
    const rect = e.currentTarget.getBoundingClientRect()
    const offsetX = e.clientX - rect.left
    const offsetY = e.clientY - rect.top
    
    setDraggedElement(component)
    setDragOffset({ x: offsetX, y: offsetY })
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!canvasRef.current) return
      
      const canvasRect = canvasRef.current.getBoundingClientRect()
      const newX = Math.floor((moveEvent.clientX - canvasRect.left - offsetX) / 50)
      const newY = Math.floor((moveEvent.clientY - canvasRect.top - offsetY) / 50)
      
      onElementUpdate(component.id, {
        position: {
          ...component.position,
          x: Math.max(0, newX),
          y: Math.max(0, newY)
        }
      })
    }
    
    const handleMouseUp = () => {
      setDraggedElement(null)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
    
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [onElementUpdate])

  const handleElementResize = useCallback((e: React.MouseEvent, component: ViewComponent) => {
    e.stopPropagation()
    
    const startX = e.clientX
    const startY = e.clientY
    const startWidth = component.position.w
    const startHeight = component.position.h
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = Math.floor((moveEvent.clientX - startX) / 50)
      const deltaY = Math.floor((moveEvent.clientY - startY) / 50)
      
      onElementUpdate(component.id, {
        position: {
          ...component.position,
          w: Math.max(2, startWidth + deltaX),
          h: Math.max(2, startHeight + deltaY)
        }
      })
    }
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
    
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [onElementUpdate])

  const renderComponent = (component: ViewComponent) => {
    const isSelected = selectedElement === component.id
    const isDragging = draggedElement?.id === component.id
    
    return (
      <div
        key={component.id}
        ref={canvasRef}
        className={`absolute border-2 transition-all ${
          isSelected 
            ? 'border-primary bg-primary/5 shadow-md' 
            : 'border-transparent hover:border-muted-foreground/30'
        } ${isDragging ? 'opacity-70' : ''}`}
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
        <div className="w-full h-full p-2 overflow-hidden">
          {renderElementContent(component)}
        </div>

        {/* Selection Controls */}
        {isSelected && (
          <div className="absolute -top-8 left-0 flex gap-1 bg-background border border-border rounded-md p-1 shadow-sm">
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
              onMouseDown={(e) => handleElementDragStart(e, component)}
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

        {/* Resize Handle */}
        {isSelected && (
          <div 
            className="absolute bottom-0 right-0 w-3 h-3 bg-primary cursor-se-resize hover:bg-primary/80"
            onMouseDown={(e) => handleElementResize(e, component)}
          />
        )}
      </div>
    )
  }

  const renderElementContent = (component: ViewComponent) => {
    switch (component.type) {
      case 'text':
        if (component.props.variant === 'h1') {
          return (
            <h1 className={`text-2xl font-bold truncate ${component.props.color === 'primary' ? 'text-primary' : ''}`}>
              {component.props.content}
            </h1>
          )
        }
        if (component.props.variant === 'h2') {
          return (
            <h2 className={`text-xl font-semibold truncate ${component.props.color === 'primary' ? 'text-primary' : ''}`}>
              {component.props.content}
            </h2>
          )
        }
        return (
          <p className={`text-sm truncate ${component.props.color === 'muted' ? 'text-muted-foreground' : ''}`}>
            {component.props.content}
          </p>
        )

      case 'card':
        return (
          <Card className="w-full h-full">
            <div className="p-4 h-full">
              <h3 className="font-semibold text-sm truncate mb-2">{component.props.title}</h3>
              <p className="text-xs text-muted-foreground line-clamp-3">{component.props.content}</p>
            </div>
          </Card>
        )

      case 'button':
        return (
          <Button 
            size={component.props.size || 'default'}
            variant={component.props.variant || 'default'}
            className="w-fit"
          >
            {component.props.text}
          </Button>
        )

      case 'input':
        return (
          <input
            type={component.props.type || 'text'}
            placeholder={component.props.placeholder}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm"
            disabled
          />
        )

      case 'form':
        return (
          <Card className="w-full h-full">
            <div className="p-4 h-full overflow-auto">
              <h3 className="font-semibold mb-3 text-sm">{component.props.title}</h3>
              <div className="space-y-3">
                {component.props.fields?.slice(0, 3).map((field: any, index: number) => (
                  <div key={index}>
                    <label className="text-xs font-medium">{field.label}</label>
                    <input
                      type={field.type}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm mt-1"
                      disabled
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
      case 'data_table':
        return (
          <Card className="w-full h-full">
            <div className="p-4 h-full overflow-auto">
              <h3 className="font-semibold mb-3 text-sm">{component.props.title}</h3>
              <div className="border border-border rounded">
                <div className="grid grid-cols-3 gap-2 p-2 bg-muted text-xs font-medium">
                  {component.props.columns?.slice(0, 3).map((col: string, index: number) => (
                    <div key={index} className="truncate">{col}</div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-2 p-2 text-xs">
                  <div>Dados 1</div>
                  <div>Dados 2</div>
                  <div>Dados 3</div>
                </div>
                <div className="grid grid-cols-3 gap-2 p-2 text-xs bg-muted/50">
                  <div>Dados 4</div>
                  <div>Dados 5</div>
                  <div>Dados 6</div>
                </div>
              </div>
              {component.data_binding && (
                <div className="mt-2 text-xs text-primary">
                  🔗 Conectado aos dados
                </div>
              )}
            </div>
          </Card>
        )

      case 'chart':
      case 'data_chart':
        return (
          <Card className="w-full h-full">
            <div className="p-4 h-full flex flex-col">
              <h3 className="font-semibold mb-3 text-sm">{component.props.title || 'Gráfico'}</h3>
              <div className="flex-1 border border-dashed border-muted-foreground rounded flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl opacity-50">📊</div>
                  <span className="text-xs text-muted-foreground">Gráfico</span>
                </div>
              </div>
              {component.data_binding && (
                <div className="mt-2 text-xs text-primary">
                  🔗 Conectado aos dados
                </div>
              )}
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
            <div className="flex items-center gap-1">
              <span className="text-primary">{config.components.length}</span>
              componentes
            </div>
          </div>
        </div>
      </div>

      {/* Canvas Area - RESPONSIVO */}
      <div
        ref={canvasRef}
        className={`relative w-full h-full overflow-auto bg-gradient-to-br from-background to-muted/20 ${
          config.layout.responsive 
            ? 'min-w-[320px] max-w-none' 
            : 'min-w-[1200px]'
        }`}
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
        {/* Grid Container - RESPONSIVO */}
        <div 
          className={`relative ${
            config.layout.responsive 
              ? 'min-h-[600px] w-full px-4 py-4' 
              : 'min-h-[800px] min-w-[1200px]'
          }`}
        >
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
                  <p className="text-sm text-muted-foreground mt-2">
                    Layout {config.layout.responsive ? 'responsivo' : 'fixo'} • 
                    Grid de {config.layout.gridCols} colunas
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Responsive Indicators */}
          {config.layout.responsive && config.components.length > 0 && (
            <div className="fixed bottom-4 right-4 bg-background border border-border rounded-lg p-2 shadow-sm">
              <div className="flex gap-2 text-xs text-muted-foreground">
                <span className="hidden sm:inline">SM</span>
                <span className="hidden md:inline">MD</span>
                <span className="hidden lg:inline">LG</span>
                <span className="hidden xl:inline">XL</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}