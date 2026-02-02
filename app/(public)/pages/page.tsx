import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPrisma } from "@/lib/prisma";
import { generateSEOMetadata } from "@/lib/seo";
import Link from "next/link";
import { Clock, User, ArrowRight, Sparkles, FileText } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = generateSEOMetadata({
  title: "Trang - Danh sách các trang",
  description: "Khám phá các trang thông tin của chúng tôi",
  ogType: "website",
});

export default async function PagesListPage() {
  const prisma = await getPrisma('innerbright.vn');

  const pages = await prisma.page.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      metaDescription: true,
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
              Danh sách các trang
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground">
              Khám phá các trang thông tin và dịch vụ của chúng tôi
            </p>
            <Badge variant="secondary" className="mt-4">
              {pages.length} trang
            </Badge>
          </div>
        </div>
      </section>

      {/* Pages List */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {pages.length === 0 ? (
            <div className="min-h-[50vh] flex items-center justify-center">
              <Card className="w-full max-w-2xl mx-4">
                <CardContent className="p-12 text-center space-y-6">
                  <div className="flex justify-center mb-4">
                    <Sparkles className="h-16 w-16 text-primary animate-pulse" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                    Danh Sách Trang Đang Cập Nhật
                  </h2>
                  <p className="text-muted-foreground text-lg">
                    Chúng tôi đang hoàn thiện nội dung để mang đến thông tin tốt nhất cho bạn.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
                    <Button size="lg" asChild>
                      <Link href="/">
                        Về trang chủ
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                      <Link href="/admin">Đi tới Admin</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {pages.map((page) => (
                <Card
                  key={page.id}
                  className="flex flex-col hover:shadow-xl transition-all duration-300 group"
                >
                  <CardHeader className="space-y-3">
                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        <span>Trang</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <time dateTime={new Date(page.createdAt).toISOString()}>
                          {new Date(page.createdAt).toLocaleDateString('vi-VN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </time>
                      </div>
                    </div>

                    {/* Title */}
                    <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                      <Link href={`/pages/${page.slug}`} className="hover:underline">
                        {page.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col space-y-4">
                    {/* Description */}
                    <CardDescription className="line-clamp-3 flex-1">
                      {page.metaDescription || 'Nhấn để xem thêm nội dung chi tiết...'}
                    </CardDescription>

                    {/* Footer */}
                    <div className="pt-4 border-t flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <User className="h-3 w-3" />
                        <span className="truncate max-w-[150px]">
                          {page.author.name || page.author.email}
                        </span>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/pages/${page.slug}`}>
                          Xem thêm
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
      {pages.length > 0 && (
        <section className="py-12 sm:py-16 bg-muted/30 border-t">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold">
              Bạn muốn được tư vấn thêm?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Liên hệ với chúng tôi để nhận tư vấn miễn phí từ các chuyên gia
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
