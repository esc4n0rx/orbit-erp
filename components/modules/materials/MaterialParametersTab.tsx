"use client"

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface MaterialParametersTabProps {
  data: {
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
  onChange: (field: string, value: any) => void
  errors: Record<string, string>
  isReadOnly?: boolean
}

export default function MaterialParametersTab({ 
  data, 
  onChange, 
  errors, 
  isReadOnly = false 
}: MaterialParametersTabProps) {
  const calculateVolume = () => {
    if (data.altura && data.largura && data.profundidade) {
      const volume = (data.altura / 100) * (data.largura / 100) * (data.profundidade / 100)
      onChange('volume', parseFloat(volume.toFixed(6)))
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Parâmetros Físicos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="peso_liquido">Peso Líquido (kg)</Label>
              <Input
                id="peso_liquido"
                type="number"
                step="0.001"
                value={data.peso_liquido || ''}
                onChange={(e) => onChange('peso_liquido', parseFloat(e.target.value) || undefined)}
                disabled={isReadOnly}
                min="0"
              />
            </div>

            <div>
              <Label htmlFor="peso_bruto">Peso Bruto (kg)</Label>
              <Input
                id="peso_bruto"
                type="number"
                step="0.001"
                value={data.peso_bruto || ''}
                onChange={(e) => onChange('peso_bruto', parseFloat(e.target.value) || undefined)}
                disabled={isReadOnly}
                min="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="altura">Altura (cm)</Label>
              <Input
                id="altura"
                type="number"
                step="0.1"
                value={data.altura || ''}
                onChange={(e) => {
                  onChange('altura', parseFloat(e.target.value) || undefined)
                  setTimeout(calculateVolume, 100)
                }}
                disabled={isReadOnly}
                min="0"
              />
            </div>

            <div>
              <Label htmlFor="largura">Largura (cm)</Label>
              <Input
                id="largura"
                type="number"
                step="0.1"
                value={data.largura || ''}
                onChange={(e) => {
                  onChange('largura', parseFloat(e.target.value) || undefined)
                  setTimeout(calculateVolume, 100)
                }}
                disabled={isReadOnly}
                min="0"
              />
            </div>

            <div>
              <Label htmlFor="profundidade">Profundidade (cm)</Label>
              <Input
                id="profundidade"
                type="number"
                step="0.1"
                value={data.profundidade || ''}
                onChange={(e) => {
                  onChange('profundidade', parseFloat(e.target.value) || undefined)
                  setTimeout(calculateVolume, 100)
                }}
                disabled={isReadOnly}
                min="0"
              />
            </div>

            <div>
              <Label htmlFor="volume">Volume (m³)</Label>
              <Input
                id="volume"
                type="number"
                step="0.000001"
                value={data.volume || ''}
                onChange={(e) => onChange('volume', parseFloat(e.target.value) || undefined)}
                disabled={isReadOnly}
                min="0"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Características</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cor">Cor</Label>
              <Input
                id="cor"
                value={data.cor || ''}
                onChange={(e) => onChange('cor', e.target.value)}
                disabled={isReadOnly}
                placeholder="Ex: Azul, Vermelho, Preto"
              />
            </div>

            <div>
              <Label htmlFor="tamanho">Tamanho</Label>
              <Input
                id="tamanho"
                value={data.tamanho || ''}
                onChange={(e) => onChange('tamanho', e.target.value)}
                disabled={isReadOnly}
                placeholder="Ex: P, M, G, GG"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="modelo">Modelo</Label>
              <Input
                id="modelo"
                value={data.modelo || ''}
                onChange={(e) => onChange('modelo', e.target.value)}
                disabled={isReadOnly}
                placeholder="Ex: Classic, Premium, Standard"
              />
            </div>

            <div>
              <Label htmlFor="marca">Marca</Label>
              <Input
                id="marca"
                value={data.marca || ''}
                onChange={(e) => onChange('marca', e.target.value)}
                disabled={isReadOnly}
                placeholder="Ex: Nike, Adidas, Samsung"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}