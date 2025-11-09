# 📦 Hệ Thống Quản Lý Kho QR

Ứng dụng quản lý kho hàng tự động với QR Code - Mobile-first PWA

## 🚀 Quick Start

```bash
# 1. Cài đặt
npm install

# 2. Setup database
npm run db:migrate
npm run db:seed

# 3. Chạy app
npm run dev

# 4. Xem database (optional)
npm run db:studio
```

Mở: http://localhost:3000

## 📱 Tính năng

- ✅ **Nhập hàng**: Tạo lô → Tạo thùng → In QR kép
- ✅ **Xuất hàng**: Quét QR → Confirm xuất
- ✅ **Kiểm kê**: Quét từng SP → Có/Không có
- ✅ **Dashboard**: Thống kê realtime theo lô
- ✅ **PWA**: Cài đặt như app, offline support
- ✅ **QR Scanner**: Camera + Manual input fallback

## 🛠 Tech Stack

- **Next.js 16** (React 19, Turbopack)
- **shadcn/ui** (15+ components)
- **Prisma** (SQLite → PostgreSQL ready)
- **QR**: qrcode + html5-qrcode
- **Mobile-first** + Responsive

## 📖 Chi tiết sử dụng

Xem file **HUONG-DAN-SU-DUNG.md** để biết:
- Quy trình workflow chi tiết
- Cấu trúc database đầy đủ
- Danh sách Server Actions
- Hướng dẫn triển khai

## 🎯 Workflow ngắn gọn

1. **NV Nhập**: Tạo lô → Tạo thùng → In QR → Dán lên SP
2. **NV Xuất**: Quét QR SP → Confirm xuất
3. **NV Kiểm**: Quét QR → Đánh dấu Có/Không
4. **Giám đốc**: Mở app → Xem Dashboard

## � Cấu trúc

```
app/
  ├── page.tsx           # Home (stats)
  ├── import/            # Nhập hàng (4 tabs)
  ├── export/            # Xuất hàng
  ├── inventory/         # Kiểm kê
  └── dashboard/         # Báo cáo
components/
  ├── ui/                # shadcn/ui
  ├── import/            # Import forms
  ├── qr-scanner.tsx     # QR scanner
  └── qr-label-printer.tsx  # Print QR
lib/
  ├── warehouse-actions.ts  # 15+ actions
  └── prisma.ts
prisma/
  ├── schema.prisma      # 7 models
  └── seed.ts            # Demo data
```

## � Quy tắc code

- ✅ Clean Architecture
- ✅ Mobile-first + PWA
- ✅ Combobox thay Select
- ✅ Dialog: header/footer/scrollable
- ✅ Giao diện tiếng Việt
- ✅ UUID cho tất cả ID

## 🔧 Database Commands

```bash
npm run db:studio    # Prisma Studio
npm run db:migrate   # Create migration
npm run db:seed      # Seed demo data
npm run db:reset     # Reset DB
```

1. **Database changes**: Chạy `npm run db:migrate` sau khi thay đổi schema
2. **Type safety**: Prisma tự generate types cho database
3. **Real-time data**: Sử dụng `revalidatePath()` để update UI
4. **Toast notifications**: Tự động hiển thị thành công/lỗi

---

Built with ❤️ using Next.js + shadcn/ui + Prisma
