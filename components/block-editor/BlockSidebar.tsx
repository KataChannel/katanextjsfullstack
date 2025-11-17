'use client';

/**
 * Block Sidebar - Block library and templates
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
} from 'lucide-react';
import type { ElementBlockType } from '@/lib/blocks/types';

const ELEMENT_BLOCKS: Array<{
  type: ElementBlockType;
  label: string;
  icon: any;
  description: string;
}> = [
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

export function BlockSidebar() {
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
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Blocks</h2>
        <p className="text-xs text-gray-500 mt-1">Drag & drop to canvas</p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="elements" className="flex-1 flex flex-col">
        <TabsList className="w-full grid grid-cols-3 mx-4 mt-4">
          <TabsTrigger value="elements">Elements</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
        </TabsList>

        {/* Elements Tab */}
        <TabsContent value="elements" className="flex-1 overflow-auto p-4 mt-0">
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search blocks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Block list */}
          <div className="space-y-2">
            {filteredBlocks.map(block => (
              <DraggableBlock key={block.type} {...block} />
            ))}
          </div>

          {filteredBlocks.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <Search className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No blocks found</p>
            </div>
          )}
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="flex-1 overflow-auto p-4 mt-0">
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search templates..."
              value={templateSearch}
              onChange={(e) => setTemplateSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Category filter */}
          <div className="flex gap-2 mb-4">
            <Button
              size="sm"
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('all')}
            >
              All
            </Button>
            <Button
              size="sm"
              variant={selectedCategory === 'element' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('element')}
            >
              Elements
            </Button>
            <Button
              size="sm"
              variant={selectedCategory === 'template' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('template')}
            >
              Templates
            </Button>
            <Button
              size="sm"
              variant={selectedCategory === 'custom' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('custom')}
            >
              Custom
            </Button>
          </div>

          {/* Loading state */}
          {loadingTemplates && (
            <div className="flex items-center justify-center py-8 text-gray-400">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          )}

          {/* Templates list */}
          {!loadingTemplates && (
            <div className="space-y-2">
              {filteredTemplates.map(template => (
                <DraggableTemplate key={template.id} template={template} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loadingTemplates && filteredTemplates.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <Box className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No templates found</p>
            </div>
          )}
        </TabsContent>

        {/* Saved Tab */}
        <TabsContent value="saved" className="flex-1 overflow-auto p-4 mt-0">
          <div className="text-center py-8 text-gray-400">
            <Star className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No saved blocks yet</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
