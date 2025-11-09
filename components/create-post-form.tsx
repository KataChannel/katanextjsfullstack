'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createPost } from "@/lib/actions"
import { toast } from "sonner"
import { useRef } from "react"

interface User {
  id: string
  name: string | null
  email: string
}

interface CreatePostFormProps {
  users: User[]
}

export function CreatePostForm({ users }: CreatePostFormProps) {
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(formData: FormData) {
    const result = await createPost(formData)
    
    if (result.success) {
      toast.success(result.message || 'Post created successfully!')
      formRef.current?.reset()
    } else {
      toast.error(result.error || 'Failed to create post')
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Tiêu đề</Label>
        <Input 
          id="title" 
          name="title" 
          type="text" 
          placeholder="Tiêu đề bài viết"
          required 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="content">Nội dung</Label>
        <textarea 
          id="content" 
          name="content" 
          className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Nội dung bài viết..."
          rows={4}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="authorId">Tác giả</Label>
        <select 
          id="authorId" 
          name="authorId" 
          required
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">Chọn tác giả</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name || user.email}
            </option>
          ))}
        </select>
      </div>
      <Button type="submit" className="w-full">
        Tạo Post
      </Button>
    </form>
  )
}