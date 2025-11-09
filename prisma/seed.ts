import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Bắt đầu seed database...')

  // Tạo user demo
  const user = await prisma.user.upsert({
    where: { email: 'demo@warehouse.com' },
    update: {},
    create: {
      id: 'demo-user-id',
      email: 'demo@warehouse.com',
      name: 'Nhân viên Demo',
      role: 'staff',
      phone: '0123456789'
    }
  })
  console.log('✅ User demo:', user.name)

  // Tạo kho mẫu
  const warehouse = await prisma.warehouse.upsert({
    where: { code: 'KHO-001' },
    update: {},
    create: {
      code: 'KHO-001',
      name: 'Kho Trung Tâm',
      address: '123 Đường ABC, Quận 1, TP.HCM',
      description: 'Kho chính lưu trữ hàng hóa',
      isActive: true
    }
  })
  console.log('✅ Warehouse:', warehouse.name)

  console.log('✨ Seed database hoàn tất!')
}

main()
  .catch((e) => {
    console.error('❌ Lỗi seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
