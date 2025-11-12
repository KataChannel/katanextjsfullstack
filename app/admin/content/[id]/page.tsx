"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { TiptapEditor } from "@/components/tiptap-editor";
import Link from "next/link";

interface PageParams {
  params: Promise<{
    id: string;
  }>;
}

interface ContentData {
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  published?: boolean;
  type?: "page" | "post";
}

export default function ContentEditPage({ params }: PageParams) {
  const router = useRouter();
  const [id, setId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [formData, setFormData] = useState<ContentData>({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
  });

  useEffect(() => {
    params.then(({ id: resolvedId }) => {
      setId(resolvedId);
      if (resolvedId !== "new") {
        fetchContent(resolvedId);
      } else {
        setLoading(false);
      }
    });
  }, [params]);

  const fetchContent = async (contentId: string) => {
    try {
      setLoading(true);
      
      // Try to fetch as page first
      let res = await fetch(`/api/pages/${contentId}`);
      let type: "page" | "post" = "page";
      
      if (!res.ok) {
        // Try as post
        res = await fetch(`/api/posts/${contentId}`);
        type = "post";
      }

      if (!res.ok) {
        throw new Error("Content not found");
      }

      const data = await res.json();
      const content = data.data || data;

      setFormData({
        title: content.title || "",
        slug: content.slug || "",
        content: content.content || "",
        excerpt: content.excerpt || "",
        metaTitle: content.metaTitle || "",
        metaDescription: content.metaDescription || "",
        metaKeywords: content.metaKeywords || "",
        published: content.published,
        type,
      });
    } catch (error) {
      console.error("Error fetching content:", error);
      toast.error("Không thể tải nội dung");
      router.push("/admin/content");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.slug.trim()) {
      toast.error("Vui lòng điền tiêu đề và slug");
      return;
    }

    setSaving(true);

    try {
      if (id === "new") {
        // Create new - determine type from URL params or default to page
        const searchParams = new URLSearchParams(window.location.search);
        const type = searchParams.get("type") || "page";
        
        // Get authorId
        const contentsRes = await fetch("/api/pages?limit=1");
        const contentsData = await contentsRes.json();
        const firstContent = contentsData.data?.[0] || contentsData[0];
        
        if (!firstContent) {
          toast.error("Cần có ít nhất 1 content để lấy authorId. Vui lòng chạy seed.");
          return;
        }

        const detailRes = await fetch(`/api/pages/${firstContent.id}`);
        const detailData = await detailRes.json();
        const authorId = detailData.data?.authorId || detailData.authorId;

        const endpoint = type === "page" ? "/api/pages" : "/api/posts";
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            authorId,
          }),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ error: "Unknown error" }));
          throw new Error(errorData.error || "Failed to create");
        }

        const result = await res.json();
        toast.success(`✅ Đã tạo ${type === "page" ? "trang" : "bài viết"} thành công!`);
        router.push("/admin/content");
      } else {
        // Update existing
        const type = formData.type || "page";
        const endpoint = type === "page" ? `/api/pages/${id}` : `/api/posts/${id}`;
        
        const res = await fetch(endpoint, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ error: "Unknown error" }));
          throw new Error(errorData.error || "Failed to update");
        }

        toast.success("✅ Đã cập nhật thành công!");
        router.push("/admin/content");
      }
    } catch (error: any) {
      console.error("Error saving:", error);
      toast.error(error.message || "Lỗi khi lưu");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Đang tải...</p>
      </div>
    );
  }

  const isNewContent = id === "new";
  const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const contentType = searchParams?.get("type") || formData.type || "page";

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/admin/content">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-2xl sm:text-3xl font-bold">
              {isNewContent 
                ? `Tạo ${contentType === "page" ? "trang" : "bài viết"} mới`
                : `Chỉnh sửa ${formData.type === "page" ? "trang" : "bài viết"}`
              }
            </h1>
          </div>
          <p className="text-sm text-muted-foreground ml-14">
            {isNewContent 
              ? "Điền thông tin để tạo nội dung mới"
              : "Cập nhật thông tin nội dung"
            }
          </p>
        </div>

        <Button onClick={handleSave} disabled={saving}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Đang lưu..." : "Lưu"}
        </Button>
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin nội dung</CardTitle>
          <CardDescription>
            Điền đầy đủ thông tin và nội dung
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="general">Thông tin chung</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6 mt-6">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Tiêu đề <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Tiêu đề nội dung"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">
                  URL Slug <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  placeholder="url-slug-tuy-chinh"
                />
                <p className="text-xs text-muted-foreground">
                  Chỉ dùng chữ thường, số và dấu gạch ngang
                </p>
              </div>

              {(contentType === "post" || formData.type === "post") && (
                <div className="space-y-2">
                  <Label htmlFor="excerpt">Mô tả ngắn</Label>
                  <textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) =>
                      setFormData({ ...formData, excerpt: e.target.value })
                    }
                    placeholder="Mô tả ngắn về bài viết"
                    rows={3}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm resize-none"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="content">Nội dung</Label>
                <TiptapEditor
                  content={formData.content}
                  onChange={(content) =>
                    setFormData({ ...formData, content })
                  }
                  placeholder="Bắt đầu viết nội dung... (Nhấn '/' để xem lệnh)"
                />
              </div>
            </TabsContent>

            <TabsContent value="seo" className="space-y-6 mt-6">
              <div className="space-y-2">
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={formData.metaTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, metaTitle: e.target.value })
                  }
                  placeholder="Tiêu đề trong tìm kiếm (max 60)"
                  maxLength={60}
                />
                <p className="text-xs text-muted-foreground">
                  {formData.metaTitle.length}/60 ký tự
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <textarea
                  id="metaDescription"
                  value={formData.metaDescription}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      metaDescription: e.target.value,
                    })
                  }
                  placeholder="Mô tả trong tìm kiếm (max 160)"
                  maxLength={160}
                  rows={4}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  {formData.metaDescription.length}/160 ký tự
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaKeywords">Meta Keywords</Label>
                <Input
                  id="metaKeywords"
                  value={formData.metaKeywords}
                  onChange={(e) =>
                    setFormData({ ...formData, metaKeywords: e.target.value })
                  }
                  placeholder="từ-khóa-1, từ-khóa-2, từ-khóa-3"
                />
                <p className="text-xs text-muted-foreground">
                  Phân cách bằng dấu phẩy
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Floating Action Bar - Mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t md:hidden">
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" asChild>
            <Link href="/admin/content">Hủy</Link>
          </Button>
          <Button onClick={handleSave} disabled={saving} className="flex-1">
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Đang lưu..." : "Lưu"}
          </Button>
        </div>
      </div>
    </div>
  );
}
