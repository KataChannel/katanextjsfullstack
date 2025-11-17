'use client';

import { useBlockEditorStore, selectSelectedBlock } from '@/lib/blocks/store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Settings, Code, X, ChevronRight } from 'lucide-react';

interface BlockInspectorProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function BlockInspector({ isOpen = true, onClose }: BlockInspectorProps) {
  const selectedBlock = useBlockEditorStore(selectSelectedBlock);
  const { updateBlock } = useBlockEditorStore();

  if (!selectedBlock) {
    return (
      <>
        {isOpen && onClose && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />
        )}
        <div className={`fixed lg:relative inset-y-0 right-0 z-50 lg:z-auto w-full sm:w-96 lg:w-80 bg-white border-l border-gray-200 flex flex-col transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'} shadow-2xl lg:shadow-none`}>
          <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Inspector</h2>
            {onClose && <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden"><X className="w-5 h-5" /></Button>}
          </div>
          <div className="flex-1 flex items-center justify-center p-4 text-gray-400">
            <div className="text-center">
              <Settings className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Chọn block để chỉnh sửa</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {isOpen && onClose && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />}
      <div className={`fixed lg:relative inset-y-0 right-0 z-50 lg:z-auto w-full sm:w-96 lg:w-80 bg-white border-l border-gray-200 flex flex-col transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'} shadow-2xl lg:shadow-none`}>
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {onClose && <Button variant="ghost" size="sm" onClick={onClose} className="lg:hidden"><ChevronRight className="w-5 h-5" /></Button>}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold truncate">Inspector</h2>
                  <Badge variant="outline" className="text-xs">{selectedBlock.type}</Badge>
                </div>
                <p className="text-xs text-gray-500 truncate">{selectedBlock.name || 'Unnamed'}</p>
              </div>
            </div>
            {onClose && <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden"><X className="w-5 h-5" /></Button>}
          </div>
        </div>
        
        <Tabs defaultValue="content" className="flex-1 flex flex-col min-h-0">
          <div className="px-4 pt-3 shrink-0">
            <TabsList className="w-full grid grid-cols-3 h-9">
              <TabsTrigger value="content" className="text-xs sm:text-sm">Nội dung</TabsTrigger>
              <TabsTrigger value="styles" className="text-xs sm:text-sm">Styles</TabsTrigger>
              <TabsTrigger value="settings" className="text-xs sm:text-sm">Cài đặt</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="content" className="flex-1 overflow-y-auto mt-0 px-4 py-4 space-y-4">
            {selectedBlock.type === 'text' && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Nội dung văn bản</Label>
                <Input placeholder="Nhập văn bản..." defaultValue={(selectedBlock.content as any).text || ''} onChange={(e) => updateBlock(selectedBlock.id, { content: { ...selectedBlock.content, text: e.target.value } })} className="text-sm" />
              </div>
            )}
            {selectedBlock.type === 'button' && (
              <>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Văn bản nút</Label>
                  <Input placeholder="Click me" defaultValue={(selectedBlock.content as any).text || ''} onChange={(e) => updateBlock(selectedBlock.id, { content: { ...selectedBlock.content, text: e.target.value } })} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Link URL</Label>
                  <Input placeholder="https://..." defaultValue={(selectedBlock.content as any).link || ''} onChange={(e) => updateBlock(selectedBlock.id, { content: { ...selectedBlock.content, link: e.target.value } })} />
                </div>
              </>
            )}
            {selectedBlock.type === 'image' && (
              <>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">URL hình ảnh</Label>
                  <Input placeholder="https://..." defaultValue={(selectedBlock.content as any).url || ''} onChange={(e) => updateBlock(selectedBlock.id, { content: { ...selectedBlock.content, url: e.target.value } })} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Alt Text</Label>
                  <Input placeholder="Mô tả" defaultValue={(selectedBlock.content as any).alt || ''} onChange={(e) => updateBlock(selectedBlock.id, { content: { ...selectedBlock.content, alt: e.target.value } })} />
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="styles" className="flex-1 overflow-y-auto mt-0 px-4 py-4 space-y-4">
            <div className="space-y-2">
              <Label>Container Classes</Label>
              <Input placeholder="flex gap-4 p-6" defaultValue={selectedBlock.styles.container || ''} onChange={(e) => updateBlock(selectedBlock.id, { styles: { ...selectedBlock.styles, container: e.target.value } })} className="font-mono text-xs" />
            </div>
            <div className="space-y-2">
              <Label>Element Classes</Label>
              <Input placeholder="text-2xl font-bold" defaultValue={selectedBlock.styles.element || ''} onChange={(e) => updateBlock(selectedBlock.id, { styles: { ...selectedBlock.styles, element: e.target.value } })} className="font-mono text-xs" />
            </div>
            <div className="p-3 bg-blue-50 rounded-lg text-xs text-blue-800 flex gap-2">
              <Code className="w-4 h-4" />
              <span>Sử dụng Tailwind CSS</span>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="flex-1 overflow-y-auto mt-0 px-4 py-4 space-y-4">
            <div className="space-y-2">
              <Label>Tên block</Label>
              <Input placeholder="Chưa đặt tên" defaultValue={selectedBlock.name || ''} onChange={(e) => updateBlock(selectedBlock.id, { name: e.target.value })} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
