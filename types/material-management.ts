export interface Material {
    id: string
    codigo_material: string
    codigo_interno: string
    descricao: string
    unidade_medida: string
    categoria_id: string
    categoria?: {
      grupo_mercadoria: string
      categoria: string
      subcategoria?: string
    }
    deposito_id: string
    deposito?: {
      codigo: string
      nome: string
    }
    ean?: string
    ean2?: string
    quantidade_por_caixa?: number
    status: 'active' | 'inactive'
    
    // Dados de Warehouse
    localizacao?: string
    ponto_reposicao?: number
    estoque_minimo?: number
    estoque_maximo?: number
    tempo_reposicao?: number
    controle_lote: boolean
    controle_serie: boolean
    controle_validade: boolean
    
    // Dados de Venda
    preco_custo?: number
    preco_venda?: number
    margem_lucro?: number
    icms?: number
    ipi?: number
    ncm?: string
    origem?: string
    
    // Parâmetros
    peso_liquido?: number
    peso_bruto?: number
    altura?: number
    largura?: number
    profundidade?: number
    volume?: number
    cor?: string
    tamanho?: string
    modelo?: string
    marca?: string
    
    created_at: string
    updated_at: string
    created_by: string
    updated_by: string
  }
  
  export interface CreateMaterialData {
    codigo_material: string
    codigo_interno: string
    descricao: string
    unidade_medida: string
    categoria_id: string
    deposito_id: string
    ean?: string
    ean2?: string
    quantidade_por_caixa?: number
    status: 'active' | 'inactive'
    
    // Dados de Warehouse (opcionais)
    localizacao?: string
    ponto_reposicao?: number
    estoque_minimo?: number
    estoque_maximo?: number
    tempo_reposicao?: number
    controle_lote?: boolean
    controle_serie?: boolean
    controle_validade?: boolean
    
    // Dados de Venda (opcionais)
    preco_custo?: number
    preco_venda?: number
    margem_lucro?: number
    icms?: number
    ipi?: number
    ncm?: string
    origem?: string
    
    // Parâmetros (opcionais)
    peso_liquido?: number
    peso_bruto?: number
    altura?: number
    largura?: number
    profundidade?: number
    volume?: number
    cor?: string
    tamanho?: string
    modelo?: string
    marca?: string
  }
  
  export interface UpdateMaterialData extends Partial<CreateMaterialData> {}
  
  export interface MaterialSearchCriteria {
    codigo_material?: string
    codigo_interno?: string
    descricao?: string
    categoria_id?: string
    deposito_id?: string
    status?: 'active' | 'inactive'
  }