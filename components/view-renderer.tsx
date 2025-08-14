"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BarChart3, DollarSign, Package, TrendingUp, AlertCircle, ExternalLink } from "lucide-react"

interface ViewRendererProps {
  viewId: string
  onOpenView?: (viewId: string, title: string) => void
}

export default function ViewRenderer({ viewId, onOpenView }: ViewRendererProps) {
  const renderView = () => {
    switch (viewId) {
      case "financial-report":
        return (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <DollarSign className="h-8 w-8 text-green-600" />
                Financial Report
              </h1>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300">
                  Updated 2 hours ago
                </Badge>
                {onOpenView && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onOpenView("inventory-control", "Inventory Control")}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Ver Estoque
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$2,847,392</div>
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +12.5% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$1,234,567</div>
                  <p className="text-xs text-red-600">+5.2% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Net Profit</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$1,612,825</div>
                  <p className="text-xs text-green-600">+18.7% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Cash Flow</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$892,341</div>
                  <p className="text-xs text-green-600">Positive trend</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <BarChart3 className="h-16 w-16 mb-4" />
                  <p>Chart visualization would be rendered here</p>
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
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                  Real-time data
                </Badge>
                {onOpenView && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onOpenView("financial-report", "Financial Report")}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Ver Financeiro
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">15,847</div>
                  <p className="text-xs text-muted-foreground">Across all warehouses</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Low Stock Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">23</div>
                  <p className="text-xs text-orange-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Requires attention
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Inventory Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$3,247,891</div>
                  <p className="text-xs text-green-600">+2.3% this month</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Stock Movements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { item: "Product A", movement: "IN", quantity: 150, warehouse: "WH-001" },
                    { item: "Product B", movement: "OUT", quantity: 75, warehouse: "WH-002" },
                    { item: "Product C", movement: "IN", quantity: 200, warehouse: "WH-001" },
                  ].map((movement, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant={movement.movement === "IN" ? "default" : "secondary"}>
                          {movement.movement}
                        </Badge>
                        <span className="font-medium">{movement.item}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{movement.quantity} units</div>
                        <div className="text-sm text-muted-foreground">{movement.warehouse}</div>
                      </div>
                    </div>
                  ))}
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
              <Badge variant="outline">Demo View</Badge>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>View Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🚧</div>
                  <h3 className="text-xl font-semibold mb-2">View Under Construction</h3>
                  <p className="text-muted-foreground mb-6">
                    This view is being developed. Content will be available soon.
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button variant="outline">Request Access</Button>
                    {onOpenView && (
                      <Button variant="outline" onClick={() => onOpenView("financial-report", "Financial Report")}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Ver Financeiro
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )
    }
  }

  return <div className="min-h-[calc(100vh-12rem)]">{renderView()}</div>
}
