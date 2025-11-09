"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Combobox, ComboboxOption } from "@/components/ui/combobox"
import { QRLabelPrinter } from "@/components/qr-label-printer"
import { getBoxes, generateQRCode } from "@/lib/warehouse-actions"
import { Loader2 } from "lucide-react"
import Image from "next/image"

interface ViewBoxesProps {
  lots: any[]
}

export function ViewBoxes({ lots }: ViewBoxesProps) {
  const [lotId, setLotId] = useState("")
  const [boxes, setBoxes] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [qrCodes, setQrCodes] = useState<Record<string, string>>({})

  const lotOptions: ComboboxOption[] = lots.map(l => ({
    value: l.id,
    label: `${l.name} (${l.code})`
  }))

  useEffect(() => {
    if (lotId) {
      loadBoxes()
    } else {
      setBoxes([])
      setQrCodes({})
    }
  }, [lotId])

  const loadBoxes = async () => {
    setIsLoading(true)
    try {
      const boxesData = await getBoxes(lotId)
      setBoxes(boxesData)
      
      // Generate QR codes for all boxes
      const qrCodesMap: Record<string, string> = {}
      for (const box of boxesData) {
        try {
          const qrImage = await generateQRCode(box.qrCode)
          qrCodesMap[box.id] = qrImage
        } catch (error) {
          console.error(`Error generating QR for box ${box.id}:`, error)
        }
      }
      setQrCodes(qrCodesMap)
    } catch (error) {
      console.error("Error loading boxes:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Xem Thùng Đã Tạo</CardTitle>
        <CardDescription>
          Xem lại QR code của các thùng và in lại nếu cần
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Chọn Lô *</Label>
          <Combobox
            options={lotOptions}
            value={lotId}
            onValueChange={setLotId}
            placeholder="Chọn lô để xem thùng..."
            searchPlaceholder="Tìm lô..."
            emptyText="Không tìm thấy lô"
          />
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {!isLoading && boxes.length > 0 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Tìm thấy {boxes.length} thùng
            </p>
            
            {boxes.map((box) => (
              <div key={box.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-base">{box.name}</h3>
                    <p className="text-xs text-muted-foreground font-mono">{box.code}</p>
                    {box.description && (
                      <p className="text-sm text-muted-foreground mt-1">{box.description}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Sức chứa</p>
                    <p className="font-medium">{box.capacity} SP</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Đã chứa</p>
                    <p className="font-medium text-green-600">{box.products?.length || 0} SP</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Còn trống</p>
                    <p className="font-medium">{box.capacity - (box.products?.length || 0)}</p>
                  </div>
                </div>

                {box.products && box.products.length > 0 && (
                  <div className="border-t pt-3 space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">Danh sách sản phẩm:</p>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {box.products.map((product: any, index: number) => (
                        <div key={product.id} className="flex justify-between items-center text-xs bg-muted/50 rounded px-2 py-1">
                          <span className="font-mono text-muted-foreground">#{index + 1}</span>
                          <span className="flex-1 mx-2 truncate">{product.name}</span>
                          <span className="font-medium">{product.quantity} {product.unit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {qrCodes[box.id] && (
                  <div className="space-y-3 pt-2 border-t">
                    <div className="flex justify-center">
                      <Image 
                        src={qrCodes[box.id]} 
                        alt={`QR Code ${box.code}`}
                        width={150}
                        height={150}
                        className="border rounded"
                      />
                    </div>
                    <QRLabelPrinter 
                      qrCodeDataUrl={qrCodes[box.id]}
                      title={box.name}
                      code={box.code}
                      additionalInfo={`THÙNG - Sức chứa: ${box.capacity} SP`}
                    />
                  </div>
                )}

                {!qrCodes[box.id] && (
                  <div className="text-center py-4">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground inline-block" />
                    <p className="text-xs text-muted-foreground mt-2">Đang tải QR...</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {!isLoading && lotId && boxes.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">Chưa có thùng nào trong lô này</p>
            <p className="text-xs mt-1">Tạo thùng mới ở tab "Tạo Thùng"</p>
          </div>
        )}

        {!lotId && (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">Chọn lô để xem danh sách thùng</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
