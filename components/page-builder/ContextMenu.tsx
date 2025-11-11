'use client';

import React from 'react';
import { useBuilderStore } from '@/lib/page-builder/store';
import { Copy, Clipboard, Trash2, Layers, ArrowUp, ArrowDown } from 'lucide-react';

interface ContextMenuProps {
  x: number;
  y: number;
  elementId: string | null;
  onClose: () => void;
}

/**
 * Right-click Context Menu
 * - Copy CSS
 * - Duplicate
 * - Delete
 * - Bring to Front
 * - Send to Back
 */
export function ContextMenu({ x, y, elementId, onClose }: ContextMenuProps) {
  const canvas = useBuilderStore((state) => state.canvas);
  const { updateElement, deleteElement } = useBuilderStore();

  const element = elementId ? canvas.elements[elementId] : null;

  React.useEffect(() => {
    const handleClick = () => onClose();
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  if (!element) return null;

  const handleCopyCSS = () => {
    const css = `
      background-color: ${element.style?.backgroundColor || 'transparent'};
      color: ${element.style?.color || '#000'};
      font-size: ${element.style?.fontSize || 16}px;
      border-radius: ${element.style?.borderRadius || 0}px;
      opacity: ${element.style?.opacity || 1};
    `;
    navigator.clipboard.writeText(css.trim());
    onClose();
  };

  const handleDuplicate = () => {
    const newElement = {
      ...element,
      id: `${element.type}-${Date.now()}`,
      x: element.x + 20,
      y: element.y + 20,
    };
    useBuilderStore.getState().addElement(newElement);
    onClose();
  };

  const handleDelete = () => {
    if (!elementId) return;
    deleteElement(elementId);
    onClose();
  };

  const handleBringToFront = () => {
    if (!elementId) return;
    // Simulate z-index by updating element order
    const elements = Object.values(canvas.elements);
    const maxOrder = Math.max(...elements.map((el) => (el as any).order || 0));
    updateElement(elementId, { order: maxOrder + 1 } as any);
    onClose();
  };

  const handleSendToBack = () => {
    if (!elementId) return;
    const elements = Object.values(canvas.elements);
    const minOrder = Math.min(...elements.map((el) => (el as any).order || 0));
    updateElement(elementId, { order: minOrder - 1 } as any);
    onClose();
  };

  const menuItems = [
    { icon: Copy, label: 'Copy CSS', action: handleCopyCSS },
    { icon: Clipboard, label: 'Duplicate', action: handleDuplicate, shortcut: 'Ctrl+D' },
    { icon: Trash2, label: 'Delete', action: handleDelete, shortcut: 'Del', danger: true },
    { icon: ArrowUp, label: 'Bring to Front', action: handleBringToFront },
    { icon: ArrowDown, label: 'Send to Back', action: handleSendToBack },
  ];

  return (
    <div
      className="fixed bg-white rounded-lg shadow-2xl border border-gray-200 py-1 min-w-[200px] z-50"
      style={{ left: x, top: y }}
      onClick={(e) => e.stopPropagation()}
    >
      {menuItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <button
            key={index}
            onClick={item.action}
            className={`w-full px-4 py-2 flex items-center gap-3 hover:bg-gray-100 text-sm transition-colors ${
              item.danger ? 'text-red-600 hover:bg-red-50' : 'text-gray-700'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="flex-1 text-left">{item.label}</span>
            {item.shortcut && (
              <span className="text-xs text-gray-400">{item.shortcut}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
