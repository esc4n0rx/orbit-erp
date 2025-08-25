// components/modules/suppliers/SupplierMaterialsTab.tsx
"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { MessageBar } from '@/components/ui/message-bar'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Search, Edit, Trash2, Loader2, Package } from 'lucide-react'
import { useSupplierMaterialOperations } from '@/hooks/useSupplierOperations'
import type { SupplierMaterial, CreateSupplierMaterialData, UpdateSupplierMaterialData } from '@/types/supplier'

interface SupplierMaterialsTabProps {
  supplierId: string
  currentUserId: string
  readOnly?: boolean
}

export default function SupplierMaterialsTab({ 
  supplierId, 
  currentUserId, 
  readOnly = false 
}: SupplierMaterialsTabProps) {
  const {
    loading,
    error,
    getMaterials,
    addMaterial,
    updateMaterial,
    removeMaterial,
    searchMaterials
  } = useSupplierMaterialOperations()

  const [supplierMaterials, setSupplierMaterials] = useState<SupplierMaterial[]>([])
  const [availableMaterials, setAvailableMaterials] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingMaterial, setEditingMaterial] = useState<SupplierMaterial | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)

  const [materialForm, setMaterialForm] = useState<CreateSupplierMaterialData>({
    supplier_id: supplierId,
    material_id: '',
    status: 'active'
  })

  // Carregar materiais do fornecedor
  useEffect(() => {
    if (supplierId) {
      loadSupplierMaterials()
    }
  }, [supplierId])

  const loadSupplierMaterials = async () => {
    const { data, error } = await getMaterials(supplierId)
    if (data && !error) {
      setSupplierMaterials(data)
    }
  }

  const handleSearchMaterials = async (term: string) => {
    if (term.length < 2) {
      setAvailableMaterials([])
      return
    }

    const { data, error } = await searchMaterials(term)
    if (data && !error) {
      // Filtrar materiais já vinculados
      const linkedMaterialIds = supplierMaterials.map(sm => sm.material_id)
      const filtered = data.filter(material => !linkedMaterialIds.includes(material.id))
      setAvailableMaterials(filtered)
    }
  }

  const handleAddMaterial = async () => {
    if (!materialForm.material_id) return

    const { data, error } = await addMaterial(materialForm, currentUserId)
    
    if (data && !error) {
      setSuccess('Material vinculado com sucesso!')
      setSupplierMaterials(prev => [data, ...prev])
      setShowAddDialog(false)
      resetForm()
      setTimeout(() => setSuccess(null), 3000)
    }
  }

  const handleEditMaterial = async () => {
    if (!editingMaterial) return

    const updateData: UpdateSupplierMaterialData = {
      codigo_fornecedor: materialForm.codigo_fornecedor,
      preco_ultima_compra: materialForm.preco_ultima_compra,
      data_ultima_compra: materialForm.data_ultima_compra,
      tempo_entrega_dias: materialForm.tempo_entrega_dias,
      quantidade_minima: materialForm.quantidade_minima,
      observacoes: materialForm.observacoes,
      status: materialForm.status
    }

    const { data, error } = await updateMaterial(editingMaterial.id, updateData, currentUserId)
    
    if (data && !error) {
      setSuccess('Material atualizado com sucesso!')
      setSupplierMaterials(prev => 
        prev.map(sm => sm.id === editingMaterial.id ? data : sm)
      )
      setShowEditDialog(false)
      setEditingMaterial(null)
      resetForm()
      setTimeout(() => setSuccess(null), 3000)
    }
  }

  const handleRemoveMaterial = async (materialId: string) => {
    if (!confirm('Tem certeza que deseja remover este material?')) return

    const { success, error } = await removeMaterial(materialId)
    
    if (success && !error) {
      setSuccess('Material removido com sucesso!')
      setSupplierMaterials(prev => prev.filter(sm => sm.id !== materialId))
      setTimeout(() => setSuccess(null), 3000)
    }
  }

  const resetForm = () => {
    setMaterialForm({
      supplier_id: supplierId,
      material_id: '',
      status: 'active'
    })
    setSearchTerm('')
    setAvailableMaterials([])
  }

  const openEditDialog = (material: SupplierMaterial) => {
    setEditingMaterial(material)
    setMaterialForm({
      supplier_id: supplierId,
      material_id: material.material_id,
      codigo_fornecedor: material.codigo_fornecedor,
      preco_ultima_compra: material.preco_ultima_compra,
      data_ultima_compra: material.data_ultima_compra,
      tempo_entrega_dias: material.tempo_entrega_dias,
      quantidade_minima: material.quantidade_minima,
      observacoes: material.observacoes,
      status: material.status
    })
    setShowEditDialog(true)
  }

  const formatCurrency = (value?: number) => {
    if (!value) return '-'
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  return (
    <div className="space-y-6">
      {success && (
        <MessageBar variant="success">{success}</MessageBar>
      )}

      {error && (
        <MessageBar variant="destructive">{error}</MessageBar>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Materiais Vinculados
            </CardTitle>
            {!readOnly && (
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Vincular Material
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Vincular Material ao Fornecedor</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="search-materials">Buscar Material</Label>
                      <div className="flex gap-2">
                        <Input
                          id="search-materials"
                          value={searchTerm}
                          onChange={(e) => {
                            setSearchTerm(e.target.value)
                            handleSearchMaterials(e.target.value)
                          }}
                          placeholder="Digite código ou descrição do material..."
                        />
                        <Button variant="outline" disabled>
                          <Search className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {availableMaterials.length > 0 && (
                      <div className="space-y-2">
                        <Label>Materiais Encontrados</Label>
                        <div className="max-h-40 overflow-y-auto border rounded-lg">
                          {availableMaterials.map(material => (
                            <div
                              key={material.id}
                              className={`p-2 cursor-pointer hover:bg-muted ${
                                materialForm.material_id === material.id ? 'bg-accent' : ''
                              }`}
                              onClick={() => setMaterialForm(prev => ({ ...prev, material_id: material.id }))}
                            >
                              <div className="font-medium">{material.codigo_material} - {material.descricao}</div>
                              {material.codigo_interno && (
                                <div className="text-sm text-muted-foreground">Código Interno: {material.codigo_interno}</div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {materialForm.material_id && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="codigo_fornecedor">Código do Fornecedor</Label>
                            <Input
                              id="codigo_fornecedor"
                              value={materialForm.codigo_fornecedor || ''}
                              onChange={(e) => setMaterialForm(prev => ({ 
                                ...prev, 
                                codigo_fornecedor: e.target.value 
                              }))}
                              placeholder="Código usado pelo fornecedor"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="preco_ultima_compra">Preço Última Compra</Label>
                            <Input
                              id="preco_ultima_compra"
                              type="number"
                              step="0.01"
                              value={materialForm.preco_ultima_compra || ''}
                              onChange={(e) => setMaterialForm(prev => ({ 
                                ...prev, 
                                preco_ultima_compra: parseFloat(e.target.value) || undefined
                              }))}
                              placeholder="0.00"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="data_ultima_compra">Data Última Compra</Label>
                            <Input
                              id="data_ultima_compra"
                              type="date"
                              value={materialForm.data_ultima_compra || ''}
                              onChange={(e) => setMaterialForm(prev => ({ 
                                ...prev, 
                                data_ultima_compra: e.target.value 
                              }))}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="tempo_entrega_dias">Tempo Entrega (dias)</Label>
                            <Input
                              id="tempo_entrega_dias"
                              type="number"
                              value={materialForm.tempo_entrega_dias || ''}
                              onChange={(e) => setMaterialForm(prev => ({ 
                                ...prev, 
                                tempo_entrega_dias: parseInt(e.target.value) || undefined
                              }))}
                              placeholder="0"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="quantidade_minima">Quantidade Mínima</Label>
                            <Input
                              id="quantidade_minima"
                              type="number"
                              step="0.01"
                              value={materialForm.quantidade_minima || ''}
                              onChange={(e) => setMaterialForm(prev => ({ 
                                ...prev, 
                                quantidade_minima: parseFloat(e.target.value) || undefined
                              }))}
                              placeholder="0.00"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="observacoes">Observações</Label>
                          <Textarea
                            id="observacoes"
                            value={materialForm.observacoes || ''}
                            onChange={(e) => setMaterialForm(prev => ({ 
                              ...prev, 
                              observacoes: e.target.value 
                            }))}
                            placeholder="Observações sobre o material ou fornecimento..."
                            rows={3}
                          />
                        </div>

                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                            Cancelar
                          </Button>
                          <Button onClick={handleAddMaterial} disabled={loading}>
                            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            Vincular Material
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {supplierMaterials.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>Nenhum material vinculado a este fornecedor</p>
              {!readOnly && (
                <p className="text-sm mt-2">Use o botão "Vincular Material" para adicionar materiais</p>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código Material</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Código Fornecedor</TableHead>
                  <TableHead>Último Preço</TableHead>
                  <TableHead>Tempo Entrega</TableHead>
                  <TableHead>Status</TableHead>
                  {!readOnly && <TableHead>Ações</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {supplierMaterials.map((supplierMaterial) => (
                  <TableRow key={supplierMaterial.id}>
                    <TableCell className="font-medium">
                      {supplierMaterial.material?.codigo_material}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{supplierMaterial.material?.descricao}</div>
                        {supplierMaterial.material?.codigo_interno && (
                          <div className="text-sm text-muted-foreground">
                            Interno: {supplierMaterial.material?.codigo_interno}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{supplierMaterial.codigo_fornecedor || '-'}</TableCell>
                    <TableCell>{formatCurrency(supplierMaterial.preco_ultima_compra)}</TableCell>
                    <TableCell>
                      {supplierMaterial.tempo_entrega_dias ? `${supplierMaterial.tempo_entrega_dias} dias` : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={supplierMaterial.status === 'active' ? 'default' : 'secondary'}>
                        {supplierMaterial.status === 'active' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    {!readOnly && (
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(supplierMaterial)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveMaterial(supplierMaterial.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog de Edição */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Material Vinculado</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {editingMaterial && (
              <div className="bg-muted p-3 rounded-lg">
                <div className="font-medium">{editingMaterial.material?.codigo_material}</div>
                <div className="text-sm text-muted-foreground">{editingMaterial.material?.descricao}</div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_codigo_fornecedor">Código do Fornecedor</Label>
                <Input
                  id="edit_codigo_fornecedor"
                  value={materialForm.codigo_fornecedor || ''}
                  onChange={(e) => setMaterialForm(prev => ({ 
                    ...prev, 
                    codigo_fornecedor: e.target.value 
                  }))}
                  placeholder="Código usado pelo fornecedor"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit_preco_ultima_compra">Preço Última Compra</Label>
                <Input
                  id="edit_preco_ultima_compra"
                  type="number"
                  step="0.01"
                  value={materialForm.preco_ultima_compra || ''}
                  onChange={(e) => setMaterialForm(prev => ({ 
                    ...prev, 
                    preco_ultima_compra: parseFloat(e.target.value) || undefined
                  }))}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit_data_ultima_compra">Data Última Compra</Label>
                <Input
                  id="edit_data_ultima_compra"
                  type="date"
                  value={materialForm.data_ultima_compra || ''}
                  onChange={(e) => setMaterialForm(prev => ({ 
                    ...prev, 
                    data_ultima_compra: e.target.value 
                  }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit_tempo_entrega_dias">Tempo Entrega (dias)</Label>
                <Input
                  id="edit_tempo_entrega_dias"
                  type="number"
                  value={materialForm.tempo_entrega_dias || ''}
                  onChange={(e) => setMaterialForm(prev => ({ 
                    ...prev, 
                    tempo_entrega_dias: parseInt(e.target.value) || undefined
                  }))}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit_quantidade_minima">Quantidade Mínima</Label>
                <Input
                  id="edit_quantidade_minima"
                  type="number"
                  step="0.01"
                  value={materialForm.quantidade_minima || ''}
                  onChange={(e) => setMaterialForm(prev => ({ 
                    ...prev, 
                    quantidade_minima: parseFloat(e.target.value) || undefined
                  }))}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_status">Status</Label>
              <Select
                value={materialForm.status}
                onValueChange={(value: 'active' | 'inactive') => 
                  setMaterialForm(prev => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit_observacoes">Observações</Label>
              <Textarea
                id="edit_observacoes"
                value={materialForm.observacoes || ''}
                onChange={(e) => setMaterialForm(prev => ({ 
                  ...prev, 
                  observacoes: e.target.value 
                }))}
                placeholder="Observações sobre o material ou fornecimento..."
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleEditMaterial} disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Salvar Alterações
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}