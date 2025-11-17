'use client';

/**
 * Admin: Create new page with Block Editor
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BlockEditor } from '@/components/block-editor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { Block } from '@/lib/blocks/types';

export default function NewPageV2() {
  const router = useRouter();
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [saving, setSaving] = useState(false);
  const [currentBlocks, setCurrentBlocks] = useState<Block[]>([]);

  const handleSaveClick = (blocks: Block[]) => {
    setCurrentBlocks(blocks);
    setShowSaveDialog(true);
  };

  const handleSave = async () => {
    if (!title || !slug) {
      toast.error('Please enter title and slug');
      return;
    }

    setSaving(true);

    try {
      const response = await fetch('/api/pages-v2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          blocksV2: { version: 2, blocks: currentBlocks },
          published: false,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create page');
      }

      const page = await response.json();
      toast.success('Page created successfully!');
      router.push(`/admin/pages-v2/edit/${page.id}`);
    } catch (error: any) {
      toast.error(error.message);
      setSaving(false);
    }
  };

  // Auto-generate slug from title
  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slug) {
      const autoSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setSlug(autoSlug);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header - Sticky */}
      <div className="h-14 bg-background border-b flex items-center px-4 justify-between shrink-0">
        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/admin/pages-v2">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Quay lại</span>
            </Button>
          </Link>
          <div>
            <h1 className="text-sm sm:text-base font-semibold">Tạo trang mới</h1>
            <p className="text-xs text-muted-foreground hidden sm:block">Block Editor V2</p>
          </div>
        </div>
        </div>

      {/* Block Editor - Fullscreen */}
      <div className="flex-1 overflow-hidden">
        <BlockEditor onSave={handleSaveClick} />
      </div>      {/* Save Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader className="border-b pb-4">
            <DialogTitle>Lưu trang mới</DialogTitle>
            <DialogDescription>
              Nhập thông tin trang để lưu dưới dạng bản nháp
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Tiêu đề trang *</Label>
              <Input
                id="title"
                placeholder="Trang tuyệt vời của tôi"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug *</Label>
              <Input
                id="slug"
                placeholder="trang-tuyet-voi-cua-toi"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Trang sẽ có URL: /{slug}
              </p>
            </div>
          </div>

          <DialogFooter className="border-t pt-4">
            <Button
              variant="outline"
              onClick={() => setShowSaveDialog(false)}
              disabled={saving}
            >
              Hủy
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Đang lưu...' : 'Lưu bản nháp'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
