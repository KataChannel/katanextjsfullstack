'use client';

import { useBlockEditorStore, selectSelectedBlock } from '@/lib/blocks/store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Settings, Code, X, ChevronRight, Plus, Trash2, Image as ImageIcon, MoveUp, MoveDown } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';

interface BlockInspectorProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function BlockInspector({ isOpen = true, onClose }: BlockInspectorProps) {
  const selectedBlock = useBlockEditorStore(selectSelectedBlock);
  const { updateBlock } = useBlockEditorStore();
  const [editingSlideIndex, setEditingSlideIndex] = useState<number | null>(null);
  const [slideFormData, setSlideFormData] = useState<any>(null);

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
            {selectedBlock.type === 'carousel' && (() => {
              const carouselContent = selectedBlock.content as any;
              const slides = carouselContent?.slides || [];
              const autoplay = carouselContent?.autoplay ?? true;
              const interval = carouselContent?.interval || 5000;

              const handleAddSlide = () => {
                const newSlide = {
                  id: `slide-${Date.now()}`,
                  image: 'https://placehold.co/1200x600',
                  title: 'Tiêu đề mới',
                  subtitle: 'Tiêu đề phụ',
                  description: 'Mô tả slide',
                  badge: 'Label',
                  badgeHighlight: 'Highlight',
                };
                setSlideFormData(newSlide);
                setEditingSlideIndex(slides.length);
              };

              const handleEditSlide = (index: number) => {
                setSlideFormData({ ...slides[index] });
                setEditingSlideIndex(index);
              };

              const handleDeleteSlide = (index: number) => {
                const newSlides = slides.filter((_: any, i: number) => i !== index);
                updateBlock(selectedBlock.id, {
                  content: { ...carouselContent, slides: newSlides }
                });
              };

              const handleMoveSlide = (index: number, direction: 'up' | 'down') => {
                const newSlides = [...slides];
                const targetIndex = direction === 'up' ? index - 1 : index + 1;
                if (targetIndex < 0 || targetIndex >= slides.length) return;
                [newSlides[index], newSlides[targetIndex]] = [newSlides[targetIndex], newSlides[index]];
                updateBlock(selectedBlock.id, {
                  content: { ...carouselContent, slides: newSlides }
                });
              };

              const handleSaveSlide = () => {
                if (editingSlideIndex === null || !slideFormData) return;
                const newSlides = [...slides];
                if (editingSlideIndex >= slides.length) {
                  newSlides.push(slideFormData);
                } else {
                  newSlides[editingSlideIndex] = slideFormData;
                }
                updateBlock(selectedBlock.id, {
                  content: { ...carouselContent, slides: newSlides }
                });
                setEditingSlideIndex(null);
                setSlideFormData(null);
              };

              return (
                <div className="space-y-4">
                  {/* Autoplay & Interval */}
                  <div className="space-y-3 pb-3 border-b">
                    <div className="flex items-center justify-between gap-4">
                      <Label className="text-sm font-medium">Tự động chuyển</Label>
                      <Switch
                        checked={autoplay}
                        onCheckedChange={(checked) => updateBlock(selectedBlock.id, {
                          content: { ...carouselContent, autoplay: checked }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Thời gian chuyển (ms)</Label>
                      <Input
                        type="number"
                        placeholder="5000"
                        value={interval}
                        onChange={(e) => updateBlock(selectedBlock.id, {
                          content: { ...carouselContent, interval: parseInt(e.target.value) || 5000 }
                        })}
                      />
                    </div>
                  </div>

                  {/* Slides List */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Slides ({slides.length})</Label>
                      <Button
                        size="sm"
                        onClick={handleAddSlide}
                        className="h-8 text-xs gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        Thêm slide
                      </Button>
                    </div>

                    {slides.length === 0 && (
                      <div className="text-center py-8 text-gray-400 border-2 border-dashed rounded-lg">
                        <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Chưa có slide nào</p>
                      </div>
                    )}

                    <div className="space-y-2">
                      {slides.map((slide: any, index: number) => (
                        <div
                          key={slide.id}
                          className="border rounded-lg p-3 space-y-2 hover:border-blue-300 transition"
                        >
                          <div className="flex items-start gap-2">
                            <div
                              className="w-16 h-16 rounded bg-cover bg-center shrink-0"
                              style={{ backgroundImage: `url(${slide.image})` }}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{slide.title}</p>
                              <p className="text-xs text-gray-500 truncate">{slide.subtitle}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditSlide(index)}
                              className="h-7 text-xs flex-1"
                            >
                              Sửa
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleMoveSlide(index, 'up')}
                              disabled={index === 0}
                              className="h-7 w-7 p-0"
                            >
                              <MoveUp className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleMoveSlide(index, 'down')}
                              disabled={index === slides.length - 1}
                              className="h-7 w-7 p-0"
                            >
                              <MoveDown className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteSlide(index)}
                              className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Edit Slide Dialog */}
                  <Dialog open={editingSlideIndex !== null} onOpenChange={(open) => {
                    if (!open) {
                      setEditingSlideIndex(null);
                      setSlideFormData(null);
                    }
                  }}>
                    <DialogContent className="flex flex-col max-h-[90vh] w-[95vw] max-w-2xl p-0">
                      <DialogHeader className="px-4 sm:px-6 py-4 border-b shrink-0">
                        <DialogTitle className="text-lg sm:text-xl">
                          {editingSlideIndex !== null && editingSlideIndex >= slides.length ? 'Thêm slide mới' : 'Chỉnh sửa slide'}
                        </DialogTitle>
                        <DialogDescription className="text-sm text-gray-500">
                          Cập nhật thông tin slide cho carousel
                        </DialogDescription>
                      </DialogHeader>

                      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">URL hình ảnh</Label>
                            <Input
                              placeholder="https://placehold.co/1200x600"
                              value={slideFormData?.image || ''}
                              onChange={(e) => setSlideFormData({ ...slideFormData, image: e.target.value })}
                            />
                            {slideFormData?.image && (
                              <div
                                className="w-full h-32 rounded bg-cover bg-center border"
                                style={{ backgroundImage: `url(${slideFormData.image})` }}
                              />
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Tiêu đề chính</Label>
                            <Input
                              placeholder="CÂU CHUYỆN"
                              value={slideFormData?.title || ''}
                              onChange={(e) => setSlideFormData({ ...slideFormData, title: e.target.value })}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Tiêu đề phụ</Label>
                            <Input
                              placeholder="Về INNERBRIGHT"
                              value={slideFormData?.subtitle || ''}
                              onChange={(e) => setSlideFormData({ ...slideFormData, subtitle: e.target.value })}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Mô tả</Label>
                            <Textarea
                              placeholder="Mô tả chi tiết về slide..."
                              value={slideFormData?.description || ''}
                              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSlideFormData({ ...slideFormData, description: e.target.value })}
                              rows={3}
                              className="resize-none"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Badge (tùy chọn)</Label>
                              <Input
                                placeholder="Bởi nhà đào tạo"
                                value={slideFormData?.badge || ''}
                                onChange={(e) => setSlideFormData({ ...slideFormData, badge: e.target.value })}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Badge Highlight (tùy chọn)</Label>
                              <Input
                                placeholder="CHLOE QUÝ CHÂU"
                                value={slideFormData?.badgeHighlight || ''}
                                onChange={(e) => setSlideFormData({ ...slideFormData, badgeHighlight: e.target.value })}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <DialogFooter className="px-4 sm:px-6 py-4 border-t shrink-0 flex-row gap-2 justify-end">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setEditingSlideIndex(null);
                            setSlideFormData(null);
                          }}
                          className="min-w-20"
                        >
                          Hủy
                        </Button>
                        <Button
                          onClick={handleSaveSlide}
                          className="min-w-20"
                        >
                          Lưu
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              );
            })()}

            {selectedBlock.type === 'text' && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Nội dung văn bản</Label>
                <Input placeholder="Nhập văn bản..." defaultValue={(selectedBlock.content as any).text || ''} onChange={(e) => updateBlock(selectedBlock.id, { content: { ...selectedBlock.content, text: e.target.value } })} className="text-sm" />
              </div>
            )}
            
            {selectedBlock.type === 'html' && (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    Custom HTML Code
                  </Label>
                  <Textarea
                    placeholder="<div>Your HTML here...</div>"
                    defaultValue={(selectedBlock.content as any).html || ''}
                    onChange={(e) => updateBlock(selectedBlock.id, { content: { ...selectedBlock.content, html: e.target.value } })}
                    className="font-mono text-xs min-h-[200px]"
                    rows={10}
                  />
                  <p className="text-xs text-muted-foreground">
                    Nhập HTML tùy chỉnh. Code sẽ được render trực tiếp trên trang.
                  </p>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="sanitize-html" className="text-xs font-medium cursor-pointer">
                      Sanitize HTML
                    </Label>
                    <Badge variant="outline" className="text-[10px]">Tùy chọn</Badge>
                  </div>
                  <Switch
                    id="sanitize-html"
                    checked={(selectedBlock.content as any).sanitize || false}
                    onCheckedChange={(checked) => updateBlock(selectedBlock.id, { content: { ...selectedBlock.content, sanitize: checked } })}
                  />
                </div>
                
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
                  <div className="flex items-center gap-2 text-blue-900">
                    <Code className="w-4 h-4" />
                    <span className="text-xs font-semibold">Tips</span>
                  </div>
                  <ul className="text-xs text-blue-800 space-y-1 pl-4">
                    <li>• Sử dụng Tailwind CSS classes</li>
                    <li>• Embed scripts, iframes, widgets</li>
                    <li>• HTML tùy chỉnh hoàn toàn</li>
                  </ul>
                </div>
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
