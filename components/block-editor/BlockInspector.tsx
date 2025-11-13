'use client';

/**
 * Block Inspector - Properties panel
 */

import { useBlockEditorStore, selectSelectedBlock } from '@/lib/blocks/store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Settings, Palette, Code } from 'lucide-react';

export function BlockInspector() {
  const selectedBlock = useBlockEditorStore(selectSelectedBlock);
  const { updateBlock } = useBlockEditorStore();

  if (!selectedBlock) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Inspector</h2>
        </div>
        <div className="flex-1 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <Settings className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Select a block to edit</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Inspector</h2>
          <Badge variant="outline" className="text-xs">
            {selectedBlock.type}
          </Badge>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {selectedBlock.name || 'Unnamed block'}
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="content" className="flex-1 flex flex-col">
        <TabsList className="w-full grid grid-cols-3 mx-4 mt-4">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="styles">Styles</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Content Tab */}
        <TabsContent value="content" className="flex-1 overflow-auto p-4 mt-0 space-y-4">
          {selectedBlock.type === 'text' && (
            <>
              <div className="space-y-2">
                <Label>Text Content</Label>
                <Input
                  placeholder="Enter text..."
                  defaultValue={(selectedBlock.content as any).text || ''}
                  onChange={(e) =>
                    updateBlock(selectedBlock.id, {
                      content: { ...selectedBlock.content, text: e.target.value },
                    })
                  }
                />
              </div>
            </>
          )}

          {selectedBlock.type === 'button' && (
            <>
              <div className="space-y-2">
                <Label>Button Text</Label>
                <Input
                  placeholder="Click me"
                  defaultValue={(selectedBlock.content as any).text || ''}
                  onChange={(e) =>
                    updateBlock(selectedBlock.id, {
                      content: { ...selectedBlock.content, text: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Link URL</Label>
                <Input
                  placeholder="https://..."
                  defaultValue={(selectedBlock.content as any).link || ''}
                  onChange={(e) =>
                    updateBlock(selectedBlock.id, {
                      content: { ...selectedBlock.content, link: e.target.value },
                    })
                  }
                />
              </div>
            </>
          )}

          {selectedBlock.type === 'image' && (
            <>
              <div className="space-y-2">
                <Label>Image URL</Label>
                <Input
                  placeholder="https://..."
                  defaultValue={(selectedBlock.content as any).url || ''}
                  onChange={(e) =>
                    updateBlock(selectedBlock.id, {
                      content: { ...selectedBlock.content, url: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Alt Text</Label>
                <Input
                  placeholder="Image description"
                  defaultValue={(selectedBlock.content as any).alt || ''}
                  onChange={(e) =>
                    updateBlock(selectedBlock.id, {
                      content: { ...selectedBlock.content, alt: e.target.value },
                    })
                  }
                />
              </div>
            </>
          )}
        </TabsContent>

        {/* Styles Tab */}
        <TabsContent value="styles" className="flex-1 overflow-auto p-4 mt-0 space-y-4">
          <div className="space-y-2">
            <Label>Container Classes</Label>
            <Input
              placeholder="flex gap-4 p-6"
              defaultValue={selectedBlock.styles.container || ''}
              onChange={(e) =>
                updateBlock(selectedBlock.id, {
                  styles: { ...selectedBlock.styles, container: e.target.value },
                })
              }
              className="font-mono text-xs"
            />
          </div>

          <div className="space-y-2">
            <Label>Element Classes</Label>
            <Input
              placeholder="text-2xl font-bold"
              defaultValue={selectedBlock.styles.element || ''}
              onChange={(e) =>
                updateBlock(selectedBlock.id, {
                  styles: { ...selectedBlock.styles, element: e.target.value },
                })
              }
              className="font-mono text-xs"
            />
          </div>

          <div className="p-3 bg-blue-50 rounded-lg text-xs text-blue-800">
            <Code className="w-4 h-4 inline mr-1" />
            Use Tailwind CSS classes
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="flex-1 overflow-auto p-4 mt-0 space-y-4">
          <div className="space-y-2">
            <Label>Block Name</Label>
            <Input
              placeholder="Unnamed block"
              defaultValue={selectedBlock.name || ''}
              onChange={(e) =>
                updateBlock(selectedBlock.id, {
                  name: e.target.value,
                })
              }
            />
          </div>

          <div className="text-xs text-gray-500">
            More settings coming soon...
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
