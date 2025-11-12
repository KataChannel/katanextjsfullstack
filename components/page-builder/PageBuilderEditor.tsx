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
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Mobile Left Sidebar Overlay */}
      {showLeftSidebar && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setShowLeftSidebar(false)}
        >
          <div 
            className="w-80 h-full bg-white shadow-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-600" />
                <h2 className="font-semibold text-gray-900">Thành Phần</h2>
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
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setShowRightSidebar(false)}
        >
          <div 
            className="ml-auto w-80 h-full bg-white shadow-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-purple-600" />
                <h2 className="font-semibold text-gray-900">Thuộc Tính</h2>
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
      <div className="hidden lg:block w-64 bg-white border-r border-gray-200 overflow-y-auto shadow-sm">
        <div className="sticky top-0 bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border-b border-gray-200 p-4 z-10">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            <h2 className="font-semibold text-gray-900">Thành Phần</h2>
          </div>
        </div>
        <ComponentSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Toolbar */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          {/* Header Row */}
          <div className="flex items-center justify-between px-3 md:px-6 py-3">
            {/* Left: Back + Title */}
            <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
              <Link href="/admin/pages-management">
                <Button variant="ghost" size="icon" className="shrink-0">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              
              <div className="min-w-0 flex-1">
                <h1 className="text-sm md:text-lg font-semibold text-gray-900 truncate">
                  {initialData.title}
                </h1>
                <p className="text-xs md:text-sm text-gray-500 truncate">
                  /{initialData.slug}
                </p>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-1 md:gap-2 shrink-0">
              {/* Mobile Sidebars Toggle */}
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden"
                onClick={() => setShowLeftSidebar(true)}
              >
                <Layers className="w-4 h-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="lg:hidden"
                onClick={() => setShowRightSidebar(true)}
              >
                <Settings2 className="w-4 h-4" />
              </Button>

              {/* Preview Toggle */}
              <Button
                variant={showPreview ? "default" : "outline"}
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                className="hidden md:flex"
              >
                <Eye className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">
                  {showPreview ? 'Chỉnh Sửa' : 'Xem Trước'}
                </span>
              </Button>

              <Button
                variant={showPreview ? "default" : "outline"}
                size="icon"
                onClick={() => setShowPreview(!showPreview)}
                className="md:hidden"
              >
                <Eye className="w-4 h-4" />
              </Button>

              {/* Export */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="hidden sm:flex"
              >
                <Download className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">Export</span>
              </Button>

              {/* Save */}
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
                className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-700"
              >
                <Save className="w-4 h-4 md:mr-2" />
                <span className="hidden sm:inline">
                  {isSaving ? 'Đang lưu...' : 'Lưu'}
                </span>
              </Button>
            </div>
          </div>

          {/* Preview Mode Selector (when preview is active) */}
          {showPreview && (
            <div className="flex items-center justify-center gap-2 px-3 md:px-6 pb-3 border-t border-gray-100">
              <Button
                variant={previewMode === 'mobile' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPreviewMode('mobile')}
              >
                <Smartphone className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">Mobile</span>
              </Button>
              <Button
                variant={previewMode === 'tablet' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPreviewMode('tablet')}
              >
                <Tablet className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">Tablet</span>
              </Button>
              <Button
                variant={previewMode === 'desktop' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPreviewMode('desktop')}
              >
                <Monitor className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">Desktop</span>
              </Button>
            </div>
          )}
        </div>

        {/* Canvas hoặc Preview */}
        {showPreview ? (
          <div className="flex-1 overflow-auto bg-gray-100 p-2 md:p-6">
            <div 
              className={cn(
                "mx-auto bg-white shadow-xl rounded-lg overflow-hidden transition-all duration-300",
                previewMode === 'mobile' && "max-w-sm",
                previewMode === 'tablet' && "max-w-3xl",
                previewMode === 'desktop' && "max-w-7xl"
              )}
            >
              <ResponsivePreview />
            </div>
          </div>
        ) : (
          <div className="flex-1 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100">
            <Canvas />
          </div>
        )}

        {/* Bottom Status Bar */}
        <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 text-white text-xs flex items-center justify-between px-3 md:px-6 py-2 shadow-lg">
          <div className="flex items-center gap-3 md:gap-6">
            <span className="flex items-center gap-1">
              <span className="font-semibold">Elements:</span>
              <span className="text-blue-300">{Array.isArray(canvas.elements) ? canvas.elements.length : 0}</span>
            </span>
            <span className="hidden sm:flex items-center gap-1">
              <span className="font-semibold">Selected:</span>
              <span className="text-purple-300">{Array.isArray(canvas.selectedIds) ? canvas.selectedIds.length : 0}</span>
            </span>
          </div>
          <div className="flex items-center gap-3 md:gap-6">
            <span className="hidden md:flex items-center gap-1">
              <span className="font-semibold">Zoom:</span>
              <span className="text-green-300">{Math.round(canvas.zoom * 100)}%</span>
            </span>
            <span className="hidden sm:flex items-center gap-1">
              <span className="font-semibold">Grid:</span>
              <span className="text-yellow-300">{canvas.gridSize}px</span>
            </span>
          </div>
        </div>
      </div>

      {/* Desktop Right Sidebar */}
      <div className="hidden lg:block w-80 bg-white border-l border-gray-200 overflow-y-auto shadow-sm">
        <div className="sticky top-0 bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 border-b border-gray-200 p-4 z-10">
          <div className="flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-purple-600" />
            <h2 className="font-semibold text-gray-900">Thuộc Tính</h2>
          </div>
        </div>
        <Inspector />
      </div>
    </div>
  );
}
