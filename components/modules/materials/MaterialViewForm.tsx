"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft } from 'lucide-react'
import MaterialBasicDataTab from './MaterialBasicDataTab'
import MaterialWarehouseTab from './MaterialWarehouseTab'
import MaterialSalesTab from './MaterialSalesTab'
import MaterialParametersTab from './MaterialParametersTab'
import type { Material } from '@/types/material-management'

interface MaterialViewFormProps {
  material: Material
  onBack?: () => void
}

export default function MaterialViewForm({ material, onBack }: MaterialViewFormProps) {
  const [activeTab, setActiveTab] = useState('basic')

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Material: {material.descricao}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">
                Dados Básicos
              </TabsTrigger>
              <TabsTrigger value="warehouse">
                Warehouse
              </TabsTrigger>
              <TabsTrigger value="sales">
                Venda
              </TabsTrigger>
              <TabsTrigger value="parameters">
                Parâmetros
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic">
              <MaterialBasicDataTab
                data={material}
                onChange={() => {}}
                errors={{}}
                isReadOnly={true}
              />
            </TabsContent>

            <TabsContent value="warehouse">
              <MaterialWarehouseTab
                data={material}
                onChange={() => {}}
                errors={{}}
                isReadOnly={true}
              />
            </TabsContent>

            <TabsContent value="sales">
              <MaterialSalesTab
                data={material}
                onChange={() => {}}
                errors={{}}
                isReadOnly={true}
              />
            </TabsContent>

            <TabsContent value="parameters">
              <MaterialParametersTab
                data={material}
                onChange={() => {}}
                errors={{}}
                isReadOnly={true}
              />
            </TabsContent>
          </Tabs>

          <div className="flex justify-start mt-6">
            <Button
              variant="outline"
              onClick={onBack}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}