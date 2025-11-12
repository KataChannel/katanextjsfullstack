import { getPrisma } from '@/lib/prisma';
import { PageBuilderEditor } from '@/components/page-builder/PageBuilderEditor';
import { notFound } from 'next/navigation';

interface PageParams {
  params: Promise<{ id: string }>;
}

// Force dynamic rendering to avoid caching issues
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * Page Builder Editor Page
 * Load page từ database và cho phép edit
 * Hỗ trợ multi-domain với getPrisma()
 */
export default async function EditPageBuilderPage({ params }: PageParams) {
  const { id } = await params;

  // Fetch page từ database (multi-domain aware)
  const prisma = await getPrisma();
  const page = await prisma.page.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      slug: true,
      blocks: true,
      published: true,
    },
  });

  if (!page) {
    notFound();
  }

  return (
    <PageBuilderEditor
      pageId={page.id}
      initialData={{
        title: page.title,
        slug: page.slug,
        blocks: page.blocks as any,
        published: page.published,
      }}
    />
  );
}
