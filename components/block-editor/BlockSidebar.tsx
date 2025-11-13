'use client';

/**
 * Block Sidebar - Block library and templates
 */

import { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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

export function BlockSidebar() {
  const [search, setSearch] = useState('');

  const filteredBlocks = ELEMENT_BLOCKS.filter(
    block =>
      block.label.toLowerCase().includes(search.toLowerCase()) ||
      block.description.toLowerCase().includes(search.toLowerCase())
  );

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
          <div className="text-center py-8 text-gray-400">
            <Box className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Templates coming soon...</p>
          </div>
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
