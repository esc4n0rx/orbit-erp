"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Type, 
  Square, 
  FileText, 
  MousePointer,
  Table,
  BarChart3,
  Search
} from 'lucide-react'
import type { ElementType } from '@/types/view-builder'

const ELEMENT_TYPES: ElementType[] = [
  {
    id: 'text',
    name: 'Texto',
    category: 'display',
    icon: 'Type',
    defaultProps: {
      content: 'Texto de exemplo',
      variant: 'p',
      color: 'default'
    },
    configurable: ['content', 'variant', 'color', 'className']
  },
  {
    id: 'card',
    name: 'Card',
    category: 'layout',
    icon: 'Square',
    defaultProps: {
      title: 'Título do Card',
      content: 'Conteúdo do card'
    },
    configurable: ['title', 'content', 'className']
  },
  {
    id: 'button',
    name: 'Botão',
    category: 'interactive',
    icon: 'MousePointer',
    defaultProps: {
      text: 'Clique aqui',
      variant: 'default',
      size: 'default'
    },
    configurable: ['text', 'variant', 'size', 'className']
  },
  {
    id: 'input',
    name: 'Input',
    category: 'form',
    icon: 'FileText',
    defaultProps: {
      type: 'text',
      placeholder: 'Digite aqui...'
    },
    configurable: ['type', 'placeholder', 'className']
  },
  {
    id: 'form',
    name: 'Formulário',
    category: 'form',
    icon: 'FileText',
    defaultProps: {
      title: 'Formulário',
      fields: [
        { name: 'nome', type: 'text', label: 'Nome', required: true },
        { name: 'email', type: 'email', label: 'E-mail', required: true }
      ],
      submitText: 'Enviar'
    },
    configurable: ['title', 'fields', 'submitText', 'className']
  },
  {
    id: 'table',
    name: 'Tabela',
    category: 'display',
    icon: 'Table',
    defaultProps: {
      title: 'Tabela de Dados',
      columns: ['Coluna 1', 'Coluna 2', 'Coluna 3']
    },
    configurable: ['title', 'columns', 'className']
  }
]

const ICONS = {
  Type,
  Square,
  FileText,
  MousePointer,
  Table,
  BarChart3
}

interface ElementsPanelProps {
  onElementSelect: (element: ElementType, position: { x: number; y: number }) => void
}

export default function ElementsPanel({ onElementSelect }: ElementsPanelProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = [
    { id: 'all', name: 'Todos' },
    { id: 'layout', name: 'Layout' },
    { id: 'form', name: 'Formulário' },
    { id: 'display', name: 'Exibição' },
    { id: 'interactive', name: 'Interativo' }
  ]

  const filteredElements = ELEMENT_TYPES.filter(element => {
    const matchesSearch = element.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || element.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleDragStart = (e: React.DragEvent, element: ElementType) => {
    e.dataTransfer.setData('application/json', JSON.stringify(element))
  }

  return (
    <div className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Elementos</CardTitle>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar elementos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-1">
          {categories.map(category => (
            <Badge
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              className="cursor-pointer text-xs"
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto space-y-2">
        {filteredElements.map(element => {
          const IconComponent = ICONS[element.icon as keyof typeof ICONS] || Square
          
          return (
            <div
              key={element.id}
              draggable
              onDragStart={(e) => handleDragStart(e, element)}
              className="p-3 border border-border rounded-lg cursor-move hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <IconComponent className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-sm">{element.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{element.category}</p>
                </div>
              </div>
            </div>
          )
        })}

        {filteredElements.length === 0 && (
          <div className="text-center py-8 text-muted-foreground text-sm">
            Nenhum elemento encontrado
          </div>
        )}
      </CardContent>
    </div>
  )
}