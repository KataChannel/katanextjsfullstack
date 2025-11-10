'use client';

import { useState } from 'react';
import { PageBuilder, PageBlock } from '@/components/page-builder';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Eye } from 'lucide-react';

export default function PageBuilderPage() {
  const [pageTitle, setPageTitle] = useState('');
  const [pageSlug, setPageSlug] = useState('');
  const [blocks, setBlocks] = useState<PageBlock[]>([]);
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');

  const handleSave = async () => {
    const pageData = {
      title: pageTitle,
      slug: pageSlug,
      blocks: JSON.stringify(blocks),
      metaTitle,
      metaDescription,
    };

    console.log('Saving page:', pageData);
    // TODO: Implement API call to save page
    alert('Tính năng lưu trang đang được phát triển');
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Trình tạo trang</h1>
          <p className="text-muted-foreground">Tạo và chỉnh sửa trang web với page builder</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Eye className="mr-2 h-4 w-4" />
            Xem trước
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Lưu trang
          </Button>
        </div>
      </div>

      <Tabs defaultValue="content" className="space-y-4">
        <TabsList>
          <TabsTrigger value="content">Nội dung</TabsTrigger>
          <TabsTrigger value="settings">Cài đặt</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cơ bản</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Tiêu đề trang</Label>
                <Input
                  id="title"
                  value={pageTitle}
                  onChange={(e) => setPageTitle(e.target.value)}
                  placeholder="Nhập tiêu đề trang..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Đường dẫn (slug)</Label>
                <Input
                  id="slug"
                  value={pageSlug}
                  onChange={(e) => setPageSlug(e.target.value)}
                  placeholder="vi-du-duong-dan"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Nội dung trang</CardTitle>
              <CardDescription>
                Kéo thả và sắp xếp các khối nội dung để xây dựng trang web
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PageBuilder initialBlocks={blocks} onChange={setBlocks} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt trang</CardTitle>
              <CardDescription>Cấu hình các tùy chọn hiển thị và hành vi</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Các tùy chọn cài đặt sẽ được bổ sung sau
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tối ưu SEO</CardTitle>
              <CardDescription>Tối ưu hóa trang web cho công cụ tìm kiếm</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="Tiêu đề SEO (50-60 ký tự)"
                  maxLength={60}
                />
                <p className="text-xs text-muted-foreground">
                  {metaTitle.length}/60 ký tự
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <textarea
                  id="metaDescription"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Mô tả SEO (150-160 ký tự)"
                  maxLength={160}
                  className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  {metaDescription.length}/160 ký tự
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
