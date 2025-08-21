"use client"

import { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  Settings, 
  Eye, 
  Save, 
  Grid3X3, 
  Type, 
  Square, 
  FileText,
  MousePointer,
  Trash2
} from 'lucide-react'
import ElementsPanel from './ElementsPanel'
import Canvas from './Canvas'
import PropertiesPanel from './PropertiesPanel'
import PreviewModal from './PreviewModal'
import { useViewBuilder } from '@/hooks/useViewBuilder'
import type { DynamicViewConfig, ViewComponent, ElementType } from '@/types/view-builder'

interface ViewBuilderMainProps {
  currentUser: any
  onSuccess?: () => void
}

export default function ViewBuilderMain({ currentUser, onSuccess }: ViewBuilderMainProps) {
  const {
    config,
    selectedElement,
    loading,
    error,
    updateViewInfo,
    addComponent,
    updateComponent,
    removeComponent,
    selectElement,
    saveView,
    resetBuilder
  } = useViewBuilder()

  const [showPreview, setShowPreview] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const handleSave = async () => {
    const result = await saveView(currentUser.id)
    if (result.success) {
      onSuccess?.()
    }
  }

  const handleElementDrop = useCallback((elementType: ElementType, position: { x: number; y: number }) => {
    const newComponent: ViewComponent = {
      id: `element-${Date.now()}`,
      type: elementType.id as any,
      props: { ...elementType.defaultProps },
      position: {
        x: position.x,
        y: position.y,
        w: 6,
        h: 4
      }
    }
    addComponent(newComponent)
  }, [addComponent])

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-xl font-semibold">View Builder</h1>
            <p className="text-sm text-muted-foreground">
              {config.name || 'Nova View'} • {config.components.length} elemento(s)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSettings(true)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Configurações
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(true)}
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>

          <Button
            size="sm"
            onClick={handleSave}
            disabled={loading || !config.name}
          >
            <Save className="h-4 w-4 mr-2" />
            Salvar
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Elements Panel */}
        <div className="w-64 border-r border-border bg-muted/10">
          <ElementsPanel onElementSelect={handleElementDrop} />
        </div>

        {/* Canvas Area */}
        <div className="flex-1 overflow-auto">
          <Canvas
            config={config}
            selectedElement={selectedElement}
            onElementSelect={selectElement}
            onElementUpdate={updateComponent}
            onElementDelete={removeComponent}
          />
        </div>

        {/* Properties Panel */}
        <div className="w-80 border-l border-border bg-muted/10">
          <PropertiesPanel
            selectedElement={selectedElement}
            config={config}
            onElementUpdate={updateComponent}
          />
        </div>
      </div>

      {/* Preview Modal */}
      <PreviewModal
        open={showPreview}
        onClose={() => setShowPreview(false)}
        config={config}
      />

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-96 max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Configurações da View</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="view-name">Nome da View</Label>
                <Input
                  id="view-name"
                  value={config.name}
                  onChange={(e) => updateViewInfo({ name: e.target.value })}
                  placeholder="Digite o nome da view"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="view-description">Descrição</Label>
                <Textarea
                  id="view-description"
                  value={config.description}
                  onChange={(e) => updateViewInfo({ description: e.target.value })}
                  placeholder="Descreva o propósito da view"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="view-alias">Alias (ID único)</Label>
                <Input
                  id="view-alias"
                  value={config.alias}
                  onChange={(e) => updateViewInfo({ alias: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '') })}
                  placeholder="ex: minha-view-01"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="grid-cols">Colunas do Grid</Label>
                <Input
                  id="grid-cols"
                  type="number"
                  min="1"
                  max="12"
                  value={config.layout.gridCols}
                  onChange={(e) => updateViewInfo({ 
                    layout: { ...config.layout, gridCols: parseInt(e.target.value) || 12 }
                  })}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="responsive"
                  checked={config.layout.responsive}
                  onChange={(e) => updateViewInfo({
                    layout: { ...config.layout, responsive: e.target.checked }
                  })}
                />
                <Label htmlFor="responsive">Layout Responsivo</Label>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowSettings(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setShowSettings(false)}>
                  Salvar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {error && (
        <div className="fixed top-4 right-4 bg-destructive text-destructive-foreground p-4 rounded-lg">
          {error}
        </div>
      )}
    </div>
  )
}