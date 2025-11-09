# Hệ Thống Quản Lý Kho QR

## Tổng Quan
Ứng dụng quản lý kho hàng tự động với mã QR, hỗ trợ nhập/xuất/kiểm kê nhanh chóng qua quét mã.

## Công Nghệ
- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **UI**: shadcn/ui (15+ components)
- **Database**: Prisma ORM + SQLite
- **QR**: qrcode (tạo), html5-qrcode (quét)
- **Mobile**: PWA-ready, responsive

## Cấu Trúc Database
```
Warehouse (Kho) → Lot (Lô) → Box (Thùng) → Product (Sản phẩm)
                                          ↓
                                   StockMovement (Lịch sử)
                                   InventoryCheck (Kiểm kê)
```

## Quy Trình Sử Dụng

### 1. Nhập Hàng (/import)
**4 bước:**
1. **Tạo Lô** → Tự động sinh mã `LOT-YYYYMMDD-XXX`
2. **Tạo Thùng** → Sinh mã `BOX-{LOT_CODE}-XXX` + QR code
3. **Tạo Sản Phẩm** → Nhập hàng loạt, mỗi SP có QR riêng
4. **Quét Thùng** → Xác nhận thùng đã có hàng

**Kết quả**: In nhãn kép (thùng + SP) → Dán lên hàng

### 2. Xuất Hàng (/export)
1. Quét QR sản phẩm (camera hoặc nhập tay)
2. Xác nhận danh sách cần xuất
3. Nhấn "Xác Nhận Xuất" → Trạng thái chuyển sang "exported"

**Tự động**: Ghi lịch sử xuất kho

### 3. Kiểm Kê (/inventory)
1. Quét QR sản phẩm
2. Xác nhận: **Có hàng** (actualQty=1) hoặc **Không có** (actualQty=0)
3. Hệ thống tự động tính sai lệch (variance)

**Hiển thị**: Số SP đã kiểm

### 4. Báo Cáo (/dashboard)
**3 tab:**
- **Tổng quan**: Thống kê tổng kho/lô/thùng/SP, biểu đồ tồn/xuất
- **Tồn kho**: Chi tiết từng lô (code, số SP tồn, số thùng)
- **Lịch sử**: 20 giao dịch gần nhất (nhập/xuất/điều chỉnh)

## Cài Đặt & Chạy

### 1. Cài dependencies
```bash
npm install
```

### 2. Setup database
```bash
npx prisma migrate dev
```

### 3. Chạy dev
```bash
npm run dev
```

### 4. Mở Prisma Studio (theo dõi DB)
```bash
npx prisma studio
```

## Server Actions Chính

### Warehouse
- `getWarehouses()`, `createWarehouse()`

### Lot (Lô)
- `getLots()`, `createLot()` → Auto: `LOT-YYYYMMDD-XXX`

### Box (Thùng)
- `getBoxes()`, `createBox()` → Auto: `BOX-{LOT}-XXX` + QR JSON
- `getBoxByQRCode(qrCode)` → Tìm thùng theo QR

### Product (Sản phẩm)
- `getProducts()`, `createProducts()` → Bulk create + QR cho mỗi SP
- `getProductByQRCode(qrCode)` → Tìm SP theo QR
- `exportProducts(productIds[])` → Cập nhật status "exported"

### Inventory
- `createInventoryCheck()` → So sánh expectedQty vs actualQty
- `getDashboardStats()` → Thống kê tổng quan
- `getInventoryByLot()` → Tồn kho theo lô
- `getStockMovements(limit)` → Lịch sử giao dịch

### QR Code
- `generateQRCode(data)` → Tạo QR Data URL (PNG)

## Đặc Điểm Kỹ Thuật

### Clean Architecture
```
/app         → Pages (Server Components)
/components  → Client Components
/lib         → Server Actions + Prisma
/prisma      → Schema + Migrations
```

### Mobile-First
- Bottom Navigation (5 mục: Home, Nhập, Xuất, Kiểm, Báo cáo)
- Responsive grid layout
- PWA manifest sẵn sàng

### QR Structure
```json
{
  "type": "box" | "product",
  "code": "BOX-LOT-20240109-001-001",
  "id": "uuid",
  "timestamp": "2024-01-09T10:30:00Z"
}
```

### Quy Tắc shadcn/ui
- **KHÔNG dùng** `<select>` → Dùng `Combobox` (Command + Popover)
- **KHÔNG dùng** `react-qr-scanner` → Dùng `html5-qrcode` (React 19 compatible)

## Tình Huống Thực Tế

### Công Nhân Kho
1. **Sáng**: Nhập hàng mới → Tạo lô → In QR dán thùng+SP
2. **Trưa**: Xuất hàng → Quét QR → Xác nhận xuất
3. **Chiều**: Kiểm kê → Quét từng SP → Đánh dấu có/không

### Giám Đốc
1. Mở app → Xem Dashboard
2. Tab "Tồn kho" → Kiểm số lượng từng lô
3. Tab "Lịch sử" → Xem ai nhập/xuất gì, khi nào

## Lưu Ý
- **User ID**: Hiện dùng `"demo-user-id"` cố định → Cần thêm authentication thật
- **Camera**: Yêu cầu HTTPS hoặc localhost để truy cập camera
- **Fallback**: Nếu camera lỗi → Nhập mã QR thủ công
- **Database**: SQLite cho dev → Đổi PostgreSQL cho production
- **Icons PWA**: Cần tạo icon-192.png và icon-512.png từ icon.svg (sử dụng tool online hoặc ImageMagick)

## Chạy Ứng Dụng

### Bước 1: Cài đặt dependencies
```bash
npm install
```

### Bước 2: Setup database
```bash
npm run db:migrate
npm run db:seed
```

### Bước 3: Chạy development
```bash
npm run dev
```

### Bước 4: Mở Prisma Studio (tùy chọn)
```bash
npm run db:studio
```

Ứng dụng sẽ chạy tại: http://localhost:3000

## File Quan Trọng
- `/prisma/schema.prisma` → 6 models chính
- `/lib/warehouse-actions.ts` → 15+ server actions
- `/components/qr-scanner.tsx` → Universal QR scanner
- `/app/layout.tsx` → Mobile layout + bottom nav
- `/app/import/page.tsx` → Workflow 4 bước
- `/app/export/page.tsx` → Quét + xuất hàng
- `/app/inventory/page.tsx` → Kiểm kê
- `/app/dashboard/page.tsx` → Báo cáo 3 tab

## Liên Hệ
Project: https://github.com/KataChannel/katanextjsfullstack
Branch: `quanlykho`
