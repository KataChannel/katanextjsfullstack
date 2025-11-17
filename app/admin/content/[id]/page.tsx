"use client";

import { useEffect, useState, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { TiptapEditor } from "@/components/tiptap-editor";
import Link from "next/link";
import { generateSlug } from "@/lib/utils";

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
  mode?: "content" | "builder"; // content = TipTap, builder = Page Builder
  showHeader?: boolean;
  showFooter?: boolean;
}

export default function ContentEditPage({ params }: PageParams) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { id } = use(params); // Unwrap params Promise
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const [contentType, setContentType] = useState<"page" | "post">(
    (searchParams.get("type") as "page" | "post") || "page"
  );
  const [contentMode, setContentMode] = useState<"content" | "builder">(
    (searchParams.get("mode") as "content" | "builder") || "content"
  );
  const [formData, setFormData] = useState<ContentData>({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    mode: "content",
    showHeader: true,
    showFooter: true,
  });

  useEffect(() => {
    if (id !== "new") {
      fetchContent(id);
    } else {
      setLoading(false);
    }
  }, [id]);

  const fetchContent = async (contentId: string) => {
    try {
      setLoading(true);
      
      // Try to fetch as page first from CURRENT DOMAIN database only
      let res = await fetch(`/api/pages-v2/${contentId}`);
      let type: "page" | "post" = "page";
      
      if (!res.ok) {
        // Try as post from CURRENT DOMAIN database only
        res = await fetch(`/api/posts/${contentId}`);
        type = "post";
      }

      if (!res.ok) {
        const currentDomain = window.location.hostname + (window.location.port ? ':' + window.location.port : '');
        throw new Error(
          `Không tìm thấy nội dung với ID: ${contentId}\n\n` +
          `Database hiện tại: ${currentDomain}\n\n` +
          `Lưu ý: Mỗi domain chỉ quản lý database của domain đó. ` +
          `Vui lòng truy cập đúng domain/port để chỉnh sửa nội dung.`
        );
      }

      const data = await res.json();
      const content = data.data || data;

      if (!content || !content.id) {
        throw new Error('Dữ liệu nội dung không hợp lệ');
      }

      setFormData({
        title: content.title || "",
        slug: content.slug || "",
        content: content.content || "",
        excerpt: content.excerpt || "",
        metaTitle: content.metaTitle || "",
        metaDescription: content.metaDescription || "",
        metaKeywords: content.metaKeywords || "",
        published: content.published,
        showHeader: content.showHeader !== false, // default true
        showFooter: content.showFooter !== false, // default true
        type,
        mode: content.blocks || content.blocksV2 ? "builder" : "content",
      });
      
      setContentType(type);
      
      // Set content mode based on blocks
      if (content.blocks || content.blocksV2) {
        setContentMode("builder");
      }
    } catch (error: any) {
      console.error("Error fetching content:", error);
      toast.error(error.message || "Không thể tải nội dung");
      // Give user time to see error message before redirect
      setTimeout(() => {
        router.push("/admin/content");
      }, 2000);
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
        // Create new - use contentType from state
        const type = contentType;
        
        // Get authorId - try multiple sources
        let authorId: string | null = null;
        
        try {
          // Try 1: Get from existing content
          const contentsRes = await fetch("/api/pages-v2?limit=1");
          const contentsData = await contentsRes.json();
          const firstContent = contentsData.data?.[0] || contentsData[0];
          
          if (firstContent) {
            const detailRes = await fetch(`/api/pages-v2/${firstContent.id}`);
            const detailData = await detailRes.json();
            authorId = detailData.data?.authorId || detailData.authorId;
          }
        } catch (error) {
          console.log("Could not get authorId from existing content");
        }
        
        // Try 2: Get from users (first admin user)
        if (!authorId) {
          try {
            const usersRes = await fetch("/api/users?limit=1&role=admin");
            const usersData = await usersRes.json();
            const firstUser = usersData.data?.[0] || usersData[0];
            
            if (firstUser) {
              authorId = firstUser.id;
            }
          } catch (error) {
            console.log("Could not get authorId from users");
          }
        }
        
        // Try 3: Ensure admin user exists (auto-create if needed)
        if (!authorId) {
          try {
            const ensureRes = await fetch("/api/users/ensure-admin", {
              method: "POST",
            });
            const ensureData = await ensureRes.json();
            
            if (ensureData.userId) {
              authorId = ensureData.userId;
              toast.success("Đã tạo admin user mặc định");
            }
          } catch (error) {
            console.log("Could not ensure admin user");
          }
        }
        
        // Final fallback: Show error
        if (!authorId) {
          toast.error("Không thể tạo hoặc tìm thấy user. Vui lòng kiểm tra database.");
          setSaving(false);
          return;
        }

        const endpoint = type === "page" ? "/api/pages-v2" : "/api/posts";
        
        // Prepare data based on mode
        const dataToSend: any = {
          ...formData,
          authorId,
        };
        
        // If builder mode, create empty blocksV2 structure
        if (contentMode === "builder") {
          dataToSend.blocksV2 = [];
          dataToSend.version = 2;
          // Don't send content for builder mode
          delete dataToSend.content;
        } else {
          // Content mode: ensure no blocks
          dataToSend.version = 1;
          delete dataToSend.blocks;
          delete dataToSend.blocksV2;
        }
        
        // Remove mode field (not in database)
        delete dataToSend.mode;
        
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSend),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ error: "Unknown error" }));
          throw new Error(errorData.error || "Failed to create");
        }

        const result = await res.json();
        const newId = result.data?.id || result.id;
        
        toast.success(`Đã tạo ${type === "page" ? "trang" : "bài viết"} thành công!`);
        
        // If builder mode, redirect to page builder
        if (contentMode === "builder") {
          router.push(`/admin/page-builder/${newId}`);
        } else {
          router.push("/admin/content");
        }
      } else {
        // Update existing
        const type = formData.type || "page";
        const endpoint = type === "page" ? `/api/pages-v2/${id}` : `/api/posts/${id}`;
        
        const res = await fetch(endpoint, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ error: "Unknown error" }));
          throw new Error(errorData.error || "Failed to update");
        }

        toast.success("Đã cập nhật thành công!");
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
  const displayType = formData.type || contentType;
  const displayMode = formData.mode || contentMode;

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
                ? `Tạo ${displayMode === "builder" ? "Page Builder" : displayType === "page" ? "trang" : "bài viết"} mới`
                : `Chỉnh sửa ${displayMode === "builder" ? "Page Builder" : displayType === "page" ? "trang" : "bài viết"}`
              }
            </h1>
          </div>
          <p className="text-sm text-muted-foreground ml-14">
            {isNewContent 
              ? displayMode === "builder" 
                ? "Tạo trang mới với Page Builder visual editor"
                : "Điền thông tin để tạo nội dung mới"
              : "Cập nhật thông tin nội dung"
            }
          </p>
        </div>

        <Button onClick={handleSave} disabled={saving}>
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Đang lưu..." : displayMode === "builder" ? "Tạo & Mở Builder" : "Lưu"}
        </Button>
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Thông tin nội dung</CardTitle>
              <CardDescription>
                {displayMode === "builder" 
                  ? "Điền thông tin cơ bản, sau đó bạn sẽ chuyển sang Page Builder để thiết kế"
                  : "Điền đầy đủ thông tin và nội dung"
                }
              </CardDescription>
            </div>
            
            {/* Type & Mode switcher - only for new content */}
            {isNewContent && (
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <Button
                    variant={contentMode === "content" && contentType === "page" ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setContentMode("content");
                      setContentType("page");
                    }}
                  >
                    📄 Page
                  </Button>
                  <Button
                    variant={contentMode === "content" && contentType === "post" ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setContentMode("content");
                      setContentType("post");
                    }}
                  >
                    📝 Post
                  </Button>
                  <Button
                    variant={contentMode === "builder" ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setContentMode("builder");
                      setContentType("page"); // Builder chỉ cho pages
                    }}
                  >
                    🎨 Builder
                  </Button>
                </div>
                {contentMode === "builder" && (
                  <p className="text-xs text-muted-foreground text-right">
                    Page Builder chỉ hỗ trợ Pages
                  </p>
                )}
              </div>
            )}
          </div>
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
                  onChange={(e) => {
                    const newTitle = e.target.value;
                    setFormData({ ...formData, title: newTitle });
                    
                    // Auto-generate slug only if not manually edited
                    if (!isSlugManuallyEdited && newTitle) {
                      setFormData(prev => ({ ...prev, slug: generateSlug(newTitle) }));
                    }
                  }}
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
                  onChange={(e) => {
                    setIsSlugManuallyEdited(true);
                    setFormData({ ...formData, slug: generateSlug(e.target.value) });
                  }}
                  placeholder="url-slug-tuy-chinh"
                />
                <p className="text-xs text-muted-foreground">
                  Tự động tạo từ tiêu đề. Chỉ dùng chữ thường, số và dấu gạch ngang.
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

              {/* Layout Options */}
              <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                <Label className="text-sm font-semibold">Tùy chọn hiển thị</Label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="showHeader"
                      checked={formData.showHeader !== false}
                      onChange={(e) =>
                        setFormData({ ...formData, showHeader: e.target.checked })
                      }
                      className="h-4 w-4 rounded border-input"
                    />
                    <Label htmlFor="showHeader" className="text-sm font-normal cursor-pointer">
                      Hiển thị Header
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="showFooter"
                      checked={formData.showFooter !== false}
                      onChange={(e) =>
                        setFormData({ ...formData, showFooter: e.target.checked })
                      }
                      className="h-4 w-4 rounded border-input"
                    />
                    <Label htmlFor="showFooter" className="text-sm font-normal cursor-pointer">
                      Hiển thị Footer
                    </Label>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Bỏ chọn nếu bạn muốn trang này không có header/footer (ví dụ: landing page)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Nội dung</Label>
                {contentMode === "builder" ? (
                  <div className="border border-dashed rounded-md p-8 text-center space-y-3">
                    <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      🎨
                    </div>
                    <div>
                      <p className="font-medium">Page Builder Mode</p>
                      <p className="text-sm text-muted-foreground">
                        Sau khi tạo, bạn sẽ được chuyển sang Page Builder để thiết kế visual
                      </p>
                    </div>
                  </div>
                ) : (
                  <TiptapEditor
                    content={formData.content}
                    onChange={(content) =>
                      setFormData({ ...formData, content })
                    }
                    placeholder="Bắt đầu viết nội dung... (Nhấn '/' để xem lệnh)"
                  />
                )}
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
