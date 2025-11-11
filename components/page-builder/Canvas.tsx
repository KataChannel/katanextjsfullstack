'use client';

import React, { useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Text as KonvaText, Image as KonvaImage, Transformer } from 'react-konva';
import { useBuilderStore, BuilderElement } from '@/lib/page-builder/store';
import Konva from 'konva';

/**
 * Canvas component sử dụng Konva
 * - Snap to grid 8px
 * - Multi-select với Ctrl/Cmd
 * - Drag & drop từ sidebar
 */
export function Canvas() {
  const canvas = useBuilderStore((state) => state.canvas);
  const selectedIds = canvas.selectedIds;
  const { selectElements, moveElement, resizeElement } = useBuilderStore();
  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const layerRef = useRef<Konva.Layer>(null);

  // Update transformer khi selection thay đổi
  useEffect(() => {
    if (!transformerRef.current || !layerRef.current) return;

    const selectedNodes = selectedIds
      .map((id: string) => layerRef.current?.findOne(`#${id}`))
      .filter(Boolean) as Konva.Node[];

    transformerRef.current.nodes(selectedNodes);
    transformerRef.current.getLayer()?.batchDraw();
  }, [selectedIds]);

  // Render element dựa trên type
  const renderElement = (element: BuilderElement) => {
    const commonProps = {
      id: element.id,
      x: element.x,
      y: element.y,
      width: element.width,
      height: element.height,
      draggable: true,
      onClick: (e: Konva.KonvaEventObject<MouseEvent>) => {
        const isMultiSelect = e.evt.ctrlKey || e.evt.metaKey;
        if (isMultiSelect) {
          const newSelection = selectedIds.includes(element.id)
            ? selectedIds.filter((id: string) => id !== element.id)
            : [...selectedIds, element.id];
          selectElements(newSelection);
        } else {
          selectElements([element.id]);
        }
      },
      onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => {
        moveElement(element.id, e.target.x(), e.target.y());
      },
      onTransformEnd: (e: Konva.KonvaEventObject<Event>) => {
        const node = e.target;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();

        // Reset scale
        node.scaleX(1);
        node.scaleY(1);

        resizeElement(
          element.id,
          Math.max(10, node.width() * scaleX),
          Math.max(10, node.height() * scaleY)
        );
      },
    };

    switch (element.type) {
      case 'container':
        return (
          <Rect
            key={element.id}
            {...commonProps}
            fill={element.style.backgroundColor || '#f0f0f0'}
            stroke={selectedIds.includes(element.id) ? '#0066ff' : '#ddd'}
            strokeWidth={2}
            cornerRadius={element.style.borderRadius || 0}
          />
        );

      case 'text':
      case 'heading':
        return (
          <KonvaText
            key={element.id}
            {...commonProps}
            text={element.content || 'Text'}
            fontSize={element.style.fontSize || 16}
            fontStyle={element.style.fontWeight ? `${element.style.fontWeight}` : 'normal'}
            fill={element.style.color || '#000'}
          />
        );

      case 'button':
        return (
          <React.Fragment key={element.id}>
            <Rect
              {...commonProps}
              fill={element.style.backgroundColor || '#0066ff'}
              cornerRadius={element.style.borderRadius || 4}
              stroke={selectedIds.includes(element.id) ? '#00cc00' : 'transparent'}
              strokeWidth={2}
            />
            <KonvaText
              {...commonProps}
              text={element.content || 'Button'}
              fontSize={element.style.fontSize || 14}
              fill={element.style.color || '#fff'}
              align="center"
              verticalAlign="middle"
              listening={false}
            />
          </React.Fragment>
        );

      case 'image':
        // Trong production, load image thật
        return (
          <Rect
            key={element.id}
            {...commonProps}
            fill="#e0e0e0"
            stroke={selectedIds.includes(element.id) ? '#0066ff' : '#ddd'}
            strokeWidth={2}
          />
        );

      default:
        return null;
    }
  };

  // Handle click vào background để deselect
  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.target === e.target.getStage()) {
      selectElements([]);
    }
  };

  const elements = Object.values(canvas.elements);

  const [dimensions, setDimensions] = React.useState({ width: 1200, height: 800 });

  React.useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return (
    <div className="relative w-full h-full bg-gray-100 overflow-hidden">
      {/* Canvas với Konva */}
      <Stage
        ref={stageRef}
        width={dimensions.width}
        height={dimensions.height}
        scaleX={canvas.zoom}
        scaleY={canvas.zoom}
        onClick={handleStageClick}
        className="cursor-crosshair"
      >
        <Layer ref={layerRef}>
          {/* Grid background */}
          {canvas.snapToGrid && (
            <Rect
              width={dimensions.width / canvas.zoom}
              height={dimensions.height / canvas.zoom}
              fill="transparent"
              stroke="#ddd"
              strokeWidth={0.5}
              dash={[canvas.gridSize, canvas.gridSize]}
            />
          )}

          {/* Render tất cả elements */}
          {elements.map((element) => renderElement(element))}

          {/* Transformer cho selection */}
          <Transformer
            ref={transformerRef}
            rotateEnabled={false}
            borderStroke="#0066ff"
            borderStrokeWidth={2}
            anchorStroke="#0066ff"
            anchorFill="#fff"
            anchorSize={8}
            enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
          />
        </Layer>
      </Stage>

      {/* Zoom controls */}
      <div className="absolute bottom-4 right-4 flex gap-2 bg-white rounded-lg shadow-lg p-2">
        <button
          onClick={() => useBuilderStore.getState().setZoom(canvas.zoom - 0.1)}
          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
          disabled={canvas.zoom <= 0.1}
        >
          -
        </button>
        <span className="px-3 py-1">{Math.round(canvas.zoom * 100)}%</span>
        <button
          onClick={() => useBuilderStore.getState().setZoom(canvas.zoom + 0.1)}
          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
          disabled={canvas.zoom >= 3}
        >
          +
        </button>
      </div>
    </div>
  );
}
