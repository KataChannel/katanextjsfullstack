import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getDashboardStats } from "@/lib/warehouse-actions"
import { Package, PackagePlus, PackageMinus, Warehouse } from "lucide-react"

export default async function HomePage() {
  const stats = await getDashboardStats()

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Không thể tải dữ liệu</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Quản Lý Kho</h1>
        <p className="text-sm text-muted-foreground">
          Hệ thống quản lý kho với QR Code
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <Warehouse className="h-4 w-4 text-muted-foreground" />
              <CardDescription className="text-xs">Kho</CardDescription>
            </div>
            <CardTitle className="text-2xl">{stats.totalWarehouses}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <CardDescription className="text-xs">Lô</CardDescription>
            </div>
            <CardTitle className="text-2xl">{stats.totalLots}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <PackagePlus className="h-4 w-4 text-green-600" />
              <CardDescription className="text-xs">Tồn kho</CardDescription>
            </div>
            <CardTitle className="text-2xl text-green-600">
              {stats.inStockProducts}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <PackageMinus className="h-4 w-4 text-orange-600" />
              <CardDescription className="text-xs">Đã xuất</CardDescription>
            </div>
            <CardTitle className="text-2xl text-orange-600">
              {stats.exportedProducts}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Hoạt động gần đây</CardTitle>
          <CardDescription>10 giao dịch mới nhất</CardDescription>
        </CardHeader>
        <CardContent>
          {stats.recentMovements.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Chưa có hoạt động nào
            </p>
          ) : (
            <div className="space-y-3">
              {stats.recentMovements.map((movement) => (
                <div
                  key={movement.id}
                  className="flex items-start justify-between text-sm border-b pb-2 last:border-0"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          movement.type === "import"
                            ? "bg-green-100 text-green-700"
                            : movement.type === "export"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {movement.type === "import"
                          ? "Nhập"
                          : movement.type === "export"
                          ? "Xuất"
                          : "Điều chỉnh"}
                      </span>
                      <span className="font-medium">
                        {movement.quantity} SP
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {movement.product?.box?.lot?.code || "N/A"}
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
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
