# Block Templates - Cải Tiến Update & Group Elements

## Ngày: 13/11/2025 (Update 2)

## Vấn đề đã giải quyết

### 1. ✅ Làm sao để cập nhật/chỉnh sửa Block Templates

**Vấn đề cũ:**
- Chỉ có thể tạo template mới
- Muốn update phải xóa template cũ và tạo lại
- Không có UI để update elements của template có sẵn

**Giải pháp mới:**

#### A. Cập nhật metadata (Tên, Mô tả, Category) - Admin Page
- Vào Admin → Block Templates
- Click icon Pencil trên template
- Edit name, description, category
- Click "Cập nhật metadata"

#### B. Cập nhật Elements - Page Builder (NEW!)
**Workflow:**
1. Vào Page Builder (tạo page mới hoặc dùng page test)
2. Click tab "Templates" → Click vào template cần update
3. Template được add vào canvas
4. Chỉnh sửa elements:
   - Thay đổi position, size
   - Edit content, style
   - Thêm hoặc xóa elements
5. Click button "Template" trên toolbar
6. Trong dialog, chọn **"Cập nhật có sẵn"** (nút toggle)
7. Chọn template cần update từ dropdown
8. Click "Cập nhật template"

**Tính năng mới:**
- ✨ **2 chế độ trong dialog:**
  - **"Tạo mới"**: Tạo template mới với metadata mới
  - **"Cập nhật có sẵn"**: Ghi đè elements của template có sẵn

- ⚠️ **Cảnh báo khi update:**
  - Elements hiện tại sẽ GHI ĐÈ elements cũ
  - Metadata (tên, mô tả, category) giữ nguyên
  - Không thể hoàn tác

- 🔍 **Combobox chọn template:**
  - Danh sách tất cả templates hiện có
  - Search để tìm nhanh
  - Hiển thị tên template

### 2. ✅ Elements không group và hiển thị loạn xạ

**Vấn đề cũ:**
- Khi add template, mỗi element được add riêng lẻ
- Elements rải rác trên canvas, khó di chuyển cùng lúc
- Không có cấu trúc parent-child
- Layout không được preserve

**Giải pháp mới:**

#### A. Container Wrapper cho Template
Khi add template, hệ thống tự động:

1. **Tạo Container Wrapper:**
   ```typescript
   {
     id: 'template-container-{timestamp}',
     type: 'container',
     name: 'Template: {template_name}',
     x: 100, y: 100,
     width: templateWidth + 40,  // Auto-calculated
     height: templateHeight + 40,
     style: {
       backgroundColor: 'transparent',
       border: '1px dashed #e5e7eb'  // Visual indicator
     }
   }
   ```

2. **Add tất cả elements vào container:**
   - Position relative to container (+ 20px padding)
   - Set `parentId` = container ID
   - Update `container.children` với list element IDs

3. **Kết quả:**
   - Template là 1 unit có thể di chuyển
   - Elements giữ nguyên layout relative với nhau
   - Border dashed để dễ nhận biết container
   - Dễ group/ungroup sau này

#### B. Bounding Box Calculation
```typescript
const minX = Math.min(...elements.map(el => el.x));
const minY = Math.min(...elements.map(el => el.y));
const maxX = Math.max(...elements.map(el => el.x + el.width));
const maxY = Math.max(...elements.map(el => el.y + el.height));

const templateWidth = maxX - minX;
const templateHeight = maxY - minY;
```

#### C. Position Normalization
```typescript
// Element position trong container (relative)
newElement.x = (element.x - minX) + 20;  // 20px padding
newElement.y = (element.y - minY) + 20;
```

## Code Changes

### 1. `components/page-builder/PageBuilderEditor.tsx`

**New State:**
```typescript
const [existingTemplates, setExistingTemplates] = useState<any[]>([]);
const [selectedExistingTemplate, setSelectedExistingTemplate] = useState<string>('');
```

**New Functions:**
```typescript
// Fetch templates khi mở dialog
useEffect(() => {
  if (showSaveTemplateDialog) {
    fetchExistingTemplates();
  }
}, [showSaveTemplateDialog]);

const fetchExistingTemplates = async () => {
  const res = await fetch('/api/admin/block-templates');
  const data = await res.json();
  setExistingTemplates(data);
};

// Update existing template
const handleUpdateTemplate = async () => {
  const selectedElements = canvas.selectedIds.length > 0
    ? canvas.selectedIds.map(id => canvas.elements[id]).filter(Boolean)
    : Object.values(canvas.elements);

  await fetch('/api/admin/block-templates', {
    method: 'PUT',
    body: JSON.stringify({
      id: selectedExistingTemplate,
      elements: selectedElements,  // Only update elements
      // Keep existing metadata
    }),
  });
};
```

**Updated Dialog:**
- Toggle buttons: "Tạo mới" vs "Cập nhật có sẵn"
- Conditional form: New template fields OR existing template dropdown
- Warning box khi chọn update
- Dynamic button text: "Tạo template mới" / "Cập nhật template"

### 2. `components/page-builder/ComponentSidebar.tsx`

**Updated handleAddTemplate:**
```typescript
const handleAddTemplate = (template: any) => {
  // 1. Calculate bounding box
  const minX = Math.min(...template.elements.map(el => el.x || 0));
  const minY = Math.min(...template.elements.map(el => el.y || 0));
  const maxX = Math.max(...template.elements.map(el => (el.x || 0) + (el.width || 0)));
  const maxY = Math.max(...template.elements.map(el => (el.y || 0) + (el.height || 0)));
  
  const templateWidth = maxX - minX;
  const templateHeight = maxY - minY;

  // 2. Create container wrapper
  const containerId = `template-container-${Date.now()}`;
  const containerElement = {
    id: containerId,
    type: 'container',
    name: `Template: ${template.name}`,
    x: 100, y: 100,
    width: templateWidth + 40,
    height: templateHeight + 40,
    children: [],
  };
  addElement(containerElement);

  // 3. Add children with relative position
  const childIds = [];
  template.elements.forEach((element, index) => {
    const childId = `${element.type}-${Date.now()}-${index}`;
    const newElement = {
      ...element,
      id: childId,
      x: (element.x - minX) + 20,
      y: (element.y - minY) + 20,
      parentId: containerId,
    };
    addElement(newElement);
    childIds.push(childId);
  });

  // 4. Update container.children
  updateElement(containerId, { children: childIds });
};
```

### 3. `app/admin/block-templates/page.tsx`

**Updated Dialog Note:**
- Hướng dẫn chi tiết 8 bước để update template
- Warning về việc không thể edit trực tiếp trong admin
- Button text: "Cập nhật metadata" (rõ ràng hơn)

## Workflows

### Workflow 1: Tạo Template Mới
1. Page Builder → Thiết kế layout
2. Click "Template" → Chọn "Tạo mới"
3. Điền name, description, category
4. Click "Tạo template mới"
5. Template xuất hiện trong Admin page và Templates tab

### Workflow 2: Update Template (Elements)
1. Page Builder → Tab "Templates"
2. Click template cần update → Elements add vào canvas
3. Chỉnh sửa elements (edit, add, delete, reposition)
4. Click "Template" → Chọn "Cập nhật có sẵn"
5. Chọn template từ dropdown
6. Click "Cập nhật template"
7. Elements của template được ghi đè

### Workflow 3: Update Template (Metadata)
1. Admin → Block Templates
2. Click icon Pencil
3. Edit name, description, category
4. Click "Cập nhật metadata"

### Workflow 4: Sử dụng Template
1. Page Builder → Tab "Templates"
2. Click template
3. **Container với tất cả elements được add vào canvas**
4. Di chuyển/resize container = di chuyển cả group
5. Double-click container để edit children

## Benefits

### Before (Old):
❌ Elements riêng lẻ, khó quản lý  
❌ Không thể update template, phải tạo mới  
❌ Layout không được preserve  
❌ Phải select nhiều elements để di chuyển  

### After (New):
✅ Template = 1 container wrapper dễ di chuyển  
✅ Update template trực tiếp từ Page Builder  
✅ Layout được preserve hoàn hảo  
✅ Parent-child structure rõ ràng  
✅ 2 chế độ: Create new / Update existing  
✅ Warning khi update để tránh mất data  

## Technical Details

### Container Structure:
```json
{
  "container": {
    "id": "template-container-1234567890",
    "type": "container",
    "name": "Template: Mạng Trong Mình Khát Vọng",
    "x": 100,
    "y": 100,
    "width": 1240,
    "height": 480,
    "style": {
      "backgroundColor": "transparent",
      "border": "1px dashed #e5e7eb"
    },
    "children": ["heading-1", "text-2", "container-3", ...]
  },
  "children": {
    "heading-1": {
      "id": "heading-1",
      "parentId": "template-container-1234567890",
      "x": 20,  // Relative to container
      "y": 20,
      ...
    }
  }
}
```

### API Update Flow:
```
PUT /api/admin/block-templates
{
  "id": "template-uuid",
  "name": "existing name",        // Giữ nguyên
  "description": "existing desc",  // Giữ nguyên
  "category": "hero",              // Giữ nguyên
  "published": true,               // Giữ nguyên
  "thumbnail": "url",              // Giữ nguyên
  "elements": [...]                // GHI ĐÈ
}
```

## Notes

- Container border dashed để phân biệt với elements thật
- Container transparent để không che khuất content
- Padding 20px để elements không sát mép
- Template name trong container name để dễ nhận biết
- Update chỉ ghi đè elements, không đụng metadata
- Admin page chỉ edit metadata, không edit elements

## Known Limitations

1. **Nested Containers:**
   - Template container không support nested deep
   - Khuyến khích flat structure

2. **Undo/Redo:**
   - Chưa có undo cho template update
   - Recommend tạo backup trước khi update

3. **Preview:**
   - Chưa có preview template trước khi update
   - Future: Show diff old vs new

## Testing Checklist

- [x] Create new template từ Page Builder
- [x] Update existing template (elements)
- [x] Update template metadata (admin page)
- [x] Add template vào canvas → elements được group trong container
- [x] Container có border dashed
- [x] Elements có parentId đúng
- [x] Di chuyển container → children follow
- [x] Toggle "Tạo mới" / "Cập nhật có sẵn"
- [x] Combobox chọn template
- [x] Warning hiển thị khi chọn update
- [x] Toast notifications
- [x] No compile errors

## Conclusion

✅ **Vấn đề 1 (Update template)**: SOLVED  
- 2 cách update: Metadata (admin) + Elements (page builder)
- UI rõ ràng với toggle + warning

✅ **Vấn đề 2 (Elements loạn xạ)**: SOLVED  
- Container wrapper tự động group
- Parent-child structure
- Layout được preserve

---

**Status:** ✅ COMPLETED  
**Impact:** Template system giờ hoàn chỉnh và professional  
**User Experience:** Dễ sử dụng, rõ ràng, an toàn
