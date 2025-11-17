'use client';

/**
 * Admin: Edit page with Block Editor
 */

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { BlockEditor } from '@/components/block-editor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { ArrowLeft, Save, Eye, Settings } from 'lucide-react';
import Link from 'next/link';
import type { Block } from '@/lib/blocks/types';

interface PageData {
  id: string;
  title: string;
  slug: string;
  blocksV2: any;
  published: boolean;
  metaTitle?: string;
  metaDescription?: string;
}

export default function EditPageV2({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params); // Unwrap params Promise
  
  const [page, setPage] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Form data
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [published, setPublished] = useState(false);
  
  const [currentBlocks, setCurrentBlocks] = useState<Block[]>([]);

  // Load page data
  useEffect(() => {
    async function loadPage() {
      try {
        const response = await fetch(`/api/pages-v2/${id}`);
        if (!response.ok) throw new Error('Failed to load page');
        
        const data = await response.json();
        setPage(data);
        setTitle(data.title);
        setSlug(data.slug);
        setMetaTitle(data.metaTitle || '');
        setMetaDescription(data.metaDescription || '');
        setPublished(data.published);
        
        // Load blocks
        if (data.blocksV2?.blocks) {
          setCurrentBlocks(data.blocksV2.blocks);
        }
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }
    
    loadPage();
  }, [id]);

  const handleSaveClick = (blocks: Block[]) => {
    setCurrentBlocks(blocks);
    handleSave(blocks);
  };

  const handleSave = async (blocks?: Block[]) => {
    setSaving(true);

    try {
      const response = await fetch(`/api/pages-v2/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          metaTitle,
          metaDescription,
          blocksV2: { version: 2, blocks: blocks || currentBlocks },
          published,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save page');
      }

      toast.success('Page saved successfully!');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePublishToggle = async () => {
    const newPublished = !published;
    setPublished(newPublished);
    
    try {
      const response = await fetch(`/api/pages-v2/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          blocksV2: { version: 2, blocks: currentBlocks },
          published: newPublished,
        }),
      });

      if (!response.ok) throw new Error('Failed to update publish status');
      
      toast.success(newPublished ? 'Page published!' : 'Page unpublished');
    } catch (error: any) {
      toast.error(error.message);
      setPublished(!newPublished); // Revert on error
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải trang...</p>
        </div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Không tìm thấy trang</h2>
          <Link href="/admin/pages-v2">
            <Button>Quay lại danh sách</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header - Sticky */}
      <div className="h-14 bg-background border-b flex items-center px-4 justify-between shrink-0">
        <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
          <Link href="/admin/pages-v2">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Quay lại</span>
            </Button>
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm sm:text-base font-semibold truncate">{title}</h1>
            <p className="text-xs text-muted-foreground truncate hidden sm:block">/{slug}</p>
          </div>
          <Badge variant={published ? 'default' : 'secondary'} className="shrink-0">
            {published ? 'Đã xuất bản' : 'Bản nháp'}
          </Badge>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 shrink-0 ml-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSettingsDialog(true)}
          >
            <Settings className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Cài đặt</span>
          </Button>
          
          <Link href={published ? `/${slug}` : `/${slug}?preview=true`} target="_blank">
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">{published ? 'Xem live' : 'Xem trước'}</span>
            </Button>
          </Link>
          
          <Button
            variant={published ? 'outline' : 'default'}
            size="sm"
            onClick={handlePublishToggle}
          >
            {published ? 'Ẩn' : 'Xuất bản'}
          </Button>
        </div>
      </div>

      {/* Block Editor - Fullscreen */}
      <div className="flex-1 overflow-hidden">
        <BlockEditor
          pageId={id}
          initialBlocks={currentBlocks}
          onSave={handleSaveClick}
        />
      </div>

      {/* Settings Dialog - Mobile First with Scrollable Content */}
      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader className="border-b pb-4">
            <DialogTitle>Cài đặt trang</DialogTitle>
            <DialogDescription>
              Cập nhật metadata và SEO cho trang
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Tiêu đề trang *</Label>
                <Input
                  id="edit-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-slug">URL Slug *</Label>
                <Input
                  id="edit-slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meta-title">Meta Title (SEO)</Label>
              <Input
                id="meta-title"
                placeholder="Để trống để sử dụng tiêu đề trang"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="meta-description">Meta Description (SEO)</Label>
              <Input
                id="meta-description"
                placeholder="Mô tả ngắn gọn cho công cụ tìm kiếm"
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="border-t pt-4">
            <Button
              variant="outline"
              onClick={() => setShowSettingsDialog(false)}
            >
              Hủy
            </Button>
            <Button
              onClick={() => {
                handleSave();
                setShowSettingsDialog(false);
              }}
              disabled={saving}
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Đang lưu...' : 'Lưu cài đặt'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
