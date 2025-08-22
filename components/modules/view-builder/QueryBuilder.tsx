"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Plus, 
  Trash2, 
  Play, 
  Save,
  Filter,
  ArrowRight,
  Table
} from 'lucide-react'
import type { DataSource, QueryBuilder as QueryBuilderType, QueryField, QueryFilter, QueryJoin } from '@/types/data-sources'

interface QueryBuilderProps {
  dataSources: DataSource[]
  onQuerySave: (query: QueryBuilderType) => void
  onQueryTest: (query: QueryBuilderType) => void
  onClose: () => void
  initialQuery?: QueryBuilderType
}

export default function QueryBuilder({
  dataSources,
  onQuerySave,
  onQueryTest,
  onClose,
  initialQuery
}: QueryBuilderProps) {
  const [query, setQuery] = useState<QueryBuilderType>(
    initialQuery || {
      id: `query-${Date.now()}`,
      name: '',
      data_sources: [],
      fields: [],
      filters: [],
      joins: [],
      limit: 100
    }
  )

  const [activeTab, setActiveTab] = useState<'fields' | 'filters' | 'joins'>('fields')

  const addField = () => {
    const newField: QueryField = {
      source_table: dataSources[0]?.table_name || '',
      column_name: '',
      alias: ''
    }
    setQuery(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }))
  }

  const updateField = (index: number, updates: Partial<QueryField>) => {
    setQuery(prev => ({
      ...prev,
      fields: prev.fields.map((field, i) => 
        i === index ? { ...field, ...updates } : field
      )
    }))
  }

  const removeField = (index: number) => {
    setQuery(prev => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index)
    }))
  }

  const addFilter = () => {
    const newFilter: QueryFilter = {
      source_table: dataSources[0]?.table_name || '',
      column_name: '',
      operator: 'equals',
      value: ''
    }
    setQuery(prev => ({
      ...prev,
      filters: [...prev.filters, newFilter]
    }))
  }

  const updateFilter = (index: number, updates: Partial<QueryFilter>) => {
    setQuery(prev => ({
      ...prev,
      filters: prev.filters.map((filter, i) => 
        i === index ? { ...filter, ...updates } : filter
      )
    }))
  }

  const removeFilter = (index: number) => {
    setQuery(prev => ({
      ...prev,
      filters: prev.filters.filter((_, i) => i !== index)
    }))
  }

  const addJoin = () => {
    if (dataSources.length < 2) return

    const newJoin: QueryJoin = {
      source_table: dataSources[0]?.table_name || '',
      source_column: '',
      target_table: dataSources[1]?.table_name || '',
      target_column: '',
      join_type: 'INNER'
    }
    setQuery(prev => ({
      ...prev,
      joins: [...prev.joins, newJoin]
    }))
  }

  const updateJoin = (index: number, updates: Partial<QueryJoin>) => {
    setQuery(prev => ({
      ...prev,
      joins: prev.joins.map((join, i) => 
        i === index ? { ...join, ...updates } : join
      )
    }))
  }

  const removeJoin = (index: number) => {
    setQuery(prev => ({
      ...prev,
      joins: prev.joins.filter((_, i) => i !== index)
    }))
  }

  const getColumnsForTable = (tableName: string) => {
    const dataSource = dataSources.find(ds => ds.table_name === tableName)
    return dataSource?.columns || []
  }

  const tabs = [
    { id: 'fields', name: 'Campos', icon: Table },
    { id: 'filters', name: 'Filtros', icon: Filter },
    { id: 'joins', name: 'Relacionamentos', icon: ArrowRight }
  ]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-[90vw] max-w-4xl h-[90vh] flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Construtor de Consulta</CardTitle>
            <Button variant="ghost" onClick={onClose}>×</Button>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="query-name">Nome da Consulta</Label>
            <Input
              id="query-name"
              value={query.name}
              onChange={(e) => setQuery(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Relatório de Materiais por Categoria"
            />
          </div>

          {/* Tabs */}
          <div className="flex gap-1">
            {tabs.map(tab => {
              const IconComponent = tab.icon
              return (
                <Button
                  key={tab.id}
                  size="sm"
                  variant={activeTab === tab.id ? 'default' : 'outline'}
                  onClick={() => setActiveTab(tab.id as any)}
                  className="flex items-center gap-2"
                >
                  <IconComponent className="h-4 w-4" />
                  {tab.name}
                </Button>
              )
            })}
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            {/* Fields Tab */}
            {activeTab === 'fields' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Campos Selecionados</h3>
                  <Button size="sm" onClick={addField}>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Campo
                  </Button>
                </div>

                <div className="space-y-3">
                  {query.fields.map((field, index) => (
                   <div key={index} className="flex items-end gap-3 p-3 border border-border rounded-lg">
                      <div className="flex-1 space-y-2">
                        <Label>Tabela</Label>
                        <Select
                          value={field.source_table}
                          onValueChange={(value) => updateField(index, { source_table: value, column_name: '' })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a tabela" />
                          </SelectTrigger>
                          <SelectContent>
                            {dataSources.map(ds => (
                              <SelectItem key={ds.id} value={ds.table_name || ''}>
                                {ds.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex-1 space-y-2">
                        <Label>Coluna</Label>
                        <Select
                          value={field.column_name}
                          onValueChange={(value) => updateField(index, { column_name: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a coluna" />
                          </SelectTrigger>
                          <SelectContent>
                            {getColumnsForTable(field.source_table).map(column => (
                              <SelectItem key={column.name} value={column.name}>
                                {column.name} ({column.type})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex-1 space-y-2">
                        <Label>Alias (Opcional)</Label>
                        <Input
                          value={field.alias || ''}
                          onChange={(e) => updateField(index, { alias: e.target.value })}
                          placeholder="Nome para exibição"
                        />
                      </div>

                      <div className="flex-1 space-y-2">
                        <Label>Agregação</Label>
                        <Select
                          value={field.aggregation || ''}
                          onValueChange={(value) => updateField(index, { aggregation: value as any })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Nenhuma" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Nenhuma</SelectItem>
                            <SelectItem value="count">COUNT</SelectItem>
                            <SelectItem value="sum">SUM</SelectItem>
                            <SelectItem value="avg">AVG</SelectItem>
                            <SelectItem value="min">MIN</SelectItem>
                            <SelectItem value="max">MAX</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeField(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  {query.fields.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      Nenhum campo selecionado. Clique em "Adicionar Campo" para começar.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Filters Tab */}
            {activeTab === 'filters' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Filtros</h3>
                  <Button size="sm" onClick={addFilter}>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Filtro
                  </Button>
                </div>

                <div className="space-y-3">
                  {query.filters.map((filter, index) => (
                    <div key={index} className="flex items-end gap-3 p-3 border border-border rounded-lg">
                      <div className="flex-1 space-y-2">
                        <Label>Tabela</Label>
                        <Select
                          value={filter.source_table}
                          onValueChange={(value) => updateFilter(index, { source_table: value, column_name: '' })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a tabela" />
                          </SelectTrigger>
                          <SelectContent>
                            {dataSources.map(ds => (
                              <SelectItem key={ds.id} value={ds.table_name || ''}>
                                {ds.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex-1 space-y-2">
                        <Label>Coluna</Label>
                        <Select
                          value={filter.column_name}
                          onValueChange={(value) => updateFilter(index, { column_name: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a coluna" />
                          </SelectTrigger>
                          <SelectContent>
                            {getColumnsForTable(filter.source_table).map(column => (
                              <SelectItem key={column.name} value={column.name}>
                                {column.name} ({column.type})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex-1 space-y-2">
                        <Label>Operador</Label>
                        <Select
                          value={filter.operator}
                          onValueChange={(value) => updateFilter(index, { operator: value as any })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="equals">Igual a</SelectItem>
                            <SelectItem value="not_equals">Diferente de</SelectItem>
                            <SelectItem value="greater_than">Maior que</SelectItem>
                            <SelectItem value="less_than">Menor que</SelectItem>
                            <SelectItem value="contains">Contém</SelectItem>
                            <SelectItem value="in">Em</SelectItem>
                            <SelectItem value="between">Entre</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex-1 space-y-2">
                        <Label>Valor</Label>
                        <Input
                          value={filter.value}
                          onChange={(e) => updateFilter(index, { value: e.target.value })}
                          placeholder="Valor do filtro"
                        />
                      </div>

                      {index > 0 && (
                        <div className="flex-1 space-y-2">
                          <Label>Operador Lógico</Label>
                          <Select
                            value={filter.logical_operator || 'AND'}
                            onValueChange={(value) => updateFilter(index, { logical_operator: value as any })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="AND">E (AND)</SelectItem>
                              <SelectItem value="OR">OU (OR)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFilter(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  {query.filters.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      Nenhum filtro definido. Os filtros permitem refinar os resultados da consulta.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Joins Tab */}
            {activeTab === 'joins' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Relacionamentos (JOINs)</h3>
                  <Button 
                    size="sm" 
                    onClick={addJoin}
                    disabled={dataSources.length < 2}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Relacionamento
                  </Button>
                </div>

                {dataSources.length < 2 && (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    Você precisa de pelo menos 2 fontes de dados para criar relacionamentos.
                  </div>
                )}

                <div className="space-y-3">
                  {query.joins.map((join, index) => (
                    <div key={index} className="flex items-end gap-3 p-3 border border-border rounded-lg">
                      <div className="flex-1 space-y-2">
                        <Label>Tabela Origem</Label>
                        <Select
                          value={join.source_table}
                          onValueChange={(value) => updateJoin(index, { source_table: value, source_column: '' })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Tabela origem" />
                          </SelectTrigger>
                          <SelectContent>
                            {dataSources.map(ds => (
                              <SelectItem key={ds.id} value={ds.table_name || ''}>
                                {ds.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex-1 space-y-2">
                        <Label>Coluna Origem</Label>
                        <Select
                          value={join.source_column}
                          onValueChange={(value) => updateJoin(index, { source_column: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Coluna origem" />
                          </SelectTrigger>
                          <SelectContent>
                            {getColumnsForTable(join.source_table).map(column => (
                              <SelectItem key={column.name} value={column.name}>
                                {column.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex-1 space-y-2">
                        <Label>Tipo JOIN</Label>
                        <Select
                          value={join.join_type}
                          onValueChange={(value) => updateJoin(index, { join_type: value as any })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="INNER">INNER JOIN</SelectItem>
                            <SelectItem value="LEFT">LEFT JOIN</SelectItem>
                            <SelectItem value="RIGHT">RIGHT JOIN</SelectItem>
                            <SelectItem value="FULL">FULL JOIN</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex-1 space-y-2">
                        <Label>Tabela Destino</Label>
                        <Select
                          value={join.target_table}
                          onValueChange={(value) => updateJoin(index, { target_table: value, target_column: '' })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Tabela destino" />
                          </SelectTrigger>
                          <SelectContent>
                            {dataSources.map(ds => (
                              <SelectItem key={ds.id} value={ds.table_name || ''}>
                                {ds.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex-1 space-y-2">
                        <Label>Coluna Destino</Label>
                        <Select
                          value={join.target_column}
                          onValueChange={(value) => updateJoin(index, { target_column: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Coluna destino" />
                          </SelectTrigger>
                          <SelectContent>
                            {getColumnsForTable(join.target_table).map(column => (
                              <SelectItem key={column.name} value={column.name}>
                                {column.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeJoin(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  {query.joins.length === 0 && dataSources.length >= 2 && (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      Nenhum relacionamento definido. Use JOINs para combinar dados de múltiplas tabelas.
                    </div>
                  )}
                </div>
              </div>
            )}
          </ScrollArea>
        </CardContent>

        {/* Footer */}
        <div className="border-t p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="space-y-1">
              <Label htmlFor="query-limit">Limite de Registros</Label>
              <Input
                id="query-limit"
                type="number"
                value={query.limit || 100}
                onChange={(e) => setQuery(prev => ({ ...prev, limit: parseInt(e.target.value) || 100 }))}
                className="w-24"
                min="1"
                max="10000"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              variant="outline"
              onClick={() => onQueryTest(query)}
              disabled={query.fields.length === 0}
            >
              <Play className="h-4 w-4 mr-2" />
              Testar
            </Button>
            <Button
              onClick={() => onQuerySave(query)}
              disabled={!query.name || query.fields.length === 0}
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}