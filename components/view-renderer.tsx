"use client"

import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BarChart3, DollarSign, Package, TrendingUp, AlertCircle, ExternalLink } from "lucide-react"

// Importar as views de usuários
import UserCreateView from "@/components/modules/users/UserCreateView"
import UserEditView from "@/components/modules/users/UserEditView"
import UserViewView from "@/components/modules/users/UserViewView"
import { recordViewAccess } from "@/lib/supabase/modules"

interface ViewRendererProps {
  viewId: string
  currentUser?: any
  onOpenView?: (viewId: string, title: string) => void
}

export default function ViewRenderer({ viewId, currentUser, onOpenView }: ViewRendererProps) {
  // Registrar acesso quando a view é renderizada
  useEffect(() => {
    if (currentUser && viewId !== 'home') {
      recordViewAccess(currentUser.id, viewId)
    }
  }, [currentUser, viewId])

  const renderView = () => {
    // Views do módulo de usuários (dinâmicas do banco)
    switch (viewId) {
      case "usr001":
        return (
          <UserCreateView
            currentUser={currentUser}
            onSuccess={() => onOpenView?.('usr002', 'Editar Usuário')}
          />
        )

      case "usr002":
        return (
          <UserEditView
            currentUser={currentUser}
            onSuccess={() => onOpenView?.('usr003', 'Visualizar Usuário')}
          />
        )

      case "usr003":
        return (
          <UserViewView
            currentUser={currentUser}
          />
        )

      // Views de exemplo - você pode removê-las ou movê-las para o banco
      case "financial-report":
        return (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <DollarSign className="h-8 w-8 text-green-600" />
                Financial Report
              </h1>
              <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300">
                Demo View
              </Badge>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Demo Financial Data</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Esta é uma view de demonstração. Dados reais seriam carregados aqui.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case "inventory-control":
        return (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Package className="h-8 w-8 text-blue-600" />
                Inventory Control
              </h1>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                Demo View
              </Badge>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Demo Inventory Data</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Esta é uma view de demonstração. Dados reais seriam carregados aqui.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold capitalize">{viewId.replace(/-/g, " ")}</h1>
              <Badge variant="outline">View não encontrada</Badge>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>View não implementada</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🚧</div>
                  <h3 className="text-xl font-semibold mb-2">View em desenvolvimento</h3>
                  <p className="text-muted-foreground mb-6">
                    A view "{viewId}" ainda não foi implementada ou não existe no sistema.
                  </p>
                  <Button variant="outline" onClick={() => onOpenView?.('home', 'Home')}>
                    Voltar ao início
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )
    }
  }

  return <div className="min-h-[calc(100vh-12rem)]">{renderView()}</div>
}