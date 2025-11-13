'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Smartphone, Tablet, Monitor } from 'lucide-react';
import { useBuilderStore, Breakpoint, BuilderElement } from '@/lib/page-builder/store';
import { CarouselComponent } from './CarouselComponent';

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

  const currentBreakpoint = breakpoints[canvas.currentBreakpoint];
  const elements = Object.values(canvas.elements);

  // Render element as React component
  const renderElement = (element: BuilderElement) => {
    const commonStyle: React.CSSProperties = {
      position: 'absolute',
      left: element.x,
      top: element.y,
      width: element.width,
      height: element.height,
      backgroundColor: element.style?.backgroundColor,
      color: element.style?.color,
      fontSize: element.style?.fontSize,
      fontWeight: element.style?.fontWeight,
      borderRadius: element.style?.borderRadius,
      opacity: element.style?.opacity,
    };

    switch (element.type) {
      case 'container':
        return (
          <div key={element.id} style={commonStyle}>
            {element.content}
          </div>
        );

      case 'text':
        return (
          <div key={element.id} style={commonStyle}>
            {element.content}
          </div>
        );

      case 'heading':
        return (
          <h1 key={element.id} style={commonStyle}>
            {element.content}
          </h1>
        );

      case 'button':
        return (
          <button key={element.id} style={commonStyle}>
            {element.content}
          </button>
        );

      case 'image':
        return (
          <img
            key={element.id}
            src={element.src || '/placeholder.jpg'}
            alt={element.name}
            style={commonStyle}
          />
        );

      case 'carousel':
        return (
          <div
            key={element.id}
            style={{
              position: 'absolute',
              left: element.x,
              top: element.y,
              width: element.width,
            }}
          >
            <CarouselComponent
              slides={element.carousel?.slides || []}
              autoPlay={element.carousel?.autoPlay}
              interval={element.carousel?.interval}
              showDots={element.carousel?.showDots}
              showArrows={element.carousel?.showArrows}
              height={element.carousel?.height || element.height}
            />
          </div>
        );

      default:
        return null;
    }
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
      </div>

      {/* Preview Area */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-auto bg-gray-100">
        <div
          className="bg-white shadow-2xl transition-all duration-300 overflow-auto relative"
          style={{
            width: currentBreakpoint.width,
            height: currentBreakpoint.height,
            maxWidth: '100%',
            maxHeight: '100%',
          }}
        >
          {elements.map(element => renderElement(element))}
        </div>
      </div>
    </div>
  );
}
