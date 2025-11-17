'use client';

/**
 * Block Toolbar - Top toolbar with actions
 */

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  useBlockEditorStore,
  selectCanUndo,
  selectCanRedo,
} from '@/lib/blocks/store';
import {
  Save,
  Undo2,
  Redo2,
  Eye,
  Monitor,
  Tablet,
  Smartphone,
  Grid3x3,
  Settings,
  Bookmark,
} from 'lucide-react';

interface BlockToolbarProps {
  onSave?: () => void;
  onSaveAsTemplate?: () => void;
}

export function BlockToolbar({ onSave, onSaveAsTemplate }: BlockToolbarProps) {
  const {
    undo,
    redo,
    viewMode,
    setViewMode,
    canvasSettings,
    updateCanvasSettings,
    selectedBlockId,
  } = useBlockEditorStore();
  
  const canUndo = useBlockEditorStore(selectCanUndo);
  const canRedo = useBlockEditorStore(selectCanRedo);

  return (
    <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
      {/* Left section */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={undo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={redo}
          disabled={!canRedo}
          title="Redo (Ctrl+Y)"
        >
          <Redo2 className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 mx-2" />

        <Button
          variant={canvasSettings.showGrid ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() =>
            updateCanvasSettings({ showGrid: !canvasSettings.showGrid })
          }
          title="Toggle Grid"
        >
          <Grid3x3 className="w-4 h-4" />
        </Button>
      </div>

      {/* Center section - View mode */}
      <div className="flex items-center gap-1">
        <Button
          variant={viewMode === 'desktop' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setViewMode('desktop')}
          title="Desktop view"
        >
          <Monitor className="w-4 h-4" />
        </Button>
        <Button
          variant={viewMode === 'tablet' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setViewMode('tablet')}
          title="Tablet view"
        >
          <Tablet className="w-4 h-4" />
        </Button>
        <Button
          variant={viewMode === 'mobile' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setViewMode('mobile')}
          title="Mobile view"
        >
          <Smartphone className="w-4 h-4" />
        </Button>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2">
        {onSaveAsTemplate && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onSaveAsTemplate}
            disabled={!selectedBlockId}
            title="Save selected block as template"
          >
            <Bookmark className="w-4 h-4 mr-2" />
            Save as Template
          </Button>
        )}
        <Button variant="ghost" size="sm" title="Preview">
          <Eye className="w-4 h-4 mr-2" />
          Preview
        </Button>
        <Button onClick={onSave} size="sm">
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
      </div>
    </div>
  );
}
