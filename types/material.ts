export interface Category {
    id: string
    codigo_interno: string
    grupo_mercadoria: string
    categoria: string
    subcategoria?: string
    secao?: string
    descricao_detalhada?: string
    unidade_padrao?: string
    controle_lote: boolean
    controle_serie: boolean
    status: 'active' | 'inactive'
    created_at: string
    updated_at: string
    created_by: string
    updated_by: string
  }
  
  export interface CreateCategoryData {
    codigo_interno: string
    grupo_mercadoria: string
    categoria: string
    subcategoria?: string
    secao?: string
    descricao_detalhada?: string
    unidade_padrao?: string
    controle_lote: boolean
    controle_serie: boolean
    status: 'active' | 'inactive'
  }
  
  export interface UpdateCategoryData {
    codigo_interno?: string
    grupo_mercadoria?: string
    categoria?: string
    subcategoria?: string
    secao?: string
    descricao_detalhada?: string
    unidade_padrao?: string
    controle_lote?: boolean
    controle_serie?: boolean
    status?: 'active' | 'inactive'
  }
  
  export interface Deposit {
    id: string
    nome: string
    codigo: string
    endereco?: string
    responsavel?: string
    capacidade_maxima?: number
    tipos_produtos_aceitos: string[]
    controle_zonas?: string
    status: 'active' | 'inactive'
    permite_transferencia: boolean
    observacoes?: string
    created_at: string
    updated_at: string
    created_by: string
    updated_by: string
  }
  
  export interface CreateDepositData {
    nome: string
    codigo: string
    endereco?: string
    responsavel?: string
    capacidade_maxima?: number
    tipos_produtos_aceitos: string[]
    controle_zonas?: string
    status: 'active' | 'inactive'
    permite_transferencia: boolean
    observacoes?: string
  }
  
  export interface UpdateDepositData {
    nome?: string
    codigo?: string
    endereco?: string
    responsavel?: string
    capacidade_maxima?: number
    tipos_produtos_aceitos?: string[]
    controle_zonas?: string
    status?: 'active' | 'inactive'
    permite_transferencia?: boolean
    observacoes?: string
  }
  
  export interface CategorySearchCriteria {
    codigo_interno?: string
    grupo_mercadoria?: string
    categoria?: string
    status?: 'active' | 'inactive'
  }
  
  export interface DepositSearchCriteria {
    nome?: string
    codigo?: string
    responsavel?: string
    status?: 'active' | 'inactive'
  }