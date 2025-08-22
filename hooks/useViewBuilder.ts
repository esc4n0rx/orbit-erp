import { useState, useCallback } from 'react'
import { 
  saveDevelopmentView, 
  updateDevelopmentView 
} from '@/lib/supabase/view-renderer'
import { getAvailableDataSources } from '@/lib/supabase/data-sources'
import type { DynamicViewConfig, ViewComponent } from '@/types/view-builder'
import type { DataSource, QueryBuilder } from '@/types/data-sources'

export function useViewBuilder(initialConfig?: DynamicViewConfig) {
  const [config, setConfig] = useState<DynamicViewConfig>(
    initialConfig || {
      id: '',
      name: '',
      description: '',
      alias: '',
      components: [],
      data_sources: [],
      queries: [],
      layout: {
        gridCols: 12,
        responsive: true
      },
      metadata: {
        version: '1.0.0',
        createdBy: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }
  )

  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [availableDataSources, setAvailableDataSources] = useState<DataSource[]>([])

  const loadDataSources = useCallback(async () => {
    const { data } = await getAvailableDataSources()
    if (data) {
      setAvailableDataSources(data)
    }
  }, [])

  const updateViewInfo = useCallback((updates: Partial<DynamicViewConfig>) => {
    setConfig(prev => ({
      ...prev,
      ...updates,
      metadata: {
        ...prev.metadata,
        updatedAt: new Date().toISOString()
      }
    }))
  }, [])

  const addComponent = useCallback((component: ViewComponent) => {
    setConfig(prev => ({
      ...prev,
      components: [...prev.components, component],
      metadata: {
        ...prev.metadata,
        updatedAt: new Date().toISOString()
      }
    }))
    setSelectedElement(component.id)
  }, [])

  const updateComponent = useCallback((componentId: string, updates: Partial<ViewComponent>) => {
    setConfig(prev => ({
      ...prev,
      components: prev.components.map(comp =>
        comp.id === componentId ? { ...comp, ...updates } : comp
      ),
      metadata: {
        ...prev.metadata,
        updatedAt: new Date().toISOString()
      }
    }))
  }, [])

  const removeComponent = useCallback((componentId: string) => {
    setConfig(prev => ({
      ...prev,
      components: prev.components.filter(comp => comp.id !== componentId),
      metadata: {
        ...prev.metadata,
        updatedAt: new Date().toISOString()
      }
    }))
    if (selectedElement === componentId) {
      setSelectedElement(null)
    }
  }, [selectedElement])

  const selectElement = useCallback((componentId: string | null) => {
    setSelectedElement(componentId)
  }, [])

  // Data Sources Management
  const addDataSource = useCallback((dataSourceId: string) => {
    setConfig(prev => ({
      ...prev,
      data_sources: [...prev.data_sources, dataSourceId],
      metadata: {
        ...prev.metadata,
        updatedAt: new Date().toISOString()
      }
    }))
  }, [])

  const removeDataSource = useCallback((dataSourceId: string) => {
    setConfig(prev => ({
      ...prev,
      data_sources: prev.data_sources.filter(id => id !== dataSourceId),
      // Remove queries que usam esta data source
      queries: prev.queries.filter(query => !query.data_sources.includes(dataSourceId)),
      metadata: {
        ...prev.metadata,
        updatedAt: new Date().toISOString()
      }
    }))
  }, [])

  // Query Management
  const addQuery = useCallback((query: QueryBuilder) => {
    setConfig(prev => ({
      ...prev,
      queries: [...prev.queries, query],
      metadata: {
        ...prev.metadata,
        updatedAt: new Date().toISOString()
      }
    }))
  }, [])

  const updateQuery = useCallback((queryId: string, updates: Partial<QueryBuilder>) => {
    setConfig(prev => ({
      ...prev,
      queries: prev.queries.map(query =>
        query.id === queryId ? { ...query, ...updates } : query
      ),
      metadata: {
        ...prev.metadata,
        updatedAt: new Date().toISOString()
      }
    }))
  }, [])

  const removeQuery = useCallback((queryId: string) => {
    setConfig(prev => ({
      ...prev,
      queries: prev.queries.filter(query => query.id !== queryId),
      metadata: {
        ...prev.metadata,
        updatedAt: new Date().toISOString()
      }
    }))
  }, [])

  const saveView = useCallback(async (userId: string) => {
    if (!config.name || !config.alias) {
      setError('Nome e alias são obrigatórios')
      return { success: false, error: 'Nome e alias são obrigatórios' }
    }

    setLoading(true)
    setError(null)

    try {
      const viewData = {
        name: config.name,
        description: config.description,
        alias: config.alias,
        schema_json: config,
        created_by: userId,
        status: 'development' as const
      }

      let result: any
      if (config.id) {
        result = await updateDevelopmentView(config.id, viewData)
      } else {
        result = await saveDevelopmentView(viewData)
        if (result.data) {
          setConfig(prev => ({ ...prev, id: result.data!.id }))
        }
      }

      if (result.error) {
        setError(result.error)
        return { success: false, error: result.error }
      }

      return { success: true, data: result.data }
    } catch (err) {
      const errorMsg = 'Erro ao salvar view'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }, [config])

  const resetBuilder = useCallback(() => {
    setConfig({
      id: '',
      name: '',
      description: '',
      alias: '',
      components: [],
      data_sources: [],
      queries: [],
      layout: {
        gridCols: 12,
        responsive: true
      },
      metadata: {
        version: '1.0.0',
        createdBy: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    })
    setSelectedElement(null)
    setError(null)
  }, [])

  return {
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
  }
}