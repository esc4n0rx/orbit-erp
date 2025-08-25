// types/supplier.ts
export interface Supplier {
    id: string
    codigo_interno: string
    tipo_fornecedor: 'fisica' | 'juridica'
    
    // Dados básicos
    razao_social: string
    nome_fantasia?: string
    
    // Documentos
    cpf?: string
    rg?: string
    cnpj?: string
    inscricao_estadual?: string
    
    // Endereço
    logradouro?: string
    numero?: string
    complemento?: string
    bairro?: string
    cidade?: string
    estado?: string
    cep?: string
    pais?: string
    
    // Contatos
    telefone_fixo?: string
    telefone_celular?: string
    email?: string
    contato_principal_nome?: string
    contato_principal_funcao?: string
    
    // Classificação
    tipo_classificacao: 'nacional' | 'internacional' | 'local'
    grupo_fornecedor?: string
    ramo_atividade?: string
    
    // Financeiro
    condicao_pagamento_padrao?: string
    limite_credito?: number
    bloqueado_compra: boolean
    moeda_padrao?: string
    
    // Controle
    status: 'active' | 'inactive'
    created_at: string
    updated_at: string
    created_by: string
    updated_by?: string
  }
  
  export interface CreateSupplierData {
    codigo_interno: string
    tipo_fornecedor: 'fisica' | 'juridica'
    razao_social: string
    nome_fantasia?: string
    
    // Documentos
    cpf?: string
    rg?: string
    cnpj?: string
    inscricao_estadual?: string
    
    // Endereço
    logradouro?: string
    numero?: string
    complemento?: string
    bairro?: string
    cidade?: string
    estado?: string
    cep?: string
    pais?: string
    
    // Contatos
    telefone_fixo?: string
    telefone_celular?: string
    email?: string
    contato_principal_nome?: string
    contato_principal_funcao?: string
    
    // Classificação
    tipo_classificacao: 'nacional' | 'internacional' | 'local'
    grupo_fornecedor?: string
    ramo_atividade?: string
    
    // Financeiro
    condicao_pagamento_padrao?: string
    limite_credito?: number
    bloqueado_compra?: boolean
    moeda_padrao?: string
    
    status: 'active' | 'inactive'
  }
  
  export interface UpdateSupplierData extends Partial<CreateSupplierData> {}
  
  export interface SupplierSearchCriteria {
    codigo_interno?: string
    razao_social?: string
    cnpj?: string
    cpf?: string
    tipo_fornecedor?: 'fisica' | 'juridica'
    status?: 'active' | 'inactive'
  }
  
  export interface SupplierMaterial {
    id: string
    supplier_id: string
    material_id: string
    codigo_fornecedor?: string
    preco_ultima_compra?: number
    data_ultima_compra?: string
    tempo_entrega_dias?: number
    quantidade_minima?: number
    observacoes?: string
    status: 'active' | 'inactive'
    created_at: string
    updated_at: string
    created_by: string
    updated_by?: string
    
    // Dados do material
    material?: {
      id: string
      codigo_material: string
      codigo_interno: string
      descricao: string
    }
  }
  
  export interface CreateSupplierMaterialData {
    supplier_id: string
    material_id: string
    codigo_fornecedor?: string
    preco_ultima_compra?: number
    data_ultima_compra?: string
    tempo_entrega_dias?: number
    quantidade_minima?: number
    observacoes?: string
    status: 'active' | 'inactive'
  }
  
  export interface UpdateSupplierMaterialData extends Partial<CreateSupplierMaterialData> {}