'use client';

import React, { useEffect, useState } from 'react';
import { useBuilderStore } from '@/lib/page-builder/store';
import { Canvas } from '@/components/page-builder/Canvas';
import { ComponentSidebar } from '@/components/page-builder/ComponentSidebar';
import { Inspector } from '@/components/page-builder/Inspector';
import { ResponsivePreview } from '@/components/page-builder/ResponsivePreview';
import { Button } from '@/components/ui/button';
import { Download, Eye, Save, Menu, X, Layers, Settings2, ArrowLeft, Smartphone, Tablet, Monitor } from 'lucide-react';
import { exportToHTML, downloadHTML } from '@/lib/page-builder/export-html';
import { toast } from 'sonner';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface PageBuilderEditorProps {
  pageId: string;
  initialData: {
    title: string;
    slug: string;
    blocks: any;
  };
}

/**
 * Page Builder Editor Component
 * Load và edit page từ database
 * Mobile First + Responsive Design
 */
export function PageBuilderEditor({ pageId, initialData }: PageBuilderEditorProps) {
  const canvas = useBuilderStore((state) => state.canvas);
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showLeftSidebar, setShowLeftSidebar] = useState(false);
  const [showRightSidebar, setShowRightSidebar] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Load data từ database vào store
  useEffect(() => {
    if (initialData.blocks) {
      // Load canvas state
      if (initialData.blocks.canvas) {
        const { setZoom, setGridSize, toggleSnapToGrid, toggleShowGrid, toggleMagneticAlignment } = useBuilderStore.getState();
        const canvasData = initialData.blocks.canvas;
        
        setZoom(canvasData.zoom || 1);
        if (canvasData.gridSize) setGridSize(canvasData.gridSize);
        
        // Set booleans
        if (canvasData.snapToGrid !== canvas.snapToGrid) toggleSnapToGrid();
        if (canvasData.showGrid !== canvas.showGrid) toggleShowGrid();
        if (canvasData.magneticAlignment !== canvas.magneticAlignment) toggleMagneticAlignment();
      }

      // Load elements
      if (initialData.blocks.elements) {
        const { canvas: currentCanvas } = useBuilderStore.getState();
        useBuilderStore.setState({
          canvas: {
            ...currentCanvas,
            elements: initialData.blocks.elements,
          },
        });
      }
    }
  }, [pageId]);

  // Save page to database
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const state = useBuilderStore.getState();
      const blocks = {
        canvas: state.canvas,
        elements: state.canvas.elements,
        history: {
          past: [],
          future: [],
        },
      };

      const response = await fetch(`/api/pages/${pageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          blocks,
        }),
      });

      if (!response.ok) throw new Error('Failed to save');

      toast.success('✅ Đã lưu page thành công!');
    } catch (error) {
      console.error('Save error:', error);
      toast.error('❌ Lỗi khi lưu page');
    } finally {
      setIsSaving(false);
    }
  };

  // Export HTML
  const handleExport = () => {
    const html = exportToHTML(canvas.elements);
    downloadHTML(html, `${initialData.slug}.html`);
    toast.success('✅ Đã export HTML thành công!');
  };

  return (
    <div className="flex h-screen w-screen fixed inset-0 bg-background overflow-hidden">
      {/* Mobile Left Sidebar Overlay */}
      {showLeftSidebar && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
          onClick={() => setShowLeftSidebar(false)}
        >
          <div 
            className="w-full max-w-sm h-full bg-background shadow-2xl overflow-y-auto border-r"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-background border-b p-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-primary" />
                <h2 className="font-semibold">Thành Phần</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowLeftSidebar(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <ComponentSidebar />
          </div>
        </div>
      )}

      {/* Mobile Right Sidebar Overlay */}
      {showRightSidebar && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
          onClick={() => setShowRightSidebar(false)}
        >
          <div 
            className="ml-auto w-full max-w-sm h-full bg-background shadow-2xl overflow-y-auto border-l"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-background border-b p-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-primary" />
                <h2 className="font-semibold">Thuộc Tính</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowRightSidebar(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <Inspector />
          </div>
        </div>
      )}

      {/* Desktop Left Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 xl:w-80 bg-background border-r overflow-hidden">
        <div className="border-b p-4 bg-muted/50">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary" />
            <h2 className="font-semibold">Thành Phần</h2>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <ComponentSidebar />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header Toolbar */}
        <header className="border-b bg-background shrink-0">
          {/* Top Row */}
          <div className="flex items-center justify-between px-3 md:px-4 lg:px-6 py-3">
            {/* Left: Navigation + Title */}
            <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
              <Link href="/admin/content">
                <Button variant="ghost" size="icon" className="shrink-0">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              
              <div className="min-w-0 flex-1">
                <h1 className="text-sm md:text-base lg:text-lg font-semibold truncate">
                  {initialData.title}
                </h1>
                <p className="text-xs text-muted-foreground truncate">
                  /{initialData.slug}
                </p>
              </div>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-1 md:gap-2 shrink-0">
              {/* Mobile: Sidebars Toggle */}
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden"
                onClick={() => setShowLeftSidebar(true)}
                title="Thành phần"
              >
                <Layers className="w-4 h-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="lg:hidden"
                onClick={() => setShowRightSidebar(true)}
                title="Thuộc tính"
              >
                <Settings2 className="w-4 h-4" />
              </Button>

              {/* Preview Toggle */}
              <Button
                variant={showPreview ? "default" : "outline"}
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                className="hidden sm:flex"
              >
                <Eye className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">
                  {showPreview ? 'Chỉnh sửa' : 'Xem trước'}
                </span>
              </Button>

              <Button
                variant={showPreview ? "default" : "outline"}
                size="icon"
                onClick={() => setShowPreview(!showPreview)}
                className="sm:hidden"
                title={showPreview ? 'Chỉnh sửa' : 'Xem trước'}
              >
                <Eye className="w-4 h-4" />
              </Button>

              {/* Export */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="hidden md:flex"
              >
                <Download className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">Export</span>
              </Button>

              {/* Save */}
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
              >
                <Save className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">
                  {isSaving ? 'Đang lưu...' : 'Lưu'}
                </span>
              </Button>
            </div>
          </div>

          {/* Preview Mode Selector */}
          {showPreview && (
            <div className="flex items-center justify-center gap-2 px-3 md:px-4 lg:px-6 pb-3 pt-2 border-t">
              <Button
                variant={previewMode === 'mobile' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPreviewMode('mobile')}
              >
                <Smartphone className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Mobile</span>
              </Button>
              <Button
                variant={previewMode === 'tablet' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPreviewMode('tablet')}
              >
                <Tablet className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Tablet</span>
              </Button>
              <Button
                variant={previewMode === 'desktop' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPreviewMode('desktop')}
              >
                <Monitor className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Desktop</span>
              </Button>
            </div>
          )}
        </header>

        {/* Canvas / Preview Area */}
        <div className="flex-1 overflow-hidden">
          {showPreview ? (
            <div className="h-full overflow-auto bg-muted/30 p-2 md:p-4 lg:p-6">
              <div 
                className={cn(
                  "mx-auto bg-background shadow-xl rounded-lg overflow-hidden transition-all duration-300",
                  previewMode === 'mobile' && "max-w-sm",
                  previewMode === 'tablet' && "max-w-3xl",
                  previewMode === 'desktop' && "max-w-full"
                )}
              >
                <ResponsivePreview />
              </div>
            </div>
          ) : (
            <div className="h-full bg-muted/20">
              <Canvas />
            </div>
          )}
        </div>

        {/* Status Bar */}
        <footer className="bg-muted border-t text-xs flex items-center justify-between px-3 md:px-4 lg:px-6 py-2 shrink-0">
          <div className="flex items-center gap-3 md:gap-4 lg:gap-6">
            <span className="flex items-center gap-1.5">
              <span className="font-medium text-muted-foreground">Elements:</span>
              <span className="font-semibold text-primary">{Array.isArray(canvas.elements) ? canvas.elements.length : 0}</span>
            </span>
            <span className="hidden sm:flex items-center gap-1.5">
              <span className="font-medium text-muted-foreground">Selected:</span>
              <span className="font-semibold text-primary">{Array.isArray(canvas.selectedIds) ? canvas.selectedIds.length : 0}</span>
            </span>
          </div>
          <div className="flex items-center gap-3 md:gap-4 lg:gap-6">
            <span className="hidden md:flex items-center gap-1.5">
              <span className="font-medium text-muted-foreground">Zoom:</span>
              <span className="font-semibold text-primary">{Math.round(canvas.zoom * 100)}%</span>
            </span>
            <span className="hidden sm:flex items-center gap-1.5">
              <span className="font-medium text-muted-foreground">Grid:</span>
              <span className="font-semibold text-primary">{canvas.gridSize}px</span>
            </span>
          </div>
        </footer>
      </main>

      {/* Desktop Right Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 xl:w-80 bg-background border-l overflow-hidden">
        <div className="border-b p-4 bg-muted/50">
          <div className="flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-primary" />
            <h2 className="font-semibold">Thuộc Tính</h2>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <Inspector />
        </div>
      </aside>
    </div>
  );
}
