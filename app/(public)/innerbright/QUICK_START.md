# Quick Reference - Ve InnerBright

## 📂 Cấu trúc
```
ve-innerbright/
├── page.tsx                      # Main page (8 lines)
├── types.ts                      # Type definitions
├── data.ts                       # Data configuration
├── README.md                     # Full documentation
└── components/
    ├── index.ts                 # Export file
    ├── HeroSection.tsx          # Section 1 - Hero
    ├── MissionVisionSection.tsx # Section 2 - Mission/Vision
    └── TargetIcon.tsx           # Target SVG icon
```

## 🎯 Cách dùng nhanh

### Import components
```typescript
import { HeroSection, MissionVisionSection } from "./components";
import { defaultPageData } from "./data";
```

### Sử dụng
```typescript
<HeroSection slides={defaultPageData.hero.slides} />
<MissionVisionSection data={defaultPageData.missionVision} />
```

## ✏️ Chỉnh sửa nội dung

**File `data.ts`** - Thay đổi text, images, values:
```typescript
export const defaultPageData = {
  hero: {
    slides: [{ ... }]
  },
  missionVision: {
    mission: { title, description },
    vision: { title, description },
    coreValues: { title, values: [] }
  }
}
```

## 🔧 Thêm section mới

1. Tạo file trong `components/NewSection.tsx`
2. Export trong `components/index.ts`
3. Import và dùng trong `page.tsx`

## ✅ Ưu điểm

- ✅ Code clean, dễ đọc
- ✅ Components tái sử dụng được
- ✅ Type-safe với TypeScript
- ✅ Data được tách riêng
- ✅ Dễ maintain và scale
- ✅ Không có lỗi compile
