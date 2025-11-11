'use client';

import React, { useEffect } from 'react';
import { useBuilderStore } from '@/lib/page-builder/store';
import { Canvas } from '@/components/page-builder/Canvas';
import { ComponentSidebar } from '@/components/page-builder/ComponentSidebar';
import { Inspector } from '@/components/page-builder/Inspector';
import { ResponsivePreview } from '@/components/page-builder/ResponsivePreview';
import { Button } from '@/components/ui/button';
import { Download, Eye, Save } from 'lucide-react';
import { exportToHTML, downloadHTML } from '@/lib/page-builder/export-html';
import { toast } from 'sonner';

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
 */
export function PageBuilderEditor({ pageId, initialData }: PageBuilderEditorProps) {
  const canvas = useBuilderStore((state) => state.canvas);
  const [showPreview, setShowPreview] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

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
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar trái - Components */}
      <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
        <ComponentSidebar />
      </div>

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">{initialData.title}</h1>
            <p className="text-sm text-gray-500">/{initialData.slug}</p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
            >
              <Eye className="w-4 h-4 mr-2" />
              {showPreview ? 'Edit' : 'Preview'}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
            >
              <Download className="w-4 h-4 mr-2" />
              Export HTML
            </Button>

            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Đang lưu...' : 'Lưu'}
            </Button>
          </div>
        </div>

        {/* Canvas hoặc Preview */}
        {showPreview ? (
          <div className="flex-1 overflow-auto bg-white">
            <ResponsivePreview />
          </div>
        ) : (
          <div className="flex-1">
            <Canvas />
          </div>
        )}

        {/* Status bar */}
        <div className="h-8 bg-gray-800 text-white text-xs flex items-center justify-between px-4">
          <span>Elements: {Array.isArray(canvas.elements) ? canvas.elements.length : 0}</span>
          <span>Selected: {Array.isArray(canvas.selectedIds) ? canvas.selectedIds.length : 0}</span>
          <span>Zoom: {Math.round(canvas.zoom * 100)}%</span>
          <span>Grid: {canvas.gridSize}px</span>
        </div>
      </div>

      {/* Sidebar phải - Inspector */}
      <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
        <Inspector />
      </div>
    </div>
  );
}
