"use client"

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface MaterialSalesTabProps {
  data: {
    preco_custo?: number
    preco_venda?: number
    margem_lucro?: number
    icms?: number
    ipi?: number
    ncm?: string
    origem?: string
  }
  onChange: (field: string, value: any) => void
  errors: Record<string, string>
  isReadOnly?: boolean
}

export default function MaterialSalesTab({ 
  data, 
  onChange, 
  errors, 
  isReadOnly = false 
}: MaterialSalesTabProps) {
  const calculateMargem = () => {
    if (data.preco_custo && data.preco_venda) {
      const margem = ((data.preco_venda - data.preco_custo) / data.preco_custo) * 100
      onChange('margem_lucro', parseFloat(margem.toFixed(2)))
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Dados de Venda</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="preco_custo">Preço de Custo (R$)</Label>
              <Input
                id="preco_custo"
                type="number"
                step="0.01"
                value={data.preco_custo || ''}
                onChange={(e) => {
                  onChange('preco_custo', parseFloat(e.target.value) || undefined)
                  setTimeout(calculateMargem, 100)
                }}
                disabled={isReadOnly}
                min="0"
              />
            </div>

            <div>
              <Label htmlFor="preco_venda">Preço de Venda (R$)</Label>
              <Input
                id="preco_venda"
                type="number"
                step="0.01"
                value={data.preco_venda || ''}
                onChange={(e) => {
                  onChange('preco_venda', parseFloat(e.target.value) || undefined)
                  setTimeout(calculateMargem, 100)
                }}
                disabled={isReadOnly}
                min="0"
              />
            </div>

            <div>
              <Label htmlFor="margem_lucro">Margem de Lucro (%)</Label>
              <Input
                id="margem_lucro"
                type="number"
                step="0.01"
                value={data.margem_lucro || ''}
                onChange={(e) => onChange('margem_lucro', parseFloat(e.target.value) || undefined)}
                disabled={isReadOnly}
                min="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="icms">ICMS (%)</Label>
              <Input
                id="icms"
                type="number"
                step="0.01"
                value={data.icms || ''}
                onChange={(e) => onChange('icms', parseFloat(e.target.value) || undefined)}
                disabled={isReadOnly}
                min="0"
                max="100"
              />
            </div>

            <div>
              <Label htmlFor="ipi">IPI (%)</Label>
              <Input
                id="ipi"
                type="number"
                step="0.01"
                value={data.ipi || ''}
                onChange={(e) => onChange('ipi', parseFloat(e.target.value) || undefined)}
                disabled={isReadOnly}
                min="0"
                max="100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ncm">NCM</Label>
              <Input
                id="ncm"
                value={data.ncm || ''}
                onChange={(e) => onChange('ncm', e.target.value)}
                disabled={isReadOnly}
                placeholder="0000.00.00"
                maxLength={10}
              />
            </div>

            <div>
              <Label htmlFor="origem">Origem</Label>
              <Input
                id="origem"
                value={data.origem || ''}
                onChange={(e) => onChange('origem', e.target.value)}
                disabled={isReadOnly}
                placeholder="Nacional/Importado"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}