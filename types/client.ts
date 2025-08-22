// types/client.ts
export interface Client {
  id: string
  codigo_interno: string
  tipo_cliente: 'fisica' | 'juridica'
  
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
  tipo_classificacao: 'externo' | 'loja_filial'
  grupo_cliente?: string
  ramo_atividade?: string
  
  // Financeiro
  condicao_pagamento_padrao?: string
  limite_credito?: number
  bloqueado_venda: boolean
  moeda_padrao?: string
  tabela_preco_padrao?: string
  
  // Controle
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
  created_by: string
  updated_by?: string
}

export interface CreateClientData {
  codigo_interno: string
  tipo_cliente: 'fisica' | 'juridica'
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
  tipo_classificacao: 'externo' | 'loja_filial'
  grupo_cliente?: string
  ramo_atividade?: string
  
  // Financeiro
  condicao_pagamento_padrao?: string
  limite_credito?: number
  bloqueado_venda?: boolean
  moeda_padrao?: string
  tabela_preco_padrao?: string
  
  status: 'active' | 'inactive'
}

export interface UpdateClientData extends Partial<CreateClientData> {}

export interface ClientSearchCriteria {
  codigo_interno?: string
  razao_social?: string
  cnpj?: string
  cpf?: string
  tipo_cliente?: 'fisica' | 'juridica'
  status?: 'active' | 'inactive'
}