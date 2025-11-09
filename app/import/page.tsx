import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreateLotForm } from "@/components/import/create-lot-form"
import { CreateBoxForm } from "@/components/import/create-box-form"
import { CreateProductsForm } from "@/components/import/create-products-form"
import { ScanBoxQR } from "@/components/import/scan-box-qr"
import { ViewBoxes } from "@/components/import/view-boxes"
import { getLots, getWarehouses } from "@/lib/warehouse-actions"

export default async function ImportPage() {
  const [warehouses, lots] = await Promise.all([
    getWarehouses(),
    getLots()
  ])

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Nhập Hàng</h1>
        <p className="text-sm text-muted-foreground">
          Quy trình: Tạo Lô → Tạo Thùng → Tạo Sản phẩm → Quét QR
        </p>
      </div>

      <Tabs defaultValue="lot" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="lot">1. Lô</TabsTrigger>
          <TabsTrigger value="box">2. Thùng</TabsTrigger>
          <TabsTrigger value="product">3. SP</TabsTrigger>
          <TabsTrigger value="view">📦 Xem</TabsTrigger>
          <TabsTrigger value="scan">Quét</TabsTrigger>
        </TabsList>

        <TabsContent value="lot" className="space-y-4 mt-4">
          <CreateLotForm warehouses={warehouses} />
        </TabsContent>

        <TabsContent value="box" className="space-y-4 mt-4">
          <CreateBoxForm lots={lots} />
        </TabsContent>

        <TabsContent value="product" className="space-y-4 mt-4">
          <CreateProductsForm lots={lots} />
        </TabsContent>

        <TabsContent value="view" className="space-y-4 mt-4">
          <ViewBoxes lots={lots} />
        </TabsContent>

        <TabsContent value="scan" className="space-y-4 mt-4">
          <ScanBoxQR />
        </TabsContent>
      </Tabs>
    </div>
  )
}