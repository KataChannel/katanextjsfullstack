import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getPrisma } from "@/lib/prisma";
import { Upload, Trash2, Search, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { MediaCard } from "./media-card";
import { MediaUploadForm } from "./media-upload-form";


export default async function MediaLibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const searchQuery = q || "";
  
  const prisma = await getPrisma();
  
  const media = await prisma.media.findMany({
    where: searchQuery
      ? {
          OR: [
            { filename: { contains: searchQuery, mode: "insensitive" } },
            { alt: { contains: searchQuery, mode: "insensitive" } },
            { caption: { contains: searchQuery, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Thư viện Media</h1>
        <p className="text-muted-foreground mt-2">
          Quản lý hình ảnh và file multimedia
        </p>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Media</CardTitle>
          <CardDescription>
            Tải lên hình ảnh hoặc video (tối đa 10MB, tự động tối ưu sang WebP)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MediaUploadForm />
        </CardContent>
      </Card>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle>Tìm kiếm Media</CardTitle>
        </CardHeader>
        <CardContent>
          <form method="GET" className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                name="q"
                placeholder="Tìm kiếm theo tên file, alt text, caption..."
                defaultValue={searchQuery}
                className="pl-10"
              />
            </div>
            <Button type="submit">Tìm kiếm</Button>
            {searchQuery && (
              <Button variant="outline" asChild>
                <Link href="/admin/media">Xóa lọc</Link>
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Media Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách Media ({media.length})</CardTitle>
          <CardDescription>
            {searchQuery ? `Kết quả tìm kiếm cho "${searchQuery}"` : "Tất cả file media"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {media.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">Chưa có media nào</h3>
              <p className="text-muted-foreground mt-2">
                {searchQuery
                  ? "Không tìm thấy kết quả phù hợp"
                  : "Tải lên file đầu tiên để bắt đầu"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {media.map((item) => (
                <MediaCard key={item.id} media={item} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


