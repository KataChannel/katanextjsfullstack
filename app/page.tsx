import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPrisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight, Sparkles, TrendingUp, Award, Clock } from "lucide-react";

export default async function Home() {
  const prisma = await getPrisma('tazagroup.vn');
  
  const [featuredPosts, stats] = await Promise.all([
    prisma.post.findMany({
      where: { published: true },
      take: 3,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        createdAt: true,
        author: { select: { name: true, email: true } }
      }
    }),
    Promise.all([
      prisma.post.count({ where: { published: true } }),
      prisma.page.count({ where: { published: true } }),
      prisma.user.count(),
    ])
  ]);
  
  const [postsCount, pagesCount, usersCount] = stats;

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-linear-to-b from-primary/5 via-background to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="h-3 w-3 mr-1" />
              Chào mừng đến với Taza Group
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight">
              Làm đẹp tự nhiên
              <span className="block text-primary mt-2">An toàn - Hiệu quả</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Hệ thống thẩm mỹ viện và spa hàng đầu Việt Nam với công nghệ hiện đại, 
              đội ngũ chuyên gia giàu kinh nghiệm và cam kết mang đến vẻ đẹp tự nhiên.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button size="lg" asChild>
                <Link href="/lien-he">
                  Đặt lịch tư vấn
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/dich-vu">Xem dịch vụ</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12 border-y bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <p className="text-3xl sm:text-4xl font-bold">{postsCount}+</p>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground">Bài viết chuyên sâu</p>
            </div>
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                <p className="text-3xl sm:text-4xl font-bold">{pagesCount}+</p>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground">Dịch vụ chất lượng</p>
            </div>
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <p className="text-3xl sm:text-4xl font-bold">10+</p>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground">Năm kinh nghiệm</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3">
              Bài viết nổi bật
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Cập nhật những xu hướng làm đẹp mới nhất và kiến thức chăm sóc sắc đẹp từ chuyên gia
            </p>
          </div>

          {featuredPosts.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Chưa có bài viết nào. Vui lòng chạy seed để tạo dữ liệu mẫu.</p>
                <Button variant="outline" className="mt-4" asChild>
                  <Link href="/admin">Đi tới Admin</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPosts.map((post) => (
                <Card key={post.id} className="flex flex-col hover:shadow-lg transition-all duration-200">
                  <CardHeader>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <Clock className="h-3 w-3" />
                      {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                    </div>
                    <CardTitle className="line-clamp-2 hover:text-primary transition-colors">
                      <Link href={`/posts/${post.slug}`}>
                        {post.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <CardDescription className="line-clamp-3 mb-4 flex-1">
                      {post.excerpt || 'Đọc thêm để khám phá...'}
                    </CardDescription>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <span className="text-xs text-muted-foreground">
                        {post.author.name || post.author.email}
                      </span>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/posts/${post.slug}`}>
                          Đọc thêm <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-8 sm:mt-12">
            <Button size="lg" variant="outline" asChild>
              <Link href="/posts">
                Xem tất cả bài viết
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-20 bg-primary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-primary/20 bg-card/50 backdrop-blur">
            <CardContent className="p-8 sm:p-12 text-center space-y-6">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                Bắt đầu hành trình làm đẹp của bạn
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
                Đặt lịch tư vấn miễn phí ngay hôm nay và nhận ưu đãi đặc biệt cho khách hàng mới
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" asChild>
                  <Link href="/lien-he">
                    Liên hệ ngay
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/ve-chung-toi">Tìm hiểu thêm</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
