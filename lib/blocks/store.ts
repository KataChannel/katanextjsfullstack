/**
 * Page Builder V2 - Zustand Store
 * State management for block-based editor
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
  Block,
  BlockType,
  BlockContent,
  TailwindClasses,
  EditorState,
  BlockPosition,
  DEFAULT_CONTENT,
  DEFAULT_STYLES,
} from './types';

// ============================================================================
// Store Interface
// ============================================================================

interface BlockEditorStore extends EditorState {
  // Block operations
  addBlock: (block: Partial<Block>, position?: BlockPosition) => void;
  updateBlock: (id: string, updates: Partial<Block>) => void;
  deleteBlock: (id: string) => void;
  duplicateBlock: (id: string) => void;
  moveBlock: (id: string, newPosition: BlockPosition) => void;
  
  // Selection
  selectBlock: (id: string | null) => void;
  hoverBlock: (id: string | null) => void;
  
  // History
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  saveHistory: () => void;
  
  // View mode
  setViewMode: (mode: 'desktop' | 'tablet' | 'mobile') => void;
  
  // Canvas settings
  updateCanvasSettings: (settings: Partial<EditorState['canvasSettings']>) => void;
  
  // Bulk operations
  loadBlocks: (blocks: Block[]) => void;
  clearBlocks: () => void;
  
  // Helpers
  getBlock: (id: string) => Block | undefined;
  getAllBlocks: () => Block[];
}

// ============================================================================
// Helper Functions
// ============================================================================

function generateId(): string {
  return `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function findBlockById(blocks: Block[], id: string): Block | undefined {
  for (const block of blocks) {
    if (block.id === id) return block;
    if (block.children) {
      const found = findBlockById(block.children, id);
      if (found) return found;
    }
  }
  return undefined;
}

function deleteBlockById(blocks: Block[], id: string): Block[] {
  return blocks
    .filter(block => block.id !== id)
    .map(block => ({
      ...block,
      children: block.children ? deleteBlockById(block.children, id) : undefined,
    }));
}

function updateBlockById(
  blocks: Block[],
  id: string,
  updates: Partial<Block>
): Block[] {
  return blocks.map(block => {
    if (block.id === id) {
      return { ...block, ...updates };
    }
    if (block.children) {
      return {
        ...block,
        children: updateBlockById(block.children, id, updates),
      };
    }
    return block;
  });
}

function insertBlock(
  blocks: Block[],
  newBlock: Block,
  position: BlockPosition
): Block[] {
  const { parentId, index } = position;
  
  if (parentId === null) {
    // Insert at root level
    const newBlocks = [...blocks];
    newBlocks.splice(index, 0, newBlock);
    return newBlocks;
  }
  
  // Insert into parent's children
  return blocks.map(block => {
    if (block.id === parentId) {
      const children = block.children || [];
      const newChildren = [...children];
      newChildren.splice(index, 0, newBlock);
      return { ...block, children: newChildren };
    }
    if (block.children) {
      return {
        ...block,
        children: insertBlock(block.children, newBlock, position),
      };
    }
    return block;
  });
}

function flattenBlocks(blocks: Block[]): Block[] {
  return blocks.reduce<Block[]>((acc, block) => {
    acc.push(block);
    if (block.children) {
      acc.push(...flattenBlocks(block.children));
    }
    return acc;
  }, []);
}

function cloneBlock(block: Block): Block {
  return {
    ...block,
    id: generateId(),
    children: block.children?.map(cloneBlock),
  };
}

// ============================================================================
// Create Store
// ============================================================================

export const useBlockEditorStore = create<BlockEditorStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      blocks: [],
      selectedBlockId: null,
      hoveredBlockId: null,
      history: {
        past: [],
        future: [],
      },
      viewMode: 'desktop',
      canvasSettings: {
        showGrid: true,
        showBorders: true,
        zoom: 100,
      },

      // ========================================================================
      // Block operations
      // ========================================================================

      addBlock: (blockData, position) => {
        const state = get();
        
        // Create new block with defaults
        const newBlock: Block = {
          id: generateId(),
          type: blockData.type || 'text',
          name: blockData.name,
          content: blockData.content || {},
          styles: blockData.styles || {},
          settings: blockData.settings,
          children: blockData.children,
          locked: blockData.locked || false,
          hidden: blockData.hidden || false,
        };
        
        // Determine position
        const finalPosition: BlockPosition = position || {
          parentId: null,
          index: state.blocks.length,
        };
        
        // Insert block
        const newBlocks = insertBlock(state.blocks, newBlock, finalPosition);
        
        set({
          blocks: newBlocks,
          selectedBlockId: newBlock.id,
        });
        
        state.saveHistory();
      },

      updateBlock: (id, updates) => {
        const state = get();
        const newBlocks = updateBlockById(state.blocks, id, updates);
        
        set({ blocks: newBlocks });
        state.saveHistory();
      },

      deleteBlock: (id) => {
        const state = get();
        const newBlocks = deleteBlockById(state.blocks, id);
        
        set({
          blocks: newBlocks,
          selectedBlockId: state.selectedBlockId === id ? null : state.selectedBlockId,
        });
        
        state.saveHistory();
      },

      duplicateBlock: (id) => {
        const state = get();
        const block = state.getBlock(id);
        
        if (!block) return;
        
        const cloned = cloneBlock(block);
        
        // Find position after original block
        // This is simplified - in real implementation, find exact position
        state.addBlock(cloned, {
          parentId: null,
          index: state.blocks.length,
        });
      },

      moveBlock: (id, newPosition) => {
        const state = get();
        const block = state.getBlock(id);
        
        if (!block) return;
        
        // Remove from current position
        const blocksWithoutMoving = deleteBlockById(state.blocks, id);
        
        // Insert at new position
        const newBlocks = insertBlock(blocksWithoutMoving, block, newPosition);
        
        set({ blocks: newBlocks });
        state.saveHistory();
      },

      // ========================================================================
      // Selection
      // ========================================================================

      selectBlock: (id) => {
        set({ selectedBlockId: id });
      },

      hoverBlock: (id) => {
        set({ hoveredBlockId: id });
      },

      // ========================================================================
      // History
      // ========================================================================

      saveHistory: () => {
        const state = get();
        const { blocks, history } = state;
        
        set({
          history: {
            past: [...history.past, blocks],
            future: [], // Clear future on new action
          },
        });
      },

      undo: () => {
        const state = get();
        const { blocks, history } = state;
        
        if (history.past.length === 0) return;
        
        const previous = history.past[history.past.length - 1];
        const newPast = history.past.slice(0, -1);
        
        set({
          blocks: previous,
          history: {
            past: newPast,
            future: [blocks, ...history.future],
          },
        });
      },

      redo: () => {
        const state = get();
        const { blocks, history } = state;
        
        if (history.future.length === 0) return;
        
        const next = history.future[0];
        const newFuture = history.future.slice(1);
        
        set({
          blocks: next,
          history: {
            past: [...history.past, blocks],
            future: newFuture,
          },
        });
      },

      canUndo: () => {
        return get().history.past.length > 0;
      },

      canRedo: () => {
        return get().history.future.length > 0;
      },

      // ========================================================================
      // View mode
      // ========================================================================

      setViewMode: (mode) => {
        set({ viewMode: mode });
      },

      // ========================================================================
      // Canvas settings
      // ========================================================================

      updateCanvasSettings: (settings) => {
        const state = get();
        set({
          canvasSettings: {
            ...state.canvasSettings,
            ...settings,
          },
        });
      },

      // ========================================================================
      // Bulk operations
      // ========================================================================

      loadBlocks: (blocks) => {
        set({
          blocks,
          selectedBlockId: null,
          hoveredBlockId: null,
          history: {
            past: [],
            future: [],
          },
        });
      },

      clearBlocks: () => {
        set({
          blocks: [],
          selectedBlockId: null,
          hoveredBlockId: null,
          history: {
            past: [],
            future: [],
          },
        });
      },

      // ========================================================================
      // Helpers
      // ========================================================================

      getBlock: (id) => {
        return findBlockById(get().blocks, id);
      },

      getAllBlocks: () => {
        return flattenBlocks(get().blocks);
      },
    }),
    { name: 'BlockEditorStore' }
  )
);

// ============================================================================
// Selectors (for performance)
// ============================================================================

export const selectSelectedBlock = (state: BlockEditorStore) =>
  state.selectedBlockId ? state.getBlock(state.selectedBlockId) : null;

export const selectHoveredBlock = (state: BlockEditorStore) =>
  state.hoveredBlockId ? state.getBlock(state.hoveredBlockId) : null;

export const selectCanUndo = (state: BlockEditorStore) => state.canUndo();

export const selectCanRedo = (state: BlockEditorStore) => state.canRedo();
