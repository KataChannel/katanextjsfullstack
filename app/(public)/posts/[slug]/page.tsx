import { redirect } from 'next/navigation';

interface PostProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Redirect /posts/[slug] to /[slug]
 * We now handle both pages and posts at the root level
 */
export default async function PostRedirect({ params }: PostProps) {
  const { slug } = await params;
  redirect(`/${slug}`);
}
