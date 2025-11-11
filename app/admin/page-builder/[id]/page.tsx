import { prisma } from '@/lib/prisma';
import { PageBuilderEditor } from '@/components/page-builder/PageBuilderEditor';
import { notFound } from 'next/navigation';

interface PageParams {
  params: Promise<{ id: string }>;
}

/**
 * Page Builder Editor Page
 * Load page từ database và cho phép edit
 */
export default async function EditPageBuilderPage({ params }: PageParams) {
  const { id } = await params;

  // Fetch page từ database
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
      }}
    />
  );
}
