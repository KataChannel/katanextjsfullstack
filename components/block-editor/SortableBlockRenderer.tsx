'use client';

/**
 * Sortable Block Renderer - Draggable and sortable block
 */

import { useSortable } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useBlockEditorStore } from '@/lib/blocks/store';
import type { Block } from '@/lib/blocks/types';
import { GripVertical, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SortableBlockRendererProps {
  block: Block;
}

export function SortableBlockRenderer({ block }: SortableBlockRendererProps) {
  const { selectedBlockId, selectBlock, deleteBlock, hoveredBlockId, hoverBlock } =
    useBlockEditorStore();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: block.id,
    data: { type: 'existing-block', blockId: block.id },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isSelected = selectedBlockId === block.id;
  const isHovered = hoveredBlockId === block.id;

  // Render block content based on type
  const renderContent = () => {
    switch (block.type) {
      case 'text': {
        const textTag = (block.content as any).tag || 'p';
        const textContent = (block.content as any).text || 'Enter text...';
        const className = block.styles.element || 'text-base text-gray-900';
        
        switch (textTag) {
          case 'h1':
            return <h1 className={className} contentEditable suppressContentEditableWarning>{textContent}</h1>;
          case 'h2':
            return <h2 className={className} contentEditable suppressContentEditableWarning>{textContent}</h2>;
          case 'h3':
            return <h3 className={className} contentEditable suppressContentEditableWarning>{textContent}</h3>;
          case 'h4':
            return <h4 className={className} contentEditable suppressContentEditableWarning>{textContent}</h4>;
          case 'h5':
            return <h5 className={className} contentEditable suppressContentEditableWarning>{textContent}</h5>;
          case 'h6':
            return <h6 className={className} contentEditable suppressContentEditableWarning>{textContent}</h6>;
          case 'div':
            return <div className={className} contentEditable suppressContentEditableWarning>{textContent}</div>;
          case 'span':
            return <span className={className} contentEditable suppressContentEditableWarning>{textContent}</span>;
          default:
            return <p className={className} contentEditable suppressContentEditableWarning>{textContent}</p>;
        }
      }

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
        const { setNodeRef: setDropRef, isOver } = useDroppable({
          id: `container-${block.id}`,
          data: { type: 'container', containerId: block.id },
        });
        
        return (
          <div
            ref={setDropRef}
            className={`
              ${block.styles.container || 'flex flex-col gap-4 p-4 border-2 border-dashed border-gray-300 rounded-lg'}
              ${isOver ? 'border-blue-500 bg-blue-50' : ''}
            `}
          >
            {block.children?.map(child => (
              <SortableBlockRenderer key={child.id} block={child} />
            ))}
            {(!block.children || block.children.length === 0) && (
              <div className="p-8 text-center text-gray-400">
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

      case 'video':
        const videoUrl = (block.content as any).url || '';
        const provider = (block.content as any).provider || 'youtube';
        
        if (provider === 'youtube' && videoUrl) {
          const videoId = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)?.[1];
          if (videoId) {
            return (
              <div className="aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}`}
                  className="w-full h-full rounded-lg"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            );
          }
        }
        
        return (
          <video
            src={videoUrl}
            controls={(block.content as any).controls !== false}
            className={block.styles.element || 'w-full rounded-lg'}
          />
        );

      case 'icon':
        return (
          <div className={block.styles.element || 'text-gray-600'}>
            <span className="text-2xl">★</span>
          </div>
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
      style={style}
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
          <span {...listeners} {...attributes} className="cursor-grab active:cursor-grabbing">
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
