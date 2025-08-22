export interface DataSource {
  id: string
  name: string
  type: 'table' | 'view' | 'custom_query'
  table_name?: string
  schema?: string
  columns: DataSourceColumn[]
  relationships?: DataSourceRelationship[]
  created_at: string
  updated_at: string
}

export interface DataSourceColumn {
  name: string
  type: 'text' | 'number' | 'date' | 'boolean' | 'json'
  nullable: boolean
  default_value?: any
  description?: string
}

export interface DataSourceRelationship {
  id: string
  source_table: string
  source_column: string
  target_table: string
  target_column: string
  relationship_type: 'one_to_one' | 'one_to_many' | 'many_to_many'
}

export interface QueryBuilder {
  id: string
  name: string
  data_sources: string[]
  fields: QueryField[]
  filters: QueryFilter[]
  joins: QueryJoin[]
  group_by?: string[]
  order_by?: QueryOrderBy[]
  limit?: number
}

export interface QueryField {
  source_table: string
  column_name: string
  alias?: string
  aggregation?: 'count' | 'sum' | 'avg' | 'min' | 'max'
}

export interface QueryFilter {
  source_table: string
  column_name: string
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'in' | 'between'
  value: any
  logical_operator?: 'AND' | 'OR'
}

export interface QueryJoin {
  source_table: string
  source_column: string
  target_table: string
  target_column: string
  join_type: 'INNER' | 'LEFT' | 'RIGHT' | 'FULL'
}

export interface QueryOrderBy {
  source_table: string
  column_name: string
  direction: 'ASC' | 'DESC'
}

export interface ViewDataBinding {
  component_id: string
  query_id: string
  field_mappings: Record<string, string>
  refresh_interval?: number
  cache_enabled?: boolean
}