'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createUser } from "@/lib/actions"
import { toast } from "sonner"
import { useRef } from "react"

export function CreateUserForm() {
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(formData: FormData) {
    const result = await createUser(formData)
    
    if (result.success) {
      toast.success(result.message || 'User created successfully!')
      formRef.current?.reset()
    } else {
      toast.error(result.error || 'Failed to create user')
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          name="email" 
          type="email" 
          placeholder="user@example.com"
          required 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">Tên (tùy chọn)</Label>
        <Input 
          id="name" 
          name="name" 
          type="text" 
          placeholder="Nguyễn Văn A" 
        />
      </div>
      <Button type="submit" className="w-full">
        Tạo User
      </Button>
    </form>
  )
}