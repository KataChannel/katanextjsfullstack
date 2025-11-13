'use client';

/**
 * Block Editor - Main component
 * 3-panel layout: Sidebar | Canvas | Inspector
 */

import { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { BlockSidebar } from './BlockSidebar';
import { BlockCanvas } from './BlockCanvas';
import { BlockInspector } from './BlockInspector';
import { BlockToolbar } from './BlockToolbar';
import { useBlockEditorStore } from '@/lib/blocks/store';
import type { Block } from '@/lib/blocks/types';

interface BlockEditorProps {
  pageId?: string;
  initialBlocks?: Block[];
  onSave?: (blocks: Block[]) => void;
}

export function BlockEditor({ pageId, initialBlocks, onSave }: BlockEditorProps) {
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const { blocks, loadBlocks, addBlock, moveBlock } = useBlockEditorStore();

  // Load initial blocks
  useState(() => {
    if (initialBlocks) {
      loadBlocks(initialBlocks);
    }
  });

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(event.active.id as string);
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveDragId(null);
      return;
    }

    // Handle different drop scenarios
    // This is simplified - full implementation would handle:
    // - Reordering blocks
    // - Moving into containers
    // - Adding new blocks from sidebar
    
    setActiveDragId(null);
  };

  // Handle save
  const handleSave = async () => {
    if (onSave) {
      onSave(blocks);
    }
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="h-screen flex flex-col bg-gray-50">
        {/* Toolbar */}
        <BlockToolbar onSave={handleSave} />

        {/* Main 3-panel layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Block library */}
          <BlockSidebar />

          {/* Center Canvas - Main editing area */}
          <BlockCanvas />

          {/* Right Inspector - Properties panel */}
          <BlockInspector />
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
    </DndContext>
  );
}
