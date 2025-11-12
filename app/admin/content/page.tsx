"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Edit2, Trash2, Eye, Lock, Palette, FileText, BarChart3, BookOpen, User } from "lucide-react";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

type ContentType = 'page' | 'post';
type PageType = 'content' | 'builder';
type ContentFilter = 'all' | 'pages' | 'posts' | 'builder';

interface BaseContent {
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
}

interface ContentItem extends BaseContent {
  type: ContentType;
  pageType?: PageType;
}

export default function ContentManagementPage() {
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<ContentItem | null>(null);
  const [createType, setCreateType] = useState<ContentType>('page');
  const [formData, setFormData] = useState({ 
    title: '', 
    slug: '',
    content: '',
    excerpt: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
  });
  const [activeTab, setActiveTab] = useState('general');
  const [filterType, setFilterType] = useState<ContentFilter>('all');

  useEffect(() => {
    fetchAllContent();
  }, []);

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
    });
  };

  const fetchAllContent = async () => {
    try {
      // Fetch pages and posts in parallel
      const [pagesRes, postsRes] = await Promise.all([
        fetch('/api/pages'),
        fetch('/api/posts')
      ]);

      const pagesData = await pagesRes.json();
      const postsData = await postsRes.json();

      // Process pages
      const pages: ContentItem[] = (Array.isArray(pagesData) ? pagesData : pagesData.data || []).map((page: any) => ({
        ...page,
        type: 'page' as ContentType,
        pageType: page.blocks ? 'builder' : 'content' as PageType,
      }));

      // Process posts
      const posts: ContentItem[] = (Array.isArray(postsData) ? postsData : postsData.data || []).map((post: any) => ({
        ...post,
        type: 'post' as ContentType,
      }));

      // Combine and sort by updatedAt
      const allContent = [...pages, ...posts].sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );

      setContents(allContent);
    } catch (error) {
      console.error('Error fetching content:', error);
      setContents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const endpoint = createType === 'page' ? '/api/pages' : '/api/posts';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        await fetchAllContent();
        setIsCreateOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error creating content:', error);
    }
  };

  const handleUpdate = async () => {
    if (!editingContent) return;
    try {
      const endpoint = editingContent.type === 'page' 
        ? `/api/pages/${editingContent.id}`
        : `/api/posts/${editingContent.id}`;
      
      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editingContent, ...formData }),
      });
      if (res.ok) {
        await fetchAllContent();
        setEditingContent(null);
        resetForm();
      }
    } catch (error) {
      console.error('Error updating content:', error);
    }
  };

  const handleDelete = async (item: ContentItem) => {
    const typeName = item.type === 'page' ? 'trang' : 'bài viết';
    if (!confirm(`Bạn chắc chắn muốn xóa ${typeName} này?`)) return;
    
    try {
      const endpoint = item.type === 'page' 
        ? `/api/pages/${item.id}`
        : `/api/posts/${item.id}`;
      
      const res = await fetch(endpoint, { method: 'DELETE' });
      if (res.ok) {
        await fetchAllContent();
      }
    } catch (error) {
      console.error('Error deleting content:', error);
    }
  };

  const handleTogglePublish = async (item: ContentItem) => {
    try {
      const endpoint = item.type === 'page' 
        ? `/api/pages/${item.id}`
        : `/api/posts/${item.id}`;
      
      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !item.published }),
      });
      if (res.ok) {
        await fetchAllContent();
      }
    } catch (error) {
      console.error('Error updating content:', error);
    }
  };

  // Filter contents
  const filteredContents = contents.filter(item => {
    if (filterType === 'all') return true;
    if (filterType === 'pages') return item.type === 'page' && !item.blocks;
    if (filterType === 'posts') return item.type === 'post';
    if (filterType === 'builder') return item.type === 'page' && !!item.blocks;
    return true;
  });

  // Statistics
  const stats = {
    total: contents.length,
    published: contents.filter(c => c.published).length,
    draft: contents.filter(c => !c.published).length,
    pages: contents.filter(c => c.type === 'page' && !c.blocks).length,
    posts: contents.filter(c => c.type === 'post').length,
    builder: contents.filter(c => c.type === 'page' && !!c.blocks).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
          <Button onClick={() => {
            setCreateType('page');
            setIsCreateOpen(true);
          }}>
            <Plus className="mr-2 h-4 w-4" />
            Tạo nội dung
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="h-4 w-4 text-blue-600" />
            <span className="text-xs text-muted-foreground">Tổng số</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="h-4 w-4 text-green-600" />
            <span className="text-xs text-muted-foreground">Published</span>
          </div>
          <div className="text-2xl font-bold text-green-600">{stats.published}</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="h-4 w-4 text-orange-600" />
            <span className="text-xs text-muted-foreground">Draft</span>
          </div>
          <div className="text-2xl font-bold text-orange-600">{stats.draft}</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-purple-600" />
            <span className="text-xs text-muted-foreground">Pages</span>
          </div>
          <div className="text-2xl font-bold text-purple-600">{stats.pages}</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-4 w-4 text-pink-600" />
            <span className="text-xs text-muted-foreground">Posts</span>
          </div>
          <div className="text-2xl font-bold text-pink-600">{stats.posts}</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Palette className="h-4 w-4 text-indigo-600" />
            <span className="text-xs text-muted-foreground">Builder</span>
          </div>
          <div className="text-2xl font-bold text-indigo-600">{stats.builder}</div>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b pb-2">
        <Button
          variant={filterType === 'all' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setFilterType('all')}
        >
          Tất cả ({stats.total})
        </Button>
        <Button
          variant={filterType === 'pages' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setFilterType('pages')}
        >
          <FileText className="mr-2 h-4 w-4" />
          Pages ({stats.pages})
        </Button>
        <Button
          variant={filterType === 'posts' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setFilterType('posts')}
        >
          <BookOpen className="mr-2 h-4 w-4" />
          Posts ({stats.posts})
        </Button>
        <Button
          variant={filterType === 'builder' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setFilterType('builder')}
        >
          <Palette className="mr-2 h-4 w-4" />
          Builder ({stats.builder})
        </Button>
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      ) : filteredContents.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center space-y-4">
            <p className="text-muted-foreground">Chưa có nội dung nào</p>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => {
                setCreateType('page');
                setIsCreateOpen(true);
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Tạo Page
              </Button>
              <Button variant="outline" onClick={() => {
                setCreateType('post');
                setIsCreateOpen(true);
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Tạo Post
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContents.map((item) => {
            const isBuilderPage = item.type === 'page' && !!item.blocks;
            const isPost = item.type === 'post';
            const elementCount = isBuilderPage && item.blocks?.elements?.length || 0;

            return (
              <Card key={item.id} className="flex flex-col hover:shadow-lg transition-shadow">
                {/* Type Indicator & Preview */}
                {isBuilderPage ? (
                  <div className="h-32 bg-linear-to-br from-blue-50 to-indigo-50 flex items-center justify-center border-b">
                    <div className="text-center">
                      <Palette className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-indigo-600">{elementCount}</div>
                      <div className="text-xs text-gray-600">Elements</div>
                    </div>
                  </div>
                ) : isPost ? (
                  <div className="h-32 bg-linear-to-br from-pink-50 to-rose-50 flex items-center justify-center border-b">
                    <BookOpen className="h-12 w-12 text-pink-600" />
                  </div>
                ) : (
                  <div className="h-32 bg-linear-to-br from-purple-50 to-violet-50 flex items-center justify-center border-b">
                    <FileText className="h-12 w-12 text-purple-600" />
                  </div>
                )}

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="line-clamp-1 text-base">{item.title}</CardTitle>
                      </div>
                      <CardDescription className="text-xs">/{item.slug}</CardDescription>
                    </div>
                    <Badge variant={item.published ? "default" : "secondary"} className="shrink-0">
                      {item.published ? "Live" : "Draft"}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col justify-between pt-0">
                  <div className="text-xs text-muted-foreground mb-3 space-y-1">
                    <div className="flex items-center gap-2 mb-1">
                      {isBuilderPage ? (
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
                    <p>Cập nhật: {new Date(item.updatedAt).toLocaleDateString('vi-VN')}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {isBuilderPage ? (
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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingContent(item);
                            setFormData({
                              title: item.title,
                              slug: item.slug,
                              content: item.content || '',
                              excerpt: item.excerpt || '',
                              metaTitle: item.metaTitle || '',
                              metaDescription: item.metaDescription || '',
                              metaKeywords: item.metaKeywords || '',
                            });
                          }}
                        >
                          <Edit2 className="h-3 w-3 mr-1" />
                          Sửa
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTogglePublish(item)}
                        >
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
                          onClick={() => handleDelete(item)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isCreateOpen || !!editingContent} onOpenChange={(open) => {
        if (!open) {
          setIsCreateOpen(false);
          setEditingContent(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {editingContent 
                ? `Chỉnh sửa ${editingContent.type === 'post' ? 'bài viết' : 'trang'}`
                : `Tạo ${createType === 'post' ? 'bài viết' : 'trang'} mới`
              }
            </DialogTitle>
            <DialogDescription>
              {editingContent 
                ? 'Cập nhật thông tin nội dung'
                : `Tạo một ${createType === 'post' ? 'bài viết blog' : 'trang tĩnh'} mới`
              }
            </DialogDescription>
          </DialogHeader>

          {/* Content Type Selector - Only when creating */}
          {!editingContent && (
            <div className="flex gap-2 border-b pb-4">
              <Button
                variant={createType === 'page' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCreateType('page')}
              >
                <FileText className="mr-2 h-4 w-4" />
                Page
              </Button>
              <Button
                variant={createType === 'post' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCreateType('post')}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Post
              </Button>
            </div>
          )}

          <div className="flex-1 overflow-y-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="general">Thông tin chung</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general" className="space-y-4 mt-4">
                <div className="grid gap-3">
                  <Label htmlFor="title">Tiêu đề</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Tiêu đề nội dung"
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="url-slug-tuy-chinh"
                  />
                </div>
                {(createType === 'post' || editingContent?.type === 'post') && (
                  <div className="grid gap-3">
                    <Label htmlFor="excerpt">Mô tả ngắn</Label>
                    <textarea
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      placeholder="Mô tả ngắn về bài viết"
                      rows={2}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                    />
                  </div>
                )}
                <div className="grid gap-3">
                  <Label htmlFor="content">Nội dung</Label>
                  <textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Nhập nội dung"
                    rows={6}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="seo" className="space-y-4 mt-4">
                <div className="grid gap-3">
                  <Label htmlFor="metaTitle">Meta Title</Label>
                  <Input
                    id="metaTitle"
                    value={formData.metaTitle}
                    onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                    placeholder="Tiêu đề trong tìm kiếm (max 60)"
                    maxLength={60}
                  />
                  <p className="text-xs text-muted-foreground">{formData.metaTitle.length}/60</p>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <textarea
                    id="metaDescription"
                    value={formData.metaDescription}
                    onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                    placeholder="Mô tả trong tìm kiếm (max 160)"
                    maxLength={160}
                    rows={3}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                  />
                  <p className="text-xs text-muted-foreground">{formData.metaDescription.length}/160</p>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="metaKeywords">Meta Keywords</Label>
                  <Input
                    id="metaKeywords"
                    value={formData.metaKeywords}
                    onChange={(e) => setFormData({ ...formData, metaKeywords: e.target.value })}
                    placeholder="Từ khóa phân cách bằng dấu phẩy"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <DialogFooter className="border-t pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateOpen(false);
                setEditingContent(null);
                resetForm();
              }}
            >
              Hủy
            </Button>
            <Button onClick={editingContent ? handleUpdate : handleCreate}>
              {editingContent ? 'Cập nhật' : 'Tạo'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
