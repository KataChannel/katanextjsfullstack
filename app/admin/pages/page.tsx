import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getPrisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";

export default async function PagesManagementPage() {
  const prisma = await getPrisma();
  
  const pages = await prisma.page.findMany({
    include: {
      author: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý Trang</h1>
          <p className="text-muted-foreground mt-2">
            Tạo và quản lý các trang landing, giới thiệu, liên hệ...
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/admin/page-builder">
              <Plus className="mr-2 h-4 w-4" />
              Tạo trang mới
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Link>
          </Button>
        </div>
      </div>

      {/* Pages List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách Trang ({pages.length})</CardTitle>
          <CardDescription>
            Tất cả các trang đã tạo với Page Builder
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Chưa có trang nào được tạo</p>
              <Button className="mt-4" asChild>
                <Link href="/admin/page-builder">
                  <Plus className="mr-2 h-4 w-4" />
                  Tạo trang đầu tiên
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {pages.map((page) => (
                <PageItem key={page.id} page={page} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function PageItem({
  page,
}: {
  page: {
    id: string;
    title: string;
    slug: string;
    content: string | null;
    published: boolean;
    metaTitle: string | null;
    metaDescription: string | null;
    createdAt: Date;
    updatedAt: Date;
    author: {
      name: string | null;
      email: string;
    };
  };
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            {/* Title & Status */}
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold">{page.title}</h3>
              {page.published ? (
                <Badge variant="default" className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  Đã xuất bản
                </Badge>
              ) : (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <EyeOff className="h-3 w-3" />
                  Nháp
                </Badge>
              )}
            </div>

            {/* Slug */}
            <p className="text-sm text-muted-foreground">
              <span className="font-mono bg-muted px-2 py-1 rounded">/{page.slug}</span>
            </p>

            {/* Meta Description */}
            {page.metaDescription && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {page.metaDescription}
              </p>
            )}

            {/* Author & Date */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>Tạo bởi: {page.author.name || page.author.email}</span>
              <span>•</span>
              <span>
                Cập nhật: {new Date(page.updatedAt).toLocaleDateString("vi-VN")}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 ml-4">
            {page.published && (
              <Button size="sm" variant="outline" asChild>
                <Link href={`/${page.slug}`} target="_blank">
                  <Eye className="h-4 w-4" />
                </Link>
              </Button>
            )}
            <Button size="sm" variant="outline" asChild>
              <Link href={`/admin/page-builder?id=${page.id}`}>
                <Edit className="h-4 w-4" />
              </Link>
            </Button>
            <form action={`/api/pages/${page.id}`} method="POST">
              <input type="hidden" name="_method" value="DELETE" />
              <Button
                size="sm"
                variant="destructive"
                type="submit"
                onClick={(e) => {
                  if (!confirm("Bạn có chắc muốn xóa trang này?")) {
                    e.preventDefault();
                  }
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
