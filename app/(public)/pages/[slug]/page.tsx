import { getPrisma } from "@/lib/prisma";
import { generateSEOMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const prisma = await getPrisma();
  
  const page = await prisma.page.findUnique({
    where: { slug },
  });

  if (!page) {
    return {};
  }

  return generateSEOMetadata({
    title: page.metaTitle || page.title,
    description: page.metaDescription || page.title,
    keywords: page.metaKeywords || undefined,
    ogImage: page.ogImage || undefined,
    canonicalUrl: page.canonicalUrl || undefined,
  });
}

export async function generateStaticParams() {
  const prisma = await getPrisma('tazagroup.vn');
  
  const pages = await prisma.page.findMany({
    where: { published: true },
    select: { slug: true },
  });

  return pages.map((page) => ({
    slug: page.slug,
  }));
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;
  const prisma = await getPrisma();
  
  const page = await prisma.page.findUnique({
    where: { slug },
    include: {
      author: {
        select: {
          name: true,
          email: true,
        }
      }
    }
  });

  if (!page || !page.published) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-linear-to-b from-primary/5 to-background py-12 sm:py-16 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              {page.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Cập nhật: {new Date(page.updatedAt).toLocaleDateString('vi-VN')}</span>
              {page.author?.name && <span>Tác giả: {page.author.name}</span>}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto prose prose-sm sm:prose dark:prose-invert">
            {page.content && (
              <div 
                dangerouslySetInnerHTML={{ __html: page.content }}
                className="space-y-4"
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
