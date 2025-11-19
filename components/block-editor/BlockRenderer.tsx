'use client';

/**
 * Block Renderer - Renders a single block
 */

import { useDraggable } from '@dnd-kit/core';
import { useBlockEditorStore } from '@/lib/blocks/store';
import type { Block } from '@/lib/blocks/types';
import { GripVertical, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TiptapBlockEditor } from './TiptapBlockEditor';

interface BlockRendererProps {
  block: Block;
}

export function BlockRenderer({ block }: BlockRendererProps) {
  const { selectedBlockId, selectBlock, deleteBlock, hoveredBlockId, hoverBlock } =
    useBlockEditorStore();

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: block.id,
  });

  const isSelected = selectedBlockId === block.id;
  const isHovered = hoveredBlockId === block.id;

  // Render block content based on type
  const renderContent = () => {
    switch (block.type) {
      case 'text':
        return (
          <TiptapBlockEditor
            content={(block.content as any).html || '<p>Type / for commands...</p>'}
            onChange={(html) => {
              useBlockEditorStore.getState().updateBlock(block.id, {
                content: { html },
              });
            }}
            className={block.styles.element || 'text-base text-gray-900'}
            placeholder="Type / for commands..."
          />
        );

      case 'image':
        return (
          <img
            src={(block.content as any).url || 'https://placehold.co/800x400'}
            alt={(block.content as any).alt || ''}
            className={block.styles.element || 'w-full h-auto'}
          />
        );

      case 'button':
        return (
          <a
            href={(block.content as any).link || '#'}
            className={
              block.styles.element ||
              'inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition'
            }
          >
            {(block.content as any).text || 'Button'}
          </a>
        );

      case 'container': {
        const containerContent = block.content as any;
        const background = containerContent?.background;
        
        const getBackgroundStyle = () => {
          if (!background || background.type === 'none') return {};
          
          const opacity = (background.opacity || 100) / 100;
          
          if (background.type === 'color') {
            const hex = background.value || '#f3f4f6';
            // Convert hex to rgba
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return {
              backgroundColor: `rgba(${r}, ${g}, ${b}, ${opacity})`,
            };
          }
          
          if (background.type === 'image' && background.value) {
            return {
              backgroundImage: `url(${background.value})`,
              backgroundSize: background.size || 'cover',
              backgroundPosition: background.position || 'center',
              backgroundRepeat: background.repeat || 'no-repeat',
              opacity: opacity,
            };
          }
          
          return {};
        };

        return (
          <div 
            className={block.styles.container || 'flex flex-col gap-4'}
            style={getBackgroundStyle()}
          >
            {block.children?.map(child => (
              <BlockRenderer key={child.id} block={child} />
            ))}
            {(!block.children || block.children.length === 0) && (
              <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-400">
                Drop blocks here
              </div>
            )}
          </div>
        );
      }

      case 'divider':
        return <hr className={block.styles.element || 'border-t border-gray-300 my-4'} />;

      case 'spacer':
        return <div className={block.styles.element || 'h-8'} />;

      case 'html':
        return (
          <div
            className={block.styles.container || 'w-full'}
            dangerouslySetInnerHTML={{
              __html: (block.content as any).html || '<p>No HTML content</p>',
            }}
          />
        );

      default:
        return (
          <div className="p-4 bg-gray-100 rounded text-sm text-gray-500">
            {block.type} block (not implemented)
          </div>
        );
    }
  };

  return (
    <div
      ref={setNodeRef}
      onClick={(e) => {
        e.stopPropagation();
        selectBlock(block.id);
      }}
      onMouseEnter={() => hoverBlock(block.id)}
      onMouseLeave={() => hoverBlock(null)}
      className={`
        group relative
        ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
        ${isHovered && !isSelected ? 'ring-1 ring-gray-300' : ''}
        ${isDragging ? 'opacity-50' : ''}
        transition-all rounded-lg
      `}
    >
      {/* Hover/Select toolbar */}
      {(isSelected || isHovered) && (
        <div className="absolute -top-8 left-0 flex items-center gap-1 bg-blue-600 text-white px-2 py-1 rounded text-xs z-10">
          <span {...listeners} {...attributes} className="cursor-grab">
            <GripVertical className="w-3 h-3" />
          </span>
          <span className="font-medium">{block.type}</span>
          {isSelected && (
            <Button
              variant="ghost"
              size="sm"
              className="h-5 w-5 p-0 ml-1 hover:bg-red-500"
              onClick={(e) => {
                e.stopPropagation();
                deleteBlock(block.id);
              }}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          )}
        </div>
      )}

      {/* Block content */}
      <div className={block.styles.container || ''}>{renderContent()}</div>
    </div>
  );
}
