# 🎉 SEED DATABASE HOÀN TẤT - DỮ LIỆU ĐẦY ĐỦ

## ✅ Tổng Quan

Đã tạo dữ liệu demo đầy đủ cho toàn bộ quy trình quản lý kho với PostgreSQL!

---

## 📊 Dữ Liệu Đã Tạo

### 👥 **Users (5 người)**
| Email | Tên | Role | Nhiệm vụ |
|-------|-----|------|----------|
| director@wh.com | Nguyễn Văn Giám Đốc | director | Xem báo cáo tổng quan |
| manager@wh.com | Trần Thị Quản Lý | manager | Quản lý kho, tạo lô |
| staff1@wh.com | Lê Văn Nhập | staff | Nhập hàng |
| staff2@wh.com | Phạm Thị Xuất | staff | Xuất hàng |
| staff3@wh.com | Hoàng Văn Kiểm | staff | Kiểm kê |

---

### 🏢 **Warehouses (5 kho)**

#### 1. **Kho Tổng (KHO-TONG)**
- Địa chỉ: Q1, HCM
- Vai trò: Kho trung tâm quản lý tổng

#### 2. **Kho Điện Tử (KHO-001)**
- Địa chỉ: Gò Vấp, HCM
- Chuyên: Điện tử, công nghệ

#### 3. **Kho Thực Phẩm (KHO-002)**
- Địa chỉ: Bình Thạnh, HCM
- Chuyên: Thực phẩm tươi sống

#### 4. **Kho Hóa Chất (KHO-003)**
- Địa chỉ: Bình Dương
- Chuyên: Hóa chất công nghiệp

#### 5. **Kho Dược Phẩm (KHO-004)**
- Địa chỉ: Q5, HCM
- Chuyên: Dược phẩm, y tế

---

### 📦 **Lots (5 lô)**
| Code | Tên | Kho | Người tạo |
|------|-----|-----|-----------|
| LOT-001 | Lô Điện Tử Q1 | KHO-001 | Lê Văn Nhập |
| LOT-002 | Lô Thực Phẩm Q1 | KHO-002 | Lê Văn Nhập |
| LOT-003 | Lô Hóa Chất Q1 | KHO-003 | Lê Văn Nhập |
| LOT-004 | Lô Dược Phẩm Q1 | KHO-004 | Lê Văn Nhập |
| LOT-005 | Lô Tết 2025 | KHO-TONG | Trần Thị Quản Lý |

---

### 📦 **Boxes (15 thùng)**

**Phân bổ:**
- Lô 1 (Điện tử): 3 thùng (BOX-001, BOX-002, BOX-003)
- Lô 2 (Thực phẩm): 2 thùng (BOX-004, BOX-005)
- Lô 3 (Hóa chất): 1 thùng (BOX-006)
- Lô 4 (Dược phẩm): 4 thùng (BOX-007 đến BOX-010)
- Lô 5 (Tết): 5 thùng (BOX-011 đến BOX-015)

**Mỗi thùng:**
- Có QR code riêng
- Sức chứa: 100 sản phẩm
- Chứa 10 sản phẩm đa dạng

---

### 🏷️ **Products (150 sản phẩm - 5 loại)**

#### **Loại 1: Laptop Dell XPS**
- Đơn vị: chiếc
- Số lượng: 30 sản phẩm
- Phân bổ: Khắp các thùng

#### **Loại 2: Cá Hồi Na Uy**
- Đơn vị: kg
- Số lượng: 30 sản phẩm
- Phân bổ: Khắp các thùng

#### **Loại 3: Acid H2SO4**
- Đơn vị: lít
- Số lượng: 30 sản phẩm
- Phân bổ: Khắp các thùng

#### **Loại 4: Thuốc Paracetamol**
- Đơn vị: chiếc
- Số lượng: 30 sản phẩm
- Phân bổ: Khắp các thùng

#### **Loại 5: Tivi Samsung**
- Đơn vị: chiếc
- Số lượng: 30 sản phẩm
- Phân bổ: Khắp các thùng

**Trạng thái:**
- ✅ In Stock: ~105 sản phẩm (70%)
- 📤 Exported: ~45 sản phẩm (30%)

**Mỗi sản phẩm có:**
- QR code riêng duy nhất
- Mã code (PRD-BOX-XXX-YYY)
- Thông tin đơn vị, tên, trạng thái

---

### 📊 **Stock Movements (50 phiếu)**

#### **Nhập kho (Import)**
- Số lượng: ~35 phiếu
- Người thực hiện: Lê Văn Nhập
- Ghi chú: "Nhập kho"
- Số lượng mỗi phiếu: Random 1-10

#### **Xuất kho (Export)**
- Số lượng: ~15 phiếu
- Người thực hiện: Phạm Thị Xuất
- Ghi chú: "Xuất kho"
- Số lượng mỗi phiếu: Random 1-10

**Mỗi phiếu chứa:**
- Type (import/export)
- Quantity
- Note
- Link đến Product, Box
- User thực hiện
- Timestamp

---

### ✅ **Inventory Checks (20 phiếu)**

**Thông tin:**
- Loại: periodic (định kỳ)
- Trạng thái: completed (hoàn thành)
- Số lượng: 20 phiếu kiểm kê
- Người kiểm: Hoàng Văn Kiểm

**Chi tiết mỗi phiếu:**
- Expected Qty: 10
- Actual Qty: 10
- Difference: 0 (chính xác)
- Completed At: Ngày hiện tại
- Link đến Product cụ thể

---

## 🎯 Quy Trình Đầy Đủ

### 1️⃣ **Nhập Hàng (Import)**
```
User: staff1@wh.com (Lê Văn Nhập)
Flow:
1. Tạo Lô mới (Lot)
2. Tạo Thùng trong Lô (Box với QR)
3. Tạo Sản phẩm trong Thùng (Product với QR)
4. Tự động tạo StockMovement type="import"
```

### 2️⃣ **Xuất Hàng (Export)**
```
User: staff2@wh.com (Phạm Thị Xuất)
Flow:
1. Quét QR sản phẩm
2. Xuất sản phẩm (status → "exported")
3. Tạo StockMovement type="export"
```

### 3️⃣ **Kiểm Kê (Inventory)**
```
User: staff3@wh.com (Hoàng Văn Kiểm)
Flow:
1. Quét QR sản phẩm
2. Nhập số lượng thực tế
3. Tạo InventoryCheck
4. So sánh expected vs actual
```

### 4️⃣ **Báo Cáo (Dashboard)**
```
User: director@wh.com (Giám Đốc)
View:
- Tổng kho, lô, thùng, sản phẩm
- Tỷ lệ tồn kho vs đã xuất
- Lịch sử giao dịch
- Tồn kho theo lô
```

---

## 🚀 Test Ngay

### 1. **Xem Dashboard**
```
http://localhost:3000/dashboard
- Xem tổng quan 5 kho, 5 lô, 15 thùng, 150 SP
- Xem tỷ lệ tồn kho
- Xem lịch sử giao dịch
```

### 2. **Xem Thùng & QR**
```
http://localhost:3000/import
→ Tab "📦 Xem"
→ Chọn lô bất kỳ
→ Xem 15 thùng với QR code
→ In QR label
```

### 3. **Kiểm Kê**
```
http://localhost:3000/inventory
→ Quét QR sản phẩm
→ Xem 20 phiếu kiểm kê đã hoàn thành
```

### 4. **Xuất Hàng**
```
http://localhost:3000/export
→ Quét QR sản phẩm
→ Xem lịch sử 15 phiếu xuất
```

---

## 📝 Database Info

```
Database: PostgreSQL
Host: 116.118.49.243:13003
Database: quanlykho
Tables: 7
Total Records: 245+
```

**Breakdown:**
- users: 5
- warehouses: 5
- lots: 5
- boxes: 15
- products: 150
- stock_movements: 50
- inventory_checks: 20

---

## 🎨 5 Loại Sản Phẩm Đa Dạng

1. **Điện Tử** 🖥️
   - Laptop Dell XPS (chiếc)
   - Tivi Samsung (chiếc)

2. **Thực Phẩm** 🐟
   - Cá Hồi Na Uy (kg)

3. **Hóa Chất** ⚗️
   - Acid H2SO4 (lít)

4. **Dược Phẩm** 💊
   - Thuốc Paracetamol (chiếc)

---

## ✨ Kết Luận

✅ Dữ liệu đầy đủ cho toàn bộ quy trình quản lý kho
✅ 5 users với roles khác nhau
✅ 5 kho (1 tổng + 4 chuyên dụng)
✅ 150 sản phẩm thuộc 5 loại đa dạng
✅ Đầy đủ lịch sử nhập/xuất/kiểm kê
✅ Tất cả có QR code để test scan
✅ Ready for demo & testing! 🚀

---

**Ngày tạo:** 10/11/2025  
**Database:** PostgreSQL (Remote)  
**Status:** ✅ PRODUCTION READY
