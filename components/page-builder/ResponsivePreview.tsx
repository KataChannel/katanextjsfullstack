'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Smartphone, Tablet, Monitor } from 'lucide-react';
import { useBuilderStore, Breakpoint } from '@/lib/page-builder/store';

/**
 * Breakpoint configurations
 */
const breakpoints = {
  mobile: { width: 375, height: 667, icon: Smartphone, label: 'Mobile' },
  tablet: { width: 768, height: 1024, icon: Tablet, label: 'Tablet' },
  desktop: { width: 1024, height: 768, icon: Monitor, label: 'Desktop' },
};

/**
 * Responsive Preview Component
 * Hiển thị preview với 3 breakpoints: 375, 768, 1024
 */
export function ResponsivePreview() {
  const canvas = useBuilderStore((state) => state.canvas);
  const setBreakpoint = useBuilderStore((state) => state.setBreakpoint);
  const [previewHtml, setPreviewHtml] = useState<string>('');

  const currentBreakpoint = breakpoints[canvas.currentBreakpoint];

  // Generate preview HTML
  const generatePreview = () => {
    const elements = Object.values(canvas.elements);
    
    // Simple HTML generation for preview
    let html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            body { margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; }
          </style>
        </head>
        <body>
    `;

    elements.forEach((el) => {
      const style = `
        position: absolute;
        left: ${el.x}px;
        top: ${el.y}px;
        width: ${el.width}px;
        height: ${el.height}px;
        background-color: ${el.style.backgroundColor || 'transparent'};
        color: ${el.style.color || '#000'};
        font-size: ${el.style.fontSize || 16}px;
        border-radius: ${el.style.borderRadius || 0}px;
        opacity: ${el.style.opacity || 1};
      `;

      if (el.type === 'text' || el.type === 'heading' || el.type === 'button') {
        html += `<div style="${style}">${el.content || ''}</div>\n`;
      } else if (el.type === 'container') {
        html += `<div style="${style}"></div>\n`;
      } else if (el.type === 'image') {
        html += `<img src="${el.src || ''}" style="${style}" alt="" />\n`;
      }
    });

    html += `
        </body>
      </html>
    `;

    setPreviewHtml(html);
  };

  return (
    <div className="w-full h-full bg-gray-50 flex flex-col">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 p-3 flex items-center justify-between">
        <div className="flex gap-2">
          {(Object.entries(breakpoints) as [Breakpoint, typeof breakpoints.mobile][]).map(
            ([key, config]) => {
              const Icon = config.icon;
              return (
                <Button
                  key={key}
                  variant={canvas.currentBreakpoint === key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setBreakpoint(key)}
                  className="flex items-center gap-2"
                >
                  <Icon className="w-4 h-4" />
                  <span>{config.label}</span>
                  <span className="text-xs text-gray-500">{config.width}px</span>
                </Button>
              );
            }
          )}
        </div>

        <Button onClick={generatePreview} variant="outline" size="sm">
          Refresh Preview
        </Button>
      </div>

      {/* Preview Area */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
        <div
          className="bg-white shadow-2xl transition-all duration-300"
          style={{
            width: currentBreakpoint.width,
            height: currentBreakpoint.height,
            maxWidth: '100%',
            maxHeight: '100%',
          }}
        >
          {previewHtml ? (
            <iframe
              srcDoc={previewHtml}
              className="w-full h-full border-0"
              title="Preview"
              sandbox="allow-scripts"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              Click "Refresh Preview" để xem preview
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
