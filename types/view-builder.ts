import { QueryBuilder, ViewDataBinding } from './data-sources'

export interface ViewComponent {
  id: string
  type: 'text' | 'form' | 'table' | 'chart' | 'card' | 'button' | 'input' | 'data_table' | 'data_chart'
  props: Record<string, any>
  position: {
    x: number
    y: number
    w: number
    h: number
  }
  children?: ViewComponent[]
  data_binding?: ViewDataBinding
}

export interface DynamicViewConfig {
  id: string
  name: string
  description: string
  alias: string
  components: ViewComponent[]
  data_sources: string[]
  queries: QueryBuilder[]
  layout: {
    gridCols: number
    responsive: boolean
    className?: string
  }
  metadata: {
    version: string
    createdBy: string
    createdAt: string
    updatedAt: string
  }
}

export interface ViewRenderConfig {
  viewId: string
  viewType: 'database' | 'development' | 'hardcoded'
  componentPath?: string
  config?: DynamicViewConfig
}

export interface DatabaseView {
  id: string
  module_id: string
  name: string
  description: string
  alias: string
  component_path: string
  required_roles: string[]
  required_permissions: string[]
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

export interface DevelopmentView {
  id: string
  name: string
  description: string
  alias: string
  schema_json: DynamicViewConfig
  created_by: string
  status: 'development' | 'testing' | 'ready' | 'published'
  created_at: string
  updated_at: string
}

// Tipos para o construtor visual
export interface ElementType {
  id: string
  name: string
  category: 'layout' | 'form' | 'display' | 'interactive' | 'data'
  icon: string
  defaultProps: Record<string, any>
  configurable: string[]
  requiresDataSource?: boolean
}

export interface BuilderState {
  selectedElement: string | null
  draggedElement: ElementType | null
  previewMode: boolean
  gridSize: number
  snapToGrid: boolean
  showDataSources: boolean
}

// Importar tipos de data sources
export type { 
  DataSource, 
  QueryBuilder, 
  ViewDataBinding 
} from './data-sources'