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
    <>
      {/* Header */}
      <div className="h-14 bg-white border-b border-gray-200 flex items-center px-4 justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/pages-v2">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="font-semibold text-gray-900">New Page</h1>
            <p className="text-xs text-gray-500">Block Editor V2</p>
          </div>
        </div>
      </div>

      {/* Block Editor */}
      <BlockEditor onSave={handleSaveClick} />

      {/* Save Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save New Page</DialogTitle>
            <DialogDescription>
              Enter page details to save as draft
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Page Title</Label>
              <Input
                id="title"
                placeholder="My Awesome Page"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug</Label>
              <Input
                id="slug"
                placeholder="my-awesome-page"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Page will be available at: /{slug}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowSaveDialog(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save as Draft'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
