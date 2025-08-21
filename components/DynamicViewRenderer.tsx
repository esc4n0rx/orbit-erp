"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AlertCircle } from 'lucide-react'
import type { DynamicViewConfig, ViewComponent } from '@/types/view-builder'

interface DynamicViewRendererProps {
  config: DynamicViewConfig
  currentUser?: any
  onOpenView?: (viewId: string, title: string) => void
}

export default function DynamicViewRenderer({ 
  config, 
  currentUser, 
  onOpenView 
}: DynamicViewRendererProps) {
  
  const renderComponent = (component: ViewComponent): React.ReactNode => {
    const { type, props, id, children } = component

    switch (type) {
      case 'text':
        return (
          <div key={id} className={props.className || ''}>
            {props.variant === 'h1' && (
              <h1 className={`text-3xl font-bold ${props.color === 'primary' ? 'text-primary' : ''}`}>
                {props.content}
              </h1>
            )}
            {props.variant === 'h2' && (
              <h2 className={`text-2xl font-semibold ${props.color === 'primary' ? 'text-primary' : ''}`}>
                {props.content}
              </h2>
            )}
            {props.variant === 'p' && (
              <p className={props.color === 'muted' ? 'text-muted-foreground' : ''}>
                {props.content}
              </p>
            )}
          </div>
        )

      case 'card':
        return (
          <Card key={id} className={props.className || ''}>
            {props.title && (
              <CardHeader>
                <CardTitle>{props.title}</CardTitle>
              </CardHeader>
            )}
            <CardContent>
              {props.content && <p>{props.content}</p>}
              {children?.map(renderComponent)}
            </CardContent>
          </Card>
        )

      case 'button':
        return (
          <Button
            key={id}
            variant={props.variant || 'default'}
            size={props.size || 'default'}
            onClick={() => props.onClick?.()}
            className={props.className || ''}
          >
            {props.text}
          </Button>
        )

      case 'input':
        return (
          <Input
            key={id}
            type={props.type || 'text'}
            placeholder={props.placeholder}
            className={props.className || ''}
          />
        )

      case 'form':
        return (
          <Card key={id} className={props.className || ''}>
            <CardHeader>
              <CardTitle>{props.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {props.fields?.map((field: any, index: number) => (
                  <div key={index} className="space-y-2">
                    <label className="text-sm font-medium">{field.label}</label>
                    <Input
                      type={field.type}
                      placeholder={field.placeholder}
                      required={field.required}
                    />
                  </div>
                ))}
                <Button className="w-full">
                  {props.submitText || 'Enviar'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )

      case 'table':
        return (
          <Card key={id} className={props.className || ''}>
            <CardHeader>
              <CardTitle>{props.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Tabela dinâmica em desenvolvimento
              </div>
            </CardContent>
          </Card>
        )

      default:
        return (
          <div key={id} className="p-4 border border-dashed border-muted rounded">
            <p className="text-muted-foreground">
              Componente "{type}" não implementado
            </p>
          </div>
        )
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header da View */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{config.name}</h1>
          <p className="text-muted-foreground mt-2">{config.description}</p>
        </div>
        <Badge variant="outline" className="bg-orange-50 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
          View Dinâmica
        </Badge>
      </div>

      {/* Renderizar Componentes */}
      <div 
        className={`grid gap-6 ${
          config.layout.responsive 
            ? `grid-cols-1 md:grid-cols-${Math.min(config.layout.gridCols, 3)} lg:grid-cols-${config.layout.gridCols}`
            : `grid-cols-${config.layout.gridCols}`
        } ${config.layout.className || ''}`}
      >
        {config.components.map(renderComponent)}
      </div>

      {/* Metadata da View */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-sm">Informações da View</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-1">
          <p>ID: {config.id}</p>
          <p>Alias: {config.alias}</p>
          <p>Versão: {config.metadata.version}</p>
          <p>Criada em: {new Date(config.metadata.createdAt).toLocaleDateString('pt-BR')}</p>
          <p>Última atualização: {new Date(config.metadata.updatedAt).toLocaleDateString('pt-BR')}</p>
        </CardContent>
      </Card>
    </div>
  )
}