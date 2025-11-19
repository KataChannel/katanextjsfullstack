/**
 * Page Builder V2 - Block Type Definitions
 * Block-based editor with Tailwind CSS styling
 */

// ============================================================================
// Block Types
// ============================================================================

export type ElementBlockType =
  | 'text'       // Paragraph, heading
  | 'image'      // Single image
  | 'button'     // CTA button
  | 'container'  // Flexbox/Grid container
  | 'divider'    // HR separator
  | 'spacer'     // Empty space
  | 'video'      // Embed video
  | 'icon'       // Icon display
  | 'html';      // Custom HTML code

export type TemplateBlockType =
  | 'hero-1'         // Hero với image background
  | 'hero-2'         // Hero với gradient
  | 'features-3col'  // 3 columns features
  | 'features-grid'  // Grid layout features
  | 'cta-centered'   // Centered CTA
  | 'cta-split'      // Split CTA with image
  | 'testimonials'   // Testimonial cards
  | 'pricing'        // Pricing table
  | 'team'           // Team members grid
  | 'contact-form'   // Contact form
  | 'faq'            // FAQ accordion
  | 'footer';        // Footer sections

export type CustomBlockType = string; // User-defined block types

export type BlockType = ElementBlockType | TemplateBlockType | CustomBlockType;

// ============================================================================
// Block Content (varies by type)
// ============================================================================

export interface TextContent {
  text?: string;
  html?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
}

export interface ImageContent {
  url?: string;
  alt?: string;
  width?: number;
  height?: number;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
}

export interface ButtonContent {
  text?: string;
  link?: string;
  target?: '_self' | '_blank';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
}

export interface VideoContent {
  url?: string;
  provider?: 'youtube' | 'vimeo' | 'direct';
  autoplay?: boolean;
  controls?: boolean;
  loop?: boolean;
}

export interface IconContent {
  name?: string; // Lucide icon name
  size?: number;
}

export interface HtmlContent {
  html?: string; // Custom HTML code
  sanitize?: boolean; // Whether to sanitize HTML (default: false for admin trust)
}

export interface ContainerContent {
  layout?: 'flex' | 'grid';
  direction?: 'row' | 'column';
  gap?: number;
  columns?: number; // For grid
}

// Union of all content types
export type BlockContent =
  | TextContent
  | ImageContent
  | ButtonContent
  | VideoContent
  | IconContent
  | HtmlContent
  | ContainerContent
  | Record<string, any>; // For custom blocks

// ============================================================================
// Tailwind Classes
// ============================================================================

export interface TailwindClasses {
  container?: string;  // Wrapper classes: "flex flex-col gap-4 p-6"
  wrapper?: string;    // Inner wrapper: "max-w-7xl mx-auto"
  element?: string;    // Element classes: "text-2xl font-bold text-gray-900"
}

export interface ResponsiveTailwindClasses {
  mobile?: TailwindClasses;
  tablet?: TailwindClasses;
  desktop?: TailwindClasses;
}

// ============================================================================
// Block Settings
// ============================================================================

export interface BlockSettings {
  // Animation
  animation?: {
    type?: 'fade' | 'slide' | 'scale' | 'none';
    duration?: number;
    delay?: number;
  };

  // Responsive visibility
  visibility?: {
    mobile?: boolean;
    tablet?: boolean;
    desktop?: boolean;
  };

  // Spacing
  spacing?: {
    marginTop?: string;
    marginBottom?: string;
    paddingTop?: string;
    paddingBottom?: string;
  };

  // Background
  background?: {
    type?: 'color' | 'gradient' | 'image';
    value?: string;
    overlay?: string; // For image backgrounds
  };

  // Custom attributes
  attributes?: Record<string, string>; // id, data-*, etc.
}

// ============================================================================
// Block Interface
// ============================================================================

export interface Block {
  id: string;
  type: BlockType;
  name?: string; // Display name for inspector
  
  // Content data
  content: BlockContent;
  
  // Styling with Tailwind
  styles: TailwindClasses;
  responsiveStyles?: ResponsiveTailwindClasses;
  
  // Settings
  settings?: BlockSettings;
  
  // Children (for container blocks)
  children?: Block[];
  
  // Metadata
  locked?: boolean;  // Prevent editing
  hidden?: boolean;  // Hide from canvas
}

// ============================================================================
// Page Structure
// ============================================================================

export interface PageBlocks {
  version: 2; // V2 format
  blocks: Block[];
  settings?: {
    maxWidth?: string;
    padding?: string;
    backgroundColor?: string;
  };
}

// ============================================================================
// Editor State
// ============================================================================

export interface EditorState {
  // Blocks on canvas
  blocks: Block[];
  
  // Selection
  selectedBlockId: string | null;
  hoveredBlockId: string | null;
  
  // History (undo/redo)
  history: {
    past: Block[][];
    future: Block[][];
  };
  
  // View mode
  viewMode: 'desktop' | 'tablet' | 'mobile';
  
  // Canvas settings
  canvasSettings: {
    showGrid?: boolean;
    showBorders?: boolean;
    zoom?: number;
  };
}

// ============================================================================
// Block Template
// ============================================================================

export interface BlockTemplate {
  id: string;
  name: string;
  description?: string;
  thumbnail?: string;
  category: 'element' | 'template' | 'custom';
  tags?: string[];
  block: Block; // Single block (can have children)
  published: boolean;
  downloads: number;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Drag & Drop Types
// ============================================================================

export interface DragItem {
  type: 'block' | 'template';
  blockType?: BlockType;
  templateId?: string;
  block?: Block;
}

export interface DropTarget {
  blockId: string | null; // null = root level
  position: 'before' | 'after' | 'inside';
}

// ============================================================================
// Default Values
// ============================================================================

export const DEFAULT_STYLES: Record<ElementBlockType, TailwindClasses> = {
  text: {
    element: 'text-base text-gray-900',
  },
  image: {
    element: 'w-full h-auto',
  },
  button: {
    element: 'inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition',
  },
  container: {
    container: 'w-full',
    wrapper: 'max-w-7xl mx-auto px-4',
  },
  divider: {
    element: 'border-t border-gray-300 my-4',
  },
  spacer: {
    element: 'h-8',
  },
  video: {
    container: 'relative w-full',
    element: 'w-full aspect-video',
  },
  icon: {
    element: 'w-6 h-6 text-gray-900',
  },
  html: {
    container: 'w-full',
    element: '',
  },
};

export const DEFAULT_CONTENT: Record<ElementBlockType, BlockContent> = {
  text: {
    html: '<p>Type / for commands...</p>',
  },
  image: {
    url: 'https://placehold.co/800x600',
    alt: 'Placeholder image',
  },
  button: {
    text: 'Click me',
    link: '#',
    target: '_self',
    variant: 'primary',
  },
  container: {
    layout: 'flex',
    direction: 'column',
    gap: 4,
  },
  divider: {},
  spacer: {},
  video: {
    url: '',
    provider: 'youtube',
    controls: true,
  },
  icon: {
    name: 'star',
    size: 24,
  },
  html: {
    html: '<div class="p-4 bg-gray-100 rounded">\n  <p>Custom HTML here...</p>\n</div>',
    sanitize: false,
  },
};

// ============================================================================
// Utility Types
// ============================================================================

export type BlockWithChildren = Block & { children: Block[] };

export type BlockPath = number[]; // Path to block in tree [0, 2, 1] = blocks[0].children[2].children[1]

export interface BlockPosition {
  parentId: string | null;
  index: number;
}

// ============================================================================
// Validation Types
// ============================================================================

export interface ValidationError {
  blockId: string;
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}
