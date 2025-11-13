'use client';

import React, { useEffect, useState } from 'react';
import { useBuilderStore } from '@/lib/page-builder/store';
import { Canvas } from '@/components/page-builder/Canvas';
import { ComponentSidebar } from '@/components/page-builder/ComponentSidebar';
import { Inspector } from '@/components/page-builder/Inspector';
import { ResponsivePreview } from '@/components/page-builder/ResponsivePreview';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Download, Eye, Save, Menu, X, Layers, Settings2, ArrowLeft, Smartphone, Tablet, Monitor, Globe, Blocks } from 'lucide-react';
import { exportToHTML, downloadHTML } from '@/lib/page-builder/export-html';
import { toast } from 'sonner';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Combobox } from '@/components/ui/combobox';

interface PageBuilderEditorProps {
  pageId: string;
  initialData: {
    title: string;
    slug: string;
    blocks: any;
    published: boolean;
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
  const [published, setPublished] = useState(initialData.published);
  const [showSaveTemplateDialog, setShowSaveTemplateDialog] = useState(false);
  const [existingTemplates, setExistingTemplates] = useState<any[]>([]);
  const [selectedExistingTemplate, setSelectedExistingTemplate] = useState<string>('');
  const [templateData, setTemplateData] = useState({
    name: '',
    description: '',
    category: 'general',
  });

  const CATEGORIES = [
    { value: 'general', label: 'Chung' },
    { value: 'hero', label: 'Hero Section' },
    { value: 'content', label: 'Nội dung' },
    { value: 'cta', label: 'Call to Action' },
    { value: 'testimonial', label: 'Đánh giá' },
    { value: 'pricing', label: 'Bảng giá' },
    { value: 'footer', label: 'Footer' },
  ];

  // Load existing templates khi mở dialog
  useEffect(() => {
    if (showSaveTemplateDialog) {
      fetchExistingTemplates();
    }
  }, [showSaveTemplateDialog]);

  const fetchExistingTemplates = async () => {
    try {
      const res = await fetch('/api/admin/block-templates');
      if (res.ok) {
        const data = await res.json();
        setExistingTemplates(data);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  // Load data từ database vào store
  useEffect(() => {
    console.log('📂 Loading Page Builder data:', {
      pageId,
      hasBlocks: !!initialData.blocks,
      blocksKeys: initialData.blocks ? Object.keys(initialData.blocks) : [],
    });
    
    if (initialData.blocks) {
      // Load canvas state
      if (initialData.blocks.canvas) {
        const { setZoom, setGridSize, toggleSnapToGrid, toggleShowGrid, toggleMagneticAlignment } = useBuilderStore.getState();
        const canvasData = initialData.blocks.canvas;
        
        console.log('🎨 Loading canvas settings:', {
          zoom: canvasData.zoom,
          gridSize: canvasData.gridSize,
          snapToGrid: canvasData.snapToGrid,
        });
        
        setZoom(canvasData.zoom || 1);
        if (canvasData.gridSize) setGridSize(canvasData.gridSize);
        
        // Set booleans
        if (canvasData.snapToGrid !== canvas.snapToGrid) toggleSnapToGrid();
        if (canvasData.showGrid !== canvas.showGrid) toggleShowGrid();
        if (canvasData.magneticAlignment !== canvas.magneticAlignment) toggleMagneticAlignment();
      }

      // Load elements - support both array and object format
      if (initialData.blocks.elements) {
        const { canvas: currentCanvas } = useBuilderStore.getState();
        let elementsObject: Record<string, any> = {};
        
        console.log('🧩 Loading elements:', {
          type: Array.isArray(initialData.blocks.elements) ? 'array' : 'object',
          count: Array.isArray(initialData.blocks.elements) 
            ? initialData.blocks.elements.length 
            : Object.keys(initialData.blocks.elements).length,
        });
        
        // Convert array to object if needed
        if (Array.isArray(initialData.blocks.elements)) {
          // Array format (old seed data or new format with array)
          initialData.blocks.elements.forEach((el: any) => {
            elementsObject[el.id] = el;
          });
          console.log('✅ Converted array to object:', Object.keys(elementsObject).length, 'elements');
        } else if (typeof initialData.blocks.elements === 'object') {
          // Object format (current store format)
          elementsObject = initialData.blocks.elements;
          console.log('✅ Using object format:', Object.keys(elementsObject).length, 'elements');
        }
        
        useBuilderStore.setState({
          canvas: {
            ...currentCanvas,
            elements: elementsObject,
          },
        });
        
        console.log('✅ Elements loaded into store');
      }
      
      // Load from canvas.elements if exists (backup)
      else if (initialData.blocks.canvas?.elements) {
        const { canvas: currentCanvas } = useBuilderStore.getState();
        let elementsObject: Record<string, any> = {};
        
        console.log('🧩 Loading elements from canvas.elements:', {
          type: Array.isArray(initialData.blocks.canvas.elements) ? 'array' : 'object',
        });
        
        if (Array.isArray(initialData.blocks.canvas.elements)) {
          initialData.blocks.canvas.elements.forEach((el: any) => {
            elementsObject[el.id] = el;
          });
          console.log('✅ Converted canvas.elements array to object');
        } else if (typeof initialData.blocks.canvas.elements === 'object') {
          elementsObject = initialData.blocks.canvas.elements;
          console.log('✅ Using canvas.elements object');
        }
        
        useBuilderStore.setState({
          canvas: {
            ...currentCanvas,
            elements: elementsObject,
          },
        });
        
        console.log('✅ Elements loaded from canvas.elements');
      } else {
        console.log('⚠️ No elements found in blocks data');
      }
    } else {
      console.log('⚠️ No blocks data found');
    }
  }, [pageId]);

  // Save page to database
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const state = useBuilderStore.getState();
      
      // Convert elements object to format for saving
      const elementsObject = state.canvas.elements;
      
      // Debug: Log current state
      console.log('💾 Saving Page Builder:', {
        elementsCount: Object.keys(elementsObject).length,
        elementIds: Object.keys(elementsObject),
      });
      
      const blocks = {
        canvas: {
          ...state.canvas,
          // Ensure elements are in the canvas object
          elements: elementsObject,
        },
        // Also keep elements at root level for backward compatibility
        elements: elementsObject,
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
          published,
        }),
      });

      if (!response.ok) throw new Error('Failed to save');
      
      const result = await response.json();
      console.log('✅ Save successful:', result);

      toast.success('Đã lưu page thành công!');
    } catch (error) {
      console.error('❌ Save error:', error);
      toast.error('Lỗi khi lưu page');
    } finally {
      setIsSaving(false);
    }
  };

  // Export HTML
  const handleExport = () => {
    const html = exportToHTML(canvas.elements);
    downloadHTML(html, `${initialData.slug}.html`);
    toast.success('Đã export HTML thành công!');
  };

  // Save as template
  const handleSaveAsTemplate = async () => {
    // Nếu chọn template có sẵn -> Update
    if (selectedExistingTemplate) {
      return handleUpdateTemplate();
    }

    // Nếu không -> Create new
    if (!templateData.name) {
      toast.error('Vui lòng nhập tên template');
      return;
    }

    const selectedElements = canvas.selectedIds.length > 0
      ? canvas.selectedIds.map((id: string) => canvas.elements[id]).filter(Boolean)
      : Object.values(canvas.elements);

    if (selectedElements.length === 0) {
      toast.error('Không có element nào để lưu');
      return;
    }

    try {
      const response = await fetch('/api/admin/block-templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: templateData.name,
          description: templateData.description,
          category: templateData.category,
          elements: selectedElements,
          published: true,
        }),
      });

      if (!response.ok) throw new Error('Failed to save template');

      toast.success('Đã lưu template mới thành công!');
      setShowSaveTemplateDialog(false);
      setTemplateData({ name: '', description: '', category: 'general' });
      setSelectedExistingTemplate('');
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Lỗi khi lưu template');
    }
  };

  // Update existing template
  const handleUpdateTemplate = async () => {
    if (!selectedExistingTemplate) {
      toast.error('Vui lòng chọn template cần update');
      return;
    }

    const selectedElements = canvas.selectedIds.length > 0
      ? canvas.selectedIds.map((id: string) => canvas.elements[id]).filter(Boolean)
      : Object.values(canvas.elements);

    if (selectedElements.length === 0) {
      toast.error('Không có element nào để lưu');
      return;
    }

    const existingTemplate = existingTemplates.find(t => t.id === selectedExistingTemplate);
    if (!existingTemplate) {
      toast.error('Không tìm thấy template');
      return;
    }

    try {
      const response = await fetch('/api/admin/block-templates', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedExistingTemplate,
          name: existingTemplate.name,
          description: existingTemplate.description,
          category: existingTemplate.category,
          published: existingTemplate.published,
          thumbnail: existingTemplate.thumbnail,
          elements: selectedElements, // Update elements
        }),
      });

      if (!response.ok) throw new Error('Failed to update template');

      toast.success(`Đã cập nhật template "${existingTemplate.name}"!`);
      setShowSaveTemplateDialog(false);
      setTemplateData({ name: '', description: '', category: 'general' });
      setSelectedExistingTemplate('');
    } catch (error) {
      console.error('Error updating template:', error);
      toast.error('Lỗi khi cập nhật template');
    }
  };

  return (
    <div className="flex h-screen w-screen fixed inset-0 bg-background overflow-hidden" style={{ zIndex: 9999 }}>
      {/* Mobile Left Sidebar Overlay */}
      {showLeftSidebar && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm lg:hidden"
          style={{ zIndex: 10000 }}
          onClick={() => setShowLeftSidebar(false)}
        >
          <div 
            className="w-full max-w-sm h-full bg-background shadow-2xl overflow-y-auto border-r"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-background border-b p-4 flex items-center justify-between z-20">
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
          className="fixed inset-0 bg-black/60 backdrop-blur-sm lg:hidden"
          style={{ zIndex: 10000 }}
          onClick={() => setShowRightSidebar(false)}
        >
          <div 
            className="ml-auto w-full max-w-sm h-full bg-background shadow-2xl overflow-y-auto border-l"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-background border-b p-4 flex items-center justify-between z-20">
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

              {/* Published Toggle */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-md border bg-background">
                <Globe className={cn(
                  "w-4 h-4 shrink-0",
                  published ? "text-green-600" : "text-muted-foreground"
                )} />
                <span className="hidden lg:inline text-xs font-medium">
                  {published ? 'Công khai' : 'Nháp'}
                </span>
                <Switch
                  checked={published}
                  onCheckedChange={setPublished}
                />
              </div>

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

              {/* Save as Template */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSaveTemplateDialog(true)}
                className="hidden lg:flex"
                title="Lưu làm template"
              >
                <Blocks className="w-4 h-4 lg:mr-2" />
                <span className="hidden lg:inline">Template</span>
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

      {/* Dialog Lưu Template */}
      <Dialog open={showSaveTemplateDialog} onOpenChange={setShowSaveTemplateDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader className="border-b pb-4">
            <DialogTitle>Lưu làm Template</DialogTitle>
            <DialogDescription>
              {canvas.selectedIds.length > 0
                ? `Lưu ${canvas.selectedIds.length} element đã chọn làm template`
                : `Lưu tất cả ${Object.keys(canvas.elements).length} elements làm template`}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto py-4 space-y-4 px-4">
            {/* Option: Update existing hoặc Create new */}
            <div className="space-y-2">
              <Label>Chế độ</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={selectedExistingTemplate ? 'outline' : 'default'}
                  size="sm"
                  onClick={() => {
                    setSelectedExistingTemplate('');
                    setTemplateData({ name: '', description: '', category: 'general' });
                  }}
                  className="flex-1"
                >
                  Tạo mới
                </Button>
                <Button
                  type="button"
                  variant={selectedExistingTemplate ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    if (existingTemplates.length > 0) {
                      setSelectedExistingTemplate(existingTemplates[0].id);
                    }
                  }}
                  className="flex-1"
                >
                  Cập nhật có sẵn
                </Button>
              </div>
            </div>

            {/* Nếu chọn Update existing */}
            {selectedExistingTemplate ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="existing-template">Chọn template cần update</Label>
                  <Combobox
                    options={existingTemplates.map(t => ({ value: t.id, label: t.name }))}
                    value={selectedExistingTemplate}
                    onValueChange={(value: string) => setSelectedExistingTemplate(value)}
                    placeholder="Chọn template"
                    searchPlaceholder="Tìm template..."
                    emptyText="Không tìm thấy"
                  />
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg space-y-2">
                  <h4 className="font-medium text-sm text-amber-900">⚠️ Cảnh báo</h4>
                  <ul className="text-xs text-amber-800 space-y-1">
                    <li>• Elements hiện tại sẽ <strong>GHI ĐÈ</strong> elements của template đã chọn</li>
                    <li>• Metadata (tên, mô tả, danh mục) sẽ được giữ nguyên</li>
                    <li>• Không thể hoàn tác sau khi update</li>
                  </ul>
                </div>
              </div>
            ) : (
              /* Nếu chọn Create new */
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="template-name">Tên template *</Label>
                  <Input
                    id="template-name"
                    value={templateData.name}
                    onChange={(e) => setTemplateData({ ...templateData, name: e.target.value })}
                    placeholder="VD: Hero Banner Hiện Đại"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="template-description">Mô tả</Label>
                  <Input
                    id="template-description"
                    value={templateData.description}
                    onChange={(e) => setTemplateData({ ...templateData, description: e.target.value })}
                    placeholder="Mô tả ngắn gọn về template"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="template-category">Danh mục</Label>
                  <Combobox
                    options={CATEGORIES}
                    value={templateData.category}
                    onValueChange={(value: string) => setTemplateData({ ...templateData, category: value })}
                    placeholder="Chọn danh mục"
                    searchPlaceholder="Tìm danh mục..."
                    emptyText="Không tìm thấy"
                  />
                </div>
              </div>
            )}

            <div className="p-4 bg-muted rounded-lg space-y-2">
              <h4 className="font-medium text-sm">Thông tin</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>
                  • {canvas.selectedIds.length > 0
                    ? `${canvas.selectedIds.length} element đã chọn`
                    : `Tất cả ${Object.keys(canvas.elements).length} elements`}
                </li>
                {!selectedExistingTemplate && (
                  <>
                    <li>• Template mới sẽ được công khai</li>
                    <li>• Hiển thị trong tab Templates của Page Builder</li>
                  </>
                )}
              </ul>
            </div>
          </div>

          <DialogFooter className="border-t pt-4 px-4">
            <Button variant="outline" onClick={() => {
              setShowSaveTemplateDialog(false);
              setSelectedExistingTemplate('');
            }}>
              Hủy
            </Button>
            <Button onClick={handleSaveAsTemplate}>
              <Blocks className="w-4 h-4 mr-2" />
              {selectedExistingTemplate ? 'Cập nhật template' : 'Tạo template mới'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
