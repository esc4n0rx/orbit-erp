"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Database, 
  Table, 
  Search, 
  Plus, 
  Settings,
  Cable,
  Eye,
  RefreshCw
} from 'lucide-react'
import { getAvailableDataSources, testDataSourceConnection } from '@/lib/supabase/data-sources'
import type { DataSource } from '@/types/data-sources'

interface DataSourcesPanelProps {
  selectedDataSources: string[]
  onDataSourceSelect: (dataSourceId: string) => void
  onDataSourceRemove: (dataSourceId: string) => void
  onQueryBuilder: (dataSource: DataSource) => void
}

export default function DataSourcesPanel({
  selectedDataSources,
  onDataSourceSelect,
  onDataSourceRemove,
  onQueryBuilder
}: DataSourcesPanelProps) {
  const [dataSources, setDataSources] = useState<DataSource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [testingConnection, setTestingConnection] = useState<string | null>(null)

  useEffect(() => {
    loadDataSources()
  }, [])

  const loadDataSources = async () => {
    setLoading(true)
    setError(null)

    try {
      const { data, error: fetchError } = await getAvailableDataSources()
      
      if (fetchError) {
        setError(fetchError)
      } else {
        setDataSources(data || [])
      }
    } catch (err) {
      setError('Erro ao carregar fontes de dados')
    } finally {
      setLoading(false)
    }
  }

  const handleTestConnection = async (dataSource: DataSource) => {
    if (!dataSource.table_name) return

    setTestingConnection(dataSource.id)
    
    try {
      const result = await testDataSourceConnection(dataSource.table_name)
      
      if (result.success) {
        alert(`Conexão bem-sucedida! Exemplo de dados encontrados: ${result.sampleData?.length || 0} registros`)
      } else {
        alert(`Erro na conexão: ${result.error}`)
      }
    } catch (err) {
      alert('Erro ao testar conexão')
    } finally {
      setTestingConnection(null)
    }
  }

  const filteredDataSources = dataSources.filter(ds =>
    ds.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ds.table_name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const isSelected = (dataSourceId: string) => selectedDataSources.includes(dataSourceId)

  return (
    <div className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Database className="h-5 w-5" />
          Fontes de Dados
        </CardTitle>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar tabelas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={loadDataSources}
            disabled={loading}
            className="flex-1"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden">
        {/* Selected Data Sources */}
        {selectedDataSources.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">Selecionadas ({selectedDataSources.length})</h3>
            <div className="space-y-2">
              {selectedDataSources.map(dsId => {
                const dataSource = dataSources.find(ds => ds.id === dsId)
                if (!dataSource) return null

                return (
                  <div
                    key={dsId}
                    className="flex items-center justify-between p-2 border border-primary/50 rounded-lg bg-primary/5"
                  >
                    <div className="flex items-center gap-2">
                      <Table className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">{dataSource.name}</span>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onQueryBuilder(dataSource)}
                        className="h-6 w-6 p-0"
                      >
                        <Settings className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDataSourceRemove(dsId)}
                        className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
            <Separator className="my-4" />
          </div>
        )}

        {/* Available Data Sources */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Disponíveis</h3>
          
          <ScrollArea className="h-[400px]">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                Carregando fontes de dados...
              </div>
            ) : error ? (
              <div className="text-center py-8 text-destructive text-sm">
                {error}
              </div>
            ) : filteredDataSources.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                Nenhuma fonte de dados encontrada
              </div>
            ) : (
              <div className="space-y-2">
                {filteredDataSources.map(dataSource => (
                  <div
                    key={dataSource.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      isSelected(dataSource.id)
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Table className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-sm">{dataSource.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {dataSource.table_name} • {dataSource.columns.length} colunas
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-1">
                        {dataSource.table_name && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleTestConnection(dataSource)
                            }}
                            disabled={testingConnection === dataSource.id}
                            className="h-6 w-6 p-0"
                          >
                            <Cable className="h-3 w-3" />
                          </Button>
                        )}
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            if (isSelected(dataSource.id)) {
                              onDataSourceRemove(dataSource.id)
                            } else {
                              onDataSourceSelect(dataSource.id)
                            }
                          }}
                          className="h-6 w-6 p-0"
                        >
                          {isSelected(dataSource.id) ? '−' : '+'}
                        </Button>
                      </div>
                    </div>

                    {/* Columns Preview */}
                    <div className="mt-2 flex flex-wrap gap-1">
                      {dataSource.columns.slice(0, 4).map(column => (
                        <Badge
                          key={column.name}
                          variant="outline"
                          className="text-xs"
                        >
                          {column.name}
                        </Badge>
                      ))}
                      {dataSource.columns.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{dataSource.columns.length - 4} mais
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </CardContent>
    </div>
  )
}