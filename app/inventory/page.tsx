"use client"

import { useState } from "react"
import { QRScanner } from "@/components/qr-scanner"
import { getProductByQRCode, createInventoryCheck } from "@/lib/warehouse-actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle } from "lucide-react"
import { toast } from "sonner"

export default function InventoryPage() {
  const [currentProduct, setCurrentProduct] = useState<any>(null)
  const [checkedCount, setCheckedCount] = useState(0)

  const handleScan = async (qrData: string) => {
    try {
      const product = await getProductByQRCode(qrData)
      
      if (!product) {
        toast.error("Không tìm thấy sản phẩm")
        return
      }

      setCurrentProduct(product)
    } catch (error) {
      toast.error("Lỗi khi quét QR")
    }
  }

  const handleCheck = async (actualQty: number) => {
    if (!currentProduct) return

    const formData = new FormData()
    formData.append("productId", currentProduct.id)
    formData.append("userId", "demo-user-id")
    formData.append("actualQty", actualQty.toString())

    const result = await createInventoryCheck(formData)
    
    if (result.success) {
      toast.success("Kiểm kê thành công!")
      setCheckedCount(prev => prev + 1)
      setCurrentProduct(null)
    } else {
      toast.error(result.error || "Không thể kiểm kê")
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Kiểm Kê</h1>
        <p className="text-sm text-muted-foreground">
          Quét QR từng sản phẩm để kiểm tra tồn kho
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Đã kiểm</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">{checkedCount}</div>
          <p className="text-sm text-muted-foreground">sản phẩm</p>
        </CardContent>
      </Card>

      <QRScanner
        onScan={handleScan}
        title="Quét QR Sản Phẩm"
        description="Quét mã QR để kiểm kê"
      />

      {currentProduct && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{currentProduct.name}</CardTitle>
            <CardDescription>{currentProduct.code}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Lô</p>
                <p className="font-medium">{currentProduct.box.lot.code}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Thùng</p>
                <p className="font-medium">{currentProduct.box.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Trạng thái</p>
                <Badge variant={currentProduct.status === "in_stock" ? "default" : "secondary"}>
                  {currentProduct.status === "in_stock" ? "Còn hàng" : "Đã xuất"}
                </Badge>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={() => handleCheck(1)}
                className="flex-1"
                variant={currentProduct.status === "in_stock" ? "default" : "outline"}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Có hàng
              </Button>
              <Button
                onClick={() => handleCheck(0)}
                className="flex-1"
                variant={currentProduct.status === "in_stock" ? "outline" : "default"}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Không có
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}