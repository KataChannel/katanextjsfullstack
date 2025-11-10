'use client';

import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { TiptapEditor } from './tiptap-editor';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  GripVertical,
  Trash2,
  Plus,
  Type,
  Image as ImageIcon,
  Layout,
  Video,
  Code,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PageBlock {
  id: string;
  type: 'heading' | 'text' | 'image' | 'video' | 'code' | 'custom';
  content: string;
  config?: Record<string, any>;
}

interface PageBuilderProps {
  initialBlocks?: PageBlock[];
  onChange?: (blocks: PageBlock[]) => void;
}

export function PageBuilder({ initialBlocks = [], onChange }: PageBuilderProps) {
  const [blocks, setBlocks] = useState<PageBlock[]>(initialBlocks);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(blocks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setBlocks(items);
    onChange?.(items);
  };

  const addBlock = (type: PageBlock['type']) => {
    const newBlock: PageBlock = {
      id: `block-${Date.now()}`,
      type,
      content: '',
      config: {},
    };
    const newBlocks = [...blocks, newBlock];
    setBlocks(newBlocks);
    onChange?.(newBlocks);
    setSelectedBlockId(newBlock.id);
  };

  const updateBlock = (id: string, content: string) => {
    const newBlocks = blocks.map((block) =>
      block.id === id ? { ...block, content } : block
    );
    setBlocks(newBlocks);
    onChange?.(newBlocks);
  };

  const deleteBlock = (id: string) => {
    const newBlocks = blocks.filter((block) => block.id !== id);
    setBlocks(newBlocks);
    onChange?.(newBlocks);
    if (selectedBlockId === id) {
      setSelectedBlockId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full">
      {/* Sidebar - Component Library */}
      <div className="lg:col-span-3 space-y-2 p-4 border rounded-lg bg-muted/30">
        <h3 className="font-semibold mb-4">Thành phần</h3>
        
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => addBlock('heading')}
        >
          <Type className="mr-2 h-4 w-4" />
          Tiêu đề
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => addBlock('text')}
        >
          <Layout className="mr-2 h-4 w-4" />
          Văn bản
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => addBlock('image')}
        >
          <ImageIcon className="mr-2 h-4 w-4" />
          Hình ảnh
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => addBlock('video')}
        >
          <Video className="mr-2 h-4 w-4" />
          Video
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => addBlock('code')}
        >
          <Code className="mr-2 h-4 w-4" />
          Mã code
        </Button>
      </div>

      {/* Canvas - Main editing area */}
      <div className="lg:col-span-6 border rounded-lg p-4 bg-background min-h-[600px]">
        <h3 className="font-semibold mb-4">Nội dung trang</h3>
        
        {blocks.length === 0 ? (
          <div className="flex items-center justify-center h-96 text-muted-foreground">
            <div className="text-center">
              <Plus className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Chưa có khối nội dung nào</p>
              <p className="text-sm">Thêm khối từ sidebar bên trái</p>
            </div>
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="blocks">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                  {blocks.map((block, index) => (
                    <Draggable key={block.id} draggableId={block.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={cn(
                            'group relative',
                            snapshot.isDragging && 'opacity-50'
                          )}
                        >
                          <Card
                            className={cn(
                              'cursor-pointer transition-colors',
                              selectedBlockId === block.id && 'ring-2 ring-primary'
                            )}
                            onClick={() => setSelectedBlockId(block.id)}
                          >
                            <CardHeader className="p-3 flex flex-row items-center space-y-0">
                              <div
                                {...provided.dragHandleProps}
                                className="mr-2 cursor-grab active:cursor-grabbing"
                              >
                                <GripVertical className="h-5 w-5 text-muted-foreground" />
                              </div>
                              <CardTitle className="text-sm flex-1">
                                {getBlockTypeLabel(block.type)}
                              </CardTitle>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteBlock(block.id);
                                }}
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </CardHeader>
                            <CardContent className="p-3 pt-0">
                              <BlockContent
                                block={block}
                                onChange={(content) => updateBlock(block.id, content)}
                              />
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>

      {/* Properties Panel */}
      <div className="lg:col-span-3 p-4 border rounded-lg bg-muted/30">
        <h3 className="font-semibold mb-4">Thuộc tính</h3>
        
        {selectedBlockId ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Đang chỉnh sửa: {getBlockTypeLabel(blocks.find(b => b.id === selectedBlockId)?.type || 'text')}
            </p>
            {/* Add more property controls here */}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Chọn một khối để xem thuộc tính
          </p>
        )}
      </div>
    </div>
  );
}

function getBlockTypeLabel(type: PageBlock['type']): string {
  const labels: Record<PageBlock['type'], string> = {
    heading: 'Tiêu đề',
    text: 'Văn bản',
    image: 'Hình ảnh',
    video: 'Video',
    code: 'Mã code',
    custom: 'Tùy chỉnh',
  };
  return labels[type];
}

interface BlockContentProps {
  block: PageBlock;
  onChange: (content: string) => void;
}

function BlockContent({ block, onChange }: BlockContentProps) {
  switch (block.type) {
    case 'heading':
      return (
        <input
          type="text"
          value={block.content}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Nhập tiêu đề..."
          className="w-full text-2xl font-bold bg-transparent border-none focus:outline-none"
        />
      );

    case 'text':
      return (
        <TiptapEditor
          content={block.content}
          onChange={onChange}
          placeholder="Nhập nội dung văn bản..."
        />
      );

    case 'image':
      return (
        <div className="space-y-2">
          <input
            type="text"
            value={block.content}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Nhập URL hình ảnh..."
            className="w-full p-2 border rounded"
          />
          {block.content && (
            <img src={block.content} alt="Preview" className="max-w-full h-auto rounded" />
          )}
        </div>
      );

    case 'video':
      return (
        <div className="space-y-2">
          <input
            type="text"
            value={block.content}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Nhập URL video (YouTube, Vimeo...)..."
            className="w-full p-2 border rounded"
          />
        </div>
      );

    case 'code':
      return (
        <textarea
          value={block.content}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Nhập mã code..."
          className="w-full p-2 border rounded font-mono text-sm min-h-[100px]"
        />
      );

    default:
      return <div>Loại khối không được hỗ trợ</div>;
  }
}
