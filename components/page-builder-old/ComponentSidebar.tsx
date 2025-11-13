'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Building2, Type, Image, Square, Heading, ImagePlay, Blocks } from 'lucide-react';
import { useBuilderStore, BuilderElement, ElementType } from '@/lib/page-builder/store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

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
  {
    type: 'carousel',
    label: 'Carousel',
    icon: <ImagePlay className="w-5 h-5" />,
    defaultProps: {
      width: 1200,
      height: 500,
      layout: {},
      style: {
        borderRadius: 0,
      },
      states: {
        default: {},
      },
      animation: {
        type: 'none',
      },
      carousel: {
        slides: [
          {
            id: 'slide-1',
            image: '/api/placeholder/1200/500',
            title: 'Slide 1',
            description: 'Mô tả slide 1',
            alt: 'Slide 1',
          },
          {
            id: 'slide-2',
            image: '/api/placeholder/1200/500',
            title: 'Slide 2',
            description: 'Mô tả slide 2',
            alt: 'Slide 2',
          },
          {
            id: 'slide-3',
            image: '/api/placeholder/1200/500',
            title: 'Slide 3',
            description: 'Mô tả slide 3',
            alt: 'Slide 3',
          },
        ],
        autoPlay: true,
        interval: 5000,
        showDots: true,
        showArrows: true,
        height: 500,
      },
    },
  },
];

/**
 * Sidebar với component palette và block templates
 */
export function ComponentSidebar() {
  const addElement = useBuilderStore((state) => state.addElement);
  const [templates, setTemplates] = useState<any[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await fetch('/api/block-templates');
      if (res.ok) {
        const data = await res.json();
        setTemplates(data);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoadingTemplates(false);
    }
  };

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

  const handleAddTemplate = (template: any) => {
    if (!template.elements || template.elements.length === 0) {
      toast.error('Template không có elements');
      return;
    }

    console.log('🎨 Adding template:', template.name);
    console.log('📦 Elements count:', template.elements.length);

    // Tìm bounding box của template
    const minX = Math.min(...template.elements.map((el: any) => el.x || 0));
    const minY = Math.min(...template.elements.map((el: any) => el.y || 0));
    const maxX = Math.max(...template.elements.map((el: any) => (el.x || 0) + (el.width || 0)));
    const maxY = Math.max(...template.elements.map((el: any) => (el.y || 0) + (el.height || 0)));
    
    const templateWidth = maxX - minX;
    const templateHeight = maxY - minY;

    // Tạo container wrapper cho template
    const containerId = `template-container-${Date.now()}`;
    const containerElement: BuilderElement = {
      id: containerId,
      type: 'container',
      name: `Template: ${template.name}`,
      x: 100,
      y: 100,
      width: templateWidth + 40, // Thêm padding
      height: templateHeight + 40,
      layout: {
        display: 'block',
        padding: 20,
      },
      style: {
        backgroundColor: 'transparent',
        border: '1px dashed #e5e7eb',
      },
      states: {
        default: {
          backgroundColor: 'transparent',
        },
      },
      animation: {
        type: 'none',
      },
      children: [],
    };

    // Add container trước
    addElement(containerElement);
    console.log('✅ Created container:', containerId);

    // Thêm tất cả elements vào container với position relative
    let successCount = 0;
    const childIds: string[] = [];
    
    template.elements.forEach((element: BuilderElement, index: number) => {
      try {
        const childId = `${element.type}-${Date.now()}-${index}`;
        const newElement: BuilderElement = {
          ...element,
          id: childId,
          // Position relative to container
          x: (element.x || 0) - minX + 20, // 20px padding
          y: (element.y || 0) - minY + 20,
          parentId: containerId,
        };
        addElement(newElement);
        childIds.push(childId);
        successCount++;
        console.log(`✅ Added child ${index + 1}:`, newElement.name || newElement.type);
      } catch (error) {
        console.error(`❌ Error adding element ${index}:`, error);
      }
    });

    // Update container children
    if (childIds.length > 0) {
      const { canvas } = useBuilderStore.getState();
      const updatedContainer = {
        ...canvas.elements[containerId],
        children: childIds,
      };
      useBuilderStore.setState({
        canvas: {
          ...canvas,
          elements: {
            ...canvas.elements,
            [containerId]: updatedContainer,
          },
        },
      });
    }

    console.log(`🎉 Template added! ${successCount}/${template.elements.length} elements in container`);
    toast.success(`Đã thêm template "${template.name}" (${successCount} elements)`);
  };

  return (
    <div className="w-full h-full bg-white border-r border-gray-200 overflow-hidden flex flex-col">
      <Tabs defaultValue="components" className="flex-1 flex flex-col">
        <div className="px-4 pt-4">
          <h2 className="text-lg font-semibold mb-3">Library</h2>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="templates">
              Templates
              {templates.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {templates.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="components" className="flex-1 overflow-y-auto px-4 mt-4">
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
        </TabsContent>

        <TabsContent value="templates" className="flex-1 overflow-y-auto px-4 mt-4">
          {loadingTemplates ? (
            <div className="text-center py-8 text-sm text-gray-500">Đang tải...</div>
          ) : templates.length === 0 ? (
            <div className="text-center py-8">
              <Blocks className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <p className="text-sm text-gray-500">Chưa có template nào</p>
            </div>
          ) : (
            <div className="space-y-3">
              {templates.map((template) => (
                <Card
                  key={template.id}
                  className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleAddTemplate(template)}
                >
                  {/* Preview Thumbnail */}
                  <div className="relative h-32 bg-linear-to-br from-blue-50 to-indigo-100">
                    {template.thumbnail ? (
                      <img
                        src={template.thumbnail}
                        alt={template.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Blocks className="h-8 w-8 text-gray-300" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <Badge variant="outline" className="text-xs bg-white/90 backdrop-blur-sm">
                        {template.elements.length} elements
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-3">
                    <h3 className="font-medium text-sm line-clamp-1 mb-1">
                      {template.name}
                    </h3>
                    {template.description && (
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {template.description}
                      </p>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-200 pb-4">
            <h3 className="text-sm font-semibold mb-2 text-gray-600">Templates</h3>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>• Click template để thêm vào canvas</li>
              <li>• Template sẽ giữ nguyên layout gốc</li>
              <li>• Có thể chỉnh sửa sau khi thêm</li>
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
