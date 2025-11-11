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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Post {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  author: { name: string | null; email: string };
  content?: string;
  excerpt?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  createdAt: string;
  updatedAt: string;
}

export default function PostsManagementPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
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

  useEffect(() => {
    fetchPosts();
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

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts');
      const data = await res.json();
      if (data.success && data.data) {
        setPosts(Array.isArray(data.data) ? data.data : []);
      } else if (Array.isArray(data)) {
        setPosts(data);
      } else {
        setPosts([]);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        await fetchPosts();
        setIsCreateOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleUpdate = async () => {
    if (!editingPost) return;
    try {
      const res = await fetch(`/api/posts/${editingPost.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editingPost, ...formData }),
      });
      if (res.ok) {
        await fetchPosts();
        setEditingPost(null);
        resetForm();
      }
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn chắc chắn muốn xóa bài viết này?')) return;
    try {
      const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchPosts();
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleTogglePublish = async (id: string, published: boolean) => {
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !published }),
      });
      if (res.ok) {
        await fetchPosts();
      }
    } catch (error) {
      console.error('Error updating post:', error);
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
            <h1 className="text-2xl sm:text-3xl font-bold">Quản lý Bài viết</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Quản lý các bài viết blog của website
          </p>
        </div>
        <Button asChild>
          <button onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Tạo bài viết
          </button>
        </Button>
      </div>

      {/* Posts Grid */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      ) : posts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center space-y-4">
            <p className="text-muted-foreground">Chưa có bài viết nào</p>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Tạo bài viết đầu tiên
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...posts].map((post) => (
            <Card key={post.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                    <CardDescription className="text-xs mt-1">/{post.slug}</CardDescription>
                  </div>
                  <Badge variant={post.published ? "default" : "secondary"}>
                    {post.published ? "Live" : "Draft"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <div className="text-xs text-muted-foreground space-y-1 mb-4">
                  <p>Tác giả: {post.author.name || post.author.email}</p>
                  <p>Cập nhật: {new Date(post.updatedAt).toLocaleDateString('vi-VN')}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingPost(post);
                      setFormData({
                        title: post.title,
                        slug: post.slug,
                        content: post.content || '',
                        excerpt: post.excerpt || '',
                        metaTitle: post.metaTitle || '',
                        metaDescription: post.metaDescription || '',
                        metaKeywords: post.metaKeywords || '',
                      });
                    }}
                  >
                    <Edit2 className="h-3 w-3 mr-1" />
                    Sửa
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTogglePublish(post.id, post.published)}
                  >
                    {post.published ? (
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
                    onClick={() => handleDelete(post.id)}
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
      <Dialog open={isCreateOpen || !!editingPost} onOpenChange={(open) => {
        if (!open) {
          setIsCreateOpen(false);
          setEditingPost(null);
          resetForm();
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingPost ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}</DialogTitle>
            <DialogDescription>
              {editingPost ? 'Cập nhật thông tin bài viết' : 'Tạo một bài viết blog mới'}
            </DialogDescription>
          </DialogHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="general">Thông tin chung</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-4 mt-4">
              <div>
                <Label htmlFor="title">Tiêu đề</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ví dụ: Top 10 Xu Hướng Làm Đẹp 2025"
                />
              </div>
              <div>
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="Ví dụ: top-10-xu-huong-lam-dep-2025"
                />
              </div>
              <div>
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
              <div>
                <Label htmlFor="content">Nội dung</Label>
                <textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Nội dung bài viết"
                  rows={4}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="seo" className="space-y-4 mt-4">
              <div>
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
              <div>
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
              <div>
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
                setEditingPost(null);
                resetForm();
              }}
            >
              Hủy
            </Button>
            <Button onClick={editingPost ? handleUpdate : handleCreate}>
              {editingPost ? 'Cập nhật' : 'Tạo'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
