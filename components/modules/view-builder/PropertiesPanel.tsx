"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Settings, Plus, Trash2 } from 'lucide-react'
import type { DynamicViewConfig, ViewComponent } from '@/types/view-builder'

interface PropertiesPanelProps {
  selectedElement: string | null
  config: DynamicViewConfig
  onElementUpdate: (elementId: string, updates: Partial<ViewComponent>) => void
}

export default function PropertiesPanel({
  selectedElement,
  config,
  onElementUpdate
}: PropertiesPanelProps) {
  const [localProps, setLocalProps] = useState<Record<string, any>>({})

  const selectedComponent = selectedElement 
    ? config.components.find(c => c.id === selectedElement)
    : null

  useEffect(() => {
    if (selectedComponent) {
      setLocalProps(selectedComponent.props)
    }
  }, [selectedComponent])

  const handlePropChange = (key: string, value: any) => {
    const newProps = { ...localProps, [key]: value }
    setLocalProps(newProps)
    
    if (selectedElement) {
      onElementUpdate(selectedElement, { props: newProps })
    }
  }

  const handlePositionChange = (key: string, value: number) => {
    if (selectedElement && selectedComponent) {
      onElementUpdate(selectedElement, {
        position: { ...selectedComponent.position, [key]: value }
      })
    }
  }

  const addFormField = () => {
    if (selectedComponent?.type === 'form') {
      const currentFields = localProps.fields || []
      const newField = {
        name: `campo_${currentFields.length + 1}`,
        type: 'text',
        label: `Campo ${currentFields.length + 1}`,
        required: false
      }
      handlePropChange('fields', [...currentFields, newField])
    }
  }

  const updateFormField = (index: number, field: any) => {
    if (selectedComponent?.type === 'form') {
      const currentFields = [...(localProps.fields || [])]
      currentFields[index] = field
      handlePropChange('fields', currentFields)
    }
  }

  const removeFormField = (index: number) => {
    if (selectedComponent?.type === 'form') {
      const currentFields = localProps.fields || []
      handlePropChange('fields', currentFields.filter((_:any, i:any) => i !== index))
    }
  }

  if (!selectedElement || !selectedComponent) {
    return (
      <div className="h-full flex flex-col">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Propriedades
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-2">
            <Settings className="h-12 w-12 text-muted-foreground mx-auto opacity-50" />
            <p className="text-muted-foreground">
              Selecione um elemento no canvas para editar suas propriedades
            </p>
          </div>
        </CardContent>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Propriedades
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {selectedComponent.type}
          </Badge>
          <span className="text-sm text-muted-foreground">
            ID: {selectedComponent.id.split('-').pop()}
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto space-y-6">
        {/* Position & Size */}
        <div className="space-y-3">
          <h3 className="font-medium text-sm">Posição e Tamanho</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="pos-x" className="text-xs">X</Label>
              <Input
                id="pos-x"
                type="number"
                value={selectedComponent.position.x}
                onChange={(e) => handlePositionChange('x', parseInt(e.target.value) || 0)}
                className="h-8"
              />
            </div>
            <div>
              <Label htmlFor="pos-y" className="text-xs">Y</Label>
              <Input
                id="pos-y"
                type="number"
                value={selectedComponent.position.y}
                onChange={(e) => handlePositionChange('y', parseInt(e.target.value) || 0)}
                className="h-8"
              />
            </div>
            <div>
              <Label htmlFor="pos-w" className="text-xs">Largura</Label>
              <Input
                id="pos-w"
                type="number"
                value={selectedComponent.position.w}
                onChange={(e) => handlePositionChange('w', parseInt(e.target.value) || 1)}
                className="h-8"
              />
            </div>
            <div>
              <Label htmlFor="pos-h" className="text-xs">Altura</Label>
              <Input
                id="pos-h"
                type="number"
                value={selectedComponent.position.h}
                onChange={(e) => handlePositionChange('h', parseInt(e.target.value) || 1)}
                className="h-8"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Element Specific Properties */}
        <div className="space-y-3">
          <h3 className="font-medium text-sm">Propriedades do Elemento</h3>

          {/* Text Element */}
          {selectedComponent.type === 'text' && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="text-content" className="text-xs">Conteúdo</Label>
                <Textarea
                  id="text-content"
                  value={localProps.content || ''}
                  onChange={(e) => handlePropChange('content', e.target.value)}
                  rows={3}
                  className="text-sm"
                />
              </div>
              <div>
                <Label htmlFor="text-variant" className="text-xs">Variante</Label>
                <Select value={localProps.variant || 'p'} onValueChange={(value) => handlePropChange('variant', value)}>
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="h1">Título H1</SelectItem>
                    <SelectItem value="h2">Título H2</SelectItem>
                    <SelectItem value="p">Parágrafo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="text-color" className="text-xs">Cor</Label>
                <Select value={localProps.color || 'default'} onValueChange={(value) => handlePropChange('color', value)}>
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Padrão</SelectItem>
                    <SelectItem value="primary">Primária</SelectItem>
                    <SelectItem value="muted">Atenuada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Card Element */}
          {selectedComponent.type === 'card' && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="card-title" className="text-xs">Título</Label>
                <Input
                  id="card-title"
                  value={localProps.title || ''}
                  onChange={(e) => handlePropChange('title', e.target.value)}
                  className="h-8"
                />
              </div>
              <div>
                <Label htmlFor="card-content" className="text-xs">Conteúdo</Label>
                <Textarea
                  id="card-content"
                  value={localProps.content || ''}
                  onChange={(e) => handlePropChange('content', e.target.value)}
                  rows={3}
                  className="text-sm"
                />
              </div>
            </div>
          )}

          {/* Button Element */}
          {selectedComponent.type === 'button' && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="button-text" className="text-xs">Texto</Label>
                <Input
                  id="button-text"
                  value={localProps.text || ''}
                  onChange={(e) => handlePropChange('text', e.target.value)}
                  className="h-8"
                />
              </div>
              <div>
                <Label htmlFor="button-variant" className="text-xs">Variante</Label>
                <Select value={localProps.variant || 'default'} onValueChange={(value) => handlePropChange('variant', value)}>
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Padrão</SelectItem>
                    <SelectItem value="destructive">Destrutivo</SelectItem>
                    <SelectItem value="outline">Contorno</SelectItem>
                    <SelectItem value="secondary">Secundário</SelectItem>
                    <SelectItem value="ghost">Ghost</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="button-size" className="text-xs">Tamanho</Label>
                <Select value={localProps.size || 'default'} onValueChange={(value) => handlePropChange('size', value)}>
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sm">Pequeno</SelectItem>
                    <SelectItem value="default">Padrão</SelectItem>
                    <SelectItem value="lg">Grande</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Input Element */}
          {selectedComponent.type === 'input' && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="input-type" className="text-xs">Tipo</Label>
                <Select value={localProps.type || 'text'} onValueChange={(value) => handlePropChange('type', value)}>
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Texto</SelectItem>
                    <SelectItem value="email">E-mail</SelectItem>
                    <SelectItem value="password">Senha</SelectItem>
                    <SelectItem value="number">Número</SelectItem>
                    <SelectItem value="tel">Telefone</SelectItem>
                    <SelectItem value="url">URL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="input-placeholder" className="text-xs">Placeholder</Label>
                <Input
                  id="input-placeholder"
                  value={localProps.placeholder || ''}
                  onChange={(e) => handlePropChange('placeholder', e.target.value)}
                  className="h-8"
                />
              </div>
            </div>
          )}

          {/* Form Element */}
          {selectedComponent.type === 'form' && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="form-title" className="text-xs">Título</Label>
                <Input
                  id="form-title"
                  value={localProps.title || ''}
                  onChange={(e) => handlePropChange('title', e.target.value)}
                  className="h-8"
                />
              </div>
              <div>
                <Label htmlFor="form-submit" className="text-xs">Texto do Botão</Label>
                <Input
                  id="form-submit"
                  value={localProps.submitText || ''}
                  onChange={(e) => handlePropChange('submitText', e.target.value)}
                  className="h-8"
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-xs">Campos</Label>
                  <Button size="sm" variant="outline" onClick={addFormField} className="h-6 w-6 p-0">
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {(localProps.fields || []).map((field: any, index: number) => (
                    <div key={index} className="p-2 border border-border rounded text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Campo {index + 1}</span>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => removeFormField(index)}
                          className="h-4 w-4 p-0"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <Input
                        placeholder="Nome do campo"
                        value={field.name || ''}
                        onChange={(e) => updateFormField(index, { ...field, name: e.target.value })}
                        className="h-6"
                      />
                      <Input
                        placeholder="Label"
                        value={field.label || ''}
                        onChange={(e) => updateFormField(index, { ...field, label: e.target.value })}
                        className="h-6"
                      />
                      <Select 
                        value={field.type || 'text'} 
                        onValueChange={(value) => updateFormField(index, { ...field, type: value })}
                      >
                        <SelectTrigger className="h-6">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Texto</SelectItem>
                          <SelectItem value="email">E-mail</SelectItem>
                          <SelectItem value="password">Senha</SelectItem>
                          <SelectItem value="number">Número</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Table Element */}
          {selectedComponent.type === 'table' && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="table-title" className="text-xs">Título</Label>
                <Input
                  id="table-title"
                  value={localProps.title || ''}
                  onChange={(e) => handlePropChange('title', e.target.value)}
                  className="h-8"
                />
              </div>
              <div>
                <Label htmlFor="table-columns" className="text-xs">Colunas (separadas por vírgula)</Label>
                <Textarea
                  id="table-columns"
                  value={(localProps.columns || []).join(', ')}
                  onChange={(e) => handlePropChange('columns', e.target.value.split(',').map(s => s.trim()))}
                  rows={2}
                  className="text-sm"
                />
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* CSS Classes */}
        <div className="space-y-3">
          <h3 className="font-medium text-sm">Estilo Avançado</h3>
          <div>
            <Label htmlFor="css-classes" className="text-xs">Classes CSS</Label>
            <Input
              id="css-classes"
              value={localProps.className || ''}
              onChange={(e) => handlePropChange('className', e.target.value)}
              placeholder="ex: bg-red-500 p-4"
              className="h-8 text-xs"
            />
          </div>
        </div>
      </CardContent>
    </div>
  )
}