import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getUsers, getPosts } from "@/lib/actions"
import Link from "next/link"

export default async function AdminPage() {
  const users = await getUsers()
  const posts = await getPosts()

  const publishedPosts = posts.filter(post => post.published)
  const draftPosts = posts.filter(post => !post.published)

  const stats = {
    totalUsers: users.length,
    totalPosts: posts.length,
    publishedPosts: publishedPosts.length,
    draftPosts: draftPosts.length,
    recentUsers: users.slice(0, 5),
    recentPosts: posts.slice(0, 5)
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Tổng quan hệ thống</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/">← Trở về trang chủ</Link>
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Tổng Users</CardDescription>
            <CardTitle className="text-3xl">{stats.totalUsers}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Tổng Posts</CardDescription>
            <CardTitle className="text-3xl">{stats.totalPosts}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Posts Published</CardDescription>
            <CardTitle className="text-3xl text-green-600">{stats.publishedPosts}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Posts Draft</CardDescription>
            <CardTitle className="text-3xl text-yellow-600">{stats.draftPosts}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Hành động nhanh</CardTitle>
          <CardDescription>Các thao tác thường dùng</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button asChild>
              <Link href="/users">Quản lý Users</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/posts">Quản lý Posts</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="http://localhost:5556" target="_blank">
                Mở Prisma Studio
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Users gần đây</CardTitle>
            <CardDescription>5 người dùng mới nhất</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.recentUsers.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Chưa có user nào
              </p>
            ) : (
              <div className="space-y-4">
                {stats.recentUsers.map((user) => (
                  <div key={user.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{user.name || "Chưa có tên"}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">
                        {user.posts.length} posts
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Posts gần đây</CardTitle>
            <CardDescription>5 bài viết mới nhất</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.recentPosts.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Chưa có bài viết nào
              </p>
            ) : (
              <div className="space-y-4">
                {stats.recentPosts.map((post) => (
                  <div key={post.id} className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium line-clamp-1 flex-1">
                        {post.title}
                      </h4>
                      <Badge 
                        variant={post.published ? "default" : "secondary"}
                        className="ml-2"
                      >
                        {post.published ? "Published" : "Draft"}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>bởi {post.author.name || post.author.email}</span>
                      <span>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
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