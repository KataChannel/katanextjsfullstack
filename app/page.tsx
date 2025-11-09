import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getUsers, getPosts } from "@/lib/actions"
import Link from "next/link"

export default async function Home() {
  const users = await getUsers()
  const posts = await getPosts()

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Kata Next.js Fullstack
        </h1>
        <p className="text-lg text-muted-foreground">
          Dự án sử dụng Next.js, shadcn/ui, Prisma và Server Actions
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild>
            <Link href="/users">Quản lý Users</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/posts">Quản lý Posts</Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/admin">Admin Dashboard</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Users ({users.length})</CardTitle>
            <CardDescription>
              Danh sách người dùng trong hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent>
            {users.length === 0 ? (
              <p className="text-muted-foreground">Chưa có user nào</p>
            ) : (
              <div className="space-y-2">
                {users.slice(0, 3).map((user) => (
                  <div key={user.id} className="flex justify-between items-center">
                    <span className="font-medium">{user.name || user.email}</span>
                    <span className="text-sm text-muted-foreground">
                      {user.posts.length} posts
                    </span>
                  </div>
                ))}
                {users.length > 3 && (
                  <p className="text-sm text-muted-foreground">
                    và {users.length - 3} user khác...
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Posts ({posts.length})</CardTitle>
            <CardDescription>
              Các bài viết gần đây
            </CardDescription>
          </CardHeader>
          <CardContent>
            {posts.length === 0 ? (
              <p className="text-muted-foreground">Chưa có bài viết nào</p>
            ) : (
              <div className="space-y-2">
                {posts.slice(0, 3).map((post) => (
                  <div key={post.id} className="space-y-1">
                    <h4 className="font-medium line-clamp-1">{post.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      bởi {post.author.name || post.author.email}
                    </p>
                  </div>
                ))}
                {posts.length > 3 && (
                  <p className="text-sm text-muted-foreground">
                    và {posts.length - 3} bài viết khác...
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
