/**
 * Gera código de material único
 */
export function generateMaterialCode(): string {
    const timestamp = Date.now().toString()
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `MAT${timestamp.slice(-6)}${random}`
  }
  
  /**
   * Gera código interno único
   */
  export function generateInternalCode(): string {
    const timestamp = Date.now().toString()
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    return `INT${timestamp.slice(-8)}${random}`
  }
  
  /**
   * Gera código EAN-13
   */
  export function generateEAN13(): string {
    // Prefixo brasileiro (789-790)
    let ean = '789'
    
    // Código da empresa (5 dígitos) - simulado
    const empresaCode = Math.floor(Math.random() * 100000).toString().padStart(5, '0')
    ean += empresaCode
    
    // Código do produto (4 dígitos)
    const produtoCode = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    ean += produtoCode
    
    // Calcular dígito verificador
    let soma = 0
    for (let i = 0; i < 12; i++) {
      const digito = parseInt(ean[i])
      soma += (i % 2 === 0) ? digito : digito * 3
    }
    
    const digitoVerificador = (10 - (soma % 10)) % 10
    ean += digitoVerificador.toString()
    
    return ean
  }
  
  /**
   * Gera código EAN-8
   */
  export function generateEAN8(): string {
    // Prefixo (2 dígitos)
    let ean = '78'
    
    // Código do produto (5 dígitos)
    const produtoCode = Math.floor(Math.random() * 100000).toString().padStart(5, '0')
    ean += produtoCode
    
    // Calcular dígito verificador
    let soma = 0
    for (let i = 0; i < 7; i++) {
      const digito = parseInt(ean[i])
      soma += (i % 2 === 0) ? digito * 3 : digito
    }
    
    const digitoVerificador = (10 - (soma % 10)) % 10
    ean += digitoVerificador.toString()
    
    return ean
  }
  
  /**
   * Valida código EAN
   */
  export function validateEAN(ean: string): boolean {
    if (!/^\\d{8}$|^\\d{13}$/.test(ean)) return false
    
    const length = ean.length
    let soma = 0
    
    for (let i = 0; i < length - 1; i++) {
      const digito = parseInt(ean[i])
      if (length === 13) {
        soma += (i % 2 === 0) ? digito : digito * 3
      } else {
        soma += (i % 2 === 0) ? digito * 3 : digito
      }
    }
    
    const digitoVerificador = (10 - (soma % 10)) % 10
    return digitoVerificador === parseInt(ean[length - 1])
  }