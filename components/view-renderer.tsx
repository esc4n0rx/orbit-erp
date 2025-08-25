"use client"

import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, Loader2 } from "lucide-react"

// Views hardcoded (ainda mantidas por compatibilidade)
import UserCreateView from "@/components/modules/users/UserCreateView"
import UserEditView from "@/components/modules/users/UserEditView"
import UserViewView from "@/components/modules/users/UserViewView"
import UserPermissionView from "@/components/modules/users/UserPermissionView"
import CategoryCreateView from "@/components/modules/materials/CategoryCreateView"
import CategoryEditView from "@/components/modules/materials/CategoryEditView"
import DepositCreateView from "@/components/modules/materials/DepositCreateView"
import DepositEditView from "@/components/modules/materials/DepositEditView"
import MaterialCreateView from "@/components/modules/materials/MaterialCreateView"
import MaterialEditView from "@/components/modules/materials/MaterialEditView"
import MaterialDetailView from "@/components/modules/materials/MaterialDetailView"
import ViewBuilderManager from "./modules/view-builder/ViewBuilderManager"
import ClientCreateView from './modules/clients/ClientCreateView'
import ClientEditView from './modules/clients/ClientEditView'
import ClientDetailView from './modules/clients/ClientDetailView'
import SupplierCreateView from './modules/suppliers/SupplierCreateView'
import SupplierEditView from './modules/suppliers/SupplierEditView'
import SupplierDetailView from './modules/suppliers/SupplierDetailView'


// Renderizador dinâmico
import DynamicViewRenderer from "@/components/DynamicViewRenderer"

// Hooks e utils
import { useViewRenderer } from "@/hooks/useViewRenderer"
import { recordViewAccess } from "@/lib/supabase/modules"
import ViewBuilderMain from "./modules/view-builder/ViewBuilderMain"

interface ViewRendererProps {
  viewId: string
  currentUser?: any
  onOpenView?: (viewId: string, title: string) => void
}

export default function ViewRenderer({ viewId, currentUser, onOpenView }: ViewRendererProps) {
  const { config, loading, error } = useViewRenderer(viewId, currentUser?.role || 'user')

  // Registrar acesso quando a view é renderizada
  useEffect(() => {
    if (currentUser && viewId !== 'home') {
      recordViewAccess(currentUser.id, viewId)
    }
  }, [currentUser, viewId])

  // Loading state
  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">Carregando view...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !config) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold capitalize">{viewId.replace(/-/g, " ")}</h1>
          <Badge variant="destructive">Erro</Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Erro ao carregar view
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                {error || `A view "${viewId}" não foi encontrada ou você não tem acesso a ela.`}
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

  // Renderizar baseado no tipo de view
  const renderView = () => {
    switch (config.viewType) {
      case 'development':
        // Views dinâmicas em desenvolvimento
        if (config.config) {
          return (
            <DynamicViewRenderer
              config={config.config}
              currentUser={currentUser}
              onOpenView={onOpenView}
            />
          )
        }
        break

      case 'database':
        // Views do banco de dados
        if (config.componentPath?.startsWith('dynamic:')) {
          // View dinâmica promovida para produção
          const dynamicViewId = config.componentPath.replace('dynamic:', '')
          // TODO: Implementar carregamento de view dinâmica por ID
          return (
            <div className="p-6">
              <p>View dinâmica de produção (ID: {dynamicViewId}) - Em desenvolvimento</p>
            </div>
          )
        } else {
          // Component path tradicional - delegar para sistema hardcoded
          return renderHardcodedView()
        }

      case 'hardcoded':
        // Views hardcoded tradicionais
        return renderHardcodedView()

      default:
        return (
          <div className="p-6">
            <p>Tipo de view não reconhecido: {config.viewType}</p>
          </div>
        )
    }
  }

  const renderHardcodedView = () => {
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

      case "usr004":
        return (
          <UserPermissionView
            currentUser={currentUser}
          />
        )

      case "mcat01":
        return (
          <CategoryCreateView
            currentUser={currentUser}
            onSuccess={() => onOpenView?.('mcat02', 'Editar Categoria')}
          />
        )

      case "mcat02":
        return (
          <CategoryEditView
            currentUser={currentUser}
            onSuccess={() => onOpenView?.('mcat01', 'Criar Categoria')}
          />
        )

      case "mdep01":
        return (
          <DepositCreateView
            currentUser={currentUser}
            onSuccess={() => onOpenView?.('mdep02', 'Editar Depósito')}
          />
        )

      case "mdep02":
        return (
          <DepositEditView
            currentUser={currentUser}
            onSuccess={() => onOpenView?.('mdep01', 'Criar Depósito')}
          />
        )

      case "cr001":
        return (
          <MaterialCreateView
            currentUser={currentUser}
            onSuccess={() => onOpenView?.('cr002', 'Editar Material')}
          />
        )

      case "cr002":
        return (
          <MaterialEditView
            currentUser={currentUser}
            onSuccess={() => onOpenView?.('cr003', 'Visualizar Material')}
          />
        )

      case "cr003":
        return (
          <MaterialDetailView
            currentUser={currentUser}
            onSuccess={() => onOpenView?.('cr001', 'Criar Material')}
          />
        )

        case "vb001":
      return (
        <ViewBuilderMain
          currentUser={currentUser}
          onSuccess={() => onOpenView?.('vb002', 'Gerenciar Views')}
        />
      )

    case "vb002":
      return (
        <ViewBuilderManager
          currentUser={currentUser}
          onCreateNew={() => onOpenView?.('vb001', 'Construtor de Views')}
          onEditView={(view) => {
            console.log('Editar view:', view)
            onOpenView?.('vb001', `Editar: ${view.name}`)
          }}
          onOpenView={onOpenView}
        />
      )

      case "cm001":
      return (
        <ClientCreateView
          currentUser={currentUser}
          onOpenView={onOpenView}
        />
      )

    case "cm002":
      return (
        <ClientEditView
          currentUser={currentUser}
          onOpenView={onOpenView}
        />
      )

    case "cm003":
      return (
        <ClientDetailView
          currentUser={currentUser}
          onOpenView={onOpenView}
        />
      )

      case "fm001":
          return (
            <SupplierCreateView
              currentUser={currentUser}
              onOpenView={onOpenView}
            />
          )

        case "fm002":
          return (
            <SupplierEditView
              currentUser={currentUser}
              onOpenView={onOpenView}
            />
          )

        case "fm003":
          return (
            <SupplierDetailView
              currentUser={currentUser}
              onOpenView={onOpenView}
            />
          )

      default:
        return (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold capitalize">{viewId.replace(/-/g, " ")}</h1>
              <Badge variant="outline">View não implementada</Badge>
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