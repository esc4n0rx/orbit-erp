export function getEnvironmentSuffix(environment: string): string {
    const envMap: Record<string, string> = {
      'development': 'dev',
      'production': 'prod',
      'staging': 'stg'
    }
    
    return envMap[environment] || 'dev'
  }
  
  export function getTableName(tableName: string, environment: string): string {
    const suffix = getEnvironmentSuffix(environment)
    return `orbit_erp_${tableName}_${suffix}`
  }