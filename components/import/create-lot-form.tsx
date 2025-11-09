"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Combobox, ComboboxOption } from "@/components/ui/combobox"
import { createLot } from "@/lib/warehouse-actions"
import { toast } from "sonner"

interface CreateLotFormProps {
  warehouses: any[]
}

export function CreateLotForm({ warehouses }: CreateLotFormProps) {
  const [warehouseId, setWarehouseId] = useState("")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const warehouseOptions: ComboboxOption[] = warehouses.map(w => ({
    value: w.id,
    label: `${w.name} (${w.code})`
  }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name || !warehouseId) {
      toast.error("Vui lòng điền đầy đủ thông tin")
      return
    }

    setIsLoading(true)
    const formData = new FormData()
    formData.append("name", name)
    formData.append("warehouseId", warehouseId)
    formData.append("description", description)
    formData.append("userId", "demo-user-id") // TODO: Get from auth

    const result = await createLot(formData)
    
    if (result.success) {
      toast.success(result.message || "Tạo lô thành công!")
      setName("")
      setDescription("")
    } else {
      toast.error(result.error || "Không thể tạo lô")
    }
    
    setIsLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tạo Lô Mới</CardTitle>
        <CardDescription>
          Tạo lô hàng để nhóm các thùng cùng đợt nhập
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="warehouse">Kho *</Label>
            <Combobox
              options={warehouseOptions}
              value={warehouseId}
              onValueChange={setWarehouseId}
              placeholder="Chọn kho..."
              searchPlaceholder="Tìm kho..."
              emptyText="Không tìm thấy kho"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Tên lô *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Lô hàng tháng 11"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả về lô hàng..."
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Đang tạo..." : "Tạo Lô"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}