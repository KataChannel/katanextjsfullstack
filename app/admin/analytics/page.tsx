import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getPrisma } from "@/lib/prisma";
import Link from "next/link";
import { 
  TrendingUp, 
  Eye, 
  FileText, 
  Users, 
  Calendar,
  Activity,
  BarChart3,
  PieChart,
  Clock
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function AnalyticsPage() {
  const prisma = await getPrisma();
  
  // Lấy thống kê tổng quan
  const [
    totalPosts,
    totalPages,
    totalUsers,
    totalMedia,
    publishedPosts,
    publishedPages,
    draftPosts,
    draftPages,
    recentPosts,
    recentPages,
    recentUsers,
  ] = await Promise.all([
    prisma.post.count(),
    prisma.page.count(),
    prisma.user.count(),
    prisma.media.count(),
    prisma.post.count({ where: { published: true } }),
    prisma.page.count({ where: { published: true } }),
    prisma.post.count({ where: { published: false } }),
    prisma.page.count({ where: { published: false } }),
    prisma.post.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        published: true,
        createdAt: true,
        author: { select: { name: true, email: true } }
      }
    }),
    prisma.page.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        published: true,
        createdAt: true,
        author: { select: { name: true, email: true } }
      }
    }),
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: { select: { posts: true, pages: true } }
      }
    }),
  ]);

  // Tính % tăng trưởng (giả lập - có thể cải thiện với dữ liệu thực)
  const postGrowth = totalPosts > 0 ? Math.round((publishedPosts / totalPosts) * 100) : 0;
  const pageGrowth = totalPages > 0 ? Math.round((publishedPages / totalPages) * 100) : 0;

  const stats = [
    { 
      title: "Tổng bài viết", 
      count: totalPosts, 
      icon: FileText, 
      description: `${publishedPosts} đã xuất bản, ${draftPosts} nháp`,
      trend: postGrowth,
      color: "text-blue-600"
    },
    { 
      title: "Tổng trang", 
      count: totalPages, 
      icon: BarChart3, 
      description: `${publishedPages} đã xuất bản, ${draftPages} nháp`,
      trend: pageGrowth,
      color: "text-green-600"
    },
    { 
      title: "Người dùng", 
      count: totalUsers, 
      icon: Users, 
      description: "Tổng số người dùng",
      color: "text-purple-600"
    },
    { 
      title: "Media files", 
      count: totalMedia, 
      icon: PieChart, 
      description: "Tổng số file media",
      color: "text-orange-600"
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold">Thống kê Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Theo dõi hiệu suất và hoạt động của website
        </p>
      </div>

      {/* Stats Cards - Mobile First Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="hover:shadow-lg transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="text-3xl font-bold">{stat.count}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
                {stat.trend !== undefined && (
                  <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                    <TrendingUp className="h-3 w-3" />
                    {stat.trend}% xuất bản
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tabs - Mobile First */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-auto">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">
            <Activity className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Tổng quan</span>
            <span className="sm:hidden">Tổng</span>
          </TabsTrigger>
          <TabsTrigger value="content" className="text-xs sm:text-sm">
            <FileText className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Nội dung</span>
            <span className="sm:hidden">Content</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="text-xs sm:text-sm">
            <Users className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Người dùng</span>
            <span className="sm:hidden">Users</span>
          </TabsTrigger>
        </TabsList>

        {/* Tổng quan */}
        <TabsContent value="overview" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Hoạt động gần đây
              </CardTitle>
              <CardDescription>Nội dung được tạo và cập nhật mới nhất</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  Bài viết mới nhất
                </h3>
                <div className="space-y-3">
                  {recentPosts.map((post) => (
                    <div key={post.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{post.title}</p>
                        <p className="text-xs text-muted-foreground">
                          Bởi {post.author.name || post.author.email}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant={post.published ? "default" : "secondary"} className="text-xs">
                          {post.published ? "Đã xuất bản" : "Nháp"}
                        </Badge>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Phân bổ nội dung
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Bài viết đã xuất bản</span>
                    <span className="font-bold text-blue-600">{publishedPosts}</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 transition-all" 
                      style={{ width: `${postGrowth}%` }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Trang đã xuất bản</span>
                    <span className="font-bold text-green-600">{publishedPages}</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-600 transition-all" 
                      style={{ width: `${pageGrowth}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Nội dung */}
        <TabsContent value="content" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Bài viết gần đây
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {recentPosts.map((post) => (
                  <div key={post.id} className="flex flex-col gap-2 p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-sm flex-1 line-clamp-2">{post.title}</p>
                      <Badge variant={post.published ? "default" : "secondary"} className="text-xs shrink-0">
                        {post.published ? "Live" : "Draft"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                  Trang gần đây
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {recentPages.map((page) => (
                  <div key={page.id} className="flex flex-col gap-2 p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-sm flex-1 line-clamp-2">{page.title}</p>
                      <Badge variant={page.published ? "default" : "secondary"} className="text-xs shrink-0">
                        {page.published ? "Live" : "Draft"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {new Date(page.createdAt).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Người dùng */}
        <TabsContent value="users" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Người dùng hoạt động
              </CardTitle>
              <CardDescription>Danh sách người dùng và đóng góp của họ</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentUsers.map((user) => (
                  <div key={user.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{user.name || 'Chưa đặt tên'}</p>
                      <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {user.role}
                      </Badge>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          {user._count.posts} bài
                        </span>
                        <span className="flex items-center gap-1">
                          <BarChart3 className="h-3 w-3" />
                          {user._count.pages} trang
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions - Mobile First */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Hành động nhanh</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Button variant="outline" className="justify-start h-auto py-3" asChild>
            <Link href="/posts">
              <FileText className="mr-2 h-4 w-4" />
              Tạo bài viết mới
            </Link>
          </Button>
          <Button variant="outline" className="justify-start h-auto py-3" asChild>
            <Link href="/admin/page-builder">
              <BarChart3 className="mr-2 h-4 w-4" />
              Tạo trang mới
            </Link>
          </Button>
          <Button variant="outline" className="justify-start h-auto py-3" asChild>
            <Link href="/admin/seo-settings">
              <Activity className="mr-2 h-4 w-4" />
              Cài đặt SEO
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
