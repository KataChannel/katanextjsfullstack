/**
 * Admin: Pages V2 - List and manage pages
 */

import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, FileText, Edit, Trash2, Eye } from 'lucide-react';
import { getPrisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Pages V2 | Admin',
  description: 'Manage pages with Block Editor',
};

async function getPages() {
  const prisma = await getPrisma();
  return await prisma.page.findMany({
    where: {
      version: 2,
    },
    orderBy: {
      updatedAt: 'desc',
    },
    include: {
      author: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });
}

export default async function PagesV2Page() {
  const pages = await getPages();

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pages V2</h1>
          <p className="text-gray-500 mt-1">Block-based page builder</p>
        </div>
        <Link href="/admin/pages-v2/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Page
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Pages</CardDescription>
            <CardTitle className="text-3xl">{pages.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Published</CardDescription>
            <CardTitle className="text-3xl">
              {pages.filter(p => p.published).length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Drafts</CardDescription>
            <CardTitle className="text-3xl">
              {pages.filter(p => !p.published).length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Pages list */}
      {pages.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No pages yet
            </h3>
            <p className="text-gray-500 mb-4">
              Create your first page with the new Block Editor
            </p>
            <Link href="/admin/pages-v2/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Page
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {pages.map(page => (
            <Card key={page.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {page.title}
                      </h3>
                      {page.published ? (
                        <Badge variant="default">Published</Badge>
                      ) : (
                        <Badge variant="secondary">Draft</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mb-2">/{page.slug}</p>
                    <p className="text-xs text-gray-400">
                      by {page.author.name || page.author.email} •{' '}
                      {new Date(page.updatedAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {page.published && (
                      <Link href={`/${page.slug}`} target="_blank">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                    )}
                    <Link href={`/admin/pages-v2/edit/${page.id}`}>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm" className="text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Info box */}
      <Card className="mt-8 border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-900">Block Editor V2</CardTitle>
          <CardDescription className="text-blue-700">
            New features in this version:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>✅ Drag & Drop blocks</li>
            <li>✅ Tailwind CSS styling</li>
            <li>✅ WYSIWYG editing</li>
            <li>✅ Responsive design</li>
            <li>✅ Undo/Redo history</li>
            <li>✅ Block templates</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
