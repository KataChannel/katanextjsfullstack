"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Combobox } from "@/components/ui/combobox";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Blocks, Eye, EyeOff, Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BlockTemplate {
  id: string;
  name: string;
  description: string | null;
  thumbnail: string | null;
  elements: any[];
  category: string;
  published: boolean;
  createdAt: Date;
  author: {
    name: string | null;
    email: string;
  };
}

const CATEGORIES = [
  { value: "general", label: "Chung" },
  { value: "hero", label: "Hero Section" },
  { value: "content", label: "Nội dung" },
  { value: "cta", label: "Call to Action" },
  { value: "testimonial", label: "Đánh giá" },
  { value: "pricing", label: "Bảng giá" },
  { value: "footer", label: "Footer" },
];

export default function BlockTemplatesPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [templates, setTemplates] = useState<BlockTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<BlockTemplate | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    thumbnail: "",
    category: "general",
    published: true,
    elements: [] as any[],
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    } else if (session?.user?.role !== "admin") {
      router.push("/admin");
    } else {
      fetchTemplates();
    }
  }, [session, status, router]);

  const fetchTemplates = async () => {
    try {
      const res = await fetch("/api/admin/block-templates");
      if (res.ok) {
        const data = await res.json();
        setTemplates(data);
      }
    } catch (error) {
      toast.error("Lỗi tải danh sách templates");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (template?: BlockTemplate) => {
    if (template) {
      setSelectedTemplate(template);
      setFormData({
        name: template.name,
        description: template.description || "",
        thumbnail: template.thumbnail || "",
        category: template.category,
        published: template.published,
        elements: template.elements,
      });
    } else {
      setSelectedTemplate(null);
      setFormData({
        name: "",
        description: "",
        thumbnail: "",
        category: "general",
        published: true,
        elements: [],
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedTemplate(null);
  };

  const handleSaveTemplate = async () => {
    if (!formData.name) {
      toast.error("Tên template là bắt buộc");
      return;
    }

    try {
      const method = selectedTemplate ? "PUT" : "POST";
      const payload = selectedTemplate ? { id: selectedTemplate.id, ...formData } : formData;

      const res = await fetch("/api/admin/block-templates", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(selectedTemplate ? "Đã cập nhật template" : "Đã tạo template mới");
        handleCloseDialog();
        fetchTemplates();
      } else {
        toast.error("Lỗi lưu template");
      }
    } catch (error) {
      toast.error("Lỗi lưu template");
    }
  };

  const handleDeleteTemplate = async () => {
    if (!selectedTemplate) return;

    try {
      const res = await fetch(`/api/admin/block-templates?id=${selectedTemplate.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Đã xóa template");
        setIsDeleteDialogOpen(false);
        setSelectedTemplate(null);
        fetchTemplates();
      } else {
        toast.error("Lỗi xóa template");
      }
    } catch (error) {
      toast.error("Lỗi xóa template");
    }
  };

  const handleTogglePublish = async (template: BlockTemplate) => {
    try {
      const res = await fetch("/api/admin/block-templates", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: template.id,
          name: template.name,
          description: template.description,
          thumbnail: template.thumbnail,
          category: template.category,
          published: !template.published,
          elements: template.elements,
        }),
      });

      if (res.ok) {
        toast.success(template.published ? "Đã ẩn template" : "Đã hiện template");
        fetchTemplates();
      }
    } catch (error) {
      toast.error("Lỗi cập nhật trạng thái");
    }
  };

  const handleDuplicateTemplate = async (template: BlockTemplate) => {
    try {
      const res = await fetch("/api/admin/block-templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${template.name} (Copy)`,
          description: template.description,
          thumbnail: template.thumbnail,
          category: template.category,
          published: false,
          elements: template.elements,
        }),
      });

      if (res.ok) {
        toast.success("Đã tạo bản sao template");
        fetchTemplates();
      }
    } catch (error) {
      toast.error("Lỗi tạo bản sao");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <Card>
        <CardHeader className="border-b sticky top-0 bg-background z-10">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Blocks className="h-6 w-6" />
                Quản lý Block Templates
              </CardTitle>
              <CardDescription className="mt-1">
                Tạo và quản lý block templates có thể tái sử dụng
              </CardDescription>
            </div>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Thêm template
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {/* Preview Thumbnail */}
                <div className="relative h-48 bg-linear-to-br from-blue-50 to-indigo-100 border-b">
                  {template.thumbnail ? (
                    <img
                      src={template.thumbnail}
                      alt={template.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Blocks className="h-16 w-16 text-muted-foreground opacity-30" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Badge variant={template.published ? "default" : "secondary"}>
                      {template.published ? "Hiện" : "Ẩn"}
                    </Badge>
                    <Badge variant="outline">
                      {CATEGORIES.find(c => c.value === template.category)?.label || template.category}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <CardHeader>
                  <CardTitle className="text-lg line-clamp-1">{template.name}</CardTitle>
                  {template.description && (
                    <CardDescription className="line-clamp-2">
                      {template.description}
                    </CardDescription>
                  )}
                </CardHeader>

                <CardContent>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <span>{template.author.name || template.author.email}</span>
                    <span>{template.elements.length} elements</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleTogglePublish(template)}
                      title={template.published ? "Ẩn template" : "Hiện template"}
                    >
                      {template.published ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDuplicateTemplate(template)}
                      title="Tạo bản sao"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenDialog(template)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedTemplate(template);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {templates.length === 0 && (
            <div className="text-center py-12">
              <Blocks className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">Chưa có template nào</p>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Tạo template đầu tiên
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog Thêm/Sửa Template */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader className="border-b pb-4">
            <DialogTitle>
              {selectedTemplate ? "Sửa template" : "Thêm template mới"}
            </DialogTitle>
            <DialogDescription>
              {selectedTemplate ? "Cập nhật thông tin template" : "Tạo block template mới"}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên template *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="VD: Hero Banner Hiện Đại"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Mô tả ngắn gọn về template"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumbnail">URL Thumbnail</Label>
              <Input
                id="thumbnail"
                value={formData.thumbnail}
                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Danh mục</Label>
              <Combobox
                options={CATEGORIES}
                value={formData.category}
                onValueChange={(value: string) => setFormData({ ...formData, category: value })}
                placeholder="Chọn danh mục"
                searchPlaceholder="Tìm danh mục..."
                emptyText="Không tìm thấy"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="published"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="published" className="cursor-pointer">
                Hiển thị template (public)
              </Label>
            </div>

            <div className="space-y-2">
              <Label>Số lượng elements</Label>
              <p className="text-sm text-muted-foreground">
                {formData.elements.length} elements
              </p>
              {selectedTemplate && formData.elements.length > 0 && (
                <div className="mt-2 p-4 bg-blue-50 border border-blue-200 rounded-md space-y-2">
                  <p className="text-sm font-semibold text-blue-900">
                    💡 Cách chỉnh sửa template:
                  </p>
                  <ol className="text-xs text-blue-800 space-y-1 ml-4 list-decimal">
                    <li>Vào <strong>Page Builder</strong> (tạo page mới hoặc dùng page test)</li>
                    <li>Click tab <strong>"Templates"</strong> trong sidebar trái</li>
                    <li>Click vào template <strong>"{selectedTemplate.name}"</strong> để add vào canvas</li>
                    <li>Chỉnh sửa elements (position, style, content, thêm/xóa elements)</li>
                    <li>Click button <strong>"Template"</strong> trên toolbar</li>
                    <li>Chọn tất cả elements hoặc chỉ chọn elements cần update</li>
                    <li>Nhập tên: <strong>"{selectedTemplate.name} v2"</strong> (tạo phiên bản mới)</li>
                    <li>Hoặc dùng tên cũ để ghi đè (không khuyến khích)</li>
                  </ol>
                  <p className="text-xs text-blue-700 mt-2 italic">
                    ⚠️ Lưu ý: Không thể edit trực tiếp elements trong admin page này. 
                    Chỉ có thể edit metadata (tên, mô tả, danh mục).
                  </p>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="border-t pt-4">
            <Button variant="outline" onClick={handleCloseDialog}>
              Hủy
            </Button>
            <Button onClick={handleSaveTemplate}>
              {selectedTemplate ? "Cập nhật metadata" : "Tạo template"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Xóa Template */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc muốn xóa template "{selectedTemplate?.name}"? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeleteTemplate}>
              Xóa template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
