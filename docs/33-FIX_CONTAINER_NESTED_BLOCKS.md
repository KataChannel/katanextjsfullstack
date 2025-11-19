# Fix Container Block - Cannot Add Nested Blocks

## Vấn đề (Issue)

Container block trong Block Editor không thể thêm nested blocks bên trong. Khi drag block vào container, không có gì xảy ra.

## Nguyên nhân (Root Cause)

Có 2 vấn đề chính:

### 1. Thiếu DnD Sensors trong DndContext

`DndContext` không có sensors được config, dẫn đến drag events không được xử lý đúng cách.

```tsx
// ❌ TRƯỚC - Không có sensors
<DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
```

### 2. Container Children không có SortableContext

Children bên trong container được render trực tiếp mà không được wrap trong `SortableContext`, dẫn đến:
- Children không thể được reorder
- Container không nhận được drop events từ new blocks
- Nested drag/drop không hoạt động

```tsx
// ❌ TRƯỚC - Children không có SortableContext
{block.children?.map(child => (
  <SortableBlockRenderer key={child.id} block={child} />
))}
```

## Giải pháp (Solution)

### 1. Thêm PointerSensor vào DndContext

File: `components/block-editor/BlockEditor.tsx`

```tsx
import { 
  DndContext, 
  DragEndEvent, 
  DragOverlay, 
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

export function BlockEditor({ ... }) {
  // Setup DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px of movement required before drag starts
      },
    })
  );

  return (
    <DndContext 
      sensors={sensors}
      onDragStart={handleDragStart} 
      onDragEnd={handleDragEnd}
    >
      {/* ... */}
    </DndContext>
  );
}
```

**Lợi ích:**
- Drag activation có threshold 8px để tránh accidental drags
- Pointer events được xử lý đúng cho cả mouse và touch
- Performance tốt hơn với activation constraint

### 2. Wrap Container Children trong SortableContext

File: `components/block-editor/SortableBlockRenderer.tsx`

```tsx
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

case 'container': {
  const children = block.children || [];
  
  return (
    <div
      ref={setDropRef}
      className={`...`}
    >
      {children.length > 0 ? (
        <SortableContext 
          items={children.map(c => c.id)} 
          strategy={verticalListSortingStrategy}
        >
          {children.map(child => (
            <SortableBlockRenderer key={child.id} block={child} />
          ))}
        </SortableContext>
      ) : (
        <div className="p-8 text-center text-gray-400">
          Drop blocks here
        </div>
      )}
    </div>
  );
}
```

**Lợi ích:**
- Children có thể được reorder bên trong container
- Container nhận được drop events từ new blocks
- Nested containers hoạt động đúng (recursive nesting)
- Vertical list sorting strategy cho layout dọc

### 3. Thêm Debug Logs (temporary)

Để debug drag/drop issues, đã thêm console.log trong `handleDragEnd`:

```tsx
console.log('Drag End:', { 
  activeId: active.id, 
  overId: over.id, 
  dragData, 
  dropData 
});

if (dropData?.type === 'container') {
  console.log('Dropping into container:', { parentId, index, container });
}
```

**Note:** Nên remove sau khi test xong.

## Cách test (Testing)

### Test 1: Drag new block vào container

1. Mở Block Editor trong admin
2. Thêm container block vào canvas
3. Từ sidebar, drag một block bất kỳ (text, image, button...)
4. Drop vào bên trong container (vùng màu xanh khi hover)
5. ✅ Block sẽ được thêm vào bên trong container

### Test 2: Reorder blocks trong container

1. Container đã có 2-3 blocks bên trong
2. Drag một block trong container
3. Drop vào vị trí khác trong cùng container
4. ✅ Block được reorder đúng vị trí

### Test 3: Nested containers

1. Thêm container A vào canvas
2. Drag container B vào bên trong container A
3. Drag text block vào bên trong container B (nested)
4. ✅ Tất cả hoạt động đúng với nhiều levels nesting

### Test 4: Background styles

1. Container với background color `#e7bb40`
2. ✅ Background hiển thị đúng cả trong editor và frontend
3. Container với background image
4. ✅ Image hiển thị với size, position đúng

## Kết quả (Result)

✅ Container có thể nhận nested blocks
✅ Drag & drop mượt mà với activation threshold
✅ Children có thể reorder trong container
✅ Nested containers hoạt động đúng
✅ Background styles render đúng

## Files thay đổi (Changed Files)

1. `components/block-editor/BlockEditor.tsx`
   - Import PointerSensor, useSensor, useSensors
   - Setup sensors với activation constraint
   - Pass sensors vào DndContext
   - Thêm debug logs

2. `components/block-editor/SortableBlockRenderer.tsx`
   - Import SortableContext, verticalListSortingStrategy
   - Wrap container children trong SortableContext
   - Sử dụng children.map thay vì block.children?.map

## Ngày fix

2025-11-19
