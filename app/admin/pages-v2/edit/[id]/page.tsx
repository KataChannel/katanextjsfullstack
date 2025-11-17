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
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading page...</p>
        </div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Page not found</h2>
          <Link href="/admin/pages-v2">
            <Button>Back to Pages</Button>
          </Link>
        </div>
      </div>
    );
  }

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
            <h1 className="font-semibold text-gray-900">{title}</h1>
            <p className="text-xs text-gray-500">/{slug}</p>
          </div>
          <Badge variant={published ? 'default' : 'secondary'}>
            {published ? 'Published' : 'Draft'}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSettingsDialog(true)}
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          
          <Link href={published ? `/${slug}` : `/${slug}?preview=true`} target="_blank">
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              {published ? 'View Live' : 'Preview'}
            </Button>
          </Link>
          
          <Button
            variant={published ? 'outline' : 'default'}
            size="sm"
            onClick={handlePublishToggle}
          >
            {published ? 'Unpublish' : 'Publish'}
          </Button>
        </div>
      </div>

      {/* Block Editor */}
      <BlockEditor
        pageId={id}
        initialBlocks={currentBlocks}
        onSave={handleSaveClick}
      />

      {/* Settings Dialog */}
      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Page Settings</DialogTitle>
            <DialogDescription>
              Update page metadata and SEO settings
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Page Title</Label>
                <Input
                  id="edit-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-slug">URL Slug</Label>
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
                placeholder="Leave empty to use page title"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="meta-description">Meta Description (SEO)</Label>
              <Input
                id="meta-description"
                placeholder="Brief description for search engines"
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowSettingsDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleSave();
                setShowSettingsDialog(false);
              }}
              disabled={saving}
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
