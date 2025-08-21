'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, Eye, Trash2, Heart } from 'lucide-react'
import type { User } from '@/types/auth'
import type { FavoriteView } from '@/types/menu'

interface FavoritesModalProps {
  open: boolean
  onClose: () => void
  user: User
  onViewSelect: (viewId: string, title: string) => void
}

export function FavoritesModal({ open, onClose, user, onViewSelect }: FavoritesModalProps) {
  const [favorites, setFavorites] = useState<FavoriteView[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (open) {
      loadFavorites()
    }
  }, [open])

  const loadFavorites = async () => {
    setLoading(true)
    try {
      // Simular carregamento de favoritos - integrar com supabase posteriormente
      const mockFavorites: FavoriteView[] = [
        {
          id: 'usuarios',
          alias: 'usuarios',
          name: 'Gestão de Usuários',
          description: 'Gerenciar usuários do sistema',
          addedAt: '2024-08-20'
        },
        {
          id: 'relatorios',
          alias: 'relatorios',
          name: 'Relatórios Gerenciais',
          description: 'Visualizar relatórios do sistema',
          addedAt: '2024-08-19'
        }
      ]
      setFavorites(mockFavorites)
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error)
    } finally {
      setLoading(false)
    }
  }

  const removeFavorite = (favoriteId: string) => {
    setFavorites(prev => prev.filter(fav => fav.id !== favoriteId))
  }

  const handleViewSelect = (viewAlias: string, viewName: string) => {
    onViewSelect(viewAlias, viewName)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-600" />
            Meus Favoritos
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Carregando favoritos...</p>
            </div>
          ) : favorites.length === 0 ? (
            <div className="text-center py-8">
              <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum favorito ainda</h3>
              <p className="text-muted-foreground">
                Adicione views aos seus favoritos para acesso rápido
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {favorites.map((favorite) => (
                <Card key={favorite.id} className="transition-shadow hover:shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-medium flex items-center gap-2">
                        <Eye className="h-5 w-5 text-green-600" />
                        {favorite.name}
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFavorite(favorite.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-3">
                      {favorite.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{favorite.alias}</Badge>
                      <div className="space-x-2">
                        <span className="text-xs text-muted-foreground">
                          Adicionado em {new Date(favorite.addedAt).toLocaleDateString('pt-BR')}
                        </span>
                        <Button
                          size="sm"
                          onClick={() => handleViewSelect(favorite.alias, favorite.name)}
                        >
                          Abrir
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}