# HƯỚNG DẪN TEST FIX BUG PAGE BUILDER

**Kiểm tra fix bug elements không load**

---

## 🎯 MỤC ĐÍCH

Verify rằng Page Builder **load và hiển thị elements đúng** sau khi:
1. Lưu page builder
2. Refresh trang
3. Quay lại sau

---

## 🔍 KIỂM TRA DATA HIỆN TẠI

### **Chạy script check:**
```bash
bun run scripts/check-page-builder-data.ts
```

### **Kết quả mong đợi:**
```
📊 Found 4 pages with blocks

📄 Page 1: Landing Page Demo
   🧩 Elements at root:
      - Format: Array ❌  → Sẽ được convert thành Object
      - Count: 5

📄 Page 4: Page Builder 1
   🧩 Elements at root:
      - Format: Object ✅  → Load trực tiếp
      - Count: 6
```

**✅ Cả 2 format đều được hỗ trợ!**

---

## 🧪 TEST CASES

### **Test 1: Load Page Seed Data (Array Format)**

#### **URL:** 
```
http://localhost:3000/admin/page-builder/c2bdfc56-e2e3-4931-a854-47d08a60db98
```
*(Landing Page Demo)*

#### **Expected Console Logs:**
```
📂 Loading Page Builder data: {
  pageId: "c2bdfc56...",
  hasBlocks: true,
  blocksKeys: ["canvas", "elements", "history"]
}

🎨 Loading canvas settings: {
  zoom: 1,
  gridSize: 8,
  snapToGrid: true
}

🧩 Loading elements: {
  type: "array",     ← Array format từ seed
  count: 5
}

✅ Converted array to object: 5 elements
✅ Elements loaded into store
```

#### **Expected Result:**
- ✅ Canvas hiển thị 5 elements
- ✅ hero-container visible
- ✅ hero-heading visible
- ✅ hero-text visible
- ✅ CTA button visible
- ✅ features-container visible

---

### **Test 2: Load Page Mới Tạo (Object Format)**

#### **URL:**
```
http://localhost:3000/admin/page-builder/18d4a799-7ac5-4390-9ac1-ed042aa5de1e
```
*(Page Builder 1)*

#### **Expected Console Logs:**
```
📂 Loading Page Builder data: {
  pageId: "18d4a799...",
  hasBlocks: true,
  blocksKeys: ["canvas", "elements", "history"]
}

🧩 Loading elements: {
  type: "object",    ← Object format từ save mới
  count: 6
}

✅ Using object format: 6 elements
✅ Elements loaded into store
```

#### **Expected Result:**
- ✅ Canvas hiển thị 6 elements
- ✅ Tất cả elements ở đúng vị trí
- ✅ Không có lỗi console

---

### **Test 3: Tạo Mới, Lưu, Load Lại**

#### **Bước 1: Tạo Page Builder Mới**
```
1. Vào /admin/content
2. Click "Tạo nội dung"
3. Chọn "Page Builder (Visual)"
4. Điền:
   - Title: "Test Fix Bug"
   - Slug: "test-fix-bug"
5. Click "Tạo & Mở Builder"
```

#### **Bước 2: Thêm Elements**
```
1. Drag "Container" vào canvas
2. Drag "Text" vào canvas
3. Drag "Button" vào canvas
4. Resize và position các elements
```

#### **Bước 3: Lưu**
```
1. Click nút "Lưu"
2. Check console log:
   💾 Saving Page Builder: {
     elementsCount: 3,
     elementIds: ["container-xxx", "text-xxx", "button-xxx"]
   }
3. Toast hiển thị: "Đã lưu page thành công!"
```

#### **Bước 4: Refresh Trang**
```
1. Press F5 hoặc Ctrl+R
2. Đợi page load lại
```

#### **Expected Console Logs:**
```
📂 Loading Page Builder data: { ... }
🧩 Loading elements: {
  type: "object",
  count: 3
}
✅ Using object format: 3 elements
✅ Elements loaded into store
```

#### **Expected Result:**
- ✅ Canvas hiển thị đúng 3 elements
- ✅ Vị trí và size giữ nguyên
- ✅ Có thể tiếp tục chỉnh sửa

---

### **Test 4: Lưu Lại Sau Khi Chỉnh Sửa**

#### **Bước 1: Load Page**
```
Mở bất kỳ page builder nào
```

#### **Bước 2: Chỉnh Sửa**
```
1. Add thêm 2 elements mới
2. Di chuyển 1 element cũ
3. Resize 1 element
```

#### **Bước 3: Lưu**
```
1. Click "Lưu"
2. Check console:
   💾 Saving: { elementsCount: 5 }  ← Tăng từ 3 lên 5
```

#### **Bước 4: Quay Lại**
```
1. Click "Back" về /admin/content
2. Tìm page vừa chỉnh sửa
3. Click "Edit Builder"
```

#### **Expected Result:**
- ✅ Load lại với 5 elements (không mất 2 elements mới)
- ✅ Vị trí mới được giữ nguyên
- ✅ Size mới được giữ nguyên

---

## ❌ EXPECTED FAILURES (Before Fix)

### **Without Fix:**
```
📂 Loading Page Builder data: { ... }
🧩 Loading elements: {
  type: "array",
  count: 5
}
❌ Direct assign array to object store
❌ Canvas empty!
❌ Elements not rendered
```

### **With Fix:**
```
📂 Loading Page Builder data: { ... }
🧩 Loading elements: {
  type: "array",
  count: 5
}
✅ Converted array to object: 5 elements
✅ Canvas shows all elements!
```

---

## 🔧 DEBUG COMMANDS

### **Check Database Data:**
```bash
bun run scripts/check-page-builder-data.ts
```

### **Test Load Logic:**
```bash
bun run scripts/test-page-builder-load.ts
```

### **Run Dev Server:**
```bash
# Option 1: Specific domain
echo "1" | bun run dev

# Option 2: All domains
echo "7" | bun run dev
```

### **Check Browser Console:**
```
F12 → Console tab
Filter: "Loading" or "Saving"
```

---

## ✅ SUCCESS CRITERIA

### **All Tests Pass:**
- ✅ Seed data (array) → Converts to object → Renders correctly
- ✅ New data (object) → Uses directly → Renders correctly
- ✅ Save → Refresh → Load → Elements persist
- ✅ Edit → Save → Back → Edit → Changes persist
- ✅ No console errors
- ✅ No empty canvas after load

---

## 📊 VERIFICATION CHECKLIST

```
□ Check data format in DB (run check script)
□ Test load page with array format (seed data)
□ Test load page with object format (new save)
□ Test create new → save → refresh → load
□ Test edit existing → save → back → edit
□ Verify console logs show correct conversion
□ Verify no errors in browser console
□ Verify elements render at correct positions
□ Verify can continue editing after load
```

---

## 🐛 TROUBLESHOOTING

### **Issue: Canvas still empty after fix**

**Check:**
```bash
bun run scripts/check-page-builder-data.ts
```

**Look for:**
- Are there elements in DB?
- What format? Array or Object?
- Are they at `blocks.elements` or `blocks.canvas.elements`?

**Solution:**
- If no elements → Add elements and save
- If wrong format → Code should auto-convert
- If at wrong location → Code checks both paths

### **Issue: Console shows errors**

**Common Errors:**
```
TypeError: Cannot read property 'id' of undefined
→ Elements not converted properly

TypeError: elements.map is not a function  
→ Elements is object, not array (this is correct!)

Warning: Each child should have unique key
→ Normal React warning, not related to bug
```

---

## 📚 RELATED DOCS

- `docs/29-FIX_PAGE_BUILDER_ELEMENTS_LOSS.md` - Chi tiết kỹ thuật
- `docs/27-PHAN_BIET_PAGES_VA_PAGE_BUILDER.md` - Phân biệt formats
- `docs/28-TAO_TRUC_TIEP_PAGE_BUILDER.md` - Workflow tạo mới

---

**📅 Last Updated:** 13/11/2025  
**✅ Fix Verified:** Yes  
**🧪 All Tests:** Pass
