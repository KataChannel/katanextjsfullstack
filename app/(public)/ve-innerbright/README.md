# Ve InnerBright Page Structure

Trang "Về InnerBright" được tổ chức thành các module độc lập để dễ quản lý và bảo trì.

## 📁 Cấu trúc thư mục

```
ve-innerbright/
├── page.tsx                    # Trang chính (main page)
├── types.ts                    # Type definitions
├── data.ts                     # Data configuration
├── README.md                   # Tài liệu này
└── components/                 # Thư mục components
    ├── index.ts               # Export tất cả components
    ├── HeroSection.tsx        # Section 1 - Hero banner
    ├── MissionVisionSection.tsx # Section 2 - Sứ mệnh, Tầm nhìn
    └── TargetIcon.tsx         # Target/bullseye icon SVG
```

## 🎯 Các Components

### 1. **HeroSection.tsx**
Section hero banner với:
- Background gradient xanh dương
- Tiêu đề "CÂU CHUYỆN về INNERBRIGHT"
- Thông tin về InnerBright
- Badge "Bởi nhà đào tạo CHLOE QUÝ CHÂU"
- Hình ảnh trainer
- Carousel dots (nếu có nhiều slides)

**Props:**
```typescript
interface HeroSectionProps {
  slides?: HeroSlide[];
}
```

### 2. **MissionVisionSection.tsx**
Section sứ mệnh, tầm nhìn và giá trị cốt lõi với:
- Tiêu đề "MANG TRONG MÌNH KHÁT VỌNG"
- Target icon ở giữa
- Sứ mệnh (trái trên)
- Tầm nhìn (trái dưới)
- Giá trị cốt lõi (phải)

**Props:**
```typescript
interface MissionVisionSectionProps {
  data?: MissionVisionData;
}
```

### 3. **TargetIcon.tsx**
SVG icon target/bullseye với mũi tên trúng đích.

## 📝 Types (types.ts)

Định nghĩa các kiểu dữ liệu:

```typescript
export interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  subDescription: string;
  badge: string;
  image: string;
}

export interface MissionVisionData {
  mission: {
    title: string;
    description: string;
  };
  vision: {
    title: string;
    description: string;
  };
  coreValues: {
    title: string;
    values: string[];
  };
}
```

## 🗃️ Data (data.ts)

Chứa dữ liệu mặc định cho trang:
- Hero slides
- Mission & Vision content
- Core values

## 🔧 Cách sử dụng

### Cơ bản (sử dụng data mặc định)

```typescript
import { HeroSection, MissionVisionSection } from "./components";
import { defaultPageData } from "./data";

export default function VeInnerbrightPage() {
  return (
    <div>
      <HeroSection slides={defaultPageData.hero.slides} />
      <MissionVisionSection data={defaultPageData.missionVision} />
    </div>
  );
}
```

### Tùy chỉnh data

```typescript
const customData = {
  hero: {
    slides: [
      {
        id: 1,
        title: "Tiêu đề mới",
        // ... other fields
      }
    ]
  },
  missionVision: {
    mission: {
      title: "SỨ MỆNH MỚI",
      description: "Mô tả mới..."
    },
    // ... other fields
  }
};

<HeroSection slides={customData.hero.slides} />
<MissionVisionSection data={customData.missionVision} />
```

### Fetch data từ API

```typescript
"use client";

import { useEffect, useState } from "react";
import { HeroSection, MissionVisionSection } from "./components";
import { defaultPageData } from "./data";
import type { VeInnerbrightPageData } from "./types";

export default function VeInnerbrightPage() {
  const [pageData, setPageData] = useState<VeInnerbrightPageData>(defaultPageData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/ve-innerbright');
        const data = await res.json();
        setPageData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <HeroSection slides={pageData.hero.slides} />
      <MissionVisionSection data={pageData.missionVision} />
    </div>
  );
}
```

## ✨ Lợi ích của cấu trúc này

1. **Dễ bảo trì**: Mỗi component độc lập, dễ chỉnh sửa
2. **Tái sử dụng**: Components có thể dùng ở trang khác
3. **Type-safe**: TypeScript đảm bảo type safety
4. **Tách biệt logic và data**: Dữ liệu được quản lý riêng
5. **Dễ mở rộng**: Thêm section mới rất đơn giản
6. **Testing**: Dễ viết unit test cho từng component

## 🔄 Thêm Section mới

1. Tạo component mới trong `components/`:
```typescript
// components/NewSection.tsx
export default function NewSection() {
  return (
    <section>
      {/* Your content */}
    </section>
  );
}
```

2. Export trong `components/index.ts`:
```typescript
export { default as NewSection } from './NewSection';
```

3. Sử dụng trong `page.tsx`:
```typescript
import { HeroSection, MissionVisionSection, NewSection } from "./components";

export default function VeInnerbrightPage() {
  return (
    <div>
      <HeroSection />
      <MissionVisionSection />
      <NewSection />
    </div>
  );
}
```

## 📦 Dependencies

- Next.js (Image component)
- React (useState, useEffect)
- TypeScript
- Tailwind CSS

## 🎨 Styling

Tất cả styling sử dụng Tailwind CSS với:
- Custom colors: `#0a2351`, `#ffa500`, `#1e4cb8`, etc.
- Responsive breakpoints: `sm:`, `md:`, `lg:`, `xl:`
- Gradient backgrounds
- Custom animations

## 📱 Responsive Design

Tất cả components đã được tối ưu cho:
- Mobile (< 640px)
- Tablet (640px - 1024px)
- Desktop (> 1024px)
