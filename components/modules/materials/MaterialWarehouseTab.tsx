"use client"

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'

interface MaterialWarehouseTabProps {
  data: {
    localizacao?: string
    ponto_reposicao?: number
    estoque_minimo?: number
    estoque_maximo?: number
    tempo_reposicao?: number
    controle_lote: boolean
    controle_serie: boolean
    controle_validade: boolean
  }
  onChange: (field: string, value: any) => void
  errors: Record<string, string>
  isReadOnly?: boolean
}

export default function MaterialWarehouseTab({ 
  data, 
  onChange, 
  errors, 
  isReadOnly = false 
}: MaterialWarehouseTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Dados de Warehouse</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="localizacao">Localização no Armazém</Label>
            <Input
              id="localizacao"
              value={data.localizacao || ''}
              onChange={(e) => onChange('localizacao', e.target.value)}
              disabled={isReadOnly}
              placeholder="Ex: Setor A, Prateleira 5, Posição 3"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="estoque_minimo">Estoque Mínimo</Label>
              <Input
                id="estoque_minimo"
                type="number"
                value={data.estoque_minimo || ''}
                onChange={(e) => onChange('estoque_minimo', parseInt(e.target.value) || undefined)}
                disabled={isReadOnly}
                min="0"
              />
            </div>

            <div>
              <Label htmlFor="estoque_maximo">Estoque Máximo</Label>
              <Input
                id="estoque_maximo"
                type="number"
                value={data.estoque_maximo || ''}
                onChange={(e) => onChange('estoque_maximo', parseInt(e.target.value) || undefined)}
                disabled={isReadOnly}
                min="0"
              />
            </div>

            <div>
              <Label htmlFor="ponto_reposicao">Ponto de Reposição</Label>
              <Input
                id="ponto_reposicao"
                type="number"
                value={data.ponto_reposicao || ''}
                onChange={(e) => onChange('ponto_reposicao', parseInt(e.target.value) || undefined)}
                disabled={isReadOnly}
                min="0"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="tempo_reposicao">Tempo de Reposição (dias)</Label>
            <Input
              id="tempo_reposicao"
              type="number"
              value={data.tempo_reposicao || ''}
              onChange={(e) => onChange('tempo_reposicao', parseInt(e.target.value) || undefined)}
              disabled={isReadOnly}
              min="1"
            />
          </div>

          <div className="space-y-3">
            <Label>Controles</Label>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="controle_lote"
                checked={data.controle_lote}
                onCheckedChange={(checked) => onChange('controle_lote', checked)}
                disabled={isReadOnly}
              />
              <Label htmlFor="controle_lote" className="cursor-pointer">
                Controle de Lote
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="controle_serie"
                checked={data.controle_serie}
                onCheckedChange={(checked) => onChange('controle_serie', checked)}
                disabled={isReadOnly}
              />
              <Label htmlFor="controle_serie" className="cursor-pointer">
                Controle de Série
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="controle_validade"
                checked={data.controle_validade}
                onCheckedChange={(checked) => onChange('controle_validade', checked)}
                disabled={isReadOnly}
              />
              <Label htmlFor="controle_validade" className="cursor-pointer">
                Controle de Validade
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}