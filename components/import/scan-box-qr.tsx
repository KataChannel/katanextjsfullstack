"use client"

import { useState } from "react"
import { QRScanner } from "@/components/qr-scanner"
import { getBoxByQRCode } from "@/lib/warehouse-actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package } from "lucide-react"

export function ScanBoxQR() {
  const [boxInfo, setBoxInfo] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleScan = async (qrData: string) => {
    setIsLoading(true)
    try {
      const box = await getBoxByQRCode(qrData)
      if (box) {
        setBoxInfo(box)
      } else {
        alert("Không tìm thấy thùng với mã QR này")
      }
    } catch (error) {
      alert("Lỗi khi quét QR")
    }
    setIsLoading(false)
  }

  return (
    <div className="space-y-4">
      <QRScanner
        onScan={handleScan}
        title="Quét QR Thùng"
        description="Quét mã QR trên thùng để xem thông tin"
      />

      {isLoading && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Đang tải...</p>
          </CardContent>
        </Card>
      )}

      {boxInfo && !isLoading && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>{boxInfo.name}</span>
            </CardTitle>
            <CardDescription>{boxInfo.code}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Lô</p>
                <p className="font-medium">{boxInfo.lot.name}</p>
                <p className="text-xs text-muted-foreground">{boxInfo.lot.code}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Kho</p>
                <p className="font-medium">{boxInfo.lot.warehouse.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Sức chứa</p>
                <p className="font-medium">{boxInfo.capacity} SP</p>
              </div>
              <div>
                <p className="text-muted-foreground">Đã chứa</p>
                <p className="font-medium">{boxInfo._count.products} SP</p>
              </div>
            </div>

            <div>
              <Badge variant={boxInfo._count.products < boxInfo.capacity ? "default" : "destructive"}>
                {boxInfo._count.products < boxInfo.capacity 
                  ? `Còn chỗ: ${boxInfo.capacity - boxInfo._count.products} SP`
                  : "Đã đầy"
                }
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}