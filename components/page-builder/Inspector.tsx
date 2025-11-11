'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Undo2, Redo2, Trash2 } from 'lucide-react';
import { useBuilderStore } from '@/lib/page-builder/store';

/**
 * Inspector Panel
 * - Style editor
 * - Layout editor
 * - Undo/Redo controls
 */
export function Inspector() {
  const canvas = useBuilderStore((state) => state.canvas);
  const { updateElement, deleteElement, undo, redo, canUndo, canRedo } = useBuilderStore();

  const selectedId = canvas.selectedIds[0];
  const selectedElement = selectedId ? canvas.elements[selectedId] : null;

  if (!selectedElement) {
    return (
      <div className="w-full h-full bg-white border-l border-gray-200 p-4">
        <p className="text-sm text-gray-500 text-center mt-8">
          Chọn một element để chỉnh sửa
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white border-l border-gray-200 flex flex-col">
      {/* Header với Undo/Redo */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Inspector</h2>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={undo}
            disabled={!canUndo()}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={redo}
            disabled={!canRedo()}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => deleteElement(selectedId)}
            title="Delete (Delete)"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      </div>

      {/* Tabs cho Style và Layout */}
      <div className="flex-1 overflow-y-auto p-4">
        <Tabs defaultValue="style" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="style">Style</TabsTrigger>
            <TabsTrigger value="layout">Layout</TabsTrigger>
          </TabsList>

          <TabsContent value="style" className="space-y-4 mt-4">
            {/* Background Color */}
            {(selectedElement.type === 'container' || selectedElement.type === 'button') && (
              <div className="space-y-2">
                <Label htmlFor="bg-color">Màu nền</Label>
                <div className="flex gap-2">
                  <Input
                    id="bg-color"
                    type="color"
                    value={selectedElement.style?.backgroundColor || '#ffffff'}
                    onChange={(e) =>
                      updateElement(selectedId, {
                        style: { ...selectedElement.style, backgroundColor: e.target.value },
                      })
                    }
                    className="w-20 h-10"
                  />
                  <Input
                    type="text"
                    value={selectedElement.style?.backgroundColor || '#ffffff'}
                    onChange={(e) =>
                      updateElement(selectedId, {
                        style: { ...selectedElement.style, backgroundColor: e.target.value },
                      })
                    }
                    className="flex-1"
                  />
                </div>
              </div>
            )}

            {/* Text Color */}
            {(selectedElement.type === 'text' ||
              selectedElement.type === 'heading' ||
              selectedElement.type === 'button') && (
              <div className="space-y-2">
                <Label htmlFor="text-color">Màu chữ</Label>
                <div className="flex gap-2">
                  <Input
                    id="text-color"
                    type="color"
                    value={selectedElement.style?.color || '#000000'}
                    onChange={(e) =>
                      updateElement(selectedId, {
                        style: { ...selectedElement.style, color: e.target.value },
                      })
                    }
                    className="w-20 h-10"
                  />
                  <Input
                    type="text"
                    value={selectedElement.style?.color || '#000000'}
                    onChange={(e) =>
                      updateElement(selectedId, {
                        style: { ...selectedElement.style, color: e.target.value },
                      })
                    }
                    className="flex-1"
                  />
                </div>
              </div>
            )}

            {/* Font Size */}
            {(selectedElement.type === 'text' ||
              selectedElement.type === 'heading' ||
              selectedElement.type === 'button') && (
              <div className="space-y-2">
                <Label htmlFor="font-size">Cỡ chữ</Label>
                <Input
                  id="font-size"
                  type="number"
                  value={selectedElement.style?.fontSize || 16}
                  onChange={(e) =>
                    updateElement(selectedId, {
                      style: { ...selectedElement.style, fontSize: parseInt(e.target.value) },
                    })
                  }
                  min={8}
                  max={120}
                />
              </div>
            )}

            {/* Border Radius */}
            <div className="space-y-2">
              <Label htmlFor="border-radius">Bo góc</Label>
              <Input
                id="border-radius"
                type="number"
                value={selectedElement.style?.borderRadius || 0}
                onChange={(e) =>
                  updateElement(selectedId, {
                    style: { ...selectedElement.style, borderRadius: parseInt(e.target.value) },
                  })
                }
                min={0}
                max={100}
              />
            </div>

            {/* Opacity */}
            <div className="space-y-2">
              <Label htmlFor="opacity">Độ mờ</Label>
              <Input
                id="opacity"
                type="range"
                value={selectedElement.style?.opacity || 1}
                onChange={(e) =>
                  updateElement(selectedId, {
                    style: { ...selectedElement.style, opacity: parseFloat(e.target.value) },
                  })
                }
                min={0}
                max={1}
                step={0.1}
              />
              <span className="text-sm text-gray-500">
                {Math.round((selectedElement.style?.opacity || 1) * 100)}%
              </span>
            </div>
          </TabsContent>

          <TabsContent value="layout" className="space-y-4 mt-4">
            {/* Width & Height */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="width">Rộng</Label>
                <Input
                  id="width"
                  type="number"
                  value={selectedElement.width}
                  onChange={(e) =>
                    updateElement(selectedId, {
                      width: parseInt(e.target.value),
                    })
                  }
                  min={10}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Cao</Label>
                <Input
                  id="height"
                  type="number"
                  value={selectedElement.height}
                  onChange={(e) =>
                    updateElement(selectedId, {
                      height: parseInt(e.target.value),
                    })
                  }
                  min={10}
                />
              </div>
            </div>

            {/* X & Y Position */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="x">X</Label>
                <Input
                  id="x"
                  type="number"
                  value={selectedElement.x}
                  onChange={(e) =>
                    updateElement(selectedId, {
                      x: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="y">Y</Label>
                <Input
                  id="y"
                  type="number"
                  value={selectedElement.y}
                  onChange={(e) =>
                    updateElement(selectedId, {
                      y: parseInt(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            {/* Padding */}
            {selectedElement.type === 'container' && (
              <div className="space-y-2">
                <Label htmlFor="padding">Padding</Label>
                <Input
                  id="padding"
                  type="number"
                  value={selectedElement.layout?.padding || 0}
                  onChange={(e) =>
                    updateElement(selectedId, {
                      layout: { ...selectedElement.layout, padding: parseInt(e.target.value) },
                    })
                  }
                  min={0}
                />
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Element Info */}
        <Card className="p-3 mt-6 bg-gray-50">
          <div className="text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600">ID:</span>
              <span className="font-mono">{selectedElement.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Type:</span>
              <span className="font-mono">{selectedElement.type}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
