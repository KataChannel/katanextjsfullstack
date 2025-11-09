"use client"

import { useState } from "react"
import { QRScanner } from "@/components/qr-scanner"
import { getProductByQRCode, exportProducts } from "@/lib/warehouse-actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Package, X } from "lucide-react"
import { toast } from "sonner"

export default function ExportPage() {
  const [scannedProducts, setScannedProducts] = useState<any[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const handleScan = async (qrData: string) => {
    try {
      const product = await getProductByQRCode(qrData)
      
      if (!product) {
        toast.error("Không tìm thấy sản phẩm")
        return
      }

      if (product.status !== "in_stock") {
        toast.error("Sản phẩm đã được xuất hoặc không khả dụng")
        return
      }

      // Check if already scanned
      if (scannedProducts.find(p => p.id === product.id)) {
        toast.warning("Sản phẩm đã được quét")
        return
      }

      setScannedProducts(prev => [...prev, product])
      toast.success("Đã thêm sản phẩm")
    } catch (error) {
      toast.error("Lỗi khi quét QR")
    }
  }

  const handleRemove = (productId: string) => {
    setScannedProducts(prev => prev.filter(p => p.id !== productId))
  }

  const handleExport = async () => {
    if (scannedProducts.length === 0) {
      toast.error("Chưa có sản phẩm nào để xuất")
      return
    }

    setIsProcessing(true)
    const formData = new FormData()
    formData.append("productIds", JSON.stringify(scannedProducts.map(p => p.id)))
    formData.append("userId", "demo-user-id")
    formData.append("note", "Xuất kho")

    const result = await exportProducts(formData)
    
    if (result.success) {
      toast.success(result.message || "Xuất kho thành công!")
      setScannedProducts([])
    } else {
      toast.error(result.error || "Không thể xuất kho")
    }
    
    setIsProcessing(false)
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Xuất Hàng</h1>
        <p className="text-sm text-muted-foreground">
          Quét QR từng sản phẩm để xuất kho
        </p>
      </div>

      <QRScanner
        onScan={handleScan}
        title="Quét QR Sản Phẩm"
        description="Quét mã QR trên sản phẩm cần xuất"
      />

      {scannedProducts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Danh sách xuất ({scannedProducts.length})</span>
              <Button 
                onClick={handleExport} 
                disabled={isProcessing}
                size="sm"
              >
                {isProcessing ? "Đang xuất..." : "Xác nhận xuất"}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {scannedProducts.map((product, index) => (
              <div key={product.id}>
                {index > 0 && <Separator className="my-2" />}
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium text-sm">{product.name}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{product.code}</p>
                    <div className="flex items-center space-x-2 text-xs">
                      <Badge variant="outline">
                        {product.box.lot.code}
                      </Badge>
                      <span className="text-muted-foreground">
                        {product.box.name}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemove(product.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}