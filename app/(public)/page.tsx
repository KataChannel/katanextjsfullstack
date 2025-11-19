import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPrisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { extractDomain } from "@/lib/database";
import Link from "next/link";
import { ArrowRight, Sparkles, TrendingUp, Award, Clock, Star, Quote } from "lucide-react";
import { CustomHomePage } from "@/components/custom-homepage";
import { CarouselComponent } from "@/components/CarouselComponent";
import { FrontendBlockRenderer } from "@/components/block-editor/FrontendBlockRenderer";
import type { Block } from "@/lib/blocks/types";

export default async function Home() {
  // Get current domain from proxy middleware (x-domain header)
  const headersList = await headers();
  const domain = headersList.get("x-domain") || '';
  
  const prisma = await getPrisma(domain || 'tazagroup.vn');
  
  // Check if a custom homepage is set
  const websiteSettings = await prisma.websiteSettings.findUnique({
    where: { domain: domain || 'tazagroup.vn' },
    select: {
      homePageType: true,
      homePageId: true,
    },
  });

  // If homepage is set to a page or post, render that instead
  if (websiteSettings?.homePageType && websiteSettings?.homePageId) {
    if (websiteSettings.homePageType === "page") {
      const page = await prisma.page.findUnique({
        where: { id: websiteSettings.homePageId },
        select: {
          id: true,
          title: true,
          slug: true,
          content: true,
          published: true,
          blocks: true,
          blocksV2: true, // ✅ Include V2 blocks
          metaTitle: true,
          metaDescription: true,
          createdAt: true,
          updatedAt: true,
          author: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      if (page && page.published) {
        return <CustomHomePage content={page} type="page" />;
      }
    } else if (websiteSettings.homePageType === "post") {
      const post = await prisma.post.findUnique({
        where: { id: websiteSettings.homePageId },
        select: {
          id: true,
          title: true,
          slug: true,
          content: true,
          excerpt: true,
          published: true,
          blocks: true,
          metaTitle: true,
          metaDescription: true,
          createdAt: true,
          updatedAt: true,
          author: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      if (post && post.published) {
        return <CustomHomePage content={post} type="post" />;
      }
    }
  }

  // Default homepage rendering
  const [featuredPosts, stats, customBlocks] = await Promise.all([
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
    ]),
    // Fetch custom homepage blocks if any
    prisma.page.findFirst({
      where: { 
        slug: 'homepage-blocks',
        published: true 
      },
      select: {
        blocks: true,
      }
    })
  ]);
  
  const [postsCount, pagesCount, usersCount] = stats;

  // Hero carousel slides
  const heroSlides = [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1600&h=600&fit=crop',
      title: 'Làm đẹp tự nhiên, An toàn tuyệt đối',
      description: 'Công nghệ hiện đại kết hợp bí quyết truyền thống',
      alt: 'Taza Group Beauty Spa'
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1600&h=600&fit=crop',
      title: 'Đội ngũ chuyên gia hàng đầu',
      description: 'Nhiều năm kinh nghiệm trong ngành thẩm mỹ',
      alt: 'Expert Team'
    },
    {
      id: '3',
      image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1600&h=600&fit=crop',
      title: 'Cam kết hiệu quả rõ rệt',
      description: 'Hàng ngàn khách hàng tin tưởng và hài lòng',
      alt: 'Customer Satisfaction'
    }
  ];

  // Testimonials data
  const testimonials = [
    {
      id: '1',
      name: 'Nguyễn Thị Lan',
      role: 'Khách hàng thân thiết',
      content: 'Dịch vụ tuyệt vời, đội ngũ chuyên nghiệp. Tôi rất hài lòng với kết quả sau 3 tháng điều trị.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
    },
    {
      id: '2',
      name: 'Trần Minh Anh',
      role: 'CEO Startup',
      content: 'Không gian sang trọng, nhân viên nhiệt tình. Đã giới thiệu cho nhiều bạn bè và đồng nghiệp.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop'
    },
    {
      id: '3',
      name: 'Lê Hoàng Nam',
      role: 'Diễn viên',
      content: 'Chất lượng dịch vụ 5 sao, giá cả hợp lý. Taza Group là lựa chọn số 1 của tôi.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
    },
    {
      id: '4',
      name: 'Phạm Thu Hà',
      role: 'Giảng viên',
      content: 'Công nghệ hiện đại, hiệu quả vượt mong đợi. Cảm ơn đội ngũ Taza Group đã giúp tôi tự tin hơn.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop'
    }
  ];

  // Partner brands
  const partners = [
    { id: '1', name: 'Partner 1', logo: 'https://placehold.co/150x80?text=Partner+1' },
    { id: '2', name: 'Partner 2', logo: 'https://placehold.co/150x80?text=Partner+2' },
    { id: '3', name: 'Partner 3', logo: 'https://placehold.co/150x80?text=Partner+3' },
    { id: '4', name: 'Partner 4', logo: 'https://placehold.co/150x80?text=Partner+4' },
    { id: '5', name: 'Partner 5', logo: 'https://placehold.co/150x80?text=Partner+5' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Carousel Section */}
      <section className="relative w-full">
        <CarouselComponent
          slides={heroSlides}
          autoPlay={true}
          interval={5000}
          showDots={true}
          showArrows={true}
          height={600}
          className="w-full"
        />
      </section>

      {/* Custom Page Builder Blocks */}
      {customBlocks?.blocks && (
        <section className="py-8 sm:py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {(customBlocks.blocks as unknown as Block[]).map((block) => (
              <FrontendBlockRenderer key={block.id} block={block} />
            ))}
          </div>
        </section>
      )}

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
              {featuredPosts.map((post: { id: string; title: string; slug: string; excerpt: string | null; createdAt: Date; author: { name: string | null; email: string } | null }) => (
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
                        {post.author?.name || post.author?.email || 'Anonymous'}
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

      {/* Testimonials Carousel Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-linear-to-b from-background to-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <Badge variant="secondary" className="mb-4">
              <Star className="h-3 w-3 mr-1 fill-primary text-primary" />
              Khách hàng nói gì về chúng tôi
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3">
              Đánh giá từ khách hàng
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hàng ngàn khách hàng tin tưởng và hài lòng với dịch vụ của Taza Group
            </p>
          </div>

          <div className="w-full mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id} className="relative hover:shadow-lg transition-all duration-200">
                  <CardContent className="p-6 space-y-4">
                    <Quote className="h-8 w-8 text-primary/20" />
                    <p className="text-sm sm:text-base text-muted-foreground italic">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center gap-1 text-yellow-500">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <div className="flex items-center gap-3 pt-4 border-t">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold text-sm">{testimonial.name}</p>
                        <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Partners/Brands Section */}
      <section className="py-8 sm:py-12 border-y bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h3 className="text-xl sm:text-2xl font-bold mb-2">
              Đối tác & Chứng nhận
            </h3>
            <p className="text-sm text-muted-foreground">
              Được tin tưởng bởi các thương hiệu hàng đầu
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 items-center justify-items-center">
            {partners.map((partner) => (
              <div key={partner.id} className="grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100">
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="h-12 sm:h-16 w-auto object-contain"
                />
              </div>
            ))}
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
