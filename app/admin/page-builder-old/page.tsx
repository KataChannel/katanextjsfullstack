'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Eye, FileCode } from 'lucide-react';
import { Canvas } from '@/components/page-builder/Canvas';
import { ComponentSidebar } from '@/components/page-builder/ComponentSidebar';
import { Inspector } from '@/components/page-builder/Inspector';
import { ResponsivePreview } from '@/components/page-builder/ResponsivePreview';
import { useBuilderStore } from '@/lib/page-builder/store';
import { exportToHTML, downloadHTML } from '@/lib/page-builder/export-html';
import { toast } from 'sonner';

/**
 * ULTRA BUILDER MVP
 * Page Builder với Konva + Yoga + Framer Motion
 * Mobile First + Responsive + PWA
 */
export default function PageBuilderPage() {
  const [showPreview, setShowPreview] = useState(false);
  const canvas = useBuilderStore((state) => state.canvas);

  const handleExport = () => {
    try {
      const html = exportToHTML(canvas.elements);
      downloadHTML(html, 'page-builder-export.html');
      toast.success('Export HTML thành công!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Lỗi khi export HTML');
    }
  };

  const handlePreview = () => {
    setShowPreview(!showPreview);
  };

  return (
    <div className="h-screen w-full flex flex-col bg-gray-100">
      {/* Header Toolbar */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-gray-900">Ultra Builder MVP</h1>
          <div className="h-6 w-px bg-gray-300" />
          <span className="text-sm text-gray-600">
            {Object.keys(canvas.elements).length} elements
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreview}
            className="flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            {showPreview ? 'Editor' : 'Preview'}
          </Button>
          
          <Button
            variant="default"
            size="sm"
            onClick={handleExport}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Download className="w-4 h-4" />
            Export HTML
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {showPreview ? (
          // Preview Mode - Full width
          <div className="flex-1">
            <ResponsivePreview />
          </div>
        ) : (
          // Editor Mode - 3 columns layout
          <>
            {/* Left Sidebar - Component Palette */}
            <aside className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
              <ComponentSidebar />
            </aside>

            {/* Center - Canvas */}
            <main className="flex-1 overflow-hidden relative">
              <Canvas />
            </main>

            {/* Right Sidebar - Inspector */}
            <aside className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
              <Inspector />
            </aside>
          </>
        )}
      </div>

      {/* Footer Status Bar */}
      <footer className="bg-white border-t border-gray-200 px-4 py-2 flex items-center justify-between text-xs text-gray-600">
        <div className="flex items-center gap-4">
          <span>Grid: {canvas.snapToGrid ? 'ON' : 'OFF'} ({canvas.gridSize}px)</span>
          <span>Zoom: {Math.round(canvas.zoom * 100)}%</span>
          <span>Breakpoint: {canvas.currentBreakpoint}</span>
        </div>
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4" />
          <span>Tech: React 19 + TypeScript + Konva + Yoga + Tailwind</span>
        </div>
      </footer>
    </div>
  );
}
