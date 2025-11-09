"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Combobox, ComboboxOption } from "@/components/ui/combobox"
import { QRLabelPrinter } from "@/components/qr-label-printer"
import { createBox, generateQRCode } from "@/lib/warehouse-actions"
import { toast } from "sonner"
import Image from "next/image"

interface CreateBoxFormProps {
  lots: any[]
}

export function CreateBoxForm({ lots }: CreateBoxFormProps) {
  const [lotId, setLotId] = useState("")
  const [name, setName] = useState("")
  const [capacity, setCapacity] = useState("100")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [qrCodeImage, setQrCodeImage] = useState("")
  const [boxCode, setBoxCode] = useState("")
  const [boxName, setBoxName] = useState("")

  const lotOptions: ComboboxOption[] = lots.map(l => ({
    value: l.id,
    label: `${l.name} (${l.code})`
  }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name || !lotId) {
      toast.error("Vui lòng điền đầy đủ thông tin")
      return
    }

    setIsLoading(true)
    const formData = new FormData()
    formData.append("name", name)
    formData.append("lotId", lotId)
    formData.append("capacity", capacity)
    formData.append("description", description)

    const result = await createBox(formData)
    
    if (result.success && result.box) {
      toast.success(result.message || "Tạo thùng thành công!")
      
      // Generate QR code for display
      try {
        const qrImage = await generateQRCode(result.box.qrCode)
        setQrCodeImage(qrImage)
        setBoxCode(result.box.code)
        setBoxName(result.box.name)
      } catch (error) {
        console.error("Error generating QR:", error)
      }
      
      setName("")
      setDescription("")
    } else {
      toast.error(result.error || "Không thể tạo thùng")
    }
    
    setIsLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tạo Thùng Mới</CardTitle>
        <CardDescription>
          Tạo thùng để chứa sản phẩm và in QR code
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="lot">Lô *</Label>
            <Combobox
              options={lotOptions}
              value={lotId}
              onValueChange={setLotId}
              placeholder="Chọn lô..."
              searchPlaceholder="Tìm lô..."
              emptyText="Không tìm thấy lô"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="box-name">Tên thùng *</Label>
            <Input
              id="box-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Thùng A1"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacity">Sức chứa (sản phẩm)</Label>
            <Input
              id="capacity"
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              placeholder="100"
              min="1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="box-description">Mô tả</Label>
            <Input
              id="box-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả về thùng..."
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Đang tạo..." : "Tạo Thùng & QR"}
          </Button>
        </form>

        {qrCodeImage && (
          <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
            <div className="text-center">
              <p className="text-sm font-medium mb-2">Mã QR của thùng</p>
              <div className="flex justify-center">
                <Image 
                  src={qrCodeImage} 
                  alt="QR Code" 
                  width={200}
                  height={200}
                  className="border rounded"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">{boxCode}</p>
            </div>
            <QRLabelPrinter 
              qrCodeDataUrl={qrCodeImage}
              title={boxName}
              code={boxCode}
              additionalInfo="THÙNG - Quét để xem sản phẩm"
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}