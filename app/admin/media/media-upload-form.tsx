"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function MediaUploadForm() {
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string>("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const file = formData.get("file") as File;
    
    if (!file || file.size === 0) {
      toast.error("Vui lòng chọn file");
      return;
    }

    setUploading(true);

    try {
      const response = await fetch("/api/media", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message || "Upload thành công!");
        
        // Reset form
        e.currentTarget.reset();
        setSelectedFile("");
        
        // Refresh trang để hiển thị ảnh mới
        router.refresh();
      } else {
        toast.error(data.error || "Upload thất bại");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Có lỗi xảy ra khi upload");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="file"
            name="file"
            accept="image/*,video/*"
            required
            disabled={uploading}
            onChange={(e) => setSelectedFile(e.target.value)}
            className="cursor-pointer"
          />
          {selectedFile && (
            <p className="text-xs text-muted-foreground mt-1">
              File đã chọn: {selectedFile.split("\\").pop()}
            </p>
          )}
        </div>
        <Button type="submit" disabled={uploading || !selectedFile}>
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang tải...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
