/**
 * Sempre retorna 'dev' como sufixo padrão
 */
export function getEnvironmentSuffix(): string {
  return 'dev'
}

/**
 * Retorna o nome da tabela com sufixo _dev
 */
export function getTableName(tableName: string): string {
  return `orbit_erp_${tableName}_dev`
}

/**
 * Retorna sempre 'development' como ambiente padrão
 */
export function getCurrentEnvironment(): string {
  return 'development'
}