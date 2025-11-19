'use client';

/**
 * Block Editor - Main component
 * 3-panel layout: Sidebar | Canvas | Inspector
 */

import { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { BlockSidebar } from './BlockSidebar';
import { BlockCanvas } from './BlockCanvas';
import { BlockInspector } from './BlockInspector';
import { BlockToolbar } from './BlockToolbar';
import { useBlockEditorStore } from '@/lib/blocks/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Block } from '@/lib/blocks/types';

interface BlockEditorProps {
  pageId?: string;
  initialBlocks?: Block[];
  onSave?: (blocks: Block[]) => void;
  onChange?: (blocks: Block[]) => void;
}

export function BlockEditor({ pageId, initialBlocks, onSave, onChange }: BlockEditorProps) {
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [inspectorOpen, setInspectorOpen] = useState(true);
  const [templateData, setTemplateData] = useState({
    name: '',
    description: '',
    category: 'custom' as 'element' | 'template' | 'custom',
    tags: '',
  });
  const [savingTemplate, setSavingTemplate] = useState(false);
  
  const { blocks, loadBlocks, addBlock, moveBlock, selectedBlockId, getBlock, deleteBlock, duplicateBlock, selectBlock } = useBlockEditorStore();

  // Load initial blocks
  useEffect(() => {
    if (initialBlocks) {
      loadBlocks(initialBlocks);
    }
  }, [initialBlocks, loadBlocks]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle shortcuts when not in input/textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      // Delete: Backspace or Delete
      if ((e.key === 'Backspace' || e.key === 'Delete') && selectedBlockId) {
        e.preventDefault();
        deleteBlock(selectedBlockId);
      }

      // Duplicate: Cmd+D / Ctrl+D
      if (modifier && e.key === 'd' && selectedBlockId) {
        e.preventDefault();
        duplicateBlock(selectedBlockId);
      }

      // Select All: Cmd+A / Ctrl+A
      if (modifier && e.key === 'a' && blocks.length > 0) {
        e.preventDefault();
        selectBlock(blocks[0].id);
      }

      // Deselect: Escape
      if (e.key === 'Escape' && selectedBlockId) {
        e.preventDefault();
        selectBlock(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedBlockId, blocks, deleteBlock, duplicateBlock, selectBlock]);

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(event.active.id as string);
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveDragId(null);
    
    if (!over) {
      return;
    }

    const dragData = active.data.current;
    const dropData = over.data.current;

    // Determine drop position
    let parentId: string | null = null;
    let index = blocks.length;

    // Check if dropping into container
    if (dropData?.type === 'container') {
      parentId = dropData.containerId;
      const container = parentId ? getBlock(parentId) : null;
      index = container?.children?.length || 0;
    } else if (dropData?.type === 'existing-block') {
      // Dropping next to existing block (reordering)
      const targetId = over.id as string;
      index = blocks.findIndex(b => b.id === targetId);
    }

    // Case 1: Dragging new block from sidebar
    if (dragData?.type === 'new-block') {
      const blockType = dragData.blockType;
      
      // Create new block with default content
      const newBlock: Partial<Block> = {
        type: blockType,
        name: `${blockType} block`,
        content: getDefaultContent(blockType),
        styles: getDefaultStyles(blockType),
      };

      // Add to canvas
      addBlock(newBlock, { parentId, index });
      return;
    }

    // Case 2: Dragging template from sidebar
    if (dragData?.type === 'template') {
      const template = dragData.template;
      
      // Create block from template
      const newBlock: Partial<Block> = {
        ...template.block,
        id: undefined, // Generate new ID
        name: template.name,
      };

      // Add to canvas
      addBlock(newBlock, { parentId, index });
      return;
    }

    // Case 3: Reordering existing blocks
    if (dragData?.type === 'existing-block' && active.id !== over.id) {
      const activeId = active.id as string;
      const overId = over.id as string;
      
      // For now, only support root-level reordering
      // Container nesting reorder would need recursive logic
      if (!parentId) {
        const activeIndex = blocks.findIndex(b => b.id === activeId);
        const overIndex = blocks.findIndex(b => b.id === overId);
        
        if (activeIndex !== -1 && overIndex !== -1) {
          // Reorder blocks
          const newBlocks = [...blocks];
          const [removed] = newBlocks.splice(activeIndex, 1);
          newBlocks.splice(overIndex, 0, removed);
          
          // Update store with reordered blocks
          loadBlocks(newBlocks);
          onChange?.(newBlocks);
        }
      } else {
        // Move block into container
        moveBlock(activeId, { parentId, index });
        onChange?.(blocks);
      }
    }
  };

  // Helper to get default content
  const getDefaultContent = (type: string) => {
    const defaults: Record<string, any> = {
      carousel: {
        autoplay: true,
        interval: 5000,
        slides: [
          {
            id: 'slide-1',
            image: 'https://placehold.co/1200x600',
            title: 'Slide 1',
            subtitle: 'Tiêu đề phụ',
            description: 'Mô tả slide',
            badge: 'Label',
            badgeHighlight: 'Highlight',
          },
        ],
      },
      text: { text: 'Enter text here...', tag: 'p' },
      image: { url: 'https://placehold.co/800x400', alt: 'Image' },
      button: { text: 'Click me', link: '#', variant: 'primary' },
      container: { layout: 'flex', direction: 'column', gap: 4 },
      divider: {},
      spacer: {},
      video: { url: '', provider: 'youtube', controls: true },
      icon: { name: 'star', size: 24 },
    };
    return defaults[type] || {};
  };

  // Helper to get default styles
  const getDefaultStyles = (type: string) => {
    const defaults: Record<string, any> = {
      carousel: { element: 'w-full' },
      text: { element: 'text-base text-gray-900' },
      image: { element: 'w-full h-auto rounded-lg' },
      button: { element: 'inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition' },
      container: { container: 'flex flex-col gap-4 p-6 border border-gray-200 rounded-lg' },
      divider: { element: 'border-t border-gray-300 my-4' },
      spacer: { element: 'h-8' },
      video: { container: 'relative w-full', element: 'w-full aspect-video' },
      icon: { element: 'w-6 h-6 text-gray-900' },
    };
    return defaults[type] || {};
  };

  // Handle save
  const handleSave = async () => {
    if (onSave) {
      onSave(blocks);
    }
  };

  // Handle save as template
  const handleSaveAsTemplate = async () => {
    if (!selectedBlockId) return;
    
    const block = getBlock(selectedBlockId);
    if (!block) return;
    
    setShowTemplateDialog(true);
  };

  const handleCreateTemplate = async () => {
    if (!selectedBlockId || !templateData.name) {
      return;
    }

    const block = getBlock(selectedBlockId);
    if (!block) return;

    setSavingTemplate(true);

    try {
      const tags = templateData.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const response = await fetch('/api/block-templates-v2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: templateData.name,
          description: templateData.description,
          category: templateData.category,
          tags,
          block,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save template');
      }

      // Reset form
      setTemplateData({
        name: '',
        description: '',
        category: 'custom',
        tags: '',
      });
      setShowTemplateDialog(false);
      
      // Show success (using browser alert for now, should use toast)
      alert('Template saved successfully!');
    } catch (error: any) {
      alert(error.message);
    } finally {
      setSavingTemplate(false);
    }
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="h-[90vh] flex flex-col bg-gray-50">
        {/* Toolbar */}
        <BlockToolbar onSave={handleSave} onSaveAsTemplate={handleSaveAsTemplate} />

        {/* Main 3-panel layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Block library */}
          <BlockSidebar 
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          {/* Center Canvas - Main editing area */}
          <BlockCanvas />

          {/* Right Inspector - Properties panel */}
          <BlockInspector 
            isOpen={inspectorOpen}
            onClose={() => setInspectorOpen(false)}
          />
        </div>
      </div>

      {/* Drag overlay */}
      <DragOverlay>
        {activeDragId ? (
          <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-blue-500">
            Dragging block...
          </div>
        ) : null}
      </DragOverlay>

      {/* Save as Template Dialog */}
      <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save as Template</DialogTitle>
            <DialogDescription>
              Save the selected block as a reusable template
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 p-4">
            <div className="space-y-2">
              <Label htmlFor="template-name">Template Name *</Label>
              <Input
                id="template-name"
                placeholder="Hero Section"
                value={templateData.name}
                onChange={(e) =>
                  setTemplateData({ ...templateData, name: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="template-description">Description</Label>
              <Input
                id="template-description"
                placeholder="A hero section with heading and CTA button"
                value={templateData.description}
                onChange={(e) =>
                  setTemplateData({ ...templateData, description: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="template-category">Category</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={templateData.category === 'element' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTemplateData({ ...templateData, category: 'element' })}
                >
                  Element
                </Button>
                <Button
                  type="button"
                  variant={templateData.category === 'template' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTemplateData({ ...templateData, category: 'template' })}
                >
                  Template
                </Button>
                <Button
                  type="button"
                  variant={templateData.category === 'custom' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTemplateData({ ...templateData, category: 'custom' })}
                >
                  Custom
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="template-tags">Tags (comma separated)</Label>
              <Input
                id="template-tags"
                placeholder="hero, cta, marketing"
                value={templateData.tags}
                onChange={(e) =>
                  setTemplateData({ ...templateData, tags: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowTemplateDialog(false)}
              disabled={savingTemplate}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateTemplate}
              disabled={!templateData.name || savingTemplate}
            >
              {savingTemplate ? 'Saving...' : 'Save Template'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DndContext>
  );
}
