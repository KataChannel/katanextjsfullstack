# 🍔 Menu System

## Overview

Hệ thống menu đa cấp với hỗ trợ multi-domain và quản lý vị trí linh hoạt.

## Features

- **Multi-level Menus**: Unlimited depth, parent-child relationships
- **Multi-domain**: Each domain has separate menus
- **Multiple Positions**: Header, footer, sidebar, etc.
- **Drag & Drop Ordering**: Visual menu builder
- **Link Types**: Pages, Posts, Custom URLs, External links

## Database Schema

```prisma
model Menu {
  id          String    @id @default(cuid())
  label       String    // Display text
  url         String?   // Link URL
  position    String    // header, footer, sidebar
  order       Int       // Sort order
  parentId    String?   // For nested menus
  parent      Menu?     @relation("MenuHierarchy", fields: [parentId], references: [id])
  children    Menu[]    @relation("MenuHierarchy")
  
  // Link types
  type        String    // page, post, custom, external
  pageId      String?   // Link to Page
  page        Page?     @relation(fields: [pageId], references: [id])
  
  // Display options
  isVisible   Boolean   @default(true)
  openInNewTab Boolean  @default(false)
  cssClass    String?   // Custom CSS classes
  icon        String?   // Icon name
  
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

## API Endpoints

### List Menus

```typescript
// GET /api/menus?position=header
Response: Menu[]

// Automatically filtered by domain
const menus = await prisma.menu.findMany({
  where: { position },
  orderBy: { order: 'asc' },
  include: { 
    children: true,
    page: { select: { title: true, slug: true } }
  },
});
```

### Create Menu Item

```typescript
POST /api/menus
Body: {
  label: string;
  url?: string;
  position: 'header' | 'footer' | 'sidebar';
  parentId?: string;
  type: 'page' | 'post' | 'custom' | 'external';
  pageId?: string;
  order: number;
  isVisible?: boolean;
  openInNewTab?: boolean;
}

Response: Menu
```

### Update Menu

```typescript
PUT /api/menus/[id]
Body: Partial<Menu>

// Common updates
// 1. Change order
{ order: 2 }

// 2. Change parent (move to sub-menu)
{ parentId: 'parent-menu-id' }

// 3. Toggle visibility
{ isVisible: false }
```

### Delete Menu

```typescript
DELETE /api/menus/[id]

// Note: Deleting parent menu also deletes children
```

### Reorder Menus

```typescript
POST /api/menus/reorder
Body: {
  items: Array<{ id: string, order: number, parentId?: string }>
}

// Example: Drag & drop result
{
  items: [
    { id: 'menu-1', order: 0, parentId: null },
    { id: 'menu-2', order: 1, parentId: null },
    { id: 'menu-3', order: 0, parentId: 'menu-1' }, // Sub-menu
  ]
}
```

## Menu Positions

### Available Positions

```typescript
const MENU_POSITIONS = {
  HEADER: 'header',       // Main navigation
  FOOTER: 'footer',       // Footer links
  SIDEBAR: 'sidebar',     // Sidebar navigation
  MOBILE: 'mobile',       // Mobile menu
  TOP: 'top',            // Top bar
} as const;
```

### Usage in Components

```typescript
// components/header.tsx
import { getMenusByPosition } from '@/lib/menu';

export async function Header() {
  const menus = await getMenusByPosition('header');
  
  return (
    <nav>
      {menus.map(menu => (
        <MenuItem key={menu.id} item={menu} />
      ))}
    </nav>
  );
}
```

## Menu Types

### 1. Page Link

Link to internal page:

```typescript
{
  type: 'page',
  pageId: 'page-id',
  label: 'About Us',
  url: '/about', // Auto-generated from page.slug
}
```

### 2. Post Link

Link to blog post:

```typescript
{
  type: 'post',
  pageId: 'post-id',
  label: 'Latest News',
  url: '/posts/latest-news',
}
```

### 3. Custom URL

Internal custom URL:

```typescript
{
  type: 'custom',
  label: 'Services',
  url: '/services',
}
```

### 4. External Link

External website:

```typescript
{
  type: 'external',
  label: 'Google',
  url: 'https://google.com',
  openInNewTab: true,
}
```

## Nested Menus

### Create Sub-menu

```typescript
// 1. Create parent menu
const parent = await prisma.menu.create({
  data: {
    label: 'Services',
    url: '/services',
    position: 'header',
    order: 0,
  },
});

// 2. Create child menus
const child1 = await prisma.menu.create({
  data: {
    label: 'Web Design',
    url: '/services/web-design',
    position: 'header',
    order: 0,
    parentId: parent.id,
  },
});

const child2 = await prisma.menu.create({
  data: {
    label: 'SEO',
    url: '/services/seo',
    position: 'header',
    order: 1,
    parentId: parent.id,
  },
});
```

### Query Nested Menus

```typescript
// Get menu tree
const menus = await prisma.menu.findMany({
  where: { 
    position: 'header',
    parentId: null, // Only top-level
  },
  include: {
    children: {
      orderBy: { order: 'asc' },
      include: {
        children: true, // 3-level deep
      },
    },
  },
  orderBy: { order: 'asc' },
});
```

## Frontend Components

### Menu Component

```tsx
// components/menu-item.tsx
interface MenuItemProps {
  item: Menu & { children?: Menu[] };
  depth?: number;
}

export function MenuItem({ item, depth = 0 }: MenuItemProps) {
  const hasChildren = item.children && item.children.length > 0;
  
  return (
    <li className={`menu-item depth-${depth}`}>
      <a
        href={item.url}
        target={item.openInNewTab ? '_blank' : undefined}
        rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
        className={item.cssClass}
      >
        {item.icon && <span className={`icon-${item.icon}`} />}
        {item.label}
      </a>
      
      {hasChildren && (
        <ul className="sub-menu">
          {item.children.map(child => (
            <MenuItem key={child.id} item={child} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}
```

### Mobile Menu

```tsx
// components/mobile-menu.tsx
'use client';

import { useState } from 'react';
import { Menu as MenuIcon, X } from 'lucide-react';

export function MobileMenu({ menus }: { menus: Menu[] }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X /> : <MenuIcon />}
      </button>
      
      {isOpen && (
        <div className="mobile-menu-overlay">
          <nav>
            {menus.map(menu => (
              <MenuItem key={menu.id} item={menu} />
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
```

## Admin UI

### Menu Manager

Located at: `/admin/menus`

Features:
- **Drag & Drop**: Reorder menus visually
- **Inline Edit**: Click to edit label/URL
- **Quick Actions**: Show/hide, delete
- **Position Filter**: Switch between header/footer/etc
- **Preview**: See menu structure in real-time

### Usage

```typescript
// app/admin/menus/page.tsx
import { MenuManager } from '@/components/admin/menu-manager';

export default async function MenusPage() {
  const headerMenus = await getMenusByPosition('header');
  const footerMenus = await getMenusByPosition('footer');
  
  return (
    <div>
      <MenuManager
        position="header"
        menus={headerMenus}
      />
      
      <MenuManager
        position="footer"
        menus={footerMenus}
      />
    </div>
  );
}
```

## Multi-domain Behavior

### Automatic Filtering

All menu queries are automatically filtered by domain:

```typescript
// lib/menu.ts
import { getPrisma } from '@/lib/prisma';

export async function getMenusByPosition(position: string) {
  const prisma = await getPrisma(); // Auto-detects domain
  
  return prisma.menu.findMany({
    where: { 
      position,
      isVisible: true,
    },
    // No need to filter by domain - getPrisma() handles it
  });
}
```

### Domain-specific Menus

Each domain can have completely different menus:

- `tazagroup.vn` → Header: Home, Services, About, Contact
- `innerbright.vn` → Header: Trang chủ, Dịch vụ, Liên hệ
- `hderma.vn` → Header: Products, Treatments, Booking

## Best Practices

### 1. Menu Structure

```
Header Menu (Max 2-3 levels)
├── Home
├── Services
│   ├── Web Design
│   ├── SEO
│   └── Marketing
├── About
│   ├── Team
│   └── History
└── Contact

Footer Menu (Flat structure)
├── Privacy Policy
├── Terms of Service
└── Sitemap
```

### 2. Performance

```typescript
// Cache menus (they change rarely)
import { unstable_cache } from 'next/cache';

export const getMenusByPosition = unstable_cache(
  async (position: string) => {
    const prisma = await getPrisma();
    return prisma.menu.findMany({ where: { position } });
  },
  ['menus'],
  { revalidate: 3600 } // 1 hour
);
```

### 3. Accessibility

```tsx
<nav aria-label="Main navigation">
  <ul role="menubar">
    {menus.map(menu => (
      <li role="none" key={menu.id}>
        <a role="menuitem" href={menu.url}>
          {menu.label}
        </a>
      </li>
    ))}
  </ul>
</nav>
```

### 4. SEO-friendly URLs

```typescript
// Auto-generate URL from page
function getMenuUrl(menu: Menu): string {
  if (menu.type === 'page' && menu.page) {
    return `/${menu.page.slug}`;
  }
  if (menu.type === 'post' && menu.page) {
    return `/posts/${menu.page.slug}`;
  }
  return menu.url || '#';
}
```

## Troubleshooting

### Menu Not Showing

**Check:**
1. `isVisible: true`
2. Correct `position` value
3. Domain matches current domain
4. Parent menu is visible (if sub-menu)

### Wrong Order

**Fix:**
```typescript
// Reset order
const menus = await prisma.menu.findMany({
  where: { position: 'header' },
  orderBy: { order: 'asc' },
});

// Update order sequentially
for (let i = 0; i < menus.length; i++) {
  await prisma.menu.update({
    where: { id: menus[i].id },
    data: { order: i },
  });
}
```

### Broken Links

**Solution:**
```typescript
// Validate menu links
const menus = await prisma.menu.findMany({
  include: { page: true },
});

for (const menu of menus) {
  if (menu.type === 'page' && !menu.page) {
    console.error(`Menu ${menu.id} has invalid page reference`);
    // Option: Delete or fix
  }
}
```

---

**See Also:**
- [Multi-domain System](./MULTI_DOMAIN.md)
- [Content Management](./CONTENT_MANAGEMENT.md)
