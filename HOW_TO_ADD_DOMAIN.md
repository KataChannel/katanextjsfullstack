# 📝 Hướng Dẫn Thêm Domain Mới

## 🎯 Quick Guide - Thêm Domain Trong 5 Phút

### **Bước 1: Chuẩn bị thông tin domain**

Từ file `promt/domain.txt`, lấy thông tin domain mới:

```
[domain] : DATABASE_URL="[database_url]"
Mô Tả : [description]
Địa Chỉ Liên Hệ : [address]
Hotline : [hotline]
Email : [email]
```

**Ví dụ:**
```
innerbright.vn : DATABASE_URL="postgresql://postgres:postgres@116.118.48.208:5432/innerv2core"
Mô Tả : InnerBright Training & Coaching
Địa Chỉ Liên Hệ : TP. Hồ Chí Minh.
Hotline : 0908370968
Email : info@innerbright.vn
```

---

### **Bước 2: Chọn Port Development**

Port mapping hiện tại:
- 3000 → tazagroup.vn
- 3001 → tazaskinclinic.com
- 3002 → timona.edu.vn
- 3003 → hderma.vn
- 3004 → elasome.com
- **3005 → innerbright.vn** ← Port tiếp theo

**Port tiếp theo cho domain mới: 3006**

---

### **Bước 3: Cập nhật lib/domain-config.ts**

Thêm cấu hình domain mới vào `DOMAIN_CONFIGS`:

```typescript
// lib/domain-config.ts

export const DOMAIN_CONFIGS: Record<string, DomainConfig> = {
  // ... existing domains ...
  
  'innerbright.vn': {
    domain: 'innerbright.vn',
    database: 'postgresql://postgres:postgres@116.118.48.208:5432/innerv2core',
    description: 'InnerBright Training & Coaching, Cuộc sống của Bạn là do chính Bạn tạo ra và Lập Trình Ngôn Ngữ Tư Duy - NLP (Neuro Linguistic Programming)',
    address: 'TP. Hồ Chí Minh.',
    hotline: '0908370968',
    email: 'info@innerbright.vn',
    siteName: 'InnerBright',
    siteTitle: 'InnerBright - Training & Coaching NLP',
    devDomain: 'localhost',
    devPort: 3005, // Port cho development
  },
};
```

**Thêm port mapping:**

```typescript
const portMap: Record<string, string> = {
  '3000': 'tazagroup.vn',
  '3001': 'tazaskinclinic.com',
  '3002': 'timona.edu.vn',
  '3003': 'hderma.vn',
  '3004': 'elasome.com',
  '3005': 'innerbright.vn', // ← Thêm dòng này
};
```

---

### **Bước 4: Cập nhật package.json**

Thêm script dev cho domain mới:

```json
{
  "scripts": {
    "dev:tazagroup": "./scripts/bun-wrapper.sh bun --bun next dev -p 3000",
    "dev:tazaskin": "./scripts/bun-wrapper.sh bun --bun next dev -p 3001",
    "dev:timona": "./scripts/bun-wrapper.sh bun --bun next dev -p 3002",
    "dev:hderma": "./scripts/bun-wrapper.sh bun --bun next dev -p 3003",
    "dev:elasome": "./scripts/bun-wrapper.sh bun --bun next dev -p 3004",
    "dev:innerbright": "./scripts/bun-wrapper.sh bun --bun next dev -p 3005"
  }
}
```

---

### **Bước 5: Cập nhật scripts/dev-multi-domain.sh**

**5.1. Thêm vào DOMAINS array:**

```bash
declare -A DOMAINS
DOMAINS=(
    [1]="tazagroup:3000:tazagroup.vn"
    [2]="tazaskin:3001:tazaskinclinic.com"
    [3]="timona:3002:timona.edu.vn"
    [4]="hderma:3003:hderma.vn"
    [5]="elasome:3004:elasome.com"
    [6]="innerbright:3005:innerbright.vn" # ← Thêm dòng này
)
```

**5.2. Cập nhật menu:**

```bash
echo "  1) TazaGroup      - http://localhost:3000 (tazagroup.vn)"
echo "  2) TazaSkin       - http://localhost:3001 (tazaskinclinic.com)"
echo "  3) Timona         - http://localhost:3002 (timona.edu.vn)"
echo "  4) HDerma         - http://localhost:3003 (hderma.vn)"
echo "  5) Elasome        - http://localhost:3004 (elasome.com)"
echo "  6) InnerBright    - http://localhost:3005 (innerbright.vn)" # ← Thêm
echo "  7) All domains    - Run all domains simultaneously"
echo "  0) Exit"
echo ""
echo -n "Nhập lựa chọn [0-7]: " # ← Đổi từ [0-6] thành [0-7]
```

**5.3. Cập nhật case statement:**

```bash
case $choice in
    0)
        echo -e "${YELLOW}Thoát...${NC}"
        exit 0
        ;;
    1|2|3|4|5|6) # ← Thêm |6
        IFS=':' read -r name port domain <<< "${DOMAINS[$choice]}"
        # ... existing code ...
        ;;
    7) # ← Đổi từ 6 thành 7 cho "All domains"
```

**5.4. Thêm vào run all domains:**

```bash
NEXT_PUBLIC_DOMAIN=innerbright.vn ./scripts/bun-wrapper.sh bun --bun next dev -p 3005 &
PID6=$!

# Cập nhật trap
trap "kill $PID1 $PID2 $PID3 $PID4 $PID5 $PID6 2>/dev/null; ..." INT
```

---

### **Bước 6: Cập nhật scripts/fix-all-databases.sh**

Thêm database mới:

```bash
declare -A DATABASES
DATABASES=(
    [tazagroup]="postgresql://postgres:postgres@116.118.49.243:13003/tazagroupvn"
    [tazaskin]="postgresql://postgres:postgres@116.118.49.243:13003/tazaskinclinic"
    [timona]="postgresql://postgres:postgres@116.118.49.243:13003/timona"
    [hderma]="postgresql://postgres:postgres@116.118.49.243:13003/hderma"
    [elasome]="postgresql://postgres:postgres@116.118.49.243:13003/elasome"
    [innerbright]="postgresql://postgres:postgres@116.118.48.208:5432/innerv2core"
)
```

---

### **Bước 7: Push Schema & Test**

```bash
# Fix database cho domain mới
bun run fix:databases

# Clear cache
rm -rf .next .turbo

# Test domain mới
bun run dev:innerbright

# Hoặc test qua menu
bun run dev
# Chọn số 6 (InnerBright)
```

---

## 📋 Checklist Thêm Domain Mới

- [ ] **Lấy thông tin** từ `promt/domain.txt`
- [ ] **Chọn port** development (port tiếp theo)
- [ ] **Cập nhật** `lib/domain-config.ts`:
  - [ ] Thêm vào `DOMAIN_CONFIGS`
  - [ ] Thêm vào `portMap`
- [ ] **Cập nhật** `package.json`:
  - [ ] Thêm script `dev:[domain]`
- [ ] **Cập nhật** `scripts/dev-multi-domain.sh`:
  - [ ] Thêm vào `DOMAINS` array
  - [ ] Cập nhật menu display
  - [ ] Cập nhật case statement
  - [ ] Thêm vào "All domains" section
- [ ] **Cập nhật** `scripts/fix-all-databases.sh`:
  - [ ] Thêm database URL
- [ ] **Test**:
  - [ ] `bun run fix:databases`
  - [ ] `bun run dev:[domain]`
  - [ ] Truy cập `http://localhost:[port]`

---

## 🚀 Template Copy-Paste

### Template cho domain-config.ts:

```typescript
'[domain]': {
  domain: '[domain]',
  database: '[database_url]',
  description: '[description]',
  address: '[address]',
  hotline: '[hotline]',
  email: '[email]',
  siteName: '[Site Name]',
  siteTitle: '[Site Title]',
  devDomain: 'localhost',
  devPort: [port],
},
```

### Template cho dev-multi-domain.sh:

```bash
# DOMAINS array
[N]="[shortname]:[port]:[domain]"

# Menu
echo "  [N]) [Name]       - http://localhost:[port] ([domain])"

# Case
[N-1]|[N]) # Update previous line
```

### Template cho fix-all-databases.sh:

```bash
[[shortname]]="[database_url]"
```

---

## 💡 Tips

1. **Port luôn tăng dần**: 3000, 3001, 3002, ...
2. **Site Name ngắn gọn**: "InnerBright" thay vì "InnerBright Training & Coaching"
3. **Shortname lowercase**: innerbright, tazaskin, ...
4. **Test ngay sau khi thêm**: `bun run dev:[domain]`

---

## 🔧 Troubleshooting

### Database chưa có schema?
```bash
bun run fix:databases
```

### Port đã được sử dụng?
```bash
# Kill process trên port
lsof -ti:3005 | xargs kill -9

# Hoặc chọn port khác
```

### Domain không hoạt động?
```bash
# Clear cache
rm -rf .next .turbo

# Restart dev server
bun run dev:[domain]
```

---

**Hoàn tất! Domain mới đã sẵn sàng sử dụng.** 🎉
