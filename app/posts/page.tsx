import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreatePostForm } from "@/components/create-post-form"
import { TogglePublishButton } from "@/components/toggle-publish-button"
import { getPosts, getUsers } from "@/lib/actions"
import Link from "next/link"

export default async function PostsPage() {
  const posts = await getPosts()
  const users = await getUsers()

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Quản lý Posts</h1>
        <Button variant="outline" asChild>
          <Link href="/">← Trở về</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Tạo Post mới</CardTitle>
            <CardDescription>
              Viết một bài post mới
            </CardDescription>
          </CardHeader>
          <CardContent>
            {users.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Chưa có user nào để tạo post
                </p>
                <Button asChild variant="outline">
                  <Link href="/users">Tạo User trước</Link>
                </Button>
              </div>
            ) : (
              <CreatePostForm users={users} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách Posts ({posts.length})</CardTitle>
            <CardDescription>
              Tất cả bài viết trong hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent>
            {posts.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Chưa có bài viết nào. Hãy tạo bài viết đầu tiên!
              </p>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <div 
                    key={post.id} 
                    className="p-4 border rounded-lg space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          bởi {post.author.name || post.author.email}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded ${
                          post.published 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                        }`}>
                          {post.published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </div>
                    
                    {post.content && (
                      <p className="text-sm line-clamp-3">
                        {post.content}
                      </p>
                    )}
                    
                    <div className="flex justify-between items-center pt-2 border-t text-xs text-muted-foreground">
                      <span>
                        {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                      <TogglePublishButton postId={post.id} published={post.published} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}