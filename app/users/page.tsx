import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreateUserForm } from "@/components/create-user-form"
import { getUsers } from "@/lib/actions"
import Link from "next/link"

export default async function UsersPage() {
  const users = await getUsers()

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Quản lý Users</h1>
        <Button variant="outline" asChild>
          <Link href="/">← Trở về</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Thêm User mới</CardTitle>
            <CardDescription>
              Tạo một người dùng mới trong hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreateUserForm />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách Users ({users.length})</CardTitle>
            <CardDescription>
              Tất cả người dùng trong hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent>
            {users.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Chưa có user nào. Hãy tạo user đầu tiên!
              </p>
            ) : (
              <div className="space-y-4">
                {users.map((user) => (
                  <div 
                    key={user.id} 
                    className="p-4 border rounded-lg space-y-2"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">
                          {user.name || "Chưa có tên"}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {user.posts.length} posts
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    </div>
                    {user.posts.length > 0 && (
                      <div className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground mb-1">
                          Bài viết gần đây:
                        </p>
                        {user.posts.slice(0, 2).map((post) => (
                          <p key={post.id} className="text-sm truncate">
                            • {post.title}
                          </p>
                        ))}
                        {user.posts.length > 2 && (
                          <p className="text-xs text-muted-foreground">
                            và {user.posts.length - 2} bài khác...
                          </p>
                        )}
                      </div>
                    )}
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