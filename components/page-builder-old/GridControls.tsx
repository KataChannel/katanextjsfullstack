'use client';

import React from 'react';
import { useBuilderStore, GridSize } from '@/lib/page-builder/store';
import { Grid3x3, Magnet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

/**
 * Grid Controls Toolbar
 * - Grid size selector (1px, 4px, 8px, 12px, 16px)
 * - Show/Hide grid
 * - Magnetic alignment
 * - Snap to grid
 */
export function GridControls() {
  const canvas = useBuilderStore((state) => state.canvas);
  const { setGridSize, toggleSnapToGrid, toggleShowGrid, toggleMagneticAlignment } = useBuilderStore();
  const [open, setOpen] = React.useState(false);

  const gridSizes: { value: GridSize; label: string }[] = [
    { value: 1, label: '1px - Preciso' },
    { value: 4, label: '4px - Fino' },
    { value: 8, label: '8px - Padrão' },
    { value: 12, label: '12px - Largo' },
    { value: 16, label: '16px - Espaçado' },
  ];

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-white border-b border-gray-200">
      {/* Grid Size Selector */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Grid3x3 className="w-4 h-4" />
            <span>Grid: {canvas.gridSize}px</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Chọn kích thước..." />
            <CommandList>
              <CommandEmpty>Không tìm thấy</CommandEmpty>
              <CommandGroup>
                {gridSizes.map((size) => (
                  <CommandItem
                    key={size.value}
                    value={size.value.toString()}
                    onSelect={() => {
                      setGridSize(size.value);
                      setOpen(false);
                    }}
                  >
                    <span
                      className={`flex-1 ${
                        canvas.gridSize === size.value ? 'font-semibold' : ''
                      }`}
                    >
                      {size.label}
                    </span>
                    {canvas.gridSize === size.value && (
                      <span className="text-blue-600">✓</span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Snap to Grid */}
      <Button
        variant={canvas.snapToGrid ? 'default' : 'outline'}
        size="sm"
        onClick={toggleSnapToGrid}
        title="Snap to Grid"
      >
        Snap
      </Button>

      {/* Show Grid */}
      <Button
        variant={canvas.showGrid ? 'default' : 'outline'}
        size="sm"
        onClick={toggleShowGrid}
        title="Show/Hide Grid"
      >
        Grid
      </Button>

      {/* Magnetic Alignment */}
      <Button
        variant={canvas.magneticAlignment ? 'default' : 'outline'}
        size="sm"
        onClick={toggleMagneticAlignment}
        title="Magnetic Alignment"
        className="flex items-center gap-1"
      >
        <Magnet className="w-4 h-4" />
        Magnetic
      </Button>
    </div>
  );
}
