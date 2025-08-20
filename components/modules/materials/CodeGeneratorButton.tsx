"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useCodeGeneration } from '@/hooks/useCodeGeneration'
import { Zap, Loader2 } from 'lucide-react'

interface CodeGeneratorButtonProps {
  type: 'material' | 'internal' | 'ean13' | 'ean8'
  onCodeGenerated: (code: string) => void
  disabled?: boolean
  size?: 'default' | 'sm' | 'lg'
}

export default function CodeGeneratorButton({ 
  type, 
  onCodeGenerated, 
  disabled = false,
  size = 'sm'
}: CodeGeneratorButtonProps) {
  const { generateUniqueCode, loading } = useCodeGeneration()
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    setError(null)
    
    const code = await generateUniqueCode(type)
    
    if (code) {
      onCodeGenerated(code)
    } else {
      setError('Não foi possível gerar um código único. Tente novamente.')
    }
  }

  const getButtonText = () => {
    switch (type) {
      case 'material':
        return 'Gerar Código'
      case 'internal':
        return 'Gerar Interno'
      case 'ean13':
        return 'Gerar EAN'
      case 'ean8':
        return 'Gerar EAN2'
      default:
        return 'Gerar'
    }
  }

  return (
    <div className="flex flex-col">
      <Button
        type="button"
        variant="outline"
        size={size}
        onClick={handleGenerate}
        disabled={disabled || loading}
        className="w-fit"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <Zap className="h-4 w-4 mr-2" />
        )}
        {getButtonText()}
      </Button>
      
      {error && (
        <span className="text-xs text-destructive mt-1">{error}</span>
      )}
    </div>
  )
}