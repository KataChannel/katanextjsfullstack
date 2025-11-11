"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Edit2, Trash2, Eye, Lock, Palette, FileText, BarChart3 } from "lucide-react";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

interface Page {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  content?: string;
  blocks?: any;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  createdAt: string;
  updatedAt: string;
}

type PageFilter = 'all' | 'content' | 'builder';

export default function PagesManagementPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [formData, setFormData] = useState({ 
    title: '', 
    slug: '',
    content: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
  });
  const [activeTab, setActiveTab] = useState('general');
  const [filterType, setFilterType] = useState<PageFilter>('all');

  useEffect(() => {
    fetchPages();
  }, []);

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      content: '',
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
    });
  };

  const fetchPages = async () => {
    try {
      const res = await fetch('/api/pages');
      const data = await res.json();
      if (data.success && data.data) {
        setPages(Array.isArray(data.data) ? data.data : []);
      } else if (Array.isArray(data)) {
        setPages(data);
      } else {
        setPages([]);
      }
    } catch (error) {
      console.error('Error fetching pages:', error);
      setPages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const res = await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        await fetchPages();
        setIsCreateOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error creating page:', error);
    }
  };

  const handleUpdate = async () => {
    if (!editingPage) return;
    try {
      const res = await fetch(`/api/pages/${editingPage.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editingPage, ...formData }),
      });
      if (res.ok) {
        await fetchPages();
        setEditingPage(null);
        resetForm();
      }
    } catch (error) {
      console.error('Error updating page:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn chắc chắn muốn xóa trang này?')) return;
    try {
      const res = await fetch(`/api/pages/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchPages();
      }
    } catch (error) {
      console.error('Error deleting page:', error);
    }
  };

  const handleTogglePublish = async (id: string, published: boolean) => {
    try {
      const res = await fetch(`/api/pages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !published }),
      });
      if (res.ok) {
        await fetchPages();
      }
    } catch (error) {
      console.error('Error updating page:', error);
    }
  };

  // Filter pages
  const filteredPages = pages.filter(page => {
    if (filterType === 'all') return true;
    if (filterType === 'content') return !page.blocks;
    if (filterType === 'builder') return !!page.blocks;
    return true;
  });

  // Statistics
  const stats = {
    total: pages.length,
    published: pages.filter(p => p.published).length,
    draft: pages.filter(p => !p.published).length,
    content: pages.filter(p => !p.blocks).length,
    builder: pages.filter(p => !!p.blocks).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold">Quản lý Trang</h1>
          <p className="text-sm text-muted-foreground">
            Quản lý trang content và visual builder
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/page-builder">
              <Palette className="mr-2 h-4 w-4" />
              Page Builder
            </Link>
          </Button>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Tạo content
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
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
            <span className="text-xs text-muted-foreground">Content</span>
          </div>
          <div className="text-2xl font-bold text-purple-600">{stats.content}</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Palette className="h-4 w-4 text-pink-600" />
            <span className="text-xs text-muted-foreground">Builder</span>
          </div>
          <div className="text-2xl font-bold text-pink-600">{stats.builder}</div>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b pb-2">
        <Button
          variant={filterType === 'all' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setFilterType('all')}
        >
          Tất cả ({stats.total})
        </Button>
        <Button
          variant={filterType === 'content' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setFilterType('content')}
        >
          <FileText className="mr-2 h-4 w-4" />
          Content ({stats.content})
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

      {/* Pages Grid */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      ) : filteredPages.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center space-y-4">
            {filterType === 'all' ? (
              <>
                <p className="text-muted-foreground">Chưa có trang nào</p>
                <div className="flex gap-2 justify-center">
                  <Button onClick={() => setIsCreateOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Tạo content
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/admin/page-builder">
                      <Palette className="mr-2 h-4 w-4" />
                      Page Builder
                    </Link>
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground">
                Không có trang {filterType === 'content' ? 'content' : 'builder'} nào
              </p>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPages.map((page) => {
            const isBuilderPage = !!page.blocks;
            const elementCount = isBuilderPage && page.blocks?.elements?.length || 0;

            return (
              <Card key={page.id} className="flex flex-col hover:shadow-lg transition-shadow">
                {/* Type Indicator & Preview */}
                {isBuilderPage ? (
                  <div className="h-32 bg-linear-to-br from-blue-50 to-purple-50 flex items-center justify-center border-b">
                    <div className="text-center">
                      <Palette className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-blue-600">{elementCount}</div>
                      <div className="text-xs text-gray-600">Elements</div>
                    </div>
                  </div>
                ) : (
                  <div className="h-32 bg-linear-to-br from-green-50 to-teal-50 flex items-center justify-center border-b">
                    <FileText className="h-12 w-12 text-green-600" />
                  </div>
                )}

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="line-clamp-1 text-base">{page.title}</CardTitle>
                      </div>
                      <CardDescription className="text-xs">/{page.slug}</CardDescription>
                    </div>
                    <Badge variant={page.published ? "default" : "secondary"} className="shrink-0">
                      {page.published ? "Live" : "Draft"}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col justify-between pt-0">
                  <div className="text-xs text-muted-foreground mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      {isBuilderPage ? (
                        <Badge variant="outline" className="text-xs">
                          <Palette className="h-3 w-3 mr-1" />
                          Builder
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          <FileText className="h-3 w-3 mr-1" />
                          Content
                        </Badge>
                      )}
                    </div>
                    <p>Cập nhật: {new Date(page.updatedAt).toLocaleDateString('vi-VN')}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {isBuilderPage ? (
                      <>
                        <Button variant="outline" size="sm" asChild className="flex-1">
                          <Link href={`/admin/page-builder/${page.id}`}>
                            <Edit2 className="h-3 w-3 mr-1" />
                            Edit Builder
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <Link href={`/pages/${page.slug}`} target="_blank">
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
                            setEditingPage(page);
                            setFormData({
                              title: page.title,
                              slug: page.slug,
                              content: page.content || '',
                              metaTitle: page.metaTitle || '',
                              metaDescription: page.metaDescription || '',
                              metaKeywords: page.metaKeywords || '',
                            });
                          }}
                        >
                          <Edit2 className="h-3 w-3 mr-1" />
                          Sửa
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTogglePublish(page.id, page.published)}
                        >
                          {page.published ? (
                            <Lock className="h-3 w-3" />
                          ) : (
                            <Eye className="h-3 w-3" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(page.id)}
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
      <Dialog open={isCreateOpen || !!editingPage} onOpenChange={(open) => {
        if (!open) {
          setIsCreateOpen(false);
          setEditingPage(null);
          resetForm();
        }
      }}>
        <DialogContent className="p-4">
          <DialogHeader>
            <DialogTitle>{editingPage ? 'Chỉnh sửa trang' : 'Tạo trang mới'}</DialogTitle>
            <DialogDescription>
              {editingPage ? 'Cập nhật thông tin trang' : 'Tạo một trang tĩnh mới'}
            </DialogDescription>
          </DialogHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="general">Thông tin chung</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-4 mt-4 grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="title">Tiêu đề</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ví dụ: Về chúng tôi"
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="Ví dụ: ve-chung-toi"
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="content">Nội dung</Label>
                <textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Nhập nội dung trang"
                  rows={4}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="seo" className="space-y-4 mt-4 grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                  placeholder="Tiêu đề trong tìm kiếm (max 60)"
                  maxLength={60}
                />
                <p className="text-xs text-muted-foreground mt-1">{formData.metaTitle.length}/60</p>
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
                <p className="text-xs text-muted-foreground mt-1">{formData.metaDescription.length}/160</p>
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
          <div className="flex gap-2 justify-end border-t pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateOpen(false);
                setEditingPage(null);
                resetForm();
              }}
            >
              Hủy
            </Button>
            <Button onClick={editingPage ? handleUpdate : handleCreate}>
              {editingPage ? 'Cập nhật' : 'Tạo'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
