'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Building2, Type, Image, Square, Heading } from 'lucide-react';
import { useBuilderStore, BuilderElement, ElementType } from '@/lib/page-builder/store';

/**
 * Component templates để kéo vào canvas
 */
const componentTemplates: Array<{
  type: ElementType;
  label: string;
  icon: React.ReactNode;
  defaultProps: Partial<BuilderElement>;
}> = [
  {
    type: 'container',
    label: 'Container',
    icon: <Square className="w-5 h-5" />,
    defaultProps: {
      width: 400,
      height: 300,
      layout: {
        display: 'flex',
        flexDirection: 'column',
        padding: 16,
      },
      style: {
        backgroundColor: '#f9fafb',
        borderRadius: 8,
      },
      states: {
        default: {
          backgroundColor: '#f9fafb',
        },
      },
      animation: {
        type: 'none',
      },
    },
  },
  {
    type: 'heading',
    label: 'Heading',
    icon: <Heading className="w-5 h-5" />,
    defaultProps: {
      content: 'Tiêu đề',
      width: 300,
      height: 48,
      layout: {},
      style: {
        fontSize: 32,
        fontWeight: 700,
        color: '#111827',
      },
      states: {
        default: {
          color: '#111827',
        },
      },
      animation: {
        type: 'fade',
        duration: 0.5,
        trigger: 'scroll',
      },
    },
  },
  {
    type: 'text',
    label: 'Text',
    icon: <Type className="w-5 h-5" />,
    defaultProps: {
      content: 'Nội dung text',
      width: 300,
      height: 24,
      layout: {},
      style: {
        fontSize: 16,
        fontWeight: 400,
        color: '#374151',
      },
      states: {
        default: {
          color: '#374151',
        },
      },
      animation: {
        type: 'fade',
        duration: 0.3,
        trigger: 'scroll',
      },
    },
  },
  {
    type: 'button',
    label: 'Button',
    icon: <Building2 className="w-5 h-5" />,
    defaultProps: {
      content: 'Click me',
      width: 160,
      height: 44,
      layout: {
        padding: 12,
      },
      style: {
        backgroundColor: '#2563eb',
        color: '#ffffff',
        fontSize: 14,
        fontWeight: 600,
        borderRadius: 6,
      },
      states: {
        default: {
          backgroundColor: '#2563eb',
        },
        hover: {
          backgroundColor: '#1d4ed8',
        },
        active: {
          backgroundColor: '#1e40af',
        },
      },
      animation: {
        type: 'scale',
        duration: 0.2,
        trigger: 'hover',
      },
    },
  },
  {
    type: 'image',
    label: 'Image',
    icon: <Image className="w-5 h-5" />,
    defaultProps: {
      src: '/placeholder.jpg',
      width: 400,
      height: 300,
      layout: {},
      style: {
        borderRadius: 8,
      },
      states: {
        default: {
          opacity: 1,
        },
        hover: {
          opacity: 0.9,
        },
      },
      animation: {
        type: 'fade',
        duration: 0.5,
        trigger: 'scroll',
      },
    },
  },
];

/**
 * Sidebar với component palette
 */
export function ComponentSidebar() {
  const addElement = useBuilderStore((state) => state.addElement);

  const handleAddComponent = (template: typeof componentTemplates[0]) => {
    const newElement: BuilderElement = {
      id: `${template.type}-${Date.now()}`,
      type: template.type,
      name: `${template.label} ${Date.now()}`,
      x: 100,
      y: 100,
      ...template.defaultProps,
    } as BuilderElement;

    addElement(newElement);
  };

  return (
    <div className="w-full h-full bg-white border-r border-gray-200 p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Components</h2>
      
      <div className="space-y-2">
        {componentTemplates.map((template) => (
          <Card
            key={template.type}
            className="p-3 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => handleAddComponent(template)}
          >
            <div className="flex items-center gap-3">
              <div className="text-gray-600">{template.icon}</div>
              <span className="text-sm font-medium">{template.label}</span>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-semibold mb-2 text-gray-600">Hướng dẫn</h3>
        <ul className="text-xs text-gray-500 space-y-1">
          <li>• Click component để thêm vào canvas</li>
          <li>• Kéo để di chuyển</li>
          <li>• Ctrl/Cmd + Click để chọn nhiều</li>
          <li>• Kéo góc để resize</li>
        </ul>
      </div>
    </div>
  );
}
