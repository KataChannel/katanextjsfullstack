"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, Plus, Edit2, Trash2, Eye, Lock } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

interface Page {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function PagesManagementPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [formData, setFormData] = useState({ title: '', slug: '' });

  useEffect(() => {
    fetchPages();
  }, []);

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
        setFormData({ title: '', slug: '' });
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
        setFormData({ title: '', slug: '' });
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

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/admin">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-2xl sm:text-3xl font-bold">Quản lý Trang</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Quản lý các trang tĩnh của website (Trang chủ, Về chúng tôi, Dịch vụ, Liên hệ)
          </p>
        </div>
        <Button asChild>
          <button onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Tạo trang mới
          </button>
        </Button>
      </div>

      {/* Pages Grid */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      ) : pages.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center space-y-4">
            <p className="text-muted-foreground">Chưa có trang nào</p>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Tạo trang đầu tiên
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pages.map((page) => (
            <Card key={page.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="line-clamp-2">{page.title}</CardTitle>
                    <CardDescription className="text-xs mt-1">/{page.slug}</CardDescription>
                  </div>
                  <Badge variant={page.published ? "default" : "secondary"}>
                    {page.published ? "Live" : "Draft"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <div className="text-xs text-muted-foreground space-y-1 mb-4">
                  <p>Cập nhật: {new Date(page.updatedAt).toLocaleDateString('vi-VN')}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingPage(page);
                      setFormData({ title: page.title, slug: page.slug });
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
                      <>
                        <Lock className="h-3 w-3 mr-1" />
                        Ẩn
                      </>
                    ) : (
                      <>
                        <Eye className="h-3 w-3 mr-1" />
                        Hiển thị
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(page.id)}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Xóa
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isCreateOpen || !!editingPage} onOpenChange={(open) => {
        if (!open) {
          setIsCreateOpen(false);
          setEditingPage(null);
          setFormData({ title: '', slug: '' });
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingPage ? 'Chỉnh sửa trang' : 'Tạo trang mới'}</DialogTitle>
            <DialogDescription>
              {editingPage ? 'Cập nhật thông tin trang' : 'Tạo một trang tĩnh mới'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 p-4">
            <div>
              <Label htmlFor="title">Tiêu đề</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ví dụ: Về chúng tôi"
              />
            </div>
            <div>
              <Label htmlFor="slug">URL Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="Ví dụ: ve-chung-toi"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateOpen(false);
                  setEditingPage(null);
                  setFormData({ title: '', slug: '' });
                }}
              >
                Hủy
              </Button>
              <Button onClick={editingPage ? handleUpdate : handleCreate}>
                {editingPage ? 'Cập nhật' : 'Tạo'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
