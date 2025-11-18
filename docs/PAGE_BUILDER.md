# 🎨 Page Builder System

## Overview

Visual page builder với drag & drop interface, hỗ trợ tạo landing pages mà không cần code.

## Features

### ✨ Core Capabilities

- **Drag & Drop**: Intuitive block-based editor
- **8+ Block Types**: Text, Image, Button, Container, Video, etc.
- **Real-time Preview**: See changes instantly
- **Responsive Design**: Desktop, Tablet, Mobile views
- **Template System**: Reusable block templates
- **Undo/Redo**: Full history management
- **Keyboard Shortcuts**: Power user features

## Block Types

### 1. Text Block
- Rich text editing
- Multiple heading levels (H1-H6)
- Paragraph styles
- Inline formatting

### 2. Image Block
- Image URL input
- Alt text for SEO
- Responsive sizing
- Link wrapping

### 3. Button Block
- Call-to-action buttons
- Custom text & links
- Style variants
- Hover effects

### 4. Container Block
- Layout wrapper
- Flex/Grid layouts
- Nested blocks support
- Responsive spacing

### 5. Video Block
- YouTube embeds
- Video URLs
- Responsive sizing
- Autoplay options

### 6. Divider Block
- Section separators
- Style options
- Spacing control

### 7. Spacer Block
- Vertical spacing
- Adjustable height
- Responsive sizing

### 8. Icon Block
- Icon library
- Custom icons
- Size & color options

## Architecture

### Data Structure

```typescript
interface Block {
  id: string;
  type: BlockType;
  content: BlockContent;
  styles: {
    className?: string;
    customCSS?: string;
  };
  children?: Block[];
}

type BlockType = 
  | 'text' 
  | 'image' 
  | 'button' 
  | 'container' 
  | 'video' 
  | 'divider' 
  | 'spacer' 
  | 'icon';
```

### State Management (Zustand)

```typescript
interface BlockEditorState {
  blocks: Block[];
  selectedBlockId: string | null;
  history: Block[][];
  historyIndex: number;
  
  // Actions
  addBlock: (block: Block) => void;
  updateBlock: (id: string, updates: Partial<Block>) => void;
  deleteBlock: (id: string) => void;
  moveBlock: (id: string, direction: 'up' | 'down') => void;
  duplicateBlock: (id: string) => void;
  undo: () => void;
  redo: () => void;
}
```

## Components

### BlockEditor (Main Component)

```tsx
<BlockEditor
  initialBlocks={blocks}
  onSave={(blocks) => {
    // Save to database
    await savePageBlocks(pageId, blocks);
  }}
/>
```

**Features:**
- 3-panel layout (Sidebar, Canvas, Inspector)
- Auto-save support
- Keyboard shortcuts
- Responsive toolbar

### BlockSidebar

**3 Tabs:**
1. **Elements** - Draggable block types
2. **Templates** - Pre-built layouts
3. **Saved** - User's saved blocks

### BlockCanvas

- Drop zone for blocks
- Preview modes (Desktop/Tablet/Mobile)
- Grid & spacing guides
- Visual feedback on hover

### BlockInspector

**3 Tabs:**
1. **Content** - Edit block content
2. **Styles** - CSS classes & styling
3. **Props** - Custom attributes

### BlockRenderer

Renders blocks with:
- ContentEditable for inline editing
- Drag handles
- Selection indicators
- Delete buttons

## Usage

### Creating a Page

```typescript
// 1. Create page
const page = await prisma.page.create({
  data: {
    title: 'Landing Page',
    slug: 'landing',
    blocks: [], // Start empty
  }
});

// 2. Open in editor
// User drags blocks, edits content

// 3. Save blocks
await prisma.page.update({
  where: { id: page.id },
  data: {
    blocks: editorState.blocks, // JSON
  }
});
```

### Rendering Pages

```tsx
// Frontend rendering
import { BlockRenderer } from '@/components/block-editor';

export default function Page({ blocks }) {
  return (
    <div className="page-content">
      {blocks.map(block => (
        <BlockRenderer
          key={block.id}
          block={block}
          editable={false} // Read-only on frontend
        />
      ))}
    </div>
  );
}
```

## Template System

### Save as Template

```typescript
// User creates blocks, then saves as template
await prisma.blockTemplate.create({
  data: {
    name: 'Hero Section',
    category: 'header',
    block: heroBlock, // Block JSON
    thumbnail: '/templates/hero.png',
  }
});
```

### Use Template

```typescript
// Load template
const template = await prisma.blockTemplate.findUnique({
  where: { id: templateId }
});

// Add to canvas
editorState.addBlock(template.block);
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + Z` | Undo |
| `Ctrl/Cmd + Shift + Z` | Redo |
| `Ctrl/Cmd + D` | Duplicate block |
| `Delete` | Delete selected block |
| `↑/↓` | Move block up/down |
| `Ctrl/Cmd + S` | Save page |

## Database Schema

```prisma
model Page {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  blocks      Json     // Block[] stored as JSON
  published   Boolean  @default(false)
  seoTitle    String?
  seoDescription String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model BlockTemplate {
  id          String   @id @default(cuid())
  name        String
  description String?
  category    String   // 'header', 'footer', 'section', etc.
  block       Json     // Block stored as JSON
  thumbnail   String?
  published   Boolean  @default(true)
  downloads   Int      @default(0)
  createdAt   DateTime @default(now())
}
```

## API Endpoints

### Pages V2

```typescript
// GET /api/pages-v2
// List all pages for current domain
const pages = await fetch('/api/pages-v2').then(r => r.json());

// POST /api/pages-v2
// Create new page
const newPage = await fetch('/api/pages-v2', {
  method: 'POST',
  body: JSON.stringify({
    title: 'My Page',
    slug: 'my-page',
    blocks: [],
  }),
});

// GET /api/pages-v2/[id]
// Get specific page
const page = await fetch(`/api/pages-v2/${id}`).then(r => r.json());

// PUT /api/pages-v2/[id]
// Update page (including blocks)
await fetch(`/api/pages-v2/${id}`, {
  method: 'PUT',
  body: JSON.stringify({
    blocks: updatedBlocks,
  }),
});

// DELETE /api/pages-v2/[id]
// Delete page
await fetch(`/api/pages-v2/${id}`, { method: 'DELETE' });
```

### Block Templates

```typescript
// GET /api/block-templates-v2
const templates = await fetch('/api/block-templates-v2');

// POST /api/block-templates-v2
await fetch('/api/block-templates-v2', {
  method: 'POST',
  body: JSON.stringify({
    name: 'My Template',
    block: blockData,
  }),
});
```

## Styling System

### Tailwind Classes

Blocks sử dụng Tailwind CSS classes:

```typescript
const containerBlock: Block = {
  id: 'container-1',
  type: 'container',
  styles: {
    className: 'max-w-7xl mx-auto px-4 py-8',
  },
  children: [...],
};
```

### Custom CSS

Advanced styling với custom CSS:

```typescript
const styledBlock: Block = {
  id: 'styled-1',
  type: 'text',
  styles: {
    customCSS: `
      background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    `,
  },
};
```

## Best Practices

### 1. Performance

```typescript
// ✅ Lazy load editor
const BlockEditor = dynamic(() => import('@/components/block-editor'), {
  ssr: false,
  loading: () => <div>Loading editor...</div>
});
```

### 2. Auto-save

```typescript
// Debounced auto-save
useEffect(() => {
  const timer = setTimeout(() => {
    saveBlocks(blocks);
  }, 1000);
  return () => clearTimeout(timer);
}, [blocks]);
```

### 3. Validation

```typescript
// Validate blocks before save
function validateBlocks(blocks: Block[]): boolean {
  return blocks.every(block => {
    if (!block.id || !block.type) return false;
    if (block.type === 'image' && !block.content.url) return false;
    return true;
  });
}
```

## Troubleshooting

### Blocks Not Saving

**Check:**
1. API endpoint authentication
2. JSON serialization (circular references)
3. Database field size limits

### Performance Issues

**Solutions:**
1. Limit history size (20 items)
2. Debounce state updates
3. Virtualize large block lists

### Drag & Drop Not Working

**Fixes:**
1. Check DnD context provider
2. Verify block IDs are unique
3. Update @dnd-kit packages

---

**See Also:**
- [Content Management](./CONTENT_MANAGEMENT.md)
- [API Documentation](./API_DOCS.md)
- [User Guide](./QUICK_START.md)
