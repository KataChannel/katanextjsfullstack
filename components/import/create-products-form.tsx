"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Combobox, ComboboxOption } from "@/components/ui/combobox"
import { createProducts, getBoxes } from "@/lib/warehouse-actions"
import { toast } from "sonner"
import { useEffect } from "react"

interface CreateProductsFormProps {
  lots: any[]
}

export function CreateProductsForm({ lots }: CreateProductsFormProps) {
  const [lotId, setLotId] = useState("")
  const [boxId, setBoxId] = useState("")
  const [boxes, setBoxes] = useState<any[]>([])
  const [name, setName] = useState("")
  const [quantity, setQuantity] = useState("1")
  const [unit, setUnit] = useState("pcs")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (lotId) {
      getBoxes(lotId).then(setBoxes)
    } else {
      setBoxes([])
    }
  }, [lotId])

  const lotOptions: ComboboxOption[] = lots.map(l => ({
    value: l.id,
    label: `${l.name} (${l.code})`
  }))

  const boxOptions: ComboboxOption[] = boxes.map(b => ({
    value: b.id,
    label: `${b.name} (${b.code})`
  }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name || !boxId || parseInt(quantity) < 1) {
      toast.error("Vui lòng điền đầy đủ thông tin")
      return
    }

    setIsLoading(true)
    const formData = new FormData()
    formData.append("name", name)
    formData.append("boxId", boxId)
    formData.append("quantity", quantity)
    formData.append("unit", unit)
    formData.append("userId", "demo-user-id")

    const result = await createProducts(formData)
    
    if (result.success) {
      toast.success(result.message || "Tạo sản phẩm thành công!")
      setName("")
      setQuantity("1")
    } else {
      toast.error(result.error || "Không thể tạo sản phẩm")
    }
    
    setIsLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tạo Sản Phẩm</CardTitle>
        <CardDescription>
          Thêm sản phẩm vào thùng đã tạo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Lô *</Label>
            <Combobox
              options={lotOptions}
              value={lotId}
              onValueChange={(value) => {
                setLotId(value)
                setBoxId("")
              }}
              placeholder="Chọn lô..."
            />
          </div>

          <div className="space-y-2">
            <Label>Thùng *</Label>
            <Combobox
              options={boxOptions}
              value={boxId}
              onValueChange={setBoxId}
              placeholder="Chọn thùng..."
              emptyText="Vui lòng chọn lô trước"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prod-name">Tên sản phẩm *</Label>
            <Input
              id="prod-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Sản phẩm A"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Số lượng *</Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Đơn vị</Label>
              <Input
                id="unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="pcs, kg, liter..."
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Đang tạo..." : "Tạo Sản Phẩm"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}