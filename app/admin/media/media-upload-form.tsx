"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Loader2, X, FileImage } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

export function MediaUploadForm() {
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFiles(Array.from(files));
    }
  }

  function removeFile(index: number) {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  }

  function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    if (selectedFiles.length === 0) {
      toast.error("Vui lòng chọn ít nhất một file");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      let successCount = 0;
      let failCount = 0;
      const totalFiles = selectedFiles.length;

      // Upload từng file một
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        
        console.log(`📤 Uploading file ${i + 1}/${totalFiles}:`, file.name, `(${(file.size / 1024).toFixed(2)}KB)`);
        
        // Validate file trước khi upload
        if (!file || file.size === 0) {
          failCount++;
          console.error(`❌ Invalid file: ${file?.name || 'Unknown'}`);
          toast.error(`${file?.name || 'Unknown'}: File không hợp lệ`, { duration: 5000 });
          setUploadProgress(Math.round(((i + 1) / totalFiles) * 100));
          continue;
        }

        try {
          // Tạo FormData mới cho mỗi request
          const formData = new FormData();
          
          // Gửi file trực tiếp, không recreate để tránh corruption
          formData.append("file", file);
          
          console.log('FormData created:', {
            fileName: file.name,
            size: file.size,
            type: file.type,
          });

          // Use XMLHttpRequest for better large file handling
          const uploadPromise = new Promise<Response>((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            
            xhr.open('POST', '/api/media', true);
            
            xhr.onload = () => {
              if (xhr.status >= 200 && xhr.status < 300) {
                resolve(new Response(xhr.responseText, {
                  status: xhr.status,
                  statusText: xhr.statusText,
                  headers: new Headers({
                    'content-type': xhr.getResponseHeader('content-type') || 'application/json',
                  }),
                }));
              } else {
                resolve(new Response(xhr.responseText, {
                  status: xhr.status,
                  statusText: xhr.statusText,
                  headers: new Headers({
                    'content-type': xhr.getResponseHeader('content-type') || 'application/json',
                  }),
                }));
              }
            };
            
            xhr.onerror = () => reject(new Error('Network error'));
            xhr.ontimeout = () => reject(new Error('Upload timeout'));
            
            xhr.timeout = 120000; // 120 seconds timeout
            
            xhr.send(formData);
          });
          
          const response = await uploadPromise;

          console.log(`📨 Response for ${file.name}:`, response.status, response.statusText);

          if (!response.ok) {
            failCount++;
            let errorMsg = 'Unknown error';
            try {
              const contentType = response.headers.get('content-type');
              if (contentType && contentType.includes('application/json')) {
                const errorData = await response.json();
                errorMsg = errorData.details || errorData.error || errorMsg;
              } else {
                errorMsg = await response.text();
              }
            } catch (parseError) {
              console.error('Error parsing error response:', parseError);
            }
            console.error(`❌ Failed to upload ${file.name} (${response.status}):`, errorMsg);
            toast.error(`${file.name}: ${errorMsg}`, { duration: 5000 });
            setUploadProgress(Math.round(((i + 1) / totalFiles) * 100));
            continue;
          }

          const data = await response.json();

          if (data.success) {
            successCount++;
            console.log(`✅ Successfully uploaded: ${file.name}`);
          } else {
            failCount++;
            const errorMsg = data.details || data.error || 'Unknown error';
            console.error(`❌ Failed to upload ${file.name}:`, errorMsg);
            toast.error(`${file.name}: ${errorMsg}`, { duration: 5000 });
          }
        } catch (error) {
          failCount++;
          console.error(`❌ Error uploading ${file.name}:`, error);
          toast.error(`${file.name}: ${error instanceof Error ? error.message : String(error)}`, { duration: 5000 });
        }

        // Update progress
        setUploadProgress(Math.round(((i + 1) / totalFiles) * 100));
        
        // Delay nhỏ giữa các upload để tránh race condition
        if (i < selectedFiles.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      // Show result toast
      if (successCount === totalFiles) {
        toast.success(`Upload thành công ${successCount} file!`);
      } else if (successCount > 0) {
        toast.warning(`Upload thành công ${successCount}/${totalFiles} file. ${failCount} file thất bại.`);
      } else {
        toast.error(`Upload thất bại tất cả ${totalFiles} file`);
      }
      
      // Reset form
      if (formRef.current) {
        formRef.current.reset();
      }
      setSelectedFiles([]);
      setUploadProgress(0);
      
      // Refresh trang để hiển thị ảnh mới
      router.refresh();
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Có lỗi xảy ra khi upload");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        {/* File Input */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="file"
              name="files"
              accept="image/*,video/*"
              multiple
              disabled={uploading}
              onChange={handleFileChange}
              className="cursor-pointer"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Hỗ trợ nhiều file. Định dạng: JPG, PNG, GIF, WebP, SVG, MP4. Tối đa 20MB/file.
            </p>
          </div>
          <Button 
            type="submit" 
            disabled={uploading || selectedFiles.length === 0}
            className="shrink-0"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang tải ({uploadProgress}%)
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload {selectedFiles.length > 0 && `(${selectedFiles.length})`}
              </>
            )}
          </Button>
        </div>

        {/* Upload Progress */}
        {uploading && (
          <div className="space-y-2">
            <Progress value={uploadProgress} className="h-2" />
            <p className="text-xs text-center text-muted-foreground">
              Đang upload {uploadProgress}%
            </p>
          </div>
        )}

        {/* Selected Files Preview */}
        {selectedFiles.length > 0 && !uploading && (
          <div className="space-y-2">
            <p className="text-sm font-medium">
              Đã chọn {selectedFiles.length} file:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {selectedFiles.map((file, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 p-2 rounded-lg border bg-muted/50 hover:bg-muted transition-colors"
                >
                  <FileImage className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" title={file.name}>
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0"
                    onClick={() => removeFile(index)}
                    title="Xóa file"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
