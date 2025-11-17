'use client';

/**
 * Block Canvas - Main editing area
 */

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useBlockEditorStore, selectSelectedBlock } from '@/lib/blocks/store';
import { SortableBlockRenderer } from './SortableBlockRenderer';
import { PlusCircle } from 'lucide-react';

export function BlockCanvas() {
  const { blocks, viewMode, canvasSettings } = useBlockEditorStore();
  const selectedBlock = useBlockEditorStore(selectSelectedBlock);

  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas-root',
  });

  // Responsive canvas width
  const canvasWidth = {
    desktop: 'max-w-full',
    tablet: 'max-w-3xl',
    mobile: 'max-w-md',
  }[viewMode];

  return (
    <div className="flex-1 overflow-auto bg-gray-50 p-8">
      <div
        ref={setNodeRef}
        className={`
          mx-auto bg-white rounded-lg shadow-sm
          ${canvasWidth}
          ${isOver ? 'ring-2 ring-blue-500' : ''}
          ${canvasSettings.showBorders ? 'border border-gray-300' : ''}
        `}
        style={{
          minHeight: '100%',
        }}
      >
        {/* Empty state */}
        {blocks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <PlusCircle className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg font-medium">Start building your page</p>
            <p className="text-sm mt-1">Drag blocks from the sidebar</p>
          </div>
        )}

        {/* Render blocks */}
        <div className="p-6 space-y-4">
          <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
            {blocks.map(block => (
              <SortableBlockRenderer key={block.id} block={block} />
            ))}
          </SortableContext>
        </div>
      </div>
    </div>
  );
}
