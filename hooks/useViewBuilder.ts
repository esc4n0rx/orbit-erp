import { useState, useCallback } from 'react'
import { 
  saveDevelopmentView, 
  updateDevelopmentView 
} from '@/lib/supabase/view-renderer'
import type { DynamicViewConfig, ViewComponent } from '@/types/view-builder'

export function useViewBuilder(initialConfig?: DynamicViewConfig) {
  const [config, setConfig] = useState<DynamicViewConfig>(
    initialConfig || {
      id: '',
      name: '',
      description: '',
      alias: '',
      components: [],
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

      let result:any
      if (config.id) {
        // Atualizar view existente
        result = await updateDevelopmentView(config.id, viewData)
      } else {
        // Criar nova view
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
    updateViewInfo,
    addComponent,
    updateComponent,
    removeComponent,
    selectElement,
    saveView,
    resetBuilder
  }
}