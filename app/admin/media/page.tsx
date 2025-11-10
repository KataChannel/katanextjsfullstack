import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getPrisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Upload, Trash2, Search, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

export default async function MediaLibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const searchQuery = params.q || "";
  
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
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Thư viện Media</h1>
          <p className="text-muted-foreground mt-2">
            Quản lý hình ảnh và file multimedia
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Link>
          </Button>
        </div>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Media</CardTitle>
          <CardDescription>
            Tải lên hình ảnh hoặc video (tối đa 10MB)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action="/api/media" method="POST" encType="multipart/form-data" className="space-y-4">
            <div className="flex gap-4">
              <Input
                type="file"
                name="file"
                accept="image/*,video/*"
                required
                className="flex-1"
              />
              <Button type="submit">
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </Button>
            </div>
          </form>
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

function MediaCard({
  media,
}: {
  media: {
    id: string;
    filename: string;
    url: string;
    alt: string | null;
    caption: string | null;
    mimeType: string;
    size: number;
    createdAt: Date;
  };
}) {
  const isImage = media.mimeType.startsWith("image/");
  const isVideo = media.mimeType.startsWith("video/");

  return (
    <Card className="group relative overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        {/* Media Preview */}
        <div className="aspect-square relative bg-muted">
          {isImage ? (
            <Image
              src={media.url}
              alt={media.alt || media.filename}
              fill
              className="object-cover"
            />
          ) : isVideo ? (
            <video src={media.url} className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full">
              <ImageIcon className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          
          {/* Overlay Actions */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => navigator.clipboard.writeText(media.url)}
            >
              Copy URL
            </Button>
            <form action={`/api/media/${media.id}`} method="POST">
              <input type="hidden" name="_method" value="DELETE" />
              <Button
                size="sm"
                variant="destructive"
                type="submit"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        {/* Media Info */}
        <div className="p-3 space-y-1">
          <p className="text-sm font-medium truncate" title={media.filename}>
            {media.filename}
          </p>
          <p className="text-xs text-muted-foreground">
            {(media.size / 1024).toFixed(1)} KB
          </p>
          {media.alt && (
            <p className="text-xs text-muted-foreground truncate" title={media.alt}>
              Alt: {media.alt}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
