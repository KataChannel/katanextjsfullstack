import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPrisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { extractDomain } from "@/lib/database";
import { redirect } from "next/navigation";
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

  // Bypass database for static domain
  if (domain === 'innerbright.vn' || domain.includes('localhost:3005')) {
    console.log('[Homepage] Static domain detected, bypassing database');
    redirect('/innerbright');
  }

  let prisma;
  let websiteSettings = null;
  try {
    prisma = await getPrisma(domain || 'innerbright.vn');

    // Check if a custom homepage is set
    websiteSettings = await prisma.websiteSettings.findUnique({
      where: { domain: domain || 'innerbright.vn' },
      select: {
        homePageType: true,
        homePageId: true,
        homeRedirect: true,
      },
    });
  } catch (error) {
    console.warn('[Homepage] Database access failed:', error);
  }

  // Check if homepage redirect is set
  if (websiteSettings?.homeRedirect && websiteSettings.homeRedirect.trim() !== '') {
    console.log('[Homepage] Redirecting to:', websiteSettings.homeRedirect);
    redirect(websiteSettings.homeRedirect);
  }

  // If DB connection failed and we're NOT on the static domain, 
  // we might need a better error handling or fallback.
  if (!prisma) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-2xl mx-4">
          <CardHeader>
            <CardTitle>System Maintenance</CardTitle>
            <CardDescription>The database is currently unavailable. Please try again later.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

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
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-2xl mx-4">
        <CardContent className="p-12 text-center space-y-6">
          <div className="flex justify-center mb-4">
            <Sparkles className="h-16 w-16 text-primary animate-pulse" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            Trang Chủ Đang Cập Nhật
          </h1>
          <p className="text-muted-foreground text-lg">
            Chúng tôi đang hoàn thiện trang web để mang đến trải nghiệm tốt nhất cho bạn.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Button size="lg" asChild>
              <Link href="/admin">
                Đi tới Admin
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/posts">Xem bài viết</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
