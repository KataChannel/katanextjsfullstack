import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getDashboardStats, getInventoryByLot, getStockMovements } from "@/lib/warehouse-actions"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default async function DashboardPage() {
  const [stats, inventoryByLot, movements] = await Promise.all([
    getDashboardStats(),
    getInventoryByLot(),
    getStockMovements(20)
  ])

  if (!stats) {
    return <div className="p-4">Không thể tải dữ liệu</div>
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Báo Cáo & Thống Kê</h1>
        <p className="text-sm text-muted-foreground">
          Dashboard dành cho Giám đốc
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="inventory">Tồn kho</TabsTrigger>
          <TabsTrigger value="movements">Lịch sử</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="text-xs">Tổng kho</CardDescription>
                <CardTitle className="text-2xl">{stats.totalWarehouses}</CardTitle>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="text-xs">Tổng lô</CardDescription>
                <CardTitle className="text-2xl">{stats.totalLots}</CardTitle>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="text-xs">Tổng thùng</CardDescription>
                <CardTitle className="text-2xl">{stats.totalBoxes}</CardTitle>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="text-xs">Tổng SP</CardDescription>
                <CardTitle className="text-2xl">{stats.totalProducts}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Trạng thái hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Tồn kho</span>
                  <div className="flex items-center space-x-2">
                    <div className="text-lg font-bold text-green-600">{stats.inStockProducts}</div>
                    <Badge variant="outline">
                      {((stats.inStockProducts / stats.totalProducts) * 100).toFixed(1)}%
                    </Badge>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${(stats.inStockProducts / stats.totalProducts) * 100}%` }}
                  />
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="text-sm">Đã xuất</span>
                  <div className="flex items-center space-x-2">
                    <div className="text-lg font-bold text-orange-600">{stats.exportedProducts}</div>
                    <Badge variant="outline">
                      {((stats.exportedProducts / stats.totalProducts) * 100).toFixed(1)}%
                    </Badge>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-orange-600 h-2 rounded-full" 
                    style={{ width: `${(stats.exportedProducts / stats.totalProducts) * 100}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tồn kho theo lô</CardTitle>
              <CardDescription>Xem chi tiết từng lô hàng</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {inventoryByLot.map((lot) => (
                <div key={lot.id} className="border rounded-lg p-3 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm">{lot.name}</p>
                      <p className="text-xs text-muted-foreground">{lot.code}</p>
                    </div>
                    <Badge>{lot.inStockProducts} SP</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-muted-foreground">Thùng</p>
                      <p className="font-medium">{lot.boxes.length}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Tổng SP</p>
                      <p className="font-medium">{lot.totalProducts}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Kho</p>
                      <p className="font-medium">{lot.warehouse.code}</p>
                    </div>
                  </div>
                </div>
              ))}
              {inventoryByLot.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Chưa có lô hàng nào
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movements" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Lịch sử giao dịch</CardTitle>
              <CardDescription>20 giao dịch gần nhất</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {movements.map((movement, index) => (
                <div key={movement.id}>
                  {index > 0 && <Separator className="my-2" />}
                  <div className="flex justify-between items-start text-sm">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={
                            movement.type === "import"
                              ? "default"
                              : movement.type === "export"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {movement.type === "import"
                            ? "Nhập"
                            : movement.type === "export"
                            ? "Xuất"
                            : "Điều chỉnh"}
                        </Badge>
                        <span className="font-medium">{movement.quantity} SP</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {movement.product?.name || movement.box?.name || movement.lot?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        bởi {movement.user.name}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(movement.createdAt).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}