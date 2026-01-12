/**
 * Seed Template: "Mạng trong mình Khát vọng"
 * Tạo block template giống 100% như hình với Tailwind brand colors
 */

import { getPrisma } from '../lib/prisma';

let prisma: Awaited<ReturnType<typeof getPrisma>>;

async function main() {
  console.log('🌱 Seeding Vision Template...');

  // Get Prisma client for current domain
  prisma = await getPrisma();
  console.log('✅ Connected to database');

  // Lấy admin user
  const adminUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: 'katachanneloffical@gmail.com' },
        { role: 'admin' }
      ]
    },
  });

  if (!adminUser) {
    console.error('❌ Admin user not found. Please create an admin user first.');
    return;
  }

  console.log(`✅ Found admin user: ${adminUser.email}`);

  // Xóa template cũ nếu có (tránh duplicate)
  await prisma.blockTemplate.deleteMany({
    where: {
      name: 'Mạng Trong Mình Khát Vọng'
    }
  });

  // Tạo template mới
  const template = await prisma.blockTemplate.create({
    data: {
      name: 'Mạng Trong Mình Khát Vọng',
      description: 'Template 3 cột hiển thị Sứ mệnh - Tầm nhìn - Giá trị cốt lõi với biểu tượng Target ở giữa',
      category: 'hero',
      published: true,
      authorId: adminUser.id,
      elements: {
        type: 'html',
        content: {
          html: `
<!-- Container chính -->
<div class="w-full bg-white py-16 px-4">
  <div class="max-w-7xl mx-auto">
    
    <!-- Tiêu đề trên "MẠNG TRONG MÌNH" -->
    <div class="text-center mb-4">
      <h2 class="text-brand-orange text-4xl font-normal tracking-wide">
        MẠNG TRONG MÌNH
      </h2>
    </div>
    
    <!-- Tiêu đề chính "KHÁT VỌNG" -->
    <div class="text-center mb-16">
      <h1 class="text-brand-blue text-7xl font-bold tracking-tight">
        KHÁT VỌNG
      </h1>
    </div>

    <!-- 3 Cột Layout -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
      
      <!-- Cột 1: SỨ MỆNH (Left) -->
      <div class="text-left space-y-4">
        <div>
          <h3 class="text-brand-orange text-3xl font-bold mb-2 border-b-2 border-brand-blue inline-block pb-1">
            SỨ MỆNH
          </h3>
        </div>
        <div class="space-y-1">
          <div class="w-24 h-0.5 bg-brand-blue mb-4"></div>
          <p class="text-gray-700 text-base leading-relaxed">
            Tạo dựng cuộc sống thịnh<br/>
            vượng hơn cho người người<br/>
            Việt Nam bằng việc khai<br/>
            phóng tiềm năng và giúp phát<br/>
            huy tối đa nội lực của mỗi cá<br/>
            nhân.
          </p>
        </div>
      </div>

      <!-- Cột 2: Target Icon (Center) -->
      <div class="flex justify-center items-center">
        <div class="relative w-80 h-80">
          <!-- Target circles với gradient -->
          <svg viewBox="0 0 400 400" class="w-full h-full">
            <!-- Outer ring - Light Blue -->
            <circle cx="200" cy="200" r="180" fill="none" stroke="#60A5FA" stroke-width="40" opacity="0.3"/>
            
            <!-- Middle ring - Blue -->
            <circle cx="200" cy="200" r="140" fill="none" stroke="#3B82F6" stroke-width="40" opacity="0.5"/>
            
            <!-- Inner ring - Dark Blue -->
            <circle cx="200" cy="200" r="100" fill="none" stroke="#2563EB" stroke-width="40" opacity="0.7"/>
            
            <!-- Center circle - Purple -->
            <circle cx="200" cy="200" r="60" fill="#6366F1"/>
            
            <!-- Bullseye center - White -->
            <circle cx="200" cy="200" r="30" fill="white"/>
            <circle cx="200" cy="200" r="15" fill="#6366F1"/>
            
            <!-- Arrow hitting target -->
            <g transform="translate(120, 80) rotate(-45 40 40)">
              <!-- Arrow shaft -->
              <line x1="0" y1="40" x2="60" y2="40" stroke="#3B82F6" stroke-width="4"/>
              <!-- Arrow head -->
              <polygon points="60,40 50,35 50,45" fill="#3B82F6"/>
              <!-- Arrow tail feathers -->
              <line x1="0" y1="35" x2="8" y2="40" stroke="#3B82F6" stroke-width="2"/>
              <line x1="0" y1="45" x2="8" y2="40" stroke="#3B82F6" stroke-width="2"/>
            </g>
            
            <!-- Decorative lines pointing to target -->
            <line x1="50" y1="150" x2="120" y2="180" stroke="#3B82F6" stroke-width="2"/>
            <line x1="80" y1="320" x2="140" y2="270" stroke="#3B82F6" stroke-width="2"/>
            <line x1="350" y1="250" x2="280" y2="230" stroke="#60A5FA" stroke-width="2"/>
          </svg>
        </div>
      </div>

      <!-- Cột 3: GIÁ TRỊ CỐT LÕI (Right) -->
      <div class="text-right space-y-4">
        <div class="flex justify-end">
          <h3 class="text-brand-blue text-2xl font-bold mb-2 border-b-2 border-brand-blue inline-block pb-1">
            GIÁ TRỊ CỐT LÕI
          </h3>
        </div>
        <div class="space-y-1 flex flex-col items-end">
          <div class="w-full h-0.5 bg-brand-blue mb-4"></div>
          <ul class="text-gray-700 text-base leading-relaxed list-none space-y-2">
            <li class="flex items-center justify-end gap-2">
              <span>Hệ thống</span>
              <span class="w-2 h-2 bg-brand-blue rounded-full"></span>
            </li>
            <li class="flex items-center justify-end gap-2">
              <span>Hợp nhất</span>
              <span class="w-2 h-2 bg-brand-blue rounded-full"></span>
            </li>
            <li class="flex items-center justify-end gap-2">
              <span>Từ tế</span>
              <span class="w-2 h-2 bg-brand-blue rounded-full"></span>
            </li>
          </ul>
        </div>
      </div>

    </div>

    <!-- Cột 4: TẦM NHÌN (Bottom - Full Width) -->
    <div class="mt-16 text-center space-y-4">
      <div class="flex justify-center">
        <h3 class="text-brand-orange text-3xl font-bold mb-2 border-b-2 border-brand-orange inline-block pb-1">
          TẦM NHÌN
        </h3>
      </div>
      <div class="w-24 h-0.5 bg-brand-orange mx-auto mb-4"></div>
      <p class="text-gray-700 text-base leading-relaxed max-w-3xl mx-auto">
        Trang bị cho mỗi người Việt Nam đủ sở hữu tư duy phát triển bản thân đúng đắn, hiệu quả và bền vững.
      </p>
    </div>

  </div>
</div>
          `.trim()
        },
        styles: {
          container: 'w-full bg-white'
        }
      },
      thumbnail: '/templates/vision-target.png', // Optional: Add screenshot later
    },
  });

  console.log(`✅ Created template: ${template.name}`);
  console.log(`   ID: ${template.id}`);
  console.log(`   Category: ${template.category}`);
  console.log(`   Published: ${template.published}`);
  console.log(`\n🎉 Vision template seeded successfully!`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
