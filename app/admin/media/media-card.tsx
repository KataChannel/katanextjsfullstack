"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useState } from "react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export function MediaCard({
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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const isImage = media.mimeType.startsWith("image/");
  const isVideo = media.mimeType.startsWith("video/");

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(media.url);
      toast.success("Đã copy URL vào clipboard!");
    } catch (error) {
      toast.error("Lỗi khi copy URL");
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/media/${media.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      toast.success("Đã xóa media thành công!");
      setShowDeleteDialog(false);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting media:", error);
      toast.error("Lỗi khi xóa media");
    }
  };

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
              onClick={handleCopyUrl}
            >
              Copy URL
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
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

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Xác nhận xóa"
        description="Bạn chắc chắn muốn xóa file này? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        cancelText="Hủy"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </Card>
  );
}
