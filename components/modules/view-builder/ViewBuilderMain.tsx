"use client"

import { useState, useCallback, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Settings, 
  Eye, 
  Save, 
  Grid3X3, 
  Type, 
  Square, 
  FileText,
  MousePointer,
  Trash2,
  Database,
  Play
} from 'lucide-react'
import ElementsPanel from './ElementsPanel'
import Canvas from './Canvas'
import PropertiesPanel from './PropertiesPanel'
import PreviewModal from './PreviewModal'
import DataSourcesPanel from './DataSourcesPanel'
import QueryBuilder from './QueryBuilder'
import { useViewBuilder } from '@/hooks/useViewBuilder'
import { executeCustomQuery } from '@/lib/supabase/data-sources'
import type { DynamicViewConfig, ViewComponent, ElementType } from '@/types/view-builder'
import type { DataSource, QueryBuilder as QueryBuilderType } from '@/types/data-sources'

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
    availableDataSources,
    updateViewInfo,
    addComponent,
    updateComponent,
    removeComponent,
    selectElement,
    addDataSource,
    removeDataSource,
    addQuery,
    updateQuery,
    removeQuery,
    loadDataSources,
    saveView,
    resetBuilder
  } = useViewBuilder()

  const [showPreview, setShowPreview] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showQueryBuilder, setShowQueryBuilder] = useState(false)
  const [selectedDataSourceForQuery, setSelectedDataSourceForQuery] = useState<DataSource | null>(null)
  const [activeTab, setActiveTab] = useState<'elements' | 'data'>('elements')

  useEffect(() => {
    loadDataSources()
  }, [loadDataSources])

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
        w: elementType.id === 'table' || elementType.id === 'data_table' ? 8 : 6,
        h: elementType.id === 'table' || elementType.id === 'data_table' ? 6 : 4
      }
    }
    addComponent(newComponent)
  }, [addComponent])

  const handleDataSourceSelect = useCallback((dataSourceId: string) => {
    addDataSource(dataSourceId)
  }, [addDataSource])

  const handleDataSourceRemove = useCallback((dataSourceId: string) => {
    removeDataSource(dataSourceId)
  }, [removeDataSource])

  const handleQueryBuilder = useCallback((dataSource: DataSource) => {
    setSelectedDataSourceForQuery(dataSource)
    setShowQueryBuilder(true)
  }, [])

  const handleQuerySave = useCallback((query: QueryBuilderType) => {
    addQuery(query)
    setShowQueryBuilder(false)
    setSelectedDataSourceForQuery(null)
  }, [addQuery])

  const handleQueryTest = useCallback(async (query: QueryBuilderType) => {
    try {
      // Construir uma query SQL básica para teste
      const fields = query.fields.map(field => 
        field.aggregation 
          ? `${field.aggregation.toUpperCase()}(${field.source_table}.${field.column_name}) as ${field.alias || field.column_name}`
          : `${field.source_table}.${field.column_name}${field.alias ? ` as ${field.alias}` : ''}`
      ).join(', ')

      const mainTable = query.fields[0]?.source_table
      if (!mainTable) {
        alert('Selecione pelo menos um campo para testar')
        return
      }

      let sql = `SELECT ${fields} FROM ${mainTable}`

      // Adicionar JOINs
      query.joins.forEach(join => {
        sql += ` ${join.join_type} JOIN ${join.target_table} ON ${join.source_table}.${join.source_column} = ${join.target_table}.${join.target_column}`
      })

      // Adicionar WHERE
      if (query.filters.length > 0) {
        const conditions = query.filters.map((filter, index) => {
          const operator = filter.operator === 'equals' ? '=' : 
                          filter.operator === 'not_equals' ? '!=' :
                          filter.operator === 'greater_than' ? '>' :
                          filter.operator === 'less_than' ? '<' :
                          filter.operator === 'contains' ? 'ILIKE' : '='
          
          const value = filter.operator === 'contains' ? `'%${filter.value}%'` : `'${filter.value}'`
          const condition = `${filter.source_table}.${filter.column_name} ${operator} ${value}`
          
          return index === 0 ? condition : `${filter.logical_operator || 'AND'} ${condition}`
        }).join(' ')
        
        sql += ` WHERE ${conditions}`
      }

      // Adicionar LIMIT
      if (query.limit) {
        sql += ` LIMIT ${query.limit}`
      }

      console.log('SQL Query:', sql)

      const result = await executeCustomQuery(sql)
      
      if (result.error) {
        alert(`Erro na consulta: ${result.error}`)
      } else {
        alert(`Consulta executada com sucesso! ${result.data?.length || 0} registros encontrados.\n\nQuery: ${sql}`)
      }
    } catch (error) {
      alert('Erro ao testar consulta: ' + error)
    }
  }, [])

  const getSelectedDataSources = useCallback(() => {
    return availableDataSources.filter(ds => config.data_sources.includes(ds.id))
  }, [availableDataSources, config.data_sources])

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-xl font-semibold">View Builder</h1>
            <p className="text-sm text-muted-foreground">
              {config.name || 'Nova View'} • {config.components.length} elemento(s) • {config.data_sources.length} fonte(s) de dados
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
            disabled={config.components.length === 0}
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
        {/* Left Panel - Elements & Data Sources */}
        <div className="w-80 border-r border-border bg-muted/10">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="grid w-full grid-cols-2 m-2">
              <TabsTrigger value="elements" className="flex items-center gap-2">
                <Square className="h-4 w-4" />
                Elementos
              </TabsTrigger>
              <TabsTrigger value="data" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Dados
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="elements" className="h-[calc(100vh-140px)] overflow-hidden">
              <ElementsPanel onElementDrop={handleElementDrop} />
            </TabsContent>
            
            <TabsContent value="data" className="h-[calc(100vh-140px)] overflow-hidden">
              <DataSourcesPanel
                selectedDataSources={config.data_sources}
                onDataSourceSelect={handleDataSourceSelect}
                onDataSourceRemove={handleDataSourceRemove}
                onQueryBuilder={handleQueryBuilder}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 overflow-auto">
          <Canvas
            config={config}
            selectedElement={selectedElement}
            onElementSelect={selectElement}
            onElementUpdate={updateComponent}
            onElementDelete={removeComponent}
            onElementAdd={addComponent}
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

      {/* Query Builder Modal */}
      {showQueryBuilder && selectedDataSourceForQuery && (
        <QueryBuilder
          dataSources={getSelectedDataSources()}
          onQuerySave={handleQuerySave}
          onQueryTest={handleQueryTest}
          onClose={() => {
            setShowQueryBuilder(false)
            setSelectedDataSourceForQuery(null)
          }}
        />
      )}

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

      {/* Error Display */}
      {error && (
        <div className="fixed top-4 right-4 bg-destructive text-destructive-foreground p-4 rounded-lg shadow-lg z-50">
          <div className="flex items-center gap-2">
            <span>{error}</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => window.location.reload()}
              className="text-destructive-foreground hover:text-destructive-foreground"
            >
              ×
            </Button>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-40">
          <div className="bg-background p-4 rounded-lg shadow-lg flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            <span>Salvando...</span>
          </div>
        </div>
      )}
    </div>
  )
}