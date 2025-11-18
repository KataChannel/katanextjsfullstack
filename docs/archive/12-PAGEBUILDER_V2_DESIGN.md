# Page Builder V2 - Architecture Design

## 1. Core Concept

### Block-Based Editor (thay vì Canvas-based)
- Mỗi block là một React component
- Drag & drop blocks vào page
- Blocks có thể nest (container blocks)
- WYSIWYG editing
- All styling với Tailwind CSS

## 2. Block Types

### A. Element Blocks (Built-in)
```typescript
type ElementBlock = 
  | 'text'      // Paragraph, heading
  | 'image'     // Single image
  | 'button'    // CTA button
  | 'container' // Flexbox/Grid container
  | 'divider'   // HR separator
  | 'spacer'    // Empty space
  | 'video'     // Embed video
  | 'icon'      // Icon display
```

### B. Template Blocks (Pre-built)
```typescript
type TemplateBlock =
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
  | 'footer'         // Footer sections
```

### C. Custom Blocks (User-created)
- User kết hợp elements → Save as custom block
- Reusable across pages
- Can be shared (marketplace future)

## 3. Data Structure

### Block Schema
```typescript
interface Block {
  id: string;
  type: BlockType;
  content: BlockContent;
  styles: TailwindClasses;
  children?: Block[];
  settings?: BlockSettings;
}

interface BlockContent {
  // Tùy type
  text?: string;
  html?: string;
  imageUrl?: string;
  buttonText?: string;
  buttonLink?: string;
  // ...
}

interface TailwindClasses {
  container: string;  // "flex flex-col gap-4 p-6"
  wrapper: string;    // "max-w-7xl mx-auto"
  element: string;    // "text-2xl font-bold text-gray-900"
}

interface BlockSettings {
  animation?: 'fade' | 'slide' | 'scale';
  responsive?: {
    mobile: TailwindClasses;
    tablet: TailwindClasses;
    desktop: TailwindClasses;
  };
  visibility?: {
    mobile: boolean;
    tablet: boolean;
    desktop: boolean;
  };
}
```

## 4. UI Layout

```
┌─────────────────────────────────────────────────────────┐
│ Header: [Save] [Preview] [Publish] [Settings]          │
├──────────┬───────────────────────────────┬──────────────┤
│          │                               │              │
│ Sidebar  │        Canvas                 │  Inspector   │
│          │                               │              │
│ Tabs:    │  ┌─────────────────────────┐ │  Properties: │
│ □ Blocks │  │ Block 1: Hero           │ │  - Content   │
│ □ Saved  │  │ [Drag handle]           │ │  - Styles    │
│          │  │ ...content...           │ │  - Settings  │
│ Search:  │  └─────────────────────────┘ │              │
│ [____]   │  ┌─────────────────────────┐ │  Tailwind:   │
│          │  │ Block 2: Features       │ │  Container:  │
│ Elements │  │ [Drag handle]           │ │  [_________] │
│ • Text   │  │ ...content...           │ │              │
│ • Image  │  └─────────────────────────┘ │  Element:    │
│ • Button │  [+ Add Block]              │  [_________] │
│          │                               │              │
│ Templates│                               │  Preview:    │
│ • Hero   │                               │  □ Mobile    │
│ • CTA    │                               │  □ Tablet    │
│ • Feat.. │                               │  ☑ Desktop   │
└──────────┴───────────────────────────────┴──────────────┘
```

## 5. Features

### Drag & Drop
- **react-beautiful-dnd** hoặc **@dnd-kit/core**
- Drag from sidebar → Drop to canvas
- Reorder blocks
- Nest blocks (container)

### Inline Editing
- Click text → Edit inline (ContentEditable)
- Click image → Upload/change
- Click button → Edit text + link
- No dialog popup (WYSIWYG)

### Tailwind Editor
- Visual class picker
- Common classes: padding, margin, colors, typography
- Custom class input
- Responsive modifiers (sm:, md:, lg:)
- Auto-complete Tailwind classes

### Responsive Design
- Preview modes: Mobile / Tablet / Desktop
- Different Tailwind classes per breakpoint
- Hide/show blocks per device

### Undo/Redo
- Command pattern
- Keyboard shortcuts: Ctrl+Z, Ctrl+Y
- History stack

## 6. Implementation Plan

### Phase 1: Core Structure (Week 1)
- [ ] New data models (Block, Page schemas)
- [ ] API endpoints (CRUD blocks, pages)
- [ ] Database migration
- [ ] Basic UI layout (3-panel)

### Phase 2: Element Blocks (Week 2)
- [ ] Text block (h1-h6, p)
- [ ] Image block (upload + URL)
- [ ] Button block (link, style variants)
- [ ] Container block (flex, grid)
- [ ] Spacer, Divider blocks

### Phase 3: Drag & Drop (Week 2-3)
- [ ] Sidebar → Canvas drag
- [ ] Reorder blocks
- [ ] Nest in containers
- [ ] Visual feedback

### Phase 4: Inline Editing (Week 3)
- [ ] ContentEditable for text
- [ ] Image upload dialog
- [ ] Button link editor
- [ ] Properties panel

### Phase 5: Tailwind Integration (Week 4)
- [ ] Class input with autocomplete
- [ ] Visual class picker UI
- [ ] Responsive class editor
- [ ] Preview per breakpoint

### Phase 6: Template Blocks (Week 5)
- [ ] Pre-built Hero blocks
- [ ] Features sections
- [ ] CTA blocks
- [ ] Seed templates

### Phase 7: Custom Blocks (Week 5-6)
- [ ] Save selection as block
- [ ] Block library UI
- [ ] Import/Export blocks
- [ ] Share blocks

### Phase 8: Polish (Week 6)
- [ ] Undo/Redo
- [ ] Keyboard shortcuts
- [ ] Loading states
- [ ] Error handling
- [ ] Documentation

## 7. Tech Stack

### Core
- **Next.js 15** - App Router
- **React 18** - Server/Client Components
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling

### Libraries
- **@dnd-kit/core** - Drag & Drop (better than react-beautiful-dnd)
- **@dnd-kit/sortable** - Sortable lists
- **zustand** - State management
- **zod** - Schema validation
- **react-contenteditable** - Inline editing
- **cmdk** - Command palette (Tailwind class picker)

### UI Components
- **shadcn/ui** - Base components
- **lucide-react** - Icons
- **sonner** - Toasts

### Backend
- **Prisma** - ORM
- **PostgreSQL** - Database

## 8. Database Schema

```prisma
model Page {
  id          String   @id @default(uuid())
  title       String
  slug        String   @unique
  blocks      Json     // Array of Block objects
  settings    Json?    // Page-level settings
  published   Boolean  @default(false)
  publishedAt DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  authorId    String
  author      User     @relation(...)
}

model BlockTemplate {
  id          String   @id @default(uuid())
  name        String
  description String?
  thumbnail   String?
  category    String   // 'element' | 'template' | 'custom'
  block       Json     // Single Block object
  published   Boolean  @default(true)
  downloads   Int      @default(0)  // Tracking
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  authorId    String
  author      User     @relation(...)
}
```

## 9. Example Block Data

### Hero Block
```json
{
  "id": "hero-1",
  "type": "hero-1",
  "content": {
    "heading": "Mạng Trong Mình Khát Vọng",
    "subheading": "Tạo dựng cuộc sống thịnh vượng",
    "buttonText": "Tìm hiểu thêm",
    "buttonLink": "/about",
    "backgroundImage": "/images/hero-bg.jpg"
  },
  "styles": {
    "container": "relative h-screen flex items-center justify-center bg-cover bg-center",
    "wrapper": "max-w-4xl mx-auto text-center px-6",
    "heading": "text-5xl md:text-6xl font-bold text-white mb-4",
    "subheading": "text-xl md:text-2xl text-white/90 mb-8",
    "button": "inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
  },
  "settings": {
    "animation": "fade",
    "responsive": {
      "mobile": {
        "heading": "text-3xl font-bold text-white mb-3"
      }
    }
  }
}
```

### Custom Container Block
```json
{
  "id": "container-1",
  "type": "container",
  "content": {},
  "styles": {
    "container": "max-w-7xl mx-auto px-4 py-12",
    "wrapper": "grid grid-cols-1 md:grid-cols-3 gap-8"
  },
  "children": [
    {
      "id": "text-1",
      "type": "text",
      "content": {
        "html": "<h2>Feature 1</h2><p>Description</p>"
      },
      "styles": {
        "element": "text-center"
      }
    },
    // ... more children
  ]
}
```

## 10. Advantages vs Current System

### Current (Canvas-based)
❌ Complex Konva canvas  
❌ Position with x, y coordinates  
❌ Inline styles object  
❌ Hard to make responsive  
❌ Not WYSIWYG  
❌ Learning curve steep  

### New (Block-based)
✅ Simple React components  
✅ Flexbox/Grid layout  
✅ Tailwind CSS classes  
✅ Mobile-first responsive  
✅ True WYSIWYG editing  
✅ Easy to learn & use  
✅ Better performance  
✅ SEO-friendly output  

## 11. Migration Strategy

### Option A: Clean Start (Recommended)
- Keep old page builder as `/admin/page-builder-old`
- Build new at `/admin/pages`
- Migrate pages manually (small number)
- Delete old system after migration

### Option B: Gradual Migration
- Add "version" field to Page model
- Support both v1 (canvas) and v2 (blocks)
- Render engine handles both
- Migrate pages over time

### Option C: Auto Migration
- Write migration script
- Convert canvas elements → blocks
- Best effort conversion (may need manual fixes)
- One-time migration

## 12. Development Workflow

### Step 1: Setup
```bash
# Install new dependencies
bun add @dnd-kit/core @dnd-kit/sortable
bun add react-contenteditable
bun add cmdk

# Create new directories
mkdir -p app/admin/pages-v2
mkdir -p components/block-editor
mkdir -p lib/blocks
```

### Step 2: Build Core
- Block type definitions
- Zustand store for editor state
- Basic UI layout (3 panels)
- Empty canvas with "+ Add Block"

### Step 3: Implement Blocks
- Start with Text block
- Then Image, Button
- Container for nesting
- Template blocks (Hero, Features...)

### Step 4: Add Features
- Drag & drop
- Inline editing
- Tailwind class editor
- Responsive preview

### Step 5: Polish & Launch
- Undo/Redo
- Keyboard shortcuts
- Documentation
- User testing

## Next Steps

**Để bắt đầu, tôi cần quyết định của bạn:**

1. **Có backup code cũ không?** (Recommend: Yes)
2. **Xóa hoàn toàn hay giữ song song?** (Recommend: Song song trong 1-2 tuần)
3. **Migration data cũ?** (Recommend: Manual migration cho số lượng page nhỏ)
4. **Bắt đầu với phase nào?** (Recommend: Phase 1 - Core Structure)

**Ước tính timeline:**
- Phase 1-2 (Core + Elements): 1-2 tuần
- Phase 3-4 (Drag & Tailwind): 1-2 tuần  
- Phase 5-7 (Templates & Custom): 1-2 tuần
- Phase 8 (Polish): 1 tuần

**Total: 4-7 tuần** cho full implementation

Bạn muốn tôi bắt đầu từ đâu?
