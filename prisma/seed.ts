import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seed database...')
  
  // Xóa dữ liệu cũ
  await prisma.inventoryCheck.deleteMany({})
  await prisma.stockMovement.deleteMany({})
  await prisma.product.deleteMany({})
  await prisma.box.deleteMany({})
  await prisma.lot.deleteMany({})
  await prisma.warehouse.deleteMany({})
  await prisma.user.deleteMany({})
  
  // Tạo users
  const director = await prisma.user.create({
    data: {
      email: 'director@wh.com',
      name: 'Nguyễn Văn Giám Đốc',
      role: 'director',
      phone: '0901234567'
    }
  })
  
  const manager = await prisma.user.create({
    data: {
      email: 'manager@wh.com',
      name: 'Trần Thị Quản Lý',
      role: 'manager',
      phone: '0902345678'
    }
  })
  
  const staff1 = await prisma.user.create({
    data: {
      email: 'staff1@wh.com',
      name: 'Lê Văn Nhập',
      role: 'staff'
    }
  })
  
  const staff2 = await prisma.user.create({
    data: {
      email: 'staff2@wh.com',
      name: 'Phạm Thị Xuất',
      role: 'staff'
    }
  })
  
  const staff3 = await prisma.user.create({
    data: {
      email: 'staff3@wh.com',
      name: 'Hoàng Văn Kiểm',
      role: 'staff'
    }
  })
  
  console.log('✅ 5 users created')
  
  // Tạo kho
  const mainWh = await prisma.warehouse.create({
    data: { code: 'KHO-TONG', name: 'Kho Tổng', address: 'Q1, HCM', isActive: true }
  })
  
  const wh1 = await prisma.warehouse.create({
    data: { code: 'KHO-001', name: 'Kho Điện Tử', address: 'Gò Vấp, HCM', isActive: true }
  })
  
  const wh2 = await prisma.warehouse.create({
    data: { code: 'KHO-002', name: 'Kho Thực Phẩm', address: 'Bình Thạnh, HCM', isActive: true }
  })
  
  const wh3 = await prisma.warehouse.create({
    data: { code: 'KHO-003', name: 'Kho Hóa Chất', address: 'Bình Dương', isActive: true }
  })
  
  const wh4 = await prisma.warehouse.create({
    data: { code: 'KHO-004', name: 'Kho Dược Phẩm', address: 'Q5, HCM', isActive: true }
  })
  
  console.log('✅ 5 warehouses created')
  
  // Tạo lô
  const lot1 = await prisma.lot.create({
    data: { code: 'LOT-001', name: 'Lô Điện Tử Q1', warehouseId: wh1.id, createdById: staff1.id }
  })
  
  const lot2 = await prisma.lot.create({
    data: { code: 'LOT-002', name: 'Lô Thực Phẩm Q1', warehouseId: wh2.id, createdById: staff1.id }
  })
  
  const lot3 = await prisma.lot.create({
    data: { code: 'LOT-003', name: 'Lô Hóa Chất Q1', warehouseId: wh3.id, createdById: staff1.id }
  })
  
  const lot4 = await prisma.lot.create({
    data: { code: 'LOT-004', name: 'Lô Dược Phẩm Q1', warehouseId: wh4.id, createdById: staff1.id }
  })
  
  const lot5 = await prisma.lot.create({
    data: { code: 'LOT-005', name: 'Lô Tết 2025', warehouseId: mainWh.id, createdById: manager.id }
  })
  
  console.log('✅ 5 lots created')
  
  // Tạo thùng
  const boxes = []
  for (let i = 1; i <= 15; i++) {
    const lotId = i <= 3 ? lot1.id : i <= 5 ? lot2.id : i <= 6 ? lot3.id : i <= 10 ? lot4.id : lot5.id
    const box = await prisma.box.create({
      data: {
        code: `BOX-${String(i).padStart(3, '0')}`,
        qrCode: `QR-BOX-${i}-${Date.now()}`,
        name: `Thùng ${i}`,
        capacity: 100,
        lotId
      }
    })
    boxes.push(box)
  }
  
  console.log('✅ 15 boxes created')
  
  // Tạo 5 loại sản phẩm
  const productTypes = [
    'Laptop Dell XPS',
    'Cá Hồi Na Uy',
    'Acid H2SO4',
    'Thuốc Paracetamol',
    'Tivi Samsung'
  ]
  
  let count = 0
  for (const box of boxes) {
    for (let i = 0; i < 10; i++) {
      await prisma.product.create({
        data: {
          code: `PRD-${box.code}-${i+1}`,
          qrCode: `QR-PRD-${box.code}-${i+1}-${Date.now()}-${count}`,
          name: productTypes[i % 5],
          unit: i % 5 === 1 ? 'kg' : i % 5 === 2 ? 'lít' : 'chiếc',
          boxId: box.id,
          status: i < 7 ? 'in_stock' : 'exported'
        }
      })
      count++
    }
  }
  
  console.log(`✅ ${count} products created (5 types)`)
  
  // Tạo stock movements
  const products = await prisma.product.findMany({ take: 50 })
  for (const p of products) {
    await prisma.stockMovement.create({
      data: {
        type: p.status === 'exported' ? 'export' : 'import',
        quantity: Math.floor(Math.random() * 10) + 1,
        note: p.status === 'exported' ? 'Xuất kho' : 'Nhập kho',
        productId: p.id,
        boxId: p.boxId,
        userId: p.status === 'exported' ? staff2.id : staff1.id
      }
    })
  }
  
  console.log('✅ Stock movements created')
  
  // Tạo inventory checks
  const inStockProducts = await prisma.product.findMany({ where: { status: 'in_stock' }, take: 20 })
  for (const p of inStockProducts) {
    await prisma.inventoryCheck.create({
      data: {
        type: 'periodic',
        status: 'completed',
        expectedQty: 10,
        actualQty: 10,
        difference: 0,
        productId: p.id,
        checkedById: staff3.id,
        completedAt: new Date()
      }
    })
  }
  
  console.log('✅ 20 inventory checks created')
  console.log('\n✨ Seed completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
