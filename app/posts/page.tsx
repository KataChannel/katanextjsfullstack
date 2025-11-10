import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPrisma } from "@/lib/prisma";
import { generateSEOMetadata } from "@/lib/seo";
import Link from "next/link";
import { Clock, User, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = generateSEOMetadata({
  title: "Blog - Kiến thức làm đẹp",
  description: "Khám phá những bài viết hữu ích về làm đẹp, chăm sóc da và xu hướng thẩm mỹ mới nhất",
  ogType: "website",
});

export default async function BlogListPage() {
  const prisma = await getPrisma('tazagroup.vn');
  
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      createdAt: true,
      author: {
        select: {
          name: true,
          email: true,
        }
      }
    }
  });

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <section className="bg-linear-to-b from-primary/5 to-background py-12 sm:py-16 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              Blog làm đẹp
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground">
              Cập nhật kiến thức chăm sóc sắc đẹp, xu hướng làm đẹp và tips từ chuyên gia
            </p>
            <Badge variant="secondary" className="mt-4">
              {posts.length} bài viết
            </Badge>
          </div>
        </div>
      </section>

      {/* Blog List */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center space-y-4">
                <p className="text-lg text-muted-foreground">
                  Chưa có bài viết nào được xuất bản.
                </p>
                <Button variant="outline" asChild>
                  <Link href="/">Về trang chủ</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {posts.map((post) => (
                <Card 
                  key={post.id} 
                  className="flex flex-col hover:shadow-xl transition-all duration-300 group"
                >
                  <CardHeader className="space-y-3">
                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <time dateTime={post.createdAt.toISOString()}>
                          {new Date(post.createdAt).toLocaleDateString('vi-VN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </time>
                      </div>
                    </div>

                    {/* Title */}
                    <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                      <Link href={`/posts/${post.slug}`} className="hover:underline">
                        {post.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col space-y-4">
                    {/* Excerpt */}
                    <CardDescription className="line-clamp-3 flex-1">
                      {post.excerpt || 'Nhấn để đọc thêm nội dung chi tiết...'}
                    </CardDescription>

                    {/* Footer */}
                    <div className="pt-4 border-t flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <User className="h-3 w-3" />
                        <span className="truncate max-w-[150px]">
                          {post.author.name || post.author.email}
                        </span>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/posts/${post.slug}`}>
                          Đọc thêm
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      {posts.length > 0 && (
        <section className="py-12 sm:py-16 bg-muted/30 border-t">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold">
              Bạn muốn được tư vấn thêm?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Liên hệ với chúng tôi để nhận tư vấn miễn phí từ các chuyên gia làm đẹp
            </p>
            <Button size="lg" asChild>
              <Link href="/lien-he">
                Liên hệ ngay
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}