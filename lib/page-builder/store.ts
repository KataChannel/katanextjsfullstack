import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

/**
 * Element types trong page builder
 */
export type ElementType = 'container' | 'text' | 'button' | 'image' | 'heading' | 'carousel';

/**
 * Layout properties sử dụng Flexbox/Grid
 */
export interface LayoutProps {
  display?: 'flex' | 'grid' | 'block' | 'inline-block';
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  justifyContent?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  alignItems?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  gap?: number;
  padding?: number;
  margin?: number;
  width?: string;
  height?: string;
  gridColumns?: number;
  gridRows?: number;
}

/**
 * Style properties cho element
 */
export interface StyleProps {
  backgroundColor?: string;
  color?: string;
  fontSize?: number;
  fontWeight?: number;
  borderRadius?: number;
  border?: string;
  boxShadow?: string;
  opacity?: number;
}

/**
 * Animation properties
 */
export interface AnimationProps {
  type?: 'fade' | 'slide' | 'scale' | 'none';
  duration?: number;
  delay?: number;
  trigger?: 'scroll' | 'hover' | 'click' | 'load';
}

/**
 * Carousel slide
 */
export interface CarouselSlide {
  id: string;
  image: string;
  title?: string;
  description?: string;
  link?: string;
  alt?: string;
}

/**
 * Carousel settings
 */
export interface CarouselSettings {
  slides: CarouselSlide[];
  autoPlay?: boolean;
  interval?: number; // milliseconds
  showDots?: boolean;
  showArrows?: boolean;
  height?: number;
}

/**
 * State variations (hover, focus, active)
 */
export interface StateVariations {
  default: Partial<StyleProps>;
  hover?: Partial<StyleProps>;
  focus?: Partial<StyleProps>;
  active?: Partial<StyleProps>;
}

/**
 * Element trong canvas
 */
export interface BuilderElement {
  id: string;
  type: ElementType;
  name: string;
  content?: string; // Text content for text/button/heading
  src?: string; // Image source
  carousel?: CarouselSettings; // Carousel specific settings
  x: number;
  y: number;
  width: number;
  height: number;
  layout: LayoutProps;
  style: StyleProps;
  animation: AnimationProps;
  states: StateVariations;
  children?: string[]; // IDs of child elements
  parentId?: string;
  locked?: boolean;
  visible?: boolean;
}

/**
 * Breakpoint cho responsive
 */
export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

/**
 * Grid options
 */
export type GridSize = 1 | 4 | 8 | 12 | 16;

/**
 * Canvas state
 */
interface CanvasState {
  elements: Record<string, BuilderElement>;
  selectedIds: string[];
  currentBreakpoint: Breakpoint;
  zoom: number;
  gridSize: GridSize;
  snapToGrid: boolean;
  showGrid: boolean;
  magneticAlignment: boolean;
}

/**
 * History state cho undo/redo
 */
interface HistoryState {
  past: CanvasState[];
  present: CanvasState;
  future: CanvasState[];
}

/**
 * Store interface
 */
interface BuilderStore {
  // Canvas state
  canvas: CanvasState;
  
  // History
  history: HistoryState;
  
  // Actions
  addElement: (element: BuilderElement) => void;
  updateElement: (id: string, updates: Partial<BuilderElement>) => void;
  deleteElement: (id: string) => void;
  selectElements: (ids: string[]) => void;
  moveElement: (id: string, x: number, y: number) => void;
  resizeElement: (id: string, width: number, height: number) => void;
  
  // Breakpoint
  setBreakpoint: (breakpoint: Breakpoint) => void;
  
  // Zoom & Grid
  setZoom: (zoom: number) => void;
  setGridSize: (size: GridSize) => void;
  toggleSnapToGrid: () => void;
  toggleShowGrid: () => void;
  toggleMagneticAlignment: () => void;
  
  // Undo/Redo
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  
  // Clear
  clearCanvas: () => void;
}

/**
 * Initial canvas state
 */
const initialCanvas: CanvasState = {
  elements: {},
  selectedIds: [],
  currentBreakpoint: 'desktop',
  zoom: 1,
  gridSize: 8,
  snapToGrid: true,
  showGrid: true,
  magneticAlignment: true,
};

/**
 * Snap value to grid
 */
const snapToGrid = (value: number, gridSize: number): number => {
  return Math.round(value / gridSize) * gridSize;
};

/**
 * Create history entry
 */
const createHistoryEntry = (canvas: CanvasState): HistoryState => ({
  past: [],
  present: canvas,
  future: [],
});

/**
 * Create element with default values
 */
const createElementWithDefaults = (element: Partial<BuilderElement> & Pick<BuilderElement, 'id' | 'type' | 'name' | 'x' | 'y' | 'width' | 'height'>): BuilderElement => {
  return {
    layout: {},
    style: {},
    animation: { type: 'none' },
    states: {
      default: {},
    },
    ...element,
  };
};

/**
 * Zustand store với devtools
 */
export const useBuilderStore = create<BuilderStore>()(
  devtools((set, get) => ({
      canvas: initialCanvas,
      history: createHistoryEntry(initialCanvas),

      addElement: (element) =>
        set((state) => {
          const id = element.id || `el-${Date.now()}`;
          const fullElement = createElementWithDefaults({ ...element, id });
          return {
            canvas: {
              ...state.canvas,
              elements: {
                ...state.canvas.elements,
                [id]: fullElement,
              },
              selectedIds: [id],
            },
            history: {
              past: [...state.history.past, state.canvas],
              present: state.canvas,
              future: [],
            },
          };
        }),

      updateElement: (id, updates) =>
        set((state) => {
          if (!state.canvas.elements[id]) return state;
          
          return {
            canvas: {
              ...state.canvas,
              elements: {
                ...state.canvas.elements,
                [id]: {
                  ...state.canvas.elements[id],
                  ...updates,
                },
              },
            },
            history: {
              past: [...state.history.past, state.canvas],
              present: state.canvas,
              future: [],
            },
          };
        }),

      deleteElement: (id) =>
        set((state) => {
          if (!state.canvas.elements[id]) return state;
          
          const newElements = { ...state.canvas.elements };
          delete newElements[id];
          
          return {
            canvas: {
              ...state.canvas,
              elements: newElements,
              selectedIds: state.canvas.selectedIds.filter(
                (selectedId: string) => selectedId !== id
              ),
            },
            history: {
              past: [...state.history.past, state.canvas],
              present: state.canvas,
              future: [],
            },
          };
        }),

      selectElements: (ids) =>
        set((state) => ({
          canvas: {
            ...state.canvas,
            selectedIds: ids,
          },
        })),

      moveElement: (id, x, y) =>
        set((state) => {
          if (!state.canvas.elements[id]) return state;
          
          const finalX = state.canvas.snapToGrid
            ? snapToGrid(x, state.canvas.gridSize)
            : x;
          const finalY = state.canvas.snapToGrid
            ? snapToGrid(y, state.canvas.gridSize)
            : y;
          
          return {
            canvas: {
              ...state.canvas,
              elements: {
                ...state.canvas.elements,
                [id]: {
                  ...state.canvas.elements[id],
                  x: finalX,
                  y: finalY,
                },
              },
            },
            history: {
              past: [...state.history.past, state.canvas],
              present: state.canvas,
              future: [],
            },
          };
        }),

      resizeElement: (id, width, height) =>
        set((state) => {
          if (!state.canvas.elements[id]) return state;
          
          const finalWidth = state.canvas.snapToGrid
            ? snapToGrid(width, state.canvas.gridSize)
            : width;
          const finalHeight = state.canvas.snapToGrid
            ? snapToGrid(height, state.canvas.gridSize)
            : height;
          
          return {
            canvas: {
              ...state.canvas,
              elements: {
                ...state.canvas.elements,
                [id]: {
                  ...state.canvas.elements[id],
                  width: finalWidth,
                  height: finalHeight,
                },
              },
            },
            history: {
              past: [...state.history.past, state.canvas],
              present: state.canvas,
              future: [],
            },
          };
        }),

      setBreakpoint: (breakpoint) =>
        set((state) => ({
          canvas: {
            ...state.canvas,
            currentBreakpoint: breakpoint,
          },
        })),

      setZoom: (zoom) =>
        set((state) => ({
          canvas: {
            ...state.canvas,
            zoom: Math.max(0.1, Math.min(zoom, 3)),
          },
        })),

      setGridSize: (size) =>
        set((state) => ({
          canvas: {
            ...state.canvas,
            gridSize: size,
          },
        })),

      toggleSnapToGrid: () =>
        set((state) => ({
          canvas: {
            ...state.canvas,
            snapToGrid: !state.canvas.snapToGrid,
          },
        })),

      toggleShowGrid: () =>
        set((state) => ({
          canvas: {
            ...state.canvas,
            showGrid: !state.canvas.showGrid,
          },
        })),

      toggleMagneticAlignment: () =>
        set((state) => ({
          canvas: {
            ...state.canvas,
            magneticAlignment: !state.canvas.magneticAlignment,
          },
        })),

      undo: () =>
        set((state) => {
          if (state.history.past.length === 0) return state;
          
          const newPast = [...state.history.past];
          const previous = newPast.pop()!;
          
          return {
            canvas: previous,
            history: {
              past: newPast,
              present: previous,
              future: [state.canvas, ...state.history.future],
            },
          };
        }),

      redo: () =>
        set((state) => {
          if (state.history.future.length === 0) return state;
          
          const newFuture = [...state.history.future];
          const next = newFuture.shift()!;
          
          return {
            canvas: next,
            history: {
              past: [...state.history.past, state.canvas],
              present: next,
              future: newFuture,
            },
          };
        }),

      canUndo: () => get().history.past.length > 0,
      canRedo: () => get().history.future.length > 0,

      clearCanvas: () =>
        set((state) => ({
          canvas: {
            ...state.canvas,
            elements: {},
            selectedIds: [],
          },
          history: {
            past: [...state.history.past, state.canvas],
            present: state.canvas,
            future: [],
          },
        })),
    })
  )
);
