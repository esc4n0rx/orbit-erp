import { useState, useEffect } from 'react'
import { getViewRenderConfig } from '@/lib/supabase/view-renderer'
import type { ViewRenderConfig } from '@/types/view-builder'

export function useViewRenderer(viewAlias: string, userRole: string) {
  const [config, setConfig] = useState<ViewRenderConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!viewAlias || !userRole) return

    const loadViewConfig = async () => {
      setLoading(true)
      setError(null)

      try {
        const { data, error: fetchError } = await getViewRenderConfig(viewAlias, userRole)
        
        if (fetchError) {
          setError(fetchError)
          setConfig(null)
        } else {
          setConfig(data)
        }
      } catch (err) {
        setError('Erro ao carregar configuração da view')
        setConfig(null)
      } finally {
        setLoading(false)
      }
    }

    loadViewConfig()
  }, [viewAlias, userRole])

  return { config, loading, error }
}