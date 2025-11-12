"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogBody,
} from "@/components/ui/dialog";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  Lock,
  Palette,
  FileText,
  BarChart3,
  BookOpen,
  User,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { toast } from "sonner";

// ============================================================================
// TYPES
// ============================================================================

type ContentType = "page" | "post";
type PageType = "content" | "builder";
type ContentFilter = "all" | "pages" | "posts" | "builder";

interface ContentItem {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  content?: string;
  blocks?: any;
  excerpt?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  createdAt: string;
  updatedAt: string;
  author?: {
    name: string | null;
    email: string;
  };
  type: ContentType;
  pageType?: PageType;
}

interface FormData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ContentManagementPage() {
  // State
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<ContentItem | null>(null);
  const [createType, setCreateType] = useState<ContentType>("page");
  const [authorId, setAuthorId] = useState<string>("");
  const [formData, setFormData] = useState<FormData>({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
  });
  const [activeTab, setActiveTab] = useState("general");
  const [filterType, setFilterType] = useState<ContentFilter>("all");

  // Load data on mount
  useEffect(() => {
    fetchAllContent();
  }, []);

  // ============================================================================
  // DATA FETCHING
  // ============================================================================

  const fetchAllContent = async () => {
    try {
      const [pagesRes, postsRes] = await Promise.all([
        fetch("/api/pages"),
        fetch("/api/posts"),
      ]);

      const pagesData = await pagesRes.json();
      const postsData = await postsRes.json();

      const pages: ContentItem[] = (Array.isArray(pagesData)
        ? pagesData
        : pagesData.data || []
      ).map((page: any) => ({
        ...page,
        type: "page" as ContentType,
        pageType: (page.blocks ? "builder" : "content") as PageType,
      }));

      const posts: ContentItem[] = (Array.isArray(postsData)
        ? postsData
        : postsData.data || []
      ).map((post: any) => ({
        ...post,
        type: "post" as ContentType,
      }));

      const allContent = [...pages, ...posts].sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );

      setContents(allContent);
    } catch (error) {
      console.error("Error fetching content:", error);
      toast.error("Lỗi khi tải nội dung");
      setContents([]);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // CRUD OPERATIONS
  // ============================================================================

  const handleCreate = async () => {
    if (!formData.title.trim() || !formData.slug.trim()) {
      toast.error("Vui lòng điền tiêu đề và slug");
      return;
    }

    try {
      // Use cached authorId or get from first content item
      let userId = authorId;
      
      if (!userId && contents.length > 0) {
        // Get authorId from existing content by fetching full data
        const firstItem = contents[0];
        const endpoint = firstItem.type === "page" 
          ? `/api/pages/${firstItem.id}`
          : `/api/posts/${firstItem.id}`;
        const itemRes = await fetch(endpoint);
        const itemData = await itemRes.json();
        userId = itemData.data?.authorId || itemData.authorId;
      }

      if (!userId) {
        toast.error("Không tìm thấy user. Vui lòng tạo user trước hoặc có ít nhất 1 content để lấy authorId.");
        return;
      }

      const endpoint = createType === "page" ? "/api/pages" : "/api/posts";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          authorId: userId,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Unknown error" }));
        console.error("API Error:", errorData);
        throw new Error(errorData.error || errorData.message || "Failed to create");
      }

      const result = await res.json();
      setAuthorId(userId); // Cache for next time

      toast.success(`✅ Đã tạo ${createType === "page" ? "trang" : "bài viết"} thành công!`);
      await fetchAllContent();
      closeDialog();
    } catch (error: any) {
      console.error("Error creating:", error);
      toast.error(error.message || "Lỗi khi tạo nội dung");
    }
  };

  const handleUpdate = async () => {
    if (!editingContent) return;
    if (!formData.title.trim() || !formData.slug.trim()) {
      toast.error("Vui lòng điền tiêu đề và slug");
      return;
    }

    try {
      const endpoint =
        editingContent.type === "page"
          ? `/api/pages/${editingContent.id}`
          : `/api/posts/${editingContent.id}`;

      const res = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Unknown error" }));
        console.error("API Error:", errorData);
        throw new Error(errorData.error || errorData.message || "Failed to update");
      }

      toast.success("✅ Đã cập nhật thành công!");
      await fetchAllContent();
      closeDialog();
    } catch (error: any) {
      console.error("Error updating:", error);
      toast.error(error.message || "Lỗi khi cập nhật");
    }
  };

  const handleDelete = async (item: ContentItem) => {
    const typeName = item.type === "page" ? "trang" : "bài viết";
    if (!confirm(`Bạn chắc chắn muốn xóa ${typeName} này?`)) return;

    try {
      const endpoint =
        item.type === "page"
          ? `/api/pages/${item.id}`
          : `/api/posts/${item.id}`;

      const res = await fetch(endpoint, { method: "DELETE" });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Unknown error" }));
        console.error("API Error:", errorData);
        throw new Error(errorData.error || errorData.message || "Failed to delete");
      }

      toast.success("✅ Đã xóa thành công!");
      await fetchAllContent();
    } catch (error: any) {
      console.error("Error deleting:", error);
      toast.error(error.message || "Lỗi khi xóa");
    }
  };

  const handleTogglePublish = async (item: ContentItem) => {
    try {
      const endpoint =
        item.type === "page"
          ? `/api/pages/${item.id}`
          : `/api/posts/${item.id}`;

      const res = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !item.published }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Unknown error" }));
        console.error("API Error:", errorData);
        throw new Error(errorData.error || errorData.message || "Failed to toggle");
      }

      toast.success(
        item.published
          ? "✅ Đã chuyển sang Draft"
          : "✅ Đã xuất bản!"
      );
      await fetchAllContent();
    } catch (error: any) {
      console.error("Error toggling:", error);
      toast.error(error.message || "Lỗi khi thay đổi trạng thái");
    }
  };

  // ============================================================================
  // DIALOG MANAGEMENT
  // ============================================================================

  const openCreateDialog = (type: ContentType) => {
    setCreateType(type);
    setIsCreateOpen(true);
  };

  const openEditDialog = (item: ContentItem) => {
    setEditingContent(item);
    setFormData({
      title: item.title,
      slug: item.slug,
      content: item.content || "",
      excerpt: item.excerpt || "",
      metaTitle: item.metaTitle || "",
      metaDescription: item.metaDescription || "",
      metaKeywords: item.metaKeywords || "",
    });
  };

  const closeDialog = () => {
    setIsCreateOpen(false);
    setEditingContent(null);
    setFormData({
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
    });
    setActiveTab("general");
  };

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  const filteredContents = contents.filter((item) => {
    if (filterType === "all") return true;
    if (filterType === "pages") return item.type === "page" && !item.blocks;
    if (filterType === "posts") return item.type === "post";
    if (filterType === "builder") return item.type === "page" && !!item.blocks;
    return true;
  });

  const stats = {
    total: contents.length,
    published: contents.filter((c) => c.published).length,
    draft: contents.filter((c) => !c.published).length,
    pages: contents.filter((c) => c.type === "page" && !c.blocks).length,
    posts: contents.filter((c) => c.type === "post").length,
    builder: contents.filter((c) => c.type === "page" && !!c.blocks).length,
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold">Quản lý Nội dung</h1>
          <p className="text-sm text-muted-foreground">
            Quản lý thống nhất Pages, Posts và Visual Builder
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/page-builder">
              <Palette className="mr-2 h-4 w-4" />
              Page Builder
            </Link>
          </Button>
          <Button onClick={() => openCreateDialog("page")}>
            <Plus className="mr-2 h-4 w-4" />
            Tạo nội dung
          </Button>
        </div>
      </header>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard icon={BarChart3} label="Tổng số" value={stats.total} color="blue" />
        <StatCard icon={Eye} label="Published" value={stats.published} color="green" />
        <StatCard icon={Lock} label="Draft" value={stats.draft} color="orange" />
        <StatCard icon={FileText} label="Pages" value={stats.pages} color="purple" />
        <StatCard icon={BookOpen} label="Posts" value={stats.posts} color="pink" />
        <StatCard icon={Palette} label="Builder" value={stats.builder} color="indigo" />
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b pb-2">
        <FilterButton
          active={filterType === "all"}
          onClick={() => setFilterType("all")}
          icon={BarChart3}
          label="Tất cả"
          count={stats.total}
        />
        <FilterButton
          active={filterType === "pages"}
          onClick={() => setFilterType("pages")}
          icon={FileText}
          label="Pages"
          count={stats.pages}
        />
        <FilterButton
          active={filterType === "posts"}
          onClick={() => setFilterType("posts")}
          icon={BookOpen}
          label="Posts"
          count={stats.posts}
        />
        <FilterButton
          active={filterType === "builder"}
          onClick={() => setFilterType("builder")}
          icon={Palette}
          label="Builder"
          count={stats.builder}
        />
      </div>

      {/* Content Grid */}
      {loading ? (
        <LoadingState />
      ) : filteredContents.length === 0 ? (
        <EmptyState filterType={filterType} onCreatePage={() => openCreateDialog("page")} onCreatePost={() => openCreateDialog("post")} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContents.map((item) => (
            <ContentCard
              key={item.id}
              item={item}
              onEdit={() => openEditDialog(item)}
              onDelete={() => handleDelete(item)}
              onTogglePublish={() => handleTogglePublish(item)}
            />
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <ContentDialog
        open={isCreateOpen || !!editingContent}
        onClose={closeDialog}
        isEdit={!!editingContent}
        contentType={editingContent?.type || createType}
        formData={formData}
        setFormData={setFormData}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSubmit={editingContent ? handleUpdate : handleCreate}
        onTypeChange={setCreateType}
      />
    </div>
  );
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: any;
  label: string;
  value: number;
  color: string;
}) {
  const colorClasses = {
    blue: "text-blue-600",
    green: "text-green-600",
    orange: "text-orange-600",
    purple: "text-purple-600",
    pink: "text-pink-600",
    indigo: "text-indigo-600",
  };

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`h-4 w-4 ${colorClasses[color as keyof typeof colorClasses]}`} />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <div className={`text-2xl font-bold ${colorClasses[color as keyof typeof colorClasses]}`}>
        {value}
      </div>
    </Card>
  );
}

function FilterButton({
  active,
  onClick,
  icon: Icon,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  icon: any;
  label: string;
  count: number;
}) {
  return (
    <Button
      variant={active ? "default" : "ghost"}
      size="sm"
      onClick={onClick}
    >
      <Icon className="mr-2 h-4 w-4" />
      {label} ({count})
    </Button>
  );
}

function LoadingState() {
  return (
    <div className="text-center py-12">
      <p className="text-muted-foreground">Đang tải...</p>
    </div>
  );
}

function EmptyState({
  filterType,
  onCreatePage,
  onCreatePost,
}: {
  filterType: ContentFilter;
  onCreatePage: () => void;
  onCreatePost: () => void;
}) {
  if (filterType === "all") {
    return (
      <Card>
        <CardContent className="py-12 text-center space-y-4">
          <p className="text-muted-foreground">Chưa có nội dung nào</p>
          <div className="flex gap-2 justify-center">
            <Button onClick={onCreatePage}>
              <Plus className="mr-2 h-4 w-4" />
              Tạo Page
            </Button>
            <Button variant="outline" onClick={onCreatePost}>
              <Plus className="mr-2 h-4 w-4" />
              Tạo Post
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="py-12 text-center">
        <p className="text-muted-foreground">
          Không có {filterType === "pages" ? "pages" : filterType === "posts" ? "posts" : "builder pages"} nào
        </p>
      </CardContent>
    </Card>
  );
}

function ContentCard({
  item,
  onEdit,
  onDelete,
  onTogglePublish,
}: {
  item: ContentItem;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePublish: () => void;
}) {
  const isBuilder = item.type === "page" && !!item.blocks;
  const isPost = item.type === "post";
  const elementCount = isBuilder ? (item.blocks?.elements?.length || 0) : 0;

  const gradients = {
    builder: "bg-gradient-to-br from-blue-50 to-indigo-50",
    post: "bg-gradient-to-br from-pink-50 to-rose-50",
    page: "bg-gradient-to-br from-purple-50 to-violet-50",
  };

  const gradient = isBuilder
    ? gradients.builder
    : isPost
    ? gradients.post
    : gradients.page;

  return (
    <Card className="flex flex-col hover:shadow-lg transition-shadow">
      {/* Preview Section */}
      <div className={`h-32 ${gradient} flex items-center justify-center border-b`}>
        {isBuilder ? (
          <div className="text-center">
            <Palette className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-indigo-600">{elementCount}</div>
            <div className="text-xs text-gray-600">Elements</div>
          </div>
        ) : isPost ? (
          <BookOpen className="h-12 w-12 text-pink-600" />
        ) : (
          <FileText className="h-12 w-12 text-purple-600" />
        )}
      </div>

      {/* Content */}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="line-clamp-1 text-base">{item.title}</CardTitle>
            <p className="text-xs text-muted-foreground truncate">/{item.slug}</p>
          </div>
          <Badge variant={item.published ? "default" : "secondary"} className="shrink-0">
            {item.published ? "Live" : "Draft"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between pt-0">
        <div className="text-xs text-muted-foreground mb-3 space-y-1">
          <div className="flex items-center gap-2">
            {isBuilder ? (
              <Badge variant="outline" className="text-xs">
                <Palette className="h-3 w-3 mr-1" />
                Builder
              </Badge>
            ) : isPost ? (
              <Badge variant="outline" className="text-xs">
                <BookOpen className="h-3 w-3 mr-1" />
                Post
              </Badge>
            ) : (
              <Badge variant="outline" className="text-xs">
                <FileText className="h-3 w-3 mr-1" />
                Page
              </Badge>
            )}
          </div>
          {item.author && (
            <p className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {item.author.name || item.author.email}
            </p>
          )}
          <p>Cập nhật: {new Date(item.updatedAt).toLocaleDateString("vi-VN")}</p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          {isBuilder ? (
            <>
              <Button variant="outline" size="sm" asChild className="flex-1">
                <Link href={`/admin/page-builder/${item.id}`}>
                  <Edit2 className="h-3 w-3 mr-1" />
                  Edit Builder
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/pages/${item.slug}`} target="_blank">
                  <Eye className="h-3 w-3" />
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Edit2 className="h-3 w-3 mr-1" />
                Sửa
              </Button>
              <Button variant="outline" size="sm" onClick={onTogglePublish}>
                {item.published ? (
                  <Lock className="h-3 w-3" />
                ) : (
                  <Eye className="h-3 w-3" />
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={onDelete}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function ContentDialog({
  open,
  onClose,
  isEdit,
  contentType,
  formData,
  setFormData,
  activeTab,
  setActiveTab,
  onSubmit,
  onTypeChange,
}: {
  open: boolean;
  onClose: () => void;
  isEdit: boolean;
  contentType: ContentType;
  formData: FormData;
  setFormData: (data: FormData) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSubmit: () => void;
  onTypeChange: (type: ContentType) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl p-4">
        <DialogHeader>
          <DialogTitle>
            {isEdit
              ? `Chỉnh sửa ${contentType === "post" ? "bài viết" : "trang"}`
              : `Tạo ${contentType === "post" ? "bài viết" : "trang"} mới`}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Cập nhật thông tin nội dung"
              : `Tạo một ${contentType === "post" ? "bài viết blog" : "trang tĩnh"} mới`}
          </DialogDescription>
        </DialogHeader>

        {/* Type Selector - Only when creating */}
        {!isEdit && (
          <div className="flex gap-2 border-b pb-4">
            <Button
              variant={contentType === "page" ? "default" : "outline"}
              size="sm"
              onClick={() => onTypeChange("page")}
            >
              <FileText className="mr-2 h-4 w-4" />
              Page
            </Button>
            <Button
              variant={contentType === "post" ? "default" : "outline"}
              size="sm"
              onClick={() => onTypeChange("post")}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Post
            </Button>
          </div>
        )}

        <DialogBody>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="general">Thông tin chung</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Tiêu đề</Label>
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
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  placeholder="url-slug-tuy-chinh"
                />
              </div>

              {contentType === "post" && (
                <div className="space-y-2">
                  <Label htmlFor="excerpt">Mô tả ngắn</Label>
                  <textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) =>
                      setFormData({ ...formData, excerpt: e.target.value })
                    }
                    placeholder="Mô tả ngắn về bài viết"
                    rows={2}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm resize-none"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="content">Nội dung</Label>
                <textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="Nhập nội dung"
                  rows={6}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm resize-none"
                />
              </div>
            </TabsContent>

            <TabsContent value="seo" className="space-y-4 mt-4">
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
                  {formData.metaTitle.length}/60
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
                  rows={3}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  {formData.metaDescription.length}/160
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
                  placeholder="Từ khóa phân cách bằng dấu phẩy"
                />
              </div>
            </TabsContent>
          </Tabs>
        </DialogBody>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={onSubmit}>{isEdit ? "Cập nhật" : "Tạo"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
