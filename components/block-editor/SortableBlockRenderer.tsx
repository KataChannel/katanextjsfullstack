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
import { TiptapBlockEditor } from './TiptapBlockEditor';

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

      case 'html': {
        const htmlContent = (block.content as any).html || '<div class="p-4 bg-gray-100 rounded text-gray-500 text-sm">No HTML content</div>';
        const htmlContainerStyles = block.styles.container || 'w-full';
        
        // Container có Tailwind classes (được compile), content HTML bên trong
        return (
          <div className={htmlContainerStyles}>
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
          </div>
        );
      }

      case 'carousel': {
        const slides = (block.content as any)?.slides || [];
        const autoplay = (block.content as any)?.autoplay ?? true;
        const interval = (block.content as any)?.interval || 5000;
        
        if (slides.length === 0) {
          return (
            <div className="w-full h-[400px] md:h-[500px] bg-linear-to-r from-blue-900 to-blue-600 rounded-lg flex items-center justify-center">
              <div className="text-center text-white p-8">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-lg font-semibold mb-2">Carousel Block</p>
                <p className="text-sm opacity-80">Chọn block và thêm slides trong Inspector</p>
                <div className="mt-4 text-xs opacity-60">
                  {autoplay ? `Tự động chuyển: ${interval}ms` : 'Không tự động chuyển'}
                </div>
              </div>
            </div>
          );
        }

        // Preview first slide in canvas
        const firstSlide = slides[0];
        return (
          <div className="w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden relative">
            {/* Background image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${firstSlide.image})`,
              }}
            />
            
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-linear-to-r from-blue-900/90 via-blue-800/70 to-transparent" />

            {/* Content preview */}
            <div className="relative h-full flex items-center px-8">
              <div className="max-w-2xl text-white space-y-3">
                <div className="space-y-1">
                  <h2 className="text-2xl md:text-3xl font-bold text-orange-400">
                    {firstSlide.title}
                  </h2>
                  <h3 className="text-3xl md:text-4xl font-bold">
                    {firstSlide.subtitle}
                  </h3>
                </div>
                <p className="text-sm md:text-base text-gray-200 line-clamp-2">
                  {firstSlide.description}
                </p>
                {firstSlide.badge && (
                  <div className="inline-flex items-center gap-2 bg-blue-600/80 backdrop-blur-sm px-4 py-2 rounded-lg text-sm">
                    <span>{firstSlide.badge}</span>
                    {firstSlide.badgeHighlight && (
                      <span className="font-bold">{firstSlide.badgeHighlight}</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Dots indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {slides.map((_: any, index: number) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === 0
                      ? 'bg-white w-8'
                      : 'bg-white/50'
                  }`}
                />
              ))}
            </div>

            {/* Info badge */}
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs">
              {slides.length} slides
              {autoplay && ` • Auto ${interval}ms`}
            </div>
          </div>
        );
      }

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
