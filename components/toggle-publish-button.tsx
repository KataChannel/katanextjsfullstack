'use client'

import { Button } from "@/components/ui/button"
import { togglePostPublished } from "@/lib/actions"
import { toast } from "sonner"

interface TogglePublishButtonProps {
  postId: string
  published: boolean
}

export function TogglePublishButton({ postId, published }: TogglePublishButtonProps) {
  async function handleToggle() {
    const formData = new FormData()
    formData.append('postId', postId)
    
    const result = await togglePostPublished(formData)
    
    if (result.success) {
      toast.success(result.message || 'Post updated successfully!')
    } else {
      toast.error(result.error || 'Failed to update post')
    }
  }

  return (
    <Button onClick={handleToggle} variant="outline" size="sm">
      {published ? 'Unpublish' : 'Publish'}
    </Button>
  )
}