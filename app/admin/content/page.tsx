"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import Link from "next/link";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

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

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ContentManagementPage() {
  // State
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<ContentFilter>("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    item: ContentItem | null;
  }>({ open: false, item: null });

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
        pageType: (post.blocks ? "builder" : "content") as PageType,
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

  const handleDelete = async (item: ContentItem) => {
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

      toast.success("Đã xóa thành công!");
      setDeleteDialog({ open: false, item: null });
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
  // COMPUTED VALUES
  // ============================================================================

  const filteredContents = contents.filter((item) => {
    if (filterType === "all") return true;
    if (filterType === "pages") return item.type === "page" && !item.blocks;
    if (filterType === "posts") return item.type === "post" && !item.blocks;
    if (filterType === "builder") return !!item.blocks; // Both pages and posts with builder
    return true;
  });

  const stats = {
    total: contents.length,
    published: contents.filter((c) => c.published).length,
    draft: contents.filter((c) => !c.published).length,
    pages: contents.filter((c) => c.type === "page" && !c.blocks).length,
    posts: contents.filter((c) => c.type === "post" && !c.blocks).length,
    builder: contents.filter((c) => !!c.blocks).length, // Both pages and posts with builder
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
          <Button onClick={() => setShowCreateDialog(true)}>
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
        <EmptyState filterType={filterType} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContents.map((item) => (
            <ContentCard
              key={item.id}
              item={item}
              onDelete={() => setDeleteDialog({ open: true, item })}
              onTogglePublish={() => handleTogglePublish(item)}
            />
          ))}
        </div>
      )}

      {/* Create Content Dialog */}
      <CreateContentDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, item: null })}
        title="Xác nhận xóa"
        description={`Bạn chắc chắn muốn xóa ${deleteDialog.item?.type === "page" ? "trang" : "bài viết"} "${deleteDialog.item?.title}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
        variant="destructive"
        onConfirm={() => deleteDialog.item && handleDelete(deleteDialog.item)}
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

function EmptyState({ filterType }: { filterType: ContentFilter }) {
  if (filterType === "all") {
    return (
      <Card>
        <CardContent className="py-12 text-center space-y-4">
          <p className="text-muted-foreground">Chưa có nội dung nào</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Button asChild>
              <Link href="/admin/content/new?type=page&mode=content">
                <Plus className="mr-2 h-4 w-4" />
                Tạo Page
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/content/new?type=post&mode=content">
                <Plus className="mr-2 h-4 w-4" />
                Tạo Post
              </Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href="/admin/content/new?mode=builder">
                <Palette className="mr-2 h-4 w-4" />
                Tạo Page Builder
              </Link>
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
  onDelete,
  onTogglePublish,
}: {
  item: ContentItem;
  onDelete: () => void;
  onTogglePublish: () => void;
}) {
  const isBuilder = !!item.blocks;
  const isPost = item.type === "post";
  const elementCount = isBuilder ? (item.blocks?.canvas?.elements?.length || item.blocks?.elements?.length || 0) : 0;

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
                <Link href={isPost ? `/posts/${item.slug}` : `/pages/${item.slug}`} target="_blank">
                  <Eye className="h-3 w-3" />
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" asChild className="flex-1">
                <Link href={`/admin/content/${item.id}`}>
                  <Edit2 className="h-3 w-3 mr-1" />
                  Sửa
                </Link>
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

// ============================================================================
// CREATE CONTENT DIALOG (Helper Component)
// ============================================================================

function CreateContentDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tạo nội dung mới</DialogTitle>
          <DialogDescription>
            Chọn loại nội dung bạn muốn tạo
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-3 py-4">
          {/* Page (Content Mode) */}
          <Link
            href="/admin/content/new?type=page&mode=content"
            onClick={() => onOpenChange(false)}
            className="flex items-start gap-4 p-4 border rounded-lg hover:bg-accent hover:border-primary transition-colors cursor-pointer group"
          >
            <div className="mt-1 p-2 rounded-md bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
              <FileText className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold group-hover:text-primary">Page (Content)</h3>
              <p className="text-sm text-muted-foreground">
                Trang tĩnh với TipTap editor, phù hợp cho About, Contact
              </p>
            </div>
          </Link>

          {/* Post (Content Mode) */}
          <Link
            href="/admin/content/new?type=post&mode=content"
            onClick={() => onOpenChange(false)}
            className="flex items-start gap-4 p-4 border rounded-lg hover:bg-accent hover:border-primary transition-colors cursor-pointer group"
          >
            <div className="mt-1 p-2 rounded-md bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400">
              <BookOpen className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold group-hover:text-primary">Post (Blog)</h3>
              <p className="text-sm text-muted-foreground">
                Bài viết blog với excerpt, phù hợp cho articles
              </p>
            </div>
          </Link>

          {/* Page Builder */}
          <Link
            href="/admin/content/new?mode=builder&type=page"
            onClick={() => onOpenChange(false)}
            className="flex items-start gap-4 p-4 border rounded-lg hover:bg-accent hover:border-primary transition-colors cursor-pointer group"
          >
            <div className="mt-1 p-2 rounded-md bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400">
              <Palette className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold group-hover:text-primary">Page Builder (Visual)</h3>
              <p className="text-sm text-muted-foreground">
                Editor visual kéo thả, phù hợp cho landing pages, layouts phức tạp
              </p>
            </div>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}




