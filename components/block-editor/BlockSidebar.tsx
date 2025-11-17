'use client';

/**
 * Block Sidebar - Block library and templates
 * Mobile-first with overlay support
 */

import { useState, useEffect } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Type,
  Image,
  MousePointerClick,
  Box,
  Minus,
  Space,
  Video,
  Star,
  Search,
  Loader2,
  X,
  Menu,
  ChevronLeft,
  Presentation,
} from 'lucide-react';
import type { ElementBlockType } from '@/lib/blocks/types';

const ELEMENT_BLOCKS: Array<{
  type: ElementBlockType | 'carousel';
  label: string;
  icon: any;
  description: string;
}> = [
  { type: 'carousel', label: 'Carousel', icon: Presentation, description: 'Image slideshow' },
  { type: 'text', label: 'Text', icon: Type, description: 'Paragraph or heading' },
  { type: 'image', label: 'Image', icon: Image, description: 'Single image' },
  { type: 'button', label: 'Button', icon: MousePointerClick, description: 'CTA button' },
  { type: 'container', label: 'Container', icon: Box, description: 'Flex/Grid layout' },
  { type: 'divider', label: 'Divider', icon: Minus, description: 'Horizontal line' },
  { type: 'spacer', label: 'Spacer', icon: Space, description: 'Empty space' },
  { type: 'video', label: 'Video', icon: Video, description: 'Embed video' },
  { type: 'icon', label: 'Icon', icon: Star, description: 'Icon display' },
];

function DraggableBlock({ type, label, icon: Icon, description }: any) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `sidebar-${type}`,
    data: { type: 'new-block', blockType: type },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`
        p-3 rounded-lg border-2 border-gray-200 bg-white cursor-grab
        hover:border-blue-400 hover:shadow-md transition-all
        ${isDragging ? 'opacity-50' : ''}
      `}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded bg-blue-50 text-blue-600">
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm text-gray-900">{label}</div>
          <div className="text-xs text-gray-500 mt-0.5">{description}</div>
        </div>
      </div>
    </div>
  );
}

function DraggableTemplate({ template }: { template: BlockTemplate }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `template-${template.id}`,
    data: { type: 'template', template },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`
        p-3 rounded-lg border-2 border-gray-200 bg-white cursor-grab
        hover:border-blue-400 hover:shadow-md transition-all
        ${isDragging ? 'opacity-50' : ''}
      `}
    >
      {/* Thumbnail */}
      {template.thumbnail && (
        <div className="mb-2 rounded overflow-hidden bg-gray-100">
          <img
            src={template.thumbnail}
            alt={template.name}
            className="w-full h-24 object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="space-y-1">
        <div className="flex items-start justify-between gap-2">
          <div className="font-medium text-sm text-gray-900">{template.name}</div>
          <Badge variant="secondary" className="text-xs shrink-0">
            {template.category}
          </Badge>
        </div>

        {template.description && (
          <div className="text-xs text-gray-500 line-clamp-2">
            {template.description}
          </div>
        )}

        {/* Tags and downloads */}
        <div className="flex items-center justify-between mt-2">
          {template.tags.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {template.tags.slice(0, 2).map(tag => (
                <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0">
                  {tag}
                </Badge>
              ))}
              {template.tags.length > 2 && (
                <Badge variant="outline" className="text-xs px-1.5 py-0">
                  +{template.tags.length - 2}
                </Badge>
              )}
            </div>
          )}
          <div className="text-xs text-gray-400 shrink-0">
            {template.downloads} uses
          </div>
        </div>
      </div>
    </div>
  );
}

interface BlockTemplate {
  id: string;
  name: string;
  description: string;
  category: 'element' | 'template' | 'custom';
  tags: string[];
  block: any;
  thumbnail?: string;
  downloads: number;
}

interface BlockSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function BlockSidebar({ isOpen = true, onClose }: BlockSidebarProps) {
  const [search, setSearch] = useState('');
  const [templateSearch, setTemplateSearch] = useState('');
  const [templates, setTemplates] = useState<BlockTemplate[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'element' | 'template' | 'custom'>('all');

  const filteredBlocks = ELEMENT_BLOCKS.filter(
    block =>
      block.label.toLowerCase().includes(search.toLowerCase()) ||
      block.description.toLowerCase().includes(search.toLowerCase())
  );

  // Load templates
  useEffect(() => {
    async function loadTemplates() {
      setLoadingTemplates(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory !== 'all') {
          params.append('category', selectedCategory);
        }
        params.append('published', 'true');

        const response = await fetch(`/api/block-templates-v2?${params}`);
        if (!response.ok) throw new Error('Failed to load templates');

        const data = await response.json();
        setTemplates(data);
      } catch (error) {
        console.error('Error loading templates:', error);
      } finally {
        setLoadingTemplates(false);
      }
    }

    loadTemplates();
  }, [selectedCategory]);

  const filteredTemplates = templates.filter(template => {
    if (!templateSearch) return true;
    const searchLower = templateSearch.toLowerCase();
    return (
      template.name.toLowerCase().includes(searchLower) ||
      template.description?.toLowerCase().includes(searchLower) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  });

  return (
    <>
      {/* Mobile Overlay Backdrop */}
      {isOpen && onClose && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel - Mobile First */}
      <div
        className={`
          fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto
          w-full sm:w-96 lg:w-80 bg-white
          border-r border-gray-200 flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          shadow-2xl lg:shadow-none
        `}
      >
        {/* Header - Mobile Optimized */}
        <div className="px-4 py-3 lg:py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {onClose && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="lg:hidden -ml-2"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
              )}
              <div>
                <h2 className="text-base lg:text-lg font-semibold text-gray-900">
                  Blocks
                </h2>
                <p className="text-xs text-gray-500 mt-0.5 hidden sm:block">
                  Kéo thả vào canvas
                </p>
              </div>
            </div>
            {onClose && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="lg:hidden"
              >
                <X className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>

        {/* Tabs - Mobile Optimized */}
        <Tabs defaultValue="elements" className="flex-1 flex flex-col min-h-0">
          <div className="px-4 pt-3 lg:pt-4 shrink-0">
            <TabsList className="w-full grid grid-cols-3 h-9">
              <TabsTrigger value="elements" className="text-xs sm:text-sm">
                Phần tử
              </TabsTrigger>
              <TabsTrigger value="templates" className="text-xs sm:text-sm">
                Mẫu
              </TabsTrigger>
              <TabsTrigger value="saved" className="text-xs sm:text-sm">
                Đã lưu
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Elements Tab */}
          <TabsContent value="elements" className="flex-1 flex flex-col mt-0 min-h-0">
            <div className="px-4 pt-3 pb-2 shrink-0">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm blocks..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9 text-sm"
                />
              </div>
            </div>

            {/* Block list - Scrollable */}
            <div className="flex-1 px-4 pb-4 overflow-y-auto">
              <div className="space-y-2">
                {filteredBlocks.map(block => (
                  <DraggableBlock key={block.type} {...block} />
                ))}
              </div>

              {filteredBlocks.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <Search className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Không tìm thấy blocks</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="flex-1 flex flex-col mt-0 min-h-0">
            <div className="px-4 pt-3 pb-2 shrink-0 space-y-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Tìm mẫu..."
                  value={templateSearch}
                  onChange={(e) => setTemplateSearch(e.target.value)}
                  className="pl-9 h-9 text-sm"
                />
              </div>

              {/* Category filter - Horizontal scroll on mobile */}
              <div className="w-full overflow-x-auto whitespace-nowrap">
                <div className="flex gap-2 pb-1">
                  <Button
                    size="sm"
                    variant={selectedCategory === 'all' ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory('all')}
                    className="h-8 text-xs"
                  >
                    Tất cả
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedCategory === 'element' ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory('element')}
                    className="h-8 text-xs"
                  >
                    Phần tử
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedCategory === 'template' ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory('template')}
                    className="h-8 text-xs"
                  >
                    Template
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedCategory === 'custom' ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory('custom')}
                    className="h-8 text-xs"
                  >
                    Tùy chỉnh
                  </Button>
                </div>
              </div>
            </div>

            {/* Loading state */}
            {loadingTemplates && (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            )}

            {/* Templates list - Scrollable */}
            {!loadingTemplates && (
              <div className="flex-1 px-4 pb-4 overflow-y-auto">
                <div className="space-y-2">
                  {filteredTemplates.map(template => (
                    <DraggableTemplate key={template.id} template={template} />
                  ))}
                </div>

                {/* Empty state */}
                {filteredTemplates.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    <Box className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Không tìm thấy mẫu</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* Saved Tab */}
          <TabsContent value="saved" className="flex-1 flex items-center justify-center mt-0">
            <div className="text-center py-12 text-gray-400">
              <Star className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Chưa có blocks đã lưu</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
