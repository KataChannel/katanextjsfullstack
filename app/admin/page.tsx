import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getPrisma } from "@/lib/prisma";
import Link from "next/link";
import { FileText, Image, Users, Layout, Settings, BarChart3 } from "lucide-react";

export default async function AdminPage() {
  const prisma = await getPrisma();
  const [postsCount, pagesCount, usersCount, mediaCount] = await Promise.all([
    prisma.post.count(),
    prisma.page.count(),
    prisma.user.count(),
    prisma.media.count(),
  ]);

  const stats = [
    { title: "Bài viết", count: postsCount, icon: FileText, href: "/admin/content", description: "Quản lý bài viết blog" },
    { title: "Trang", count: pagesCount, icon: Layout, href: "/admin/content", description: "Quản lý trang tĩnh" },
    { title: "Người dùng", count: usersCount, icon: Users, href: "/users", description: "Quản lý người dùng" },
    { title: "Media", count: mediaCount, icon: Image, href: "/admin/media", description: "Thư viện hình ảnh" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">Chào mừng đến với trang quản trị website</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.count}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                <Button variant="link" className="px-0 mt-2" asChild>
                  <Link href={stat.href}>Quản lý →</Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thao tác nhanh</CardTitle>
          <CardDescription>Các công cụ và tính năng thường dùng</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button variant="outline" className="justify-start h-auto py-4" asChild>
            <Link href="/admin/content">
              <FileText className="mr-2 h-5 w-5" />
              <div className="text-left"><div className="font-semibold">Quản lý Nội dung</div><div className="text-xs text-muted-foreground">Pages, Posts, Builder</div></div>
            </Link>
          </Button>
          <Button variant="outline" className="justify-start h-auto py-4" asChild>
            <Link href="/admin/page-builder">
              <Layout className="mr-2 h-5 w-5" />
              <div className="text-left"><div className="font-semibold">Page Builder</div><div className="text-xs text-muted-foreground">Visual Editor</div></div>
            </Link>
          </Button>
          <Button variant="outline" className="justify-start h-auto py-4" asChild>
            <Link href="/admin/media">
              <Image className="mr-2 h-5 w-5" />
              <div className="text-left"><div className="font-semibold">Thư viện Media</div><div className="text-xs text-muted-foreground">Upload file</div></div>
            </Link>
          </Button>
          <Button variant="outline" className="justify-start h-auto py-4" asChild>
            <Link href="/admin/seo-settings">
              <Settings className="mr-2 h-5 w-5" />
              <div className="text-left"><div className="font-semibold">Cài đặt SEO</div><div className="text-xs text-muted-foreground">Cấu hình SEO</div></div>
            </Link>
          </Button>
          <Button variant="outline" className="justify-start h-auto py-4" asChild>
            <Link href="/admin/analytics">
              <BarChart3 className="mr-2 h-5 w-5" />
              <div className="text-left"><div className="font-semibold">Analytics</div><div className="text-xs text-muted-foreground">Thống kê</div></div>
            </Link>
          </Button>
          <Button variant="outline" className="justify-start h-auto py-4" asChild>
            <Link href="/users">
              <Users className="mr-2 h-5 w-5" />
              <div className="text-left"><div className="font-semibold">Người dùng</div><div className="text-xs text-muted-foreground">Quản lý users</div></div>
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hoạt động gần đây</CardTitle>
          <CardDescription>Các thay đổi và cập nhật mới nhất</CardDescription>
        </CardHeader>
        <CardContent><RecentActivity /></CardContent>
      </Card>
    </div>
  );
}

async function RecentActivity() {
  const prisma = await getPrisma();
  const [recentPosts, recentPages] = await Promise.all([
    prisma.post.findMany({ take: 3, orderBy: { updatedAt: 'desc' }, include: { author: true } }),
    prisma.page.findMany({ take: 3, orderBy: { updatedAt: 'desc' }, include: { author: true } }),
  ]);

  return (
    <div className="space-y-4">
      {recentPosts.length === 0 && recentPages.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">Chưa có hoạt động nào</p>
      ) : (
        <>
          {recentPosts.map((post) => (
            <div key={`post-${post.id}`} className="flex items-center justify-between py-2 border-b last:border-0">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{post.title}</p>
                  <p className="text-xs text-muted-foreground">Bài viết • Bởi {post.author.name || 'Admin'}</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">{new Date(post.updatedAt).toLocaleDateString('vi-VN')}</span>
            </div>
          ))}
          {recentPages.map((page) => (
            <div key={`page-${page.id}`} className="flex items-center justify-between py-2 border-b last:border-0">
              <div className="flex items-center gap-3">
                <Layout className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{page.title}</p>
                  <p className="text-xs text-muted-foreground">Trang • Bởi {page.author.name || 'Admin'}</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">{new Date(page.updatedAt).toLocaleDateString('vi-VN')}</span>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
